import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Sheidbox · Loja Premium",
  description:
    "Sheidbox - Produtos exclusivos e viagens. Loja online integrada ao CoreHub.",
  manifest: "/manifest.json",
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-white text-slate-800 antialiased">
        {/* HEADER */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Sheidbox
            </Link>

            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/store" className="hover:text-emerald-600">
                Loja
              </Link>

              <Link href="/blog" className="hover:text-emerald-600">
                Blog
              </Link>

              <Link href="/cart" className="hover:text-emerald-600">
                Carrinho
              </Link>

              <Link href="/account" className="hover:text-emerald-600">
                Conta
              </Link>
            </nav>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="min-h-screen max-w-6xl mx-auto p-6">{children}</main>

        {/* FOOTER */}
        <footer className="border-t bg-white mt-16">
          <div className="max-w-6xl mx-auto p-4 text-sm text-slate-500">
            © {new Date().getFullYear()} Sheidbox · CoreHub
          </div>
        </footer>
      </body>
    </html>
  );
}