import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET não definido no servidor." },
      { status: 500 }
    );
  }

  if (password !== adminSecret) {
    return NextResponse.json(
      { error: "Senha inválida" },
      { status: 401 }
    );
  }

  // Criar resposta
  const res = NextResponse.json({ ok: true });

  // Definir cookie seguro
  res.cookies.set("corehub_admin", adminSecret, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  });

  return res;
}
