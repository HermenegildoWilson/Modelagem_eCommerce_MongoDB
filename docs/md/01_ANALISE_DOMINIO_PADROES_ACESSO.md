# 📊 ANÁLISE DO DOMÍNIO E PADRÕES DE ACESSO
## Catálogo de Produtos Dinâmicos com Pesquisa Facetada

**Preparado por:** Américo Malungo Sebastião Miguel  
**Data:** Maio de 2026  
**Disciplina:** SGBD II  

---

## 1. CONTEXTO E PROBLEMA

### 1.1 Cenário Real
Uma plataforma de **e-commerce de alta escala** precisa gerenciar um catálogo dinâmico de produtos com as seguintes características:

- **Volume:** Potencial de milhões de produtos (SKUs)
- **Heterogeneidade:** Produtos em múltiplas categorias (eletrônicos, vestuário, livros, alimentos, etc.) com atributos completamente distintos
- **Frequência de Acesso:** Predominância de leituras (95%) vs. escritas (5%)
- **Latência Aceitável:** Sub-segundo para buscas (P99 < 500ms)
- **Disponibilidade:** Alta disponibilidade 24/7 com tolerância a falhas

### 1.2 Limitações do Modelo Relacional Tradicional
Uma base de dados relacional tradicional (como PostgreSQL, MySQL) enfrentaria:

| Problema | Impacto |
|----------|--------|
| **Schema Rígido** | Impossível ter atributos variáveis por categoria sem EAV ou múltiplas tabelas |
| **Normalização Extrema** | Joins complexos (produto → atributos → categorias) = latência alta |
| **Escalabilidade Vertical** | Particionamento horizontal (sharding) é complexo em SGBD relacionais |
| **Atributos Dinâmicos** | Alterações de schema exigem migrações custosas (ALTER TABLE) |

---

## 2. ANÁLISE DE REQUISITOS

### 2.1 Requisitos Funcionais

#### RF1: Gestão de Catálogo
- Criar, ler, atualizar e desativar produtos
- Suportar múltiplas categorias e subcategorias
- Permite atributos dinâmicos (variam por categoria)
- Histórico de alterações (para auditoria)

#### RF2: Pesquisa e Filtragem
- Busca por texto (nome, descrição, SKU)
- Filtros facetados em múltiplas dimensões:
  - Categoria, subcategoria
  - Faixa de preço
  - Marca, cor, tamanho (atributos variáveis)
  - Ratings (avaliação de clientes)
  - Disponibilidade em stock
- Ordenação por: relevância, preço, ratings, novidade
- Paginação eficiente

#### RF3: Recomendações Relacionadas
- Produtos similares (mesma categoria, atributos próximos)
- Produtos frequentemente comprados juntos

#### RF4: Performance em Larga Escala
- Tempo de resposta < 500ms para 95% das queries
- Suporte para picos de tráfego (Black Friday, Cyber Monday)
- Indexação otimizada

### 2.2 Requisitos Não-Funcionais

| Requisito | Especificação |
|-----------|---------------|
| **Escalabilidade Horizontal** | Suportar crescimento de 100x em volume de dados e tráfego |
| **Disponibilidade** | 99.9% uptime (máx. 43 minutos/mês de downtime) |
| **Consistência** | Consistência eventual é aceitável (lê-se dados replicados levemente desatualizados) |
| **Tolerância a Partições** | Continuar operacional mesmo com falha de nó |
| **Latência P99** | < 500ms para queries de busca comuns |
| **Throughput** | Mínimo 10k reads/segundo |

---

## 3. PADRÕES DE ACESSO (QUERY-DRIVEN DESIGN)

### 3.1 Distribuição de Acessos
```
Operação              Frequência    % do Total    Latência Esperada
─────────────────────────────────────────────────────────────────
Busca Facetada        500 req/s       60%         < 200ms
Detalhe Produto       300 req/s       20%         < 100ms
Produtos Similares    100 req/s       10%         < 300ms
Update Stock           80 req/s         5%         < 500ms
Create/Update Prod     20 req/s         5%         < 1s
───────────────────────────────────────────────────────────────────
TOTAL                 1000 req/s     100%
```

### 3.2 Padrões de Leitura (95% do tráfego)

#### **Padrão 1: Busca Facetada (60% do tráfego)**
```javascript
// Query típica de busca facetada
db.produtos.find({
  categoria: "Eletrônicos",
  preco: { $gte: 5000, $lte: 50000 },
  atributos_dinamicos: { marcaAtributo: "Samsung" },
  em_stock: true,
  rating: { $gte: 4.0 }
})
.sort({ rating: -1, data_criacao: -1 })
.limit(20)
.skip(0)
```

**Características:**
- Múltiplos filtros (2-5 condições)
- Combinações diferentes de filtros a cada query
- Paginação necessária

#### **Padrão 2: Detalhe de Produto (20% do tráfego)**
```javascript
// Query por ID ou SKU
db.produtos.findOne({ _id: ObjectId("...") })
// ou
db.produtos.findOne({ sku: "ELE-SAMSUNG-123" })
```

