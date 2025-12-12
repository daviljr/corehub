// lib/products.ts
import { supabase } from "./supabase";

// -----------------------------
// TIPOS
// -----------------------------
export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  title: string | null;
  name: string | null;
  slug: string | null;
  description: string | null;
  price: number | null;
  currency: string | null;
  stock: number | null;
  is_featured: boolean | null;

  // imagens
  image_url?: string | null;
  image_thumb_url?: string | null;
  image_medium_url?: string | null;
  image_large_url?: string | null;
  image_cdn_url?: string | null;
  image_alt?: string | null;

  // categorias carregadas
  categories?: ProductCategory[];

  [key: string]: any;
};

// -----------------------------
// NORMALIZAÇÃO DE PRODUTO
// -----------------------------
function normalizeProduct(raw: any): Product {
  if (!raw) return raw;

  return {
    ...raw,
    id: raw.id,
    title: raw.title ?? raw.name ?? null,
    name: raw.name ?? raw.title ?? null,
    slug: raw.slug ?? null,
    description: raw.description ?? null,
    price: raw.price != null ? Number(raw.price) : null,
    currency: raw.currency ?? "BRL",
    stock: raw.stock != null ? Number(raw.stock) : null,
    is_featured:
      raw.is_featured === true ||
      raw.is_featured === "true" ||
      raw.is_featured === 1
        ? true
        : false,
  };
}

// -----------------------------
// BUSCAR CATEGORIAS
// -----------------------------
export async function getCategories(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    console.error("❌ Supabase getCategories error:", error);
    return [];
  }

  return (data ?? []).map((c: any) => ({
    id: String(c.id),
    name: c.name ?? c.slug ?? "Categoria",
    slug: c.slug ?? String(c.id),
  }));
}

// -----------------------------
// CARREGAR PRODUTOS + CATEGORIAS
// -----------------------------
export async function getProducts(): Promise<Product[]> {
  // Buscar produtos
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (prodErr || !products) {
    console.error("❌ Supabase getProducts error:", prodErr);
    return [];
  }

  const normalized = products.map(normalizeProduct);
  const ids = normalized.map((p) => p.id);

  if (ids.length === 0) return normalized;

  // Buscar categorias pivot
  const { data: pivot, error: pivotErr } = await supabase
    .from("product_categories")
    .select("product_id, categories(id, name, slug)")
    .in("product_id", ids);

  if (pivotErr || !pivot) {
    return normalized;
  }

  // Agrupar categorias por produto
  const map: Record<string, ProductCategory[]> = {};
  pivot.forEach((row: any) => {
    const pid = row.product_id;
    if (!pid) return;
    if (!map[pid]) map[pid] = [];
    if (row.categories)
      map[pid].push({
        id: row.categories.id,
        name: row.categories.name,
        slug: row.categories.slug,
      });
  });

  // anexar categorias
  return normalized.map((p) => ({
    ...p,
    categories: map[p.id] ?? [],
  }));
}

// -----------------------------
// BUSCAR POR ID
// -----------------------------
export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null;

  // produto base
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const normalized = normalizeProduct(data);

  // categorias
  const { data: pivot } = await supabase
    .from("product_categories")
    .select("categories(id, name, slug)")
    .eq("product_id", id);

  normalized.categories = (pivot ?? [])
    .map((r: any) => r.categories)
    .filter(Boolean);

  return normalized;
}

// -----------------------------
// BUSCAR POR SLUG
// -----------------------------
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  const normalized = normalizeProduct(data);

  // categorias
  const { data: pivot } = await supabase
    .from("product_categories")
    .select("categories(id, name, slug)")
    .eq("product_id", data.id);

  normalized.categories = (pivot ?? [])
    .map((r: any) => r.categories)
    .filter(Boolean);

  return normalized;
}