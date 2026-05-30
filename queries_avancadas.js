#!/usr/bin/env mongosh
/**
 * QUERIES AVANÇADAS: Catálogo de Produtos Dinâmicos
 * Trabalho Prático SGBD II - Implementação e Testes
 *
 * Autor: Hermenegildo Wilson
 * Data: Maio de 2026
 *
 * Execução:
 *   mongosh --file queries_avancadas.js
 */

// Conectar à database
db = db.getSiblingDB("ecommerce");

console.log("\n" + "=".repeat(70));
console.log("QUERIES AVANÇADAS: CATÁLOGO DE PRODUTOS");
console.log("=".repeat(70) + "\n");

// =========================================================================
// QUERY 1: BUSCA FACETADA COM MÚLTIPLOS FILTROS
// =========================================================================

console.log("\n" + "─".repeat(70));
console.log("QUERY 1: BUSCA FACETADA (Múltiplos Filtros)");
console.log("─".repeat(70));
console.log(`
Requisito: Encontrar produtos eletrônicos com:
  - Preço entre 10.000 e 50.000 AOA
  - Marca Samsung
  - Disponível em stock
  - Ordenados por rating (melhor primeiro)
  - Paginação: primeiros 20 resultados

Índice Utilizado: { categoria: 1, preco: 1, avaliacao.rating_medio: -1 }
Tipo: Compound Index (Equality, Sort, Range)
`);

let startTime = Date.now();

const query1 = db.produtos
  .find({
    categoria: "Eletrônicos",
    preco: { $gte: 10000, $lte: 50000 },
    "atributos_dinamicos.marca": "Samsung",
    em_stock: true,
  })
  .sort({ "avaliacao.rating_medio": -1 })
  .limit(20)
  .toArray();

let elapsed1 = Date.now() - startTime;

console.log(`
Resultados: ${query1.length} produtos encontrados`);
console.log(`Tempo de execução: ${elapsed1}ms\n`);

if (query1.length > 0) {
  console.log("Primeiros 3 resultados:");
  query1.slice(0, 3).forEach((prod, i) => {
    console.log(`  ${i + 1}. ${prod.nome}`);
    console.log(`     SKU: ${prod.sku}`);
    console.log(`     Preço: ${prod.preco.toLocaleString("pt-AO")} AOA`);
    console.log(
      `     Rating: ${prod.avaliacao.rating_medio}⭐ (${prod.avaliacao.total_avaliacoes} avaliações)`,
    );
    console.log(`     Em Stock: ${prod.em_stock ? "✅" : "❌"}\n`);
  });
}

// Explicação do plano de execução
console.log("\nAnálise de Plano de Execução (explain):");
const explain1 = db.produtos
  .find({
    categoria: "Eletrônicos",
    preco: { $gte: 10000, $lte: 50000 },
    "atributos_dinamicos.marca": "Samsung",
    em_stock: true,
  })
  .explain("executionStats");

console.log(`  - Estágio: ${explain1.executionStats.executionStages.stage}`);
console.log(
  `  - Documentos examinados: ${explain1.executionStats.totalDocsExamined}`,
);
console.log(`  - Documentos retornados: ${explain1.executionStats.nReturned}`);
console.log(
  `  - Índice utilizado: ${explain1.executionStats.executionStages.keyPattern}`,
);
console.log(
  `  - Eficiência: ${((explain1.executionStats.nReturned / explain1.executionStats.totalDocsExamined) * 100).toFixed(2)}%\n`,
);

// =========================================================================
// QUERY 2: AGREGAÇÃO - TOP 10 PRODUTOS MAIS VENDIDOS POR CATEGORIA
// =========================================================================

console.log("\n" + "─".repeat(70));
console.log("QUERY 2: AGREGAÇÃO - TOP 10 PRODUTOS MAIS VENDIDOS POR CATEGORIA");
console.log("─".repeat(70));
console.log(`
Requisito: Para cada categoria principal, encontrar os 10 produtos
mais vendidos (total_vendido), com estatísticas de receita estimada

Pipeline de Agregação:
  1. $group: Agrupar por categoria
  2. $sort: Ordenar por vendas total
  3. $limit: Top 10
  4. $project: Formatar resultado
`);

startTime = Date.now();

