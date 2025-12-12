import { getProductById, getProducts } from "@/lib/products";
import AddToCartButton from "@/app/components/AddToCartButton";
import Link from "next/link";

// Formatação profissional de preço
function formatPrice(value: any, currency = "BRL") {
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

type Props = {
  params: { id: string };
};

export default async function ProductPage({ params }: Props) {
  const product = await getProductById(params.id);

  if (!product) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        <p className="text-slate-500 mt-2">Este item não existe ou foi removido.</p>
      </div>
    );
  }

  // Imagens
  const large =
    product.image_large_url ||
    product.image_cdn_url ||
    product.image_medium_url ||
    product.image_url;

  const medium = product.image_medium_url || product.image_thumb_url || product.image_url;
  const thumb = product.image_thumb_url || product.image_lqip || "/placeholder.png";
  const alt = product.image_alt || product.title || product.name || "Produto Sheidbox";

  const price = formatPrice(product.price, product.currency || "BRL");

  // Buscar produtos relacionados (simples e leve)
  const all = await getProducts();
  const related = (all || [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* COLUNA ESQUERDA - IMAGENS + DESCRIÇÃO */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src={large || medium || thumb}
            alt={alt}
            className="w-full h-[520px] object-cover"
            loading="lazy"
          />
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold">{product.title}</h1>

          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {product.categories.map((c) => (
                <span
                  key={c.id}
                  className="px-2 py-1 bg-slate-100 border rounded-full text-xs text-slate-700"
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-slate-600 whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>

      {/* COLUNA DIREITA - PREÇO + AÇÕES */}
      <aside className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-slate-600">Preço</div>
          <div className="text-2xl font-bold text-green-700">{price}</div>

          <div className="mt-4">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Estoque: {product.stock ?? 0}
          </div>
        </div>

        {/* PRODUTOS RELACIONADOS */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold mb-3">Produtos relacionados</h4>

          {related.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/store/product/${p.slug || p.id}`}
                  className="block border p-3 rounded hover:bg-slate-50 transition"
                >
                  <div className="font-semibold truncate">{p.title}</div>
                  <div className="text-sm text-slate-500 truncate">{p.slug}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500">Nenhum item relacionado.</div>
          )}
        </div>
      </aside>
    </div>
  );
}