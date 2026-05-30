# 🏗️ JUSTIFICAÇÃO TECNOLÓGICA: CAP, PACELC E COMPARAÇÃO SGBD

**Preparado por:** Américo Malungo Sebastião Miguel  
**Data:** Maio de 2026  

---

## 1. TEOREMA CAP (BREWER)

O Teorema CAP estabelece que um sistema distribuído pode **simultaneamente garantir apenas 2 de 3 propriedades**:

```
         ┌─────────────────────┐
         │    CONSISTÊNCIA     │
         │  (Consistency)      │
         │   Todos os nós      │
         │ veem dados iguais   │
         └──────────┬──────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
    ┌─────────┐           ┌──────────────┐
    │    AP   │           │      CA      │
    │         │           │              │
    │ Avail + │           │  Consist +   │
    │ Partit  │           │  Avail       │
    └─────────┘           │              │
         ▲                 │  NO Partition│
         │                 │  Tolerance   │
         └─────────────────┴──────────────┘
    ┌──────────────────────────────────────┐
    │    CP (Consistency + Partition)      │
    │  Sacrifica Availability               │
    └──────────────────────────────────────┘
```

### 1.1 Definições

| Propriedade | Definição | Implicações |
|-------------|-----------|------------|
| **Consistency (C)** | Todos os clientes veem os mesmos dados em qualquer momento | Writes sincronos; custo de latência |
| **Availability (A)** | Sistema sempre responde (não falha) | Reads/writes rápidos; pode retornar dados stale |
| **Partition Tolerance (P)** | Sistema funciona mesmo com falha de rede | Obrigatório em sistemas distribuídos |

### 1.2 Escolha: AP vs. CP vs. CA

Para o **Catálogo de Produtos**, a escolha é **AP (Availability + Partition Tolerance)**:

```
ESCOLHA: MongoDB (AP)
├── Availability: ✅ ALTA (replica sets continuam operacionais)
├── Partition: ✅ TOLERÂNCIA (falha de nó = outros continuam)
├── Consistency: ⚠️ EVENTUAL (leituras podem ver dados desatualizados)
└── Trade-off: Aceitável porque
    - Produtos não mudam constantemente
    - Pequenas inconsistências (preço estale por segundos) são toleráveis
    - Precisamos de alta disponibilidade 24/7
```

**Cenário Real:**
```
Sem failover (Normal):
Cliente A lê preço de produto = 50,000 AOA
Cliente B lê preço de produto = 50,000 AOA (mesmo preço, consistência forte)

Com failover (Partição de Rede):
Nó Primário cai!
Cliente A lê do Nó Secundário = 50,000 AOA (valor anterior)
Admin faz update = 55,000 AOA no novo primário
Cliente B lê do Nó Secundário antigo = 50,000 AOA (STALE, mas OK!)
Após replicação sincronizar (< 1 segundo), consistência é restaurada

Alternativa CP (PostgreSQL):
Nó Primário cai!
PostgreSQL bloqueia todas as writes até resolver split-brain
Customers não conseguem comprar por 5-10 minutos
Perda de negócio >> aceitação de dados stale
```

---

## 2. TEOREMA PACELC (Extensão do CAP)

O CAP é incompleto: ignora o comportamento em **ausência de partição**. PACELC estende:

```
        IF Partition:
        ├── THEN Choose (A)vailability or (C)onsistency
        └── ELSE Choose (L)atency or (C)onsistency

PACELC = PAC + ELC
```

### 2.1 Para MongoDB

```
┌─────────────────────────────────────────────┐
│  MongoDB Trade-offs                         │
├─────────────────────────────────────────────┤
│ IF Partição de rede:                        │
│   ├── Sacrifica: Consistency (CP)           │
│   ├── Mantém: Availability, Partition       │
│   └── Replica set funciona com maioria      │
│                                              │
│ ELSE Sem partição:                          │
│   ├── Sacrifica: Latência (escrita sincrona)│
│   ├── Mantém: Consistency (write concern)   │
│   └── Write com replication = 50-200ms extra│
│                                              │
│ ✅ Tradeoff acceptable para catálogo        │
└─────────────────────────────────────────────┘
```

