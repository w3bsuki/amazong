---
name: treido-design
description: "UI/UX design expert for Treido marketplace. Styling components, layouts, responsive/mobile patterns, dark mode, accessibility, Tailwind v4 tokens, shadcn/ui. TRIGGERS: tailwind, style, css, className, shadcn, component, button, card, modal, dialog, sheet, drawer, form, input, responsive, mobile, desktop, animation, transition, hover, focus, active, disabled, loading, empty, error, dark mode, theme, color, typography, spacing, gap, padding, margin, accessibility, a11y, ARIA, screen reader, WCAG, contrast, touch target, 44px, skeleton, badge, icon, shadow, border, radius, native app feel, polish, premium, professional. NOT FOR: Next.js routing/caching (treido-frontend), data fetching/server actions (treido-backend), i18n/translations (treido-i18n), payments (treido-payments)."
---

# treido-design

Treido UI/UX expertise: Tailwind v4 CSS-first tokens, shadcn/ui composition, mobile-first responsive, touch-friendly interactions, WCAG accessibility, professional e-commerce polish.

## Core Principles

| ID | Principle |
|----|-----------|
| `core-tokens` | Tokens only — No palette classes, no gradients, no arbitrary values |
| `core-mobile` | Mobile-first — Touch targets ≥ 44px, tap feedback, no hover-only states |
| `core-hierarchy` | Intentional hierarchy — One primary action, clear visual weight |
| `core-appfeel` | Native app feel — Smooth, snappy, no layout shift, skeleton loaders |

## Quick Reference: Semantic Tokens

| ID | Token | Usage |
|----|-------|-------|
| `tok-bg` | `bg-background` | Page backgrounds |
| `tok-card` | `bg-card` | Card surfaces |
| `tok-muted` | `bg-muted` | Subtle sections |
| `tok-primary` | `bg-primary` | CTAs only (sparingly) |
| `tok-secondary` | `bg-secondary` | Secondary actions |
| `tok-destructive` | `bg-destructive` | Danger states |
| `tok-text` | `text-foreground` | Primary text |
| `tok-text-muted` | `text-muted-foreground` | Secondary text |
| `tok-border` | `border-border` | All borders |
| `tok-ring` | `ring-ring` | Focus rings |

**Dark mode:** Tokens auto-flip via `.dark` class. No manual `dark:` prefixes needed.

→ Full token map: [references/tokens.md](references/tokens.md)

## CRITICAL: Forbidden Patterns

| ID | ❌ Never | ✅ Fix |
|----|----------|--------|
| `tw4-no-palette` | `bg-gray-100`, `text-blue-500` | Use semantic tokens |
| `tw4-no-gradient` | `bg-gradient-to-r`, `from-*` | Gradients banned (project rule) |
| `tw4-no-arbitrary` | `w-[500px]`, `text-[13px]` | Use spacing scale |
| `tw4-no-opacity` | `bg-primary/10` | Use `bg-primary-subtle` |
| `tw4-no-hardcoded` | `bg-white`, `text-black` | `bg-background`, `text-foreground` |
| `tw4-touch-token` | `h-11`, `min-h-[44px]` | `h-(--spacing-touch-md)` |

## HIGH: Touch Targets

| ID | Use Case | Token | Class |
|----|----------|-------|-------|
| `touch-header` | Header icons | 44px | `size-(--spacing-touch-md)` |
| `touch-nav` | Bottom nav | 48px | `h-(--spacing-touch-lg)` |
| `touch-button` | Standard buttons | 44px | `h-(--spacing-button)` |
| `touch-compact` | Compact buttons | 36px | `h-(--spacing-button-sm)` |

→ Patterns: [references/mobile.md](references/mobile.md)

## HIGH: Component States

