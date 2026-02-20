# DESIGN.md — UI + Frontend Contract

> Load when doing ANY UI work: styling, layout, components, pages, responsive behavior.
> This doc defines what Treido looks like, how it feels, and our UI patterns.
> For product context see `docs/PRD.md`. For tech stack see `docs/STACK.md`.

### External References

For framework knowledge, read the official docs — not this file:

- **shadcn/ui:** https://ui.shadcn.com — component API, variants, theming, `data-slot` convention
- **Tailwind CSS v4:** https://tailwindcss.com/docs — `@theme inline`, CSS-first config, utilities
- **Radix UI:** https://www.radix-ui.com/primitives — accessibility, primitives behavior
- **Vaul:** https://vaul.emilkowal.ski — drawer behavior, snap points
- **Framer Motion:** https://motion.dev — animation API

If a **context7 MCP** is available, use `resolve-library-id` + `get-library-docs` for any shadcn/Tailwind/Radix question.

### Design Direction (2026)

Treido's visual language draws from the same discipline as Stripe, Vercel, Linear, Reddit (mobile), and ChatGPT: **restrained surfaces, clear hierarchy, confident spacing, zero decorative noise.** Not trendy — timeless. Not minimal — intentional.

Key principles from the best modern products:
- **Soft chrome edges.** Bottom bars use `rounded-t-2xl` + `border-t` + subtle shadow — feels elevated and intentional, not flat/generic.
- **Semantic color only.** Interactive states (hover, active, selected) come from purpose-built tokens, not opacity hacks or palette utilities.
- **Active indicators over color-only states.** Navigation active states use a visible pill/capsule behind the icon — color change alone is too subtle on mobile.
- **Solid surfaces, not glass.** Background is opaque `bg-background`. No blur, no transparency on fixed navigation chrome.
- **Rows with borders.** List items, drawer options, and settings use `rounded-xl border border-border-subtle` — the Treido signature pattern (see Category Browse Drawer).
- **Dark CTAs on light, light CTAs on dark.** Primary actions in drawers/sheets use `bg-foreground text-background` — high contrast, no color dependency.
- **Touch-first proportions.** 44px minimum tap targets, 48px for primary actions. Labels are readable (`text-tiny` min), icons are 20-24px.

---

## 1. Brand & Visual Identity

### Personality

**Premium & Clean.** Treido feels like Stripe meets a modern marketplace — calm confidence, not visual noise. The app should communicate trust, simplicity, and professionalism.

| Attribute | What it means in UI |
|-----------|-------------------|
| **Trustworthy** | Consistent spacing, clear hierarchy, no visual tricks, secure-feeling checkout |
| **Simple** | Minimum viable UI. If 3 fields work, don't use 8. If 2 steps work, don't use 5 |
| **Modern** | Current design language. Soft shadows, generous radius, clean sans-serif, subtle motion |
| **Scannable** | Users find what they need in 2 seconds. Clear CTAs, breathing room, obvious hierarchy |
| **Touch-confident** | Every tap target feels intentional. Nothing cramped, nothing ambiguous |

### What Treido Is NOT

- Not playful/youthful (Vinted, Depop) — no bright colors, no bouncy animations
- Not dense/utilitarian (Amazon, eBay) — no information overload, no cramped grids
- Not cluttered (OLX, Bazar) — no ad noise, no visual chaos
- Not generic (template sites) — intentional details, not default everything

### Color Strategy

| Budget | Usage | Tokens |
|--------|-------|--------|
| 70% | Neutral surfaces | `background`, `surface-subtle`, `surface-page`, `card` |
| 20% | Contrast elements | `foreground`, `muted-foreground`, `border`, `border-subtle` |
| 10% | Accent & status | `primary`, `destructive`, category badges, promoted indicators |

The primary accent is Twitter Blue — used sparingly for primary actions, active states, and key CTAs. Everything else is neutral. Destructive red for errors, discounts, and warnings only.

### Icon Color Rule

| Role | Token | Examples |
|------|-------|----------|
| **Functional** | `text-foreground` | Search, close/X, navigation arrows, header actions, back buttons |
| **Decorative / secondary** | `text-muted-foreground` | Empty state illustrations, image placeholders, meta indicators (clock, info) |
| **Active nav** | `text-nav-active` | Bottom tab bar active icon |
| **Inactive nav** | `text-nav-inactive` | Bottom tab bar inactive icon |

