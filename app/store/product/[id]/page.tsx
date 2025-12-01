import { getProductById } from '../../../../lib/products';
import AddToCartButton from '../../../../components/AddToCartButton';
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) return <div>Produto não encontrado</div>;
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="h-96 bg-gray-100 flex items-center justify-center">
          <img src={product.image_url || '/placeholder.png'} alt={product.title} className="max-h-full"/>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="mt-2 text-xl">R$ {parseFloat(product.price).toFixed(2)}</p>
        <p className="mt-4 text-slate-600">{product.description || 'Descrição do produto.'}</p>
        <div className="mt-6">
          <AddToCartButton product={product}/>
        </div>
      </div>
    </div>
  );
}
