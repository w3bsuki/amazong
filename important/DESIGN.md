# Design System (Canonical)

This is the **single source of truth** for UI/UX and styling rules in this repo.

Stack: **Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui**.

Goal: a clean, dense marketplace UI that is consistent, fast, and easy to maintain (Treido-inspired for mobile).

Engineering boundaries and production rails: see `docs/ENGINEERING.md`.

---

## Non‑negotiables (repo rails)

- **No redesigns**. Improve hierarchy/consistency, keep layouts and behavior.
- **No gradients**.
- **Cards are flat**: border + subtle elevation at most (avoid heavy shadows).
- **Prefer dense spacing**: mobile `gap-2`, desktop `gap-3`.
- **Avoid arbitrary Tailwind values** (`h-[42px]`, `text-[13px]`) unless absolutely necessary.
- **Use semantic tokens** from Tailwind v4 theme (e.g. `bg-background`, `text-foreground`, `border-border`).
- **No hover/active scale gimmicks** (the repo intentionally discourages these).
- **All user-facing strings via `next-intl`**.

---

## Tokens (source of truth)

- Colors/spacing/typography tokens live in `app/globals.css` under `@theme`.
- Prefer semantic classes: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`.
- Tailwind v4 CSS var usage is allowed when it maps to a token (examples): `w-(--token)`, `max-h-(--token)`.

## Core principles (what makes it “Treido clean”)

1) **Hierarchy through contrast, not color**
- Default to neutral/gray scale (via semantic tokens). Use brand color sparingly.
- Active states should be clear with *shape + contrast*, not just tint.

2) **Consistency beats creativity**
- Chips, tabs, and filter pills should share the same sizing and states.
- Sticky surfaces should share the same “glass” recipe.

3) **Touch-first ergonomics**
- Use existing touch-size utilities (`h-touch-sm`, `size-touch`, `pb-safe`, etc.)
- Prefer large hit targets over tiny icons.

---

## Token usage (Tailwind v4)

### Always prefer semantic classes
Use:
- `bg-background`, `bg-card`, `bg-muted`
- `text-foreground`, `text-muted-foreground`
- `border-border`

Avoid hard-coding palette like:
- `bg-white`, `text-black`, `border-gray-200`

Rationale: semantic tokens keep light/dark themes correct and keep the design consistent.

---

## Surfaces

### “Glass” sticky surfaces (headers / strips / bottom bars)
Use *one consistent recipe*:
- `bg-background/90 backdrop-blur-md border-b border-border/50`
- For bottom nav: `bg-card/95 backdrop-blur-xl border-t border-border/60`

Notes:
- Keep opacity subtle (90–95%) and borders soft (`/50`–`/60`).
- Don’t stack multiple shadows; the blur + border is the primary separation.

---

## Pills / Chips (the key Treido pattern)

### The canonical chip style
- Height: `h-touch-sm`
- Shape: `rounded-full`
- Inactive: outlined + muted text
- Active: **inverted** (foreground background) for instant clarity

Recommended states:
- **Active**: `bg-foreground text-background border-foreground`
- **Inactive**: `bg-background text-muted-foreground border-border/60 hover:bg-muted/40 hover:text-foreground`

Rules:
- Don’t use brand color for “active” by default.
- Keep the same chip sizing everywhere (category pills, filter chips, “All filters”, etc.).

---

## Navigation

### Bottom nav
- Active state should be neutral and readable: `text-foreground` (not brand).
- Icons should be thin and consistent (`strokeWidth={1.5}` on lucide icons).
- Keep the bar “glassy” and safe-area aware.

### Horizontal strips
- Always `no-scrollbar` and keep spacing tight.
- Avoid “fancy” separators; use subtle borders or one divider element.

---

## Anti-patterns to avoid (common prompt pitfalls)

- **Hard-coded grays/whites** instead of semantic tokens.
- **Arbitrary sizes** for typography/offsets (`top-[105px]`, `text-[10px]`).
  - Prefer existing utilities + consistent sticky structure.
- **Scale animations** on hover/press.
  - Use subtle background/border transitions instead.
- **Over-shadowing**.
  - Use border separation + muted backgrounds.

---

## How to apply changes safely

- Change **one UI concept at a time** (e.g., “chips”, then “sticky surfaces”).
- Prefer editing existing components over creating new ones.
- Keep changes small (1–3 files) where possible.

Verification gates (minimum for non-trivial UI work):
- `pnpm -s exec tsc -p tsconfig.json --noEmit`
- `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