---

## 3. COMPARAÇÃO: MongoDB vs. ALTERNATIVAS

### 3.1 Matriz de Comparação

| Critério | MongoDB | Cassandra | Elasticsearch |
|----------|---------|-----------|---------------|
| **Modelo de Dados** | Documento (JSON) | Coluna | Índice invertido |
| **Schema** | Flexível (schema-less) | Fixo (schema obrigatório) | Flexível (mapping) |
| **CAP** | AP | AP | AP |
| **Consistência** | Eventual (read from primary) | Eventual | Eventual |
| **Sharding** | Automático | Automático | Automático |
| **Replicação** | Replica Sets (3+ nós) | Replication Factor | Master-Slave |
| **Query Language** | MQL (MongoDB Query Lang) | CQL (Cassandra Query Lang) | Query DSL (JSON) |
| **Índices** | B-Tree, Text, Geo | Primary, Secondary, Custom | Inverted Index (full-text) |
| **Agregação** | Pipeline (poderoso) | Map-Reduce (obsoleto) | Aggregations (limitado) |
| **Latência Típica** | 50-200ms | 10-50ms | 100-500ms (depende tokens) |
| **Throughput Write** | 10-100k/s | 100k-1M/s | 50-500k/s |
| **Throughput Read** | 100k-1M/s | 500k-10M/s | 100k-1M/s |
| **Curva Aprendizado** | Baixa (JSON familiar) | Média (CQL distinto) | Média (Lucene concepts) |
| **Comunidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Documentação** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

### 3.2 Análise Detalhada

#### **3.2.1 MongoDB — ESCOLHIDO ✅**

**Vantagens:**
- ✅ **Schema Flexível:** Atributos dinâmicos por categoria sem problema
- ✅ **Modelo Natural:** JSON = Estruturas aninhadas naturais
- ✅ **Query Language Intuitivo:** MQL é fácil aprender
- ✅ **Índices Eficientes:** B-Tree = bom para range queries (busca facetada)
- ✅ **Agregação Poderosa:** Pipeline = operações complexas sem saída para aplicação
- ✅ **Replicação Automática:** Replica Sets = failover automático
- ✅ **Sharding Automático:** Crescimento horizontal transparente

**Desvantagens:**
- ❌ Consumo de memória maior (BSON vs. binário puro)
- ❌ Latência ~50-200ms (vs. 10-50ms de Cassandra)
- ❌ Throughput menor em escritas (~100k/s vs. 1M/s Cassandra)

**Por que é a MELHOR escolha:**
```
Requisitos do Catálogo:
├── Atributos variáveis → MongoDB 10/10, Cassandra 3/10
├── Busca facetada complexa → MongoDB 9/10, Elasticsearch 10/10
├── Writes moderados (5% tráfego) → MongoDB 8/10, Cassandra 10/10
├── Reads altos (95%) → MongoDB 9/10, Cassandra 10/10
├── Disponibilidade alta → MongoDB 9/10, Cassandra 9/10
├── Facilidade implementação → MongoDB 10/10, Cassandra 6/10
└── SCORE FINAL → MongoDB 8.5/10, Cassandra 7.5/10, ES 7/10
```

---

#### **3.2.2 Cassandra — Alternativa (Rejeitada)**

**Por que NÃO usar Cassandra?**

```
Cassandra é melhor em:
- Throughput extremo de writes (1M+/s)
- Latência baixa (10-50ms)
- Distribuição global (multi-datacenter)

MAS FALHA EM:
1. Schema FIXO (problema crítico para atributos variáveis)
   
   Cassandra exige schema rígido:
   CREATE TABLE produtos (
     id UUID PRIMARY KEY,
     nome TEXT,
     preco DECIMAL,
     marca TEXT,
     ram TEXT,
     tamanho TEXT,  -- Só para alguns produtos
     cor TEXT,      -- Só para alguns produtos
     ...
   );
   
   Solução ruim: colunas NULL para 80% dos produtos
   Alternativa pior: Múltiplas tabelas por categoria

2. Queries complexas difíceis
   
   Busca facetada em Cassandra é terrível:
   - Não suporta múltiplos filtros em colunas não-clustering
   - Precisa de desnormalização EXTREMA (múltiplas tabelas)
   - Manutenção = nightmare

3. Agregação limitada
   - Cassandra não tem pipeline de agregação como MongoDB
   - Implementar agregação = código na aplicação
```

