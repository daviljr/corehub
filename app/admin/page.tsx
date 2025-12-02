import Link from "next/link";

export default function AdminIndex() {
  const cards = [
    { href: "/admin/organize", title: "Organização", desc: "Prompts, produtos, pipeline e SEO" },
    { href: "/admin/products", title: "Cadastro de Produtos", desc: "Adicionar e editar produtos da loja" },
    { href: "/admin/prompts", title: "Biblioteca de Prompts", desc: "Armazene prompts de imagens, vídeos e anúncios" },
    { href: "/admin/tarefas", title: "Tarefas & Pipeline", desc: "Gerenciar etapas e progresso de produção" },
    { href: "/admin/seo", title: "SEO & Sitemap", desc: "Gerar títulos, meta tags e sitemap.xml" },
  ];

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel Admin</h1>
            <p className="text-sm text-slate-600">
              Acesso restrito — escolha um módulo para gerenciar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-600 hover:underline">
              Ver site
            </Link>
            <Link
              href="/api/admin/logout"
              className="text-sm bg-red-50 px-3 py-1 rounded text-red-600 hover:bg-red-100"
            >
              Sair
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="block bg-white p-5 rounded shadow hover:shadow-lg transition">
              <h2 className="text-lg font-semibold mb-1">{c.title}</h2>
              <p className="text-sm text-slate-600">{c.desc}</p>
            </Link>
          ))}
        </section>

        <aside className="mt-8">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Status rápido</h3>
            <ul className="text-sm text-slate-600 mt-2">
              <li>Ping API: —</li>
              <li>Supabase (leitura): —</li>
              <li>Último deploy: —</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
