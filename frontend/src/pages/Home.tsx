import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Box, Card, Container, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router";

import { Button } from "../components/Button";
import { glassCardSx } from "../theme/sx";

const highlights = [
  { label: "Entrega", Icon: LocalShippingRoundedIcon },
  { label: "Seguro", Icon: SecurityRoundedIcon },
  { label: "Premium", Icon: AutoAwesomeRoundedIcon },
];

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export function Home() {
  return (
    <Container maxWidth="xl" component="section" sx={{ py: { xs: 6, lg: 10 } }}>
      <Box
        sx={{
          display: "grid",
          gap: 5,
          gridTemplateColumns: { lg: "1.05fr 0.95fr" },
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          sx={{ alignSelf: "center" }}
        >
          <Typography
            sx={{
              mb: 2,
              display: "inline-flex",
              border:
                "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
              bgcolor:
                "color-mix(in srgb, var(--color-accent) 10%, transparent)",
              borderRadius: 999,
              px: 1.5,
              py: 0.5,
              color: "var(--color-accent-soft)",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            Catálogo inteligente com MongoDB
          </Typography>
          <Typography
            component="h1"
            sx={{
              maxWidth: 880,
              color: "var(--color-text)",
              fontSize: { xs: "2.5rem", sm: "3rem", lg: "3.75rem" },
              lineHeight: 1.08,
              fontWeight: 800,
            }}
          >
            eCommerce moderno para explorar produtos, filtros e recomendações.
          </Typography>
          <Typography
            sx={{
              mt: 2.5,
              maxWidth: 680,
              color: "var(--color-muted-strong)",
              fontSize: "1.125rem",
              lineHeight: 1.75,
            }}
          >
            Uma vitrine premium conectada à API Django do trabalho de SGBD, com
            busca facetada, carrinho persistente e checkout simulado.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 4 }}
          >
            <Button>
              <Link
                to="/catalogo"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                Ver catálogo
                <ArrowForwardRoundedIcon
                  sx={{ fontSize: 18 }}
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button variant="secondary">
              <Link to="/catalogo?q=samsung">Buscar Samsung</Link>
            </Button>
          </Stack>
        </MotionBox>

        <MotionCard
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          sx={{
            ...glassCardSx,
            overflow: "hidden",
            p: 2.5,
          }}
        >
          <Box
            sx={{
              aspectRatio: "5 / 4",
              borderRadius: 1,
              bgcolor: "var(--color-bg-soft)",
              background:
                "linear-gradient(135deg, var(--color-bg-soft), var(--color-surface-solid) 45%, var(--color-primary))",
              p: 2.5,
            }}
          >
            <Box
              sx={{
                display: "grid",
                height: "100%",
                gridTemplateRows: "1fr auto",
                gap: 2,
              }}
            >
              <Box sx={{ display: "grid", placeItems: "center" }}>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 384,
                    border: "1px solid rgba(255,255,255,0.15)",
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderRadius: 1,
                    p: 2.5,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      height: 192,
                      borderRadius: 1,
                      background:
                        "linear-gradient(135deg, var(--color-accent), var(--color-primary))",
                    }}
                  />
                  <Box
                    sx={{
                      width: 112,
                      height: 16,
                      borderRadius: 0.5,
                      bgcolor: "rgba(255,255,255,0.4)",
                    }}
                  />
                  <Box
                    sx={{
                      mt: 1.5,
                      width: "100%",
                      height: 24,
                      borderRadius: 0.5,
                      bgcolor: "rgba(255,255,255,0.7)",
                    }}
                  />
                  <Stack
                    sx={{
                      mt: 2.5,
                      direction: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        width: 128,
                        height: 32,
                        borderRadius: 0.5,
                        bgcolor: "rgba(255,255,255,0.8)",
                      }}
                    />
                    <Box
                      sx={{
                        width: 112,
                        height: 44,
                        borderRadius: 1,
                        bgcolor: "var(--color-accent)",
                      }}
                    />
                  </Stack>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: { sm: "repeat(3, 1fr)" },
                }}
              >
                {highlights.map(({ label, Icon }) => (
                  <Box
                    key={label}
                    sx={{
                      borderRadius: 1,
                      bgcolor: "rgba(0,0,0,0.25)",
                      p: 1.5,
                    }}
                  >
                    <Icon
                      sx={{ mb: 1, fontSize: 22, color: "var(--color-accent)" }}
                      aria-hidden="true"
                    />
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </MotionCard>
      </Box>
    </Container>
  );
}
