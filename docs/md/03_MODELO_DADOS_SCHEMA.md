# 📐 MODELAÇÃO DE DADOS: Esquema JSON e Estratégias de Design

**Preparado por:** Américo Malungo Sebastião Miguel  
**Data:** Maio de 2026  

---

## 1. ESTRUTURA DA COLEÇÃO `produtos`

### 1.1 Documento Exemplo: Eletrônicos (Smartphone)

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "sku": "ELE-SAMSUNG-A50-001",
  "nome": "Samsung Galaxy A50",
  "descricao": "Smartphone Samsung Galaxy A50 com câmera de 49MP, bateria de 4000mAh e processador Exynos 9610. Display Super AMOLED 6.4 polegadas. Perfeito para fotografia e gaming.",
  "categoria": "Eletrônicos",
  "subcategoria": "Smartphones",
  "preco": 45000.00,
  "preco_original": 50000.00,
  "desconto_percentual": 10,
  "moeda": "AOA",
  
  "atributos_dinamicos": {
    "marca": "Samsung",
    "modelo": "Galaxy A50",
    "sistema_operativo": "Android 13",
    "processador": "Exynos 9610",
    "ram": "4GB",
    "armazenamento": "128GB",
    "tela_tamanho": "6.4 polegadas",
    "tela_tipo": "Super AMOLED",
    "tela_resolucao": "2340x1080",
    "bateria": "4000 mAh",
    "carregamento_rapido": "15W",
    "camera_principal": "49MP f/1.8",
    "camera_frontal": "32MP f/2.0",
    "conectividade": ["4G LTE", "Wi-Fi 5", "Bluetooth 5.0", "NFC"],
    "sensores": ["Acelerómetro", "Giroscópio", "Magnetómetro", "Luz Ambiente"],
    "resistencia_agua": "IP68",
    "peso": "185g",
    "dimensoes": "158.4 x 76.7 x 7.7 mm",
    "cores_disponiveis": ["Preto", "Branco", "Azul", "Prata"]
  },
  
  "estoque": 45,
  "estoque_minimo": 5,
  "em_stock": true,
  "localizacoes_armazem": [
    { "cidade": "Luanda", "quantidade": 30 },
    { "cidade": "Huambo", "quantidade": 15 }
  ],
  
  "imagens": [
    {
      "url": "https://cdn.ecommerce.ao/produtos/ELE-SAMSUNG-A50-001.jpg",
      "tipo": "principal",
      "ordem": 1
    },
    {
      "url": "https://cdn.ecommerce.ao/produtos/ELE-SAMSUNG-A50-002.jpg",
      "tipo": "secundaria",
      "ordem": 2
    }
  ],
  
  "avaliacao": {
    "rating_medio": 4.5,
    "total_avaliacoes": 127,
    "distribuicao": {
      "5_estrelas": 65,
      "4_estrelas": 42,
      "3_estrelas": 15,
      "2_estrelas": 3,
      "1_estrela": 2
    }
  },
  
  "vendas": {
    "total_vendido": 342,
    "vendas_este_mes": 28,
    "vendas_esta_semana": 7
  },
  
  "tags": ["smartphone", "android", "samsung", "5g", "camera-profissional"],
  "palavras_chave": ["samsung galaxy", "android phone", "smartphone topo gama"],
  
  "info_administrativo": {
    "fornecedor_id": "SUPPLIER-SAMSUNG-001",
    "custo_unitario": 30000.00,
    "margem_lucro_percentual": 50,
    "data_criacao": ISODate("2024-01-15T10:30:00Z"),
    "data_atualizacao": ISODate("2026-05-20T14:22:00Z"),
    "ativo": true,
    "motivo_desativacao": null,
    "data_desativacao": null
  },
  
  "seo": {
    "titulo": "Samsung Galaxy A50 - Smartphone Android 13 | Loja Oficial",
    "descricao_meta": "Compre Samsung Galaxy A50 com câmera 49MP, tela AMOLED e bateria 4000mAh. Melhor preço em Angola. Frete grátis acima 50.000 AOA.",
    "url_amigavel": "smartphone-samsung-galaxy-a50"
  }
}
```

---

### 1.2 Documento Exemplo: Vestuário (T-Shirt)

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "sku": "VEST-NIKE-TSHIRT-001",
  "nome": "Nike T-Shirt Dry-Fit",
  "descricao": "Camiseta desportiva Nike com tecnologia Dry-Fit. Leve, respirável e confortável para treino ou uso casual. 100% poliéster reciclado.",
  "categoria": "Vestuário",
  "subcategoria": "Camisetas",
  "preco": 3500.00,
  "preco_original": 4000.00,
  "desconto_percentual": 12.5,
  "moeda": "AOA",
  
  "atributos_dinamicos": {
    "marca": "Nike",
    "colecao": "Verão 2026",
    "genero": "Masculino",
    "tamanho": "M",
    "tamanhos_disponiveis": ["XS", "S", "M", "L", "XL", "XXL"],
    "cor": "Azul Marinho",
    "cores_disponiveis": ["Preto", "Branco", "Azul Marinho", "Vermelho", "Cinza"],
    "material": "100% Poliéster",
    "composicao": "Poliéster reciclado",
    "gramajem": "180g/m²",
    "ajuste": "Regular Fit",
    "tipo_manga": "Curta",
    "tecnologia": "Dry-Fit",
    "peso_camiseta": "180g"
  },
  
  "estoque": 234,
  "estoque_minimo": 20,
  "em_stock": true,
  "localizacoes_armazem": [
    { "cidade": "Luanda", "quantidade": 150 },
    { "cidade": "Benguela", "quantidade": 84 }
  ],
  
  "imagens": [
    {
      "url": "https://cdn.ecommerce.ao/produtos/VEST-NIKE-TSHIRT-001.jpg",
      "tipo": "principal",
      "ordem": 1
    }
  ],
  
  "avaliacao": {
    "rating_medio": 4.2,
    "total_avaliacoes": 89,
    "distribuicao": {
      "5_estrelas": 45,
      "4_estrelas": 30,
      "3_estrelas": 10,
      "2_estrelas": 3,
      "1_estrela": 1
    }
  },
  
  "vendas": {
    "total_vendido": 567,
    "vendas_este_mes": 45,
    "vendas_esta_semana": 12
  },
  
  "tags": ["camiseta", "desportiva", "nike", "casual", "confortavel"],
  "palavras_chave": ["t-shirt nike", "roupa desportiva", "dry-fit"],
  
  "info_administrativo": {
    "fornecedor_id": "SUPPLIER-NIKE-001",
    "custo_unitario": 1800.00,
    "margem_lucro_percentual": 95,
    "data_criacao": ISODate("2024-03-10T09:00:00Z"),
    "data_atualizacao": ISODate("2026-05-20T14:22:00Z"),
    "ativo": true,
    "motivo_desativacao": null,
    "data_desativacao": null
  },
  
  "seo": {
    "titulo": "Nike T-Shirt Dry-Fit | Camiseta Desportiva Confortável",
    "descricao_meta": "Camiseta Nike Dry-Fit em cores variadas. Tecnologia anti-suor. Compre online em Angola com frete grátis.",
    "url_amigavel": "nike-tshirt-dryfit"
  }
}
```

