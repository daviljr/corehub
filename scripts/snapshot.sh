#!/usr/bin/env bash
set -e
OUT="corehub_structure.txt"
echo "Gerando snapshot do CoreHub em: $OUT"
echo "# Snapshot gerado em: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > "$OUT"
echo "" >> "$OUT"
echo "=== ARVORE (find .) ===" >> "$OUT"
find . -maxdepth 3 -type d -print >> "$OUT" 2>/dev/null || true
echo "" >> "$OUT"
echo "=== LISTA DE ARQUIVOS IMPORTANTES ===" >> "$OUT"
for f in Códice.md Journal.md corehub_structure.txt package.json tsconfig.json next.config.mjs app lib components scripts data; do
  if [ -e "$f" ]; then
    echo "$f -> exists" >> "$OUT"
  else
    echo "$f -> MISSING" >> "$OUT"
  fi
done
echo "" >> "$OUT"
echo "=== .bak FILES ===" >> "$OUT"
find . -type f -name '*.bak' -print >> "$OUT" 2>/dev/null || true
echo "" >> "$OUT"
echo "Snapshot completo." >> "$OUT"
echo "Saída salva em $OUT"
