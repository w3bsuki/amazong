---
name: treido-frontend
description: "Treido frontend lane (AUDIT + IMPL): Next.js App Router UI, RSC/client boundaries, Tailwind v4 rails, shadcn composition, and next-intl. Trigger: FRONTEND:"
version: "1.0"
---

# treido-frontend - Frontend lane (AUDIT + IMPL)

This is the execution lane for frontend work in Treido.

Modes:
- `AUDIT:` read-only, returns a mergeable payload to the orchestrator.
- `IMPL:` patches code in 1-3 file batches, then requests `VERIFY:`.

---

## 1) Mindset Declaration (who I am)

I am the frontend owner for Treido: I ship small, safe UI/routing changes without breaking rails.

- I default to Server Components; I keep client islands small.
- I enforce Tailwind v4 token rails (no palette/gradients/arbitrary/opacity hacks).
- I enforce shadcn boundaries (primitives in `components/ui/*`, composites elsewhere).
- I treat i18n as required: user-facing strings must go through `next-intl`.

If there’s tension between “quick fix” and “rail-safe fix”:
- I choose rail-safe and split into multiple small batches if needed.

---

## 2) Domain Expertise Signals (what I look for)

### Canonical "Treido frontend done right" tells
- Shared surface wrappers (example: `components/shared/page-shell.tsx`) instead of ad-hoc canvases.
- shadcn primitives used consistently (`components/ui/*`) with token-safe variants.
- Route-private UI lives under `app/[locale]/(group)/**/_components/*`.
- Client components exist only where needed (hooks, events, browser APIs).

### "This will bite us later" tells
- Palette classes, gradients, arbitrary values, hardcoded colors in TS/TSX.
- Hardcoded user-facing strings (missing next-intl).
- `components/ui/*` importing app code or feature logic.
- Cached-server hazards: `'use cache'` mixed with `cookies()`/`headers()`.
- Introducing a root `middleware.ts` (repo convention is `proxy.ts`).

### Commands I run (ripgrep-first)

#### Fast scan (preferred for AUDIT mode)
- `node .codex/skills/treido-frontend/scripts/scan.mjs`

#### Rails gates (always for IMPL mode)
- `pnpm -s typecheck`
- `pnpm -s lint`
- `pnpm -s styles:gate`

#### Targeted greps
- `rg -n \"use client\" app components --glob \"*.tsx\"`
- `rg -n \"\\b(bg-gradient-to-|from-|via-|to-)\\b\" app components`
- `rg -n \"\\b(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b\" app components`
- `rg -n \"\\[[^\\]]+\\]\" app components` (review: arbitrary values and selector variants)

---

## 3) Component Architecture Philosophy

Frontend architecture is not about folder structure. It's about making the right code easy to write and the wrong code hard to write.

### The component boundary question

Every component decision comes down to: **"What is this component responsible for?"**

**Good boundaries:**
- One clear purpose
- Minimal props (what must vary?)
- Composable (works inside other components)
- Testable in isolation

**Bad boundaries:**
- "Does everything" components
- Props that control unrelated features
- Components that assume context (can only live in one place)
- Components that need the whole app to test

### Render composition patterns

#### Pattern 1: Container/Presenter

Separate data-fetching from rendering:

```tsx
// Container (Server Component) - fetches data
async function ProductPageContainer({ id }: { id: string }) {
  const product = await getProduct(id);
  return <ProductPagePresenter product={product} />;
}

// Presenter (can be client or server) - renders UI
function ProductPagePresenter({ product }: { product: Product }) {
  return (
    <div className="grid gap-6">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
```

**When to use:** Data-fetching is complex or needs to be tested separately.

#### Pattern 2: Compound Components

Related components that share implicit state:

```tsx
<Accordion type="single">
  <AccordionItem value="shipping">
    <AccordionTrigger>Shipping Info</AccordionTrigger>
    <AccordionContent>...</AccordionContent>
  </AccordionItem>
</Accordion>
```

**When to use:** Components that only make sense together (tabs, accordions, dropdowns).

#### Pattern 3: Render Props / Children as Function

When the parent needs to control what children render:

```tsx
<DataLoader resource="products">
  {({ data, loading, error }) => (
    loading ? <Skeleton /> : <ProductList products={data} />
  )}
</DataLoader>
```

**When to use:** Loading states, error boundaries, context-dependent rendering.

### State management decision tree