Icons that the user taps or that indicate an actionable direction (arrows, close, search) must be `text-foreground` — near-black in light mode, near-white in dark mode. Reserve `text-muted-foreground` for icons that are purely decorative or accompany secondary meta text.

### Color System

OKLCH-based tokens defined in `app/globals.css`. Full light + dark theme.

- **Light theme:** White backgrounds, near-black text, subtle gray borders
- **Dark theme:** Full dark mode with matching semantic tokens (ships with system-preference auto-detect)
- Category-specific color families exist for 11 categories (tech, fashion, home, sports, etc.)

---

## 2. Tailwind v4 + shadcn/ui Theming Contract

### How Our Theme Works

Treido uses the **shadcn/ui v4 theming pattern**: CSS custom properties in `:root`/`.dark` bridged to Tailwind via `@theme inline`. This is the canonical 2026 approach — no `tailwind.config.ts` color overrides, no HSL, pure OKLCH.

```
:root { --primary: 0.62 0.20 255; }        ← Raw OKLCH components
@theme inline { --color-primary: oklch(var(--primary)); }  ← Tailwind bridge
<div className="bg-primary">               ← Semantic utility
```

**Three-layer architecture:**
1. **`:root` / `.dark`** — Source of truth. Raw OKLCH values for every token. Light and dark mode.
2. **`@theme inline`** — Bridge layer. Maps `--color-*` to `oklch(var(--token))` so Tailwind generates utilities.
3. **Component classes** — Consume only semantic utilities: `bg-background`, `text-foreground`, `border-border`.

### Rules

| Do | Don't |
|----|-------|
| `bg-primary text-primary-foreground` | `bg-blue-600 text-white` |
| `border-border-subtle` | `border-gray-100` |
| `bg-surface-subtle` | `bg-[#f5f5f5]` |
| `text-muted-foreground` | `text-black/50` or `text-foreground/50` |
| Add new token in `:root` + `@theme inline` | Use arbitrary values `bg-[oklch(...)]` |
| Use `data-[state=active]:` for stateful styles | Use JS-toggled classnames for colors |

### Adding a New Token

1. Add raw OKLCH value to `:root` and `.dark` in `app/globals.css`
2. Add the `--color-<name>: oklch(var(--name));` line to `@theme inline`
3. Use `bg-<name>`, `text-<name>`, `border-<name>` in components
4. If the token is component-scoped (e.g., nav-only), prefix it: `--nav-active`, `--nav-indicator`

### shadcn/ui Component Conventions

- **`data-slot`** attribute on every component root — used for styling hooks and testing
- **CVA (class-variance-authority)** for variant definitions — keeps variant logic co-located with styles
- **`Slot` pattern** (`asChild`) for composable components — Link inside Button, etc.
- **Semantic tokens only** in component variants — never palette classes
- **`components/ui/`** stays primitive: no data fetching, no domain logic, no i18n
- Components are editable open code — modify freely, but keep the variant/slot contract

### What Good Looks Like (Reference Patterns)

**Category Browse Drawer** — our gold standard for mobile UI:
- `DrawerShell` wrapper with centered title, close button, consistent header
- Rows: `rounded-xl border border-border-subtle bg-background` with hover/active states
- Primary CTA: `bg-foreground text-background` (dark on light, light on dark)
- Search: `rounded-full border-border-subtle bg-surface-subtle` pill input
- Segmented toggles, chips, icon circles — all using semantic tokens
- Loading: skeleton shapes matching real content exactly

**Mobile Bottom Nav** — our standard for fixed chrome:
- `rounded-t-2xl` top corners with `border-t border-border` — soft, elevated feel
- Subtle upward `shadow-nav` for depth separation from scroll content
- Active indicator pill behind icon for clear state feedback
- Icon + label layout with proper spacing
- Core action (sell) distinguished by `bg-foreground text-background` circle
- `pb-safe` for iOS safe area

---

## 3. Typography

### Font Stack

| Role | Font | Usage |
|------|------|-------|
| Sans (primary) | Inter | All UI text, headings, labels, buttons. Consider migrating to Geist for stronger identity. |
| Serif | Source Serif 4 | Rich text content, editorial surfaces (sparingly) |
| Mono | JetBrains Mono | Code, technical data, IDs |

### Type Scale

Custom scale optimized for mobile readability and information density:

| Token | Size | Usage |
|-------|------|-------|
| `text-2xs` | 10px | Timestamps, micro-labels |
| `text-tiny` | 11px | Meta info, dot-separated details, condition tags |
| `text-compact` | 13px | Card titles, secondary info, dense lists |
| `text-body` | 14px | Default body text |
| `text-reading` | 15px | Long-form content, descriptions |
| `text-price` | 16px | Price display |
| `heading-3` | 16px | Section subheadings |
| `heading-2` | 17px | Section headings |
| `heading-1` | 18px | Page headings |

### Typography Rules

- Every surface must have visible typographic hierarchy (heading → subhead → body → meta)
- Use `font-semibold` for emphasis, not `font-bold` (bold is too heavy for UI text)
- Card titles: `text-compact font-semibold`, 1-2 lines max with truncation
- Prices: `text-price font-semibold` — prices should pop visually
- Meta text (condition, location, timestamps): `text-tiny text-muted-foreground`
- iOS zoom prevention: all text inputs have `font-size: 16px !important` globally

---

## 4. Responsive Strategy

### Philosophy

**Mobile-first design, desktop excellence.** Mobile layouts are designed first (most traffic is mobile). Desktop gets its own patterns — not stretched mobile, but purpose-built for larger screens.

### Breakpoint System

| Breakpoint | Width | What changes |
|------------|-------|-------------|
| Default | 0-639px | Mobile layout: single column, bottom nav, drawers/sheets |
| `sm` | 640px | Minor width adjustments, drawer constraints |
| `md` | 768px | **Primary split.** Desktop header replaces mobile header. Bottom nav hidden. |
| `lg` | 1024px | Sidebar appears. Multi-column layouts activate. |
| `xl` | 1280px | Wider content areas, more horizontal space |
| `2xl` | 1536px | Max content width for ultra-wide screens |

### The Mobile/Desktop Split

The codebase uses a **hard split at `md` (768px)**. This is NOT responsive scaling — it's separate component trees:

```
Mobile (< 768px)               Desktop (≥ 768px)
─────────────────               ──────────────────
MobileHome                      DesktopHome
Mobile header variants          StandardHeader (single row)
Bottom tab bar                  no bottom nav
Drawers (bottom sheets)         Dialogs (modals)
Product quick view drawer       Product quick view dialog
```

Pattern: `<div className="md:hidden">` for mobile, `<div className="hidden md:block">` for desktop.

For overlay components, `useIsMobile()` hook selects Drawer vs Dialog.

### Mobile Layout

```
┌──────────────────────────┐
│  Fixed header (variant)  │  ← Route determines header variant
├──────────────────────────┤
│                          │
│  Scrollable content      │  ← pt-app-header, pb-tabbar-safe
│                          │
│  (full-width, edge to    │
│   edge with page inset)  │
│                          │
├──────────────────────────┤
│  Fixed bottom tab bar    │  ← 5 tabs: Home, Categories, Sell, Chat, Profile
└──────────────────────────┘
```

**Mobile header variants** (selected by route):
- `homepage` — hamburger + "treido." logo + search pill + wishlist + cart
- `product` — back + seller info + share
- `contextual` — back + title + optional actions (categories, assistant)
- `profile` — back + profile info + follow
- `minimal` — logo only (auth, checkout)

**Mobile tab bar** (5 tabs):
1. Home (House) — navigate to `/`
2. Categories (LayoutGrid) — open category drawer or navigate to `/categories`
3. Sell (Plus) — navigate to `/sell` — **core action** with `bg-foreground text-background` circle
4. Chat (MessageCircle) — open messages drawer, shows unread badge
5. Profile (avatar) — open account drawer (auth) or auth drawer (guest)

**Tab bar design (2026 standard):**
- `rounded-t-2xl` + `border-t border-border` — soft elevated feel, not flat/generic
- Subtle upward `shadow-nav` for depth separation from scroll content
- Active state: **indicator pill** (subtle `bg-accent` capsule behind icon) + `text-nav-active` color + `font-semibold` label
- Inactive: `text-nav-inactive` + `font-medium` label
- Core action (sell): distinguished by dark circle icon container, no label
- Icons: filled when active, outlined when inactive (24px)
- Labels: `text-tiny` (11px), always visible
- Height: `--spacing-bottom-nav` (4rem/64px) + `pb-safe` for iOS

### Desktop Layout

```
┌────────────────────────────────────────────────┐
│  Sticky header: Logo | Search | Actions | CTA  │
├──────────┬─────────────────────────────────────┤
│          │                                     │
│ Sidebar  │  Main content area                  │
│ (lg+)    │  (product grid, forms, dashboards)  │
│          │                                     │
│ Category │  Toolbar: count, sort, view toggle  │
│ tree or  │                                     │
│ filters  │  Grid/list of items                 │
│          │                                     │
└──────────┴─────────────────────────────────────┘
```

