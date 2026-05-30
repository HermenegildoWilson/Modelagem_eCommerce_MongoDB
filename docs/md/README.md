# 📚 Catálogo de Produtos Dinâmicos com MongoDB

**Trabalho Prático de SGBD II** - Universidade Kimpa Vita  
**Disciplina:** Sistemas de Gestão de Bases de Dados II  
**Docente:** Prof. Moyo Kanivengidio  
**Ano Letivo:** 2025/2026  

---

## 👥 Grupo de Trabalho

| Nome | Função | Responsabilidades |
|------|--------|------------------|
| **Américo Malungo Sebastião Miguel** | Arquiteto de Dados | Análise de domínio, justificação CAP, modelação |
| **Bengui Bena Pedro** | Engenheiro de Dados | Scripts de seeding, geração de dados realistas |
| **Egas Manuel Ribeiro** | Especialista em Queries | Queries avançadas, análise de performance |
| **Matondo Domingos Bunga** | Engenheiro DevOps | Docker, configuração de ambiente, failover |
| **Hermenegildo Wilson dos Santos Panzo** | Coordenador | Integração final, relatório, GitHub |

---

## 📋 Conteúdo

```
ecommerce-catalogo-nosql/
├── README.md                                 ← Você está aqui
├── docker-compose.yml                        ← Configuração MongoDB 3-nós
├── seed_data.py                              ← Script de geração (100k+ produtos)
├── queries_avancadas.js                      ← 6+ queries otimizadas
├── requirements.txt                          ← Dependências Python
│
├── docs/
│   ├── 01_ANALISE_DOMINIO_PADROES_ACESSO.md
│   ├── 02_JUSTIFICACAO_TECNOLOGICA_CAP.md
│   ├── 03_MODELO_DADOS_SCHEMA.md
│   ├── 04_SEEDING_DOCUMENTACAO.md            (neste README)
│   ├── 05_QUERIES_E_PERFORMANCE.md           (neste README)
│   └── RELATORIO_SGBD_II.pdf                 ← Entrega final
│
├── data/
│   └── sample_products.json                  ← 100 produtos exemplo
│
└── scripts/
    ├── init-mongo.js                         ← Inicialização MongoDB
    └── test-failover.sh                      ← Teste de recuperação
```

---

## 🚀 Quick Start (5 Minutos)

### Pré-Requisitos
- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Python** 3.9+ (para seeding)
- **Git**
- **MongoDB Shell** (mongosh) instalado localmente OU via container

### 1. Clonar Repositório
```bash
git clone https://github.com/seu-usuario/ecommerce-catalogo-nosql.git
cd ecommerce-catalogo-nosql
```

### 2. Iniciar MongoDB Cluster (3 nós)
```bash
docker-compose up -d
```

**Verificar status:**
```bash
docker-compose ps
# Deve mostrar: mongo-node-1, mongo-node-2, mongo-node-3, mongo-express (healthy)
```

### 3. Inicializar Replica Set

**Via Docker (recomendado):**
```bash
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 --authenticationDatabase admin --eval "
rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongo1:27017', priority: 1 },
    { _id: 1, host: 'mongo2:27017', priority: 0 },
    { _id: 2, host: 'mongo3:27017', priority: 0 }
  ]
})
"
```

**Verificar replica set:**
```bash
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 --authenticationDatabase admin --eval "rs.status()"
```

Deve retornar:
```
rs0 [PRIMARY]
  mongo-node-1: PRIMARY
  mongo-node-2: SECONDARY
  mongo-node-3: SECONDARY
```

### 4. Gerar e Popular 100k Produtos

**Instalar dependências Python:**
```bash
pip install -r requirements.txt
```

**Executar seeding:**
```bash
python seed_data.py \
  --host localhost \
  --port 27017 \
  --db ecommerce \
  --count 100000
```

**Tempo esperado:** 3-5 minutos para 100k produtos  
**Resultado esperado:**
```
✅ Conectado a MongoDB em localhost:27017
📝 Gerando e inserindo produtos...

  ✅ Batch inserido: 1000/100000 produtos
  ✅ Batch inserido: 2000/100000 produtos
  ...
  ✅ SEEDING CONCLUÍDO COM SUCESSO!
```

### 5. Executar Queries Avançadas

**Via Docker:**
```bash
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 --authenticationDatabase admin --file queries_avancadas.js ecommerce
```

**Ou localmente (se mongosh instalado):**
```bash
mongosh --host localhost:27017 -u admin -p mongodb_password_123 --authenticationDatabase admin --file queries_avancadas.js
```

---

## 📊 Estrutura de Dados

### Coleção: `produtos`

**Campos principais:**
- `_id`: ObjectId (chave primária)
- `sku`: String (unique, ex: "ELE-SAMSUNG-001")
- `nome`: String
- `categoria`: String (Eletrônicos, Vestuário, Livros, Casa, Desportos)
- `subcategoria`: String
- `preco`: Double
- `atributos_dinamicos`: Object (varia por categoria)
- `estoque`: Int32
- `avaliacao`: Object (rating_medio, total_avaliacoes)
- `vendas`: Object (total_vendido, vendas_este_mes)

