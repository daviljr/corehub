'use client';
import React from 'react';
export default function AddToCartButton({ product }: any) {
  const handle = () => {
    const raw = localStorage.getItem('corehub_cart');
    const cart = raw ? JSON.parse(raw) : [];
    const idx = cart.findIndex((c:any)=>c.id===product.id);
    if (idx>-1) cart[idx].quantity += 1;
    else cart.push({ id: product.id, title: product.title, price: parseFloat(product.price), quantity: 1 });
    localStorage.setItem('corehub_cart', JSON.stringify(cart));
    alert('Adicionado ao carrinho');
  };
  return <button onClick={handle} className="px-4 py-2 bg-slate-900 text-white rounded">Adicionar ao carrinho</button>;
}
