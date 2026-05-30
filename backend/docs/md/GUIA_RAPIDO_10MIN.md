# ⚡ GUIA RÁPIDO: EXECUTAR TUDO EM 10 MINUTOS

## 🎯 Objetivo
Ter um **catálogo de 100.000 produtos** no MongoDB com **queries otimizadas** funcionando em 10 minutos.

---

## 📋 PRÉ-REQUISITOS (5 MIN ANTES)
```bash
✅ Docker Desktop instalado
✅ Git instalado
✅ Python 3.9+ instalado
✅ Pasta vazia para o projeto
```

---

## 🚀 EXECUÇÃO RÁPIDA (10 MINUTOS)

### MINUTO 0-2: Clonar e Configurar
```bash
# 1. Clonar projeto (ou copiar ficheiros)
git clone https://github.com/seu-usuario/ecommerce-catalogo-nosql.git
cd ecommerce-catalogo-nosql

# 2. Instalar dependências Python
pip install -r requirements.txt
```

### MINUTO 2-4: Iniciar MongoDB
```bash
# 3. Iniciar 3 nós MongoDB em Docker
docker-compose up -d

# 4. Verificar que estão healthy (2-3 min)
docker-compose ps
# STATUS: "healthy" ✅
```

### MINUTO 4-5: Inicializar Replica Set
```bash
# 5. Inicializar replica set em uma linha
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 \
  --authenticationDatabase admin \
  --eval "rs.initiate({_id:'rs0',members:[{_id:0,host:'mongo1:27017',priority:1},{_id:1,host:'mongo2:27017'},{_id:2,host:'mongo3:27017'}]})"

# 6. Verificar status
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 \
  --authenticationDatabase admin \
  --eval "rs.status()" | grep PRIMARY
```

### MINUTO 5-8: Popular 100k Produtos
```bash
# 7. Gerar e inserir 100.000 produtos (leva ~3 min)
python seed_data.py \
  --host localhost \
  --port 27017 \
  --db ecommerce \
  --count 100000

# Vê isto no final:
# ✅ SEEDING CONCLUÍDO COM SUCESSO!
# Produtos inseridos: 100000
```

### MINUTO 8-10: Executar Queries
```bash
# 8. Executar 6 queries avançadas
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 \
  --authenticationDatabase admin \
  --file queries_avancadas.js

# Vê isto:
# ────────────────────────────────────────────
# QUERY 1: BUSCA FACETADA
# Resultados: 20 produtos encontrados
# Tempo de execução: 145ms
# ────────────────────────────────────────────
```

### FIM (MINUTO 10)
```bash
# ✅ TUDO FUNCIONA!

# Extra: Visualizar em GUI (opcional)
# Abrir navegador: http://localhost:8081
# (MongoDB Express)
```

---

## 📊 RESULTADO ESPERADO

```
┌─────────────────────────────────────────────────────────────┐
│  CATÁLOGO PRONTO PARA TESTES                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ MongoDB 7.0 em 3 nós (Replica Set)                      │
│  ✅ 100.000 produtos em 5 categorias                        │
│  ✅ 10 índices otimizados criados                           │
│  ✅ 6 queries avançadas funcionando                         │
│  ✅ Performance < 200ms para busca facetada                 │
│  ✅ Failover automático testado                            │
│                                                              │
│  Produtos por Categoria:                                     │
│  ├─ Eletrônicos: 20.000                                     │
│  ├─ Vestuário: 30.000                                       │
│  ├─ Livros: 15.000                                          │
│  ├─ Casa e Cozinha: 20.000                                  │
│  └─ Desportos: 15.000                                       │
│                                                              │
│  Queries Otimizadas:                                         │
│  ├─ Query 1: Busca facetada (60% tráfego) ← CRÍTICA        │
│  ├─ Query 2: Agregação por categoria                        │
│  ├─ Query 3: Full-text search                               │
│  ├─ Query 4: Atributos dinâmicos complexos                  │
│  ├─ Query 5: Análise de rentabilidade                       │
│  └─ Query 6: Recomendações (similares)                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 VALIDAR TUDO ESTÁ FUNCIONANDO

```bash
# 1. Verificar MongoDB rodando
docker-compose ps
# Deve mostrar: mongo1, mongo2, mongo3, mongo-express (todos healthy)

# 2. Verificar produtos inseridos
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 \
  --authenticationDatabase admin \
  --eval "use ecommerce; db.produtos.count()"
# Output: 100000

# 3. Verificar índices criados
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 \
  --authenticationDatabase admin \
  --eval "use ecommerce; db.produtos.getIndexes().length"
# Output: 10 (ou mais)

# 4. Testar query rápida (< 200ms)
time docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 \
  --authenticationDatabase admin \
  --quiet <<< "
    use ecommerce
    db.produtos.find({
      categoria: 'Eletrônicos',
      preco: { \$gte: 10000, \$lte: 50000 },
      em_stock: true
    }).limit(20).pretty()
  "
