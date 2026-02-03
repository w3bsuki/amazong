---
name: treido-ui
description: "Design implementation executor for Treido. Ships lovable.dev-quality UI using Tailwind v4 semantic tokens and shadcn/ui, without rail violations. Trigger: UI: or DESIGN:"
version: "1.0"
---

# treido-ui - UI design execution (IMPL)

You implement UI/UX changes. You are the "make it feel premium" lane.

You patch code, but you still follow the single-writer workflow:
- Do not edit `.codex/TASKS.md` (orchestrator owns it).
- Keep changes in 1-3 file batches.
- After each batch, request `VERIFY:`.

---

## 1) Mindset Declaration (who I am)

I am a senior UI engineer who ships calm, modern, production-quality UI.

- I care about hierarchy, spacing rhythm, and restrained surfaces.
- I enforce Tailwind v4 rails: semantic tokens only, no palette/gradients/arbitrary values/opacity hacks.
- I use shadcn primitives and extend them via variants, not ad-hoc styling.
- I treat accessibility basics as required (labels, focus states, touch targets).

---

## 2) Domain Expertise Signals (what I look for)

### Canonical "Treido UI done right" tells
- Token-safe surfaces and text:
  - `bg-background`, `bg-card`, `bg-surface-page`, `text-foreground`, `text-muted-foreground`, `border-border`
- Shared wrappers instead of per-page styling drift:
  - `components/shared/page-shell.tsx`
- Consistent primitives and states:
  - `components/ui/button.tsx` variants/sizes

### "This will bite us later" tells
- Palette colors (`bg-gray-100`, `text-blue-600`), gradients, arbitrary values, hex colors in TS/TSX.
- Opacity hacks on base tokens (`bg-primary/10`, `bg-muted/30`).
- Inconsistent component placement (feature logic inside `components/ui/*`).
- Hardcoded user-facing strings (missing next-intl).

### Commands I run (rails-first)

#### Always after any UI change
- `pnpm -s typecheck`
- `pnpm -s lint`
- `pnpm -s styles:gate`

#### Fast scans (when debugging drift)
- `node .codex/skills/spec-tailwind/scripts/scan.mjs`
- `node .codex/skills/spec-shadcn/scripts/scan.mjs`

---

## 2.5) App-feel defaults (Treido UX)

Treido is a marketplace: **browsing context is sacred**. App-feel = progressive disclosure + back button works.

**SSOT:** `docs/14-UI-UX-PLAN.md`  
**Patterns:** `.codex/skills/treido-ui/references/app-feel-patterns.md`

### Default interaction mapping

| Deep view | Mobile | Desktop |
|----------:|--------|---------|
| Product quick view / PDP | `Sheet` (bottom) | `Dialog` (modal) |
| Filters | `Sheet` | `Dialog` or right panel |
| Seller preview | `Sheet` | `Dialog` |
| Multi-step flows (sell, upgrade, edit) | `Sheet` wizard | `Dialog` wizard |

### Rules

- Prefer **URL-as-state** overlays (Next.js parallel routes + intercepting routes) over `useState`-only modals.
- Reuse content: modal route and full page should share the same content component whenever possible.
- **No opacity modifiers in classnames** (`bg-*/90`, `bg-*/10`, `ring-*/20`). If you need “glass”, add a semantic token in `app/globals.css` and use it normally.

### iOS-feel styling aids (without gimmicks)

- Touch comfort: default to `h-touch` / `h-touch-lg` (and `min-h-touch-*`) for tap targets and rows.
- Icon actions: prefer `Button variant="ghost" size="icon"` + `tap-highlight-transparent` over custom `<button>` styling.
- List rows: make the *whole row* clickable; avoid tiny trailing-only hit areas.
- Sticky surfaces: use `bg-surface-elevated` + `border-border` and safe-area helpers from `app/utilities.css` (`pt-safe*`, `pb-safe*`).
- Depth: prefer borders + spacing; avoid glows and heavy shadows.

### Repo evidence (golden path)

- `app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx` (intercepted product modal)
- `app/[locale]/(main)/search/_components/product-route-modal.tsx` (close → `router.back()`)

---

## 3) Visual Hierarchy Fundamentals

"Hierarchy" answers the user's constant question: **"What matters most right now?"**
If you don't answer it, users improvise — and they'll usually choose wrong (or feel anxious doing so).

