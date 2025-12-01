'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem('corehub_cart');
    if (raw) setCart(JSON.parse(raw));
  }, []);
  const total = cart.reduce((s:any,i:any)=>s+(i.price*i.quantity),0);
  return (
    <div>
      <h1 className="text-2xl font-bold">Carrinho</h1>
      <div className="mt-4 space-y-4">
        {cart.length === 0 && <div>Seu carrinho está vazio. <Link href="/store" className="text-sky-600">Ver produtos</Link></div>}
        {cart.map((it:any, idx:number)=>(
          <div key={idx} className="flex items-center justify-between border p-3 rounded">
            <div>
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-slate-500">Qtd: {it.quantity}</div>
            </div>
            <div>R$ {(it.price*it.quantity).toFixed(2)}</div>
          </div>
        ))}
        {cart.length>0 && (
          <div className="mt-4">
            <div className="font-semibold">Total: R$ {total.toFixed(2)}</div>
            <Link href="/checkout" className="inline-block mt-2 px-4 py-2 bg-emerald-600 text-white rounded">Finalizar compra</Link>
          </div>
        )}
      </div>
    </div>
  );
}
