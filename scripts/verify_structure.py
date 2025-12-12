#!/usr/bin/env python3
"""
verify_structure.py
- Scans project for JS/TS import/require statements
- Resolves relative imports to files and reports missing targets
- Lists files that are not referenced (possible orphans)
- Finds process.env references
- Lists zero-byte files
- Outputs a verify_report.txt in project root
"""

import os, re, sys
from pathlib import Path

ROOT = Path.cwd()
EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json']

# helpers
def read_text(p):
    try:
        return p.read_text(encoding='utf-8')
    except Exception:
        try:
            return p.read_text(encoding='latin-1')
        except:
            return ''

# find all source files to scan
src_files = [p for p in ROOT.rglob('*') if p.is_file() and p.suffix in EXTS and '/node_modules/' not in str(p)]
# normalize path strings
src_files = sorted(src_files, key=lambda p: str(p))

# regex for imports/requires/dynamic imports
IMPORT_RE = re.compile(r"""^\s*import\s+(?:[\s\S]+?)\s+from\s+['"](.+?)['"]|^\s*import\(['"](.+?)['"]\)|^\s*const\s+\w+\s*=\s*require\(['"](.+?)['"]\)""", re.MULTILINE)
# also match bare `export ... from 'x'`
EXPORT_FROM_RE = re.compile(r"""export\s+[\s\S]*?\s+from\s+['"](.+?)['"]""", re.MULTILINE)
# process.env
ENV_RE = re.compile(r'process\.env\.([A-Z0-9_]+)')
# dynamic import with template may be ignored

# map for imports: file -> list of (import_string, lineno)
imports_map = {}
# map from target string -> list of referring files
referenced = {}
# track process.env usages
env_usages = {}
# zero-size files
zero_files = []
# collect all filenames set
all_paths = set(str(p) for p in src_files)

def resolve_target(base_path: Path, target: str):
    """Resolve relative import target to an existing file path if possible.
       Returns resolved path string or None if not found or it's a package import."""
    if target.startswith('.') or target.startswith('/'):
        # relative or absolute - try variations
        cand = (base_path.parent / target)
        # if cand is file with ext
        for ext in EXTS:
            p = cand.with_suffix(ext) if not cand.suffix else cand
            if str(p) in all_paths:
                return str(p)
        # try index files if cand is dir
        if cand.is_dir():
            for ext in ['.ts','.tsx','.js','.jsx','.mjs','.cjs']:
                p = cand / ('index' + ext)
                if str(p) in all_paths:
                    return str(p)
        # try adding extensions
        for ext in EXTS:
            p = Path(str(cand) + ext)
            if str(p) in all_paths:
                return str(p)
        # no resolution
        return None
    else:
        # package import (not a local file)
        return '<<PACKAGE>>:' + target

# Scan files
for fp in src_files:
    text = read_text(fp)
    if len(text) == 0:
        zero_files.append(str(fp.relative_to(ROOT)))
    imports = []
    for m in IMPORT_RE.finditer(text):
        target = m.group(1) or m.group(2) or m.group(3)
        if target:
            imports.append((target, text[:m.start()].count('\n')+1))
    for m in EXPORT_FROM_RE.finditer(text):
        target = m.group(1)
        imports.append((target, text[:m.start()].count('\n')+1))
    # record process.env usages
    for me in ENV_RE.finditer(text):
        key = me.group(1)
        env_usages.setdefault(str(fp.relative_to(ROOT)), []).append(key)
    # update maps
    if imports:
        imports_map[str(fp.relative_to(ROOT))] = imports
        for target,ln in imports:
            referenced.setdefault(target, []).append(str(fp.relative_to(ROOT)) + f":{ln}")

# Resolve referenced relative targets to files
missing_targets = {}
resolved_refs = {}
for target, refs in referenced.items():
    # try to resolve for any referenced file: pick first referring file to resolve relative.
    resolved = False
    if target.startswith('.') or target.startswith('/'):
        for ref in refs:
            refpath,lin = ref.split(':',1)
            base = ROOT / refpath
            r = resolve_target(base, target)
            if r:
                resolved_refs.setdefault(r, []).extend(refs)
                resolved = True
                break
        if not resolved:
            missing_targets[target] = refs
    else:
        # package import, ignore
        resolved_refs.setdefault('<<PACKAGE>>', []).extend(refs)

# Find orphan files: files that are not referenced by others and not entry points (app/pages)
referenced_files = set()
for k,v in resolved_refs.items():
    if k == '<<PACKAGE>>': continue
    for p in v:
        # p looks like filepath:lineno or many
        pass
    # resolved_refs keys are the resolved file paths; convert
referenced_files.update([k for k in resolved_refs.keys() if k != '<<PACKAGE>>'])
# also any file that appears as a key in imports_map (it imports others) should be considered used
referenced_files.update(list(imports_map.keys()))
# treat app routes and api as used
for p in src_files:
    rp = str(p.relative_to(ROOT))
    if rp.startswith('app/') or rp.startswith('pages/') or rp.startswith('lib/') or rp.startswith('data/') or rp.startswith('public/'):
        referenced_files.add(rp)
# orphans = all source files - referenced_files
all_src_rel = set(str(p.relative_to(ROOT)) for p in src_files)
orphans = sorted(list(all_src_rel - referenced_files))

# Prepare report
out = []
out.append("VERIFY REPORT\nRoot: " + str(ROOT))
out.append("="*60 + "\n")
out.append("TOTAL SOURCE FILES: " + str(len(src_files)) + "\n")
out.append("ZERO-BYTE FILES:\n")
for z in zero_files:
    out.append("  - " + z)
out.append("\n\nIMPORTS FOUND (per file):\n")
for fp, imports in imports_map.items():
    out.append(f"{fp}:")
    for target,ln in imports:
        resolved = ""
        if target.startswith('.') or target.startswith('/'):
            # try resolve
            r = resolve_target(ROOT / fp, target)
            resolved = " -> " + (r if r else "MISSING")
        else:
            resolved = " -> (package) " + target
        out.append(f"    line {ln}: import '{target}'{resolved}")
out.append("\n\nMISSING IMPORT TARGETS (relative imports that could not be resolved):\n")
for t, refs in missing_targets.items():
    out.append(f"TARGET: {t}")
    for r in refs:
        out.append("   referenced from: " + r)
out.append("\n\nRESOLVED REFERENCES (local files referenced):\n")
for r, refs in resolved_refs.items():
    if r == '<<PACKAGE>>': continue
    out.append(f"{r} referenced from:")
    for ref in refs:
        out.append("   - " + ref)
out.append("\n\nPACKAGE IMPORTS (non-relative) referenced from files:\n")
for k,v in resolved_refs.items():
    if k == '<<PACKAGE>>':
        for ref in v:
            out.append("   - " + ref)
out.append("\n\nORPHAN FILES (not referenced/imported and not in app/pages/lib/data/public):\n")
for o in orphans:
    out.append("  - " + o)
out.append("\n\nprocess.env usages:\n")
for f, keys in env_usages.items():
    out.append(f" {f}: {', '.join(set(keys))}")
out.append("\n\nSUMMARY STATS:\n")
out.append("  source files: " + str(len(src_files)))
out.append("  imports-containing files: " + str(len(imports_map)))
out.append("  missing import targets: " + str(len(missing_targets)))
out.append("  orphan candidate files: " + str(len(orphans)))
out.append("  zero-byte files: " + str(len(zero_files)))

# write report
report = "\n".join(out)
with open(ROOT / "verify_report.txt", "w", encoding="utf-8") as fh:
    fh.write(report)

print("verify_report.txt generated at", ROOT / "verify_report.txt")
