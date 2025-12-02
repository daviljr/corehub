import Link from "next/link";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

function ProductCard({ id, name, price, stock }: ProductCardProps) {
  return (
    <div className="p-4 border rounded">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <div className="text-sm text-slate-500">SKU: {id}</div>
        </div>
        <div className="text-right">
          <div className="font-medium">R$ {price.toFixed(2)}</div>
          <div className="text-sm text-slate-500">{stock} em estoque</div>
        </div>
      </div>
      <div className="mt-3">
        <Link href={`/store/product/${id}`} className="text-teal-600 hover:underline">Ver ficha →</Link>
      </div>
    </div>
  );
}

export default function ProdutosPage() {
  // dados de exemplo placeholders (mais tarde integrar com Supabase)
  const sample = [
    { id: "c2b79c07", name: "Jaqueta de Couro Premium", price: 1299.9, stock: 0 },
    { id: "4d9fca2e", name: "Pacote Punta del Este 5 dias", price: 2499.0, stock: 0 },
  ];

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-sm text-slate-500">Visão geral dos produtos (integração Supabase futura).</p>
        </header>

        <section className="grid gap-4">
          {sample.map((p) => (
            <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} stock={p.stock} />
          ))}
        </section>

        <div className="mt-6">
          <Link href="/organize" className="text-teal-600 hover:underline">← Voltar ao painel</Link>
        </div>
      </div>
    </main>
  );
}