---

### 1.3 Documento Exemplo: Livros

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "sku": "LIVRO-PESSOA-001",
  "nome": "O Cortiço - Aluísio Azevedo",
  "descricao": "Romance clássico da literatura portuguesa, publicado originalmente em 1890. Análise social da vida em um cortiço do Rio de Janeiro. Edição crítica com introdução e notas.",
  "categoria": "Livros",
  "subcategoria": "Literatura Clássica",
  "preco": 2500.00,
  "preco_original": 3000.00,
  "desconto_percentual": 16.67,
  "moeda": "AOA",
  
  "atributos_dinamicos": {
    "autor": "Aluísio Azevedo",
    "editora": "Companhia das Letras",
    "ano_publicacao": 1890,
    "edicao": "3ª Edição Crítica",
    "idioma": "Português",
    "genero": "Romance Naturalista",
    "numero_paginas": 256,
    "peso_livro": "320g",
    "dimensoes": "21 x 14 x 2 cm",
    "encadernacao": "Capa Dura",
    "isbn": "978-8535920000",
    "tipo_papel": "Papel 80g",
    "tradutor": null,
    "ilustrador": "Marina Willer"
  },
  
  "estoque": 67,
  "estoque_minimo": 10,
  "em_stock": true,
  "localizacoes_armazem": [
    { "cidade": "Luanda", "quantidade": 40 },
    { "cidade": "Huambo", "quantidade": 27 }
  ],
  
  "imagens": [
    {
      "url": "https://cdn.ecommerce.ao/produtos/LIVRO-PESSOA-001.jpg",
      "tipo": "capa",
      "ordem": 1
    }
  ],
  
  "avaliacao": {
    "rating_medio": 4.7,
    "total_avaliacoes": 156,
    "distribuicao": {
      "5_estrelas": 120,
      "4_estrelas": 28,
      "3_estrelas": 6,
      "2_estrelas": 1,
      "1_estrela": 1
    }
  },
  
  "vendas": {
    "total_vendido": 289,
    "vendas_este_mes": 22,
    "vendas_esta_semana": 5
  },
  
  "tags": ["literatura", "clássico", "português", "ficção", "cultura"],
  "palavras_chave": ["cortiço aluísio", "literatura clássica", "romance português"],
  
  "info_administrativo": {
    "fornecedor_id": "SUPPLIER-COMPANHIA-LETRAS",
    "custo_unitario": 1200.00,
    "margem_lucro_percentual": 108,
    "data_criacao": ISODate("2024-02-01T11:20:00Z"),
    "data_atualizacao": ISODate("2026-05-20T14:22:00Z"),
    "ativo": true,
    "motivo_desativacao": null,
    "data_desativacao": null
  },
  
  "seo": {
    "titulo": "O Cortiço - Aluísio Azevedo | Literatura Clássica",
    "descricao_meta": "Compre O Cortiço edição crítica. Romance clássico da literatura portuguesa. Frete grátis em Angola.",
    "url_amigavel": "cortiço-aluísio-azevedo"
  }
}
```

---

## 2. ESTRATÉGIA DE DESNORMALIZAÇÃO

### 2.1 Por que Desnormalizamos?

Em SGBD relacional, a **normalização** é obrigatória:
```sql
-- Tabela normalizada
CREATE TABLE produtos (
  id INT PRIMARY KEY,
  nome VARCHAR(255),
  categoria_id INT,
  preco DECIMAL(10,2),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Busca facetada exige JOIN
SELECT p.* FROM produtos p
JOIN categorias c ON p.categoria_id = c.id
WHERE c.nome = 'Eletrônicos'
  AND p.preco BETWEEN 5000 AND 50000;
```

**Em MongoDB, desnormalizamos** para:
- ❌ Eliminar JOINs
- ✅ Uma query = um documento
- ✅ Melhor performance em leitura

### 2.2 Padrão 1: Embedding (Aninhamento)

**Decisão:** Qual dados embutir no documento `produtos`?

#### Dados Embutidos (Sempre na Query):
- ✅ `atributos_dinamicos` - Específicos do produto
- ✅ `imagens` - Pequeno array, sempre necessário
- ✅ `avaliacao` - Resumo (rating_medio, total_avaliacoes)
- ✅ `vendas` - Estatísticas de venda
- ✅ `info_administrativo` - Metadata interna
- ✅ `localizacoes_armazem` - Pequena array, frequentemente consultada

**Dados NÃO Embutidos (Referência por ID):**
- ❌ `reviews` (avaliações detalhadas) → Coleção separada `reviews`
  - Razão: Cada produto pode ter 1000+ reviews (array explosão)
  - Padrão: `produto_id` em cada review, busca separada

- ❌ `categorias` (apenas ID referenciado)
  - Razão: Categoria muda raramente, cacheável
  - Padrão: Busca por `categoria: "Eletrônicos"` (string diretamente, não ID)

- ❌ `fornecedor` (apenas ID referenciado)
  - Razão: Fornecedor tem dados extensos
  - Padrão: `fornecedor_id` em `info_administrativo`

#### Exemplo: Busca Facetada (sem JOINs)
```javascript
// Query otimizada - NENHUM JOIN necessário!
db.produtos.find({
  categoria: "Eletrônicos",              // Campo denormalizado
  preco: { $gte: 5000, $lte: 50000 },   // Campo denormalizado
  "atributos_dinamicos.marca": "Samsung", // Embedding permite acesso direto
  em_stock: true                         // Campo denormalizado
})
.sort({ "avaliacao.rating_medio": -1 })  // Embedding permite ordenação
.projection({
  _id: 1,
  sku: 1,
  nome: 1,
  preco: 1,
  "avaliacao.rating_medio": 1,
  "avaliacao.total_avaliacoes": 1,
  imagens: 1
})
.limit(20)
```

---

### 2.3 Padrão 2: Referência (Linking)

**Coleção Separada: `reviews`**

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439020"),
  "produto_id": ObjectId("507f1f77bcf86cd799439011"),  // Referência
  "usuario_id": "USER-12345",
  "titulo": "Excelente qualidade de câmera!",
  "comentario": "Fotos muito nítidas, especialmente à noite. Bateria dura o dia inteiro. Recomendo!",
  "rating": 5,
  "data_comentario": ISODate("2026-04-15T10:30:00Z"),
  "uteis": 42,
  "nao_uteis": 3,
  "comprador_verificado": true
}
```

**Por que referência?**
- ✅ Cada produto pode ter 1000+ reviews
- ✅ Reviews crescem infinitamente
- ✅ Query de detalhe do produto NÃO precisa de todos os reviews (paginação separada)
- ✅ Busca facetada usa apenas `avaliacao.rating_medio` (já embutido em produtos)

**Query para Reviews de um Produto:**
```javascript
// Detalhe do produto com reviews paginados
db.produtos.findOne({ _id: ObjectId("...") })
// Depois, em query separada:
db.reviews.find({ produto_id: ObjectId("...") })
  .sort({ data_comentario: -1 })
  .limit(10)
  .skip(0)
```

---

## 3. ÍNDICES OTIMIZADOS

### 3.1 Plano de Indexação

```javascript
// ÍNDICE 1: Busca por SKU (lookup direto)
db.produtos.createIndex({ sku: 1 }, { unique: true })

// ÍNDICE 2: Busca por categoria (facet primária)
db.produtos.createIndex({ categoria: 1 })

// ÍNDICE 3: Range de preço
db.produtos.createIndex({ preco: 1 })

// ÍNDICE 4: Ordenação por rating
db.produtos.createIndex({ "avaliacao.rating_medio": -1 })

// ÍNDICE 5: Compound index para busca facetada típica
// Query: { categoria, preco range, sort by rating }
db.produtos.createIndex({ 
  categoria: 1,
  preco: 1,
  "avaliacao.rating_medio": -1
})

// ÍNDICE 6: Disponibilidade em stock
db.produtos.createIndex({ em_stock: 1 })

// ÍNDICE 7: Full-text search em nome e descrição
db.produtos.createIndex({
  nome: "text",
  descricao: "text",
  tags: "text"
})

// ÍNDICE 8: Busca por atributo dinâmico (marca em eletrônicos)
db.produtos.createIndex({ "atributos_dinamicos.marca": 1 })

// ÍNDICE 9: Data de criação (novos produtos)
db.produtos.createIndex({ "info_administrativo.data_criacao": -1 })

// ÍNDICE 10: Composto para produtos ativos
db.produtos.createIndex({ 
  "info_administrativo.ativo": 1,
  categoria: 1
})
```

### 3.2 Estratégia ESR (Equality, Sort, Range)

```javascript
// Query típica de busca facetada
db.produtos.find({
  categoria: "Eletrônicos",           // EQUALITY
  "atributos_dinamicos.marca": "Samsung", // EQUALITY
  preco: { $gte: 5000, $lte: 50000 }, // RANGE
  em_stock: true                       // EQUALITY
})
.sort({ "avaliacao.rating_medio": -1 }) // SORT
.limit(20)

// Índice ideal (ESR order):
// E=Equality, S=Sort, R=Range
db.produtos.createIndex({
  categoria: 1,                            // EQUALITY 1
  "atributos_dinamicos.marca": 1,         // EQUALITY 2
  "avaliacao.rating_medio": -1,           // SORT
  preco: 1                                 // RANGE
})

// MongoDB vai:
// 1. Usar categoria para eliminar documentos
// 2. Usar marca para filtro adicional
// 3. Usar rating_medio para ordenação
// 4. Usar preco para range final
```

---

## 4. CICLO DE VIDA DOS DADOS

### 4.1 Estados de um Produto

```
NOVO PRODUTO
     │
     ▼
[ATIVO] ──────────────────┐
 │                        │
 ├─ em_stock: true        │
 ├─ ativo: true           │ Tempo: Dias/Meses/Anos
 ├─ vendas crescendo      │
 └─ rating melhorando     │
                          │
                          ▼
                    [DESCONTINUADO]
                      ├─ estoque zerado
                      ├─ ativo: true (ainda visível)
                      └─ Prazo: 30-90 dias
                              │
                              ▼
                        [DESATIVADO]
                          ├─ ativo: false
                          ├─ data_desativacao
                          ├─ motivo_desativacao
                          └─ Histórico mantido (soft delete)
```

### 4.2 Soft Delete vs. Hard Delete

**Padrão Implementado: SOFT DELETE**

```javascript
// Não DELETAR, apenas desativar
db.produtos.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      ativo: false,
      data_desativacao: new Date(),
      motivo_desativacao: "Produto descontinuado pelo fornecedor"
    }
  }
)

// Query com soft delete
db.produtos.find({
  ativo: true,        // Filtra apenas ativos
  categoria: "Eletrônicos"
})

// Para admin ver histórico
db.produtos.find({ ativo: false })
```

**Razão do Soft Delete:**
- ✅ Preserva histórico de vendas/avaliações
- ✅ Mantém integridade referencial (reviews apontam para produto)
- ✅ Auditoria (quando foi desativado, por quem, por quê)
- ✅ Permite reativar se necessário

---

## 5. VALIDAÇÃO DE ESQUEMA (JSON SCHEMA)

```javascript
db.createCollection("produtos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sku", "nome", "categoria", "preco", "estoque"],
      properties: {
        _id: { bsonType: "objectId" },
        sku: { 
          bsonType: "string",
          pattern: "^[A-Z0-9-]+$",
          description: "SKU único do produto"
        },
        nome: { 
          bsonType: "string",
          minLength: 3,
          maxLength: 255
        },
        categoria: {
          bsonType: "string",
          enum: ["Eletrônicos", "Vestuário", "Livros", "Casa e Cozinha", "Desportos"]
        },
        preco: { 
          bsonType: "double",
          minimum: 0
        },
        estoque: { 
          bsonType: "int",
          minimum: 0
        },
        avaliacao: {
          bsonType: "object",
          properties: {
            rating_medio: { bsonType: "double", minimum: 0, maximum: 5 },
            total_avaliacoes: { bsonType: "int", minimum: 0 }
          }
        }
      }
    }
  }
})
```

---

## 6. CONCLUSÃO SOBRE MODELAÇÃO

```
┌────────────────────────────────────────────┐
│  DECISÕES DE DESIGN JUSTIFICADAS           │
├────────────────────────────────────────────┤
│                                            │
│ ✅ Embedding (Aninhamento):                │
│    - atributos_dinamicos (específicos)    │
│    - avaliacao (resumo)                   │
│    - imagens (pequeno array)              │
│    - localizacoes_armazem                 │
│    → Elimina JOINs, otimiza busca         │
│                                            │
│ ✅ Referência (Linking):                   │
│    - reviews (crescimento infinito)       │
│    - fornecedor (dados extensos)          │
│    → Evita array explosão                 │
│                                            │
│ ✅ Desnormalização Estratégica:            │
│    - Categoria embutida (não ID)          │
│    - Rating resumido (não todos reviews)  │
│    - Vendas agregadas                     │
│    → Query-driven design implementado     │
│                                            │
│ ✅ Índices Otimizados (10 índices):       │
│    - ESR strategy (Equality, Sort, Range) │
│    - Compound indexes para queries comuns │
│    - Full-text search                     │
│    → Busca facetada < 200ms               │
│                                            │
│ ✅ Soft Delete:                            │
│    - Histórico preservado                 │
│    - Auditoria garantida                  │
│    - Integridade referencial              │
│    → Best practice e-commerce             │
│                                            │
└────────────────────────────────────────────┘
```

---

**PRÓXIMA ETAPA:** Scripts de Seeding (100k+ produtos)  
**RESPONSÁVEL:** Bengui Bena Pedro  
**DATA DE ENTREGA:** Dia 11
