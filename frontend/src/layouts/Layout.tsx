import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import {
  AppBar,
  Badge,
  Box,
  Container,
  IconButton,
  InputBase,
  Stack,
  Toolbar,
} from '@mui/material'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from "react-router";

import { CartDrawer } from '../components/CartDrawer'
import { useCartStore, useCartTotals } from '../features/cart/store'
import { Button } from '../components/Button'
import { useAppThemeMode } from '../theme/AppThemeProvider'

const links = [
  { to: '/', label: 'Home' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/checkout', label: 'Checkout' },
]

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const openCart = useCartStore((state) => state.open)
  const { count } = useCartTotals()
  const { mode, toggleMode } = useAppThemeMode()
  const logoSrc = mode === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png'

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(`/catalogo?q=${encodeURIComponent(search)}`)
    setMenuOpen(false)
  }

  return (
    <Box sx={{ minHeight: '100dvh', color: 'var(--color-text-soft)' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          zIndex: 30,
          borderBottom: '1px solid var(--color-border)',
          bgcolor: 'var(--color-surface)',
          backdropFilter: 'blur(18px)',
          color: 'var(--color-text)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 64, gap: { xs: 1, sm: 1.5 }, py: 1.5 }}>
            <Box
              component={Link}
              to="/"
              aria-label="Coreon Marketplace"
              sx={{
                display: 'flex',
                flexShrink: 0,
                alignItems: 'center',
                width: { xs: 132, sm: 172 },
                height: { xs: 42, sm: 48 },
                overflow: 'hidden',
                borderRadius: 1,
                outline: '2px solid transparent',
                outlineOffset: 2,
                '&:focus-visible': { outlineColor: 'var(--color-accent)' },
              }}
            >
              <Box
                component="img"
                src={logoSrc}
                alt="Coreon Marketplace"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: 1,
                }}
              />
            </Box>

            <Stack
              component="nav"
              direction="row"
              spacing={{ md: 0.5, lg: 1 }}
              aria-label="Navegação principal"
              sx={{ display: { xs: 'none', md: 'flex' }, ml: { md: 1, lg: 2 }, minWidth: 0 }}
            >
              {links.map((link) => (
                <Box
                  component={NavLink}
                  key={link.to}
                  to={link.to}
                  sx={{
                    px: { md: 1.25, lg: 1.5 },
                    py: 1,
                    borderRadius: 1,
                    color: 'var(--color-muted)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    outline: '2px solid transparent',
                    outlineOffset: 2,
                    transition: 'background-color 180ms ease, color 180ms ease',
                    '&:hover': { color: 'var(--color-text)' },
                    '&.active': {
                      bgcolor: 'var(--color-surface-muted)',
                      color: 'var(--color-text)',
                    },
                    '&:focus-visible': { outlineColor: 'var(--color-accent)' },
                  }}
                >
                  {link.label}
                </Box>
              ))}
            </Stack>

            <Stack
              direction="row"
              spacing={{ xs: 0.5, sm: 1 }}
              sx={{ ml: 'auto', minWidth: 0, flexShrink: 0, alignItems: 'center', flex: { lg: 1 }, justifyContent: { lg: 'flex-end' } }}
            >
              <Box
                component="form"
                onSubmit={submitSearch}
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  alignItems: 'center',
                  gap: 1.25,
                  flex: 1,
                  maxWidth: { lg: 280, xl: 400 },
                  minWidth: 0,
                  border: '1px solid var(--color-border)',
                  bgcolor: 'color-mix(in srgb, var(--color-surface-solid) 82%, transparent)',
                  borderRadius: 999,
                  px: 1.75,
                  py: 0.75,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  transition: 'border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease',
                  '&:focus-within': {
                    borderColor: 'var(--color-accent)',
                    bgcolor: 'var(--color-surface-solid)',
                    boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-accent) 16%, transparent)',
                  },
                }}
              >
                <SearchRoundedIcon sx={{ fontSize: 19, color: 'var(--color-muted)' }} aria-hidden="true" />
                <InputBase
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar produtos"
                  aria-label="Buscar produtos"
                  sx={{
                    flex: 1,
                    color: 'var(--color-text)',
                    fontSize: '0.875rem',
                    '& input::placeholder': { color: 'var(--color-muted)', opacity: 1 },
                  }}
                />
              </Box>

              <IconButton
                onClick={toggleMode}
                aria-label={mode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1,
                  color: 'var(--color-muted)',
                  '&:hover': {
                    bgcolor: 'var(--color-surface-muted)',
                    color: 'var(--color-text)',
                  },
                }}
              >
                {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
              </IconButton>

              <IconButton
                onClick={openCart}
                aria-label="Abrir carrinho"
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1,
                  color: 'var(--color-text)',
                  '&:hover': { bgcolor: 'var(--color-surface-muted)' },
                }}
              >
                <Badge badgeContent={count || undefined} sx={{ '& .MuiBadge-badge': { bgcolor: 'var(--color-accent)', color: '#fff', fontWeight: 800 } }}>
                  <ShoppingCartRoundedIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>

              <IconButton
                onClick={() => setMenuOpen((value) => !value)}
                aria-label="Abrir menu"
                sx={{
                  display: { md: 'none' },
                  width: 44,
                  height: 44,
                  borderRadius: 1,
                  color: 'var(--color-text)',
                  '&:hover': { bgcolor: 'var(--color-surface-muted)' },
                }}
              >
                {menuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>

        {menuOpen ? (
          <Box sx={{ display: { md: 'none' }, borderTop: '1px solid var(--color-border)', px: 2, py: 2 }}>
            <Box
              component="form"
              onSubmit={submitSearch}
              sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                border: '1px solid var(--color-border)',
                bgcolor: 'color-mix(in srgb, var(--color-surface-solid) 82%, transparent)',
                borderRadius: 999,
                px: 1.75,
                py: 0.75,
                '&:focus-within': {
                  borderColor: 'var(--color-accent)',
                  boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-accent) 16%, transparent)',
                },
              }}
            >
              <SearchRoundedIcon sx={{ fontSize: 19, color: 'var(--color-muted)' }} aria-hidden="true" />
              <InputBase
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar produtos"
                aria-label="Buscar produtos"
                sx={{ flex: 1, color: 'var(--color-text)', fontSize: '0.875rem' }}
              />
            </Box>
            <Stack spacing={1}>
              {links.map((link) => (
                <Button key={link.to} variant="ghost" sx={{ justifyContent: 'flex-start' }} onClick={() => setMenuOpen(false)}>
                  <Link to={link.to}>{link.label}</Link>
                </Button>
              ))}
            </Stack>
          </Box>
        ) : null}
      </AppBar>

      <Box component="main">
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: '1px solid var(--color-border)',
          px: 2,
          py: 4,
          textAlign: 'center',
          color: 'var(--color-muted)',
          fontSize: '0.875rem',
        }}
      >
        © {new Date().getFullYear()} Coreon Marketplace. Powered by Coreon.
      </Box>
      <CartDrawer />
    </Box>
  )
}