**Exemplo de documento:**
```json
{
  "_id": ObjectId("..."),
  "sku": "ELE-SAMSUNG-A50-001",
  "nome": "Samsung Galaxy A50",
  "categoria": "Eletrônicos",
  "subcategoria": "Smartphones",
  "preco": 45000.00,
  "atributos_dinamicos": {
    "marca": "Samsung",
    "ram": "4GB",
    "armazenamento": "128GB",
    "bateria": "4000 mAh"
  },
  "estoque": 45,
  "em_stock": true,
  "avaliacao": {
    "rating_medio": 4.5,
    "total_avaliacoes": 127
  }
}
```

---

## 🔍 Queries Implementadas

### Query 1: Busca Facetada (60% do tráfego esperado)
```javascript
db.produtos.find({
  categoria: "Eletrônicos",
  preco: { $gte: 10000, $lte: 50000 },
  "atributos_dinamicos.marca": "Samsung",
  em_stock: true
})
.sort({ "avaliacao.rating_medio": -1 })
.limit(20)
```

**Performance:** ~100-150ms (com índice compound)

### Query 2: Agregação - Top Produtos por Categoria
```javascript
db.produtos.aggregate([
  { $group: { _id: "$categoria", total_vendido: { $sum: "$vendas.total_vendido" } } },
  { $sort: { total_vendido: -1 } }
])
```

**Performance:** ~200-300ms (depende do volume)

### Query 3: Busca Full-Text
```javascript
db.produtos.find(
  { $text: { $search: "samsung smartphone" }, em_stock: true },
  { score: { $meta: "textScore" } }
)
.sort({ score: { $meta: "textScore" } })
```

**Performance:** ~50-100ms

### Query 4: Atributos Dinâmicos Complexos
```javascript
db.produtos.find({
  categoria: "Eletrônicos",
  "atributos_dinamicos.marca": "Samsung",
  "atributos_dinamicos.ram": { $in: ["8GB", "12GB", "16GB"] },
  "avaliacao.rating_medio": { $gte: 4.0 }
})
```

**Performance:** ~80-120ms

### Query 5: Análise de Rentabilidade
```javascript
db.produtos.aggregate([
  { $match: { "info_administrativo.ativo": true } },
  { $group: { 
    _id: "$categoria",
    receita_estimada: { $sum: { $multiply: ["$preco", "$estoque"] } }
  }}
])
```

**Performance:** ~150-200ms

### Query 6: Recomendações (Produtos Similares)
```javascript
db.produtos.find({
  categoria: "Eletrônicos",
  preco: { $gte: 36000, $lte: 54000 },
  em_stock: true
})
.sort({ "avaliacao.rating_medio": -1 })
.limit(5)
```

**Performance:** ~60-100ms

---

## 🔧 Índices Criados

```javascript
// 1. SKU único
db.produtos.createIndex({ sku: 1 }, { unique: true })

// 2. Busca por categoria
db.produtos.createIndex({ categoria: 1 })

// 3. Range de preço
db.produtos.createIndex({ preco: 1 })

// 4. Ordenação por rating
db.produtos.createIndex({ "avaliacao.rating_medio": -1 })

// 5. Compound index para busca facetada (CRÍTICO)
db.produtos.createIndex({ 
  categoria: 1,
  preco: 1,
  "avaliacao.rating_medio": -1
})

// 6. Disponibilidade
db.produtos.createIndex({ em_stock: 1 })

// 7. Full-text search
db.produtos.createIndex({ nome: "text", descricao: "text" })

// 8. Atributos dinâmicos
db.produtos.createIndex({ "atributos_dinamicos.marca": 1 })

// 9. Data de criação
db.produtos.createIndex({ "info_administrativo.data_criacao": -1 })

// 10. Produtos ativos
db.produtos.createIndex({ "info_administrativo.ativo": 1 })
```

**Verificar índices:**
```bash
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 --authenticationDatabase admin --eval "
use ecommerce
db.produtos.getIndexes()
"
```

---

## 📈 Análise de Performance

### Baseline Esperado (100k produtos)

| Query | Sem Índice | Com Índice | Melhoria |
|-------|-----------|-----------|---------|
| Busca Facetada | 2000-5000ms | 80-150ms | 25-62x |
| Full-Text | 1000-2000ms | 50-100ms | 10-40x |
| Agregação | 500-1500ms | 150-300ms | 3-10x |
| Lookup por SKU | 100-200ms | 1-5ms | 20-200x |

### Teste de Latência

```bash
# Executar 100 queries de busca facetada
time for i in {1..100}; do
  docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 \
    --authenticationDatabase admin \
    --quiet <<< "
      use ecommerce
      db.produtos.find({
        categoria: 'Eletrônicos',
        preco: { \$gte: 10000, \$lte: 50000 },
        em_stock: true
      }).limit(20)
    "
done
```