---

## Component boundaries (so styling stays sane)

- `components/ui/**`: primitives only (shadcn-style). No feature composites, no app hooks.
- `components/common/**`: shared composites used across routes.
- `components/layout/**`: shells (header/nav/sidebars).
- Route-owned UI must live under its route group: `app/[locale]/(group)/**/_components/**`.

---

## Quick “good defaults”

- Card: `rounded-md border border-border bg-card p-3`
- Section spacing: `space-y-2` (mobile) / `space-y-3` (desktop)
- Muted surface: `bg-muted/50 text-muted-foreground border-border`

---

## Deep references

- `styling/STYLE_GUIDE.md` (long-form patterns and examples)
- `cleanup/palette-scan-report.txt` and `cleanup/arbitrary-scan-report.txt` (drift hotspots)

## Copy/paste prompt for future UI work

Use this when asking an assistant/agent to implement UI changes:

> You are working in a Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui repo.
> Goals: slightly improve UI clarity and consistency (Treido-inspired), without redesigning layouts.
> Constraints: no gradients, flat cards, dense spacing, no hover/active scale effects, avoid arbitrary Tailwind values.
> Use semantic tokens (`bg-background`, `text-foreground`, `border-border`) and existing utilities (`h-touch-sm`, `pb-safe`, `no-scrollbar`).
> Standardize chips/pills: inactive outlined + muted text; active inverted (`bg-foreground text-background`).
> Standardize sticky surfaces: `bg-background/90 backdrop-blur-md border-b border-border/50`.
> Make changes surgically (1–3 files) and run typecheck + E2E smoke.

---

## Optional next refactor (when ready)

If chip styles are repeated across multiple components, consider adding a dedicated shadcn `Button` variant like `variant="chip"` (and maybe `chipActive`) so pills remain consistent without repeating long class strings.

---

## Screenshot-aligned patterns (Treido home feed)

These are **approved patterns** to get closer to the two screenshots (dense, clean, tactile) while remaining compatible with this repo:

- Use **semantic tokens** (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`).
- Keep cards **flat** (border separation); avoid heavy shadows.
- **No gradients**. (If a mock uses a gradient blob, drop it.)
- Avoid arbitrary Tailwind values; prefer existing sizes (`text-xs`, `text-sm`, `text-2xs`, `size-*`, `h-*`, `h-touch-*`).

### 1) Sticky header (logo + icon actions + horizontal tabs)

Key details from the screenshots:
- Sticky, slightly translucent surface with blur.
- Tight icon spacing with correct touch targets.
- Tabs are text-only, active state is underline + stronger text.

Recommended recipe:

```tsx
import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50 pt-safe">
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between pb-2">
          <h1 className="text-base font-semibold tracking-tight text-foreground">treido.</h1>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="tap-highlight-transparent text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <Search strokeWidth={1.5} />
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon-sm"
                className="tap-highlight-transparent text-muted-foreground hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell strokeWidth={1.5} />
              </Button>
              <span className="absolute right-1 top-1 size-1.5 rounded-full bg-red-500 ring-2 ring-background" />
            </div>
          </div>
        </div>

        <div className="-mx-4 px-4">
          <div className="flex items-end gap-6 overflow-x-auto no-scrollbar">
            <button
              type="button"
              className="relative pb-2 text-xs font-medium text-foreground tap-highlight-transparent"
            >
              Всички
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-foreground" />
            </button>

            <button
              type="button"
              className="pb-2 text-xs font-medium text-muted-foreground hover:text-foreground tap-highlight-transparent"
            >
              Електроника
            </button>

            <button
              type="button"
              className="pb-2 text-xs font-medium text-muted-foreground hover:text-foreground tap-highlight-transparent"
            >
              Дрехи
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
```

Notes:
- Icon buttons use shadcn `Button` sizing (consistent touch targets).
- Notification dot uses `bg-red-500` (allowed exception for dots/hearts).

### 2) Filter chips (outlined + compact)

Key details:
- Everything is compact and aligned.
- Chips are outlined by default; active state is inverted.

```tsx
import { Button } from "@/components/ui/button"
import { ChevronDown, SlidersHorizontal } from "lucide-react"

export function FilterChips() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      <Button
        variant="outline"
        size="sm"
        className="h-touch-sm rounded-full px-3 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
      >
        <SlidersHorizontal className="size-3.5" strokeWidth={1.5} />
        Филтри
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-touch-sm rounded-full px-3 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
      >
        Близо до мен
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-touch-sm rounded-full px-3 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
      >
        Цена
        <ChevronDown className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-touch-sm rounded-full border-foreground bg-foreground px-3 text-background hover:bg-foreground"
      >
        Най-нови
      </Button>
    </div>
  )
}
```

### 3) Product card (flat, dense, consistent)

Key details:
- Image is the hero, with a subtle border.
- Wishlist icon is a small floating button with blur.
- Text block is compact; title truncates.

```tsx
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function ProductCard() {
  return (
    <a href="#" className="block tap-highlight-transparent">
      <div className="relative overflow-hidden rounded-md border border-border bg-muted">
        <div className="relative aspect-square">
          <Image
            src="/placeholder.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="absolute right-2 top-2 bg-background/95 backdrop-blur border-border/60 text-muted-foreground hover:text-foreground"
          aria-label="Save"
        >
          <Heart strokeWidth={1.5} />
        </Button>
      </div>

      <div className="pt-2 space-y-0.5">
        <p className="text-sm font-semibold tracking-tight text-foreground">850 лв.</p>
        <h3 className="text-xs font-medium text-foreground line-clamp-1">PlayStation 5 Disc</h3>
        <p className="text-2xs text-muted-foreground line-clamp-1">София, Център • 2ч</p>
      </div>
    </a>
  )
}
```

Rules:
- Prefer `rounded-md` for cards/media containers (repo rails).
- Keep wishlist button `variant="outline"` + subtle blur; avoid heavy shadows.

### 4) Bottom navigation (glassy + safe-area, no heavy shadow)

Key details:
- Fixed, translucent bar with blur and a thin border.
- Active tab is neutral (`text-foreground`), not “brand color”.
- Center “sell” button is prominent but **not** glowy.

```tsx
import { Button } from "@/components/ui/button"
import { Home, MessageSquare, Plus, Search, User } from "lucide-react"

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/60 pb-safe">
      <div className="grid grid-cols-5 items-center h-14 px-2">
        <a className="flex flex-col items-center justify-center gap-0.5 tap-highlight-transparent text-foreground" href="#">
          <Home className="size-5" strokeWidth={1.5} />
          <span className="text-2xs font-medium">Начало</span>
        </a>

        <a className="flex flex-col items-center justify-center gap-0.5 tap-highlight-transparent text-muted-foreground hover:text-foreground" href="#">
          <Search className="size-5" strokeWidth={1.5} />
          <span className="text-2xs font-medium">Търси</span>
        </a>

        <div className="flex items-center justify-center -mt-4">
          <Button
            variant="ghost"
            size="icon-lg"
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 ring-2 ring-background shadow-sm"
            aria-label="Sell"
          >
            <Plus className="size-6" strokeWidth={2} />
          </Button>
        </div>

        <a className="flex flex-col items-center justify-center gap-0.5 tap-highlight-transparent text-muted-foreground hover:text-foreground" href="#">
          <MessageSquare className="size-5" strokeWidth={1.5} />
          <span className="text-2xs font-medium">Чат</span>
        </a>

        <a className="flex flex-col items-center justify-center gap-0.5 tap-highlight-transparent text-muted-foreground hover:text-foreground" href="#">
          <User className="size-5" strokeWidth={1.5} />
          <span className="text-2xs font-medium">Аз</span>
        </a>
      </div>
    </nav>
  )
}
```

---

## What to standardize first (highest ROI)

If you want the app to “snap” closer to the screenshots quickly, standardize in this order:

1) **Sticky surfaces** (header + bottom bar): one recipe everywhere.
2) **Tabs + chips**: one sizing + one active/inactive treatment.
3) **Product cards**: one media + text spacing + wishlist button treatment.

After that, we can make targeted changes in the actual home/category routes with minimal file edits.
