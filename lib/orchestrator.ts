import { createClient } from "@supabase/supabase-js";
import { supabase as supabaseClientFromLib } from "./supabase"; // alias to your supabase client

// Usamos o client que já exporta supabase do lib/supabase.ts para manter env vars corretas
const supabase = supabaseClientFromLib;

/**
 * Retorna lista de providers ordenada por priority asc
 */
export async function getProviders() {
  const { data, error } = await supabase.from("file_storages").select("*").order("priority", { ascending: true });
  if (error) throw error;
  return data || [];
}

/**
 * Escolhe provider ideal com base em:
 *  - regional hint (country code)
 *  - provider.priority (menor = melhor)
 *  - provider.meta.health.latency (menor = melhor)
 *  - provider.config.regional_priority (mapa)
 */
export function chooseProvider(providers:any[], clientRegion?:string|null) {
  if (!providers || providers.length === 0) return null;

  const withScore = providers.map(p => {
    let score = (typeof p.priority === 'number') ? p.priority : 1000;
    // regional priority: if provider.config.regional_priority exists and has value for clientRegion, subtract weight
    try {
      const rp = p.config?.regional_priority || {};
      if (clientRegion && rp[clientRegion]) score -= 10; // prefer region matches
    } catch (e) {}
    // latency penalty (higher latency => higher score)
    try {
      const latency = p.meta?.health?.latency;
      if (typeof latency === 'number') score += Math.round(latency / 50); // every 50ms adds 1
    } catch (e) {}
    // if provider marked inactive, penalize heavily
    if (!p.is_active) score += 1000;
    return { p, score };
  });

  withScore.sort((a,b) => a.score - b.score);
  return withScore[0]?.p || null;
}
