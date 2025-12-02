import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  // proteger qualquer rota sob /admin
  matcher: ["/admin/:path*"]
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow Next internals, API auth routes (they handle their own), static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".") ) {
    return NextResponse.next();
  }

  // Protect /admin (inclui /admin/organize etc.)
  const cookie = req.cookies.get("corehub_admin")?.value;
  const adminSecret = process.env.ADMIN_SECRET;

  if (pathname.startsWith("/admin")) {
    if (!cookie || !adminSecret || cookie !== adminSecret) {
      // redirect to login, preserving "from" so we can return after login
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `from=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
