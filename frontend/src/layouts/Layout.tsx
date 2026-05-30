import { Menu, Search, ShoppingCart, Store, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from "react-router";

import { CartDrawer } from '../components/CartDrawer'
import { useCartStore, useCartTotals } from '../features/cart/store'
import { Button } from '../components/Button'

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

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(`/catalogo?q=${encodeURIComponent(search)}`)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-dvh text-[#E2E8F0]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F172A]/86 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="focus-ring flex items-center gap-2 rounded-lg text-white">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#5B5EFF]">
              <Store className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold">eCommerce</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-2 md:flex" aria-label="Navegação principal">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `focus-ring rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-white/10 text-white' : 'text-[#94A3B8] hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={submitSearch} className="ml-auto hidden min-w-64 max-w-sm flex-1 items-center gap-2 rounded-lg border border-[#334155] bg-[#1E293B]/70 px-3 py-2 lg:flex">
            <Search className="h-4 w-4 text-[#94A3B8]" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar produtos"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#94A3B8]"
              aria-label="Buscar produtos"
            />
          </form>

          <button className="focus-ring relative rounded-lg p-3 hover:bg-white/10" onClick={openCart} aria-label="Abrir carrinho">
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {count ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#06D6A0] px-1 text-xs font-bold text-[#0F172A]">
                {count}
              </span>
            ) : null}
          </button>

          <button className="focus-ring rounded-lg p-3 hover:bg-white/10 md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Abrir menu">
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/10 px-4 py-4 md:hidden">
            <form onSubmit={submitSearch} className="mb-4 flex items-center gap-2 rounded-lg border border-[#334155] bg-[#1E293B]/70 px-3 py-2">
              <Search className="h-4 w-4 text-[#94A3B8]" aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar produtos"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#94A3B8]"
                aria-label="Buscar produtos"
              />
            </form>
            <div className="grid gap-2">
              {links.map((link) => (
                <Button key={link.to} variant="ghost" className="justify-start" onClick={() => setMenuOpen(false)}>
                  <Link to={link.to}>{link.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-[#94A3B8]">
        © {new Date().getFullYear()} Coreon Marketplace. Powered by Coreon.
      </footer>
      <CartDrawer />
    </div>
  )
}
