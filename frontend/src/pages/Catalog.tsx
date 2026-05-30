import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import { getProductFacets } from '../api/endpoints/products'
import type { ProductCategoryFacet } from '../api/types'
import { ProductCard } from '../components/ProductCard'
import { ProductSkeleton } from '../components/Skeleton'
import { useProducts } from '../hooks/useProducts'

const fallbackFacets: ProductCategoryFacet[] = [
  {
    categoria: 'Eletrônicos',
    total: 0,
    marcas: ['Samsung', 'Apple', 'Xiaomi', 'Huawei', 'OnePlus', 'Motorola', 'Dell', 'HP', 'Lenovo', 'ASUS'].map((nome) => ({ nome, total: 0 })),
  },
  {
    categoria: 'Vestuário',
    total: 0,
    marcas: ['Nike', 'Adidas', 'Puma', 'Zara', 'H&M', "Levi's", 'Converse', 'Vans'].map((nome) => ({ nome, total: 0 })),
  },
  {
    categoria: 'Casa e Cozinha',
    total: 0,
    marcas: ['Tramontina', 'Brinox', 'Noritake', 'Pyrex', 'Madesa', 'MRV', 'Politorno'].map((nome) => ({ nome, total: 0 })),
  },
  {
    categoria: 'Desportos',
    total: 0,
    marcas: ['Nike', 'Adidas', 'Puma', 'Decathlon', 'Umbro'].map((nome) => ({ nome, total: 0 })),
  },
  { categoria: 'Livros', total: 0, marcas: [] },
]

export function Catalog() {
  const [params] = useSearchParams()
  const [category, setCategory] = useState('Eletrônicos')
  const [brand, setBrand] = useState('')
  const [maxPrice, setMaxPrice] = useState(50000)
  const [facets, setFacets] = useState<ProductCategoryFacet[]>(fallbackFacets)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const search = params.get('q') || ''
  const filtersOpen = Boolean(anchorEl)

  useEffect(() => {
    let isMounted = true

    getProductFacets()
      .then((response) => {
        if (isMounted && response.results.length) {
          setFacets(response.results)
        }
      })
      .catch(() => {
        if (isMounted) {
          setFacets(fallbackFacets)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const selectedFacet = useMemo(
    () => facets.find((item) => item.categoria === category) ?? facets[0],
    [category, facets],
  )

  const brandOptions = useMemo(
    () => selectedFacet?.marcas.map((item) => item.nome).filter(Boolean) ?? [],
    [selectedFacet],
  )

  useEffect(() => {
    if (selectedFacet && selectedFacet.categoria !== category) {
      setCategory(selectedFacet.categoria)
      setBrand('')
      return
    }

    if (brand && !brandOptions.includes(brand)) {
      setBrand('')
    }
  }, [brand, brandOptions, category, selectedFacet])

  const filters = useMemo(
    () => ({
      categoria: search ? undefined : category,
      marca: search || !brand ? undefined : brand,
      preco_min: search ? undefined : 1000,
      preco_max: search ? undefined : maxPrice,
      rating_min: search ? undefined : 3.5,
      search,
      limit: 12,
    }),
    [brand, category, maxPrice, search],
  )

  const { products, total, isLoading, error } = useProducts(filters)
  const activeFilters = search ? [] : [category, brand || 'Todas as marcas', `Até ${maxPrice.toLocaleString('pt-AO')} AOA`]

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value)
    setBrand('')
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-[#06D6A0]">Catálogo</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            {search ? `Resultados para "${search}"` : 'Produtos em destaque'}
          </h1>
          <p className="mt-2 text-[#94A3B8]">{total} produtos encontrados na API.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((item) => (
            <Chip
              key={item}
              label={item}
              size="small"
              sx={{ bgcolor: 'rgba(6, 214, 160, 0.12)', color: '#DDFCF4', border: '1px solid rgba(6, 214, 160, 0.22)' }}
            />
          ))}
          <Button
            variant="contained"
            startIcon={<TuneRoundedIcon />}
            onClick={(event) => setAnchorEl(event.currentTarget)}
            disabled={!!search}
            sx={{
              bgcolor: '#06D6A0',
              color: '#06151A',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: '#4AE7BC' },
              '&.Mui-disabled': { bgcolor: 'rgba(148, 163, 184, 0.18)', color: '#94A3B8' },
            }}
          >
            Filtros
          </Button>
        </div>
      </div>

      <Popover
        open={filtersOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: { xs: 'calc(100vw - 32px)', sm: 420 },
              borderRadius: 2,
              border: '1px solid rgba(148, 163, 184, 0.24)',
              bgcolor: '#101B2B',
              color: '#E2E8F0',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
            },
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography fontWeight={700}>Filtros</Typography>
            <IconButton aria-label="Fechar filtros" onClick={() => setAnchorEl(null)} sx={{ color: '#CBD5E1' }}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Stack spacing={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#94A3B8' }}>Categoria</InputLabel>
              <Select<string>
                value={category}
                label="Categoria"
                onChange={handleCategoryChange}
                sx={{
                  color: '#F8FAFC',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#06D6A0' },
                  '.MuiSvgIcon-root': { color: '#CBD5E1' },
                }}
              >
                {facets.map((item) => (
                  <MenuItem key={item.categoria} value={item.categoria}>
                    {item.categoria}{item.total ? ` (${item.total})` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#94A3B8' }}>Marca</InputLabel>
              <Select<string>
                value={brand}
                label="Marca"
                onChange={(event) => setBrand(event.target.value)}
                disabled={!brandOptions.length}
                sx={{
                  color: '#F8FAFC',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#06D6A0' },
                  '.MuiSvgIcon-root': { color: '#CBD5E1' },
                }}
              >
                <MenuItem value="">Todas as marcas</MenuItem>
                {selectedFacet?.marcas.map((item) => (
                  <MenuItem key={item.nome} value={item.nome}>
                    {item.nome}{item.total ? ` (${item.total})` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" color="#CBD5E1">Preço máximo</Typography>
                <Typography variant="body2" fontWeight={700} color="#F8FAFC">{maxPrice.toLocaleString('pt-AO')} AOA</Typography>
              </Stack>
              <Slider
                min={1000}
                max={100000}
                step={1000}
                value={maxPrice}
                onChange={(_, value) => setMaxPrice(Array.isArray(value) ? value[0] : value)}
                sx={{ color: '#06D6A0' }}
              />
            </Box>
          </Stack>
        </Box>
      </Popover>

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
    </section>
  )
}