**Características:**
- Query simples por ID primário
- Deve ser muito rápida (< 100ms)

#### **Padrão 3: Produtos Similares (10% do tráfego)**
```javascript
// Encontrar produtos da mesma categoria + atributos similares
db.produtos.find({
  categoria: "Eletrônicos",
  subcategoria: "Smartphones",
  preco: { $gte: preco_atual - 10000, $lte: preco_atual + 10000 },
  _id: { $ne: product_id_atual }
})
.sort({ rating: -1 })
.limit(5)
```

**Características:**
- Filtra por categoria + faixa de preço
- Retorna poucos documentos (5-10)

#### **Padrão 4: Agregações Analíticas (< 5% do tráfego)**
```javascript
// Produtos mais vendidos por categoria
db.pedidos.aggregate([
  { $unwind: "$itens" },
  { $match: { "itens.categoria": "Eletrônicos" } },
  { $group: { 
    _id: "$itens.produto_id", 
    vendas_totais: { $sum: "$itens.quantidade" },
    receita: { $sum: { $multiply: ["$itens.preco", "$itens.quantidade"] } }
  }},
  { $sort: { vendas_totais: -1 } },
  { $limit: 10 }
])
```

### 3.3 Padrões de Escrita (5% do tráfego)

#### **Padrão 5: Update de Stock**
```javascript
// Decrementar stock após venda (operação atômica crítica)
db.produtos.updateOne(
  { _id: ObjectId("..."), estoque: { $gte: 1 } },
  { $inc: { estoque: -1 }, $set: { data_atualizacao: new Date() } }
)
```

**Características:**
- Operação crítica (atomicidade)
- Baixa latência necessária
- Pode gerar contenção com múltiplas vendas do mesmo produto

#### **Padrão 6: Criar/Atualizar Produto**
```javascript
// Admin insere novo produto
db.produtos.insertOne({
  sku: "ELE-SAMSUNG-A50",
  nome: "Samsung Galaxy A50",
  categoria: "Eletrônicos",
  subcategoria: "Smartphones",
  preco: 35000,
  atributos_dinamicos: {
    marca: "Samsung",
    cor: "Preto",
    armazenamento: "64GB",
    ram: "4GB",
    tela: "6.4 polegadas"
  },
  descricao: "...",
  imagens: ["url1", "url2"],
  estoque: 100,
  em_stock: true,
  rating: 0,
  reviews_count: 0,
  data_criacao: new Date(),
  ativo: true
})
```

---

## 4. DISTRIBUIÇÃO DE DADOS POR CATEGORIA

Para garantir realismo, o catálogo será populado com produtos de **5 categorias principais**:

### 4.1 Categorias e Atributos Dinâmicos

| Categoria | Atributos Dinâmicos | Quantidade de Produtos |
|-----------|-------------------|------------------------|
| **Eletrônicos** | marca, modelo, armazenamento, RAM, tipo_bateria, conectividade | 20,000 |
| **Vestuário** | marca, tamanho, cor, material, estação, género | 30,000 |
| **Livros** | autor, editora, género, ano_publicacao, idioma, formato | 15,000 |
| **Casa e Cozinha** | marca, material, cor, dimensões, capacidade | 20,000 |
| **Desportos** | marca, modalidade, tamanho, peso, material, cor | 15,000 |
| **TOTAL** | | **100,000 produtos** |

### 4.2 Exemplo: Estrutura de Eletrônicos vs. Vestuário

**Eletrônicos:**
```json
{
  "categoria": "Eletrônicos",
  "subcategoria": "Smartphones",
  "atributos_dinamicos": {
    "marca": "Samsung",
    "modelo": "Galaxy A50",
    "armazenamento": "64GB",
    "ram": "4GB",
    "sistema_operativo": "Android 13",
    "tipo_bateria": "Li-Ion 4000mAh"
  }
}
```

**Vestuário:**
```json
{
  "categoria": "Vestuário",
  "subcategoria": "T-shirts",
  "atributos_dinamicos": {
    "marca": "Nike",
    "tamanho": "M",
    "cor": "Azul",
    "material": "Algodão 100%",
    "estação": "Verão",
    "género": "Masculino"
  }
}
```

---

## 5. MODELO CONCEITUAL

### 5.1 Diagrama de Entidades (Conceitual)

```
┌─────────────────────────┐
│      PRODUTOS           │
├─────────────────────────┤
│ _id (PK)                │
│ sku (UNIQUE)            │
│ nome                    │
│ descricao               │
│ categoria (FK)          │
│ subcategoria            │
│ preco                   │
│ estoque                 │
│ atributos_dinamicos     │ ← FLEXÍVEL POR CATEGORIA
│ imagens[]               │
│ rating                  │
│ reviews_count           │
│ data_criacao            │
│ data_atualizacao        │
│ ativo                   │
└─────────────────────────┘
         │
         │ (Referência)
         ▼
┌─────────────────────────┐
│     CATEGORIAS          │
├─────────────────────────┤
│ _id (PK)                │
│ nome                    │
│ descricao               │
│ icone_url               │
│ atributos_esperados[]   │
└─────────────────────────┘
```

