import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';
const DB_FILE = path.join(process.cwd(), 'data', 'db.json');
export async function getProducts() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
  } catch (e) {}
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const db = JSON.parse(raw);
    return db.products || [];
  } catch (e) { return []; }
}
export async function getProductById(id:string) {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) return data;
    }
  } catch (e) {}
  const products = await getProducts();
  return products.find((p:any)=>p.id===id) || null;
}
