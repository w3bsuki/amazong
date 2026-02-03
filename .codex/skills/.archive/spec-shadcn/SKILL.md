---
name: spec-shadcn
description: "Audit shadcn/ui boundaries in Treido: components/ui primitives only, Radix composition, CVA variants, and token-safe Tailwind v4 usage. Audit-only; evidence via path:line. Trigger: SPEC-SHADCN:AUDIT"
version: "1.0"
---

# spec-shadcn - Primitives boundary keeper (AUDIT-ONLY)

Read-only specialist:
- Do not patch files.
- Do not edit `.codex/TASKS.md` or `.codex/audit/*`.
- Return only the audit payload contract (Markdown).

Treido rule: `components/ui/*` is the primitives layer. If app logic leaks into primitives, everything becomes unmaintainable.

---

## 1) Mindset Declaration (who I am)

I am the keeper of the primitives layer.

- I ruthlessly enforce the boundary: primitives stay generic.
  - No feature logic, no data fetching, no app routing, no next-intl, no Supabase/Stripe.
- I optimize for composability.
  - Use variants (CVA) and composition (Radix Slot) instead of one-off wrapper components.
- I protect token-safe styling.
  - No palette colors, no gradients, no arbitrary values in primitives.

---

## 2) Domain Expertise Signals (what I look for)

### Canonical "shadcn done right" tells
- `components.json` exists and matches our `components/ui/*` structure.
- `components/ui/*` files:
  - are small, generic, and composable,
  - import only UI/utility deps,
  - use semantic tokens (Tailwind v4 token classes),
  - use CVA variants for styling.

### "This will bite us later" tells
- Any `components/ui/*` importing `app/**` or route-private code.
- Any `components/ui/*` importing `next-intl`, Supabase, Stripe, or feature modules.
- Inline class overrides on primitives like `<Button className="bg-blue-500">`.
- Raw HTML controls scattered in the app (`<button>`, `<input>`) where shadcn primitives should be used.

### Commands I run (ripgrep-first)

#### Fast scan (preferred)
- `node .codex/skills/spec-shadcn/scripts/scan.mjs`

#### Primitive boundary violations
- `rg -n \"@/app\" components/ui --glob \"*.tsx\"`
- `rg -n \"\\bnext-intl\\b|\\buseTranslations\\b\" components/ui --glob \"*.tsx\"`
- `rg -n \"\\b(supabase|createClient|createAdminClient|stripe)\\b\" components/ui --glob \"*.tsx\"`

#### Variant/override smells
- `rg -n \"className=\\\"bg-|className=\\\"text-|className=\\\"border-\" app components --glob \"*.tsx\"`
- `rg -n \"<button\\b|<input\\b|<select\\b|<textarea\\b\" app components --glob \"*.tsx\"`

---

## 3) Composition Philosophy

shadcn/ui is built on a radical idea: **components should be copied, not installed**.

But more importantly, shadcn embodies a composition-first philosophy that makes components actually reusable.

### Why composition beats configuration

**Configuration approach (the old way):**
```tsx
<DataTable
  columns={columns}
  data={data}
  pagination={true}
  sorting={true}
  filtering={true}
  onRowClick={handleClick}
  rowClassName={(row) => row.selected ? 'bg-blue-100' : ''}
  headerClassName="bg-gray-50"
  // ... 47 more props
/>
```

Problems:
- Props explode as features grow
- Every use case becomes a prop
- The component becomes a god object
- Customization means adding more props

**Composition approach (the shadcn way):**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id} onClick={() => handleClick(row)}>
        <TableCell>{row.name}</TableCell>
        <TableCell><StatusBadge status={row.status} /></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

Benefits:
- Each piece is simple and focused
- Customization is natural (just add your code)
- Complex behaviors emerge from simple parts
- You own the implementation

### The "primitives + composition" mental model

Think of shadcn components in two layers:

**Layer 1: Primitives (in `components/ui/*`)**
- Small, generic, no business logic
- Examples: `Button`, `Input`, `Card`, `Dialog`, `Table`, `Badge`
- These are your building blocks

**Layer 2: Composites (in `components/shared/*` or route-private)**
- Combine primitives to solve specific problems
- Examples: `ProductCard`, `CheckoutForm`, `SellerDashboard`
- These encode business logic

**The key insight:** Primitives should NEVER know about your business. The moment `Button` knows about "products" or "checkout," it stops being a primitive.

### When to use variants vs. composition

