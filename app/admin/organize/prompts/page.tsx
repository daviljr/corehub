import Link from "next/link";

type Prompt = {
  id: string;
  title: string;
  preview: string;
};

const example: Prompt[] = [
  { id: "p1", title: "Banner Luxo — Viagem", preview: "Fotografia editorial, casal, pôr do sol, luxo..." },
  { id: "p2", title: "Produto — Jaqueta de couro", preview: "Close, textura, iluminação dramática..." },
];

export default function PromptsPage() {
  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Biblioteca de Prompts</h1>
          <p className="text-sm text-slate-500">Salve e reutilize prompts de imagens, vídeos e anúncios.</p>
        </header>

        <section className="bg-white p-4 rounded-lg shadow">
          {example.map((pr) => (
            <article key={pr.id} className="mb-3 p-3 border rounded">
              <h3 className="font-semibold">{pr.title}</h3>
              <pre className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{pr.preview}</pre>
            </article>
          ))}
        </section>

        <div className="mt-6">
          <Link href="/organize" className="text-teal-600 hover:underline">← Voltar ao painel</Link>
        </div>
      </div>
    </main>
  );
}
