import { ArrowLeft, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import type { Product } from '../api/types'
import { getProduct, getSimilarProducts } from '../api/endpoints/products'
import { Button } from '../components/Button'
import { ProductCard } from '../components/ProductCard'
import { useCartStore } from '../features/cart/store'
import { formatPrice, productImageFallback } from '../utils/formatters'

export function ProductDetail() {
  const { sku = '' } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function loadProduct() {
      try {
        setError(null)
        const data = await getProduct(sku)
        setProduct(data)
        const similar = await getSimilarProducts(sku)
        setRelated(similar.results)
      } catch {
        setError('Produto não encontrado ou API indisponível.')
      }
    }

    loadProduct()
  }, [sku])

  if (error) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="glass-card rounded-lg p-8 text-center">
          <p className="mb-5 text-[#FFB4B4]">{error}</p>
          <Button variant="secondary"><Link to="/catalogo">Voltar ao catálogo</Link></Button>
        </div>
      </section>
    )
  }

  if (!product) {
    return <section className="mx-auto max-w-7xl px-4 py-16 text-[#94A3B8]">Carregando produto...</section>
  }

  const image = product.imagem_principal || product.imagens?.[0]?.url || productImageFallback(product.nome)

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/catalogo" className="focus-ring mb-6 inline-flex items-center gap-2 rounded-lg text-sm text-[#94A3B8] hover:text-white">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar
      </Link>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card overflow-hidden rounded-lg p-4">
          <img
            src={image}
            alt={product.nome}
            className="aspect-[4/3] w-full rounded-lg object-cover"
            onError={(event) => {
              event.currentTarget.src = productImageFallback(product.nome)
            }}
          />
        </div>
        <div className="self-center">
          <p className="text-sm font-semibold uppercase tracking-normal text-[#06D6A0]">{product.categoria} / {product.subcategoria}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-5xl">{product.nome}</h1>
          <div className="mt-4 flex items-center gap-3 text-[#E2E8F0]">
            <Star className="h-5 w-5 fill-[#FBBF24] text-[#FBBF24]" aria-hidden="true" />
            <span>{product.avaliacao.rating_medio.toFixed(1)}</span>
            <span className="text-[#94A3B8]">({product.avaliacao.total_avaliacoes} avaliações)</span>
          </div>
          <p className="mt-6 text-4xl font-bold text-white">{formatPrice(product.preco, product.moeda)}</p>
          <p className="mt-5 max-w-2xl leading-8 text-[#CBD5E1]">{product.descricao}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {Object.entries(product.atributos_dinamicos || {}).slice(0, 6).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-[#334155] bg-white/5 p-3">
                <p className="text-xs uppercase text-[#94A3B8]">{key.replaceAll('_', ' ')}</p>
                <p className="mt-1 font-semibold text-white">{String(value)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-3 rounded-lg border border-[#334155] bg-[#1E293B]/70 px-3 py-2">
              <span className="text-sm text-[#94A3B8]">Qtd.</span>
              <input type="number" min="1" max={Math.max(product.estoque, 1)} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="w-20 bg-transparent text-white outline-none" />
            </label>
            <Button className="sm:min-w-56" disabled={!product.em_stock} onClick={() => addItem(product, quantity)}>
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      </div>

      {related.length ? (
        <div className="mt-14">
          <h2 className="mb-5 text-2xl font-bold text-white">Produtos similares</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.sku} product={item} />)}
          </div>
        </div>
      ) : null}
    </section>
  )
}
