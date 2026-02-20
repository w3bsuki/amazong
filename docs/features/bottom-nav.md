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
- **Active indicator**: Top pill (`before:` pseudo, `h-0.5 w-5→w-6` on active, `bg-nav-active`) above the active icon — animates width on state change
- **Active color**: Primary blue (`text-nav-active` → maps to `--primary`) for active icon + label
- **Sell button**: `MobileBottomNavCoreAction` — `size-13` floating FAB with `shadow-cta`, `ring-4 ring-background` visual gap. inactive: dark circle (`bg-foreground`); active: blue (`bg-primary`). Has `active:scale-90` tap feedback.
- **Dock surface**: Glass effect — `bg-background/90 backdrop-blur-xl` + `shadow-nav` (upward-facing shadow token from globals.css)
- Safe area padding via `pb-safe` utility for iOS notch/home indicator
- Fixed positioning with `z-50`, uses `pointer-events-none` on root (pointer events restored on dock)
- Height token: `--spacing-bottom-nav` (4rem / 64px), referenced in layout utilities

## Conventions
- Tokens: `text-nav-active`, `text-nav-inactive`, `text-nav-indicator` (pill), `border-border-subtle`, `bg-background`, `shadow-nav`, `shadow-cta`
- Labels: `text-2xs font-medium tracking-wider` (inactive), `text-2xs font-semibold tracking-wide` (active)
- Transitions: `duration-150` on item (scale + color), `duration-200` on indicator pill (width + color)
- Touch targets: grid cols ensure each tab is at least 44px wide; `active:scale-95` on default items, `active:scale-90` on sell FAB
- Icons: Lucide (`House`, `LayoutGrid`, `MessageCircle`, `Plus`), consistent 24px sizing (`--size-icon-tab-bar`)
- Unread badge on Chat from `MessageContext`, notification badge on Profile from `useNotificationCount`

## Dependencies
- `@radix-ui/react-slot` for `asChild` pattern
- `class-variance-authority` for variant styling
- `lucide-react` for all tab icons
- Message count from `components/providers/message-context`
- Auth state from `components/providers/auth-state-manager`
