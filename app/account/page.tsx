"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

/**
 * Mantemos um "nome do cliente" simples via localStorage.
 * Não é autenticação, mas cria continuidade para o usuário.
 * Pode ser substituído futuramente por Supabase Auth sem mudar a UX.
 */

export default function AccountPage() {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sheidbox_customer_name");
    if (stored) setName(stored);
  }, []);

  function save() {
    localStorage.setItem("sheidbox_customer_name", name);
    setEditing(false);
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold">Minha Conta</h1>

      {/* BLOCO DE IDENTIFICAÇÃO */}
      <div className="bg-white border rounded-lg shadow-sm p-4 space-y-3">
        <h2 className="text-xl font-semibold">Identificação</h2>

        {!editing ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                {name ? name : "Visitante"}
              </div>
              <div className="text-slate-500 text-sm">
                (não autenticado)
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="text-emerald-600 underline text-sm"
            >
              Atualizar nome
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              className="border p-2 rounded w-full"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={save}
                className="px-4 py-2 bg-emerald-600 rounded text-white"
              >
                Salvar
              </button>

              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LINKS ÚTEIS */}
      <div className="bg-white border rounded-lg shadow-sm p-4 space-y-4">
        <h2 className="text-xl font-semibold">Atalhos</h2>

        <div className="space-y-2 text-sm">
          <Link
            href="/orders"
            className="block text-emerald-600 hover:underline"
          >
            Ver pedidos
          </Link>

          <Link
            href="/cart"
            className="block text-emerald-600 hover:underline"
          >
            Meu carrinho
          </Link>

          <Link
            href="/store"
            className="block text-emerald-600 hover:underline"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>

      {/* SUPORTE */}
      <div className="bg-white border rounded-lg shadow-sm p-4 space-y-3">
        <h2 className="text-xl font-semibold">Suporte</h2>
        <p className="text-sm text-slate-600">
          Precisa de ajuda? Entre em contato com nossa equipe.
        </p>

        <a
          href="https://wa.me/5555999195641"
          target="_blank"
          className="inline-block px-4 py-2 bg-emerald-600 text-white rounded font-medium"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}