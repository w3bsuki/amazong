# Frontend Refactor + Audit Plan (Next.js UI, Tailwind v4, shadcn, i18n)

Owner: Frontend agent(s) (Playwright MCP + Context7 MCP)

Canonical execution queue: `docs/frontend_tasks.md` (tick items + add batch notes there).  
Global launch checklist: `tasks.md` (orchestrator-owned).

Goal: make Treido feel like a single, dense, trustworthy marketplace UI across mobile + desktop while reducing drift/over-engineering **without redesigns**.

## Non-negotiables

- No redesigns. Preserve layout intent.
- No gradients. No new animations/motion.
- No new architecture layers (stores/query libs/DI frameworks).
- Prefer semantic tokens over Tailwind palette colors; avoid arbitrary values.
- Every non-trivial batch must pass: `tsc` + `e2e:smoke` (see `docs/TESTING.md`).

## Sources of truth

- UI rules/tokens: `docs/DESIGN.md`, `styling/STYLE_GUIDE.md`
- Boundaries + Next.js rules: `docs/ENGINEERING.md`, `agents.md`
- Workflow + gates: `docs/workflow.md`, `tasks.md`

Drift scans (generate on demand):

- Palette/gradients: `pnpm -s exec node scripts/scan-tailwind-palette.mjs` -> `cleanup/palette-scan-report.txt`
- Arbitrary values: `pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs` -> `cleanup/arbitrary-scan-report.txt`

## Definition of Done (frontend)

- P0 flows feel consistent on mobile + desktop:
  - Home -> Search -> Product -> Add to cart -> Checkout
  - Auth (login/sign-up) behaves correctly
  - Sell flow is usable and consistent
- No obvious token drift on high-traffic surfaces (home/search/product/checkout).
- Customer-facing strings are translated (next-intl) with `/en` and `/bg` parity on touched screens.
- No new console noise on the happy path.
- Gates pass for each batch (`tsc` + `e2e:smoke`).

## What to audit (frontend tech stack)

### Tailwind v4 + shadcn conformance

- Remove palette usage in feature UI (use tokens like `bg-card`, `text-muted-foreground`, `border-border`).
- Replace gradients with flat token surfaces.
- Replace arbitrary sizes with tokens/utilities; if truly needed, promote to `app/globals.css` `@theme`.
- Keep cards flat: `rounded-md border bg-card p-3` (avoid heavy shadows and `rounded-xl`/`rounded-full` drift in surfaces).

### Next.js App Router hygiene (UI-facing)

- Localized routes must use `Link`/`useRouter` from `@/i18n/routing`.
- Avoid pushing non-localized paths (`/plans`, `/account/...`); always include locale.
- Don’t add new `"use client"` unless required; prefer server components for non-interactive UI.

### i18n correctness (next-intl)

- No hardcoded English/Bulgarian strings on customer screens.
- Prefer message keys and consistent key naming; keep `messages/en.json` and `messages/bg.json` in sync.
- Watch for “tight” typography around prices/VAT labels on mobile; fix spacing using tokens, not arbitrary pixels.

## How to use Playwright MCP (audit mode)

Run a two-viewport audit and capture screenshots/notes:

- Mobile: 390x844
- Desktop: 1440x900

For each issue, record:

- Surface (URL + viewport)
- What’s wrong (token drift / spacing / typography / touch targets / hierarchy)
- Candidate files (scan report first; then `rg`)
- “Done when” acceptance criteria

## Repeatable audit commands (fast)

- Palette/gradient scan: `pnpm -s exec node scripts/scan-tailwind-palette.mjs`
- Arbitrary scan: `pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs`
- Unused files/exports signals: `pnpm -s knip`

## Execution strategy (so you don’t stall)

- Work in meaningful slices (still small and safe): 1–3 surfaces or 3–10 files.
- Ship multiple batches per session (3–6 is the target).
- Always pick the next task from scan top-offenders or P0 flow breakpoints.

