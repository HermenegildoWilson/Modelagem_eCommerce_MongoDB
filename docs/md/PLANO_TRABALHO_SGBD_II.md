# 📋 PLANO DE TRABALHO: CATÁLOGO DE PRODUTOS DINÂMICOS NoSQL

**Disciplina:** SGBD II  
**Docente:** Moyo Kanivengidio  
**Grupo:** Américo, Bengui, Egas, Matondo, Hermenegildo  
**Data:** Maio de 2026  
**Entrega:** 1 mês após publicação  

---

## 🎯 VISÃO GERAL DO PROJETO

### Tema
**"Conceção e Implementação de um Catálogo de Produtos Dinâmicos com Pesquisa Facetada para um E-commerce de Alta Escala"**

### Por quê este subdomínio?
- ✅ Coração de qualquer plataforma e-commerce moderna
- ✅ Problemas reais: escalabilidade, atributos variáveis, pesquisa complexa
- ✅ Justifica perfeitamente a escolha de MongoDB (não relacional)
- ✅ Serve como base para construir a plataforma web depois
- ✅ Demonstra Query-Driven Design e desnormalização estratégica

---

## 📦 ENTREGÁVEIS FINAIS

### 1. **Repositório GitHub** com:
- 📄 Relatório Técnico (PDF)
- 🐳 `docker-compose.yml` (MongoDB + ambiente reprodutível)
- 🔧 Scripts de seeding (100k+ produtos)
- 📊 Scripts de queries (5+ consultas complexas)
- 📖 `README.md` detalhado
- 🐍 Aplicação Python (opcional, melhor nota)

### 2. **Relatório Técnico** com 7 secções obrigatórias:
1. Resumo Executivo
2. Análise do Domínio e Padrões de Acesso
3. Justificação Tecnológica (CAP, comparação SGBD)
4. Modelação de Dados (Query-Driven Design)
5. Implementação e Resultados
6. Discussão Crítica (escalabilidade, falhas)
7. Referências Bibliográficas (IEEE)

---

## 👥 DISTRIBUIÇÃO DE TAREFAS (5 Membros)

### **MEMBRO 1 - Américo: ARQUITETO DE DADOS**
**Responsabilidade:** Design da modelação e análise CAP

**Tarefas:**
- [ ] Análise completa do domínio e padrões de acesso
- [ ] Comparação: MongoDB vs. Elasticsearch vs. Cassandra
- [ ] Justificação CAP/PACELC
- [ ] Design do esquema JSON (estrutura de documentos)
- [ ] Estratégias de desnormalização vs. referenciação
- [ ] Plano de indexação

**Deliverables:**
- Documento: `01_ANALISE_DOMINIO.md`
- Documento: `02_JUSTIFICACAO_TECNOLOGICA.md`
- Documento: `03_MODELO_DADOS.md`
- Diagrama JSON das coleções

---

### **MEMBRO 2 - Bengui: ENGENHEIRO DE DADOS (Seeding)**
**Responsabilidade:** População de dados realista e volume

**Tarefas:**
- [ ] Desenhar a estrutura de dados para geração
- [ ] Criar script Python/Node.js para gerar 100k+ produtos
- [ ] Implementar múltiplas categorias (eletrônicos, roupa, livros, etc.)
- [ ] Garantir atributos variáveis por categoria
- [ ] Validação de dados gerados
- [ ] Documentar process de seeding

**Deliverables:**
- Script: `seed_data.py` (ou Node.js)
- Documento: `04_SEEDING_DOCUMENTACAO.md`
- Dados em JSON (amostra de 100 produtos)
- Logs de execução (quantos produtos, tempo, validação)

---

### **MEMBRO 3 - Egas: ESPECIALISTA EM QUERIES**
**Responsabilidade:** Implementação de consultas complexas

**Tarefas:**
- [ ] Implementar 5+ consultas avançadas:
  - Query 1: Busca facetada com múltiplos filtros + ordenação
  - Query 2: Agregação (top 10 produtos por categoria/preço)
  - Query 3: Full-text search com relevância
  - Query 4: Range queries com índices geoespaciais (lojas)
  - Query 5: Agregação complexa (produtos similares)
- [ ] Medir tempos de execução (com e sem índices)
- [ ] Otimizar índices MongoDB
- [ ] Análise de planos de execução

**Deliverables:**
- Script: `queries_avancadas.js` (MongoDB Shell)
- Documento: `05_QUERIES_E_PERFORMANCE.md`
- Análise de latência (tabela comparativa)
- Explicação de índices utilizados

---

### **MEMBRO 4 - Matondo: ENGENHEIRO DE DEVOPS**
**Responsabilidade:** Ambiente Docker e configuração

**Tarefas:**
- [ ] Criar `docker-compose.yml` com MongoDB
- [ ] Configurar replica set (3 nós) para demonstrar replicação
- [ ] Script de inicialização automática
- [ ] Documentação de levantamento do ambiente
- [ ] Testes de failover (simulação de falha)
- [ ] Configuração de volumes para persistência

**Deliverables:**
- Arquivo: `docker-compose.yml`
- Script: `setup.sh` (inicialização)
- Documento: `06_AMBIENTE_DOCKER.md`
- Testes de failover documentados

---

### **MEMBRO 5 - Hermenegildo: COORDENADOR + RELATÓRIO**
**Responsabilidade:** Integração final e redação do relatório

**Tarefas:**
- [ ] Coordenar os 4 membros
- [ ] Integrar todos os componentes no GitHub
- [ ] Redigir Resumo Executivo
- [ ] Redigir Discussão Crítica (escalabilidade 100x, falhas)
- [ ] Compilar Referências Bibliográficas (IEEE)
- [ ] Revisar qualidade académica e formatação
- [ ] Criar README.md com instruções passo-a-passo

