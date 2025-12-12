"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // Campos do cliente
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("corehub_cart");
    if (raw) {
      try {
        setCart(JSON.parse(raw));
      } catch {}
    }
    setReady(true);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    if (!name.trim()) return alert("Por favor, informe seu nome.");
    if (!phone.trim()) return alert("Informe um telefone para contato.");
    if (cart.length === 0) return alert("Seu carrinho está vazio.");

    setLoading(true);

    // Simulação de pedido
    const order = {
      id: Math.floor(Math.random() * 999999),
      total,
      items: cart,
      customer: { name, phone, email, notes },
    };

    // Em produção, enviaríamos para Supabase, API, WhatsApp, etc.
    console.log("Pedido criado:", order);

    // Limpar carrinho
    localStorage.removeItem("corehub_cart");

    setLoading(false);

    alert("Pedido criado com sucesso!");
    router.push("/store");
  }

  if (!ready) {
    return <div className="p-6 text-slate-500">Carregando checkout...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* RESUMO DO PEDIDO */}
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-3">Resumo do Pedido</h2>

        {cart.length === 0 ? (
          <div className="text-slate-600">
            Seu carrinho está vazio.{" "}
            <a href="/store" className="text-emerald-600 font-semibold">
              Voltar para a loja
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-slate-500">
                    {item.quantity} × {formatPrice(item.price)}
                  </div>
                </div>
                <div className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2 text-lg font-bold">
              <span>Total</span>
              <span className="text-emerald-700">{formatPrice(total)}</span>
            </div>
          </div>
        )}
      </div>

      {/* FORMULÁRIO DO CLIENTE */}
      <div className="bg-white border rounded-lg shadow-sm p-4 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Seus Dados</h2>

        <div>
          <label className="block text-sm mb-1 font-medium">Nome completo *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">Telefone *</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="(DDD) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">E-mail (opcional)</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">Observações (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded"
            rows={3}
            placeholder="Instruções adicionais..."
          />
        </div>
      </div>

      {/* BOTÃO DE FINALIZAÇÃO */}
      <button
        disabled={loading || cart.length === 0}
        onClick={handleCheckout}
        className={`w-full py-3 rounded-md text-white font-semibold ${
          loading
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {loading ? "Processando..." : "Finalizar Pedido"}
      </button>
    </div>
  );
}