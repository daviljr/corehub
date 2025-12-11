# CÓDICE — Cérebro Diretivo do CoreHub

## Versão
- versão: 1.0.0
- data: 2025-12-11
- autor técnico: Guardião Técnico (ChatGPT — Davi executor)

---

## 1. Propósito do CÓDICE
O **CÓDICE** é o único documento de verdade do CoreHub.  
Ele contém, com detalhe máximo e ordenado, tudo sobre este sistema: arquitetura, regras, convenções, protocolos de execução, histórico, e instruções passo-a-passo para que qualquer executor (humano ou IA) possa continuar, reconstruir ou auditar o projeto do zero.

**Regra absoluta:** qualquer mudança operacional do sistema só será considerada válida se houver um patch/entry correspondente no CÓDICE.

---

## 2. Papéis e responsabilidades
- **Guardião Técnico (ChatGPT)** — responsável por:
  - gerar patches, diretrizes técnicas e decisões;
  - validar mudanças e fornecer comandos exatos (um por um) para o Executor;
  - manter o CÓDICE atualizado com decisões técnicas e passos.
- **Executor (Você, Davi)** — responsável por:
  - executar os comandos exatos entregues pelo Guardião no ambiente Termux/Android;
  - commitar/gerar patches conforme instruções;
  - atualizar o Journal e sinalizar conclusões com `feito X`.

---

## 3. Como eu (Executor) uso o CÓDICE — rotina mínima (2 minutos)
1. Antes de qualquer mudança: gerar snapshot  
   `./scripts/snapshot.sh` → cria `corehub_structure.txt`
2. Registrar intenção: adicionar 1-linha no `Journal.md` (Data + objetivo curto)
3. Executar comandos recebidos do Guardião (um comando por vez)
4. Após comando crítico: `git commit` e gerar patch em `PATCHES/`
5. Atualizar `Journal.md` com resultado (commit hash) e próximo passo curto

---

## 4. Formato padrão de pedido ao Guardião (exatamente este template)
Ao pedir continuidade ou correção, enviar **apenas** a mensagem preenchida neste formato (cole e preencha):

---

## 5. Regras técnicas iniciais (imediatas e inalteráveis)
1. **Linguagem única:** TypeScript (.ts/.tsx/.d.ts). Nenhum .js novo será aceito.  
2. **Admin auth:** cookie `corehub_admin` + `ADMIN_SECRET` server-only.  
3. **Schema produto:** o padrão acordado no CÓDICE (campos image_*, slug, price, etc) é a fonte de verdade.  
4. **Execução no Android:** todo comando fornecido pelo Guardião será compatível com Termux — se um comando não rodar no Termux, Guardião fornecerá alternativa.  
5. **Segurança:** nunca compartilhe chaves secretas em chat. Informe apenas se variáveis estão setadas (yes/no).

---

## 6. Índice do CÓDICE (este arquivo será povoado progressivamente)
A. Introdução, Regras e Protocolo (você está aqui)  
B. Estrutura de Pastas & Arquivos — listas e responsabilidades  
C. Esquema de Dados — products, categories, pivot  
D. Rotas API críticas — contratos e exemplos curl (admin/public)  
E. Componentes UI padrão — ProductCard, ProductPage, StorePage  
F. Scripts & Automação — validate, snapshot, upload_and_patch  
G. Fluxo Git & Patches — branch naming, commit messages, aplicar patches  
H. Journal & TODO — modelos, exemplos, como preencher  
I. Recuperação e Reconstrução total — procedimentos de restauração (scripts, envs, backups)  
J. Histórico de decisões — registro de motivos por trás de mudanças

---

