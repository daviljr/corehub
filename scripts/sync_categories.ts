// scripts/sync_categories.ts
import { createClient } from '@supabase/supabase-js';
import slugify from 'slugify';

// configure with your service role key (use env var)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });

function canonical(s: string | null | undefined) {
  if (!s) return '';
  // slugify removes accents if configured
  return slugify(s.trim().toLowerCase(), { remove: /[*+~.()'"!:@]/g, replacement: '-', lower: true });
}

async function run() {
  console.log('Buscando produtos...');
  const { data: products, error: pErr } = await supabase.from('products').select('id, name, title, category_id, category_name, categories');
  if (pErr) {
    console.error('Erro ao buscar produtos', pErr);
    process.exit(1);
  }
  // mapa slug -> canonical name
  const map: Record<string, { name: string; examples: Set<string> }> = {};

  products?.forEach((pr: any) => {
    // prefer explicit category_name field, else product.categories pivot if present, else category_id
    if (pr.category_name) {
      const slug = canonical(pr.category_name);
      map[slug] = map[slug] || { name: pr.category_name.trim(), examples: new Set() };
      map[slug].examples.add(pr.category_name.trim());
    }
    if (pr.categories && Array.isArray(pr.categories)) {
      pr.categories.forEach((c: any) => {
        if (!c) return;
        const slug = canonical(c.name || c.slug || String(c.id || ''));
        const name = c.name || c.slug || String(c.id || '');
        map[slug] = map[slug] || { name, examples: new Set() };
        map[slug].examples.add(name);
      });
    }
    if (!pr.category_name && pr.category_id) {
      // treat category_id as potential label
      const slug = canonical(pr.category_id);
      map[slug] = map[slug] || { name: pr.category_id, examples: new Set() };
      map[slug].examples.add(pr.category_id);
    }
  });

  console.log('Categorias candidatas encontradas:', Object.keys(map).length);

  // Inserir categorias no banco se não existirem
  for (const slug of Object.keys(map)) {
    const name = map[slug].name;
    // verifica se já existe
    const { data: existing } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();

    if (!existing) {
      const { data: inserted, error: insErr } = await supabase.from('categories').insert({ name, slug }).select().single();
      if (insErr) {
        console.warn('Erro ao inserir categoria', slug, insErr);
      } else {
        console.log('Criada categoria:', slug, inserted.id);
      }
    } else {
      // opcional: atualizar nome se desejar
      // await supabase.from('categories').update({ name }).eq('id', existing.id);
    }
  }

  console.log('População de categorias concluída.');
  // Opcional: popular pivot product_categories aqui (com base em matching) — ou fazer manualmente
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});