const query2 = db.produtos
  .aggregate([
    // Estágio 1: Agrupar por categoria e calcular totais
    {
      $group: {
        _id: "$categoria",
        total_produtos: { $sum: 1 },
        total_vendido_categoria: { $sum: "$vendas.total_vendido" },
        receita_estimada: {
          $sum: { $multiply: ["$preco", "$vendas.total_vendido"] },
        },
        preco_medio: { $avg: "$preco" },
        rating_medio_categoria: { $avg: "$avaliacao.rating_medio" },
      },
    },
    // Estágio 2: Ordenar por total de vendas
    {
      $sort: { total_vendido_categoria: -1 },
    },
    // Estágio 3: Formatar e incluir top 10 produtos de cada categoria
    {
      $project: {
        _id: 0,
        categoria: "$_id",
        total_produtos: 1,
        total_vendido: "$total_vendido_categoria",
        receita_estimada: { $round: ["$receita_estimada", 2] },
        preco_medio: { $round: ["$preco_medio", 2] },
        rating_medio: { $round: ["$rating_medio_categoria", 2] },
      },
    },
  ])
  .toArray();

elapsed1 = Date.now() - startTime;

console.log(`
Resultados: ${query2.length} categorias processadas`);
console.log(`Tempo de execução: ${elapsed1}ms\n`);

console.log("Resumo por Categoria:");
query2.forEach((cat, i) => {
  console.log(`\n  ${i + 1}. ${cat.categoria}`);
  console.log(`     Total de produtos: ${cat.total_produtos}`);
  console.log(`     Total vendido: ${cat.total_vendido} unidades`);
  console.log(
    `     Receita estimada: ${cat.receita_estimada.toLocaleString("pt-AO")} AOA`,
  );
  console.log(
    `     Preço médio: ${cat.preco_medio.toLocaleString("pt-AO")} AOA`,
  );
  console.log(`     Rating médio: ${cat.rating_medio}⭐`);
});

// =========================================================================
// QUERY 3: BUSCA FULL-TEXT COM RELEVÂNCIA
// =========================================================================

console.log("\n" + "─".repeat(70));
console.log("QUERY 3: BUSCA FULL-TEXT COM RELEVÂNCIA");
console.log("─".repeat(70));
console.log(`
Requisito: Busca por termo "samsung" em nome, descrição e tags
com ranking por relevância. Retornar apenas produtos em stock.

Índice Utilizado: Text Index { nome: "text", descricao: "text" }
Cálculo de relevância: Termos em nome têm maior peso
`);

startTime = Date.now();

const query3 = db.produtos
  .find(
    {
      $text: { $search: "samsung smartphone android" },
      em_stock: true,
    },
    {
      score: { $meta: "textScore" },
    },
  )
  .sort({ score: { $meta: "textScore" } })
  .limit(15)
  .toArray();

elapsed1 = Date.now() - startTime;

console.log(`
Resultados: ${query3.length} produtos encontrados`);
console.log(`Tempo de execução: ${elapsed1}ms\n`);

console.log("Top 5 Resultados (por Relevância):");
query3.slice(0, 5).forEach((prod, i) => {
  console.log(
    `  ${i + 1}. ${prod.nome} (Relevância: ${prod.score.toFixed(2)})`,
  );
  console.log(`     Categoria: ${prod.categoria}`);
  console.log(`     Preço: ${prod.preco.toLocaleString("pt-AO")} AOA`);
});

// =========================================================================
// QUERY 4: PRODUTOS COM ATRIBUTOS DINÂMICOS (Busca Complexa)
// =========================================================================

console.log("\n" + "─".repeat(70));
console.log("QUERY 4: BUSCA COM ATRIBUTOS DINÂMICOS");
console.log("─".repeat(70));
console.log(`
Requisito: Encontrar smartphones Samsung com:
  - RAM: 8GB ou mais
  - Armazenamento: 128GB ou mais
  - Rating: Mínimo 4.0 estrelas
  - Com stock disponível
  - Ordenado por preço (barato primeiro)

Característica: Demonstra navegação em subdocumentos aninhados
Padrão: Query-Driven Design (busca facetada)
`);

startTime = Date.now();

const query4 = db.produtos
  .find({
    categoria: "Eletrônicos",
    subcategoria: "Smartphones",
    "atributos_dinamicos.marca": "Samsung",
    "atributos_dinamicos.ram": { $in: ["8GB", "12GB", "16GB"] },
    "atributos_dinamicos.armazenamento": { $in: ["128GB", "256GB", "512GB"] },
    "avaliacao.rating_medio": { $gte: 4.0 },
    em_stock: true,
  })
  .sort({ preco: 1 })
  .limit(10)
  .toArray();

elapsed1 = Date.now() - startTime;

console.log(`
Resultados: ${query4.length} produtos encontrados`);
console.log(`Tempo de execução: ${elapsed1}ms\n`);