## 7. Próximo passo imediato (o que você executa agora — 1 comando)
**Executar no Termux (na raiz do repo):**
```bash
git add "Códice.md" || true
git commit -m "docs(codice): inicializa Códice — bloco 1 (introducao & protocolo)" || true

### 5.1 Backup & arquivos .bak (Regra)
- **Regra:** Arquivos com extensão `.bak` **não devem permanecer** no repositório.
- **Procedimento obrigatório ao encontrar `.bak`:**
  1. Gerar snapshot: `./scripts/snapshot.sh`
  2. Criar pasta de backup com timestamp: `.backups/auto_bak_<YYYYMMDDHHMMSS>/`
  3. Mover os arquivos `.bak` para essa pasta (preservando estrutura)
  4. `git add .backups/auto_bak_<timestamp>` e `git rm <arquivos .bak>`
  5. `git commit -m "chore(core): move *.bak to .backups/auto_bak_<timestamp>"`
  6. Atualizar `Journal.md` com referência ao commit
- **.gitignore:** deve conter `.backups/` e `*.bak` (já configurado).
- **Motivo:** mantém o repositório limpo, preserva histórico e evita confusão.


---

# B. Estrutura Oficial do CoreHub
> Este bloco define o **mapa do sistema**.  
> Nada pode ser criado fora dessa estrutura sem patch aprovado pelo Guardião.

## 1. Raiz do Projeto
- `app/` — Frontend Next.js (páginas, rotas, UI)
- `lib/` — Lógica compartilhada (supabase, produtos, utilidades)
- `components/` — Componentes isolados de UI
- `scripts/` — Scripts de manutenção e automação
- `public/` — Imagens públicas, icons, manifest
- `data/` — Banco local fallback (db.json)
- `memory/` — (reservado) conteúdos de IA internos
- `PATCHES/` — patches oficiais gerados pelo Guardião
- `.backups/` — sistema de backup automático
- `Códice.md` — Documento de autoridade máxima
- `Journal.md` — Registro diário cronológico
- `TODO.md` — Prioridades
- `corehub_structure.txt` — snapshot técnico da árvore do projeto

## 2. Estrutura detalhada de /app
- `/app/page.tsx` → homepage oficial
- `/app/layout.tsx` → layout global (header/footer)
- `/app/store/` → páginas da loja
- `/app/store/product/[id]/` → página individual de produto
- `/app/api/` → APIs internas
- `/app/admin/` → painel administrativo (protegido)
- `/app/cart/` → carrinho
- `/app/checkout/` → checkout
- `/app/blog/` → blog

## 3. Estrutura de /lib
- `lib/products.ts` → fonte da verdade sobre produtos
- `lib/supabase.ts` → cliente supabase
- `lib/image.ts` → manipulação de imagens
- `lib/orchestrator.ts` → automações internas
- `lib/crypto.ts` → utilidades criptográficas

## 4. Estrutura de /scripts
- `snapshot.sh` — gera mapa completo do sistema
- `validate.sh` — valida integridade futura do Códice
- `sync_categories.ts` — script planejado (categoria inteligente)

## 5. Regras de criação e manutenção
- Apenas o Guardião define novas pastas.
- Qualquer adição deve ser documentada neste bloco (B) com patch.
- Nada pode ser renomeado sem patch e referência no Journal.


---

# C. Esquema de Dados — Fonte de Verdade Absoluta

## 1. Tabela: products
(Conteúdo completo já validado pelo Guardião — DNA do sistema)

id (uuid, PK)  
sku (text)  
name (text, obrigatório)  
title (text)  
slug (text, obrigatório, único)  
category_id (uuid, opcional)  
description (text)  
currency (text, default BRL)  
price (numeric, obrigatório)  
discount (numeric)  
stock (numeric, default 0)  
created_at (timestamp)

### Campos de imagem (multi-size)
image_url  
image_thumb_url  
image_lqip  
image_medium_url  
image_large_url  
image_cdn_url  
image_alt

### Campos de SEO
og_image

### Destaque e ordenação
is_featured (boolean, default false)  
display_order (int, default 0)

---

## 2. Tabela: categories

id (uuid, PK)  
name (text, obrigatório)  
slug (text, obrigatório, único)  
description (text)

Regras:
- Nome normalizado (Title Case)  
- Slug único  
- Evitar duplicatas por normalização

---

## 3. Pivot: product_categories
product_id (uuid)  
category_id (uuid)

Permite múltiplas categorias por produto.

---

## 4. Regras de Normalização
- slug gerado por algoritmo estável  
- nomes de categorias normalizados  
- nenhuma duplicata é permitida  

---

## 5. Regras de Integridade do Sistema
- produto sem categoria recebe “Outros”  
- preço deve ser numérico  
- is_featured limitado a 8 produtos  
- imagens devem possuir alt se disponíveis  


---

# D. Rotas API — Contratos Oficiais do CoreHub

## 1. Autenticação Admin
Rotas admin exigem:
- Header: x-admin-secret: <ADMIN_SECRET>
OU
- Cookie: corehub_admin=<ADMIN_SECRET>

Sem isso: 401 unauthorized.

---

## 2. /api/admin/auth (POST)
Body:
{ "secret": "<ADMIN_SECRET>" }

Retorno:
{ "ok": true }

---

## 3. /api/admin/products

### GET
Retorna lista de produtos (máx 500).
Campos: id, name, slug, price, stock, image_url, image_thumb_url, created_at.

### POST — criar produto
Body obrigatório:
{
  "name": "...",
  "slug": "...",
  "price": number,
  "stock": number
}

### POST — atualizar imagens
Body:
{
  "update_image_for_id": "<uuid>",
  "image_url": "...",
  "image_thumb_url": "..."
}

---

## 4. /api/storage/register (POST)
Recebe dados de upload e retorna URLs públicas.
Body: filename, mimetype, size, slug

Retorno:
{ "public_url": "...", "thumb_url": "..." }

---

## 5. /api/storage/list (GET)
Lista arquivos do bucket público.

---

## 6. /api/ping
Retorno:
{ "pong": true }

---

## 7. /api/admin/ideas
CRUD de ideias administrativas. Não crítico para fluxo de vendas.


---

# E. Componentes e UI — Padrões Visuais do CoreHub

## E.1 — Biblioteca Visual Base (UI Base)

### 1. Cores Oficiais (Tailwind)
- Primária: `emerald-600`
- Primária clara: `emerald-500`
- Acento: `teal-500`
- Texto principal: `slate-800`
- Texto suave: `slate-600`
- Fundo claro: `white`
- Fundo suave: `slate-50`
- Erro: `red-500`

### 2. Bordas e sombras
- Raio padrão: `rounded-lg`
- Raio forte: `rounded-xl`
- Sombra padrão: `shadow`
- Sombra forte: `shadow-lg`

### 3. Espaçamentos
- Mínimo interno: `p-4`
- Cartões: `p-4 md:p-6`
- Layouts: `max-w-6xl mx-auto px-4`

### 4. Tipografia
- Títulos: `font-bold text-2xl md:text-3xl`
- Subtítulos: `font-semibold text-lg`
- Texto normal: `text-base text-slate-700`
- Texto suave: `text-sm text-slate-600`

### 5. Regras UX fundamentais
- Todos os botões utilizam:
  - `px-4 py-2 rounded-md font-semibold`
- Em mobile, elementos clicáveis ocupam largura confortável:
  - `w-full md:w-auto`
- Imagens sempre com `object-cover` e `rounded-lg`
- Cards sempre clicáveis com:
  - `hover:shadow-lg transition`

### 6. Consistência
Qualquer componente ou página que viole esse padrão deve ser corrigido através de patch oficial, registrado neste Códice.


---

## E.2 — ProductCard (Componente Oficial)

Caminho: app/components/ProductCard.tsx

Props:
- product: Product — tipo Product (ver bloco C);
- useSlug?: boolean — quando true usa product.slug como identificador na rota.

Comportamento:
- Card clicável que leva para /store/product/:id ou /store/product/:slug quando useSlug é true.
- Exibe imagem (thumb -> image_url -> placeholder).
- Mostra preço formatado via Intl.NumberFormat('pt-BR').
- Badge "Esgotado" quando stock <= 0.
- Limita badges de categoria a 3.
- Usa AddToCartButton para ação rápida de compra.
- Acessibilidade: aria-labelledby, alt nas imagens, title nos links.
- Estilo: conforme E.1 (Tailwind) — rounded-lg, shadow-sm, hover:shadow-lg, line-clamp-2 para descrição.

Regras:
- Sempre em TypeScript (.tsx).
- Não faz fetch — recebe product via props.
- Não manipula global state diretamente — usa AddToCartButton para operação de carrinho.
- Import paths: preferir alias "@/..." ou relativos consistentes com o projeto.

Exemplo de uso (colocar exatamente como abaixo em um .tsx):
  <ProductCard product={p} />
  <ProductCard product={p} useSlug />

Observações:
- Caso precise referenciar o componente fora de app/, use o alias "@/components/ProductCard" se o tsconfig/jsconfig estiver configurado.
- Se quer que o link use slug, garanta product.slug existir e ser único.