**Desktop header** (single row, `h-16`):
- Left: Logo ("treido.") + account dropdown
- Center: Search (flex-1, max-w-2xl)
- Right (auth): Messages + Wishlist + Cart dropdowns + "Create Listing" button
- Right (guest): Sign In + Register + Cart

**Key desktop patterns:**
- **Modal browsing:** Products open in full-width dialogs — user never loses scroll position or browse context. This is a core differentiator.
- **Sidebar navigation:** Category tree + filters in a sticky sidebar (visible at `lg+`). Tree navigation with counts.
- **Multi-panel dashboards:** Business dashboard shows multiple data panels simultaneously.
- **Dense but readable:** More info per viewport than mobile, but still clean with breathing room.

**Desktop shell** (`DesktopShell`): CSS Grid with sidebar column + content column. Sidebar sticky with `--sticky-top` and `--sidebar-max-h` vars. Container-constrained for max-width.

---

## 5. Component Patterns

### Product Cards

Two distinct card components:

**Mobile card** (`MobileProductCard`):
- Image (4:3 for feed, 1:1 for rails) with `rounded-t-xl`
- Overlay: promoted badge (top-left), wishlist heart (top-right)
- Content: category badge → seller row (avatar + name) → title (1-2 lines) → price + freshness
- Stretch-link pattern: invisible absolute Link covering entire card
- Displayed in 2-column grid (`grid-cols-2`, gap `10px`)

**Desktop card** (`DesktopProductCard`):
- Image 1:1 ratio
- More info density: title + category + price + original price + rating + sold count + freshness
- Meta row: condition, location, free shipping, verified seller (dot-separated)

**Card styling:** Subtle shadow, no hard border. `rounded-xl shadow-xs`. Cards should feel like they float slightly above the surface, not boxed in.

When changing cards: preserve the stretch-link pattern, keep touch targets generous, ensure images lazy-load with proper dimensions.

### Overlays: Drawers vs Dialogs vs Sheets

| Component | When | Visual |
|-----------|------|--------|
| **Drawer** (Vaul) | Mobile bottom overlays: product quick view, filters, category picker, account | Bottom: `rounded-t-2xl`, drag handle, max 90dvh. Side: full-width mobile, constrained tablet+ |
| **Dialog** (Radix) | Desktop overlays: product quick view, modals, confirmations | Centered, `rounded-2xl`, backdrop blur, shadow. Full-width variant for product: `max-w-6xl` |
| **Sheet** (Radix) | Persistent side panels, mobile filter hub, category sheets | Side variants with `rounded-l-2xl` / `rounded-r-2xl`, bottom with `rounded-t-2xl` |

**Global drawers** (mounted at root, managed by `useDrawer()` context):
- Product quick view (drawer on mobile, dialog on desktop)
- Cart, Messages, Wishlist, Account, Auth

**DrawerShell**: Standard wrapper with header, close button, title/description. Use for consistent drawer layout.

### Forms

- Use `Field` / `FieldLabel` / `FieldError` from `components/shared/field.tsx`
- shadcn/ui primitives for inputs (Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider)
- iOS zoom prevention applied globally for text inputs
- Zod validation at boundaries, react-hook-form for client forms

### Sell Flow

**Target format:** Drawer/sheet on mobile, modal on desktop. User stays on the current page — listing creation doesn't break browsing context.

Steps (minimal):
1. Upload photos
2. Title, description, category (hierarchical picker), condition
3. Price, location (pre-filled from profile), review + publish

Design goal: under 2 minutes for a basic listing. Keep the form simple — don't ask for data you can infer or default.

### Empty States

5 variants: `no-listings`, `no-search`, `no-category`, `no-favorites`, `no-orders`.
Structure: rounded icon in muted circle → title → description → CTA button.
Content is bilingual (EN/BG).

### Loading States

- **SSR streaming** for initial page loads — near-instant first paint, no visible loading
- **Skeleton screens** for async client content (infinite scroll pages, drawer content, data that loads after interaction)
- Skeletons must match the shape of the content they replace (card skeletons shaped like cards, not generic rectangles)
- No spinners — they feel dated. Skeleton + streaming is the standard.

### Page Shell

`PageShell` wraps page content. Two variants:
- `default` — `bg-surface-page` (white/dark canvas) for content-heavy pages
- `muted` — `bg-surface-subtle` (slightly tinted) for grid pages so cards pop against the background