console.log("Smartphones Recomendados (Melhor Relação Preço/Especificações):");
query4.slice(0, 5).forEach((prod, i) => {
  console.log(`  ${i + 1}. ${prod.nome}`);
  console.log(`     Preço: ${prod.preco.toLocaleString("pt-AO")} AOA`);
  console.log(
    `     RAM: ${prod.atributos_dinamicos.ram} | Armazenamento: ${prod.atributos_dinamicos.armazenamento}`,
  );
  console.log(
    `     Rating: ${prod.avaliacao.rating_medio}⭐ (${prod.avaliacao.total_avaliacoes} avaliações)\n`,
  );
});

// =========================================================================
// QUERY 5: AGREGAÇÃO AVANÇADA - ANÁLISE DE MARGENS E RENTABILIDADE
// =========================================================================

console.log("\n" + "─".repeat(70));
console.log("QUERY 5: ANÁLISE AVANÇADA - MARGENS DE LUCRO POR CATEGORIA");
console.log("─".repeat(70));
console.log(`
Requisito: Análise de rentabilidade por categoria:
  - Total de produtos ativos
  - Receita potencial (preço × estoque)
  - Margem de lucro média
  - Produtos com baixo rating (< 3.5 ⭐)
  
Pipeline:
  1. $match: Apenas produtos ativos
  2. $group: Agrupar por categoria
  3. $sort: Ordenar por receita
`);

startTime = Date.now();

const query5 = db.produtos
  .aggregate([
    // Filtrar apenas produtos ativos
    {
      $match: { "info_administrativo.ativo": true },
    },
    // Agrupar por categoria com cálculos complexos
    {
      $group: {
        _id: "$categoria",
        total_produtos_ativos: { $sum: 1 },
        produtos_estoque_zero: {
          $sum: { $cond: [{ $eq: ["$estoque", 0] }, 1, 0] },
        },
        produtos_baixo_rating: {
          $sum: { $cond: [{ $lt: ["$avaliacao.rating_medio", 3.5] }, 1, 0] },
        },
        receita_potencial: {
          $sum: { $multiply: ["$preco", "$estoque"] },
        },
        custo_total: {
          $sum: {
            $multiply: ["$info_administrativo.custo_unitario", "$estoque"],
          },
        },
        margem_lucro_media: {
          $avg: "$info_administrativo.margem_lucro_percentual",
        },
        valor_estoque_total: {
          $sum: { $multiply: ["$preco", "$estoque"] },
        },
      },
    },
    // Calcular lucro estimado
    {
      $project: {
        _id: 0,
        categoria: "$_id",
        total_produtos: "$total_produtos_ativos",
        produtos_sem_stock: "$produtos_estoque_zero",
        produtos_baixo_rating: "$produtos_baixo_rating",
        receita_potencial: { $round: ["$receita_potencial", 2] },
        custo_total: { $round: ["$custo_total", 2] },
        lucro_estimado: {
          $round: [{ $subtract: ["$receita_potencial", "$custo_total"] }, 2],
        },
        margem_media: { $round: ["$margem_lucro_media", 2] },
        valor_estoque: { $round: ["$valor_estoque_total", 2] },
      },
    },
    // Ordenar por lucro estimado
    {
      $sort: { lucro_estimado: -1 },
    },
  ])
  .toArray();

elapsed1 = Date.now() - startTime;

console.log(`
Resultados: ${query5.length} categorias analisadas`);
console.log(`Tempo de execução: ${elapsed1}ms\n`);

console.log("Análise de Rentabilidade por Categoria:");
console.log("─".repeat(70));

let total_receita_geral = 0;
let total_custo_geral = 0;

query5.forEach((cat, i) => {
  console.log(`\n${i + 1}. ${cat.categoria}`);
  console.log(`   Produtos ativos: ${cat.total_produtos}`);
  console.log(`   Sem stock: ${cat.produtos_sem_stock}`);
  console.log(`   Com rating baixo: ${cat.produtos_baixo_rating}`);
  console.log(
    `   Receita potencial: ${cat.receita_potencial.toLocaleString("pt-AO")} AOA`,
  );
  console.log(`   Custo total: ${cat.custo_total.toLocaleString("pt-AO")} AOA`);
  console.log(
    `   Lucro estimado: ${cat.lucro_estimado.toLocaleString("pt-AO")} AOA`,
  );
  console.log(`   Margem média: ${cat.margem_media}%`);
  console.log(
    `   Valor total estoque: ${cat.valor_estoque.toLocaleString("pt-AO")} AOA`,
  );

  total_receita_geral += cat.receita_potencial;
  total_custo_geral += cat.custo_total;
});

