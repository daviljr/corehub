import Link from 'next/link';
import { getProducts } from '../../lib/products';

export default async function StorePage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Loja Sheidbox</h1>
        <p className="text-sm text-slate-600">Produtos premium & pacotes — encontre conforto e segurança</p>
      </div>

      {/* Destaques: os 4 primeiros */}
      {products && products.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {products.slice(0,4).map((p:any) => (
            <article key={p.id} className="rounded-lg overflow-hidden shadow-lg border">
              <div className="h-44 bg-gray-100 flex items-center justify-center">
                <img
                  src={p.image_url || p.image_thumb_url || '/placeholder.png'}
                  alt={p.name || p.title || 'Produto Sheidbox'}
                  className="object-contain h-full w-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{p.name || p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.slug || ''}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-lg font-bold">R$ {Number(p.price || 0).toFixed(2)}</div>
                  <Link href={`/store/product/${p.slug || p.id}`} className="inline-block px-3 py-1 bg-slate-900 text-white rounded">Ver produto</Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {products.map((p:any) => (
          <div key={p.id} className="border rounded p-4 shadow-sm flex flex-col">
            <div className="h-40 bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
              <img
                src={p.image_url || p.image_thumb_url || '/placeholder.png'}
                alt={p.name || p.title || 'Produto Sheidbox'}
                className="max-h-full object-contain"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{p.name || p.title}</h3>
              <p className="mt-2 text-lg">R$ {Number(p.price || 0).toFixed(2)}</p>
            </div>

            <div className="mt-3">
              <Link href={`/store/product/${p.slug || p.id}`} className="inline-block px-4 py-2 bg-slate-900 text-white rounded">Ver produto</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
