# Frontend Audit (Next.js 16 / Tailwind v4)

## Snapshot
- Stack: Next.js 16 (App Router) + React 19, Tailwind v4, shadcn/ui, next-intl, lucide-react.
- Design system: tokens in app/globals.css with @theme variables; flat cards, no gradients, rounded-md max.
- Known drift: 13 gradients + 189 arbitrary Tailwind values per cleanup scans; typography/spacing/color audits (AGENT-1/2/3) not yet executed.
- Routing: locale-aware via @/i18n/routing; middleware handles i18n + geo + session; risk of legacy next/navigation usage on localized routes.
- Component boundaries: components/ui primitives only; composites in components/common; route-owned UI under app/[locale]/(group)/**/_components/**.

## Strengths
- Cache Components available for server-rendered views; remotePatterns configured for trusted image domains.
- Tokenized theme with semantic classes; dark mode baseline ~95% coverage reported in AGENT-0.
- Playwright + Vitest coverage exists; E2E smoke task ready for quick verification.

## Risks and Drift (What to Audit Deeply)
- Design drift: gradients and arbitrary values still present; risk of non-token colors/radii/shadows in high-traffic surfaces (home, search/PDP, cart, checkout, plans, sell flows).
- Typography/spacing inconsistency: baseline not enforced; likely mixed text sizes/line-heights and gaps; touch targets may be <24px in forms and filters.
- Color/theming: possible hardcoded palette values; dark mode parity after recent changes unverified.
- Component boundaries: check for data/hook usage in components/ui and cross-route imports from app/[locale]/(group)/** leaking.
- Client overuse: unnecessary "use client" wrappers and data fetching in client components inflate bundle and defeat caching.
- i18n correctness: links must use @/i18n/routing; ensure locale-agnostic hrefs; strings must live in messages/*; watch for date/time and unit formatting.
- Accessibility: focus rings, aria labels/roles, dialog/menu traps, skip links; ensure nav landmarks on headers/sidebars.
- Performance: large client bundles, heavy charts, unbounded image sizes; missing suspense/loading states for slow data.

## Audit Tracks
- Design System Alignment
  - Remove gradients; replace arbitrary values with tokens; enforce flat card pattern (border + rounded-md, shadow-sm max).
  - Run typography scale audit (body text-sm, prices text-base, meta text-xs, tiny badges text-2xs only); align line-heights.
  - Run spacing audit (mobile gap-2, desktop gap-3 defaults; padding consistent; touch targets >=24px, prefer h-10 primary/h-9 compact).
  - Color/theming audit: replace hardcoded palette with tokens; verify dark/light parity on priority pages.
- Component & Routing Boundaries
  - Verify components/ui import graph: no app hooks, no data fetching, no feature logic; move composites to components/common or route-owned components.
  - Check for cross-group imports from app/[locale]/(group)/**; refactor to lib or shared components when needed.
  - Enforce @/i18n/routing Link/useRouter on localized routes; remove next/navigation direct usage for locale paths.
- Client/Server Split
  - Migrate presentational components to server where possible; keep client only for interactivity (forms, menus, tooltips, charts requiring event handlers).
  - Move data fetching out of client components; feed via server props or server actions.
- UX, A11y, and Resilience
  - Add focus states using existing tokenized outlines; ensure aria labels on inputs, buttons, toggles, dialogs, menus.
  - Validate error/empty/loading states on auth, checkout, seller, cart flows.
  - Stabilize keys in lists; memoize heavy lists; ensure Suspense boundaries where data can be slow.
- Performance & Images
  - Use next/image for all product/media surfaces; clamp sizes; honor remotePatterns.
  - Bundle audit with ANALYZE=true pnpm build for pages pulling heavy deps; code-split rare views.

## Success Criteria
- Gradient count 0; arbitrary Tailwind values <20 and documented exceptions.
- Typography, spacing, color/theming audits executed with fixes on priority pages (home, search/PDP, cart, checkout, plans, sell, account, chat).
- All localized navigation uses @/i18n/routing; no hardcoded locale prefixes; strings fully covered in messages/en.json + bg.json.
- components/ui contain only primitives with no app hooks/data; composites live in components/common or route-owned folders.
- Client components limited to interactive needs; data fetching/server logic resides in server components/actions.
- A11y checks pass for focus, aria, keyboard nav on dialogs/menus; dark/light parity verified on priority pages.
- Smoke tests + tsc clean; no hydration warnings introduced.
