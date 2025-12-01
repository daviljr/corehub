import Link from "next/link";

const EXAMPLE_PROMPTS = [
  { id: "ultramaster", title: "UltraMax Lifestyle (masculino)", preview: "Prompt para foto noturna urbano com modelo masculino" },
  { id: "studio-prod", title: "Estúdio Preto Fosco (produto)", preview: "Prompt para close-up produto preto fosco" }
];

export default function Page() {
  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Prompts</h1>
          <p className="text-sm text-slate-500">Biblioteca de prompts oficiais. Salve e reutilize.</p>
        </header>

        <section className="space-y-3">
          {EXAMPLE_PROMPTS.map(p => (
            <article key={p.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{p.preview}</p>
              <div className="mt-3">
                <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">/* Prompt completo salvo aqui (exemplo) */</pre>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-6">
          <Link href="/organize" className="text-sky-600 hover:underline">← Voltar ao painel</Link>
        </div>
      </div>
    </main>
  );
}
