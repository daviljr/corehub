import Link from 'next/link';
import { getProducts } from '../../lib/products';
import ProductCard from '../components/ProductCard';

export default async function StorePage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Loja Sheidbox</h1>
        <p className="text-sm text-slate-600">Produtos premium & pacotes — encontre conforto e segurança</p>
      </div>

      {/* Destaques */}
      {products && products.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {products.slice(0,4).map((p:any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      )}

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {products.map((p:any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
