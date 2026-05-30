import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

import { Button } from "../components/Button";

const highlights = [
  { label: "Entrega", Icon: Truck },
  { label: "Seguro", Icon: ShieldCheck },
  { label: "Premium", Icon: Sparkles },
];

export function Home() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="self-center"
      >
        <p className="mb-4 inline-flex rounded-full border border-[#06D6A0]/30 bg-[#06D6A0]/10 px-3 py-1 text-sm font-semibold text-[#7FFFE0]">
          Catálogo inteligente com MongoDB
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          eCommerce moderno para explorar produtos, filtros e recomendações.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#CBD5E1]">
          Uma vitrine premium conectada à API Django do trabalho de SGBD, com
          busca facetada, carrinho persistente e checkout simulado.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button>
            <Link to="/catalogo" className="inline-flex items-center gap-2">
              Ver catálogo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button variant="secondary">
            <Link to="/catalogo?q=samsung">Buscar Samsung</Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card overflow-hidden rounded-lg p-5"
      >
        <div className="aspect-[5/4] rounded-lg bg-[linear-gradient(135deg,#111827,#1E293B_45%,#5B5EFF)] p-5">
          <div className="grid h-full grid-rows-[1fr_auto]">
            <div className="grid place-items-center">
              <div className="w-full max-w-sm rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
                <div className="mb-4 h-48 rounded-lg bg-[linear-gradient(135deg,#06D6A0,#5B5EFF)]" />
                <div className="h-4 w-28 rounded bg-white/40" />
                <div className="mt-3 h-6 w-full rounded bg-white/70" />
                <div className="mt-5 flex items-center justify-between">
                  <div className="h-8 w-32 rounded bg-white/80" />
                  <div className="h-11 w-28 rounded-lg bg-[#06D6A0]" />
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map(({ label, Icon }) => (
                <div key={label} className="rounded-lg bg-black/25 p-3">
                  <Icon
                    className="mb-2 h-5 w-5 text-[#06D6A0]"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-white">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
