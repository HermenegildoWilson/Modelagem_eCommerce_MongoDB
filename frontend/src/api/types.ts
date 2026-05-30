export interface ProductImage {
  url: string
  tipo?: string
  ordem?: number
}

export interface ProductRating {
  rating_medio: number
  total_avaliacoes: number
}

export interface ProductSales {
  total_vendido: number
  vendas_este_mes?: number
  vendas_esta_semana?: number
}

export interface Product {
  _id: string
  sku: string
  nome: string
  descricao: string
  categoria: string
  subcategoria: string
  preco: number
  preco_original?: number
  desconto_percentual?: number
  moeda: string
  atributos_dinamicos: Record<string, string | number | boolean>
  estoque: number
  em_stock: boolean
  avaliacao: ProductRating
  vendas?: ProductSales
  imagens?: ProductImage[]
  imagem_principal?: string
  tags?: string[]
}

export interface FacetedProductsResponse {
  query: string
  conceito: string
  tempo_ms: number
  page: number
  limit: number
  total: number
  results: Product[]
}

export interface ProductFacetOption {
  nome: string
  total: number
}

export interface ProductCategoryFacet {
  categoria: string
  total: number
  marcas: ProductFacetOption[]
}

export interface ProductFacetsResponse {
  query: string
  conceito: string
  tempo_ms: number
  results: ProductCategoryFacet[]
}

export interface SearchResponse {
  query: string
  conceito: string
  termo: string
  tempo_ms: number
  total: number
  results: Product[]
}

export interface HealthResponse {
  status: string
  mongodb: string
  total_produtos: number
}