**Deliverables:**
- Relatório PDF: `RELATORIO_SGBD_II.pdf` (completo)
- Arquivo: `README.md` (instruções de reprodução)
- Arquivo: `REFERENCIAS.bib` (IEEE)
- Sincronização GitHub

---

## 📅 TIMELINE (4 SEMANAS)

### **Semana 1: Conceção e Planeamento**
- ✅ Escolher subdomínio (FEITO)
- [ ] Américo: Análise do domínio + padrões de acesso (entrega: dia 3)
- [ ] Bengui: Design da estrutura de seeding (entrega: dia 3)
- [ ] Matondo: Setup Docker inicial (entrega: dia 4)
- [ ] Todos: Reunião de alinhamento (dia 5)

### **Semana 2: Modelação e Implementação**
- [ ] Américo: Finalizar justificação tecnológica + modelo JSON (entrega: dia 10)
- [ ] Bengui: Executar seeding (100k+ produtos) (entrega: dia 11)
- [ ] Egas: Começar queries básicas (entrega: dia 11)
- [ ] Matondo: Replica set configurado (entrega: dia 10)
- [ ] Todos: Reunião de progresso (dia 12)

### **Semana 3: Testes e Otimização**
- [ ] Egas: Finalizar queries avançadas + análise de performance (entrega: dia 17)
- [ ] Matondo: Testes de failover + documentação (entrega: dia 17)
- [ ] Bengui: Validação de dados + limpeza (entrega: dia 17)
- [ ] Hermenegildo: Começar rascunho do relatório (entrega: dia 18)
- [ ] Todos: Reunião final de revisão (dia 19)

### **Semana 4: Relatório Final e Entrega**
- [ ] Hermenegildo: Compilar relatório completo (entrega: dia 26)
- [ ] Américo: Revisar seções técnicas (entrega: dia 27)
- [ ] Bengui: Revisar seção de dados (entrega: dia 27)
- [ ] Egas: Revisar seção de queries (entrega: dia 27)
- [ ] Matondo: Revisar seção Docker (entrega: dia 27)
- [ ] Todos: Teste final de reprodução (dia 28)
- [ ] ENTREGA ao Prof. Moyo: dia 28/29

---

## 🎓 CRITÉRIOS DE AVALIAÇÃO

| Critério | Peso | Target |
|----------|------|--------|
| Modelação (Query-Driven Design) | 30% | Estrutura JSON clara, desnormalização justificada |
| Justificação Tecnológica (CAP) | 20% | Análise rigorosa, comparação com alternativas |
| Implementação (Docker, 100k dados, 5+ queries) | 25% | Ambiente reprodutível, queries otimizadas |
| Análise Crítica (escalabilidade, falhas) | 15% | Discussão profunda de CAP em prática |
| Relatório + Apresentação | 10% | Rigor académico, referências IEEE, clareza |

---

## 🔧 FERRAMENTAS E TECNOLOGIAS

| Ferramenta | Uso |
|-----------|-----|
| **MongoDB 7.0+** | SGBD NoSQL principal |
| **Docker + Docker Compose** | Containerização e ambiente reprodutível |
| **Python 3.10+** | Scripts de seeding e testes |
| **MongoDB Shell (mongosh)** | Consultas interativas |
| **GitHub** | Repositório e versionamento |
| **Faker / Mockaroo** | Geração de dados realista |
| **Word / LibreOffice** | Redação do relatório |

---

## 📊 ESTRUTURA DO REPOSITÓRIO GITHUB

```
ecommerce-catalogo-nosql/
├── README.md                          # Instruções de reprodução
├── docker-compose.yml                 # Configuração do MongoDB
├── setup.sh                           # Script de inicialização
│
├── docs/
│   ├── 01_ANALISE_DOMINIO.md         # Padrões de acesso
│   ├── 02_JUSTIFICACAO_TECNOLOGICA.md # CAP, comparações
│   ├── 03_MODELO_DADOS.md            # Esquema JSON
│   ├── 04_SEEDING_DOCUMENTACAO.md    # Geração de dados
│   ├── 05_QUERIES_E_PERFORMANCE.md   # Consultas + análise
│   ├── 06_AMBIENTE_DOCKER.md         # Setup Docker
│   └── RELATORIO_SGBD_II.pdf         # Relatório final
│
├── scripts/
│   ├── seed_data.py                  # Geração de 100k+ produtos
│   ├── queries_avancadas.js          # 5+ consultas MongoDB
│   ├── performance_analysis.py       # Análise de latência
│   └── test_failover.sh              # Testes de falha
│
├── data/
│   ├── sample_products.json          # Amostra de 100 produtos
│   └── categories.json               # Estrutura de categorias
│
└── requirements.txt                  # Dependências Python
```

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **Américo**: Começar a análise do domínio TODAY
2. **Bengui**: Desenhar estrutura de seeding
3. **Egas**: Listar 5 consultas que farão
4. **Matondo**: Criar docker-compose.yml básico
5. **Hermenegildo**: Criar repositório GitHub e sincronizar

---

## 📞 CONTACTO E DÚVIDAS

- **Docente**: teoriepratique@gmail.com
- **Coordenador do Grupo (Hermenegildo)**: [seu email]

---

**BOM TRABALHO! 💪**  
A excelência não reside em conhecer as ferramentas, mas em saber EXATAMENTE QUANDO e PORQUÊ utilizá-las.
