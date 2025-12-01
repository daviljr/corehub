export default function Page() {
  const tasks = [
    { id: 1, title: "Fotos UltraMax (lifestyle)", status: "em progresso" },
    { id: 2, title: "Upload imagens Supabase", status: "pendente" },
    { id: 3, title: "Criar SQL produtos oficiais", status: "concluído" },
  ];

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Tarefas & Pipeline</h1>
          <p className="text-sm text-slate-500">Gerencie etapas de produção dos produtos.</p>
        </header>

        <section className="bg-white p-4 rounded-lg shadow">
          <ul className="space-y-3">
            {tasks.map(t => (
              <li key={t.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-xs text-slate-500">ID {t.id}</div>
                </div>
                <div className="text-sm">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">{t.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
