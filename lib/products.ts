import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

export type Product = {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  image_url?: string | null;
  stock?: number | null;
  price?: number | null;
  description?: string | null;
  created_at?: string | null;
};

async function fetchProductsFromSupabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, title, slug, image_url, stock, price, description, created_at')
      .order('created_at', { ascending: false })
      .limit(300);

    if (error) {
      console.error('Supabase error (getProducts):', error);
      return [];
    }
    return (data ?? []) as Product[];
  } catch (err) {
    console.error('Fetch products exception:', err);
    return [];
  }
}

function fetchProductsFromFile(): Product[] {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const db = JSON.parse(raw);
    return (db.products || []) as Product[];
  } catch (err) {
    console.warn('Fallback read db.json failed or missing:', err?.message ?? err);
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  // prefer Supabase when env vars exist
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supa = await fetchProductsFromSupabase();
    if (supa && supa.length > 0) return supa;
    // if supabase returns empty array, still try file fallback (useful in dev)
  }
  return fetchProductsFromFile();
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null;
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, title, slug, image_url, stock, price, description, created_at')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Supabase error (getProductById):', error);
      } else if (data) {
        return data as Product;
      }
    }
  } catch (err) {
    console.error('Exception getProductById:', err);
  }

  // fallback to file
  const products = fetchProductsFromFile();
  return products.find(p => String(p.id) === String(id)) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, title, slug, image_url, stock, price, description, created_at')
        .eq('slug', slug)
        .single();
      if (error) {
        console.error('Supabase error (getProductBySlug):', error);
      } else if (data) {
        return data as Product;
      }
    }
  } catch (err) {
    console.error('Exception getProductBySlug:', err);
  }

  const products = fetchProductsFromFile();
  return products.find(p => p.slug === slug) || null;
}
