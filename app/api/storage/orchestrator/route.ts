import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProviders, chooseProvider } from "@/lib/orchestrator";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // optional: restrict to admin for now
    const cookie = req.cookies.get ? req.cookies.get("corehub_admin")?.value : undefined;
    // allow admin only for now; in future add signed token for client uploads
    if (!cookie) {
      return NextResponse.json({ error: "unauthorized - admin cookie missing" }, { status: 401 });
    }

    const body = await req.json().catch(()=>({}));
    const clientRegion = body.clientRegion || req.headers.get("x-vercel-ip-country") || null;
    const owner_table = body.owner_table || null;
    const role = body.role || "main";
    const filename = body.filename || null;
    const content_type = body.content_type || null;
    const size_bytes = body.size_bytes || null;

    // fetch providers and choose best
    const providers = await getProviders();
    if (!providers || providers.length === 0) return NextResponse.json({ error: "no providers configured" }, { status: 500 });

    const chosen = chooseProvider(providers, clientRegion || null);
    if (!chosen) return NextResponse.json({ error: "no provider available" }, { status: 500 });

    // Return provider info + instructions hint.
    // For now we return provider config and type so the client/admin UI can decide how to upload.
    // In future this endpoint will return signed URLs or direct params (presigned PUT, cloudinary preset, etc).
    const response = {
      provider: {
        id: chosen.id,
        name: chosen.name,
        type: chosen.type,
        base_url: chosen.base_url,
        config: chosen.config || {},
        meta: chosen.meta || {}
      },
      recommended_upload: (() => {
        if (chosen.type === 'supabase') {
          return { method: 'direct', note: 'use client-side supabase.storage.upload with anon key or signed URL' };
        }
        if (chosen.type === 'cloudinary') {
          return { method: 'direct', note: 'POST to cloudinary base_url with preset (config)', base_url: chosen.base_url };
        }
        if (chosen.type === 's3') {
          return { method: 'signed_put', note: 'request presigned PUT from server' };
        }
        return { method: 'custom', note: 'use provider.base_url and provider.config' };
      })()
    };

    return NextResponse.json(response);
  } catch (e:any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
