export default function AdminOrganizeIndex() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Organização — Painel</h1>
      <p className="text-slate-600 mb-6">Central de ideias, prompts, tarefas e SEO.</p>
      <div className="grid gap-4">
        <a href="/admin/organize/ideias" className="p-4 bg-white rounded shadow">Ideias</a>
        <a href="/admin/organize/prompts" className="p-4 bg-white rounded shadow">Prompts</a>
        <a href="/admin/organize/tarefas" className="p-4 bg-white rounded shadow">Tarefas</a>
        <a href="/admin/organize/seo" className="p-4 bg-white rounded shadow">SEO</a>
      </div>
    </main>
  );
}
