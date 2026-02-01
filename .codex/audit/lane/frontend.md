# Frontend Lane Audit — 2026-01-31

## Scope
- Directories: `app/**` (incl. `app/[locale]/**` and `app/api/**`), `components/**`, `i18n/**`, `lib/**` (frontend-adjacent).
- Focus: Next.js App Router boundaries + caching gotchas, i18n/next-intl routing usage, Tailwind v4 rail compliance (tokens/no arbitrary/no gradients), shadcn/ui boundaries, a11y basics, perf/UX risks.

## Assumptions
- Audit-only (no fixes applied), based on static inspection (`rg`, file reads) and repo SSOT rails (`.codex/AGENTS.md`, `.codex/project/ARCHITECTURE.md`, `.codex/project/DESIGN.md`).
- No runtime verification (no `pnpm dev`, no e2e navigation); findings prioritize high-confidence issues with `file:line` evidence.
- Some findings touch `app/api/**` (server routes) because they directly impact frontend caching/UX correctness.

## Findings
1) **Public CDN caching mixed with cookie mutation (cache contamination risk).**
   - `app/api/wishlist/[token]/route.ts:41` returns `cachedJsonResponse(..., "shared")` while wrapping the response with `applyCookies(...)` (cookie-setting wrapper). `cachedJsonResponse` sets `Cache-Control: public, s-maxage=...` by profile. (`app/api/wishlist/[token]/route.ts:18`, `app/api/wishlist/[token]/route.ts:41`, `lib/api/response-helpers.ts:33`, `lib/api/response-helpers.ts:37`)

2) **Revalidation endpoint can revalidate arbitrary tags (large blast radius if misused).**
   - Tags are taken directly from body `tag`/`tags` into an allow-all set. (`app/api/revalidate/route.ts:40`, `app/api/revalidate/route.ts:64`, `app/api/revalidate/route.ts:65`, `app/api/revalidate/route.ts:223`)

3) **Static-vs-request coupling: `generateStaticParams()` plus `cookies()` in pages.**
   - `app/[locale]/(main)/todays-deals/page.tsx` exports `generateStaticParams()` while reading request cookies. (`app/[locale]/(main)/todays-deals/page.tsx:12`, `app/[locale]/(main)/todays-deals/page.tsx:9`, `app/[locale]/(main)/todays-deals/page.tsx:40`)
   - `app/[locale]/(main)/search/page.tsx` exports `generateStaticParams()` while reading request cookies. (`app/[locale]/(main)/search/page.tsx:28`, `app/[locale]/(main)/search/page.tsx:19`, `app/[locale]/(main)/search/page.tsx:89`)

4) **Cache invalidation likely ineffective due to placeholder paths.**
   - `revalidatePath("/[locale]/...")` uses literal placeholder segments, which may not match real app paths. (`app/actions/boosts.ts:148`, `app/actions/boosts.ts:149`)

5) **Tailwind v4 rails drift: derived colors + opacity modifiers on tokens.**
   - Derived `oklch(...)` appears in shared shadcn CSS instead of token definitions. (`app/shadcn-components.css:243`)
   - Token opacity modifiers via `@apply` in shared CSS. (`app/shadcn-components.css:226`, `app/shadcn-components.css:230`)
   - Opacity modifiers in core primitive variants (wide blast radius). (`components/ui/button.tsx:16`, `components/ui/button.tsx:20`, `components/ui/button.tsx:22`)
   - Opacity modifiers + arbitrary selector variants in toast provider. (`components/providers/sonner.tsx:56`, `components/providers/sonner.tsx:58`)
   - Example drift in app components. (`app/[locale]/not-found.tsx:34`, `app/[locale]/(sell)/_components/fields/shipping-field.tsx:345`)

6) **Tailwind “no arbitrary values” drift: container-query/selector variants + arbitrary values present.**
   - Container query variants like `@[250px]/card:text-3xl`. (`app/[locale]/(account)/account/orders/_components/account-orders-stats.tsx:75`)
   - Arbitrary numeric stroke. (`components/shared/product/product-card-actions.tsx:124`)
   - Many additional bracket-selector patterns exist (example within `components/ui/command.tsx`). (`components/ui/command.tsx:60`)

7) **shadcn/ui boundary drift: composites living in `components/ui/*`.**
   - `components/ui/command.tsx` defines `CommandDialog` (dialog + command composition) used by a business feature. (`components/ui/command.tsx:32`, `app/[locale]/(business)/_components/business-command-palette.tsx:23`)
   - `components/ui/chart.tsx` imports `recharts` and implements a full chart system (context, tooltip content), closer to shared app UI than primitives. (`components/ui/chart.tsx:4`, `app/[locale]/(account)/account/sales/_components/sales-chart.tsx:9`)