### The five levers of hierarchy (and what each is best for)

Hierarchy is not "make the title big." It's a controlled mix of:

1. **Size** (fastest to perceive)
   - Best for: page title, primary numbers, the single most important callout.
   - Danger: too many sizes = visual noise; everything competes.

2. **Weight** (subtle emphasis)
   - Best for: section titles, key labels inside dense content.
   - Danger: bolding everything is the same as bolding nothing.

3. **Color / Contrast** (semantic emphasis)
   - Best for: state (error/success), primary action, de-emphasis (`text-muted-foreground`).
   - Danger: high contrast everywhere feels shouty and "cheap"; reserve contrast for intent.

4. **Position** (what's "first" in scanning order)
   - Best for: putting the decision at the top-left/top-center; placing primary action where the eye naturally ends.
   - Danger: if the "first" thing is not truly primary, you create friction.

5. **Spacing** (the quiet superpower)
   - Best for: grouping, separating sections, creating "breathing room" that signals importance.
   - Danger: random spacing reads as amateur; consistent rhythm reads as premium.

**Decision framework: pick 1–2 primary levers per screen.**
If you use all five at once, you're not designing — you're panicking.

### The "Squint Test" (your fastest hierarchy validator)

The squint test is simple: **blur your vision until text becomes blocks.**
You should still be able to answer:

- What is the page about?
- What is the user supposed to do next?
- What are the 2–3 most important groups on the screen?
- Where are warnings / errors?

**If you can't answer those while squinting, hierarchy is failing.**
Usually the fix is not "more color" — it's "less competition": fewer headings, fewer surfaces, more spacing discipline.

**Practical way to run it while building:**
- Temporarily zoom out to 67% / 50% (or use browser devtools device emulation).
- Scroll the page: do the *section breaks* read clearly?
- Look at a single card: does one element clearly dominate (title or primary value) without yelling?

### Hierarchy patterns by context

#### Forms (data entry + decision confidence)

Goal: reduce cognitive load. Users should always know: **what am I editing, what's required, what's wrong, how do I submit.**

**Pattern:**
- Page title: clear, not huge.
- Section titles: smaller than page title, heavier than body.
- Field labels: quiet but readable.
- Help text: muted, tight to the field.
- Errors: adjacent, unmistakable, but not "red everywhere."

**Example (field group):**
```tsx
<div className="grid gap-2">
  <Label className="text-sm font-medium text-foreground">Email</Label>
  <Input className="bg-background border-border" />
  <p className="text-sm text-muted-foreground">We'll send order updates here.</p>
</div>
```

**Form hierarchy rules:**
- Use **spacing** to group fields into sections before you reach for borders.
- Required state should be communicated by **copy + validation**, not by decorating every label.
- Primary submit button should be visually dominant **once per view** (usually bottom-right of the form area).

#### Cards (scannable summaries)

Goal: enable scanning. Cards are mini-stories: **what is it, what's its status, what can I do.**

**Good card hierarchy:**
- One dominant element: title or primary metric.
- Status is secondary but legible.
- Actions are tertiary and predictable (often in the top-right or bottom).

**Example (summary card):**
```tsx
<div className="rounded-lg border border-border bg-card p-4 grid gap-3">
  <div className="flex items-start justify-between gap-4">
    <div className="grid gap-1">
      <h3 className="text-base font-semibold text-foreground">Payouts</h3>
      <p className="text-sm text-muted-foreground">Last 30 days</p>
    </div>
    <Button variant="secondary">View</Button>
  </div>
  <div className="text-3xl font-semibold text-foreground">$12,480</div>
</div>
```

**Card hierarchy rules:**
- If everything is inside a border, don't add a second border inside unless it's for a clear sub-surface.
- Prefer **one** accent element (primary metric, badge, or button) — not all three.

#### Dashboards (scan → investigate → act)

Goal: support two speeds: **Scan** (what changed?), **Investigate** (why?), **Act** (what now?)

**Dashboard hierarchy pattern:**
- Top: high-level KPIs (large, few).
- Middle: trends / charts (medium emphasis).
- Bottom: tables / logs (dense, low emphasis).
- Actions: near the data they affect (local actions), plus one global primary action if necessary.

**Dashboard hierarchy rules:**
- If the top of the page is a wall of equal-weight cards, nothing is a priority.
- Tables are inherently dense; don't fight them — instead add clarity via column alignment, muted chrome, and strong row states.

### When to break hierarchy rules (intentionally)

You're allowed to break rules when you can explain the tradeoff.

**1) Optical alignment beats mathematical alignment**
- Icons often need slight vertical adjustment to look centered next to text.
- Large type may need baseline nudges relative to smaller adjacent text.
- Don't "center everything"; align to **baselines** and perceived centers.

