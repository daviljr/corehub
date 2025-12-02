import Link from "next/link";

export default function SeoPage() {
  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">SEO & Sitemap</h1>
          <p className="text-sm text-slate-500">Local para trabalhar títulos, meta descriptions e sitemap.xml.</p>
        </header>

        <section className="bg-white p-4 rounded-lg shadow">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">Títulos (title)</h4>
              <p className="text-sm text-slate-600">Ex.: Sheidbox — Produtos de Luxo e Viagens</p>
            </div>

            <div>
              <h4 className="font-semibold">Meta description</h4>
              <p className="text-sm text-slate-600">Ex.: Compre pacotes exclusivos e produtos premium — viagem com conforto e guia.</p>
            </div>

            <div>
              <h4 className="font-semibold">Sitemap.xml</h4>
              <p className="text-sm text-slate-600">Gerar lista de URLs principais para indexação.</p>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <Link href="/organize" className="text-teal-600 hover:underline">← Voltar ao painel</Link>
        </div>
      </div>
    </main>
  );
}
