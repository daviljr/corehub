import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { encrypt } from "@/lib/crypto";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieState = req.cookies.get("gh_oauth_state")?.value;

    if (!code) return NextResponse.json({ error: "code missing" }, { status: 400 });
    if (!state || !cookieState || state !== cookieState) return NextResponse.json({ error: "invalid_state" }, { status: 400 });

    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;
    if (!client_id || !client_secret) return NextResponse.json({ error: "GITHUB_CLIENT_ID/SECRET missing" }, { status: 500 });

    // exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id, client_secret, code, redirect_uri: `${process.env.APP_BASE_URL.replace(/\/$/,'')}/api/auth/github/callback` })
    });
    const tokenJson = await tokenRes.json();
    const access_token = tokenJson.access_token;

    if (!access_token) return NextResponse.json({ error: "no_access_token", details: tokenJson }, { status: 500 });

    // get user info
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${access_token}`, Accept: "application/json", "User-Agent": "CoreHub" }
    });
    const userJson = await userRes.json();
    const login = userJson?.login || null;

    // try save to Supabase (if configured)
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const enc = encrypt(String(access_token));
      const { error } = await supabase.from("oauth_providers").insert([{
        provider: "github",
        provider_user: login,
        access_token_encrypted: enc,
        scope: tokenJson.scope || null
      }]);
      if (error) {
        // continue but log
        console.error("supabase insert error", error);
      }
    }

    // cleanup cookie and redirect to admin storage
    const base = process.env.APP_BASE_URL || "/";
    const res = NextResponse.redirect(base + "/admin/storage");
    res.cookies.delete("gh_oauth_state");
    return res;
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: String(e) }, { status: 500 });
  }
}
