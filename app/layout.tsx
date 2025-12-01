import './globals.css';
import Script from 'next/script';
export const metadata = {
  title: 'Sheidbox · Loja Premium',
  description: 'Sheidbox - Produtos exclusivos e viagens. Loja online integrada ao CoreHub.'
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f766e" />
      </head>
      <body className="bg-white text-slate-800 antialiased">
        <header className="border-b">
          <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
            <a href="/" className="text-2xl font-bold">Sheidbox</a>
            <nav className="space-x-4">
              <a href="/store">Loja</a>
              <a href="/blog">Blog</a>
              <a href="/cart">Carrinho</a>
              <a href="/account">Conta</a>
    </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-6">{children}</main>
        <footer className="border-t mt-12">
          <div className="max-w-6xl mx-auto p-4 text-sm text-slate-500">© Sheidbox · CoreHub</div>
        </footer>
      </body>
    </html>
  );
}
