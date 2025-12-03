import { NextResponse } from "next/server";

export async function GET(req) {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const base = process.env.APP_BASE_URL;
  if (!client_id || !base) {
    return NextResponse.json({ error: "Missing env GITHUB_CLIENT_ID or APP_BASE_URL" }, { status: 500 });
  }

  // generate state and save in cookie
  const state = Math.random().toString(36).slice(2);
  const redirectUri = `${base.replace(/\/$/,'')}/api/auth/github/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(client_id)}&scope=repo%20read:user&state=${encodeURIComponent(state)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  const res = NextResponse.redirect(url);
  // httpOnly cookie short-lived
  res.cookies.set("gh_oauth_state", state, { httpOnly: true, sameSite: "lax", maxAge: 300, path: "/" });
  return res;
}
