# Modelagem_eCommerce_MongoDB
Modelagem de um sistema de eCommerce com MongoDB

## API Django

A API expõe as consultas do `queries_avancadas.js` como endpoints REST, seguindo o desenho orientado por padrões de acesso descrito no relatório: busca facetada, atributos dinâmicos, agregações analíticas e recomendações.

### Organização

```text
eCommerce/
├── apps/
│   └── catalog/          # Endpoints e serviços da API de catálogo
├── config/               # Settings, URLs e WSGI do Django
├── docs/                 # Relatório e documentação do trabalho
├── seed/                 # Geração e inserção de dados no MongoDB
├── manage.py             # Entrada da API Django
├── seed_data.py          # Entrada do script de seed
├── queries_avancadas.js  # Queries originais em mongosh
└── requirements.txt      # Dependências Python
```

### Instalação

```bash
pip install -r requirements.txt
```

Opcionalmente configure a conexão no arquivo `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster0.exemplo.mongodb.net/?appName=Cluster0
MONGODB_DATABASE=ecommerce
MONGODB_COLLECTION=produtos
CORS_ALLOWED_ORIGINS=https://coreonmarket.onrender.com
```

### Executar

```bash
python manage.py runserver
```

### Produção no Render

Use o comando de start abaixo para o serviço web:

```bash
./start.sh
```

Ou configure diretamente:

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

O Render injeta a variável `PORT`; por isso a API precisa escutar em `0.0.0.0:$PORT`, não apenas em `localhost`.

### Endpoints

- `GET /api/` - lista os endpoints disponíveis.
- `GET /api/health/` - verifica conexão com MongoDB.
- `GET /api/products/{sku-ou-objectid}/` - detalhe rápido de produto.
- `GET /api/products/faceted/` - Query 1: busca facetada.
- `GET /api/analytics/category-sales/` - Query 2: vendas por categoria.
- `GET /api/search/?q=samsung smartphone android` - Query 3: busca full-text.
- `GET /api/products/dynamic-attributes/` - Query 4: atributos dinâmicos.
- `GET /api/analytics/profitability/` - Query 5: rentabilidade.
- `GET /api/products/{sku-ou-objectid}/similar/` - Query 6: produtos similares.

Exemplo:

```bash
curl "http://127.0.0.1:8000/api/products/faceted/?categoria=Eletrônicos&marca=Samsung&preco_min=10000&preco_max=50000&limit=20"
```
