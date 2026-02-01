# Audit — 2026-01-31 — full_refactor

## Scope
- Goal: Full codebase refactor audit across Next.js, Tailwind v4, shadcn/ui, Supabase.
- Bundle: Full
- Files/routes: app/**, components/**, lib/**, proxy.ts, supabase/migrations/**, .env*

## NEXTJS

### Scope
- Files:
  - app/**
  - lib/**
  - proxy.ts
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | Medium | app/[locale]/(main)/search/page.tsx:28, app/[locale]/(main)/search/page.tsx:89, app/[locale]/(main)/todays-deals/page.tsx:12, app/[locale]/(main)/todays-deals/page.tsx:40 | Routes export `generateStaticParams` but also call `cookies()`, which forces dynamic rendering and negates SSG for localized routes. | Remove `generateStaticParams` (and optionally add `export const dynamic = "force-dynamic"`), or move cookie-dependent filtering to the client to keep pages static. |

### Acceptance Checks
- [ ] `pnpm -s lint`
- [ ] `pnpm -s typecheck`

### Risks
- Removing SSG for these routes could increase server load; validate caching and SEO expectations for localized pages.

## TW4

### Scope
- Files:
  - app/**
  - components/**
  - app/globals.css
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | Medium | components/mobile/category-context-banner.tsx:60 | Opacity modifiers on `text-primary` for interactive text (`text-primary/80`, `active:text-primary/70`) violate the “no opacity hacks on base tokens” rail; also in `app/[locale]/(account)/account/_components/account-recent-activity.tsx:18`, `app/[locale]/(admin)/admin/docs/_components/docs-content.tsx:555`, `components/desktop/desktop-filter-modal.tsx:549`, `components/shared/search/mobile-search-overlay.tsx:258`, `components/shared/search/mobile-search-overlay.tsx:339`, `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx:485`, `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx:612`. | Replace with semantic link tokens: `text-link` and `hover:text-link-hover` (and `active:text-link-hover` if needed). |
| TW4-002 | Medium | app/[locale]/[username]/not-found.tsx:16 | Decorative low-emphasis text uses `text-primary/20` (opacity hack); also in `app/[locale]/(main)/categories/[slug]/not-found.tsx:11` and `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx:655` (`text-primary/60`). | Use semantic subdued text tokens like `text-text-subtle` or `text-muted-foreground` instead of opacity on primary. |
| TW4-003 | Medium | components/pricing/plan-card.tsx:115 | Subtle ring states use `ring-primary/20` (opacity on base token); also in `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx:404`, `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx:433`, `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx:449`, `components/shared/filters/price-slider.tsx:123`, `components/shared/filters/price-slider.tsx:140`, `components/shared/filters/color-swatches.tsx:113`. | Replace with semantic ring tokens: `ring-focus-ring` / `focus:ring-focus-ring` (and keep `ring-1`/`ring-2` as needed). |
| TW4-004 | Medium | app/[locale]/(sell)/_components/ui/select-drawer.tsx:133 | Interactive background states use `hover:bg-accent` and `active:bg-accent/80` (opacity hacks / base token); unread state uses `bg-accent/30` in `app/[locale]/(account)/account(settings)/notifications/notifications-content.tsx:341`. | Use semantic state tokens: `hover:bg-hover`, `active:bg-active`, and for selected/unread `bg-selected`. |
| TW4-005 | Medium | app/[locale]/(sell)/_components/fields/condition-field.tsx:113 | Muted/placeholder text uses opacity on semantic tokens (`text-primary/50`, `text-muted-foreground/30`); also in `app/[locale]/(sell)/_components/fields/shipping-field.tsx:345`. | Replace with `text-text-subtle` or `text-muted-foreground` (no opacity modifiers). |

### Acceptance Checks
- [ ] `pnpm -s styles:gate`

### Risks
- Replacing opacity hacks may shift visual emphasis; if the new semantic tokens are too strong/weak, you may need to tune existing tokens (not add new palette values).

## SHADCN

### Scope
- Files:
  - components/ui/**
  - components/shared/**
  - app/**
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SHADCN-001 | Medium | components/ui/chart.tsx:1 | `components/ui` re-exports a shared chart implementation, so the UI primitives boundary is acting as a façade for a composite component. | Remove the `components/ui/chart.tsx` re-export and import from `components/shared/charts/chart` directly (or move the chart file into `components/ui` if you want it treated as a primitive). |

### Acceptance Checks
- [ ] `pnpm -s typecheck`

### Risks
- Removing the re-export will require updating any existing `@/components/ui/chart` imports to the shared path.

## SUPABASE

### Scope
- Files:
  - lib/supabase/**
  - app/** (actions + route handlers)
  - supabase/migrations/**
  - .env*
- Lines: n/a (repo + MCP)
- MCP: get_project_url, list_tables, execute_sql (policies), get_advisors (security/perf)

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SUPABASE-001 | High | .env.local:11; .env.vercel.local:11 | Service role key is stored with a non-empty value in local env files; if these files are committed or shared, RLS is effectively bypassed. | Remove/blank the key in repo files, rotate the service role key, and ensure these files are gitignored; keep only `.env.local.example` with empty value. |
| SUPABASE-002 | Medium | app/auth/confirm/route.ts:67 | Route handler uses `createClient()` (cookies via `next/headers`) instead of `createRouteHandlerClient(request)`, which can break session cookie propagation in route handlers. | Switch to `createRouteHandlerClient(request)` and wrap all `NextResponse` returns with `applyCookies(...)`; update signature to `NextRequest` if needed. |
| SUPABASE-003 | Low | supabase/migrations/20260110153300_ensure_avatars_bucket_and_policies.sql:36 | RLS policies use `auth.uid()` directly; SSOT prefers `(SELECT auth.uid())` to evaluate once per query. | Add a new migration to re-create these policies using `(SELECT auth.uid())` (and cast only as needed). |

### Acceptance Checks
- [ ] Confirm `.env.local` and `.env.vercel.local` are gitignored and rotate the service role key.
- [ ] pnpm -s typecheck
- [ ] pnpm -s lint

### Risks
- Supabase security advisor reports leaked password protection is disabled; enabling it increases auth security.
- Supabase performance advisors report multiple unused indexes; verify before dropping to avoid regression.
- MCP shows RLS enabled with no policies on several `storage` tables; access will be denied unless using service role—verify no runtime relies on direct bucket table access.