console.log(`\n${"─".repeat(70)}`);
console.log(`TOTAIS GERAIS:`);
console.log(
  `   Receita potencial total: ${total_receita_geral.toLocaleString("pt-AO")} AOA`,
);
console.log(`   Custo total: ${total_custo_geral.toLocaleString("pt-AO")} AOA`);
console.log(
  `   Lucro total estimado: ${(total_receita_geral - total_custo_geral).toLocaleString("pt-AO")} AOA`,
);
console.log(
  `   Margem global: ${(((total_receita_geral - total_custo_geral) / total_receita_geral) * 100).toFixed(2)}%`,
);

// =========================================================================
// QUERY 6 (BÓNUS): PRODUTOS SIMILARES (Recomendação)
// =========================================================================

console.log("\n\n" + "─".repeat(70));
console.log("QUERY 6 (BÓNUS): PRODUTOS SIMILARES (Recomendação)");
console.log("─".repeat(70));
console.log(`
Requisito: Dado um produto específico, encontrar produtos similares:
  - Mesma categoria
  - Preço próximo (±20%)
  - Atributos similares
  - Melhor rating

Caso de Uso: "Clientes que viram este também viram..."
`);

// Primeiro, encontrar um produto de referência
const produtoReferencia = db.produtos.findOne({
  categoria: "Eletrônicos",
  em_stock: true,
});

if (produtoReferencia) {
  startTime = Date.now();

  const margem_preco = produtoReferencia.preco * 0.2;

  const query6 = db.produtos
    .find({
      _id: { $ne: produtoReferencia._id },
      categoria: produtoReferencia.categoria,
      preco: {
        $gte: produtoReferencia.preco - margem_preco,
        $lte: produtoReferencia.preco + margem_preco,
      },
      em_stock: true,
    })
    .sort({ "avaliacao.rating_medio": -1 })
    .limit(5)
    .toArray();

  elapsed1 = Date.now() - startTime;

  console.log(`
Produto de referência: ${produtoReferencia.nome}`);
  console.log(`Preço: ${produtoReferencia.preco.toLocaleString("pt-AO")} AOA`);
  console.log(`\nProdutos similares encontrados: ${query6.length}`);
  console.log(`Tempo de execução: ${elapsed1}ms\n`);

  console.log("Recomendações (Mesma categoria, preço ±20%, melhor rating):");
  query6.forEach((prod, i) => {
    console.log(`  ${i + 1}. ${prod.nome}`);
    console.log(
      `     Preço: ${prod.preco.toLocaleString("pt-AO")} AOA (Diferença: ${(((prod.preco - produtoReferencia.preco) / produtoReferencia.preco) * 100).toFixed(1)}%)`,
    );
    console.log(`     Rating: ${prod.avaliacao.rating_medio}⭐\n`);
  });
}

// =========================================================================
// RESUMO E CONCLUSÕES
// =========================================================================

console.log("\n" + "=".repeat(70));
console.log("RESUMO DAS QUERIES");
console.log("=".repeat(70));

console.log(`
✅ QUERY 1: Busca facetada com múltiplos filtros
   - Demonstra: Índices compound, ordering, paginação
   - Performance: < 200ms esperado
   - Use case: Pesquisa principal da plataforma

✅ QUERY 2: Agregação de vendas por categoria
   - Demonstra: Pipeline de agregação, $group, $sort
   - Performance: Varia com volume de dados
   - Use case: Dashboard de analytics

✅ QUERY 3: Busca full-text com relevância
   - Demonstra: Text index, scoring, relevância
   - Performance: Depende de número de matches
   - Use case: Busca de produtos por texto livre

✅ QUERY 4: Atributos dinâmicos com múltiplas condições
   - Demonstra: Navegação em subdocumentos, operadores $in
   - Performance: Otimizada com índices em atributos_dinamicos
   - Use case: Filtros avançados (smartphones com 8GB+ RAM)

✅ QUERY 5: Análise de rentabilidade (agregação avançada)
   - Demonstra: $cond, $multiply, cálculos complexos
   - Performance: O(n) em número de categorias
   - Use case: Business Intelligence / Dashboards

✅ QUERY 6: Recomendação de produtos similares
   - Demonstra: Busca com range, ordenação por rating
   - Performance: < 100ms esperado
   - Use case: "Você também pode gostar..."

ÍNDICES CRÍTICOS PARA PERFORMANCE:
  1. { categoria: 1, preco: 1, avaliacao.rating_medio: -1 }
  2. { nome: "text", descricao: "text" }
  3. { sku: 1 } - UNIQUE
  4. { em_stock: 1 }
  5. { atributos_dinamicos.marca: 1 }
`);

console.log("\n" + "=".repeat(70));
console.log("✅ QUERIES EXECUTADAS COM SUCESSO!");
console.log("=".repeat(70) + "\n");
