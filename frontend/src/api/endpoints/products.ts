import { apiClient } from '../client'
import type { FacetedProductsResponse, Product, ProductFacetsResponse, SearchResponse } from '../types'

export interface ProductFilters {
  categoria?: string
  marca?: string
  preco_min?: number
  preco_max?: number
  rating_min?: number
  em_stock?: boolean
  page?: number
  limit?: number
}

export async function getProducts(filters: ProductFilters = {}) {
  const response = await apiClient.get<FacetedProductsResponse>('/products/faceted/', {
    params: {
      categoria: filters.categoria || undefined,
      marca: filters.marca || undefined,
      preco_min: filters.preco_min,
      preco_max: filters.preco_max,
      rating_min: filters.rating_min,
      em_stock: filters.em_stock ?? true,
      page: filters.page ?? 1,
      limit: filters.limit ?? 12,
    },
  })
  return response.data
}

export async function getProductFacets() {
  const response = await apiClient.get<ProductFacetsResponse>('/products/facets/')
  return response.data
}

export async function searchProducts(term: string, limit = 12) {
  const response = await apiClient.get<SearchResponse>('/search/', {
    params: { q: term, limit },
  })
  return response.data
}

export async function getProduct(identifier: string) {
  const response = await apiClient.get<Product>(`/products/${identifier}/`)
  return response.data
}

export async function getSimilarProducts(identifier: string, limit = 4) {
  const response = await apiClient.get<SearchResponse>(`/products/${identifier}/similar/`, {
    params: { limit },
  })
  return response.data
}