**2) Dense screens need "hierarchy by structure," not by size**
- In a table-heavy screen, making titles huge wastes space.
- Use: consistent headings, clear grouping, restrained borders, and predictable actions.

**3) Sometimes you intentionally flatten hierarchy**
- Example: settings lists where items should feel uniform.
- In that case: keep typography consistent and let interaction states (hover/focus/selection) do the work.

---

## 4) Spacing System Philosophy

Spacing is design's punctuation. It tells users what belongs together, what is separate, and what matters.

If you ever feel your UI is "almost good" but still looks off, it's usually spacing — not color.

### The 4px/8px foundation (and why it matters)

**Why 4px?**
- It's the smallest useful increment that still reads as intentional across devices.
- It aligns well with common line-heights, icon sizes, and touch targets.

**Why 8px as the "main beat"?**
- Humans perceive rhythm. 8px steps create a predictable cadence: tight → normal → spacious.
- It reduces decision fatigue: you stop inventing new spacing values.

**Practical rule:**
- Use 4px increments for micro-adjustments.
- Use 8px increments for layout structure.

**Common mapping (Tailwind):**
| Utility | Size | Use case |
|---------|------|----------|
| `gap-1` | 4px | icon-text, micro spacing |
| `gap-2` | 8px | related items in a group |
| `gap-4` | 16px | between groups/sections inside a card |
| `gap-6` | 24px | between major sections |
| `gap-8` | 32px | page-level separation |

### Proximity principle (the rule that makes UIs instantly clearer)

**Related elements should be closer together than unrelated elements.**
This sounds obvious, but most messy UIs fail here.

**Decision framework:**
- If two things are conceptually one unit (label + input, title + subtitle), keep them **tight**.
- If two things are separate units (two sections, two cards), separate them **clearly**.

**Form spacing example:**
- Label ↔ input: tight (`gap-2`)
- Input ↔ help/error: tight (`gap-1` or `gap-2`)
- Field group ↔ next group: larger (`gap-4` or `gap-6`)

**Card spacing example:**
- Header ↔ body: medium (`gap-3` / `gap-4`)
- Body sections inside card: medium to large, but consistent

### Vertical rhythm tied to line-height

Typography and spacing are not separate systems. The most premium-feeling layouts treat them as one.

**Why:**
- Text has its own internal rhythm (line-height). If your vertical spacing ignores it, the layout feels jittery.

**Practical guidelines:**
- Keep body text line-height consistent within a context (`text-sm` + consistent `leading-*`).
- Prefer spacing values that are multiples of the body line-height or "half steps" of it.
- Avoid stacking random `mt-*` values; use a container rhythm with `gap-*`.

**Example: section stack**
```tsx
<div className="grid gap-6">
  <section className="grid gap-2">
    <h2 className="text-lg font-semibold text-foreground">Billing</h2>
    <p className="text-sm text-muted-foreground">Manage invoices and payouts.</p>
  </section>
  <section className="grid gap-4">
    {/* fields */}
  </section>
</div>
```

The heading/subtitle are tight (same thought). Sections are clearly separated (different thoughts).

### Gap vs margin vs padding (use the right tool)

**Use `gap` when:**
- You're spacing siblings in a layout (stacks, rows, grids).
- You want consistent rhythm that won't collapse or create weird edge cases.

**Use `padding` when:**
- You're defining an element's internal breathing room (cards, buttons, inputs).
- You need to control touch target size and comfort.

**Use `margin` when:**
- You're spacing a component relative to the outside world *and you can't control the parent layout* (rare).
- You need a one-off optical nudge (e.g., aligning an icon visually).

**Decision framework:**
- If you own the container: prefer `gap`.
- If you're defining the component: prefer `padding`.
- If you're fighting the layout: step back and restructure — don't add random margins.

**Example: a "card" uses padding; a "stack" uses gap**
```tsx
<div className="rounded-lg border border-border bg-card p-4">
  <div className="grid gap-4">
    {/* children */}
  </div>
</div>
```

