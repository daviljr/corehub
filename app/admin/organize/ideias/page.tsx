import Link from "next/link";
import { getIdeas } from "@/lib/ideas";

export default async function AdminIdeasList() {
  const ideas = await getIdeas();

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ideias — Central</h1>
        <Link href="/admin/organize/ideias/new" className="bg-teal-600 text-white px-4 py-2 rounded">+ Nova Ideia</Link>
      </header>

      <section className="grid gap-3">
        {ideas.length === 0 && <div className="p-4 bg-white rounded shadow">Nenhuma ideia ainda.</div>}
        {ideas.map((it:any) => (
          <div key={it.id} className="bg-white p-4 rounded shadow flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-lg">{it.title}</h2>
              <div className="text-sm text-slate-600">{it.description ? it.description.substring(0,200) : "—"}</div>
              <div className="mt-2 text-xs text-slate-500">Categoria: {it.category || "—"} · Prioridade: {it.priority || "—"} · Status: {it.status || "—"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href={`/admin/organize/ideias/${it.id}`} className="text-sm bg-slate-100 px-3 py-1 rounded">Editar</Link>
              <button
                className="text-sm bg-red-50 px-3 py-1 rounded text-red-600"
                onClick={async () => {
                  if (!confirm("Deletar esta ideia?")) return;
                  await fetch('/api/admin/ideas', {
                    method: 'DELETE',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({ id: it.id })
                  });
                  // reload
                  location.reload();
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
