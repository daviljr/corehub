import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProviders, chooseProvider } from "@/lib/orchestrator";

// Endpoint para orquestrar/selecionar o provider ideal.
// Atualmente protegido por cookie admin (corehub_admin). Futuramente podemos emitir tokens.
export async function POST(req: NextRequest) {
  try {
    // valida admin cookie (provisório)
    const cookie = req.cookies.get ? req.cookies.get("corehub_admin")?.value : undefined;
    if (!cookie) {
      return NextResponse.json({ error: "unauthorized - admin cookie missing" }, { status: 401 });
    }

    const body = await req.json().catch(()=>({}));
    const clientRegion = body.clientRegion || req.headers.get("x-vercel-ip-country") || null;

    const providers = await getProviders();
    if (!providers || providers.length === 0) {
      return NextResponse.json({ error: "No providers configured" }, { status: 500 });
    }

    const chosen = chooseProvider(providers, clientRegion || null);
    if (!chosen) {
      return NextResponse.json({ error: "No suitable provider found" }, { status: 500 });
    }

    // Retorna instruções resumidas para upload (client/admin decide acordo)
    const recommended_upload = (() => {
      if (chosen.type === "supabase") {
        return { method: "direct", note: "use supabase.storage.upload (anon or signed)" };
      }
      if (chosen.type === "cloudinary") {
        return { method: "direct", note: "POST to cloudinary base_url with preset (config)", base_url: chosen.base_url };
      }
      if (chosen.type === "s3") {
        return { method: "signed_put", note: "request presigned PUT from server" };
      }
      return { method: "custom", note: "use provider.base_url and provider.config" };
    })();

    return NextResponse.json({
      provider: {
        id: chosen.id,
        name: chosen.name,
        type: chosen.type,
        base_url: chosen.base_url,
        config: chosen.config || {},
        meta: chosen.meta || {},
        priority: chosen.priority || 100
      },
      recommended_upload
    });

  } catch (e:any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