**Exemplo Cassandra (RUIM):**
```
Para suportar: busca por (categoria, preço, marca)
Precisa de múltiplas tabelas (redundância):

CREATE TABLE produtos_por_categoria_preco (
  categoria TEXT,
  preco DECIMAL,
  produto_id UUID,
  ...
  PRIMARY KEY ((categoria), preco, produto_id)
);

CREATE TABLE produtos_por_categoria_marca (
  categoria TEXT,
  marca TEXT,
  produto_id UUID,
  ...
  PRIMARY KEY ((categoria), marca, produto_id)
);

CREATE TABLE produtos_por_preco_marca (
  preco DECIMAL,
  marca TEXT,
  produto_id UUID,
  ...
  PRIMARY KEY ((preco), marca, produto_id)
);

→ Manutenção exponencial com novos filtros!
```

**Conclusão:** Cassandra é excelente para **Time Series** (IoT, logs), NÃO para catálogo dinâmico.

---

#### **3.2.3 Elasticsearch — Alternativa (Parcial)**

**Por que NÃO usar Elasticsearch puro?**

```
Elasticsearch é MELHOR em:
- Full-text search (relevância, fuzzy, stemming)
- Análise de texto (tokenização, filtros)
- Faceted search (suporta agregações)
- Escalabilidade de reads gigantesca

MAS TEM PROBLEMAS:
1. Não é banco de dados primário
   - Elasticsearch é índice, não storage primário
   - Precisa de MongoDB/PostgreSQL como fonte de verdade

2. Overhead operacional
   - Infraestrutura complexa (cluster, monitoring, tuning)
   - Mais difícil que MongoDB simples

3. Write latency é pior
   - Refresh interval padrão = 1 segundo
   - Dados aparecem no índice com delay

4. Custo operacional
   - Elasticsearch gasta mais CPU/memória que MongoDB
```

**Solução Híbrida (Viável, mas complexa):**
```
Arquitetura Polyglot:
┌──────────────────────────────────────┐
│  MongoDB (Source of Truth)           │
│  - Dados completos dos produtos      │
│  - Atributos dinâmicos               │
│  - Replicação e backup               │
└────────────────┬─────────────────────┘
                 │ Replica/Sync
                 ▼
┌──────────────────────────────────────┐
│  Elasticsearch (Index)               │
│  - Full-text search                  │
│  - Faceted navigation                │
│  - Análise avançada                  │
└──────────────────────────────────────┘
```

**Essa abordagem é "gold standard", mas:**
- ❌ Mais complexa para implementar
- ❌ Mais custosa operacionalmente
- ❌ Sincronização MongoDB → Elasticsearch = desafio (eventual consistency)
- ❌ Fora do escopo deste trabalho (apenas MongoDB solicitado)

---

### 3.3 Decisão Final

```
┌─────────────────────────────────────────────┐
│  SGBD ESCOLHIDO: MongoDB 7.0+               │
├─────────────────────────────────────────────┤
│                                             │
│  Justificação Primária:                     │
│  ✅ Schema flexível = atributos dinâmicos  │
│  ✅ Modelo de documentos natural (JSON)    │
│  ✅ Query language intuitivo (MQL)         │
│  ✅ Índices eficientes para busca          │
│  ✅ Pipeline de agregação poderoso         │
│  ✅ Replicação automática (HA)             │
│  ✅ Sharding horizontal (escalabilidade)   │
│                                             │
│  Trade-offs Aceitáveis:                     │
│  ⚠️ Latência ~100-200ms (vs. 10-50 Cassandra)
│  ⚠️ Throughput writes ~100k/s (vs. 1M Cassandra)
│  ⚠️ Consistência eventual (AP do CAP)      │
│                                             │
│  Alternativas Rejeitadas:                   │
│  ❌ Cassandra: Schema rígido, queries complexas
│  ❌ Elasticsearch: Não é BD primário, overhead
│  ❌ PostgreSQL: Schema rígido, atributos variáveis
│                                             │
└─────────────────────────────────────────────┘
```

