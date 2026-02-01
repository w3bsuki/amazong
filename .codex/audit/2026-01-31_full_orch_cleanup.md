# Audit — 2026-01-31 — ORCH cleanup + design refresh

## Scope
- Goal: Full audit + cleanup (Tailwind v4 rails, shadcn boundaries, Next.js App Router/RSC/caching) and follow-up fixes.
- Bundle: Full (subset: TW4 + SHADCN + NEXTJS)
- Files/routes: `app/**`, `components/**`, `hooks/**`, `lib/**`, `proxy.ts`, `next.config.ts`

## TW4

### Scope
- Files:
  - `app/globals.css`
  - `app/utilities.css`
  - `app/shadcn-components.css`
  - `app/[locale]/**`
  - `components/**`
  - `hooks/**`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | High | `app/[locale]/(account)/account/sales/_components/sales-chart.tsx:19` | Chart colors use `hsl(var(--chart-*)))`, but `--chart-1..5` are defined as `oklch(...)` in `app/globals.css:94` (and dark at `app/globals.css:204`), so the resulting CSS color is likely invalid. | Use `var(--color-chart-1)` / `var(--color-chart-2)` directly (no `hsl(...)`). |
| TW4-002 | Medium | `app/utilities.css:109` | `color-mix(in oklch, ...)` is used outside `app/globals.css`, which drifts derived color decisions out of the token SSOT. | Replace with an existing surface token (`var(--color-surface-subtle)` or `var(--color-card)`). |
| TW4-003 | Medium | `app/[locale]/(admin)/_components/admin-stats-cards.tsx:50` | Status badges use opacity variants like `border-success/20 bg-success/10`, which violates the “no opacity variants” rail in `.codex/project/DESIGN.md`. | Use semantic surfaces instead: `bg-surface-subtle border-border` (keep `text-success`). |
| TW4-004 | Medium | `components/category/subcategory-tabs.tsx:77` | UI uses `bg-secondary/30` (and `border-border/60`) to manufacture a subtle surface, creating inconsistent opacity drift. | Replace with a semantic surface/background (`bg-surface-subtle`) and standard border token (`border-border`). |
| TW4-005 | Medium | `app/[locale]/[username]/profile-client.tsx:224` | Overlay uses `bg-background/40` even though an explicit overlay token exists (`--color-surface-overlay` in `app/globals.css:371`). | Replace with `bg-surface-overlay` (tokenized overlay surface). |
| TW4-006 | Low | `components/category/category-breadcrumb-trail.tsx:79` | Text uses `text-muted-foreground/50`, creating ad-hoc opacity drift vs the standard muted text token. | Use `text-muted-foreground` (no `/50`). |
| TW4-007 | Low | `app/shadcn-components.css:41` | Scrollbar styling uses base vars (`var(--muted-foreground)`) while most CSS uses `var(--color-*)`, increasing token-bridge inconsistency risk. | Standardize to `var(--color-muted-foreground)` (and similar `--color-*` vars). |

### Acceptance Checks
- [ ] `pnpm -s styles:gate`
- [ ] Verify charts render with intended colors (sales chart).
- [ ] Spot-check admin badges + overlays for consistent surfaces (no faded “tint” drift).

### Risks
- Replacing status “tinted” backgrounds with semantic surfaces may change visual emphasis; ensure desired hierarchy still reads.
- The repo scan reports in `cleanup/*-scan-report.txt` show `Totals: files=0`, so they may be unreliable as coverage signals on this environment.

## SHADCN

### Scope
- Files:
  - `components/ui/**`
  - `components/shared/**`
  - `components/layout/**`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SHADCN-001 | Medium | components/shared/modal.tsx:6, components/shared/modal.tsx:25 | `Modal` can render an unlabeled dialog when `title`/`description` are omitted and `ariaLabel` is also undefined (a11y). | Make `ModalProps` a TS union requiring either (`title`/`description`) or `ariaLabel`; add a dev-time runtime guard. |
