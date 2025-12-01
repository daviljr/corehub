import Link from "next/link";

export default function IdeiasPage() {
  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Ideias</h1>
          <p className="text-sm text-slate-500">Um lugar para rascunhos, conceitos e inspirações.</p>
        </header>

        <section className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-slate-600">Cole aqui ideias de campanhas, títulos, testes A/B e exemplos de posts.</p>

          <div className="mt-4 space-y-3">
            <article className="p-3 border rounded">
              <h4 className="font-semibold">Ex: Campanha — Pacote Punta 5d</h4>
              <p className="text-sm text-slate-600 mt-1">Rascunho do texto de anúncio, headline e CTA.</p>
            </article>
            <article className="p-3 border rounded">
              <h4 className="font-semibold">Ex: Série posts — Luxo em viagem</h4>
              <p className="text-sm text-slate-600 mt-1">Sequência de 5 posts para redes sociais.</p>
            </article>
          </div>
        </section>

        <div className="mt-6">
          <Link href="/organize" className="text-teal-600 hover:underline">← Voltar ao painel</Link>
        </div>
      </div>
    </main>
  );
}
