import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../../lib/products";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined }
};

export default async function StorePage({ searchParams }: Props) {
  const products = await getProducts();
  const categoryFilter = typeof searchParams?.category === "string" ? searchParams?.category : undefined;

  // if categoryFilter present, filter products by categories.slug or category_id or product.category_id
  const filtered = products.filter((p: any) => {
    if (!categoryFilter) return true;
    if (p.slug === categoryFilter) return true;
    if (p.category_id && String(p.category_id) === String(categoryFilter)) return true;
    if (p.categories && p.categories.some((c: any) => String(c.slug) === String(categoryFilter) || String(c.id) === String(categoryFilter))) return true;
    return false;
  });

  // reorder: featured first, then display_order then created_at
  const ordered = filtered.sort((a: any, b: any) => {
    const fa = a.is_featured ? 0 : 1;
    const fb = b.is_featured ? 0 : 1;
    if (fa !== fb) return fa - fb;
    const da = a.display_order ?? 0;
    const db = b.display_order ?? 0;
    if (da !== db) return da - db;
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  const categoriesSet: Record<string, { name: string; slug: string }> = {};
  (products || []).forEach((p: any) => {
    if (p.categories && p.categories.length) {
      p.categories.forEach((c: any) => {
        if (c?.slug) categoriesSet[c.slug] = { name: c.name || c.slug, slug: c.slug };
      });
    }
  });
  const categories = Object.values(categoriesSet);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Loja Sheidbox</h1>
        <p className="text-sm text-slate-600">Produtos premium & pacotes — encontre conforto e segurança</p>
      </div>

      {/* category filters */}
      {categories.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Link href="/store" className={`px-3 py-1 rounded ${!categoryFilter ? "bg-slate-900 text-white" : "bg-white border"}`}>Todos</Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/store?category=${encodeURIComponent(c.slug)}`}
              className={`px-3 py-1 rounded ${categoryFilter === c.slug ? "bg-slate-900 text-white" : "bg-white border"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {/* Top highlighted */}
      {ordered && ordered.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ordered.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {(!ordered || ordered.length === 0) && (
        <div className="text-slate-500">Nenhum produto encontrado para essa categoria.</div>
      )}
    </div>
  );
}