| ID | State | Treatment |
|----|-------|-----------|
| `state-default` | Default | Normal appearance |
| `state-hover` | Hover | Subtle feedback (`opacity-90`, `shadow-sm`) |
| `state-focus` | Focus | Visible ring (`ring-2 ring-ring`) |
| `state-active` | Active/Pressed | Slight scale (`scale-[0.98]`) |
| `state-disabled` | Disabled | `opacity-50`, `cursor-not-allowed` |
| `state-loading` | Loading | Spinner or skeleton |
| `state-empty` | Empty | Helpful guidance |
| `state-error` | Error | Clear problem indicator |

→ Examples: [references/components.md](references/components.md)

## MEDIUM: Visual Hierarchy

| ID | Layer | Max Emphasis |
|----|-------|--------------|
| `hier-primary` | Primary | 2 levers (size + color) |
| `hier-secondary` | Secondary | 1 lever (size or color) |
| `hier-tertiary` | Tertiary | 0 levers (text only) |

**Rule:** Never combine size + weight + color. Pick max 2.

## MEDIUM: Spacing Rhythm

Base unit: **4px**. Use Tailwind spacing scale:

| Relationship | Gap | Class |
|--------------|-----|-------|
| Tightly coupled | 4-8px | `gap-1`, `gap-2` |
| Related items | 12-16px | `gap-3`, `gap-4` |
| Section break | 24-32px | `gap-6`, `gap-8` |
| Major section | 48-64px | `gap-12`, `gap-16` |

## shadcn/ui Rules

| ID | Rule |
|----|------|
| `shd-ui-only` | All primitives in `components/ui/*` — import from there |
| `shd-no-modify` | Don't modify `components/ui/*` directly |
| `shd-compose` | Compose primitives in `components/shared/*` for app logic |
| `shd-mcp` | Use `mcp_shadcn_*` for component lookup and examples |

→ Patterns: [references/components.md](references/components.md)

## Review Checklist

- [ ] `tw4-no-palette` — No palette classes (`bg-gray-*`, `text-blue-*`)
- [ ] `tw4-no-gradient` — No gradients (`bg-gradient-*`, `from-*`, `to-*`)
- [ ] `tw4-no-arbitrary` — No arbitrary values (`w-[500px]`, `text-[13px]`)
- [ ] `touch-*` — Touch targets ≥ 44px (`--spacing-touch-md`)
- [ ] `state-*` — All states defined (hover, focus, disabled, loading, error)
- [ ] `a11y-contrast` — Text contrast ≥ 4.5:1 (WCAG AA)
- [ ] `a11y-focus` — Focus rings visible
- [ ] `resp-dark` — Dark mode works (toggle and verify)
- [ ] `resp-mobile` — Mobile-first responsive

## MCP Tools

| Tool | Purpose |
|------|---------|
| `mcp_shadcn_search_items_in_registries` | Search shadcn components |
| `mcp_shadcn_view_items_in_registries` | View component source/examples |
| `mcp_shadcn_get_item_examples_from_registries` | Get usage examples |
| `mcp_io_github_ups_resolve-library-id` | Context7: Get Tailwind/React library ID |
| `mcp_io_github_ups_get-library-docs` | Context7: Fetch library docs |

## References (Progressive Disclosure)

| File | Content |
|------|---------|
| [tokens.md](references/tokens.md) | Full semantic token map |
| [components.md](references/components.md) | shadcn/ui patterns |
| [mobile.md](references/mobile.md) | Touch/responsive rules |
| [responsive.md](references/responsive.md) | Breakpoints, containers |
| [accessibility.md](references/accessibility.md) | WCAG checklist |
| [animations.md](references/animations.md) | Transitions, Motion lib |

## SSOT Documents

| Topic | Location |
|-------|----------|
| Design system | `docs/04-DESIGN.md` |
| App feel guide | `docs/APP-FEEL-GUIDE.md` |
| Checklist | `docs/APP-FEEL-CHECKLIST.md` |
| Token SSOT | `app/globals.css` |
| Component rules | `components/AGENTS.md` |