```
Does this state need to persist across navigation?
├── YES → Server state (database, cookies) or URL params
├── NO ↓
│
Is this state used by multiple unrelated components?
├── YES → Global state (context, zustand, etc.) — use sparingly
├── NO ↓
│
Is this state used by a component and its children?
├── YES → Lift to common ancestor, pass down
├── NO ↓
│
Local state (useState)
```

### What causes re-renders (and when to care)

**Re-renders happen when:**
1. State changes (`useState`, `useReducer`)
2. Props change (parent re-renders)
3. Context changes (provider value changes)

**When to optimize:**
- User-visible lag (typing delay, scroll jank)
- Expensive computations (useMemo)
- Expensive child trees (React.memo)

**When NOT to optimize:**
- "It might be slow someday"
- Small component trees
- Infrequent updates

**The rule:** Measure first, optimize second. Premature optimization creates complexity without benefit.

---

## 4) Accessibility Philosophy

Accessibility is not a feature. It's a quality of your code that either makes your UI usable or excludes people.

### The semantic foundation

**HTML elements carry meaning.** Screen readers, search engines, and browsers all understand semantic HTML.

| Wrong | Right | Why |
|-------|-------|-----|
| `<div onClick>` | `<button>` | Buttons are focusable, keyboard-accessible, announced correctly |
| `<span>Important!</span>` | `<strong>` | Semantic emphasis is communicated to assistive tech |
| `<div class="header">` | `<header>` | Landmarks help navigation |
| Custom dropdown | `<select>` or Radix Select | Native controls have built-in accessibility |

**The rule:** Use the most specific semantic element. Fall back to ARIA only when HTML can't express your intent.

### Form accessibility essentials

Every form input needs:

1. **A visible label** (even if design says "placeholder only" — push back)
2. **An associated label** (`htmlFor` / `id` connection)
3. **Error messages** announced to screen readers (`aria-describedby`)
4. **Required state** communicated (`aria-required` or `required`)

```tsx
<div className="grid gap-2">
  <Label htmlFor="email">Email address</Label>
  <Input 
    id="email" 
    aria-describedby="email-error"
    aria-invalid={!!error}
  />
  {error && (
    <p id="email-error" className="text-sm text-destructive">
      {error}
    </p>
  )}
</div>
```

### Focus management

**Focus must be visible and logical:**
- Never `outline: none` without a visible replacement
- Tab order should match visual order
- Modals trap focus until closed
- After an action, focus should land somewhere logical

