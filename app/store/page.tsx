// app/store/page.tsx
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories } from "../../lib/products";

type Props = {
  searchParams?: { category?: string };
};

export default async function StorePage({ searchParams }: Props) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const categorySlug = (searchParams?.category || "").trim();

  // If category selected, try to find category object (for title)
  const currentCategory = (categories || []).find((c: any) => c.slug === categorySlug || c.id === categorySlug);

  // filter products by category slug / id / product.categories pivot
  let visibleProducts = products || [];
  if (categorySlug) {
    visibleProducts = (products || []).filter((p: any) => {
      // direct category_id match
      if (p.category_id && String(p.category_id) === categorySlug) return true;
      // product's categories pivot
      if (p.categories && Array.isArray(p.categories) && p.categories.some((c: any) => c && (c.slug === categorySlug || String(c.id) === categorySlug))) return true;
      // product slug match (if you want products reachable by slug search)
      if (p.slug && p.slug === categorySlug) return true;
      return false;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loja Sheidbox</h1>
          <p className="text-sm text-slate-600">Produtos premium & pacotes — encontre conforto e segurança</p>
        </div>
        <div className="text-sm text-slate-500">
          {categorySlug ? (
            <>
              Categoria: <span className="font-medium">{currentCategory?.name || categorySlug}</span> · {visibleProducts.length} produto(s)
            </>
          ) : (
            <>Produtos premium & pacotes</>
          )}
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {visibleProducts.length === 0 ? (
          <div className="col-span-full text-slate-500">Nenhum produto encontrado para essa categoria.</div>
        ) : (
          visibleProducts.map((p: any) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  );
}