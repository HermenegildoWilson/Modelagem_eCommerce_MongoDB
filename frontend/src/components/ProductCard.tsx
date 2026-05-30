import { ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'

import type { Product } from '../api/types'
import { useCartStore } from '../features/cart/store'
import { formatPrice, productImageFallback } from '../utils/formatters'
import { Button } from './Button'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const image = product.imagem_principal || product.imagens?.[0]?.url || productImageFallback(product.nome)
  //alert(image)

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      className="glass-card group overflow-hidden rounded-lg"
    >
      <Link to={`/produto/${product.sku}`} className="block" aria-label={`Ver ${product.nome}`}>
        <div className="aspect-[4/3] overflow-hidden bg-[#111827]">
          <img
            src={image}
            alt={product.nome}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.src = productImageFallback(product.nome)
            }}
          />
        </div>
      </Link>

      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-normal text-[#06D6A0]">
              {product.categoria}
            </p>
            <Link to={`/produto/${product.sku}`}>
              <h3 className="mt-1 line-clamp-2 min-h-12 text-base font-semibold text-white">
                {product.nome}
              </h3>
            </Link>
          </div>
          {product.desconto_percentual ? (
            <span className="rounded-full bg-[#FF6B6B]/15 px-2 py-1 text-xs font-bold text-[#FFB4B4]">
              -{product.desconto_percentual}%
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-white">{formatPrice(product.preco, product.moeda)}</p>
            {product.preco_original ? (
              <p className="text-xs text-[#94A3B8] line-through">
                {formatPrice(product.preco_original, product.moeda)}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-sm text-[#E2E8F0]">
            <Star className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" aria-hidden="true" />
            {product.avaliacao?.rating_medio?.toFixed(1) ?? '0.0'}
          </div>
        </div>

        <Button
          className="w-full"
          disabled={!product.em_stock}
          onClick={() => addItem(product)}
          aria-label={`Adicionar ${product.nome} ao carrinho`}
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          {product.em_stock ? 'Adicionar' : 'Sem stock'}
        </Button>
      </div>
    </motion.article>
  )
}
