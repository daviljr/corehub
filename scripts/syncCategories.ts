// scripts/syncCategories.ts
import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";

type ProductRow = any;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("ERRO: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });

function canonicalSlug(s: string | null | undefined) {
  if (!s) return "";
  return slugify(s.trim(), { lower: true, remove: /[*+~.()'"!:@]/g });
}

async function main() {
  console.log("Buscando produtos (apenas colunas relevantes)...");
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, title, slug, category_id, category_name, categories")
    .limit(5000);

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    process.exit(1);
  }
  const rows = (products || []) as ProductRow[];
  console.log("Produtos encontrados:", rows.length);

  // mapa slug -> { name, examples:set }
  const map: Record<string, { name: string; examples: Set<string> }> = {};

  rows.forEach((p) => {
    // 1) category_name textual
    if (p.category_name) {
      const name = String(p.category_name).trim();
      if (name) {
        const slug = canonicalSlug(name);
        if (!map[slug]) map[slug] = { name, examples: new Set() };
        map[slug].examples.add(name);
      }
    }

    // 2) categories pivot (array of objects)
    if (Array.isArray(p.categories)) {
      p.categories.forEach((c: any) => {
        if (!c) return;
        const name = c.name || c.slug || String(c.id || "");
        const slug = canonicalSlug(name);
        if (!map[slug]) map[slug] = { name, examples: new Set() };
        map[slug].examples.add(name);
      });
    }

    // 3) fallback: category_id as string
    if (!p.category_name && p.category_id) {
      const name = String(p.category_id).trim();
      const slug = canonicalSlug(name);
      if (!map[slug]) map[slug] = { name, examples: new Set() };
      map[slug].examples.add(name);
    }
  });

  console.log("Categorias candidatas (unificadas por slug):", Object.keys(map).length);

  // criar categorias no banco
  for (const slug of Object.keys(map)) {
    const entry = map[slug];
    // verifica se existe slug
    const { data: existing } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (!existing) {
      const { data: created, error: insErr } = await supabase
        .from("categories")
        .insert({ name: entry.name, slug })
        .select()
        .single();

      if (insErr) {
        console.warn("Falha ao inserir categoria", slug, insErr);
      } else {
        console.log("Categoria criada:", created.slug, created.id);
      }
    } else {
      // optional: atualizar nome se quiser — aqui apenas log
      console.log("Categoria já existe:", existing.slug);
    }
  }

  console.log("Sincronização concluída. Rever categorias no painel 'categories' do Supabase.");
  console.log("Relatório (exemplos por slug):");
  for (const slug of Object.keys(map)) {
    console.log("-", slug, "->", Array.from(map[slug].examples).slice(0, 4).join(", "));
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Erro script:", err);
  process.exit(1);
});