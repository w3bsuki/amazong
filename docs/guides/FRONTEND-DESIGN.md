# Frontend Design Skill — Treido

> Tailored design quality guide for AI agents working on Treido UI.
> Adapted from [Anthropic's frontend-design skill](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design), customized for a production marketplace on Tailwind v4 + shadcn/ui.

---

## Purpose

This skill guides creation of **distinctive, production-grade marketplace UI** that avoids generic "AI slop" aesthetics. Every component, page, and layout should feel intentionally designed — not template-generated.

Treido is a peer-to-peer marketplace (think Vinted meets OLX, Bulgarian + EU market). The UI must feel **modern, trustworthy, and alive** — not like a shadcn starter template with Inter font.

---

## Design Thinking (Before Coding)

Before writing UI code, answer these four questions:

1. **Purpose**: What does this surface solve? Who sees it, and what's their state of mind?
   - Browsing buyer? Anxious seller? Returning customer? Admin reviewing fraud?
2. **Tone**: What's the emotional register?
   - Treido's baseline: calm confidence with sharp moments of delight.
   - Specific surfaces can push toward: editorial (product detail), transactional urgency (checkout), celebratory (order confirmed), professional trust (seller dashboard).
3. **Constraints**: What's locked?
   - Always: Tailwind v4 semantic tokens, shadcn/ui primitives, Cyrillic support, mobile-first, WCAG AA.
   - Check `DESIGN.md` for token contracts and forbidden patterns before starting.
4. **Memorable detail**: What's the one thing that makes this surface feel *designed*?
   - A subtle entrance animation? A distinctive typographic moment? An unexpected but functional layout choice? A micro-interaction on hover/press?

**CRITICAL**: Intentionality over intensity. A single well-placed typographic detail beats scattered decorative noise. Execute the chosen direction with precision.

---

## Anti-Slop Rules

These patterns are **banned** because they signal low-effort AI-generated UI:

### Typography Slop
- Using Inter/Roboto/Arial as the display/heading font without deliberate reason
- All-same-weight text walls (everything in `font-normal`)
- No typographic hierarchy — headings look the same as body
- Missing letter-spacing adjustments on headings (`--letter-spacing-tight` exists, use it)

### Layout Slop
- Every section is a centered card on white background
- Symmetrical grids with identical spacing everywhere
- No visual rhythm — equal gaps between unrelated sections
- Ignoring the difference between scannable density (feed) and breathing room (detail pages)

### Color Slop
- Purple gradients on white (the universal AI cliche)
- Every surface using `bg-card` identically
- Missing state differentiation (hover/active/selected all look the same)
- Not using the category tone system for browsing cues

### Motion Slop
- Every element has the same fade-in
- Decorative animation on static content
- Missing press feedback on touch targets
- Ignoring `prefers-reduced-motion`

### Component Slop
- Cards with heavy shadows everywhere (Treido is border-based, shadows for overlays only)
- Generic placeholder content ("Lorem ipsum", "John Doe", "Product Name")
- Icon-only buttons without labels or aria-labels
- Buttons that all look the same regardless of hierarchy

---

## Typography Quality Bar

### Font Strategy

Treido's type system uses **three tiers**:

| Tier | Token | Current | Role |
|------|-------|---------|------|
| **Display** | `--font-display` | (needs upgrade) | Hero headings, landing pages, marketing moments |
| **UI/Body** | `--font-sans` | Inter (via next/font) | Body text, labels, form fields, product descriptions |
| **Serif accent** | `--font-serif` | Source Serif 4 | Editorial moments, trust badges, refined accents |
| **Mono** | `--font-mono` | JetBrains Mono | Code, tracking numbers, technical IDs |

**Font upgrade guidance**: When upgrading the display font, choose one that:
- Has **Cyrillic** support (Bulgarian locale is non-negotiable)
- Has **variable weight** axes for nuanced hierarchy
- Feels **geometric-modern but distinctive** — not another geometric grotesque that looks like Inter
- Good candidates: **Onest**, **Manrope**, **Commissioner**, **Wix Madefor Display**, **General Sans** (with Cyrillic subset), **Outfit** (if Cyrillic added), or **Golos Text**
- The display font should pair well with Inter at body size — contrasting geometric personality at large sizes, harmonious at small
- Always load via `next/font/google` with `display: "swap"`, `subsets: ["latin", "cyrillic"]`

### Typographic Rules

- **Headings**: Use `font-semibold` or `font-bold` with `--letter-spacing-tight`. Never leave headings at default weight/spacing.
- **Prices**: `text-price` token, `font-semibold` minimum. Price is the most important number on any product surface.
- **Labels/metadata**: `text-compact` or `text-xs` with `text-muted-foreground`. Quiet but readable.
- **Body text**: `text-body` with proper `leading` (line-height already in token). Don't compress line-height on readable content.
- **Weight contrast**: Create hierarchy through weight, not just size. A `text-body font-semibold` label above `text-body font-normal` value is clearer than making the label bigger.

---

## Color & Surface Quality

### Use the Token System With Intention

Don't just reach for the first semantic token that compiles. Think about surface hierarchy:

```
Page base:        bg-background
Grouped content:  bg-surface-subtle     (slight lift from page)
Cards:            bg-card               (distinct from surface)
Elevated:         bg-surface-elevated   (fixed bars, docks)
Overlays:         bg-popover            (sheets, dialogs)
```

### Category Tones

Treido has a full category tone system (`--category-tech-*`, `--category-fashion-*`, etc.). **Use it.** When a surface is category-contextual (browsing a category, category badges, category filters), pull the appropriate tone variables. This is a built-in differentiation tool — don't leave it unused.

### Interactive State Depth

Every interactive element needs these states (check existence before shipping):

| State | Token | What it does |
|-------|-------|-------------|
| Default | — | Base appearance |
| Hover | `bg-hover` / `hover-border` | Subtle surface shift |
| Active/Press | `bg-active` | Immediate feedback |
| Selected | `bg-selected` + `selected-border` | Persistent selection |
| Focus | `ring` via `focus-visible:ring-2` | Keyboard navigation |
| Disabled | opacity + `cursor-not-allowed` | Unavailable state |

---

## Motion & Micro-interaction Quality

### Principles

- **One hero moment per page load**: A well-orchestrated entrance (staggered reveals with `animation-delay`) creates more delight than everything fading in simultaneously.
- **Interaction feedback > decoration**: Press states, hover transitions, and loading skeletons matter more than ambient animation.
- **Use existing tokens**: `--ease-snappy`, `--ease-smooth`, `--duration-fast` (100ms), `--duration-normal` (200ms), `--duration-slow` (300ms).

### High-Impact Patterns

- **Staggered list entrance**: Product grid items animate in with incremental `animation-delay` (20-40ms per item, cap at 8-10 items).
- **Sheet/drawer spring**: Bottom sheets use `--ease-snappy` for native-feeling open/close.
- **Skeleton → content**: Loading states use subtle pulse animation, then cross-fade to real content.
- **Press scale**: Touch targets get `active:scale-[0.98]` with `--duration-fast` for tactile feel.
- **Scroll-triggered reveals**: Hero sections or feature highlights animate on scroll intersection.

### Motion Don'ts

- Never animate layout-triggering properties (`width`, `height`, `top`, `left`) — use `transform` and `opacity`.
- Never exceed `--duration-slow` (300ms) for UI transitions — longer feels sluggish on mobile.
- Always wrap in `@media (prefers-reduced-motion: no-preference)` or use Tailwind's `motion-safe:` prefix.

---

## Spatial Composition

### Break the Grid (Within Reason)

Not every layout needs to be a uniform grid. Consider:

- **Asymmetric hero layouts**: Product detail hero with image dominant (60/40 or 70/30)
- **Full-bleed sections**: Breaking out of the page inset for visual impact (promotional banners, category headers)
- **Density variation**: Feed is tightly packed for scanning; detail pages breathe with generous spacing
- **Rail breaks**: Horizontal product rails that extend edge-to-edge add scroll momentum cues

### Negative Space as a Feature

- Don't fill every pixel. Generous margin around important content (CTAs, product images, trust indicators) draws the eye.
- Section gaps (`--spacing-home-section-gap`) exist for rhythm — respect them, and vary intensity by content importance.

---

## Background & Texture Quality

### Beyond Flat Surfaces

While Treido is border-based (not shadow-heavy), surfaces can still have depth:

- **Subtle gradients**: `bg-gradient-to-b from-surface-subtle to-background` for natural depth on hero sections
- **Dot/grid patterns**: Ultra-subtle background patterns on empty states or onboarding surfaces (use `opacity-[0.03]` level)
- **Tinted surfaces**: Category-toned backgrounds for browsing contexts using category tokens

### What NOT to do

- No noise/grain textures (performance cost, looks dated)
- No gradient meshes (too heavy, too trendy)
- No blur/glassmorphism on mobile (performance)
- Shadows only on overlays/popover/dropdown, never on cards in feed

---

## Implementation Checklist

Before considering any UI work complete:

- [ ] **Typography hierarchy** exists (not all same size/weight)
- [ ] **Interactive states** are all present (hover, active, focus, selected, disabled)
- [ ] **Touch targets** meet 44px minimum (48px for primary CTAs)
- [ ] **Color tokens** — no palette utilities (`text-blue-500`), no hardcoded hex
- [ ] **Motion** — at least press feedback on touch targets; hero entrance if applicable
- [ ] **Mobile-first** — works on 390px width without horizontal overflow
- [ ] **Cyrillic** — text doesn't break with Bulgarian strings (longer words, different character widths)
- [ ] **Empty/loading states** — not just the happy path
- [ ] **Accessibility** — contrast, focus rings, aria labels on icon-only controls
- [ ] **Intentional** — can you explain *why* it looks this way? If not, redesign.

---

## DESIGN.md Contract

This skill operates **within** the constraints of `DESIGN.md`:

- All token usage rules (§4) are non-negotiable
- Layout contracts (§6) define structural requirements
- Accessibility (§9) is the floor, not the ceiling
- This skill adds **quality expectations** on top of those constraints

When this skill's guidance would improve `DESIGN.md` (better font tokens, richer motion vocabulary, stronger anti-pattern list), propose the update — don't silently deviate.

---

## Reference

- Project design system: `DESIGN.md` (root)
- Runtime tokens: `app/globals.css`
- Component primitives: `components/ui/*`
- Architecture: `docs/ARCHITECTURE.md`
- Original skill: [Anthropic frontend-design plugin](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design)

*Last updated: 2026-02-11*
