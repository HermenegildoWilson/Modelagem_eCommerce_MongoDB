import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Popover,
  Select,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { getProductFacets } from "../api/endpoints/products";
import type { ProductCategoryFacet } from "../api/types";
import { ProductCard } from "../components/ProductCard";
import { ProductSkeleton } from "../components/Skeleton";
import { useProducts } from "../hooks/useProducts";
import { glassCardSx } from "../theme/sx";

const fallbackFacets: ProductCategoryFacet[] = [
  {
    categoria: "Eletrônicos",
    total: 0,
    marcas: [
      "Samsung",
      "Apple",
      "Xiaomi",
      "Huawei",
      "OnePlus",
      "Motorola",
      "Dell",
      "HP",
      "Lenovo",
      "ASUS",
    ].map((nome) => ({ nome, total: 0 })),
  },
  {
    categoria: "Vestuário",
    total: 0,
    marcas: [
      "Nike",
      "Adidas",
      "Puma",
      "Zara",
      "H&M",
      "Levi's",
      "Converse",
      "Vans",
    ].map((nome) => ({ nome, total: 0 })),
  },
  {
    categoria: "Casa e Cozinha",
    total: 0,
    marcas: [
      "Tramontina",
      "Brinox",
      "Noritake",
      "Pyrex",
      "Madesa",
      "MRV",
      "Politorno",
    ].map((nome) => ({ nome, total: 0 })),
  },
  {
    categoria: "Desportos",
    total: 0,
    marcas: ["Nike", "Adidas", "Puma", "Decathlon", "Umbro"].map((nome) => ({
      nome,
      total: 0,
    })),
  },
  { categoria: "Livros", total: 0, marcas: [] },
];