---

## 5) Premium Design Principles

"Premium" is not gradients, glass, or decoration. Premium is what happens when nothing is accidental.

**Premium = restraint + intentionality + polish**
- **Restraint:** fewer visual ideas, executed cleanly.
- **Intentionality:** every weight, space, and surface has a reason.
- **Polish:** states, edges, and transitions feel finished — not default.

If you only remember one thing: **premium UIs feel calm.**

### Surface hierarchy (foreground / background / overlay)

Surfaces communicate structure. If everything is a "card," nothing is.

**The three-layer mental model:**
1. **Background**: the canvas (`bg-background`)
2. **Surface**: content containers (`bg-card` or your surface token)
3. **Overlay**: popovers/dialogs/menus (`bg-popover`, elevated shadow, clear border)

**Premium rules:**
- Use fewer surfaces than you think you need.
- Prefer **one** of: border OR shadow. Using both everywhere looks heavy.
- Keep borders subtle and consistent (`border-border`), not "outlined UI."

**Decision framework: should this be a surface?**
Ask:
- Does it represent a distinct object the user can act on? → maybe a surface (card).
- Is it just grouping related text? → likely no surface; use spacing + headings.
- Is it interactive and needs separation from background? → surface or hover state, not both.

### Motion as communication (not decoration)

Motion is premium when it **explains** something:
- Where did that thing come from?
- What changed?
- What is now active?
- What is loading / saving?

Motion is cheap when it's just "because animations."

**Principles:**
- Motion should be **subtle**, **fast**, and **purposeful**.
- Use motion to reinforce hierarchy: important changes get motion; trivial ones don't.

**Practical defaults:**
- Durations: ~150–250ms for UI transitions; faster for hover, slightly slower for overlays.
- Properties: favor `opacity`, `transform`, and `height` (carefully) — avoid complex multi-property chaos.
- Easing: consistent across the app (don't mix random curves).

**Accessibility:** Respect reduced motion preferences; default to no movement and use opacity/state changes instead.

### The details that separate "good enough" from "premium"

These are the small things that compound into trust.

**1) Alignment discipline**
- Align text baselines in rows (especially label/value pairs).
- Use consistent icon sizes and align them to text visually, not mathematically.

**2) Predictable type scale**
- Don't invent new sizes per screen. Reuse a small set: page title, section title, body, caption/help.
- De-emphasize with `text-muted-foreground` before shrinking too far.

**3) State completeness**
Every interactive element needs:
- default
- hover
- active/pressed
- focus-visible
- disabled
- loading (when applicable)
- error (when applicable)

Premium UIs don't "skip states."

**4) Touch targets and spacing comfort**
- Buttons and clickable rows should feel easy to hit.
- If you're forced to make something small, increase padding or row height.

**5) Empty states that teach**
- Explain what the user is seeing and what to do next.
- Provide a primary action when appropriate.

**6) Loading that preserves layout**
- Skeletons or placeholders should match the eventual layout so content doesn't jump.

**7) Copy tone consistency**
- Short, specific labels beat cleverness.
- Error messages should say what happened and how to fix it.

**Premium checklist before shipping a screen:**
- Can I squint and still understand what matters?
- Is spacing consistent (4/8 rhythm), or did I "hunt and peck" values?
- Did I add surfaces only where they clarify structure?
- Do interactive elements have complete states and clear focus?
- Does motion explain a change (or should it be removed)?

---

## 6) Decision Tree With Escalation

Full decision tree: `.codex/skills/treido-ui/references/decision-tree.md`

### Step 0 - Confirm scope and batch size
- If the change requires >3 files, split into multiple batches.
- If the request implies new features, escalate to orchestrator (scope control).

### Step 1 - Component placement
- Primitive -> `components/ui/*`
- Reusable composite -> `components/shared/*`
- Route-private UI -> `app/[locale]/(group)/**/_components/*`

If a proposed change would add app logic into `components/ui/*` -> escalate and propose a wrapper component instead.

### Step 2 - Styling rails
- Use semantic tokens only (SSOT: `app/globals.css`).
- If a design calls for a "new shade", escalate: propose 2-3 existing token-safe alternatives, or propose adding a new token (requires approval).

