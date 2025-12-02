import { getIdeaById } from "@/lib/ideas";
import EditForm from "./edit-form";

type Props = { params: { id: string } };

export default async function EditIdeaPage({ params }: Props) {
  const idea = await getIdeaById(params.id);
  if (!idea) return <div className="p-6">Ideia não encontrada</div>;

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Ideia</h1>
      <EditForm idea={idea} />
    </main>
  );
}
