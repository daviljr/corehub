"use client";
import Link from "next/link";
import React from "react";

export default function AdminPage() {
  const ACTIONS = [
    { href: "/admin/organize", label: "Organização", color: "from-pink-500 to-purple-500" },
    { href: "/admin/products", label: "Produtos", color: "from-blue-400 to-cyan-400" },
    { href: "/admin/blog", label: "Blog", color: "from-emerald-400 to-teal-400" },
    { href: "/admin/seo", label: "SEO & Marketing", color: "from-orange-400 to-yellow-500" },
    { href: "/admin/tasks", label: "Tarefas", color: "from-rose-400 to-red-400" },
    // novo botão Storage adicionado aqui:
    { href: "/admin/storage", label: "Storage Services", color: "from-emerald-600 to-teal-500" },
  ];

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-8">Painel Administrativo — Sheidbox</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACTIONS.map((a) => (
            <Link key={a.href} href={a.href}>
              <a
                className={
                  "block w-full text-center py-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition " +
                  "bg-gradient-to-r " + a.color
                }
                aria-label={a.label}
              >
                <span className="text-lg font-semibold">{a.label}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