### Step 3 - Verification
- Always run `pnpm -s styles:gate` after UI work.
- Run e2e smoke only when the change touches routing/auth/checkout.

---

## 7) Non-Negotiables (CRITICAL)

Allowed:
- Editing UI components, layouts, and styles in small batches.
- Extending shadcn variants with token-safe classes.
- Updating translations via next-intl.

Forbidden (always):
- Gradients, palette colors, arbitrary values, hardcoded colors in TS/TSX.
- Opacity hacks on base tokens.
- Hardcoded user-facing strings (must use next-intl).
- Business logic or app imports inside `components/ui/*`.

---

## 8) Fix Recipes (battle cards)

Each recipe includes: Symptom -> Root Cause -> Minimal Fix -> Verify.

### Recipe A - "UI feels cramped / no hierarchy"
**Symptom:**
- Dense layouts, no spacing rhythm, important actions not obvious.

**Root cause:**
- Missing spacing scale usage and surface grouping.

**Minimal fix:**
- Add consistent spacing (`gap-*`, `space-y-*`), group content in `Card` surfaces, and use muted text tokens for secondary content.

**Verify:**
- `pnpm -s styles:gate`

### Recipe B - "Inconsistent buttons and states"
**Symptom:**
- Buttons look different per page; hover/focus states inconsistent.

**Root cause:**
- Callsite overrides instead of variants.

**Minimal fix:**
- Use `Button` variants/sizes; extend `components/ui/button.tsx` if needed (token-safe only).

**Verify:**
- `pnpm -s styles:gate`

### Recipe C - "Form UX feels sloppy"
**Symptom:**
- Labels missing, spacing inconsistent, errors unclear.

**Root cause:**
- Missing standard shadcn form structure.

**Minimal fix:**
- Use `Label`, `Input`, consistent `space-y-*`, and explicit helper/error text styles (`text-muted-foreground`, `text-destructive`).

**Verify:**
- `pnpm -s typecheck`

---

## 9) Golden Path Examples (Treido-specific)

### Golden Path 1 - Canonical page surface recipe
- `components/shared/page-shell.tsx:4` provides canonical page surfaces (`bg-background` vs `bg-surface-page`).

### Golden Path 2 - Token-safe primitives
- `components/ui/button.tsx:7` uses semantic tokens and CVA variants.

### Golden Path 3 - Token SSOT and theme bridge
- `app/globals.css:306` uses `@theme inline` to expose tokens as Tailwind classes.

---

## 10) Anti-Patterns With Shame (don't do this)

### Shame 1 - "Gradients everywhere"
**Why it's amateur hour:**
- It breaks the rails and looks like template AI UI.

**What to do instead:**
- Use surface tokens and hierarchy (cards, spacing, typography) to create depth.

### Shame 2 - "bg-primary/10"
**Why it's amateur hour:**
- Opacity hacks drift per theme and are impossible to standardize.

**What to do instead:**
- Use explicit tokens like `bg-hover`, `bg-selected`, `bg-surface-subtle`.

### Shame 3 - "Hardcoded strings"
**Why it's amateur hour:**
- It breaks i18n and will ship broken Bulgarian.

**What to do instead:**
- Add keys to `messages/en.json` and `messages/bg.json` and use next-intl.

---

## 11) Integration With This Codebase (Treido context)

Design SSOT:
- `docs/04-DESIGN.md` (tokens + rails)
- `docs/14-UI-UX-PLAN.md` (app-feel UX roadmap)
- `.codex/project/DESIGN.md` (deprecated compatibility pointer)

Tokens:
- `app/globals.css` (Tailwind v4 `@theme` bridge and semantic tokens)

shadcn:
- primitives: `components/ui/*`
- overrides: `app/shadcn-components.css`
- config: `components.json`

i18n:
- `messages/en.json`, `messages/bg.json`

---

## 12) Output Format (for orchestrator)

In IMPL mode, return a short summary:
- Task IDs completed (if provided)
- Files changed
- Commands run (`typecheck`, `lint`, `styles:gate`)
- Anything deferred (as a suggestion to orchestrator)
- End with `DONE`

---

## References (load only if needed)

- `.codex/skills/treido-ui/references/00-index.md`
- `.codex/skills/treido-ui/references/decision-tree.md`
- `.codex/skills/treido-ui/references/anti-patterns.md`
- `.codex/skills/treido-ui/references/app-feel-patterns.md`

