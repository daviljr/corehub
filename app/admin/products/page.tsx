'use client';
import React, { useEffect, useState } from 'react';
export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ title:'', price:'0.00', description:'', image_url:'' });
  useEffect(()=>{ fetch('/api/admin/products').then(r=>r.json()).then(j=>setProducts(j.products || [])) },[]);
  async function handleCreate() {
    const res = await fetch('/api/admin/products', { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(form)});
    const j = await res.json();
    setProducts([j.product, ...products]);
    setForm({ title:'', price:'0.00', description:'', image_url:'' });
    alert('Produto criado');
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin - Produtos</h1>
      <div className="mt-4 max-w-2xl space-y-3">
        <input placeholder="Título" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} className="w-full p-2 border rounded"/>
        <input placeholder="Preço" type="number" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} className="w-full p-2 border rounded"/>
        <input placeholder="Imagem URL" value={form.image_url} onChange={(e)=>setForm({...form, image_url:e.target.value})} className="w-full p-2 border rounded"/>
        <textarea placeholder="Descrição" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} className="w-full p-2 border rounded"/>
        <button onClick={handleCreate} className="px-4 py-2 bg-emerald-600 text-white rounded">Criar produto</button>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p=>(
          <div key={p.id} className="p-3 border rounded">
            <img src={p.image_url || '/placeholder.png'} className="h-40 w-full object-contain mb-2"/>
            <div className="font-semibold">{p.title}</div>
            <div>R$ {parseFloat(p.price).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
