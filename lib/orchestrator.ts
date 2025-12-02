import { supabase } from "./supabase";

/**
 * Retorna lista de providers ordenada por priority asc
 */
export async function getProviders() {
  const { data, error } = await supabase
    .from("file_storages")
    .select("*")
    .order("priority", { ascending: true });
  if (error) throw error;
  return data || [];
}

/**
 * Escolhe provider ideal com base em:
 *  - clientRegion (country code)
 *  - provider.priority (menor = melhor)
 *  - provider.meta.health.latency (menor = melhor)
 *  - provider.config.regional_priority (mapa)
 */
export function chooseProvider(providers:any[], clientRegion?:string|null) {
  if (!providers || providers.length === 0) return null;

  const scored = providers.map((p:any) => {
    let score = (typeof p.priority === "number") ? p.priority : 1000;

    // regional preference from config.regional_priority (object mapping country->weight)
    try {
      const rp = p.config?.regional_priority || {};
      if (clientRegion && rp[clientRegion]) score -= Math.max(0, rp[clientRegion]);
    } catch (e) {}

    // latency penalty (if available in meta.health.latency)
    try {
      const latency = p.meta?.health?.latency;
      if (typeof latency === "number") score += Math.round(latency / 50);
    } catch (e) {}

    // penalize inactive
    if (!p.is_active) score += 10000;

    return { p, score };
  });

  scored.sort((a,b)=> a.score - b.score);
  return scored[0]?.p || null;
}
