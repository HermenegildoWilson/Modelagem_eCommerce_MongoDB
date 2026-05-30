import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import {
  Box,
  Card,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router";

import { Button } from "../components/Button";
import { useCartStore, useCartTotals } from "../features/cart/store";
import { glassCardSx } from "../theme/sx";
import { formatPrice } from "../utils/formatters";

const fields = [
  ["nome", "Nome completo"],
  ["email", "Email"],
  ["telefone", "Telefone"],
  ["endereco", "Endereço"],
  ["cep", "CEP"],
];

const inputStyles = {
  "& .MuiInputBase-root": {
    bgcolor: "var(--color-surface-solid)",
    color: "var(--color-text)",
  },
  "& .MuiInputLabel-root": { color: "var(--color-muted)" },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-border-strong)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-accent)",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-accent)",
  },
};

export function Checkout() {
  const [success, setSuccess] = useState(false);
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const { total } = useCartTotals();

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(true);
    clear();
  }

  if (success) {
    return (
      <Container maxWidth="md" component="section" sx={{ py: 8 }}>
        <Card sx={{ ...glassCardSx, p: 4, textAlign: "center" }}>
          <CheckCircleRoundedIcon
            sx={{ mb: 2.5, fontSize: 56, color: "var(--color-accent)" }}
            aria-hidden="true"
          />
          <Typography
            component="h1"
            sx={{
              color: "var(--color-text)",
              fontSize: "1.875rem",
              fontWeight: 800,
            }}
          >
            Pedido confirmado
          </Typography>
          <Typography sx={{ mt: 1.5, color: "var(--color-muted)" }}>
            Simulação concluída. O backend atual ainda não possui endpoint de
            pedidos.
          </Typography>
          <Button sx={{ mt: 3 }}>
            <Link to="/catalogo">Voltar ao catálogo</Link>
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" component="section" sx={{ py: 5 }}>
      <Typography
        component="h1"
        sx={{
          color: "var(--color-text)",
          fontSize: { xs: "1.875rem", sm: "2.25rem" },
          fontWeight: 800,
        }}
      >
        Checkout
      </Typography>
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gap: 3,
          gridTemplateColumns: { lg: "1fr 380px" },
        }}
      >
        <Card
          component="form"
          onSubmit={submitOrder}
          sx={{ ...glassCardSx, display: "grid", gap: 2.5, p: 3 }}
        >
          {fields.map(([name, label]) => (
            <TextField
              key={name}
              required
              name={name}
              type={name === "email" ? "email" : "text"}
              label={label}
              fullWidth
              sx={inputStyles}
            />
          ))}
          <FormControlLabel
            control={
              <Checkbox
                required
                sx={{
                  color: "var(--color-muted)",
                  "&.Mui-checked": { color: "var(--color-accent)" },
                }}
              />
            }
            label="Confirmo os dados e aceito os termos da compra simulada."
            sx={{
              color: "var(--color-muted-strong)",
              alignItems: "flex-start",
              "& .MuiFormControlLabel-label": { fontSize: "0.875rem", pt: 1 },
            }}
          />
          <Button disabled={!items.length}>Confirmar pedido</Button>
        </Card>

        <Card
          component="aside"
          sx={{ ...glassCardSx, height: "fit-content", p: 3 }}
        >
          <Typography
            component="h2"
            sx={{
              color: "var(--color-text)",
              fontSize: "1.25rem",
              fontWeight: 700,
            }}
          >
            Resumo
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {items.length ? (
              items.map((item) => (
                <Stack
                  key={item.product.sku}
                  spacing={2}
                  sx={{
                    fontSize: "0.875rem",
                    direction: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--color-muted-strong)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {item.quantity}x {item.product.nome}
                  </Typography>
                  <Typography
                    component="strong"
                    sx={{
                      color: "var(--color-text)",
                      fontSize: "0.875rem",
                      fontWeight: 800,
                    }}
                  >
                    {formatPrice(
                      item.product.preco * item.quantity,
                      item.product.moeda,
                    )}
                  </Typography>
                </Stack>
              ))
            ) : (
              <Typography sx={{ color: "var(--color-muted)" }}>
                Carrinho vazio.
              </Typography>
            )}
          </Stack>
          <Divider
            sx={{ mt: 3, mb: 2.5, borderColor: "var(--color-border-strong)" }}
          />
          <Stack
            sx={{
              color: "var(--color-text)",
              direction: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontSize: "1.125rem", fontWeight: 800 }}>
              Total
            </Typography>
            <Typography sx={{ fontSize: "1.125rem", fontWeight: 800 }}>
              {formatPrice(total)}
            </Typography>
          </Stack>
        </Card>
      </Box>
    </Container>
  );
}
