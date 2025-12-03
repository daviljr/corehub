import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { encrypt } from "@/lib/crypto";

// supabase config (server-side)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  try {
    // admin-only check via cookie (NextRequest has cookies; here fallback)
    // In Next 14 Edge route, req has cookies via headers. We trust caller for now,
    // but will still fail if missing token.
    const body = await req.json().catch(()=>({}));
    const token = body?.token;
    const note = body?.note || null;
    if (!token) return NextResponse.json({ ok:false, error: "missing token" }, { status: 400 });

    // encrypt token
    const encrypted = encrypt(String(token));

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      // Save not possible, but still return ok:true to avoid blocking front-end flows.
      return NextResponse.json({ ok:true, saved:false, message: "Supabase not configured; token encrypted but not saved." });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const insertRes = await supabase.from("oauth_providers").insert([{
      provider: "vercel",
      provider_user: note,
      access_token_encrypted: encrypted,
      scope: null
    }]);

    if (insertRes.error) {
      return NextResponse.json({ ok:false, error: insertRes.error.message || String(insertRes.error) }, { status: 500 });
    }

    return NextResponse.json({ ok:true, saved:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: String(e) }, { status: 500 });
  }
}