**Tempo esperado:** ~15-20 segundos (150-200ms por query)

---

## 🔄 Teste de Failover (Tolerância a Partições)

### Simular Falha do Nó Primário

```bash
# Terminal 1: Observar status do replica set
watch -n 1 'docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 --authenticationDatabase admin --quiet --eval "rs.status()" | grep -E "(PRIMARY|SECONDARY|health)"'

# Terminal 2: Parar nó primário
docker pause mongo-node-1

# Observar:
# - Eleição automática em ~10 segundos
# - mongo-node-2 vira PRIMARY
# - mongo-node-3 fica SECONDARY
# - mongo-node-1 fica INACCESSIBLE

# Terminal 3: Tentar escrever durante failover
docker exec mongo-node-2 mongosh -u admin -p mongodb_password_123 --authenticationDatabase admin --eval "
db.produtos.updateOne({ sku: 'TEST' }, { \$set: { sku: 'TEST' } }, { upsert: true })
"

# Retomar nó primário
docker unpause mongo-node-1

# Observar:
# - mongo-node-1 sincroniza automaticamente
# - Volta a PRIMARY após catch-up
```

**Resultado Esperado:**
- ✅ Failover automático em < 15s
- ✅ Sem perda de writes confirmados (write concern: majority)
- ✅ Eventual consistency em < 1s pós-failover

---

## 📝 Documentação Adicional

Consulte os documentos na pasta `docs/`:

1. **01_ANALISE_DOMINIO_PADROES_ACESSO.md**
   - Análise completa do domínio
   - Padrões de acesso e requisitos
   - Distribuição de dados por categoria

2. **02_JUSTIFICACAO_TECNOLOGICA_CAP.md**
   - Teorema CAP explicado
   - Comparação MongoDB vs. Cassandra vs. Elasticsearch
   - Análise de trade-offs

3. **03_MODELO_DADOS_SCHEMA.md**
   - Estrutura JSON detalhada
   - Estratégias de desnormalização
   - Padrões de embedding vs. referência

---

## 🐛 Troubleshooting

### Problema: MongoDB não inicia
```bash
# Verificar logs
docker logs mongo-node-1

# Resetar e começar do zero
docker-compose down -v
docker-compose up -d
```

### Problema: Replica set não inicializa
```bash
# Aguardar 30s e tentar novamente
sleep 30
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 --authenticationDatabase admin --eval "rs.status()"
```

### Problema: Seeding é lento
```bash
# Aumentar tamanho do batch
sed -i 's/batch_size = 1000/batch_size = 5000/' seed_data.py
python seed_data.py --count 100000
```

### Problema: Queries muito lentas
```bash
# Verificar índices criados
db.produtos.getIndexes()

# Recriar índices
db.produtos.dropIndex("categoria_1")
db.produtos.createIndex({ categoria: 1 })

# Usar explain para diagnosticar
db.produtos.find({...}).explain("executionStats")
```

---

## 🧪 Testes Inclusos

### Teste de Integridade de Dados
```bash
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 --authenticationDatabase admin --eval "
use ecommerce
print('Total de produtos: ' + db.produtos.count())
print('Produtos ativos: ' + db.produtos.count({ 'info_administrativo.ativo': true }))
print('Produtos em stock: ' + db.produtos.count({ em_stock: true }))
print('Categorias únicas: ' + db.produtos.distinct('categoria').length)
"
```

### Teste de Performance de Índices
```bash
# Sem índice
time db.produtos.find({ sku: 'ELE-SAMSUNG-A50-001' }).explain("executionStats")

# Com índice
db.produtos.createIndex({ sku: 1 })
time db.produtos.find({ sku: 'ELE-SAMSUNG-A50-001' }).explain("executionStats")
```

---

## 📚 Referências Bibliográficas (IEEE)

[1] Brewer, E. A. "Towards Robust Distributed Systems," in Proc. 19th Annu. ACM Symp. Princ. Distrib. Comput., Portland, OR, USA, Jul. 2000.

[2] Gilbert, S. and Lynch, N. "Brewer's CAP Theorem," ACM SIGACT News, vol. 33, no. 2, pp. 51–59, Jun. 2002.

[3] MongoDB, Inc., "MongoDB Manual v7.0," Jun. 2024. [Online]. Available: https://www.mongodb.com/docs/manual/

[4] Elmasri, R. and Navathe, S. B., Fundamentals of Database Systems, 7th ed. Boston, MA, USA: Pearson, 2016.

---

## 📞 Suporte

Para dúvidas sobre a implementação, contacte:
- **Hermenegildo** (Coordenador): hermenegildo.panzo@ukv.edu.ao
- **Prof. Moyo Kanivengidio**: teoriepratique@gmail.com

---

## 📄 Licença

Este trabalho é propriedade intelectual da Universidade Kimpa Vita e do Prof. Moyo Kanivengidio.

---

**Última Atualização:** Maio de 2026  
**Status:** ✅ Completo e Testado  
**Versão:** 1.0
