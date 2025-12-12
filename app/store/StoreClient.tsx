"use client";

import React, { useMemo, useState, useEffect } from "react";
import type { Product, ProductCategory } from "@/lib/products";
import ProductCard from "@/app/components/ProductCard";
import MultiCategoryFilter from "@/app/components/MultiCategoryFilter";
import { useSearchParams, useRouter } from "next/navigation";

type Props = {
  products: Product[];
  categories: ProductCategory[];
};

export default function StoreClient({ products, categories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // estado interno selecionado (array de ids)
  const [selected, setSelected] = useState<string[]>([]);

  // carregar slug da URL (?category=slug)
  useEffect(() => {
    const queryCat = searchParams.get("category");
    if (queryCat) {
      setSelected([queryCat]);
    }
  }, [searchParams]);

  // sempre trabalhar com ids **reais** vindos do banco
  const categoryIds = categories.map((c) => c.slug || c.id);

  const filtered = useMemo(() => {
    if (!selected.length) return products;

    return products.filter((p) => {
      const prodCats = (p.categories || []).map(
        (c) => c.slug || c.id
      );
      return selected.some((sel) => prodCats.includes(sel));
    });
  }, [products, selected]);

  // atualizar URL ao selecionar filtros
  function handleFilterChange(next: string[]) {
    setSelected(next);

    if (next.length === 1) {
      router.replace(`/store?category=${encodeURIComponent(next[0])}`);
    } else {
      router.replace(`/store`);
    }
  }

  return (
    <div className="space-y-6">

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="md:w-1/4">
          <MultiCategoryFilter
            categories={categories}
            selected={selected}
            onChange={handleFilterChange}
          />
        </div>

        <div className="md:flex-1 space-y-3">

          {/* Cabeçalho */}
          <div className="flex items-center justify-between">
            <div className="text-slate-700 text-sm">
              {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* GRID DE PRODUTOS */}
          {filtered.length === 0 ? (
            <div className="p-6 bg-white border rounded text-slate-600">
              Nenhum produto encontrado para os filtros selecionados.
            </div>
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