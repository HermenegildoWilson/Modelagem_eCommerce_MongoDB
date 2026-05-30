import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'

import { useCartStore, useCartTotals } from '../features/cart/store'
import { formatPrice, productImageFallback } from '../utils/formatters'
import { Button } from './Button'

export function CartDrawer() {
  const { count, total } = useCartTotals()
  const items = useCartStore((state) => state.items)
  const isOpen = useCartStore((state) => state.isOpen)
  const close = useCartStore((state) => state.close)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-[#334155] bg-[#0F172A] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            aria-label="Carrinho de compras"
          >
            <header className="flex items-center justify-between border-b border-[#334155] p-5">
              <div>
                <p className="text-sm text-[#94A3B8]">Carrinho</p>
                <h2 className="text-xl font-semibold text-white">{count} itens</h2>
              </div>
              <button className="focus-ring rounded-full p-2 hover:bg-white/10" onClick={close} aria-label="Fechar carrinho">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-[#94A3B8]">
                  <ShoppingBag className="mb-4 h-12 w-12" aria-hidden="true" />
                  <p>O teu carrinho ainda está vazio.</p>
                </div>
              ) : null}

              {items.map((item) => (
                <div key={item.product.sku} className="grid grid-cols-[72px_1fr] gap-4 rounded-lg bg-white/5 p-3">
                  <img
                    src={item.product.imagem_principal || item.product.imagens?.[0]?.url || productImageFallback(item.product.nome)}
                    alt={item.product.nome}
                    className="h-[72px] w-[72px] rounded-md object-cover"
                    onError={(event) => {
                      event.currentTarget.src = productImageFallback(item.product.nome)
                    }}
                  />
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-sm font-semibold text-white">{item.product.nome}</h3>
                    <p className="mt-1 text-sm text-[#94A3B8]">{formatPrice(item.product.preco, item.product.moeda)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-[#334155]">
                        <button className="focus-ring p-2" onClick={() => updateQuantity(item.product.sku, item.quantity - 1)} aria-label="Diminuir quantidade">
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="w-9 text-center text-sm">{item.quantity}</span>
                        <button className="focus-ring p-2" onClick={() => updateQuantity(item.product.sku, item.quantity + 1)} aria-label="Aumentar quantidade">
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <button className="focus-ring rounded-lg p-2 text-[#FFB4B4] hover:bg-[#FF6B6B]/10" onClick={() => removeItem(item.product.sku)} aria-label="Remover item">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-[#334155] p-5">
              <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button className="w-full" disabled={!items.length} onClick={close}>
                <Link to="/checkout" className="w-full">Finalizar compra</Link>
              </Button>
            </footer>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
