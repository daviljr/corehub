import Link from 'next/link';

type Props = {
  product: any;
};

export default function ProductCard({ product }: Props) {
  const name = product.name || product.title || 'Produto';
  const price = Number(product.price || 0).toFixed(2);
  const img = product.image_thumb_url || product.image_url || '/placeholder.png';
  const slugOrId = product.slug || product.id;

  return (
    <article className="border rounded p-4 shadow-sm flex flex-col hover:shadow-md transition">
      <div className="h-40 bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
        <img src={img} alt={name} className="object-contain max-h-full w-full" />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-sm md:text-base">{name}</h3>
        <div className="mt-2 text-lg font-bold">R$ {price}</div>
        {product.categories && product.categories.length > 0 && (
          <div className="mt-2">
            {product.categories.slice(0,2).map((c:any) => (
              <span key={c.id} className="inline-block text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded mr-2">{c.name}</span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3">
        <Link href={`/store/product/${slugOrId}`} className="inline-block px-4 py-2 bg-slate-900 text-white rounded">Ver produto</Link>
      </div>
    </article>
  );
}
