"use client";
import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        // redirect to original path or admin index
        const url = new URL(window.location.href);
        const from = url.searchParams.get("from") || "/admin";
        window.location.href = from;
      } else {
        const j = await res.json().catch(()=>({}));
        setErr(j?.error || "Senha inválida");
      }
    } catch (e) {
      setErr("Erro de rede");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-3">Acesso Administrativo</h1>
        <p className="text-sm text-slate-600 mb-4">Insira a senha administrativa para acessar o painel.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <input
              type="password" name="password"
              placeholder="Senha administrativa"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              autoFocus
              required
            />
          </label>

          {err && <div className="text-sm text-red-600">{err}</div>}

          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="bg-teal-600 text-white px-4 py-2 rounded">
              {loading ? "Entrando…" : "Entrar"}
            </button>
            <a href="/" className="text-sm text-slate-600 hover:underline">Voltar ao site</a>
          </div>
        </form>
      </div>
    </main>
  );
}
