import Link from "next/link";

type Task = { id: number; title: string; status: string };

export default function TarefasPage() {
  const tasks: Task[] = [
    { id: 1, title: "Fotos Ultramax (lifestyle)", status: "em-progresso" },
    { id: 2, title: "Upload imagens Supabase", status: "pendente" },
    { id: 3, title: "Criar SQL produtos oficiais", status: "concluido" },
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
            {tasks.map((t) => (
              <li key={t.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-sm text-slate-500">ID: {t.id}</div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-sm">{t.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6">
          <Link href="/organize" className="text-teal-600 hover:underline">← Voltar ao painel</Link>
        </div>
      </div>
    </main>
  );
}
