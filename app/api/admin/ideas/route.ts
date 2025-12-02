import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = { ...body };
    const { data, error } = await supabase.from("ideas").insert([payload]).select().single();
    if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...payload } = body;
    if (!id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
    const { data, error } = await supabase.from("ideas").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body || {};
    if (!id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
    const { data, error } = await supabase.from("ideas").delete().eq("id", id).select().single();
    if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
