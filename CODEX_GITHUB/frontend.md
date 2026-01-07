# Frontend Audit

## Current State
- Stack: Next.js 16 App Router + React 19, Tailwind v4, shadcn/ui, next-intl, lucide-react.
- Design system baseline exists; gradients (13) and arbitrary Tailwind values (189 across 97 files) remain per `cleanup/` scans.
- Typography (AGENT-1) and spacing/layout (AGENT-2) audits not yet executed; color/theming audit (AGENT-3) pending.
- Tokens live in `app/globals.css` (`@theme`); semantic classes available. Tailwind v4 var syntax should be the default.
- Component boundaries: `components/ui` primitives only, composites in `components/common`, shells in `components/layout`, route-owned UI under route groups.
- i18n: routing via `@/i18n/routing`; hrefs should be locale-agnostic; avoid `next/navigation` on localized routes.

## Risks and Drift
- **Design drift**: remaining gradients and arbitrary values create visual inconsistency; risk of violating “no gradients, flat cards” rule.
- **Typography/spacing inconsistency**: lack of completed audits means line-heights, weights, and gaps may vary across surfaces, especially product and checkout flows.
- **Color/theming**: potential hardcoded palette values not aligned with tokens; dark mode parity previously ~95% (needs verification after changes).
- **Component leakage**: risk of feature logic in `components/ui` or cross-route imports from `app/[locale]/(group)` path leakage.
- **Client overuse**: any unnecessary `"use client"` in composites inflates bundle and reduces Cache Component benefits.
- **Accessibility**: need a sweep for focus states, aria labels on form controls, and keyboard traps on dialogs/menus.
- **Performance**: over-fetching data into client components; media-heavy surfaces should rely on `next/image` with provided remotePatterns.

## Frontend Audit Plan
- **Design System alignment**
  - Remove remaining gradients; convert to token-based backgrounds/borders.
  - Replace arbitrary Tailwind values with tokenized equivalents; prefer semantic classes.
  - Run typography audit (sizes/weights/leading) against the baseline: body `text-sm`, prices `text-base`, meta `text-xs`, tiny badges `text-2xs` only.
  - Run spacing/layout audit: mobile gap-2, desktop gap-3 defaults; ensure touch targets ≥24px (prefer `h-10` primary, `h-9` compact).
  - Verify dark mode parity on high-traffic screens (home, search, PDP, cart, checkout).

- **Component boundaries**
  - Ensure `components/ui` remain pure primitives (no app hooks, no data fetching); move composites to `components/common` or route-owned `_components`.
  - Check for imports from route-owned folders across groups; fix by moving shared pieces to `components/common` or `lib`.
  - Keep providers thin in `components/providers`; push IO/realtime into `lib/**`.

- **i18n and routing**
  - Enforce `Link`/`useRouter` from `@/i18n/routing` on localized routes; audit links for locale-agnostic hrefs.
  - Verify middleware and layouts propagate locale correctly; ensure `metadata` uses locale-aware titles/descriptions.

- **Client/server split**
  - Prefer Server Components for display and data fetching; only mark `"use client"` for interactive pieces (forms, menus, tooltips).
  - Move data fetching out of client components; use server actions or loaders feeding props.
  - Audit hydration warnings and remove redundant state derived from props.

- **Accessibility & UX**
  - Ensure focus rings visible on all interactive elements; respect `prefers-reduced-motion`.
  - Validate aria labels/roles on inputs, dialogs, menus, and navigation landmarks.
  - Check form error messaging and empty states across auth, checkout, and seller flows.

- **Performance**
  - Favor `next/image` with existing `remotePatterns`; avoid unbounded image sizes.
  - Avoid unnecessary re-renders by memoizing heavy lists and stabilizing keys.
  - Audit bundle size with `ANALYZE=true pnpm build` when touching large dependencies.

## Acceptance for Frontend Cleanup
- Zero gradients and near-zero arbitrary Tailwind values (<20) remaining.
- Typography/spacing/color audits completed with documented fixes.
- No `components/ui` primitives importing app hooks or data.
- All localized routes use next-intl routing helpers.
- Key flows (home/search/PDP/cart/checkout/auth) verified for dark/light parity, focus accessibility, and stable layout.
