"use client";

import { useEffect, useState } from "react";

type Provider = {
  id?: string;
  name: string;
  slug?: string;
  type: string;
  base_url?: string;
  priority?: number;
  is_active?: boolean;
  config?: any;
  meta?: any;
};

export default function AdminStorageConfigPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    name: "",
    slug: "",
    type: "supabase",
    base_url: "",
    priority: 100,
    is_active: true,
    config: { mirror_to: [], regional_priority: {}, overflow_threshold: 85 }
  });
  const [submitting, setSubmitting] = useState(false);

  async function loadProviders() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/storage");
      if (res.ok) {
        const j = await res.json();
        setProviders(j.data || []);
      } else {
        console.error("Erro carregando providers", await res.text());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ loadProviders(); }, []);

  function updateField(k:string, v:any) {
    setForm((s:any)=>({...s, [k]: v}));
  }

  function updateConfig(path:string, v:any) {
    setForm((s:any)=> {
      const cfg = {...(s.config||{})};
      cfg[path] = v;
      return {...s, config: cfg};
    });
  }

  async function handleSubmit(e:any) {
    e?.preventDefault?.();
    setSubmitting(true);
    try {
      const body = {
        name: form.name,
        slug: form.slug || undefined,
        type: form.type,
        base_url: form.base_url || undefined,
        priority: Number(form.priority) || 100,
        is_active: !!form.is_active,
        config: form.config || {}
      };
      const res = await fetch("/api/storage/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await loadProviders();
        setForm({
          name: "",
          slug: "",
          type: "supabase",
          base_url: "",
          priority: 100,
          is_active: true,
          config: { mirror_to: [], regional_priority: {}, overflow_threshold: 85 }
        });
      } else {
        const j = await res.json().catch(()=>({}));
        alert("Erro: " + (j.error || "unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Erro de rede");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Storage Service — Configuração</h1>
          <div className="text-sm text-slate-500">Adicione, monitore e ajuste provedores de arquivo.</div>
        </header>

        <section className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold mb-3">Adicionar novo provedor</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input value={form.name} onChange={(e)=>updateField("name", e.target.value)} placeholder="Nome do provedor (ex: FileStorageSupabase)" className="p-2 border rounded" required />
              <input value={form.slug} onChange={(e)=>updateField("slug", e.target.value)} placeholder="slug (opcional)" className="p-2 border rounded" />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <select value={form.type} onChange={(e)=>updateField("type", e.target.value)} className="p-2 border rounded">
                <option value="supabase">supabase</option>
                <option value="cloudinary">cloudinary</option>
                <option value="s3">s3</option>
                <option value="custom">custom</option>
              </select>
              <input value={form.base_url} onChange={(e)=>updateField("base_url", e.target.value)} placeholder="Base URL (opcional)" className="p-2 border rounded" />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input type="number" value={form.priority} onChange={(e)=>updateField("priority", e.target.value)} className="p-2 border rounded" placeholder="priority (menor = preferido)" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!form.is_active} onChange={(e)=>updateField("is_active", e.target.checked)} />
                <span className="text-sm">Ativo</span>
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <input value={form.config?.overflow_threshold || 85} onChange={(e)=>updateConfig("overflow_threshold", Number(e.target.value))} type="number" placeholder="Overflow threshold (%)" className="p-2 border rounded" />
              <input value={JSON.stringify(form.config?.mirror_to || [])} onChange={(e)=>updateConfig("mirror_to", JSON.parse(e.target.value || "[]"))} placeholder='mirror_to (JSON array) ex: ["id1","id2"]' className="p-2 border rounded" />
              <input value={JSON.stringify(form.config?.regional_priority || {})} onChange={(e)=>updateConfig("regional_priority", JSON.parse(e.target.value || "{}"))} placeholder='regional_priority (JSON) ex: {"BR":20}' className="p-2 border rounded" />
            </div>

            <div className="flex gap-3 items-center">
              <button disabled={submitting} type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">{submitting ? "Adicionando..." : "Adicionar provedor"}</button>
              <button type="button" onClick={loadProviders} className="px-3 py-2 bg-slate-200 rounded">Atualizar lista</button>
            </div>
          </form>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Provedores configurados</h2>

          {loading ? <div>Carregando...</div> : (
            <div className="space-y-2">
              {providers.map((p:any) => (
                <div key={p.id} className="border p-3 rounded flex justify-between items-start">
                  <div>
                    <div className="font-medium">{p.name} <span className="text-xs text-slate-400">({p.type})</span></div>
                    <div className="text-sm text-slate-500">{p.base_url || "—"}</div>
                    <div className="text-xs text-slate-400 mt-1">priority: {p.priority} • active: {p.is_active ? "yes" : "no"}</div>
                    <div className="text-xs text-slate-400 mt-1">config: <code className="text-xs">{JSON.stringify(p.config || {})}</code></div>
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
