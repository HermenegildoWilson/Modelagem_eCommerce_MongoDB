# eCommerce Frontend

Frontend React + TypeScript para consumir a API Django/MongoDB do projeto.

## Rodar localmente

```bash
npm install
npm run dev
```

O Vite sobe normalmente em `http://127.0.0.1:5173`.

Antes disso, rode o backend Django em outro terminal:

```bash
cd ../backend
python manage.py runserver
```

O frontend usa `VITE_API_BASE_URL=/api` e o proxy do Vite encaminha chamadas para `http://127.0.0.1:8000`.

## Rotas

- `/` - página inicial
- `/catalogo` - catálogo com filtros consumindo `/api/products/faceted/`
- `/catalogo?q=samsung` - busca consumindo `/api/search/`
- `/produto/:sku` - detalhe e similares
- `/checkout` - checkout simulado com carrinho local

## Observação

Carrinho e checkout são client-side porque o backend atual expõe apenas catálogo, busca, analytics e recomendações.
