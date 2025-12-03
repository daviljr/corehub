import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("storage_services")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      console.error("Supabase error (GET /api/storage/list):", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data: data || [] });
  } catch (e: any) {
    console.error("Unexpected error (GET /api/storage/list):", e);
    return NextResponse.json({ ok: false, error: e.message || "Unknown error" }, { status: 500 });
  }
}