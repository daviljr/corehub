import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

function unauthorized() {
  return new NextResponse(JSON.stringify({ error: "unauthorized" }), { status: 401 });
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("corehub_admin")?.value;
  if (!cookie || cookie !== ADMIN_SECRET) return unauthorized();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, image_url, stock, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("corehub_admin")?.value;
  if (!cookie || cookie !== ADMIN_SECRET) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const { name, slug, price = 0, image_url = null, stock = 0 } = body;

  if (!name || !slug) {
    return new NextResponse(JSON.stringify({ error: "Missing name or slug" }), { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .insert([{ name, slug, price, image_url, stock }])
    .select()
    .single();

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return NextResponse.json({ data });
}
