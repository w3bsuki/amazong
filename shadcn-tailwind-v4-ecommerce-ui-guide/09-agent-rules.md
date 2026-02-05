# 09 — Agent Rules (non-negotiable, anti-slop)

Copy/paste this into your coding agent instructions.

---

## You are building a marketplace UI (C2C/B2B), mobile-first, app-like.

### Visual goal
Native iOS / modern webapp feel:
- soft surfaces
- clear hierarchy
- conversion-oriented
- fast browse (search + categories)
- smooth overlays

### Structural goal
- shadcn primitives are the design system foundation
- domain components are layered on top
- tokens drive all colors/radius/shadows

---

## Non-negotiables

### 1) No raw Tailwind palette colors in app UI
BANNED:
- `bg-gray-50`, `text-slate-900`, `border-zinc-200`, etc in production UI.

ALLOWED:
- `bg-background`, `text-foreground`, `border-border`
- `bg-primary`, `text-primary-foreground`
- custom semantic tokens like `bg-warning`, `text-warning-foreground`

(Exceptions only in prototyping code or charts/docs.)

### 2) No hard-coded hex
BANNED:
- `bg-[#fafafa]`

Use tokens instead.

### 3) No giant className strings for complex components
If a component has multiple variants/states, use:
- `cva` for variants
- `cn()` for composition

### 4) Touch targets must be ≥ 44px
Icon buttons:
- `size-11` (or `h-11 w-11`) minimum.

### 5) Every interactive element has visible focus
Use `focus-visible:*` utilities. Never remove outlines without replacement.

### 6) Use shadcn primitives for common UI
Use:
- `Button`, `Input`, `Badge`, `Card`, `Sheet/Drawer`, `ScrollArea`, `Select`, `Tabs`, `Skeleton`, `Sonner`

Don’t reinvent these.

### 7) App shell structure is fixed
Homepage must include:
- Sticky header (search + actions)
- Promoted section first
- Product grid feed
- Bottom nav

---

## “Definition of done” for UI PRs

- [ ] No banned colors
- [ ] Uses tokens for surfaces/typography
- [ ] Press feedback exists
- [ ] Skeletons for loading
- [ ] Empty states designed
- [ ] Safe-area padding for bottom nav
- [ ] Keyboard/focus tested

---

## Code style rules

- One component per file.
- Keep domain components pure and testable.
- Avoid inline anonymous functions in huge lists if it causes perf issues.
- Prefer `next/image` (if Next.js) or lazy-loaded `<img loading="lazy">`.

---

## If something feels “flat and gray”

Before adding random colors:
1) Improve hierarchy:
   - spacing
   - typography weight
   - elevation (shadow-card)
2) Use semantic accent in 2–3 places only:
   - badges
   - active nav
   - primary CTA