| SHADCN-002 | Medium | components/layout/sidebar/sidebar.tsx:23, components/layout/sidebar/sidebar.tsx:106 | “Sidebar primitives” are coupled to app concerns (next-intl via `useTranslations`, cookie persistence via `document.cookie`), so they aren’t truly primitive/composable. | Push i18n strings + persistence to a wrapper (props/context); keep this layer purely structural/styling (or move to `components/shared/sidebar`). |
| SHADCN-003 | Low | components/ui/dialog.tsx:82, components/ui/drawer.tsx:111 | Overlays are implemented as hidden `<button>` elements (`aria-hidden`, `tabIndex={-1}`), which can trip a11y tooling and exposes “button-props” surface area for a non-semantic overlay. | Use a non-interactive element (`div` + `role="presentation"`) and close on pointer/click, or revert to Radix/Vaul overlay and isolate scroll-lock workarounds elsewhere. |
| SHADCN-004 | Low | components/ui/chart.stories.tsx:4 | Story is under `components/ui` but imports a shared chart (`@/components/shared/charts/chart`), blurring the `components/ui/*` primitive boundary and Storybook organization (`title: "Primitives/Chart"`). | Move the story next to the shared component (e.g. `components/shared/charts/chart.stories.tsx`) or into a Storybook-only folder; keep `components/ui` stories for primitives only. |
| SHADCN-005 | Low | components/ui/dialog.tsx:1, components/ui/drawer.tsx:1 | Mixed `'use client'` vs `"use client"` directive style inside `components/ui/**` makes greps/scripts less reliable and adds avoidable inconsistency. | Standardize directive quoting across `components/ui/**` (and align any scripts/linters with that convention). |

### Acceptance Checks
- [ ] `pnpm -s lint`
- [ ] `pnpm -s typecheck`
- [ ] `pnpm -s storybook:build`
- [ ] `pnpm -s test:a11y`

### Risks
- Tightening `ModalProps` may require small callsite refactors where modals relied on implicit labeling.
- Refactoring sidebar primitives to remove i18n/persistence coupling could be broad if many callers rely on current internal behavior.
- Changing overlay elements/behavior can subtly affect scroll lock, click-to-dismiss, and focus management across dialogs/drawers.

## NEXTJS

### Scope
- Files:
  - `app/**`
  - `lib/**`
  - `proxy.ts`
  - `next.config.ts`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | Critical | `proxy.ts:11; proxy.ts:77` | Middleware logic appears to live in `proxy.ts` (exports a default handler + `config.matcher`), but Next.js only executes middleware from a root `middleware.ts` entrypoint. As-is, locale routing, geo cookies, and `updateSession()` won’t run. | Add root `middleware.ts` that re-exports `default` + `config` from `proxy.ts`, or rename `proxy.ts` → `middleware.ts` (and update imports/docs accordingly). |
| NEXTJS-002 | Medium | `app/api/revalidate/route.ts:182; app/actions/orders.ts:166` | `revalidateTag(..., "max")` is used, but `next.config.ts` only defines `cacheLife` profiles for `categories`, `products`, `deals`, `user` (no `max`). This is likely a profile mismatch/inconsistency (and makes cache invalidation semantics unclear). | Standardize on configured profiles (`products`/`user`/etc) or add a `cacheLife.max` profile in `next.config.ts` and document when to use it. |
| NEXTJS-003 | Medium | `next.config.ts:43; lib/data/products.ts:360; app/[locale]/(main)/todays-deals/page.tsx:41` | A `cacheLife.deals` profile is configured but “deals” data fetches use `cacheLife('products')` (so deals don’t get the intended shorter cache profile). | In `getProducts(...)`, switch to `cacheLife('deals')` when `type === 'deals'` (or remove `cacheLife.deals` if not needed). |

### Acceptance Checks
- [ ] `pnpm -s typecheck`
- [ ] `pnpm -s lint`
- [ ] Verify middleware runs (locale routing + geo cookies + session refresh) after adding a root `middleware.ts` entrypoint.

### Risks
- Fixing middleware entrypoint can change routing/session behavior on every request; validate matcher coverage and auth flows (especially locale routing + redirects).