---

## 4. ANÁLISE CAP EM CENÁRIOS REAIS

### 4.1 Cenário 1: Operação Normal (Sem Partição)

```
┌─────┐
│Admin│ Atualiza preço de Samsung Galaxy A50: 50k → 55k
└──┬──┘
   │
   ▼
┌────────────────────────────────┐
│   MongoDB Primary (Escreve)    │
│   - Recebe write               │
│   - Valida schema              │
│   - Persiste em disk           │
│   └─→ 10-20ms                  │
└────┬───────────────────────────┘
     │ Replicação sincrona (write concern: majority)
     ▼
┌────────────────────────────────┐
│   Replica Set Secundários      │
│   - Recebem replicação         │
│   - Aplicam mudanças           │
│   └─→ 20-50ms (lag)            │
└────────────────────────────────┘

┌─────┐
│User │ Lê preço após update
└──┬──┘
   │
   ▼
┌────────────────────────────────┐
│   MongoDB Primary (Lê)         │
│   - Retorna 55,000 AOA         │
│   └─→ 2-5ms                    │
└────────────────────────────────┘

RESULTADO: Consistência FORTE (read-after-write)
LATÊNCIA TOTAL: ~60ms
CAP: CA (sem partição, temos C+A)
```

### 4.2 Cenário 2: Failover (Com Partição de Rede)

```
TIME 0:00
├─ Nó 1 (PRIMARY): 50,000 AOA
├─ Nó 2 (SECONDARY): 50,000 AOA
└─ Nó 3 (SECONDARY): 50,000 AOA
   Rede: OK (Replica Set = 3 nós)

TIME 0:15
Nó 1 cai! (Falha de hardware)
┌──────────────────────────────────────┐
│ PARTIÇÃO NETWORK!                    │
│ Clients NÃO conseguem falar com Nó1 │
│ Nó 2 e Nó 3 conseguem falar 1 com o outro
└──────────────────────────────────────┘

TIME 0:16
┌─ Nó 2 (NOVO PRIMARY): 50,000 AOA
├─ Nó 3 (SECONDARY): 50,000 AOA
└─ Nó 1 (DOWN): OFFLINE

Eleição realizada com maioria (2/3 nós up)
MongoDB escolhe: AP
├─ A (Availability): Sim! Nó 2 e Nó 3 ainda servem
├─ P (Partition Tolerance): Sim! Sistema funciona com falha
└─ C (Consistency): Sacrificada

TIME 0:17
┌─────────┐
│ Admin 1 │ Tenta atualizar: 50k → 55k
└─────┬───┘
      │ Write em Nó 2 (novo primário)
      ▼
   ✅ Sucesso! (write concern: 1 ou 2)

TIME 0:18
┌─────────┐
│ User B  │ Lê preço de Nó 3 (secundário)
└─────┬───┘
      │ Read de Nó 3
      ▼
   ❌ STALE DATA! 50,000 AOA (não viu update de 55k)
   
   Razão: Update em Nó 2 não chegou ainda em Nó 3
   Lag: ~100-500ms típico

TIME 0:50
Replicação sincroniza:
┌─ Nó 2 (PRIMARY): 55,000 AOA
└─ Nó 3 (SECONDARY): 55,000 AOA (sync'd)

TIME 1:00
Nó 1 recupera (network volta):
┌─ Nó 1 vê Nó 2 é primário
├─ Nó 1 vê que ficou para trás (rollback de writes nunca confirmadas)
└─ Nó 1 sincroniza com Nó 2 → 55,000 AOA

RESULTADO FINAL:
✅ Sistema continuou disponível (A=SIM)
✅ Tolerou partição (P=SIM)
⚠️ Inconsistência temporária (C=NÃO, ~500ms)
✅ Auto-recuperação após replicação
```

