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
  image_thumb_url?: string | null;
  categories?: { id: string; name: string; slug: string }[];
  stock?: number | null;
  price?: number | null;
  description?: string | null;
  created_at?: string | null;
};

async function fetchProductsFromSupabase(): Promise<Product[]> {
  try {
    // Tenta buscar produtos e categorias (se pivot existir)
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        title,
        slug,
        image_url,
        image_thumb_url,
        stock,
        price,
        description,
        created_at,
        product_categories!inner(
          category_id
        )
      `)
      .order('created_at', { ascending: false })
      .limit(300);

    // Se a query acima falhar por não existir pivot, tenta sem join
    if (error) {
      console.error('Supabase join error (getProducts):', error);
      const { data: d2, error: e2 } = await supabase
        .from('products')
        .select('id, name, title, slug, image_url, image_thumb_url, stock, price, description, created_at')
        .order('created_at', { ascending: false })
        .limit(300);
      if (e2) {
        console.error('Supabase fallback error (getProducts):', e2);
        return [];
      }
      return (d2 ?? []) as Product[];
    }

    // data may include product_categories rows; we'll normalize to Product[]
    const products = (data ?? []) as any[];

    // try to populate categories if pivot exists
    // gather product ids
    const productIds = products.map(p => p.id);
    if (productIds.length === 0) return [];

    // fetch categories via pivot if table exists
    try {
      const { data: pivotData, error: pivotErr } = await supabase
        .from('product_categories')
        .select('product_id, categories(id, name, slug)')
        .in('product_id', productIds as string[]);

      if (pivotErr) {
        // pivot may not exist — return basic products
        return products.map((p: any) => ({
          id: p.id,
          name: p.name ?? p.title,
          title: p.title ?? p.name,
          slug: p.slug,
          image_url: p.image_url,
          image_thumb_url: p.image_thumb_url,
          price: p.price,
          stock: p.stock,
          description: p.description,
          created_at: p.created_at,
          categories: []
        }));
      }

      const grouped: Record<string, any[]> = {};
      (pivotData || []).forEach((r: any) => {
        const pid = r.product_id;
        grouped[pid] = grouped[pid] || [];
        if (r.categories) grouped[pid].push(r.categories);
      });

      return products.map((p: any) => ({
        id: p.id,
        name: p.name ?? p.title,
        title: p.title ?? p.name,
        slug: p.slug,
        image_url: p.image_url,
        image_thumb_url: p.image_thumb_url,
        price: p.price,
        stock: p.stock,
        description: p.description,
        created_at: p.created_at,
        categories: grouped[p.id] || []
      }));
    } catch (err) {
      console.warn('Could not fetch categories pivot:', err?.message ?? err);
      return products.map((p: any) => ({
        id: p.id,
        name: p.name ?? p.title,
        title: p.title ?? p.name,
        slug: p.slug,
        image_url: p.image_url,
        image_thumb_url: p.image_thumb_url,
        price: p.price,
        stock: p.stock,
        description: p.description,
        created_at: p.created_at,
        categories: []
      }));
    }
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
        .select('id, name, title, slug, image_url, image_thumb_url, stock, price, description, created_at')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Supabase error (getProductById):', error);
      } else if (data) {
        return {
          ...data,
          name: data.name ?? data.title,
          title: data.title ?? data.name
        } as Product;
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
        .select('id, name, title, slug, image_url, image_thumb_url, stock, price, description, created_at')
        .eq('slug', slug)
        .single();
      if (error) {
        console.error('Supabase error (getProductBySlug):', error);
      } else if (data) {
        return {
          ...data,
          name: data.name ?? data.title,
          title: data.title ?? data.name
        } as Product;
      }
    }
  } catch (err) {
    console.error('Exception getProductBySlug:', err);
  }

  const products = fetchProductsFromFile();
  return products.find(p => p.slug === slug) || null;
}
