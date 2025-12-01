import Link from 'next/link';
import { getProducts } from '../../lib/products';
export default async function StorePage() {
  const products = await getProducts();
  return (
    <div>
      <h1 className="text-3xl font-bold">Loja Shadebox</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {products.map((p:any) => (
          <div key={p.id} className="border rounded p-4 shadow-sm">
            <div className="h-40 bg-gray-100 flex items-center justify-center mb-3">
              <img src={p.image_url || '/placeholder.png'} alt={p.title} className="max-h-full"/>
            </div>
            <h3 className="font-semibold">{p.title}</h3>
            <p className="mt-2 text-lg">R$ {parseFloat(p.price).toFixed(2)}</p>
            <div className="mt-3">
              <Link href={`/store/product/${p.id}`} className="inline-block px-4 py-2 bg-slate-900 text-white rounded">Ver produto</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
