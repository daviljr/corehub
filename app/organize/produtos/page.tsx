import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-sm text-slate-500">Visão geral dos produtos cadastrados (integração Supabase futura).</p>
        </header>

        <section className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-slate-600">Neste painel iremos listar os produtos do Supabase com status (fotos, texto, SEO). Por enquanto mostraremos um resumo estático.</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 border rounded">
              <h3 className="font-semibold">Sheidbox UltraMax Titanium 49mm</h3>
              <div className="text-sm text-slate-600">Status: Em criação • <Link href="/organize/tarefas" className="text-sky-600">pipeline</Link></div>
            </div>
            <div className="p-3 border rounded">
              <h3 className="font-semibold">Jaqueta Imperial Luxe</h3>
              <div className="text-sm text-slate-600">Status: Rascunho</div>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <Link href="/organize" className="text-sky-600 hover:underline">← Voltar ao painel</Link>
        </div>
      </div>
    </main>
  );
}
