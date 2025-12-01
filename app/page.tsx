import Link from 'next/link';
export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg p-8 bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg">
        <h1 className="text-4xl font-extrabold">Shadebox — Produtos de Luxo e Viagens</h1>
        <p className="mt-2 max-w-2xl">Escolha produtos premium e pacotes de viagem com conforto e segurança.</p>
        <div className="mt-4">
          <Link href="/store" className="inline-block bg-white text-teal-700 px-5 py-2 rounded-md font-semibold">Ver Loja</Link>
        </div>
      </section>
    </div>
  );
}
