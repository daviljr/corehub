import Link from "next/link";

export default function OrganizeHome() {
  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Organização • CoreHub</h1>
          <p className="text-sm text-slate-500">Painel central — prompts, produtos, tarefas, SEO e ideias.</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg">Biblioteca de Prompts</h3>
            <p className="mt-2 text-sm text-slate-600">Centralize prompts de imagens, vídeos e anúncios.</p>
            <div className="mt-4">
              <Link href="/organize/prompts" className="text-teal-600 hover:underline">Abrir biblioteca →</Link>
            </div>
          </article>

          <article className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg">Produtos</h3>
            <p className="mt-2 text-sm text-slate-600">Gerencie fichas, status, SQL e imagens hospedadas.</p>
            <div className="mt-4">
              <Link href="/organize/produtos" className="text-teal-600 hover:underline">Gerenciar produtos →</Link>
            </div>
          </article>

          <article className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg">Tarefas & Pipeline</h3>
            <p className="mt-2 text-sm text-slate-600">Acompanhe o progresso do produto (fotos, texto, deploy).</p>
            <div className="mt-4">
              <Link href="/organize/tarefas" className="text-teal-600 hover:underline">Abrir pipeline →</Link>
            </div>
          </article>

          <article className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg">SEO & Sitemap</h3>
            <p className="mt-2 text-sm text-slate-600">Local para trabalhar títulos, meta descriptions e sitemap.xml.</p>
            <div className="mt-4">
              <Link href="/organize/seo" className="text-teal-600 hover:underline">Abrir SEO →</Link>
            </div>
          </article>
        </section>

        <footer className="mt-8">
          <div className="p-4 bg-white rounded-lg shadow text-sm text-slate-500">
            Status do ambiente
            <div className="mt-2">Ping API: <span className="font-medium">—</span></div>
            <div>Supabase (leitura): <span className="font-medium">—</span></div>
          </div>
        </footer>
      </div>
    </main>
  );
}
