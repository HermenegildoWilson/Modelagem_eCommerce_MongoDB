import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Product } from '../../api/types'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity?: number) => void
  removeItem: (sku: string) => void
  updateQuantity: (sku: string, quantity: number) => void
  clear: () => void
  open: () => void
  close: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.sku === product.sku)
          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((item) =>
                item.product.sku === product.sku
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            }
          }
          return { isOpen: true, items: [...state.items, { product, quantity }] }
        }),
      removeItem: (sku) =>
        set((state) => ({ items: state.items.filter((item) => item.product.sku !== sku) })),
      updateQuantity: (sku, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.sku === sku ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: 'ecommerce-cart' },
  ),
)

export function useCartTotals() {
  const count = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  )
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.product.preco * item.quantity, 0),
  )

  return { count, total }
}
