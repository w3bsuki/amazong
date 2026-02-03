# Tailwind CSS v4 Audit + Refactor Playbook

Goal: keep the exact same look/feel while removing styling duplication and enforcing token rails everywhere.

## Hard rules (Treido)

- Use **semantic tokens only** (configured in `app/globals.css` / Tailwind v4 theme mapping).
- Forbidden patterns:
  - palette classes (e.g. `text-red-500`)
  - gradients
  - arbitrary values (e.g. `p-[13px]`)
  - opacity hacks like `bg-black/40` unless explicitly allowed by rails

## Audit checklist

### 1) Token rail compliance

- [ ] Identify any non-token utility usage and replace with tokens.
- [ ] Identify repeated class clusters; extract into variants (CVA) or shared components.

### 2) Theme + globals sanity

- [ ] Confirm a single source of truth for tokens in `app/globals.css`.
- [ ] Ensure dark mode behavior matches product expectations (no per-component hacks).

### 3) Duplication reduction

- [ ] Find repeated patterns (cards, panels, headers, pills, skeletons).
- [ ] Replace copies with a shared primitive/composite that uses variants.

## “Search patterns” (manual audit)

```powershell
# Common forbidden patterns
rg -n \"\\b(text|bg|border)-(red|blue|green|yellow|purple|pink|orange|slate|gray|zinc|neutral|stone)-[0-9]{2,3}\\b\"
rg -n \"\\b(from|via|to)-(red|blue|green|yellow|purple|pink|orange|slate|gray|zinc|neutral|stone)-[0-9]{2,3}\\b\"
rg -n \"\\[[^\\]]+\\]\" app components hooks lib

# Opacity slash syntax (review usage)
rg -n \"\\/(10|20|30|40|50|60|70|80|90)\\b\" app components
```

## Subagent prompt (copy/paste)

```text
Stack audit: Tailwind CSS v4

Tasks:
1) List token-rail rules (what is forbidden) and where tokens are defined in this repo.
2) Identify the highest-risk drift patterns (palette classes, gradients, arbitrary values).
3) Identify repeated class clusters we can dedupe via variants/components.
4) Provide a cleanup plan with minimal batches that preserve visuals.
5) Provide verification commands (styles gate + any UI sanity checks).
```

