import { getProducts } from "@/lib/products";
import dynamic from "next/dynamic";
import type { Product, ProductCategory } from "@/lib/products";
import React from "react";

const StoreClient = dynamic(() => import("./StoreClient"), { ssr: false });

export default async function StorePage() {
  const products = (await getProducts()) as Product[];

  // derive categories from products
  const map: Record<string, ProductCategory> = {};
  (products || []).forEach((p: any) => {
    if (Array.isArray(p.categories) && p.categories.length) {
      p.categories.forEach((c: any) => {
        if (!c) return;
        const key = c.id || String(c.slug || c.name);
        if (!map[key]) map[key] = { id: c.id || key, name: c.name || c.slug || key, slug: c.slug || key };
      });
    } else if (p.category_id) {
      const id = String(p.category_id);
      if (!map[id]) map[id] = { id, name: "Categoria", slug: id };
    }
  });

  const categories = Object.values(map).slice(0, 50);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Loja Sheidbox</h1>
      </div>

      {/* render client that handles filtering */}
      {/* Note: products and categories are serialized and passed to the client component */}
      {/* StoreClient is client-only (ssr: false) to run filtering purely on client */}
      <StoreClient products={products} categories={categories} />
    </div>
  );
}