export function Catalog() {
  const [params] = useSearchParams();
  const [category, setCategory] = useState("Eletrônicos");
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [facets, setFacets] = useState<ProductCategoryFacet[]>(fallbackFacets);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const search = params.get("q") || "";
  const filtersOpen = Boolean(anchorEl);

  useEffect(() => {
    let isMounted = true;

    getProductFacets()
      .then((response) => {
        if (isMounted && response.results.length) {
          setFacets(response.results);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFacets(fallbackFacets);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedFacet = useMemo(
    () => facets.find((item) => item.categoria === category) ?? facets[0],
    [category, facets],
  );

  const brandOptions = useMemo(
    () => selectedFacet?.marcas.map((item) => item.nome).filter(Boolean) ?? [],
    [selectedFacet],
  );

  useEffect(() => {
    if (selectedFacet && selectedFacet.categoria !== category) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategory(selectedFacet.categoria);
      setBrand("");
      return;
    }

    if (brand && !brandOptions.includes(brand)) {
      setBrand("");
    }
  }, [brand, brandOptions, category, selectedFacet]);

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
  );

  const { products, total, isLoading, error } = useProducts(filters);
  const activeFilters = search
    ? []
    : [
        category,
        brand || "Todas as marcas",
        `Até ${maxPrice.toLocaleString("pt-AO")} AOA`,
      ];
  const selectMenuProps = {
    slotProps: {
      paper: {
        sx: {
          bgcolor: "var(--color-surface-solid)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-popover)",
        },
      },
    },
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
    setBrand("");
  };

  return (
    <Container maxWidth="xl" component="section" sx={{ py: 5 }}>
      <Stack
        spacing={2}
        sx={{ 
          mb: 3,
          justifyContent: "space-between",
          direction: {xs: "column", lg: "row"},
          alignItems: {lg: "flex-end"},
         }}
      >
        <Box>
          <Typography
            sx={{
              color: "var(--color-accent)",
              fontSize: "0.875rem",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Catálogo
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 1,
              color: "var(--color-text)",
              fontSize: { xs: "1.875rem", sm: "2.25rem" },
              fontWeight: 800,
            }}
          >
            {search ? `Resultados para "${search}"` : "Produtos em destaque"}
          </Typography>
          <Typography sx={{ mt: 1, color: "var(--color-muted)" }}>
            {total} produtos encontrados na API.
          </Typography>
        </Box>
        <Stack
          sx={{ direction: "row", flexWrap: "wrap", alignItems: "center" }}
          useFlexGap
          spacing={1}
        >
          {activeFilters.map((item) => (
            <Chip
              key={item}
              label={item}
              size="small"
              sx={{
                bgcolor:
                  "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                color: "var(--color-accent-soft)",
                border:
                  "1px solid color-mix(in srgb, var(--color-accent) 22%, transparent)",
              }}
            />
          ))}
          <Button
            variant="contained"
            startIcon={<TuneRoundedIcon />}
            size="small"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            disabled={!!search}
            sx={{
              minWidth: "auto",
              minHeight: 34,
              bgcolor: "var(--color-accent)",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 999,
              textTransform: "none",
              fontSize: "0.8125rem",
              lineHeight: 1,
              px: 1.5,
              py: 0.75,
              "& .MuiButton-startIcon": {
                mr: 0.75,
                "& svg": { fontSize: 18 },
              },
              "&:hover": { bgcolor: "var(--color-accent-soft)" },
              "&.Mui-disabled": {
                bgcolor:
                  "color-mix(in srgb, var(--color-muted) 18%, transparent)",
                color: "var(--color-muted)",
              },
            }}
          >
            Filtros
          </Button>
        </Stack>
      </Stack>

      <Popover
        open={filtersOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: { xs: "calc(100vw - 32px)", sm: 420 },
              borderRadius: 2,
              border: "1px solid var(--color-border)",
              bgcolor: "var(--color-surface-solid)",
              color: "var(--color-text-soft)",
              boxShadow: "var(--shadow-popover)",
            },
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Stack
            sx={{
              mb: 2,
              direction: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>Filtros</Typography>
            <IconButton
              aria-label="Fechar filtros"
              onClick={() => setAnchorEl(null)}
              sx={{ color: "var(--color-muted-strong)" }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Stack spacing={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "var(--color-muted)" }}>
                Categoria
              </InputLabel>
              <Select<string>
                value={category}
                label="Categoria"
                onChange={handleCategoryChange}
                MenuProps={selectMenuProps}
                sx={{
                  color: "var(--color-text)",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-border-strong)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-accent)",
                  },
                  ".MuiSvgIcon-root": { color: "var(--color-muted-strong)" },
                }}
              >
                {facets.map((item) => (
                  <MenuItem key={item.categoria} value={item.categoria}>
                    {item.categoria}
                    {item.total ? ` (${item.total})` : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "var(--color-muted)" }}>
                Marca
              </InputLabel>
              <Select<string>
                value={brand}
                label="Marca"
                onChange={(event) => setBrand(event.target.value)}
                disabled={!brandOptions.length}
                MenuProps={selectMenuProps}
                sx={{
                  color: "var(--color-text)",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-border-strong)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-accent)",
                  },
                  ".MuiSvgIcon-root": { color: "var(--color-muted-strong)" },
                }}
              >
                <MenuItem value="">Todas as marcas</MenuItem>
                {selectedFacet?.marcas.map((item) => (
                  <MenuItem key={item.nome} value={item.nome}>
                    {item.nome}
                    {item.total ? ` (${item.total})` : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Stack
                sx={{
                  mb: 1,
                  direction: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ color: "var(--color-muted-strong)" }}>
                  Preço máximo
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "var(--color-text)",
                  }}
                >
                  {maxPrice.toLocaleString("pt-AO")} AOA
                </Typography>
              </Stack>
              <Slider
                min={1000}
                max={100000}
                step={1000}
                value={maxPrice}
                onChange={(_, value) =>
                  setMaxPrice(Array.isArray(value) ? value[0] : value)
                }
                sx={{ color: "var(--color-accent)" }}
              />
            </Box>
          </Stack>
        </Box>
      </Popover>

      <Box>
        {error ? (
          <Paper
            role="alert"
            sx={{
              ...glassCardSx,
              p: 3,
              mb: 3,
              color: "var(--color-danger-soft)",
            }}
          >
            {error}
          </Paper>
        ) : null}

        <Box
          sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: {
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : null}
          {!isLoading &&
            products.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
        </Box>

        {!isLoading && !products.length && !error ? (
          <Paper
            sx={{
              ...glassCardSx,
              p: 4,
              mt: 3,
              textAlign: "center",
              color: "var(--color-muted)",
            }}
          >
            Nenhum produto encontrado.
          </Paper>
        ) : null}
      </Box>
    </Container>
  );
}
