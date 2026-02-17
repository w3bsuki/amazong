# Feature: Mobile Bottom Navigation

## What it does
Fixed bottom navigation bar on mobile with 5 tabs: Home, Categories, Sell (core CTA), Cart, Account.
Hidden on `md:` breakpoint and above (desktop uses header navigation instead).

## Key files
- `components/ui/mobile-bottom-nav.tsx` — shadcn-style primitives (Root, Dock, List, Item, CoreAction)
- `components/mobile/chrome/mobile-control-recipes.ts` — mobile chrome composition helpers
- `app/[locale]/(main)/_components/` — where the bottom nav gets composed from primitives

## How it works
- Built as a compound component (shadcn pattern): `MobileBottomNavRoot` > `MobileBottomNavDock` > `MobileBottomNavList` > `MobileBottomNavItem`
- Uses `cva` (class-variance-authority) for state variants: `active` / `inactive`
- The center "Sell" tab uses `MobileBottomNavCoreAction` for emphasis styling (circular bordered icon)
- Safe area padding via `pb-safe` utility for iOS notch/home indicator
- Fixed positioning with `z-50`, uses `pointer-events-none` on root (pointer events restored on dock)
- Height token: `--spacing-bottom-nav` (3rem), referenced in layout utilities

## Conventions
- Tokens: `text-nav-active`, `text-nav-inactive`, `border-border-subtle`, `bg-background`
- Core action: `bg-primary text-primary-foreground` when active
- Touch targets: grid cols ensure each tab is at least 44px wide
- Icons: lucide-react or Phosphor icons, consistent 24px sizing
- Cart badge count comes from `CartContext` provider

## Dependencies
- `@radix-ui/react-slot` for `asChild` pattern
- `class-variance-authority` for variant styling
- Cart count from `components/providers/` cart context

## Last modified
- 2026-02-16: Documented during docs system creation
