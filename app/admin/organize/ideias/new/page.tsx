"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewIdea() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ideas", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ title, description, category, priority, status })
      });
      if (!res.ok) throw new Error("Erro");
      router.push("/admin/organize/ideias");
    } catch (err) {
      alert("Erro ao criar");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nova Ideia</h1>
      <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
        <label className="block">
          <div className="text-sm font-medium">Título</div>
          <input className="w-full border px-3 py-2 rounded" value={title} onChange={e=>setTitle(e.target.value)} required />
        </label>

        <label className="block">
          <div className="text-sm font-medium">Descrição</div>
          <textarea className="w-full border px-3 py-2 rounded" value={description} onChange={e=>setDescription(e.target.value)} rows={6} />
        </label>

        <div className="grid grid-cols-3 gap-2">
          <input placeholder="Categoria" className="border px-3 py-2 rounded" value={category} onChange={e=>setCategory(e.target.value)} />
          <input placeholder="Prioridade" className="border px-3 py-2 rounded" value={priority} onChange={e=>setPriority(e.target.value)} />
          <input placeholder="Status" className="border px-3 py-2 rounded" value={status} onChange={e=>setStatus(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? "Criando..." : "Criar"}</button>
          <a href="/admin/organize/ideias" className="px-4 py-2 rounded border">Cancelar</a>
        </div>
      </form>
    </main>
  );
}