---

## 6. Spacing & Layout Tokens

### Token Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--app-header-offset` | Dynamic (measured) | Header height for content offset |
| `--spacing-bottom-nav` | 3.25rem (52px) | Tab bar height for safe area padding |
| `--control-compact` | 36px | Dense controls (when space is tight) |
| `--control-default` | 44px | Standard interactive controls |
| `--control-primary` | 48px | Primary action buttons |
| `--page-inset-mobile` | 8px | Page edge padding on mobile |
| `--page-inset-tablet` | 12px | Page edge padding on tablet |
| `--page-inset-desktop` | 16px | Page edge padding on desktop |
| `--spacing-home-card-gap` | 10px | Product grid gap |
| `--sidebar-width` | 17.5rem (280px) | Desktop sidebar width |
| `--sidebar-width-collapsed` | 4rem | Collapsed sidebar width |
| `--product-card-min-w` | 12.5rem (200px) | Minimum product card width |

### Radius Scale

iOS-inspired corner radius. Base: `0.5rem` (8px).

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Small chips, badges |
| `--radius` | 8px | Buttons, inputs, general |
| `--radius-md` | 8px | Default component radius |
| `--radius-card` | `--radius-md` | Cards |
| `--radius-lg` | 12px | Larger containers, modals |
| `--radius-2xl` | 16px | Bottom sheets, large overlays |
| `--radius-4xl` | 20px | Special treatments |

### Spacing Rules

- Use Tailwind's spacing scale. Don't invent arbitrary values.
- Use token references for component-specific spacing (card gap, page inset, control size).
- Spacing should create rhythm — consistent gaps between same-type elements, larger gaps between sections.
- For layout density changes (compact vs spacious), use explicit design decisions, not accidental inconsistency.

---

## 7. Motion & Animation

### Philosophy

Between minimal and tasteful. Motion communicates feedback and structure — never decoration.

| Do | Don't |
|----|-------|
| Button press feedback (subtle scale) | Bouncing logos |
| Modal/drawer open/close transitions | Decorative parallax or scroll effects |
| Page transition (if fast and useful) | Auto-playing carousels |
| Loading skeleton pulse | Repeated fade-in animations on scroll |
| Hover state transitions | Spring physics on every element |

### Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 50ms | Immediate feedback (active state) |
| `--duration-fast` | 100ms | Quick transitions (hover, focus) |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-slow` | 300ms | Larger animations (modal open) |
| `--ease-snappy` | cubic-bezier | Responsive, quick deceleration |
| `--ease-smooth` | cubic-bezier | Gentle, natural movement |

### Motion Rules

- Entrances are slower than exits (modal opens at 200ms, closes at 150ms-ish)
- Honor `prefers-reduced-motion` for all non-essential animation
- Same motion pattern for same component type (all drawers animate the same way)
- Touch feedback is mandatory — every tappable element needs a visible press state

---

## 8. Token Contract

### Semantic Tokens Only

All styling uses semantic tokens. Never raw colors, palette classes, or arbitrary values.

```
CORRECT:  bg-background text-foreground border-border
WRONG:    bg-white text-black border-gray-200
WRONG:    bg-[#fff] text-[oklch(0.18 0.02 255)]
```

- New color needs → add `--color-<token-name>` in `app/globals.css`
- Token naming is API — clear names, stable meaning, no alias chains

### Forbidden Patterns

Enforced by scanner scripts in `scripts/`. These WILL fail `pnpm -s styles:gate`:

| Pattern | Examples | Scanner |
|---------|----------|---------|
| Palette utilities | `bg-gray-100`, `text-slate-900`, `fill-orange-400` | `scan-tailwind-palette.mjs` |
| Mono shortcuts | `bg-white`, `text-black`, `border-white/10` | `scan-tailwind-palette.mjs` |
| Gradients | `bg-gradient-to-*`, `from-*`, `via-*`, `to-*` | `scan-tailwind-palette.mjs` |
| Arbitrary values | `w-[560px]`, `text-[13px]`, `rounded-[10px]` | `scan-tailwind-arbitrary.mjs` |
| Raw hex/oklch in TSX | `#fff`, `#000`, `oklch(...)` | `scan-tailwind-arbitrary.mjs` |
| Token-alpha | `bg-primary/10`, `ring-ring/20` | `scan-tailwind-token-alpha.mjs` |

### Allowed Exceptions

- `app/globals.css` — raw `oklch(...)` token definitions (that's where tokens are SOURCE defined)
- `components/shared/filters/controls/color-swatches.tsx` — raw swatch color values
- Additional exceptions must be explicit, file-scoped, and documented

---

## 9. Component Organization

Components follow a strict layering (see `AGENTS.md` § Conventions for full rules):

```
components/ui/       → shadcn primitives (editable, no domain logic)
components/shared/   → composed UI (product cards, fields, filters, drawers)
components/layout/   → app shells (header, sidebar, footer)
app/**/_components/  → route-private UI (never import across route groups)
```

**Graduation path:** when a `_components/` component is needed by another route group → extract to `components/shared/`.

---

## 10. Page Quality — Current State

| Surface | Mobile | Desktop | Priority |
|---------|--------|---------|----------|
| Homepage / feed | Semi-polished | Good | Medium (refine) |
| Product quick view | Functional | Good (modal pattern) | Medium |
| Product page (PDP) | Needs cleanup | Decent | High |
| Search | **Broken** | Needs work | **Critical** |
| Categories | Minimal (pills only) | Has sidebar tree | High |
| Sell form | **Terrible** | Needs redesign | **Critical** — target: drawer/modal |
| Chat | Semi-decent | Needs work | Medium |
| Account/Profile | **Broken on mobile** | Incomplete | **Critical** |
| Checkout | Functional | Basic | Medium |
| Business dashboard | Scaffolded | In progress | Medium |

### Ship Criteria

Every page must meet ALL of these before it ships:

1. **Purpose is clear.** User knows what they can do on this page within 2 seconds.
2. **Hierarchy is visible.** Heading → subhead → body → meta. Not everything the same size.
3. **Interaction states exist.** Every interactive element has: default, hover, active/pressed, focus-visible, disabled (where applicable).
4. **Responsive works.** Test at 375px (iPhone SE), 768px (iPad), 1280px (laptop), 1920px (desktop).
5. **Touch targets are adequate.** Minimum 44px on mobile. Primary actions: 48px.
6. **No horizontal overflow** on mobile.
7. **Loading states defined.** Skeleton for async content, streaming for SSR.
8. **Error states defined.** What happens when data fails? Network error? Empty result?
9. **Empty states defined.** What shows when there's no content?

### Design Pre-flight

Before building or revising any surface, answer:
1. What user outcome is this surface responsible for?
2. What should the user feel? (one adjective: confident, focused, delighted, calm)
3. What one intentional detail makes this feel like Treido, not a template?

---

## 11. Anti-Slop Rules

These patterns make the app feel generic or broken. Catch and fix them:

| Slop | Example | Fix |
|------|---------|-----|
| Typography slop | Everything is 14px, no heading hierarchy | Use the type scale. Headings must be visibly different from body |
| Layout slop | Identical spacing everywhere, no rhythm | Vary spacing by content relationship. Tighter within groups, looser between sections |
| Color slop | Primary blue used on 10 different things | Primary is for primary actions ONLY. Status/category colors for everything else |
| Motion slop | Every element fades in on scroll | Remove decorative motion. Only feedback-driven transitions |
| Component slop | Heavy shadows, unlabeled icons, skeleton-only loading with no real state | Soft shadows. Label all icon buttons. Show meaningful empty/error states |
| Density slop | Cramped mobile layout or empty desktop layout | Mobile: breathe. Desktop: use the space with multi-column, not just wider margins |

---

## 12. Accessibility Baseline

Non-negotiable for every surface:

- Keyboard reachable: all primary flows work without a mouse
- Visible focus states: focus-visible ring on all interactive elements
- Labeled controls: icon-only buttons have `aria-label` or visible text
- Reduced motion: `prefers-reduced-motion` honored for non-essential animation
- Landmarks: semantic HTML (`main`, `nav`, `section`, `aside`)
- State feedback: loading/error/success perceivable without color alone
- Form labels: every input has a programmatic label + inline error messages
- ARIA states: `aria-pressed`, `aria-expanded`, `aria-selected` where applicable

---

## Key Files

- `app/globals.css` — all design tokens (OKLCH definitions, dark mode, custom utilities)
- `app/utilities.css` — safe-area utilities, layout helpers
- `app/shadcn-components.css` — shadcn component tokens
- `components/ui/` — shadcn primitives
- `components/shared/` — composed UI components
- Token enforcement: `pnpm -s styles:gate` (see `docs/STACK.md` § Build & Quality Gates)

---

*Last updated: 2026-02-20*
