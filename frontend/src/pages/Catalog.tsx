import { SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import { ProductCard } from '../components/ProductCard'
import { ProductSkeleton } from '../components/Skeleton'
import { useProducts } from '../hooks/useProducts'

const categories = ['Eletrônicos', 'Moda', 'Casa', 'Esportes', 'Livros']
const brands = ['Samsung', 'Apple', 'LG', 'Sony', 'Xiaomi']

export function Catalog() {
  const [params] = useSearchParams()
  const [category, setCategory] = useState('Eletrônicos')
  const [brand, setBrand] = useState('Samsung')
  const [maxPrice, setMaxPrice] = useState(50000)
  const search = params.get('q') || ''

  const filters = useMemo(
    () => ({
      categoria: search ? undefined : category,
      marca: search ? undefined : brand,
      preco_min: search ? undefined : 1000,
      preco_max: search ? undefined : maxPrice,
      rating_min: search ? undefined : 3.5,
      search,
      limit: 12,
    }),
    [brand, category, maxPrice, search],
  )

  const { products, total, isLoading, error } = useProducts(filters)

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-[#06D6A0]">Catálogo</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            {search ? `Resultados para "${search}"` : 'Produtos em destaque'}
          </h1>
          <p className="mt-2 text-[#94A3B8]">{total} produtos encontrados na API.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="glass-card h-fit rounded-lg p-5">
          <div className="mb-5 flex items-center gap-2 text-white">
            <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
            <h2 className="font-semibold">Filtros</h2>
          </div>
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm text-[#E2E8F0]">Categoria</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} disabled={!!search} className="focus-ring w-full rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-3 text-white">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-[#E2E8F0]">Marca</span>
              <select value={brand} onChange={(event) => setBrand(event.target.value)} disabled={!!search} className="focus-ring w-full rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-3 text-white">
                {brands.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 flex justify-between text-sm text-[#E2E8F0]">
                Preço máximo <strong>{maxPrice.toLocaleString('pt-AO')} AOA</strong>
              </span>
              <input type="range" min="1000" max="100000" step="1000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} disabled={!!search} className="w-full accent-[#06D6A0]" />
            </label>
          </div>
        </aside>

        <div>
          {error ? (
            <div className="glass-card rounded-lg p-6 text-[#FFB4B4]" role="alert">{error}</div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading ? Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />) : null}
            {!isLoading && products.map((product) => <ProductCard key={product.sku} product={product} />)}
          </div>

          {!isLoading && !products.length && !error ? (
            <div className="glass-card rounded-lg p-8 text-center text-[#94A3B8]">Nenhum produto encontrado.</div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
