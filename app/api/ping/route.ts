import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabaseService = process.env.SUPABASE_SERVICE_KEY || '';

  const meta: Record<string, any> = {
    env_read: {
      NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseAnon,
      SUPABASE_SERVICE_KEY: !!supabaseService,
      NODE_ENV: process.env.NODE_ENV ?? null,
    },
  };

  // If we have anon key, try a light query (may return error if table doesn't exist).
  if (supabaseUrl && supabaseAnon) {
    try {
      const sb = createClient(supabaseUrl, supabaseAnon);
      // try a lightweight select on a common table name "products" (if exists)
      const { data, error, status } = await sb
        .from('products')
        .select('id')
        .limit(1);
      meta.supabase = {
        attempted: true,
        ok: !error,
        status,
        error: error ? error.message || error : null,
        sample: Array.isArray(data) ? data : null,
      };
    } catch (err: any) {
      meta.supabase = { attempted: true, ok: false, error: err.message ?? String(err) };
    }
  } else {
    meta.supabase = { attempted: false, ok: false, error: 'missing env variables' };
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    meta,
  });
}
