# 04 — App Shell (make the website feel like a native app)

Your screenshots show the correct direction: **sticky header**, quick category access, and **bottom navigation**. This is how you create an “app” feel on mobile web.

## Goals

- Always-visible search + core actions (wishlist/cart).
- Clear primary navigation (bottom bar).
- Scrollable feed that feels smooth.
- Proper iOS safe-area handling.

---

## Layout structure

On mobile, prefer a 3-part shell:

1) **Sticky header**
2) **Scrollable main content**
3) **Sticky bottom nav**

Pseudo-structure:

```tsx
<AppShell>
  <AppHeader />
  <main>{children}</main>
  <BottomNav />
</AppShell>
```

---

## Safe-area rules (iOS)

### Bottom nav
Pad for iOS home indicator:

- `pb-[env(safe-area-inset-bottom)]`
- also add a minimum padding so Android looks fine: `pb-3`

### Sticky header
If you ever go full-screen top bar, consider:

- `pt-[env(safe-area-inset-top)]`

---

## Recommended header design

### What belongs in the header
- hamburger / categories
- search input (big, tappable)
- wishlist button + badge
- cart button + badge

### What does NOT belong in the header
- filter controls
- sorting dropdowns
- anything that moves content vertically on scroll

Use header only for global actions.

---

## Snippet: AppHeader (mobile-first)

(Adapt to your router + icon library.)

```tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AppHeader() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "bg-background/80 supports-[backdrop-filter]:bg-background/60",
        "backdrop-blur-md",
        "border-b border-border/60"
      )}
    >
      <div className="mx-auto max-w-screen-sm px-4 pt-3 pb-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="size-11">
            {/* menu icon */}
          </Button>

          <div className="relative flex-1">
            <Input
              className="h-11 rounded-full bg-muted/60 pl-10"
              placeholder="Search…"
            />
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
              {/* search icon */}
            </div>
          </div>

          <Button variant="ghost" size="icon" className="size-11 relative">
            {/* heart icon */}
            <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-primary px-1 text-[11px] leading-5 text-primary-foreground">
              2
            </span>
          </Button>

          <Button variant="ghost" size="icon" className="size-11 relative">
            {/* cart icon */}
            <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-primary px-1 text-[11px] leading-5 text-primary-foreground">
              99
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
```

**Notes:**
- `bg-background/80` + `backdrop-blur` creates iOS-like “frosted” nav.
- `size-11` gives a 44px touch target.
- Badges use `bg-primary` to match brand.

---

## Bottom navigation pattern

### Design recommendations

- 5 items max on mobile.
- Center action can be emphasized (Sell / Post).
- Active state must be obvious:
  - filled icon + label color
  - subtle pill/indicator behind active tab

### Snippet: BottomNav wrapper

```tsx
export function BottomNav() {
  return (
    <nav
      className={cn(
        "sticky bottom-0 z-50 border-t border-border/60",
        "bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom)]"
      )}
    >
      <div className="mx-auto max-w-screen-sm px-2 py-2">
        {/* nav items */}
      </div>
    </nav>
  )
}
```

---

## Scroll + spacing rules

- Use `max-w-screen-sm` for a centered mobile column on desktop (until you build a desktop layout).
- Use `px-4` for page gutters.
- Use section spacing:
  - between sections: `mt-6`
  - within a section: `gap-3` or `gap-4`

---

## Desktop strategy (later)

Once mobile is good, scale up:

- convert bottom nav into a sidebar / top nav
- increase grid columns
- keep same tokens + components

Do NOT rebuild desktop with different components. Just change layout.
