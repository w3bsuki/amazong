---
name: tailwind-audit
description: Tailwind v4 + shadcn token/theme audit. Triggers on "TAILWIND:" prefix.
---

# Tailwind Audit Skill

## On "TAILWIND:" Prompt

1. Run palette/gradient scan: `pnpm -s exec node scripts/scan-tailwind-palette.mjs`
2. Check `app/globals.css` for token definitions
3. Grep for arbitrary values: `\[\d+px\]`, `\[\d+rem\]`, `text-\[`
4. Cross-reference with Context7 Tailwind v4 docs
5. Output findings in Phase 1 Audit format

## MCP Commands

```
mcp_io_github_ups_resolve-library-id({ libraryName: "tailwindcss" })
mcp_io_github_ups_get-library-docs({ context7CompatibleLibraryID: "/tailwindlabs/tailwindcss", topic: "theme" })
mcp_shadcn_get_project_registries()
mcp_shadcn_list_items_in_registries({ registries: ["@shadcn"] })
```

## Anti-Patterns to Flag

- `bg-gradient-*`, `from-*`, `to-*` (no gradients rule)
- `h-[42px]`, `text-[13px]` (arbitrary values)
- Hardcoded colors not in theme
- Missing dark mode variants for custom colors

## Output Format

```markdown
## Tailwind Lane Phase 1 Audit — {date}

### Critical (blocks Phase 2)
- [ ] Issue → File → Fix

### High (do in Phase 2)
- [ ] Issue → File → Fix

### Deferred (Phase 3 or backlog)
- [ ] Issue → File → Fix
```

## Gates

After any fix:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Docs

| Topic | File |
|-------|------|
| Design tokens | `docs/DESIGN.md` |
| Styling guide | `docs/styling/README.md` |
| Globals CSS | `app/globals.css` |