# Output: ~150ms ou menos ✅
```

---

## 🧪 TESTES RÁPIDOS

### Teste 1: Failover Automático (30 segundos)
```bash
# Terminal 1: Observar status
watch -n 1 'docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 \
  --authenticationDatabase admin --quiet \
  --eval "rs.status()" | grep -E "(PRIMARY|SECONDARY)"'

# Terminal 2: Parar nó primário
docker pause mongo-node-1

# Observar: Novo PRIMARY eleito em ~15 segundos ✅

# Retomar
docker unpause mongo-node-1
```

### Teste 2: Performance de Busca (5 segundos)
```bash
# Executar query 10 vezes e medir tempo total
time for i in {1..10}; do
  docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 \
    --authenticationDatabase admin --quiet <<< "
      use ecommerce
      db.produtos.find({categoria:'Eletrônicos',em_stock:true}).limit(20)
    "
done
# Output: ~1-2 segundos total (150-200ms por query) ✅
```

---

## 🛑 SE ALGO DER ERRADO

### Problema: Containers não arrancam
```bash
# Verificar logs
docker logs mongo-node-1

# Reset completo
docker-compose down -v
docker-compose up -d
sleep 30  # Aguardar inicialização
```

### Problema: Seeding é lento
```bash
# Aumentar performance (aumentar tamanho de batch)
# Editar seed_data.py
sed -i 's/batch_size = 1000/batch_size = 5000/' seed_data.py
python seed_data.py --count 100000
```

### Problema: Queries muito lentas
```bash
# Recrear índices
docker exec mongo-node-1 mongosh -u admin -p mongodb_password_123 \
  --authenticationDatabase admin <<EOF
use ecommerce
db.produtos.dropIndexes()
db.produtos.createIndex({ sku: 1 }, { unique: true })
db.produtos.createIndex({ categoria: 1, preco: 1, "avaliacao.rating_medio": -1 })
EOF
```

---

## 📱 COMANDOS ÚTEIS

```bash
# Conectar direto ao MongoDB (sem container)
mongosh --host localhost:27017 \
  -u admin \
  -p mongodb_password_123 \
  --authenticationDatabase admin \
  ecommerce

# Ou via Docker
docker exec -it mongo-node-1 mongosh -u admin -p mongodb_password_123 \
  --authenticationDatabase admin

# Verificar quantos produtos tem
db.produtos.count()

# Ver distribuição por categoria
db.produtos.aggregate([
  { $group: { _id: "$categoria", total: { $sum: 1 } } }
])

# Ver status da replica
rs.status()

# Ver índices
db.produtos.getIndexes()

# Testar busca
db.produtos.find({ categoria: "Eletrônicos", em_stock: true }).limit(5)

# Parar tudo
docker-compose down
```

---

## 📚 FICHEIROS PRINCIPAIS

| Ficheiro | Função | Tamanho |
|----------|--------|--------|
| `docker-compose.yml` | Ambiente MongoDB | 150 linhas |
| `seed_data.py` | Gerar 100k produtos | 450 linhas |
| `queries_avancadas.js` | 6 queries otimizadas | 600 linhas |
| `README.md` | Documentação completa | 400 linhas |
| `docs/*.md` | 3 análises técnicas | ~70 páginas |

---

## ✅ CHECKLIST FINAL

Antes de entregar, verificar:

- [ ] Docker rodando (3 nós saudáveis)
- [ ] Replica set inicializado (rs.status() mostra PRIMARY + 2 SECONDARY)
- [ ] 100.000 produtos inseridos (db.produtos.count() = 100000)
- [ ] 10 índices criados (db.produtos.getIndexes())
- [ ] Query 1 < 200ms (busca facetada)
- [ ] Query 2 retorna resultados (agregação)
- [ ] Query 3 retorna resultados (full-text)
- [ ] Query 4 retorna resultados (atributos dinâmicos)
- [ ] Query 5 retorna análise de rentabilidade
- [ ] Query 6 retorna produtos similares
- [ ] Failover funciona (pause/unpause mongo-node-1)
- [ ] README tem instruções claras
- [ ] Documentos técnicos completos (3 ficheiros)
- [ ] requirements.txt atualizado
- [ ] GitHub sincronizado e pronto

---

## 🎉 PRONTO!

Está tudo pronto para entregar ao **Prof. Moyo Kanivengidio**.

**Email:** teoriepratique@gmail.com  
**Assunto:** `[SGBD II] Trabalho Prático 2 - Catálogo NoSQL - Grupo 5`

---

**Tempo Total:** ⏱️ 10 minutos  
**Eficiência:** 💯 100%  
**Nota Esperada:** 📊 18-20 valores

**Boa sorte! 🚀**
