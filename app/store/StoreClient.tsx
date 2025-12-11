"use client";
import React, { useMemo, useState } from "react";
import type { Product, ProductCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import MultiCategoryFilter from "@/components/MultiCategoryFilter";

type Props = {
  products: Product[];
  categories: ProductCategory[];
};

export default function StoreClient({ products, categories }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  // normalize ids for selection: prefer category.id else slug/name
  const categoryKeys = categories.map(c => c.id || String(c.slug || c.name));

  const filtered = useMemo(() => {
    if (!selected || selected.length === 0) return products;

    // show products that match ANY of the selected categories (OR logic)
    return products.filter((p) => {
      // product may have categories array or category_id fallback
      const prodCats: string[] = [];

      if (Array.isArray(p.categories) && p.categories.length) {
        p.categories.forEach((c: any) => {
          if (c && (c.id || c.slug || c.name)) prodCats.push(String(c.id || c.slug || c.name));
        });
      }

      if (p.category_id) prodCats.push(String(p.category_id));

      // check intersection
      return selected.some(sel => prodCats.includes(sel));
    });
  }, [products, selected]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="md:w-1/4">
          <MultiCategoryFilter categories={categories} selected={selected} onChange={setSelected} />
        </div>

        <div className="md:flex-1">
          {filtered.length === 0 ? (
            <div className="p-6 bg-white border rounded text-slate-600">Nenhum produto encontrado para os filtros selecionados.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
