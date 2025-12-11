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