**Impacto no Catálogo:**
- User A comprou produto a 50k (price lock)
- User B viu preço 50k (após update a 55k)
- Sistema consolidou a 55k em ~1s
- Perda de negócio: ZERO (ambos fecharam transação)
- Inconsistência aceitável: SIM

---

## 5. ESCALABILIDADE: Crescimento 100x

### 5.1 Cenário Atual
```
Dados: 100,000 produtos
Tráfego: 1,000 req/s (600 reads, 400 miscelânea)
Infraestrutura: 3 nós (replica set)
Storage: 2-5 GB RAM
```

### 5.2 Cenário 100x Crescimento
```
Dados: 10,000,000 produtos (10M)
Tráfego: 100,000 req/s (60k reads, 40k operações)
Problema: Um único replica set NÃO suporta!
```

### 5.3 Solução: Sharding Horizontal

```
┌──────────────────────────────────────────────┐
│  MongoDB Sharded Cluster (10M produtos)      │
├──────────────────────────────────────────────┤
│                                              │
│  Shard Key: { categoria: 1, preco: 1 }      │
│  └─ Distribui produtos por categoria+preço  │
│                                              │
│  ┌──────────────┐  ┌──────────────┐        │
│  │ SHARD 1      │  │ SHARD 2      │  ...  │
│  │ Eletrônicos  │  │ Vestuário    │        │
│  │ 1M products  │  │ 2M products  │        │
│  │ 3 nós        │  │ 3 nós        │        │
│  └──────────────┘  └──────────────┘        │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │  Config Servers (Metadados)          │  │
│  │  - Shard routing info                │  │
│  │  - Chunk locations                   │  │
│  │  - 3 nós replicados                  │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │  Mongos Routers (Aplicação)          │  │
│  │  - Recebem queries                   │  │
│  │  - Roteiam para shard correto        │  │
│  │  - Agregam resultados                │  │
│  │  - 2-3 instâncias load-balanced      │  │
│  └──────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘

BENEFÍCIOS DO SHARDING:
✅ Throughput: 10k req/s → 100k req/s (10 shards)
✅ Storage: 2-5 GB → 20-50 GB (distribuído)
✅ Latência: Mesma (~100-200ms, queries roteadas)
✅ Tolerância a falhas: Falha de um shard = 9/10 online

EXEMPLO QUERY COM SHARDING:
Query: { categoria: "Eletrônicos", preco: { $gte: 5000, $lte: 50000 } }

1. Mongos recebe query
2. Mongos descobre shard key em query (categoria = "Eletrônicos")
3. Mongos identifica SHARD 1 (tem todos "Eletrônicos")
4. Mongos roteia query para SHARD 1 apenas (não precisa visitar Shard 2, 3...)
5. SHARD 1 retorna resultado
6. Mongos formata resposta

LATÊNCIA: ~100-150ms (mesmo que sem sharding!)
```

---

## 6. TOLERÂNCIA A FALHAS: Partição de Rede

### 6.1 Teste Prático: Simular Queda de Nó

```bash
# Replica Set inicial: 3 nós (PRIMARY, SECONDARY-A, SECONDARY-B)
$ mongo --replica-set rs0 --host localhost:27017

# Verificar status
rs.status()

# Simular falha: desligar nó primário
mongod para node1

# Observar:
1. Eleição automática em 10-15 segundos
2. SECONDARY-A promovido a PRIMARY
3. Cliente reconecta e continua escrevendo
4. DOWNTIME: ~15 segundos (aceitável para e-commerce)

# Re-ligar nó 1
mongod node1

# Nó 1 sincroniza automaticamente com novo primário
```

### 6.2 CAP Trade-off Durante Falha

