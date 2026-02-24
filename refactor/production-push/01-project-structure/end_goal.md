# 01 — Project Structure: End Goal

---

## Target Root Layout

```
j:\amazong\
├── .env / .env.local / .env.local.example  ← environment
├── .editorconfig / .gitignore / .npmrc      ← tooling
├── .mcp.json                                ← MCP config
├── package.json / pnpm-lock.yaml            ← deps
├── next.config.ts / tsconfig.json           ← framework
├── proxy.ts                                 ← Next.js 16 middleware
├── eslint.config.mjs / postcss.config.mjs   ← lint/css
├── components.json / knip.json              ← shadcn + dead code
├── vitest.config.ts / vitest.*.config.ts    ← test configs
├── playwright.config.ts                     ← E2E config
├── next-env.d.ts                            ← auto-generated
│
├── AGENTS.md / claude.md / TASKS.md / README.md  ← project docs
│
├── app/              ← Composition: layouts, pages, route-private code
├── components/       ← Reusable UI (ui/, shared/, layout/, providers/)
├── lib/              ← Domain logic, queries, types, validation, utils
├── hooks/            ← Client React hooks
├── i18n/             ← Locale routing + request config
├── messages/         ← Translation JSON files
├── public/           ← Static assets
├── scripts/          ← Build, scan, audit scripts (+ Python scripts moved here)
├── supabase/         ← Migrations + database types
├── __tests__/        ← Unit tests
├── test/             ← Test utils, shims, fixtures
├── e2e/              ← Playwright E2E specs
├── docs/             ← Documentation
├── refactor/         ← Refactor planning (this folder)
└── codex/            ← Codex execution docs
```

### What's Gone
- `.codex_*.txt` → gitignored (generated audit outputs)
- `eslint-summary.txt`, `eslint.log` → gitignored
- `tsconfig.tsbuildinfo` → gitignored
- `route_inventory.py`, `supa.py`, `supabase_scan.py` → moved to `scripts/`
- `refactor-with-opus/` → archived or deleted (content migrated to `refactor/`)

---

## Architecture Rules

### Layer Ownership

| Layer | Owns | Must NOT |
|-------|------|----------|
| `app/` | Route composition, layouts, metadata, route-private `_components/_lib/_actions` | Contain shared/cross-route UI |
| `components/ui/` | shadcn primitives | Import app/, lib/data/, actions, hooks with state |
| `components/shared/` | Cross-route composites | Import route-private code |
| `components/layout/` | App shells (header, sidebar, bottom nav) | Import route-private code |
| `components/providers/` | Client state contexts | Make direct DB calls |
| `lib/` | Domain logic, queries, types, validation | Import components/, app/ |
| `hooks/` | Client React hooks | Contain domain/business logic |

### Route-Private Convention
- `_components/`, `_lib/`, `_actions/`, `_providers/` are PRIVATE to their route group
- Cross-route code MUST live in `components/shared/`, `components/layout/`, `lib/`, or `hooks/`
- ESLint enforces this boundary mechanically

### generateStaticParams
One shared helper in `lib/next/static-params.ts`:
```ts
export function localeStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export function emptyStaticParams() {
  return [];
}
```
All 14 files import from this single source.

### API Naming Convention
- Dynamic segments use the entity they represent: `[categoryId]`, `[productId]`, `[orderId]`
- `[slug]` means a human-readable slug
- `[id]` means a UUID

---

## Acceptance Criteria

- [ ] Root directory has 0 stale/generated files (all gitignored or relocated)
- [ ] No cross-route `_components` imports (architecture gate enforces)
- [ ] `generateStaticParams` uses shared helpers (no copy-paste)
- [ ] API route naming is consistent (no slug/id confusion)
- [ ] All doc references resolve to real files
- [ ] Python scripts moved to `scripts/` folder
- [ ] `refactor-with-opus/` archived or removed
