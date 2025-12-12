"use client";

import React from "react";
import Link from "next/link";
import AddToCartButton from "@/app/components/AddToCartButton";
import type { Product } from "@/lib/products";

type Props = {
  product: Product;
};

function formatPrice(value?: number | null, currency = "BRL") {
  const n = Number(value || 0);
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `R$ ${n.toFixed(2)}`;
  }
}

export default function ProductCard({ product }: Props) {
  const title = product.title || product.name || "Produto Sheidbox";
  const img =
    product.image_thumb_url ||
    product.image_url ||
    "/placeholder.png";

  const slugOrId = product.slug || product.id;
  const price = formatPrice(product.price, product.currency || "BRL");

  const isOutOfStock = (product.stock ?? 0) <= 0;
  const categories = Array.isArray(product.categories)
    ? product.categories.slice(0, 2)
    : [];

  return (
    <article
      className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition group"
      aria-labelledby={`product-${product.id}-title`}
    >
      <Link
        href={`/store/product/${slugOrId}`}
        className="block"
        title={title}
        aria-label={`Ver ${title}`}
      >
        <div className="relative w-full h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
          <img
            src={img}
            alt={product.image_alt || title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />

          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
              Esgotado
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3">

        {/* TÍTULO + PREÇO */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              id={`product-${product.id}-title`}
              className="font-semibold text-lg text-slate-800 truncate"
            >
              {title}
            </h3>
            {product.slug && (
              <div className="text-sm text-slate-500 truncate">
                {product.slug}
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-slate-900 leading-tight">
              {price}
            </div>
          </div>
        </div>

        {/* CATEGORIAS */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c.id || c.slug}
                className="text-xs px-2 py-1 bg-slate-100 border rounded-full text-slate-700"
                title={c.name || c.slug}
              >
                {c.name || c.slug}
              </span>
            ))}
          </div>
        )}

        {/* DESCRIÇÃO */}
        <p className="text-sm text-slate-600 line-clamp-2">
          {product.description
            ? String(product.description).slice(0, 120)
            : "Descrição disponível na página do produto."}
        </p>

        {/* AÇÕES */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <Link
            href={`/store/product/${slugOrId}`}
            className="inline-block px-4 py-2 border rounded-md text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Ver produto
          </Link>

          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}