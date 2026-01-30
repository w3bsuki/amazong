# Frontend lane — UI bundle audit (2026-01-30)

Bundle: UI (Next.js + TW4 + shadcn + TS)

## NEXTJS

### Scope
- Files:
  - components/layout/desktop-shell.tsx
  - app/[locale]/(main)/search/page.tsx
  - app/[locale]/(main)/todays-deals/page.tsx
  - app/[locale]/(account)/layout.tsx
  - lib/data/categories.ts
  - lib/data/products.ts
  - lib/supabase/server.ts
  - lib/stripe-locale.ts
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | Medium | components/layout/desktop-shell.tsx:1 | `DesktopShell` is marked `"use client"` but only uses props and CSS; this forces a client boundary for server pages that render it. | Remove the `"use client"` directive and keep it as a Server Component; if any caller needs client behavior, split a thin client wrapper. |

### Acceptance Checks
- [ ] Rendering a server page that uses `DesktopShell` no longer pulls it into the client bundle (no `"use client"` in the component).

### Risks
- If any consumer relies on client-only APIs inside `DesktopShell` (currently none), removing `"use client"` would break at runtime; confirm no hooks/browser APIs are used.

## TW4

### Scope
- Files:
  - `app/**`
  - `components/**`
  - `app/globals.css`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | Low | n/a | No gradients, arbitrary values, or palette utilities detected in scope; `styles:gate` produced zero totals. | None |

### Acceptance Checks
- [ ] `pnpm -s styles:gate` passes
- [ ] No gradients/arbitrary values/palette colors in touched files

### Risks
- None observed.

## SHADCN

### Scope
- Files:
  - components/ui/**
  - components/shared/**
  - app/[locale]/**/_components/**
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|

### Acceptance Checks
- [ ] `components/ui/*` has no imports from `app/**`
- [ ] No domain/data fetching code inside `components/ui/*`

### Risks
- No boundary violations detected in `components/ui/*` based on import/data-fetch scans.

## TS

### Scope
- Files:
  - app/[locale]/[username]/[productSlug]/page.tsx
  - app/[locale]/(business)/dashboard/inventory/page.tsx
  - app/[locale]/(main)/categories/[slug]/page.tsx
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TS-001 | Medium | app/[locale]/[username]/[productSlug]/page.tsx:72 | `as any[]` used for empty data fallback | Replace with typed empty array using `ProductPageProduct[]` or a derived result type |
| TS-002 | Medium | app/[locale]/(business)/dashboard/inventory/page.tsx:88 | `(product as any).variant_count` unsafe cast | Extend product type to include `variant_count` and use `product.variant_count` |
| TS-003 | Medium | app/[locale]/(business)/dashboard/inventory/page.tsx:105 | `(product as any).variant_count` unsafe cast | Same as TS-002; ensure query projects `variant_count` and type reflects it |
| TS-004 | Medium | app/[locale]/(business)/dashboard/inventory/page.tsx:107 | `(product as any).variant_count` unsafe cast | Same as TS-002; avoid `as any` |
| TS-005 | Medium | app/[locale]/(main)/categories/[slug]/page.tsx:245 | `filterableAttributes: any[]` broad type | Replace with derived attribute element type from `getCategoryContext` or exported attribute type |

### Acceptance Checks
- [ ] `pnpm -s typecheck` passes
- [ ] No new `as any` / `@ts-ignore` in touched files

### Risks
- Typecheck not run in this audit.

## ORCH

### Scope
- Files:
  - app/global-error.tsx
  - app/global-not-found.tsx
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| ORCH-001 | High | app/global-error.tsx:17 | Logs the full `error` object from the client error boundary (`console.error("Global error:", error)`), which may include sensitive details in production logs. | Only log non-PII identifiers (e.g. `error.digest`) or remove client logging. |
| ORCH-002 | High | app/global-error.tsx:29 | Hardcoded user-facing strings in a global error UI (not `next-intl`). | Add next-intl-backed strings (client fallback provider) and move copy into `messages/en.json` + `messages/bg.json`. |
| ORCH-003 | Medium | app/global-error.tsx:48 | Homepage link is hardcoded to `/` (drops locale prefix). | Route to `/${locale}` (derived from path) for this global boundary. |
| ORCH-004 | High | app/global-not-found.tsx:34 | Hardcoded user-facing strings in a global 404 (not `next-intl`). | Use `getTranslations` with `routing.defaultLocale`, move copy into messages, and render locale-prefixed links via `@/i18n/routing` `Link`. |
| ORCH-005 | Medium | app/global-not-found.tsx:20 | `<html lang="en">` is hardcoded and anchors use `/` + `/contact` without locale prefix. | Set `<html lang={routing.defaultLocale}>` and use `Link` for locale-aware hrefs. |

### Acceptance Checks
- [ ] Global error + global not-found render with `next-intl` strings from `messages/en.json` + `messages/bg.json`
- [ ] No client logging of raw `Error` objects in `app/global-error.tsx`

### Risks
- `app/global-error.tsx` is outside the locale segment; may require a local `NextIntlClientProvider` using a locale derived from the URL path.

