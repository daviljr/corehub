'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function CheckoutPage() {
  const [name,setName]=useState('');
  const router = useRouter();
  const handleCheckout = async ()=> {
    const raw = localStorage.getItem('corehub_cart');
    const items = raw ? JSON.parse(raw) : [];
    const res = await fetch('/api/checkout', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({items, customer:{name}})});
    const data = await res.json();
    if (data?.ok) {
      localStorage.removeItem('corehub_cart');
      router.push('/store');
      alert('Pedido criado: ' + data.order.id);
    } else alert('Erro no checkout');
  };
  return (
    <div>
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="mt-4 max-w-md">
        <label className="block">Nome</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded mt-1"/>
        <button onClick={handleCheckout} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded">Pagar (simulado)</button>
      </div>
    </div>
  );
}