---

## 6. JUSTIFICATIVA DA ESCOLHA: POR QUE NÃO RELACIONAL?

### 6.1 Problema: Schema Rígido
**SGBD Relacional** exigiria:
```sql
-- Opção 1: Coluna para cada atributo (impossível com 100+ atributos variáveis)
CREATE TABLE produtos (
  id INT,
  nome VARCHAR(255),
  preco DECIMAL(10,2),
  cor VARCHAR(50),        -- Só para vestuário
  tamanho VARCHAR(10),    -- Só para vestuário/desportos
  marca VARCHAR(100),     -- Para eletrônicos
  ram VARCHAR(50),        -- Só para eletrônicos
  -- ... 100+ colunas ???
);

-- Opção 2: Entity-Attribute-Value (EAV) → Joins complexos
CREATE TABLE atributos (
  produto_id INT,
  atributo_nome VARCHAR(50),
  atributo_valor VARCHAR(255)
);
```

**MongoDB** resolve elegantemente:
```javascript
db.produtos.insertOne({
  nome: "Samsung Galaxy A50",
  atributos_dinamicos: {
    marca: "Samsung",
    ram: "4GB",
    armazenamento: "64GB"
  }
})
```

### 6.2 Problema: Joins Custosos
Para busca facetada em SGBD relacional:
```sql
SELECT p.* 
FROM produtos p
JOIN categorias c ON p.categoria_id = c.id
WHERE c.nome = 'Eletrônicos'
  AND p.preco BETWEEN 5000 AND 50000
  AND p.estoque > 0
ORDER BY p.rating DESC
LIMIT 20;
```

**Problema:** Com 1M+ produtos, joins são custosos.

**MongoDB:** Query única, sem join:
```javascript
db.produtos.find({
  categoria: "Eletrônicos",
  preco: { $gte: 5000, $lte: 50000 },
  estoque: { $gt: 0 }
}).sort({ rating: -1 }).limit(20)
```

### 6.3 Problema: Escalabilidade Horizontal
- **PostgreSQL:** Sharding manual é complexo; melhor scaling é vertical
- **MongoDB:** Sharding nativo e automático por qualquer chave

---

## 7. REQUISITOS DE INDEXAÇÃO

### 7.1 Índices Críticos para Performance

| Campo(s) | Tipo | Razão |
|----------|------|-------|
| `_id` | Hash (PRIMARY) | Lookups diretos por ID |
| `sku` | Unique | Garantir unicidade, buscar por SKU |
| `categoria` | B-Tree | Filtro de pesquisa facetada (60% das queries) |
| `preco` | B-Tree | Range queries na busca facetada |
| `estoque` | B-Tree | Filtro "em_stock" |
| `rating` | B-Tree | Ordenação por relevância |
| `categoria + preco` | Compound | Otimizar busca facetada comum |
| `categoria + rating + data_criacao` | Compound | Ordenação combinada |
| `nome` | Text Index | Busca full-text |

### 7.2 Estratégia ESR (Equality, Sort, Range)
```javascript
// Para query: { categoria, preco range, sort by rating }
// Index: { categoria: 1, rating: -1, preco: 1 }
db.produtos.createIndex({ categoria: 1, rating: -1, preco: 1 })
```

---

## 8. MÉTRICAS E BENCHMARK

### 8.1 Baseline Esperado
| Métrica | Target |
|---------|--------|
| Latência P50 (busca facetada) | 50-100ms |
| Latência P95 (busca facetada) | 200-300ms |
| Latência P99 (busca facetada) | < 500ms |
| Throughput (reads) | 10k requests/s |
| Throughput (writes) | 100 requests/s |

### 8.2 Testes A/B: Com vs. Sem Índices
Será executado para validar impacto de indexação:
```
Query: Busca facetada (categoria=Eletrônicos, preco 5k-50k)
Sem índice:     ~ 2000-5000ms (INACEITÁVEL)
Com índice:     ~ 100-200ms   (ACEITÁVEL)
```

---

## 9. CONCLUSÃO

O **Catálogo de Produtos Dinâmicos** é o caso de uso perfeito para justificar MongoDB porque:

✅ **Atributos Variáveis:** Impossível em SGBD relacional sem crueldade  
✅ **Query-Driven Design:** Queries de busca facetada são naturais em MongoDB  
✅ **Escalabilidade:** Sharding horizontal é trivial  
✅ **Flexibilidade:** Novos atributos sem migration  
✅ **Performance:** Sem joins, índices eficientes  
✅ **Real-World:** É assim que plataformas reais funcionam (Amazon, eBay, OLX)

---

**PRÓXIMA ETAPA:** Comparação técnica de MongoDB vs. Cassandra vs. Elasticsearch  
**RESPONSÁVEL:** Américo Malungo  
**DATA DE ENTREGA:** Dia 3 (Análise de Domínio + Justificação Tecnológica)
