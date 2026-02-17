# Feature: Header Navigation

## What it does
Responsive app header with separate mobile and desktop implementations.
Mobile: hamburger menu, search bar, notifications, cart icon.
Desktop: full nav bar with search, categories dropdown, user menu, cart dropdown.

## Key files
- `app/[locale]/_components/app-header.tsx` — Server wrapper that picks mobile vs desktop
- `components/layout/header/mobile/` — Mobile header components
- `components/layout/header/desktop/` — Desktop header components
- `components/layout/header/cart/cart-dropdown.tsx` — Desktop cart dropdown
- `components/layout/sidebar/sidebar-menu.tsx` — Mobile hamburger sidebar menu
- `components/layout/sidebar/sidebar.tsx` — Sidebar container/sheet

## How it works
- `app-header.tsx` is a Server Component that renders both mobile and desktop headers
- Mobile header hidden on `md:` and up; desktop header hidden below `md:`
- Sidebar opens as a Sheet (shadcn) on mobile with navigation links
- Cart dropdown (desktop) shows mini cart with item count from CartContext
- Search triggers navigation to `/(main)/search` with query params

## Conventions
- Header height token: `--spacing-app-header` (used for page padding)
- Safe area: `pt-safe` on mobile header for iOS status bar
- z-index: header at `z-40`, bottom nav at `z-50`
- Logo links to `/` with locale prefix
- Auth-dependent: shows login CTA vs user menu based on `AuthStateManager`

## Dependencies
- `AuthStateManager` for user state
- `CartContext` for cart count badge
- `@/i18n/routing` for locale-aware navigation

## Last modified
- 2026-02-16: Documented during docs system creation
