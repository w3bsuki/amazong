# Design System

> Load when doing UI work: styling, layout, components, pages, responsive behavior.
> For framework docs (shadcn/ui, Tailwind v4, Radix, Vaul): read official docs or use context7 MCP.

## Sections
- [Brand & Personality](#brand--personality) — voice, feel, anti-slop rules
- [Color & Tokens](#color--tokens) — OKLCH system, semantic variables, themes
- [Typography](#typography) — font scale, weight rules
- [Component Patterns](#component-patterns) — cards, overlays, forms, loading/empty states
- [Responsive](#responsive) — breakpoints, mobile/desktop split, layout tokens
- [Motion & Accessibility](#motion--accessibility) — transitions, reduced-motion, WCAG
- [Forbidden Patterns](#forbidden-patterns) — palette classes, hex, arbitrary values, gradients

---

## Brand & Personality

**Premium & Clean.** Treido feels like Stripe meets a modern marketplace — calm confidence, not visual noise.

| Attribute | In UI |
|-----------|-------|
| **Trustworthy** | Consistent spacing, clear hierarchy, no visual tricks |
| **Simple** | Minimum viable UI — if 3 fields work, don't use 8 |
| **Modern** | Soft shadows, generous radius, clean sans-serif, subtle motion |
| **Scannable** | Users find what they need in 2 seconds |
| **Touch-confident** | Every tap target feels intentional — nothing cramped |

**Design direction:** Restrained surfaces, clear hierarchy, confident spacing, zero decorative noise. Soft chrome edges (`rounded-t-2xl` + `border-t`). Solid surfaces (no blur/transparency on fixed chrome). Dark CTAs on light, light CTAs on dark.

**Anti-slop rules:** No flat typography (use the type scale). No uniform spacing (vary by relationship). Primary blue is for primary actions ONLY. No decorative motion. No heavy shadows or unlabeled icons. Mobile: breathe. Desktop: use the space.

---

## Color & Tokens

OKLCH-based semantic tokens in `app/globals.css`. Full light + dark theme (class-based `.dark`).

**Three-layer architecture:**
1. **`:root` / `.dark`** — raw OKLCH values for every token
2. **`@theme inline`** — bridges `--color-*` to `oklch(var(--token))` for Tailwind utilities
3. **Component classes** — consume semantic utilities: `bg-background`, `text-foreground`, `border-border`

**Color budget:** 70% neutral surfaces (`background`, `surface-subtle`, `card`) · 20% contrast (`foreground`, `muted-foreground`, `border`) · 10% accent + status (`primary`, `destructive`, category badges).

Primary accent is Twitter Blue — sparingly for primary actions, active states, key CTAs.

**Icon color rules:**
| Role | Token |
|------|-------|
| Functional (search, close, arrows) | `text-foreground` |
| Decorative / secondary | `text-muted-foreground` |
| Active nav | `text-nav-active` |
| Inactive nav | `text-nav-inactive` |

**Adding a new token:** Add raw OKLCH to `:root` + `.dark` → add `--color-<name>: oklch(var(--name))` to `@theme inline` → use `bg-<name>` in components.

---

## Typography

| Token | Size | Usage |
|-------|------|-------|
| `text-2xs` | 10px | Timestamps, micro-labels |
| `text-tiny` | 11px | Meta info, condition tags |
| `text-compact` | 13px | Card titles, dense lists |
| `text-body` | 14px | Default body text |
| `text-reading` | 15px | Long-form content |
| `text-price` | 16px | Price display |
| `heading-3` / `heading-2` / `heading-1` | 16-18px | Section/page headings |

**Fonts:** Inter (primary sans), Source Serif 4 (editorial, sparingly), JetBrains Mono (code/IDs).

**Rules:** Visible hierarchy on every surface. `font-semibold` for emphasis (not bold). Card titles: `text-compact font-semibold`, 1-2 lines with truncation. Prices: `text-price font-semibold`. Meta: `text-tiny text-muted-foreground`. iOS zoom prevention on all text inputs (16px min).

---

## Component Patterns

### Product Cards
**Mobile** (`MobileProductCard`): Image (4:3 feed / 1:1 rails) + overlay badges + category → seller → title → price. Stretch-link pattern. 2-column grid, 10px gap.
**Desktop** (`DesktopProductCard`): Image 1:1, more info density. Meta row: condition, location, shipping, verified.
**Card styling:** `rounded-xl shadow-xs`. Float above surface, no hard borders. Preserve stretch-link, generous touch targets, lazy-load images.

### Overlays: Drawers vs Dialogs vs Sheets
| Component | When | Visual |
|-----------|------|--------|
| **Drawer** (Vaul) | Mobile bottom overlays | `rounded-t-2xl`, drag handle, max 90dvh |
| **Dialog** (Radix) | Desktop overlays | Centered, `rounded-2xl`, backdrop blur |
| **Sheet** (Radix) | Side panels, filter hub | `rounded-l-2xl` / `rounded-r-2xl` |

Global drawers mounted at root via `useDrawer()`: product quick view, cart, messages, wishlist, account, auth.
`DrawerShell` provides consistent header/close/title wrapper.

### Forms
`Field` / `FieldLabel` / `FieldError` from `components/shared/field.tsx`. shadcn primitives for inputs. Zod at boundaries, react-hook-form for client forms.

### Empty States
5 variants: `no-listings`, `no-search`, `no-category`, `no-favorites`, `no-orders`. Structure: rounded icon → title → description → CTA button. Bilingual.

### Loading States
SSR streaming for initial loads. Skeleton screens for async client content — shaped to match real content. No spinners.

### Page Shell
`PageShell` wraps content: `default` (white/dark canvas) or `muted` (slightly tinted for grid pages).

---

## Responsive

**Philosophy:** Mobile-first design, desktop excellence. Separate component trees, not stretched mobile.

| Breakpoint | Width | What changes |
|------------|-------|-------------|
| Default | 0-639px | Mobile: single column, bottom nav, drawers |
| `md` | 768px | **Primary split.** Desktop header, no bottom nav, dialogs |
| `lg` | 1024px | Sidebar appears, multi-column layouts |
| `xl` / `2xl` | 1280+ | Wider content, max-width constraints |

**Mobile layout:** Fixed header (route-determined variant) → scrollable content → fixed bottom tab bar (5 tabs: Home, Categories, Sell, Chat, Profile).

**Tab bar design:** `rounded-t-2xl` + `border-t` + `shadow-nav`. Active: indicator pill + `text-nav-active` + `font-semibold`. Sell tab: dark circle icon. Icons: filled active / outlined inactive, 24px. Labels: `text-tiny`, always visible.

**Mobile header variants:** `homepage` (logo + search + actions), `contextual` (back + title + optional trailing actions), `product` (back + seller + share). `profile` + `minimal` are merged into `contextual`.

**Desktop layout:** Sticky header (logo + search + actions + CTA) → sidebar (lg+, category tree + filters) → main content. Modal browsing: products open in full-width dialogs, user never loses scroll position.

### Layout Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-bottom-nav` | 4rem (64px) | Tab bar height |
| `--page-inset-mobile/tablet/desktop` | 8/12/16px | Page edge padding |
| `--sidebar-width` | 17.5rem | Desktop sidebar |
| `--product-card-min-w` | 12.5rem | Min card width |
| `--control-compact/default/primary` | 36/44/48px | Interactive control sizes |

### Radius Scale
Base: 8px. `--radius-sm` 6px (badges) · `--radius` 8px (buttons/inputs) · `--radius-lg` 12px (containers/modals) · `--radius-2xl` 16px (bottom sheets).

---

## Motion & Accessibility

**Motion philosophy:** Between minimal and tasteful. Communicates feedback and structure — never decoration.

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 50ms | Active state feedback |
| `--duration-fast` | 100ms | Hover, focus transitions |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-slow` | 300ms | Modal open/close |

**Rules:** Entrances slower than exits. Honor `prefers-reduced-motion`. Same motion for same component type. Touch feedback mandatory on all tappable elements.

**Accessibility baseline:** Keyboard reachable. Visible `focus-visible` ring. Icon buttons need `aria-label`. Semantic HTML landmarks. Form labels + inline errors. ARIA states (`pressed`, `expanded`, `selected`). State feedback perceivable without color alone.

---

## Forbidden Patterns

Enforced by `pnpm -s styles:gate`. These fail the build:

| Pattern | Examples |
|---------|----------|
| Palette utilities | `bg-gray-100`, `text-slate-900`, `bg-white`, `text-black` |
| Gradients | `bg-gradient-to-*`, `from-*`, `via-*`, `to-*` |
| Arbitrary values | `w-[560px]`, `text-[13px]`, `rounded-[10px]` |
| Raw hex/oklch in TSX | `#fff`, `#000`, `oklch(...)` |
| Token-alpha | `bg-primary/10`, `ring-ring/20` |

**Allowed exceptions:** `app/globals.css` (token definitions), `components/shared/filters/controls/color-swatches.tsx` (swatch values).

**The rule:** All styling uses semantic tokens. `bg-background text-foreground border-border` — always.
New color → add token in `app/globals.css` `:root` + `.dark` + `@theme inline`. Never use arbitrary values.

---

## Key Files

- `app/globals.css` — all design tokens (OKLCH definitions, dark mode, custom utilities)
- `app/utilities.css` — safe-area utilities, layout helpers
- `app/shadcn-components.css` — shadcn component tokens
- `components/ui/` — shadcn primitives (editable open code, no domain logic)
- `components/shared/` — composed UI (product cards, fields, filters, drawers)
- `components/layout/` — app shells (header, sidebar, footer)

---

*Last verified: 2026-02-21*
