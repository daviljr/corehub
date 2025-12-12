import { getProducts, getCategories } from "@/lib/products";
import dynamic from "next/dynamic";
import React from "react";

const StoreClient = dynamic(() => import("./StoreClient"), {
  ssr: false,
});

export default async function StorePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Loja Sheidbox</h1>
      </div>

      {/* Client component receives products + categories */}
      <StoreClient products={products} categories={categories} />
    </div>
  );
}