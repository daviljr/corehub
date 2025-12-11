import fs from "fs";
import path from "path";
import { supabase } from "./supabase";

const DB_FILE = path.join(process.cwd(), "data", "db.json");

export type ProductCategory = {
  id: string;
  name?: string;
  slug?: string;
};

export type Product = {
  id: string;
  sku?: string | null;
  name?: string | null;
  title?: string | null;
  slug?: string | null;
  category_id?: string | null;
  categories?: ProductCategory[];
  description?: string | null;
  currency?: string | null;
  price?: number | null;
  discount?: number | null;
  stock?: number | null;
  created_at?: string | null;
  image_url?: string | null;
  image_thumb_url?: string | null;
  image_lqip?: string | null;
  image_medium_url?: string | null;
  image_large_url?: string | null;
  image_cdn_url?: string | null;
  image_alt?: string | null;
  og_image?: string | null;
  is_featured?: boolean | null;
  display_order?: number | null;
  // any extra fields (keeps forward-compatible)
  [key: string]: any;
};

function safeNum(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeProduct(raw: any): Product {
  if (!raw) return raw;
  return {
    ...raw,
    id: raw.id,
    sku: raw.sku ?? null,
    name: raw.name ?? raw.title ?? null,
    title: raw.title ?? raw.name ?? null,
    slug: raw.slug ?? null,
    category_id: raw.category_id ?? null,
    description: raw.description ?? null,
    currency: raw.currency ?? null,
    price: raw.price != null ? safeNum(raw.price) : null,
    discount: raw.discount != null ? safeNum(raw.discount) : null,
    stock: raw.stock != null ? safeNum(raw.stock) : null,
    created_at: raw.created_at ?? null,
    image_url: raw.image_url ?? null,
    image_thumb_url: raw.image_thumb_url ?? null,
    image_lqip: raw.image_lqip ?? null,
    image_medium_url: raw.image_medium_url ?? null,
    image_large_url: raw.image_large_url ?? null,
    image_cdn_url: raw.image_cdn_url ?? null,
    image_alt: raw.image_alt ?? null,
    og_image: raw.og_image ?? null,
    is_featured:
      raw.is_featured === true || raw.is_featured === "true" || raw.is_featured === 1 ? true : false,
    display_order: raw.display_order != null ? safeNum(raw.display_order) : 0,
    categories: raw.categories ?? [],
    // keep any additional fields for compatibility
    ...Object.keys(raw).reduce((acc: any, k: string) => {
      if (!(k in acc)) acc[k] = raw[k];
      return acc;
    }, {}),
  } as Product;
}

/**
 * Fetch categories list from Supabase.
 * Returns [] on error or when env is not set.
 */
export async function getCategories(): Promise<ProductCategory[]> {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name", { ascending: true })
        .limit(500);

      if (error) {
        console.error("Supabase error (getCategories):", error);
        return [];
      }
      // normalize basic shape
      return (data ?? []).map((c: any) => ({
        id: c.id,
        name: c.name ?? c.slug ?? "Categoria",
        slug: c.slug ?? String(c.id),
      })) as ProductCategory[];
    }
  } catch (err) {
    console.error("Exception getCategories:", err);
  }
  return [];
}

async function fetchProductsFromSupabase(): Promise<Product[]> {
  try {
    // fetch all product columns
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Supabase error (fetchProductsFromSupabase):", error);
      return [];
    }

    const productsRaw = (data ?? []) as any[];
    if (!productsRaw.length) return [];

    // try to fetch pivot categories if table exists
    const productIds = productsRaw.map((p) => p.id).filter(Boolean);
    if (productIds.length === 0) {
      return productsRaw.map(normalizeProduct);
    }

    try {
      // attempt to fetch product_categories with categories relation (if configured)
      const { data: pivotData, error: pivotErr } = await supabase
        .from("product_categories")
        .select("product_id, categories(id, name, slug)")
        .in("product_id", productIds as string[]);

      if (pivotErr || !pivotData) {
        // pivot may not exist — return normalized products without categories
        return productsRaw.map(normalizeProduct);
      }

      // group categories by product_id
      const grouped: Record<string, ProductCategory[]> = {};
      (pivotData || []).forEach((r: any) => {
        const pid = r.product_id;
        if (!pid) return;
        grouped[pid] = grouped[pid] || [];
        if (r.categories) grouped[pid].push(r.categories);
      });

      return productsRaw.map((p: any) => {
        const normalized = normalizeProduct(p);
        normalized.categories = grouped[p.id] || [];
        return normalized;
      });
    } catch (err) {
      console.warn("Could not fetch categories pivot:", (err as any)?.message ?? err);
      return productsRaw.map(normalizeProduct);
    }
  } catch (err) {
    console.error("Fetch products exception:", err);
    return [];
  }
}

function fetchProductsFromFile(): Product[] {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const db = JSON.parse(raw);
    return (db.products || []).map(normalizeProduct);
  } catch (err) {
    console.warn("Fallback read db.json failed or missing:", (err as any)?.message ?? err);
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supa = await fetchProductsFromSupabase();
    if (supa && supa.length > 0) return supa;
    // fallthrough to file if supabase returns empty (dev fallback)
  }
  return fetchProductsFromFile();
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null;
  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
    if (error) {
      console.error("Supabase error (getProductById):", error);
    } else if (data) {
      // try to load categories for this product
      try {
        const { data: pivotData } = await supabase
          .from("product_categories")
          .select("categories(id, name, slug)")
          .eq("product_id", id);
        const normalized = normalizeProduct(data);
        normalized.categories = (pivotData || []).map((r: any) => r.categories).filter(Boolean);
        return normalized;
      } catch {
        return normalizeProduct(data);
      }
    }
  } catch (err) {
    console.error("Exception getProductById:", err);
  }

  const products = fetchProductsFromFile();
  return products.find((p) => String(p.id) === String(id)) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;
  try {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
    if (error) {
      console.error("Supabase error (getProductBySlug):", error);
    } else if (data) {
      // categories
      try {
        const { data: pivotData } = await supabase
          .from("product_categories")
          .select("categories(id, name, slug)")
          .eq("product_id", data.id);
        const normalized = normalizeProduct(data);
        normalized.categories = (pivotData || []).map((r: any) => r.categories).filter(Boolean);
        return normalized;
      } catch {
        return normalizeProduct(data);
      }
    }
  } catch (err) {
    console.error("Exception getProductBySlug:", err);
  }

  const products = fetchProductsFromFile();
  return products.find((p) => p.slug === slug) || null;
}