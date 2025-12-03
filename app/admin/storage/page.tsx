"use client";
import { useEffect, useState } from "react";

type StorageRef = {
  id: string;
  name: string;
  type: string;
  base_url?: string;
  public_key?: string;
  private_key?: string;
  priority?: number;
  created_at?: string;
};

export default function AdminStoragePage() {
  const [list, setList] = useState<StorageRef[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "supabase",
    base_url: "",
    public_key: "",
    private_key: "",
    priority: "0",
  });
  const [err, setErr] = useState<string | null>(null);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch("/api/storage/list");
      const j = await res.json();
      if (res.ok && j.data) setList(j.data);
      else setErr(j.error || "Erro ao listar storages");
    } catch (e:any) {
      setErr(e.message || "Erro de rede");
    } finally { setLoading(false); }
  }

  useEffect(()=>{ fetchList(); },[]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        type: form.type,
        base_url: form.base_url || null,
        public_key: form.public_key || null,
        private_key: form.private_key || null,
        priority: parseInt(form.priority || "0", 10),
      };
      const res = await fetch("/api/storage/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        setErr(j.error || "Erro ao salvar");
      } else {
        setForm({ name:"", type:"supabase", base_url:"", public_key:"", private_key:"", priority:"0" });
        await fetchList();
      }
    } catch (e:any) {
      setErr(e.message || "Erro de rede");
    } finally { setSaving(false); }
  }

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Storage Services</h1>

        <section className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Adicionar Storage</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-sm">Nome</label>
              <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}
                className="w-full border px-3 py-2 rounded" required />
            </div>

            <div>
              <label className="block text-sm">Tipo</label>
              <select value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})}
                className="w-full border px-3 py-2 rounded">
                <option value="supabase">Supabase</option>
                <option value="cloudinary">Cloudinary</option>
                <option value="s3">S3-Compatible</option>
                <option value="other">Other (custom)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm">Base URL</label>
              <input value={form.base_url} onChange={(e)=>setForm({...form, base_url:e.target.value})}
                className="w-full border px-3 py-2 rounded" placeholder="https://..." />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm">Public Key</label>
                <input value={form.public_key} onChange={(e)=>setForm({...form, public_key:e.target.value})}
                  className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm">Private Key</label>
                <input value={form.private_key} onChange={(e)=>setForm({...form, private_key:e.target.value})}
                  className="w-full border px-3 py-2 rounded" />
              </div>
            </div>

            <div>
              <label className="block text-sm">Priority (0 = highest)</label>
              <input value={form.priority} onChange={(e)=>setForm({...form, priority:e.target.value})}
                className="w-full border px-3 py-2 rounded" type="number" />
            </div>

            {err && <div className="text-red-600">{err}</div>}

            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving}
                className="bg-teal-600 text-white px-4 py-2 rounded">
                {saving ? "Salvando…" : "Adicionar Storage"}
              </button>
              <button type="button" onClick={fetchList} className="text-sm text-slate-600 underline">Atualizar lista</button>
            </div>
          </form>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Storages cadastrados</h2>
          {loading ? <div>Carregando…</div> : (
            <ul className="space-y-2">
              {list.length===0 && <li className="text-sm text-slate-600">Nenhum storage cadastrado.</li>}
              {list.map(s => (
                <li key={s.id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{s.name} <span className="text-xs text-slate-500">({s.type})</span></div>
                    <div className="text-xs text-slate-500">{s.base_url || "—"}</div>
                  </div>
                  <div className="text-sm text-slate-500">prio: {s.priority ?? 0}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