```
Antes da Falha:
┌─────────┬─────────────┬──────────┐
│ Nó 1    │ Nó 2        │ Nó 3     │
│ PRIMARY │ SECONDARY   │ SECONDARY│
│ 55,000  │ 55,000      │ 55,000   │
└─────────┴─────────────┴──────────┘
Garantias: CAP = CA (consistência forte)

Nó 1 CAIA!
┌───────────────┬───────────┐
│ PARTIÇÃO      │           │
│ Nó 1 offline  │ Nó 2 + 3  │
└───────────────┴───────────┘

MongoDB escolhe: AP
├─ A: SIM (Nó 2 promovido a PRIMARY, continua servindo)
├─ P: SIM (Tolera falha)
├─ C: NÃO (próximas writes podem ter lag < 1s)

Write concern durante failover:
{ writeConcern: "majority" }
Exige confirmação de 2/3 nós
→ Bloqueia se não houver maioria

DURANTE PARTIÇÃO:
{ writeConcern: "1" }
Permite escrita com confirmação do nó local
→ Latência baixa, mas eventual consistency
```

---

## 7. REFERÊNCIAS DO CAP THEOREM

```
Brewer, Eric. (2000). "Towards Robust Distributed Systems"
- Enunciado original do teorema CAP

Gilbert, Seth; Lynch, Nancy. (2002). "Brewer's CAP Theorem"
- Prova formal do teorema em ambientes assíncronos

Pritchett, Daniel. (2008). "BASE: An Acid Alternative"
- Contexto de eventual consistency em AP systems

MongoDB Inc. (2024). "Replica Set Deployment"
- Documentação sobre failover e eleição de primário
```

---

## 8. CONCLUSÃO

```
┌──────────────────────────────────────────────────┐
│  TECNOLOGIA ESCOLHIDA: MongoDB 7.0+              │
├──────────────────────────────────────────────────┤
│                                                  │
│  CAP: AP (Availability + Partition Tolerance)   │
│  ├─ Sacrifica Consistency                        │
│  └─ Eventual consistency aceitável              │
│                                                  │
│  PACELC:                                         │
│  ├─ Sem partição: Latência vs. Consistency     │
│  │  → Escolhemos latência baixa                 │
│  ├─ Com partição: Availability vs. Consistency │
│  │  → Escolhemos Availability                   │
│  └─ Tradeoff explícito e justificado            │
│                                                  │
│  ESCALABILIDADE (100x):                          │
│  ├─ Sharding automático por shard key           │
│  ├─ 10 shards × 10M products = suportado        │
│  ├─ Throughput: 1k → 100k req/s                │
│  └─ Latência mantida constante                  │
│                                                  │
│  TOLERÂNCIA A FALHAS:                            │
│  ├─ Replica sets com eleição automática         │
│  ├─ Downtime durante failover: ~15 segundos    │
│  ├─ Auto-sincronização pós-recuperação         │
│  └─ RTO < 30s, RPO < 5s (aceitável)            │
│                                                  │
│  PRÓXIMA ETAPA: Modelação de dados              │
│  RESPONSÁVEL: Américo + Equipa                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

**REFERÊNCIAS ACADÉMICAS**

[IEEE]
[1] E. A. Brewer, "Towards robust distributed systems," in Proc. 19th Annu. ACM Symp. Principles Distrib. Comput. (PODC), Portland, OR, USA, Jul. 2000, p. 343.

[2] S. Gilbert and N. Lynch, "Brewer's CAP theorem," ACM SIGACT News, vol. 33, no. 2, pp. 51–59, Jun. 2002, doi: 10.1145/564585.564601.

[3] D. Pritchett, "BASE: An ACID alternative," ACM Queue, vol. 6, no. 3, pp. 48–55, May 2008, doi: 10.1145/1394127.1394128.

[4] MongoDB, Inc., "Replica Set Deployment," MongoDB Manual, Jun. 2024. [Online]. Available: https://www.mongodb.com/docs/manual/replication/. [Accessed: May 2026].

[5] P. Helland and D. Campbell, "Building on Quicksand," in Proc. 7th Biennial Conf. Innovative Data Syst. Res. (CIDR), Asilomar, CA, USA, Jan. 2009.

[6] D. Abadi, "Consistency tradeoffs in modern distributed database system design," Computer, vol. 45, no. 2, pp. 37–42, Feb. 2012, doi: 10.1109/MC.2012.33.
