import { getProductById } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

type Props = {
  params: { id: string };
};

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

  // Normaliza o preço (garante número válido)
  const priceNumber = Number(product.price || 0);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{product.title || product.name}</h1>

      <p className="mt-2 text-xl font-semibold text-green-700">
        R$ {priceNumber.toFixed(2)}
      </p>

      <p className="mt-4 text-slate-600">
        {product.description || "Descrição do produto."}
      </p>

      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.title || product.name}
          className="mt-4 rounded-lg shadow-lg w-full"
        />
      ) : (
        <div className="mt-4 p-10 bg-slate-200 text-center rounded-lg">
          Sem imagem disponível
        </div>
      )}

      <div className="mt-6">
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
