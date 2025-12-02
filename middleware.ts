import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  // proteger qualquer rota sob /admin
  matcher: ["/admin/:path*"]
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // permitir recursos internos, APIs e arquivos estáticos
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // permitir explicitamente a página de login pública
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login?")) {
    return NextResponse.next();
  }

  // proteger demais rotas /admin/*
  if (pathname.startsWith("/admin")) {
    // cookie esperado (mantive o nome atual usado no seu projeto)
    const cookie = req.cookies.get("corehub_admin")?.value;
    const adminSecret = process.env.ADMIN_SECRET;

    // se não houver cookie válido, redireciona para login preservando origem
    if (!cookie || !adminSecret || cookie !== adminSecret) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `from=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
