# Shadcn + Tailwind CSS v4 Marketplace UI Rescue Kit

This package is a **hands-on guide** for rebuilding an e‑commerce / marketplace UI (C2C/B2B, like eBay) so it feels like a **native iOS app** on mobile web, while staying fast, accessible, and maintainable.

It is written to be fed to a coding agent (or used by a human team) to **stop “generic AI slop UI”** and ship a coherent, conversion‑focused design.

---

## What you’ll get

- **Tailwind v4 + shadcn/ui best practices** (CSS-first config, `@theme`, `@theme inline`, design tokens, `cva`, `cn`, registry workflow).
- A **theming + token strategy** that supports brand styling without breaking updates.
- An **app-like shell** pattern:
  - sticky top search
  - horizontally scrollable category chips
  - promoted carousel first
  - vertical product grid feed
  - mobile bottom navigation
- Component specs + ready-to-adapt **TSX snippets** for:
  - `AppShell`, `AppHeader`, `BottomNav`
  - `PromotedCarousel`
  - `ProductCard`
  - `CategoriesSheet` (like your screenshot)
- A **refactor plan** and checklists to migrate an ugly UI safely.

---

## How to use (recommended)

1. **Unzip** this package into your repo (or keep it separate and copy/paste).
2. Give your coding agent:
   - `README.md`
   - `09-agent-rules.md` (non-negotiables)
   - `08-refactor-plan.md` (step-by-step plan)
3. Implement in this order:
   1) theme/tokens → 2) app shell → 3) product card → 4) promoted carousel → 5) category sheet → 6) feed grid.

---

## Sources (official docs)

Use these as the source of truth while implementing:

- shadcn/ui (Tailwind v4): https://ui.shadcn.com/docs/tailwind-v4
- shadcn/ui Theming: https://ui.shadcn.com/docs/theming
- shadcn/ui CLI: https://ui.shadcn.com/docs/cli
- Tailwind v4 blog: https://tailwindcss.com/blog/tailwindcss-v4
- Tailwind theme variables: https://tailwindcss.com/docs/theme
- Tailwind directives: https://tailwindcss.com/docs/functions-and-directives
- Tailwind upgrade guide: https://tailwindcss.com/docs/upgrade-guide

---

## File map

- `01-foundation-shadcn.md` — how shadcn works, CLI workflow, structure.
- `02-tailwind-v4-playbook.md` — Tailwind v4 changes + CSS-first config.
- `03-theming-and-tokens.md` — token system + example theme for marketplace UI.
- `04-app-shell-mobile-first.md` — app-like layout (sticky header + bottom nav).
- `05-homepage-layout.md` — promoted section first + vertical grid feed.
- `06-components.md` — component specs + UX details for conversion.
- `07-motion-polish.md` — micro-interactions using `tw-animate-css`.
- `08-refactor-plan.md` — pragmatic migration plan.
- `09-agent-rules.md` — strict rules to avoid generic UI and class soup.
- `snippets/` — TSX + CSS snippets you can paste into your project.

---

## Scope note

This kit is **UI + theming + component architecture**. It does not assume any specific backend.  
Adapt the snippets to your router/framework (Next.js, React Router, Vite, etc).
