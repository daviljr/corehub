import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  if (!product) return null;

  const name =
    product.name ||
    product.title ||
    "Produto";

  const price =
    product.price != null
      ? Number(product.price)
      : 0;

  // --- IMAGEM PRINCIPAL (ordem de prioridade perfeita) ---
  const img =
    product.image_thumb_url ||
    product.image_medium_url ||
    product.image_url ||
    product.image_cdn_url ||
    product.image_lqip ||
    "/placeholder.svg";

  // --- ALT TEXT SEO ---
  const alt =
    product.image_alt ||
    product.title ||
    product.name ||
    "Produto Sheidbox";

  // --- SLUG / ID PARA LINK ---
  const slugOrId = product.slug || product.id;

  return (
    <div className="border rounded-lg shadow-md bg-white hover:shadow-lg transition overflow-hidden">
      <Link href={`/store/product/${slugOrId}`}>
        <div className="w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={img}
            alt={alt}
            className="object-cover w-full h-full"
          />
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg text-slate-900">
          {name}
        </h3>

        {/* preço */}
        <p className="text-green-700 font-bold text-lg">
          R$ {price.toFixed(2)}
        </p>

        <Link
          href={`/store/product/${slugOrId}`}
          className="inline-block mt-3 px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-semibold hover:bg-slate-800 transition"
        >
          Ver produto
        </Link>
      </div>
    </div>
  );
}