8) **i18n routing drift: `next/link` used directly in shared components.**
   - Prefer locale-aware `Link` from `@/i18n/routing` per SSOT. (`components/shared/design-system/design-system-client.tsx:4`, `components/desktop/promoted-section.tsx:20`, `i18n/routing.ts:100`)

9) **App Router boundary smell: client component importing SSR-only icon entrypoint.**
   - `@phosphor-icons/react/dist/ssr` imported from a client component. (`app/[locale]/(account)/account/orders/_components/account-orders-toolbar.tsx:1`, `app/[locale]/(account)/account/orders/_components/account-orders-toolbar.tsx:8`)

10) **Client surface size is very large (perf risk + harder RSC boundaries).**
   - 292 files contain `"use client"` across `app/**` + `components/**`. (computed via `rg -l -F '"use client"' app components`)
   - Breakdown: `app/**` = 126, `components/**` = 166. (computed via `rg -l -F '"use client"' app` and `rg -l -F '"use client"' components`)

## Risks
- **Cache contamination / user-to-user bleed:** publicly cached responses that also set cookies can create inconsistent behavior across users and intermediaries.
- **Unexpected dynamic rendering / build-time surprises:** pages mixing `generateStaticParams()` with `cookies()` can produce confusing caching behavior and regressions.
- **Tailwind rail enforcement fragility:** if `pnpm -s styles:gate` is strict about opacity modifiers or arbitrary variants, current patterns can create frequent gate failures during iteration/upgrades.
- **Bundle growth:** large client surface plus composite “ui primitives” (charts/command palette) can push heavy deps into common chunks.
- **A11y drift:** reliance on complex interactive UI (dialogs/drawers/icon controls) without explicit a11y checks increases regression risk.

## Proposed Tasks
- [ ] FE-001: Remove cookie mutation from publicly cached wishlist token route (P0, effort M, owner T2, files:app/api/wishlist/[token]/route.ts lib/api/response-helpers.ts, notes: avoid `Set-Cookie` on `Cache-Control: public` responses)
- [ ] FE-002: Constrain `/api/revalidate` blast radius (P0, effort M, owner T2, files:app/api/revalidate/route.ts, notes: add allowlist/namespace + tighten auth/secret handling + reduce error log surface)
- [ ] FE-003: Eliminate token opacity modifiers + derived `oklch()` in shared styling (P0, effort L, owner T1, files:app/shadcn-components.css components/ui/button.tsx components/providers/sonner.tsx, notes: replace `/nn` usage with semantic state tokens per `.codex/project/DESIGN.md`)
- [ ] FE-004: Resolve `generateStaticParams()` + `cookies()` coupling in main pages (P1, effort M, owner T1, files:app/[locale]/(main)/todays-deals/page.tsx app/[locale]/(main)/search/page.tsx, notes: pick SSG-safe strategy or fully dynamic rendering intentionally)
- [ ] FE-005: Fix `revalidatePath` placeholder paths (P1, effort S, owner T2, files:app/actions/boosts.ts, notes: ensure invalidation targets real locale-prefixed routes)
- [ ] FE-006: Move `CommandDialog` composite out of `components/ui/*` (P1, effort M, owner T1, files:components/ui/command.tsx app/[locale]/(business)/_components/business-command-palette.tsx, notes: keep `components/ui/*` primitives-only per `.codex/project/ARCHITECTURE.md`)
- [ ] FE-007: Move chart system out of `components/ui/*` into `components/charts/*` (P1, effort M, owner T1, files:components/ui/chart.tsx app/[locale]/(account)/account/sales/_components/sales-chart.tsx app/[locale]/(account)/account/_components/account-chart.tsx, notes: keep heavy deps off primitive layer; consider re-export shim)
- [ ] FE-008: Replace direct `next/link` imports with locale-aware `@/i18n/routing` Link (P1, effort S, owner T1, files:components/shared/design-system/design-system-client.tsx components/desktop/promoted-section.tsx, notes: ensure locale-prefixed navigation everywhere)
- [ ] FE-009: Replace `useRouter` from `next/navigation` with `@/i18n/routing` in selling list (P2, effort S, owner T1, files:app/[locale]/(account)/account/selling/selling-products-list.tsx, notes: keep programmatic nav locale-correct)
- [ ] FE-010: Audit + reduce Tailwind arbitrary values/variants in hotspots (P2, effort L, owner T1, files:components/ui/command.tsx components/shared/product/product-card-actions.tsx app/[locale]/(account)/account/orders/_components/account-orders-stats.tsx, notes: align with “no arbitrary values” rail; prefer tokens/util classes)
