"use client";

import React from "react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/lib/products";

type Props = {
  product: Product;
  useSlug?: boolean;
};

function formatPrice(price?: number | null, currency?: string | null) {
  if (price == null || Number.isNaN(Number(price))) return "R$ 0,00";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: (currency || "BRL").toUpperCase(),
      maximumFractionDigits: 2,
    }).format(Number(price));
  } catch {
    return `R$ ${Number(price).toFixed(2)}`;
  }
}

export default function ProductCard({ product, useSlug = false }: Props) {
  const title = (product.title || product.name || "Produto Sheidbox").trim();
  const img = product.image_thumb_url || product.image_url || "/placeholder.png";
  const alt = (product.image_alt || title) as string;
  const slugOrId = useSlug ? product.slug || product.id : product.id;
  const price = formatPrice(product.price ?? null, product.currency ?? "BRL");

  const categories = Array.isArray(product.categories) ? product.categories : [];
  const isOutOfStock = (product.stock ?? 0) <= 0;

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
            alt={alt}
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
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 id={`product-${product.id}-title`} className="font-semibold text-lg text-slate-800 truncate">
              {title}
            </h3>
            {product.slug && <div className="text-sm text-slate-500 truncate">{product.slug}</div>}
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-slate-900 leading-tight">{price}</div>
            {product.discount ? (
              <div className="text-xs text-rose-600">Desconto ativo</div>
            ) : (
              <div className="text-xs text-slate-500">Frete calculado no checkout</div>
            )}
          </div>
        </div>

        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 3).map((c: any) => (
              <span
                key={c.id || c.slug || c.name}
                className="text-xs px-2 py-1 bg-slate-100 border rounded-full text-slate-700"
                title={c.name || c.slug}
              >
                {String(c.name || c.slug || "Categoria")}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-slate-600 line-clamp-2">
          {product.description ? String(product.description).slice(0, 120) : "Descrição do produto disponível na página do produto."}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <Link
            href={`/store/product/${slugOrId}`}
            className="inline-block px-4 py-2 border rounded-md text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Ver produto
          </Link>

          <div>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}
