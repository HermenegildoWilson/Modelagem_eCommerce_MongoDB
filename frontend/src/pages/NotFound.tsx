import { Link } from 'react-router'

import { Button } from '../components/Button'

export function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <div className="glass-card rounded-lg p-8">
        <p className="text-sm font-semibold text-[#06D6A0]">404</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Página não encontrada</h1>
        <p className="mt-3 text-[#94A3B8]">A rota solicitada não existe neste frontend.</p>
        <Button className="mt-6"><Link to="/">Voltar para home</Link></Button>
      </div>
    </section>
  )
}
