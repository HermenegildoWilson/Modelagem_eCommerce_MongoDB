import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router";

import { useCartStore, useCartTotals } from "../features/cart/store";
import { formatPrice, productImageFallback } from "../utils/formatters";
import { Button } from "./Button";

const backdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 40,
  backgroundColor: "rgba(0, 0, 0, 0.45)",
};

const drawerStyle: CSSProperties = {
  position: "fixed",
  right: 0,
  top: 0,
  zIndex: 50,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 448,
  height: "100dvh",
  borderLeft: "1px solid var(--color-border-strong)",
  backgroundColor: "var(--color-bg)",
  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
};

export function CartDrawer() {
  const { count, total } = useCartTotals();
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const close = useCartStore((state) => state.close);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            style={backdropStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            style={drawerStyle}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            aria-label="Carrinho de compras"
          >
            <Stack
              sx={{
                p: 2.5,
                borderBottom: "1px solid var(--color-border-strong)",
                component: "header",
                direction: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{ color: "var(--color-muted)", fontSize: "0.875rem" }}
                >
                  Carrinho
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    color: "var(--color-text)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                  }}
                >
                  {count} itens
                </Typography>
              </Box>
              <IconButton
                onClick={close}
                aria-label="Fechar carrinho"
                sx={{
                  color: "var(--color-text)",
                  "&:hover": { bgcolor: "var(--color-surface-muted)" },
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Stack>

            <Stack spacing={2} sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
              {items.length === 0 ? (
                <Stack
                  sx={{
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "var(--color-muted)",
                  }}
                >
                  <ShoppingBagRoundedIcon
                    sx={{ mb: 2, fontSize: 48 }}
                    aria-hidden="true"
                  />
                  <Typography>O teu carrinho ainda está vazio.</Typography>
                </Stack>
              ) : null}

              {items.map((item) => (
                <Box
                  key={item.product.sku}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr",
                    gap: 2,
                    borderRadius: 1,
                    bgcolor: "var(--color-surface-muted)",
                    p: 1.5,
                  }}
                >
                  <Box
                    component="img"
                    src={
                      item.product.imagem_principal ||
                      item.product.imagens?.[0]?.url ||
                      productImageFallback(item.product.nome)
                    }
                    alt={item.product.nome}
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 0.75,
                      objectFit: "cover",
                    }}
                    onError={(event) => {
                      (event.currentTarget as HTMLImageElement).src =
                        productImageFallback(item.product.nome);
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "var(--color-text)",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                      }}
                    >
                      {item.product.nome}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.5,
                        color: "var(--color-muted)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {formatPrice(item.product.preco, item.product.moeda)}
                    </Typography>
                    <Stack
                      sx={{
                        mt: 1.5,
                        direction: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Stack
                        sx={{
                          direction: "row",
                          alignItems: "center",
                          border: "1px solid var(--color-border-strong)",
                          borderRadius: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item.product.sku, item.quantity - 1)
                          }
                          aria-label="Diminuir quantidade"
                          sx={{ color: "var(--color-text)" }}
                        >
                          <RemoveRoundedIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{
                            width: 36,
                            textAlign: "center",
                            fontSize: "0.875rem",
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item.product.sku, item.quantity + 1)
                          }
                          aria-label="Aumentar quantidade"
                          sx={{ color: "var(--color-text)" }}
                        >
                          <AddRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <IconButton
                        onClick={() => removeItem(item.product.sku)}
                        aria-label="Remover item"
                        sx={{
                          color: "var(--color-danger-soft)",
                          borderRadius: 1,
                          "&:hover": {
                            bgcolor:
                              "color-mix(in srgb, var(--color-danger) 10%, transparent)",
                          },
                        }}
                      >
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Stack>

            <Box
              component="footer"
              sx={{ p: 2.5, borderTop: "1px solid var(--color-border-strong)" }}
            >
              <Stack
                sx={{
                  mb: 2,
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  direction: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: "1.125rem", fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography sx={{ fontSize: "1.125rem", fontWeight: 700 }}>
                  {formatPrice(total)}
                </Typography>
              </Stack>
              <Button fullWidth disabled={!items.length} onClick={close}>
                <Link to="/checkout" style={{ width: "100%" }}>
                  Finalizar compra
                </Link>
              </Button>
            </Box>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