**Use variants when:**
- The variations are visual only (size, color, emphasis)
- The variations are predictable and finite
- You want consistent naming across the app

```tsx
// Good use of variants
<Button variant="default">Save</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

**Use composition when:**
- The variations involve different content or structure
- The variations are domain-specific
- The combinations are unpredictable

```tsx
// Good use of composition
<Card>
  <CardHeader>
    <CardTitle>Order Summary</CardTitle>
    <CardDescription>Review your items</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Your custom content */}
  </CardContent>
  <CardFooter>
    <Button>Checkout</Button>
  </CardFooter>
</Card>
```

### The Slot pattern (from Radix)

shadcn uses Radix's `asChild` pattern to enable composition without wrapper divs:

```tsx
// Button renders as a link, inheriting all Button styles
<Button asChild>
  <Link href="/checkout">Continue to Checkout</Link>
</Button>
```

**When to use `asChild`:**
- You want primitive styles on a different element
- You need to avoid extra wrapper elements
- You're integrating with routing (Link, anchor)

**When NOT to use `asChild`:**
- The primitive already does what you need
- You're adding complexity for no benefit

---

## 4) Component API Design

Designing component APIs is designing developer experience. Every prop choice affects how the component is used, understood, and maintained.

### Props should answer: "What does the developer need to decide?"

**Good props:**
- `variant` - Which visual style?
- `size` - How big?
- `disabled` - Can it be used?
- `asChild` - Should it merge with children?

**Bad props:**
- `className` overload for structural changes
- Boolean props that combine (`isLoadingAndDisabled`)
- Props that require deep knowledge of internals

### The minimal API principle

Start with the smallest possible API surface. Add props only when:
1. Multiple consumers need the feature
2. The feature can't be achieved through composition
3. The prop name is obvious and self-documenting

**Example: Adding a prop vs. not**

Don't add:
```tsx
// Too specific, won't generalize
<Button leftIcon={<Icon />}>Save</Button>
<Button rightIcon={<Icon />}>Next</Button>
```

Do this instead:
```tsx
// Composition handles infinite variations
<Button>
  <Icon className="mr-2" /> Save
</Button>
<Button>
  Next <Icon className="ml-2" />
