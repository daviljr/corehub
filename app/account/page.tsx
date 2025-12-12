'use client';
import { useState } from 'react';
import supabase from "../../lib/supabase";
export default function AccountPage(){
  const [email,setEmail]=useState('');
  async function signIn() {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert('Erro: ' + error.message); else alert('Email de login enviado');
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Minha Conta</h1>
      <p className="mt-3">Login via email (magic link) com Supabase.</p>
      <div className="mt-4 max-w-md">
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded" placeholder="seu@email.com"/>
        <button onClick={signIn} className="mt-3 px-4 py-2 bg-slate-900 text-white rounded">Entrar / Receber link</button>
      </div>
    </div>
  );
}
