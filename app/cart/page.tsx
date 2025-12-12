"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

function formatPrice(value: number) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `R$ ${value.toFixed(2)}`;
  }
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Evita hydration error porque localStorage só existe no cliente
  useEffect(() => {
    const raw = localStorage.getItem("corehub_cart");
    if (raw) {
      try {
        setCart(JSON.parse(raw));
      } catch {
        setCart([]);
      }
    }
    setReady(true);
  }, []);

  function removeItem(index: number) {
    const clone = [...cart];
    clone.splice(index, 1);
    setCart(clone);
    localStorage.setItem("corehub_cart", JSON.stringify(clone));
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!ready) {
    // Evita piscadas antes de hidratação
    return <div className="p-6 text-slate-500">Carregando carrinho...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">Carrinho</h1>

      {cart.length === 0 ? (
        <div className="p-6 bg-white border rounded text-slate-600">
          Seu carrinho está vazio.{" "}
          <Link href="/store" className="text-emerald-600 font-semibold">
            Ver produtos
          </Link>
        </div>
      ) : (
        <>
          {/* LISTA DE ITENS */}
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white border p-4 rounded shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-sm text-slate-500">
                    Quantidade: {item.quantity}
                  </span>
                  <span className="text-sm text-slate-700">
                    Preço unitário: {formatPrice(item.price)}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold text-slate-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(idx)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RESUMO */}
          <div className="bg-white p-4 rounded border shadow-sm mt-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-emerald-700">
                {formatPrice(total)}
              </span>
            </div>

            <div className="mt-4 text-right">
              <Link
                href="/checkout"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700"
              >
                Finalizar compra
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}