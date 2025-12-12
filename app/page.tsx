import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import { getProducts, getCategories } from "@/lib/products";

export default async function Home() {
  // Carregar produtos + categorias diretamente do Supabase
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // 1) Destaques
  const featured = (products || [])
    .filter((p: any) => p.is_featured)
    .slice(0, 4);

  // 2) Categorias visíveis na home (até 8)
  const visibleCategories = (categories || []).slice(0, 8);

  return (
    <div className="space-y-10">

      {/* HERO */}
      <section className="rounded-lg p-8 bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xl">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Sheidbox — Produtos de Luxo e Viagens
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-emerald-100">
            Escolha produtos premium e pacotes de viagem com conforto, segurança e atendimento humano.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/store"
              className="inline-block bg-white text-teal-700 px-5 py-2 rounded-md font-semibold shadow"
            >
              Ver Loja
            </Link>

            <a
              href="#destaques"
              className="inline-block px-5 py-2 border border-white/30 rounded-md text-white/90"
            >
              Destaques
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Categorias</h2>

        {visibleCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {visibleCategories.map((c) => (
              <Link
                key={c.id}
                href={`/store?category=${encodeURIComponent(c.slug)}`}
                className="block p-4 bg-white border rounded shadow-sm hover:shadow-md transition text-center"
              >
                <div className="text-sm font-semibold">{c.name}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-slate-500">Nenhuma categoria disponível no momento.</div>
        )}
      </section>

      {/* DESTAQUES */}
      <section id="destaques" className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Em destaque</h2>
          <Link href="/store" className="text-sm text-slate-600">
            Ver todos
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-slate-500">Nenhum destaque configurado — visite a loja para explorar.</div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto rounded-lg border p-6 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Precisa de ajuda para encontrar o pacote certo?</h3>
            <p className="text-sm text-slate-600">
              Fale conosco e receba atendimento personalizado para a viagem perfeita.
            </p>
          </div>

          <div>
            <Link
              href="/contact"
              className="inline-block px-5 py-2 bg-emerald-600 text-white rounded-md"
            >
              Contato
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}