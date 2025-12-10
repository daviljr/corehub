import { getProductById, getProducts } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "../../components/ProductCard";

type Props = {
  params: { id: string };
};

function formatPrice(v: any) {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return "0,00";
  return n.toFixed(2).replace(".", ",");
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductById(params.id);
  if (!product) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        <p className="text-slate-500 mt-2">Verifique o link ou tente outro item.</p>
      </div>
    );
  }

  // build image sources
  const large = product.image_large_url || product.image_cdn_url || product.image_medium_url || product.image_url;
  const medium = product.image_medium_url || product.image_thumb_url || product.image_url;
  const thumb = product.image_thumb_url || product.image_lqip || "/placeholder.svg";
  const alt = product.image_alt || product.title || product.name || "Produto Sheidbox";

  // related products (simple)
  const all = await getProducts();
  const related = (all || []).filter((p: any) => p.id !== product.id).slice(0, 4);

  const price = formatPrice(product.price);

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src={large || medium || thumb}
            srcSet={`${thumb} 400w, ${medium || thumb} 800w, ${large || medium || thumb} 1200w`}
            sizes="(max-width: 1024px) 100vw, 66vw"
            alt={alt}
            className="w-full h-[520px] object-cover"
            loading="lazy"
          />
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold">{product.title || product.name}</h1>
          <p className="mt-2 text-slate-600">{product.description}</p>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-slate-600">Preço</div>
          <div className="text-2xl font-bold text-green-700">R$ {price}</div>
          <div className="mt-4">
            <AddToCartButton product={product} />
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Estoque: {product.stock ?? 0}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold mb-3">Produtos relacionados</h4>
          <div className="grid grid-cols-1 gap-3">
            {related.map((r: any) => <ProductCard key={r.id} product={r} />)}
          </div>
        </div>
      </aside>
    </div>
  );
}