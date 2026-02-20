# Feature: Mobile Bottom Navigation

## What it does
Fixed bottom navigation bar on mobile with 5 tabs: Home, Categories, Sell (core CTA), Chat, Profile.
Hidden on `md:` breakpoint and above (desktop uses header navigation instead).

## Key files
- `components/ui/mobile-bottom-nav.tsx` — shadcn-style primitives (Root, Dock, List, Item, CoreAction, Label)
- `app/[locale]/_components/mobile-tab-bar.tsx` — composed tab bar with route logic, icons, badges
- `lib/navigation/mobile-tab-bar.ts` — route detection for active state and hide logic

## How it works
- Built as a compound component (shadcn pattern): `MobileBottomNavRoot` > `MobileBottomNavDock` > `MobileBottomNavList` > `MobileBottomNavItem`
- Uses `cva` (class-variance-authority) for state variants: `active` / `inactive`
- **Active icon style**: Filled/outline toggle — active icons use `fill="currentColor"`, inactive use outline (`strokeWidth={1.5}`)
- **Active color**: Primary blue (`text-nav-active` → maps to `--primary`) for active icon + label
- **Sell button**: `MobileBottomNavCoreAction` — inactive: dark circle (`bg-foreground`) with blue ring (`ring-primary`), white plus icon. Active: blue circle (`bg-primary`) with ring offset
- Safe area padding via `pb-safe` utility for iOS notch/home indicator
- Fixed positioning with `z-50`, uses `pointer-events-none` on root (pointer events restored on dock)
- Height token: `--spacing-bottom-nav` (3rem / 48px), referenced in layout utilities

## Conventions
- Tokens: `text-nav-active`, `text-nav-inactive`, `border-border-subtle`, `bg-background`
- Labels: `text-2xs font-medium` (inactive), `text-2xs font-semibold` (active)
- No animations/transitions — instant state changes
- Touch targets: grid cols ensure each tab is at least 44px wide
- Icons: Lucide (`House`, `LayoutGrid`, `MessageCircle`, `Plus`), consistent 24px sizing (`--size-icon-tab-bar`)
- Unread badge on Chat from `MessageContext`, notification badge on Profile from `useNotificationCount`

## Dependencies
- `@radix-ui/react-slot` for `asChild` pattern
- `class-variance-authority` for variant styling
- `lucide-react` for all tab icons
- Message count from `components/providers/message-context`
- Auth state from `components/providers/auth-state-manager`
