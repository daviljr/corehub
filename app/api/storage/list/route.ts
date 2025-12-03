import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // tentamos ler file_references (order by priority asc, created_at desc)
    const { data, error } = await supabase
      .from("file_references")
      .select("*")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error (GET /api/storage/list):", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data: data || [] });
  } catch (e: any) {
    console.error("Unexpected error (GET /api/storage/list):", e);
    return NextResponse.json({ ok: false, error: (e && e.message) || String(e) }, { status: 500 });
  }
}