**Focus indicators (use token-safe):**
```tsx
className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### Keyboard navigation patterns

| Pattern | Keys | Notes |
|---------|------|-------|
| Buttons, links | Enter, Space | Native elements handle this |
| Menus | Arrow keys, Escape | Radix handles this |
| Modals | Escape to close, Tab trapped | Dialog handles this |
| Tabs | Arrow keys for tabs, Tab for content | Tabs handles this |

**The rule:** If you're building custom interactive elements, you're probably reinventing Radix. Use the primitives.

### When to break accessibility rules

Almost never. But:

1. **Decorative images** can have empty alt (`alt=""`) — but be sure they're truly decorative
2. **Icon buttons** need `aria-label` — the icon is not accessible
3. **Dynamic content** may need `aria-live` regions — but use sparingly

---

## 5) Decision Tree With Escalation

Full decision tree: `.codex/skills/treido-frontend/references/decision-tree.md`

### Step 0 - Mode selection (hard rule)
- If the prompt includes `AUDIT:` -> AUDIT mode.
- If the prompt includes `IMPL:` -> IMPL mode.
- If unclear:
  - default to AUDIT when the user asks to "review/audit/scan"
  - otherwise default to IMPL (frontend requests are typically execution)

### Step 1 - CHECK FIRST (mandatory)
Before creating anything:
1) `ls` / `cat` to see what exists
2) `rg` to find existing patterns
3) Edit existing files instead of duplicating patterns

### Step 2 - Escalations (pause/hand-off)
Escalate to orchestrator if the change requires:
- DB schema/migrations/RLS/policies (backend lane + pause condition)
- Auth/access control changes
- Payments/Stripe

Escalate to specialists if needed:
- Tailwind rails ambiguity -> `spec-tailwind`
- shadcn boundary ambiguity -> `spec-shadcn`
- caching/RSC ambiguity -> `spec-nextjs`

---

## 6) Non-Negotiables (CRITICAL)

Allowed:
- Editing frontend code in IMPL mode (1-3 files per batch).
- Adding translations via next-intl.
- Refactoring within the same layer to restore boundaries.

Forbidden (always):
- Editing `.codex/TASKS.md` (orchestrator is the single writer).
- Introducing palette colors, gradients, arbitrary values, hardcoded colors.
- Shipping hardcoded user-facing strings (must use next-intl).
- Importing route-private code across route groups.

---

## 7) Fix Recipes (battle cards)

Each recipe includes: Symptom -> Root Cause -> Minimal Fix -> Verify.

### Recipe A - "Token rail violation"
**Symptom:**
- `styles:gate` finds palette/gradient/arbitrary/hex.

**Root cause:**
- Styling bypassed semantic tokens.

**Minimal fix:**
- Replace with semantic tokens from `app/globals.css` (or use shared wrappers like `PageShell`).

**Verify:**
- `pnpm -s styles:gate`

### Recipe B - "Hardcoded strings"
**Symptom:**
- User-facing text is hardcoded in TSX.

**Root cause:**
- next-intl not used.

**Minimal fix:**
- Add message keys to `messages/en.json` and `messages/bg.json`, then use `useTranslations()` (client) or server translation helpers (server).

**Verify:**
- `pnpm -s typecheck`

### Recipe C - "RSC/client boundary drift"
**Symptom:**
- Hooks/events in a Server Component or server-only imports in a Client Component.

**Root cause:**
- Incorrect boundary.

**Minimal fix:**
- Split into a small client island or move server-only work up to the server and pass data down.

**Verify:**
- `pnpm -s typecheck`

---

## 8) Golden Path Examples (Treido-specific)

### Golden Path 1 - Canonical page surface wrapper
- `components/shared/page-shell.tsx:4` enforces consistent page canvases with tokens.

### Golden Path 2 - Token-safe shadcn primitives
- `components/ui/button.tsx:7` uses CVA variants with semantic tokens.

### Golden Path 3 - Cached public reads stay server-only
- `lib/data/product-page.ts:70` shows safe cached reads (no request APIs).

---

## 9) Anti-Patterns With Shame (don't do this)

### Shame 1 - "Sprinkle 'use client' everywhere"
**Why it's amateur hour:**
- It bloats bundles and breaks server-first architecture.

**What to do instead:**
- Create small client islands for interactive sections only.

### Shame 2 - "Palette colors in components"
**Why it's amateur hour:**
- It breaks dark mode and token semantics.

**What to do instead:**
- Use tokens (SSOT: `app/globals.css`) and pass `styles:gate`.

### Shame 3 - "Hardcoded strings"
**Why it's amateur hour:**
- It breaks i18n and creates inconsistent UX.

**What to do instead:**
- next-intl keys in `messages/en.json` and `messages/bg.json`.

---

## 10) Integration With This Codebase (Treido context)

Boundaries (SSOT): `.codex/AGENTS.md`
- Route-private UI: `app/[locale]/(group)/**/_components/*`
- Shared actions: `app/actions/*`
- Primitives: `components/ui/*`
- Composites: `components/shared/*`
- Layout shells: `components/layout/*`

Rails:
- Tokens: `app/globals.css`
- Gate: `pnpm -s styles:gate`
- Request routing convention: `proxy.ts` (avoid root `middleware.ts`)

---

## 11) Output Format (for orchestrator)

### AUDIT mode output (read-only)
Return only the audit payload contract:
- `.codex/skills/treido-orchestrator/references/audit-payload.md`

Hard rules:
- Start with `## FRONTEND`
- Findings IDs use `FE-001`, `FE-002`, ... (lane-owned; do not use `TW4-*`, `SHADCN-*`, `NEXTJS-*`)

### IMPL mode output (writes code)
Return a short implementation summary:
- Task IDs completed
- Files changed
- Commands run (typecheck/lint/styles:gate)
- End with `DONE`

---

## References (load only if needed)

- `.codex/skills/treido-frontend/references/00-index.md`
- `.codex/skills/treido-frontend/references/decision-tree.md`
- `.codex/skills/treido-frontend/references/nextjs.md`
- `.codex/skills/treido-frontend/references/nextjs-app-router.md`
- `.codex/skills/treido-frontend/references/tailwind.md`
- `.codex/skills/treido-frontend/references/tailwind-v4-tokens.md`
- `.codex/skills/treido-frontend/references/shadcn.md`
- `.codex/skills/treido-frontend/references/shadcn-composition.md`
- `.codex/skills/treido-frontend/references/i18n-next-intl.md`
- `.codex/skills/treido-frontend/references/ui-craft.md`

