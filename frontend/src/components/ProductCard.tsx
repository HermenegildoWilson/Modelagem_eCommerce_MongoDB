import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import { Link } from "react-router";
import { motion } from "framer-motion";

import type { Product } from "../api/types";
import { useCartStore } from "../features/cart/store";
import { glassCardSx } from "../theme/sx";
import { formatPrice, productImageFallback } from "../utils/formatters";
import { Button } from "./Button";

interface ProductCardProps {
  product: Product;
}

const MotionCard = motion(Card);

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const image =
    product.imagem_principal ||
    product.imagens?.[0]?.url ||
    productImageFallback(product.nome);
  //alert(image)

  return (
    <MotionCard
      layout
      whileHover={{ y: -4 }}
      sx={{
        ...glassCardSx,
        overflow: "hidden",
        "&:hover img": { transform: "scale(1.05)" },
      }}
    >
      <Box
        component={Link}
        to={`/produto/${product.sku}`}
        sx={{ display: "block" }}
        aria-label={`Ver ${product.nome}`}
      >
        <Box
          sx={{
            aspectRatio: "4 / 3",
            overflow: "hidden",
            bgcolor: "var(--color-bg-soft)",
          }}
        >
          <Box
            component="img"
            src={image}
            alt={product.nome}
            loading="lazy"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 500ms ease",
            }}
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).src =
                productImageFallback(product.nome);
            }}
          />
        </Box>
      </Box>

      <Stack spacing={0} sx={{ p: 2 }}>
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
          spacing={1.5}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "var(--color-accent)",
              }}
            >
              {product.categoria}
            </Typography>
            <Box component={Link} to={`/produto/${product.sku}`}>
              <Typography
                component="h3"
                sx={{
                  mt: 0.5,
                  minHeight: 48,
                  color: "var(--color-text)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {product.nome}
              </Typography>
            </Box>
          </Box>
          {product.desconto_percentual ? (
            <Chip
              label={`-${product.desconto_percentual}%`}
              size="small"
              sx={{
                bgcolor:
                  "color-mix(in srgb, var(--color-danger) 15%, transparent)",
                color: "var(--color-danger-soft)",
                fontSize: "0.75rem",
                fontWeight: 800,
              }}
            />
          ) : null}
        </Stack>

        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            spacing: 1.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "var(--color-text)",
                fontSize: "1.25rem",
                fontWeight: 800,
              }}
            >
              {formatPrice(product.preco, product.moeda)}
            </Typography>
            {product.preco_original ? (
              <Typography
                sx={{
                  color: "var(--color-muted)",
                  fontSize: "0.75rem",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(product.preco_original, product.moeda)}
              </Typography>
            ) : null}
          </Box>
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              color: "var(--color-text-soft)",
              fontSize: "0.875rem",
            }}
            spacing={0.5}
          >
            <StarRoundedIcon
              sx={{ fontSize: 18, color: "var(--color-warning)" }}
              aria-hidden="true"
            />
            {product.avaliacao?.rating_medio?.toFixed(1) ?? "0.0"}
          </Stack>
        </Stack>

        <Button
          fullWidth
          disabled={!product.em_stock}
          onClick={() => addItem(product)}
          aria-label={`Adicionar ${product.nome} ao carrinho`}
        >
          <ShoppingCartRoundedIcon sx={{ fontSize: 18 }} aria-hidden="true" />
          {product.em_stock ? "Adicionar" : "Sem stock"}
        </Button>
      </Stack>
    </MotionCard>
  );
}
