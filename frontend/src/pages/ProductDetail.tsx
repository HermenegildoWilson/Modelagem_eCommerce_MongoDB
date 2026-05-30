import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Box,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import type { Product } from "../api/types";
import { getProduct, getSimilarProducts } from "../api/endpoints/products";
import { Button } from "../components/Button";
import { ProductCard } from "../components/ProductCard";
import { useCartStore } from "../features/cart/store";
import { glassCardSx } from "../theme/sx";
import { formatPrice, productImageFallback } from "../utils/formatters";

export function ProductDetail() {
  const { sku = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadProduct() {
      try {
        setError(null);
        const data = await getProduct(sku);
        setProduct(data);
        const similar = await getSimilarProducts(sku);
        setRelated(similar.results);
      } catch {
        setError("Produto não encontrado ou API indisponível.");
      }
    }

    loadProduct();
  }, [sku]);

  if (error) {
    return (
      <Container maxWidth="md" component="section" sx={{ py: 8 }}>
        <Card sx={{ ...glassCardSx, p: 4, textAlign: "center" }}>
          <Typography sx={{ mb: 2.5, color: "var(--color-danger-soft)" }}>
            {error}
          </Typography>
          <Button variant="secondary">
            <Link to="/catalogo">Voltar ao catálogo</Link>
          </Button>
        </Card>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container
        maxWidth="xl"
        component="section"
        sx={{ py: 8, color: "var(--color-muted)" }}
      >
        Carregando produto...
      </Container>
    );
  }

  const image =
    product.imagem_principal ||
    product.imagens?.[0]?.url ||
    productImageFallback(product.nome);

  return (
    <Container maxWidth="xl" component="section" sx={{ py: 5 }}>
      <Box
        component={Link}
        to="/catalogo"
        sx={{
          mb: 3,
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          borderRadius: 1,
          color: "var(--color-muted)",
          fontSize: "0.875rem",
          outline: "2px solid transparent",
          outlineOffset: 2,
          "&:hover": { color: "var(--color-text)" },
          "&:focus-visible": { outlineColor: "var(--color-accent)" },
        }}
      >
        <ArrowBackRoundedIcon sx={{ fontSize: 18 }} aria-hidden="true" />
        Voltar
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: { lg: "0.95fr 1.05fr" },
        }}
      >
        <Card sx={{ ...glassCardSx, overflow: "hidden", p: 2 }}>
          <Box
            component="img"
            src={image}
            alt={product.nome}
            sx={{
              width: "100%",
              aspectRatio: "4 / 3",
              borderRadius: 1,
              objectFit: "cover",
            }}
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).src =
                productImageFallback(product.nome);
            }}
          />
        </Card>
        <Box sx={{ alignSelf: "center" }}>
          <Typography
            sx={{
              color: "var(--color-accent)",
              fontSize: "0.875rem",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {product.categoria} / {product.subcategoria}
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 1.5,
              color: "var(--color-text)",
              fontSize: { xs: "1.875rem", sm: "3rem" },
              lineHeight: 1.1,
              fontWeight: 800,
            }}
          >
            {product.nome}
          </Typography>
          <Stack
            spacing={1.5}
            sx={{
              mt: 2,
              color: "var(--color-text-soft)",
              direction: "row",
              alignItems: "center",
            }}
          >
            <StarRoundedIcon
              sx={{ color: "var(--color-warning)", fontSize: 24 }}
              aria-hidden="true"
            />
            <Typography>{product.avaliacao.rating_medio.toFixed(1)}</Typography>
            <Typography sx={{ color: "var(--color-muted)" }}>
              ({product.avaliacao.total_avaliacoes} avaliações)
            </Typography>
          </Stack>
          <Typography
            sx={{
              mt: 3,
              color: "var(--color-text)",
              fontSize: "2.5rem",
              fontWeight: 800,
            }}
          >
            {formatPrice(product.preco, product.moeda)}
          </Typography>
          <Typography
            sx={{
              mt: 2.5,
              maxWidth: 680,
              color: "var(--color-muted-strong)",
              lineHeight: 1.75,
            }}
          >
            {product.descricao}
          </Typography>

          <Box
            sx={{
              mt: 3,
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: { sm: "repeat(2, 1fr)" },
            }}
          >
            {Object.entries(product.atributos_dinamicos || {})
              .slice(0, 6)
              .map(([key, value]) => (
                <Box
                  key={key}
                  sx={{
                    border: "1px solid var(--color-border-strong)",
                    bgcolor: "var(--color-surface-muted)",
                    borderRadius: 1,
                    p: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--color-muted)",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {key.replaceAll("_", " ")}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.5,
                      color: "var(--color-text)",
                      fontWeight: 700,
                    }}
                  >
                    {String(value)}
                  </Typography>
                </Box>
              ))}
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 4 }}
          >
            <TextField
              label="Qtd."
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              slotProps={{
                htmlInput: { min: 1, max: Math.max(product.estoque, 1) },
              }}
              sx={{
                width: { sm: 120 },
                "& .MuiInputBase-root": {
                  bgcolor: "var(--color-surface-solid)",
                  color: "var(--color-text)",
                },
                "& .MuiInputLabel-root": { color: "var(--color-muted)" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-border-strong)",
                },
              }}
            />
            <Button
              sx={{ minWidth: { sm: 224 } }}
              disabled={!product.em_stock}
              onClick={() => addItem(product, quantity)}
            >
              Adicionar ao carrinho
            </Button>
          </Stack>
        </Box>
      </Box>

      {related.length ? (
        <Box sx={{ mt: 7 }}>
          <Typography
            component="h2"
            sx={{
              mb: 2.5,
              color: "var(--color-text)",
              fontSize: "1.5rem",
              fontWeight: 800,
            }}
          >
            Produtos similares
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2.5,
              gridTemplateColumns: {
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
            }}
          >
            {related.map((item) => (
              <ProductCard key={item.sku} product={item} />
            ))}
          </Box>
        </Box>
      ) : null}
    </Container>
  );
}
