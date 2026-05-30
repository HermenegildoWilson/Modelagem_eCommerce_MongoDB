import { CheckCircle2 } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '../components/Button'
import { useCartStore, useCartTotals } from '../features/cart/store'
import { formatPrice } from '../utils/formatters'

export function Checkout() {
  const [success, setSuccess] = useState(false)
  const items = useCartStore((state) => state.items)
  const clear = useCartStore((state) => state.clear)
  const { total } = useCartTotals()

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccess(true)
    clear()
  }

  if (success) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="glass-card rounded-lg p-8 text-center">
          <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-[#06D6A0]" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-white">Pedido confirmado</h1>
          <p className="mt-3 text-[#94A3B8]">Simulação concluída. O backend atual ainda não possui endpoint de pedidos.</p>
          <Button className="mt-6"><Link to="/catalogo">Voltar ao catálogo</Link></Button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Checkout</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submitOrder} className="glass-card grid gap-5 rounded-lg p-6">
          {[
            ['nome', 'Nome completo'],
            ['email', 'Email'],
            ['telefone', 'Telefone'],
            ['endereco', 'Endereço'],
            ['cep', 'CEP'],
          ].map(([name, label]) => (
            <label key={name} className="block">
              <span className="mb-2 block text-sm text-[#E2E8F0]">{label}</span>
              <input required name={name} type={name === 'email' ? 'email' : 'text'} className="focus-ring w-full rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-3 text-white placeholder:text-[#94A3B8]" />
            </label>
          ))}
          <label className="flex items-start gap-3 text-sm text-[#CBD5E1]">
            <input required type="checkbox" className="mt-1 accent-[#06D6A0]" />
            Confirmo os dados e aceito os termos da compra simulada.
          </label>
          <Button disabled={!items.length}>Confirmar pedido</Button>
        </form>

        <aside className="glass-card h-fit rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white">Resumo</h2>
          <div className="mt-5 space-y-3">
            {items.length ? items.map((item) => (
              <div key={item.product.sku} className="flex justify-between gap-4 text-sm">
                <span className="text-[#CBD5E1]">{item.quantity}x {item.product.nome}</span>
                <strong className="text-white">{formatPrice(item.product.preco * item.quantity, item.product.moeda)}</strong>
              </div>
            )) : <p className="text-[#94A3B8]">Carrinho vazio.</p>}
          </div>
          <div className="mt-6 border-t border-[#334155] pt-5">
            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
