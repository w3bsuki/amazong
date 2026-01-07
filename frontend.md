# Frontend Audit

## Scope
- app/[locale] route groups and layouts
- components/*, hooks/*, app/globals.css
- i18n routing in i18n/
- Design system docs and cleanup scans

## Stack and layout
- Next.js 16 App Router with locale prefixing (next-intl) and route groups: (main), (account), (auth), (sell), (checkout), (business), (admin), (chat), (plans)
- Root locale layout: app/[locale]/layout.tsx uses next-intl and global providers
- Main layout: app/[locale]/(main)/layout.tsx renders SiteHeader, SiteFooter, MobileTabBar, CookieConsent, GeoWelcomeModal

## Component boundaries and structure
- components/ui: shadcn primitives
- components/layout: header/footer/shells
- components/providers: auth, cart, wishlist, message, onboarding
- components/shared: composites and shared UI
- components/mobile and components/desktop: device-specific composites
- Note: repo rules reference components/common but the shared layer currently lives in components/shared; boundaries and docs are out of sync

## i18n and routing
- next-intl config in i18n/routing.ts and i18n/request.ts; setRequestLocale used in layouts
- Localized routes still import next/link and next/navigation hooks (examples: components/shared/empty-state-cta.tsx, app/[locale]/(account)/*, components/shared/search/*)
- Hardcoded strings and embedded EN/BG dictionaries exist in client components and root pages (components/shared/empty-state-cta.tsx, app/global-error.tsx, app/global-not-found.tsx)

## Client/server split
- 199 files marked "use client" across app/components/hooks/lib
- Client usage includes high-traffic layout and shared components (components/layout/header/site-header.tsx, components/shared/product/product-card.tsx, components/sections/tabbed-product-feed.tsx)
- app/[locale]/(main)/layout.tsx calls createClient() to get user, forcing the entire layout tree to be dynamic
- Consider splitting user-only header widgets into client islands to preserve cacheable layout and server components

## Styling system and drift
- Tailwind v4 with @theme tokens in app/globals.css; custom container and touch target utilities
- Design constraints: no gradients, flat cards, dense spacing, avoid arbitrary values
- cleanup/DESIGN-SYSTEM-STATUS.md reports 13 gradients and 189 arbitrary values across 97 files
- Known offenders: components/ui/toast.tsx (gradients), components/layout/sidebar/sidebar.tsx, components/pricing/plan-card.tsx, auth and checkout forms

## State and providers
- components/providers/cart-context.tsx mixes localStorage, RPCs, and mapping logic inside the provider
- components/providers/message-context.tsx owns realtime channels and heavy Supabase queries; uses select("*") and multiple follow-up queries for profiles/messages
- Providers are functional but heavy; long term target is to move IO and data shaping into lib/* or server actions

## Performance and assets
- next/image is used with remotePatterns in next.config.ts
- Several composites that could be server-rendered are still client-only (product cards, header, search filters)
- Mobile search overlay uses body locking and CSS to hide tab bar; confirm behavior across route groups

## Accessibility
- Global focus ring and reduced motion rules exist in app/globals.css
- Needs a focused sweep for aria labels, keyboard traps, and localized text on auth, checkout, and chat flows

## Testing surface
- Unit tests in __tests__ and hooks; Playwright E2E in e2e/ with desktop and mobile projects
- Gate for non-trivial changes: tsc + e2e smoke

## Frontend improvement targets
- Replace next/link and next/navigation on localized routes with @/i18n/routing helpers
- Convert embedded dictionaries and hardcoded strings to next-intl keys
- Reduce "use client" footprint by splitting client islands from server-rendered shells
- Remove gradients and arbitrary values flagged in cleanup scans; align to tokens and dense spacing defaults
- Thin client providers by moving IO and data shaping to lib/* or server actions
