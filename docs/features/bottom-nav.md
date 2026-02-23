# Feature: Mobile Bottom Navigation

## What it does
Fixed bottom navigation bar on mobile with 5 tabs: Home, Categories, Sell (core CTA), Chat, Profile.
Hidden on `md:` breakpoint and above (desktop uses header navigation instead).

## Key files
- `components/mobile/chrome/mobile-bottom-nav.tsx` — shadcn-style primitives (Root, Dock, List, Item, CoreAction, Label)
- `app/[locale]/_components/mobile-tab-bar.tsx` — composed tab bar with route logic, icons, badges
- `lib/navigation/mobile-tab-bar.ts` — route detection for active state and hide logic

## How it works
- Built as a compound component (shadcn pattern): `MobileBottomNavRoot` > `MobileBottomNavDock` > `MobileBottomNavList` > `MobileBottomNavItem`
- Uses `cva` (class-variance-authority) for state variants: `active` / `inactive`
- **Active icon style**: Stroke-only — active icons use `strokeWidth={2}`, inactive use `strokeWidth={1.5}`. No fill toggling.
- **Active color**: Foreground (`text-nav-active` → maps to `--foreground`) for active icon + label. Inactive uses muted (`text-nav-inactive`).
- **Sell button**: `MobileBottomNavCoreAction` — `size-11` (44px) circle, `bg-foreground text-background`, `shadow-sm ring-3 ring-background`. Active: `bg-primary`. Lifted `-mt-2`.
- **Dock surface**: Opaque `bg-background` + `shadow-nav` (upward-facing shadow token). `rounded-t-2xl`, `border-t border-border-subtle`.
- Safe area padding via `pb-safe` utility for iOS notch/home indicator
- Fixed positioning with `z-50`, uses `pointer-events-none` on root (pointer events restored on dock)
- Height token: `--spacing-bottom-nav` (4rem / 64px), referenced in layout utilities

## Conventions
- Tokens: `text-nav-active` (foreground), `text-nav-inactive` (muted), `border-border-subtle`, `bg-background`, `shadow-nav`
- Labels: `text-2xs font-medium tracking-wider` (inactive), `text-2xs font-semibold tracking-wide` (active)
- Transitions: `duration-150` color transitions only — no scale transforms
- Touch targets: grid cols ensure each tab is at least 44px wide
- Icons: Lucide (`House`, `LayoutGrid`, `MessageCircle`, `Plus`), consistent 24px sizing (`--size-icon-tab-bar`), stroke-only
- Unread badge on Chat from `MessageContext`, notification badge on Profile from `useNotificationCount`

## Dependencies
- `@radix-ui/react-slot` for `asChild` pattern
- `class-variance-authority` for variant styling
- `lucide-react` for all tab icons
- Message count from `components/providers/message-context`
- Auth state from `components/providers/auth-state-manager`