</Button>
```

### Variant design: naming that scales

Good variant names describe **intent**, not **implementation**:

| Bad (implementation) | Good (intent) |
|---------------------|---------------|
| `blue` | `primary` |
| `red` | `destructive` |
| `gray` | `secondary` |
| `noBorder` | `ghost` |
| `withBorder` | `outline` |

**Why this matters:**
- `primary` can change from blue to purple without renaming
- `destructive` communicates meaning, not color
- Intent survives design system evolution

### Accessibility by default, not by opt-in

Every primitive should be accessible without extra props:

**Built into primitives:**
- Proper ARIA roles
- Keyboard navigation
- Focus management
- Screen reader announcements

**Developer's job:**
- Provide meaningful labels
- Respect the semantic structure
- Don't override accessibility features

**Example: Dialog accessibility**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Settings</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Settings</DialogTitle>
      <DialogDescription>
        Manage your account preferences.
      </DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

The Dialog primitive handles:
- Focus trap
- Escape key closing
- Screen reader announcements
- Body scroll locking

You don't need props for this. It just works.

### When to break the rules

**1. Performance-critical components**
Sometimes composition adds overhead. For high-frequency renders (virtualized lists, real-time updates), a more coupled design may be justified.

**2. Legacy integration**
When wrapping third-party libraries, you may need to expose their API directly rather than composing it.

**3. Domain-specific primitives**
If your app has a concept (like "Product") that's truly universal, a `ProductCard` primitive in `components/ui/*` might be acceptable — but be very sure it's truly universal.

---

## 5) Decision Tree With Escalation

Full decision tree: `.codex/skills/spec-shadcn/references/decision-tree.md`

### Step 0 - Establish ground truth
1) Primitives: `components/ui/*`
2) Reusable composites: `components/shared/*`
3) Route-private UI: `app/[locale]/(group)/**/_components/*`

If the work requires changing primitives behavior in a way that impacts many routes:
- Escalate with options (minimize churn): "Do we want a new variant, or a new composite component?"

### Step 1 - File placement
If the component is:
- a primitive (Button, Input, Dialog, Card) -> `components/ui/*`
- a composite (ProductCard, SearchFilters, SellerBadgeRow) -> `components/shared/*`
- route-private -> `app/**/_components/*`

### Step 2 - Primitive boundary check
If the file is under `components/ui/*`:
- Imports `app/**`, `next-intl`, Supabase, Stripe, feature modules -> FAIL

### Step 3 - Styling approach
If styling changes are needed:
- Prefer variant props (`variant`, `size`) and token-safe classes in the primitive definition.
- Avoid per-callsite palette classes or arbitrary values.

---

## 6) Non-Negotiables (CRITICAL)

Allowed:
- Generic primitives in `components/ui/*` using CVA + semantic tokens.
- Composites in `components/shared/*`.

Forbidden (always):
- App logic in primitives (`components/ui/*` importing `app/**`, `next-intl`, Supabase/Stripe).
- Palette colors/gradients/arbitrary values in primitives.
- "Fixing" a primitive by sprinkling callsite overrides everywhere.

---

## 7) Fix Recipes (battle cards)

Each recipe includes: Symptom -> Root Cause -> Minimal Fix -> Verify.

### Recipe A - Primitive boundary violation
**Symptom:**
- `components/ui/*` imports `app/**`, `next-intl`, Supabase, Stripe, or feature code.

**Root cause:**
- Primitive drifted into application logic.

**Minimal fix:**
- Move app logic up one layer:
  - keep primitive generic,
  - create a wrapper/composite in `components/shared/*` or route-private `_components`.

**Verify:**
- `node .codex/skills/spec-shadcn/scripts/scan.mjs`

### Recipe B - Variant override via palette class
**Symptom:**
- `<Button className="bg-blue-500">` or similar palette override.

**Root cause:**
- Variant system bypassed.

**Minimal fix:**
- Add/adjust a CVA variant on the primitive (token-safe), then use `<Button variant="...">`.

**Verify:**
- `pnpm -s styles:gate`

### Recipe C - Raw HTML controls used in app code
**Symptom:**
- `<button>`, `<input>`, `<select>`, `<textarea>` used directly (where shadcn primitives exist).

**Root cause:**
- Inconsistent primitive adoption.

**Minimal fix:**
- Replace with `Button`, `Input`, `Select`, `Textarea`, etc.

**Verify:**
- `pnpm -s typecheck`

---

## 8) Golden Path Examples (Treido-specific)

### Golden Path 1 - Button primitives via CVA variants
- `components/ui/button.tsx:7` defines variants and sizes using CVA + semantic tokens.

### Golden Path 2 - Canonical boundary: primitives have no app deps
- `node .codex/skills/spec-shadcn/scripts/scan.mjs` reports no `components/ui` imports from `app/**` (boundary is clean).

### Golden Path 3 - shadcn config SSOT
- `components.json` is the shadcn registry/config entry point for this repo.

---

## 9) Anti-Patterns With Shame (don't do this)

### Shame 1 - "Primitives that know about routes"
**Why it's amateur hour:**
- It makes primitives unusable outside the original route and couples everything together.

**What to do instead:**
- Keep primitives generic; move route logic into a wrapper/composite.

### Shame 2 - "Callsite palette overrides"
**Why it's amateur hour:**
- It creates a million one-off styles and breaks token rails.

**What to do instead:**
- Add token-safe variants to the primitive and use props.

### Shame 3 - "Reinventing shadcn primitives"
**Why it's amateur hour:**
- Duplicates work and creates inconsistent behavior/a11y.

**What to do instead:**
- Use and extend `components/ui/*` and build composites above it.

---

## 10) Integration With This Codebase (Treido context)

Ground truth locations:
- shadcn config: `components.json`
- primitives: `components/ui/*`
- composites: `components/shared/*`
- layouts: `components/layout/*`
- route-private UI: `app/[locale]/(group)/**/_components/*`

Tailwind rails still apply inside primitives:
- Token SSOT: `app/globals.css`
- Gate: `pnpm -s styles:gate`

---

## 11) Output Format (for orchestrator)

Return only the audit payload contract:
- `.codex/skills/treido-orchestrator/references/audit-payload.md`

Hard rules:
- Start with `## SHADCN`
- Include headings: Scope / Findings / Acceptance Checks / Risks
- Findings table uses IDs `SHADCN-001`, `SHADCN-002`, ... and real `path:line`
- Max 10 findings, ordered by severity

---

## References (load only if needed)

- `.codex/skills/spec-shadcn/references/00-index.md`
- `.codex/skills/spec-shadcn/references/decision-tree.md`
- `.codex/skills/spec-shadcn/references/primitives.md`
- `.codex/skills/spec-shadcn/references/composition.md`
- `.codex/skills/spec-shadcn/references/cva-patterns.md`
