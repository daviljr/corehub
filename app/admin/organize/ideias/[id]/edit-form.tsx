"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditForm({ idea }: any) {
  const [title, setTitle] = useState(idea?.title || "");
  const [description, setDescription] = useState(idea?.description || "");
  const [category, setCategory] = useState(idea?.category || "");
  const [priority, setPriority] = useState(idea?.priority || "");
  const [status, setStatus] = useState(idea?.status || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function save(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ideas", {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ id: idea.id, title, description, category, priority, status })
      });
      if (!res.ok) throw new Error("erro");
      router.push("/admin/organize/ideias");
    } catch (err) {
      alert("Erro ao salvar");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-3 bg-white p-4 rounded shadow">
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
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</button>
        <a href="/admin/organize/ideias" className="px-4 py-2 rounded border">Cancelar</a>
      </div>
    </form>
  );
}
