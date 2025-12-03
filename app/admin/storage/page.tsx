"use client";

import { useEffect, useState } from "react";

type StorageType = "supabase" | "cloudinary" | "s3" | "custom";

type StorageItem = {
  id: string;
  name: string;
  type: StorageType;
  base_url?: string | null;
  public_key?: string | null;
  private_key?: string | null;
  priority?: number | null;
  created_at?: string | null;
};

export default function AdminStoragePage() {
  const [list, setList] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    type: "supabase" as StorageType,
    base_url: "",
    public_key: "",
    private_key: "",
    priority: "0",
  });

  async function fetchList() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/storage/list");
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Erro ao carregar storages");
      setList(j.data || []);
    } catch (e: any) {
      setErr(e.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  function updateField<K extends keyof typeof form>(k: K, v: string) {
    setForm((x) => ({ ...x, [k]: v }));
  }

  function validate() {
    if (!form.name.trim()) return "Preencha o nome";
    if (form.type !== "custom" && !form.base_url.trim()) {
      return "Preencha o Base URL";
    }
    return null;
  }

  async function handleAdd(e?: Event) {
    if (e && (e as unknown as Event).preventDefault) (e as any).preventDefault();
    setErr(null);
    setSuccess(null);
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        base_url: form.base_url || null,
        public_key: form.public_key || null,
        private_key: form.private_key || null,
        priority: parseInt(form.priority || "0", 10) || 0,
      };
      const res = await fetch("/api/storage/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(j?.error || "Falha ao adicionar storage");
      }
      setSuccess("Storage adicionado com sucesso.");
      setForm({
        name: "",
        type: "supabase",
        base_url: "",
        public_key: "",
        private_key: "",
        priority: "0",
      });
      await fetchList();
    } catch (e: any) {
      setErr(e.message || "Erro desconhecido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">Storage Services</h1>

        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Adicionar Storage</h2>

          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
            <div>
              <label className="block text-sm font-medium">Nome</label>
              <input
                className="w-full px-3 py-2 border rounded"
                value={form.name}
                onChange={(ev) => updateField("name", ev.target.value)}
                placeholder="ex: Supabase - Primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Tipo</label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={form.type}
                onChange={(ev) => updateField("type", ev.target.value)}
              >
                <option value="supabase">Supabase</option>
                <option value="cloudinary">Cloudinary</option>
                <option value="s3">S3 (compatible)</option>
                <option value="custom">Custom / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Base URL</label>
              <input
                className="w-full px-3 py-2 border rounded"
                value={form.base_url}
                onChange={(ev) => updateField("base_url", ev.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Public Key</label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  value={form.public_key}
                  onChange={(ev) => updateField("public_key", ev.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Private Key</label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  value={form.private_key}
                  onChange={(ev) => updateField("private_key", ev.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Priority (0 = highest)</label>
              <input
                type="number"
                className="w-40 px-3 py-2 border rounded"
                value={form.priority}
                onChange={(ev) => updateField("priority", ev.target.value)}
                min={0}
              />
            </div>

            {err && <div className="text-sm text-red-600">{err}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleAdd()}
                disabled={saving}
                className="bg-teal-600 text-white px-4 py-2 rounded"
              >
                {saving ? "Salvando..." : "Adicionar Storage"}
              </button>

              <button
                type="button"
                onClick={() => fetchList()}
                className="bg-slate-100 px-3 py-2 rounded"
              >
                Atualizar lista
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Storages cadastrados</h2>

          {loading ? (
            <div>Carregando...</div>
          ) : list.length === 0 ? (
            <div className="text-sm text-slate-500">Nenhum storage cadastrado.</div>
          ) : (
            <div className="space-y-3">
              {list.map((s) => (
                <div key={s.id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{s.name} <span className="text-xs text-slate-500">({s.type})</span></div>
                    <div className="text-sm text-slate-600">{s.base_url || "—"}</div>
                    <div className="text-xs text-slate-400">priority: {s.priority ?? "0"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">{s.created_at ? new Date(s.created_at).toLocaleString() : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
