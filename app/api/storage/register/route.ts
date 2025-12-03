import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      type,
      base_url,
      public_key,
      private_key,
      token,
      config = {}
    } = body;

    if (!name || !type || !base_url) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, base_url" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("storage_services")
      .insert({
        name,
        slug: slug || null,
        type,
        base_url,
        public_key: public_key || null,
        private_key: private_key || null,
        config: {
          token: token || null,
          ...config,
        },
        score: 1000,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, storage: data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Internal error" },
      { status: 500 }
    );
  }
}