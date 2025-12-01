import Link from "next/link";

async function getPing() {
  try {
    const res = await fetch("/api/ping", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Page() {
  const ping = await getPing();

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">Organização • CoreHub</h1>
          <p className="text-sm text-slate-500 mt-1">Painel central — prompts, produtos, tarefas, SEO e ideias.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link href="/organize/prompts" className="p-4 bg-white rounded-lg shadow hover:shadow-md">
            <h2 className="font-semibold">Biblioteca de Prompts</h2>
            <p className="text-sm text-slate-500 mt-2">Centralize prompts de imagens, vídeos e anúncios.</p>
          </Link>
          <Link href="/organize/produtos" className="p-4 bg-white rounded-lg shadow hover:shadow-md">
            <h2 className="font-semibold">Produtos</h2>
            <p className="text-sm text-slate-500 mt-2">Gerencie fichas, status, SQL e imagens hospedadas.</p>
          </Link>
          <Link href="/organize/tarefas" className="p-4 bg-white rounded-lg shadow hover:shadow-md">
            <h2 className="font-semibold">Tarefas & Pipeline</h2>
            <p className="text-sm text-slate-500 mt-2">Acompanhe o progresso do produto (fotos, texto, deploy).</p>
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Status do ambiente</h3>
            <div className="text-sm text-slate-600">
              <div>Ping API: <span className="font-medium">{ping ? "OK" : "Indisponível"}</span></div>
              <div>Supabase (leitura): <span className="font-medium">{ping?.meta?.supabase?.ok ? "OK" : "—"}</span></div>
              <div className="text-xs text-slate-400 mt-2">{ping ? ping.timestamp : "Sem dados"}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Atalhos rápidos</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li><Link href="/organize/prompts" className="text-sky-600 hover:underline">Biblioteca de Prompts</Link></li>
              <li><Link href="/organize/produtos" className="text-sky-600 hover:underline">Gerenciar Produtos</Link></li>
              <li><Link href="/organize/seo" className="text-sky-600 hover:underline">SEO & Sitemap</Link></li>
              <li><Link href="/organize/tarefas" className="text-sky-600 hover:underline">Pipeline</Link></li>
            </ul>
          </div>
        </section>

        <section className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="font-semibold mb-3">Notas rápidas</h3>
          <p className="text-sm text-slate-600">Use este módulo para armazenar prompts oficiais, scripts de venda, SQL e materiais de marketing. Em breve adicionaremos edição inline e upload de arquivos.</p>
        </section>

        <footer className="text-xs text-slate-400 mt-6">
          <div>CoreHub • Organização — versão inicial</div>
        </footer>
      </div>
    </main>
  );
}
