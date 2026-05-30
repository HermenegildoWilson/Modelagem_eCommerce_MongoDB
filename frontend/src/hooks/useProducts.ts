import { useEffect, useMemo, useState } from 'react'

import { getProducts, searchProducts, type ProductFilters } from '../api/endpoints/products'
import type { Product } from '../api/types'

export function useProducts(filters: ProductFilters & { search?: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const stableFilters = useMemo(() => JSON.stringify(filters), [filters])

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        setIsLoading(true)
        setError(null)
        const parsedFilters = JSON.parse(stableFilters) as ProductFilters & { search?: string }
        const response = parsedFilters.search
          ? await searchProducts(parsedFilters.search, parsedFilters.limit ?? 12)
          : await getProducts(parsedFilters)

        if (!controller.signal.aborted) {
          setProducts(response.results)
          setTotal(response.total)
        }
      } catch {
        if (!controller.signal.aborted) {
          setError('Não foi possível carregar os produtos. Confirma a conexão om a API.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [stableFilters])

  return { products, total, isLoading, error }
}
