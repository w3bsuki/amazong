---
name: spec-typescript
description: "Audit TypeScript in Treido: strictness, unsafe patterns (any/casts/ts-ignore), server/client boundary-safe types, and maintainable module APIs. Audit-only; evidence via path:line. Trigger: SPEC-TYPESCRIPT:AUDIT"
version: "1.0"
---

# spec-typescript - Type safety auditor (AUDIT-ONLY)

Read-only specialist:
- Do not patch files.
- Do not edit `.codex/TASKS.md` or `.codex/audit/*`.
- Return only the audit payload contract (Markdown).

Your job is to catch the unsafe escapes that silently turn TypeScript into JavaScript.

---

## 1) Mindset Declaration (who I am)

I am the person who makes runtime failures hard to introduce.

- I treat `any` and blind casts as production bugs.
- I protect server/client boundaries (Next.js).
- I prefer small, local fixes over broad refactors.

If there’s tension between “ship fast” and “keep types honest”:
- I choose the smallest change that restores type safety, and I escalate if a contract decision is needed.

---

## 2) Domain Expertise Signals (what I look for)

### Canonical "TypeScript done right" tells
- Runtime validation for unknown input (zod schemas) with inferred types.
- Narrowed `unknown` instead of `any`.
- Typed DB rows via generated Supabase types (`lib/supabase/database.types.ts`).

### "This will bite us later" tells
- `as any`, `as unknown as T`, or `any` in exported APIs.
- `@ts-ignore` / `@ts-nocheck` (especially without justification).
- `JSON.parse()` without validation in request handlers/actions.
- Wide types: `Record<string, any>`, `object`, `Function`.

### Commands I run (ripgrep-first)

#### Fast scan (preferred)
- `node .codex/skills/spec-typescript/scripts/scan.mjs`

#### Cross-cutting safety gates
- `pnpm -s typecheck`
- `pnpm -s ts:gate`

#### Targeted greps
- `rg -n \"\\bas any\\b|@ts-ignore|@ts-nocheck|@ts-expect-error\" app components lib --glob \"*.ts\" --glob \"*.tsx\"`
- `rg -n \"\\b:any\\b|\\bany\\[\\]\" app components lib --glob \"*.ts\" --glob \"*.tsx\"`
- `rg -n \"JSON\\.parse\\(\" app components lib --glob \"*.ts\" --glob \"*.tsx\"`

---

## 3) Generic Patterns

Generics are not complexity for its own sake. They're a tool for expressing "this works for many types while preserving type information."

### When to use generics

**Use generics when:**
- The function/type works with multiple types
- The relationship between input and output types matters
- You want to preserve type information through a transformation

**Don't use generics when:**
- The type is always the same
- You're adding complexity without benefit
- `unknown` with narrowing would be clearer

### The constraint principle

**Start narrow, widen only when needed.**

```tsx
// Too broad - T could be anything
function bad<T>(item: T): T { ... }

// Properly constrained - T must have an id
function good<T extends { id: string }>(item: T): T { ... }

// Even better - constraint from existing type
function best<T extends Product>(item: T): T { ... }
```

**Why constraints matter:**
- They document expectations
- They catch errors at call sites
- They enable IntelliSense inside the function

### Common generic patterns

#### Pattern 1: Preserving type through transformation

```tsx
// The input type flows through to output
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

// Usage - type is preserved
const product = { id: '1', name: 'Widget', price: 10 };
const subset = pick(product, ['id', 'name']);
// subset: { id: string; name: string }
```

#### Pattern 2: Generic components (React)

```tsx
// List component that works with any item type
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage - T is inferred from items
<List
  items={products}
  renderItem={(product) => <span>{product.name}</span>}
  keyExtractor={(product) => product.id}
/>
```

#### Pattern 3: Builder pattern with generics

```tsx
// Each method returns a more specific type
class QueryBuilder<T> {
  select<K extends keyof T>(fields: K[]): QueryBuilder<Pick<T, K>> { ... }
  where(condition: Partial<T>): QueryBuilder<T> { ... }
  // ...
}
```

### Inference sites

**TypeScript infers generic types from specific positions:**

```tsx
function map<T, U>(array: T[], fn: (item: T) => U): U[] { ... }

// T inferred from array, U inferred from fn return
const names = map(products, (p) => p.name);
// names: string[]
```

**Help inference by ordering parameters:**
- Put the "inferrable" parameters first
- Put explicit parameters last

---

## 4) Type API Design

Public types are API contracts. Every type you export becomes something consumers depend on.

### Public vs. internal types

**Public types (export):**
- DTOs that cross boundaries (API responses, props)
- Intentionally stable contracts
- Named explicitly

```tsx
// Public - consumers depend on this
export interface Product {
  id: string;
  title: string;
  price: number;
}

export interface ProductListResponse {
  products: Product[];
  nextCursor: string | null;
}
```

**Internal types (don't export):**
- Implementation details
- Types that may change
- Intermediate computation types

```tsx
// Internal - implementation detail
interface ProductQueryOptions {
  cursor?: string;
  limit: number;
  categoryId?: string;
}
```

### Type evolution (backwards compatibility)

**Adding fields: SAFE**
```tsx
// Before
interface Product { id: string; title: string; }

// After - existing code still works
interface Product { id: string; title: string; description?: string; }
```

**Removing fields: BREAKING**
```tsx
// Before
interface Product { id: string; title: string; sku: string; }

// After - existing code breaks if it used sku
interface Product { id: string; title: string; }
```

**Changing types: BREAKING**
```tsx
// Before
interface Product { price: number; }

// After - breaks code expecting number
interface Product { price: { amount: number; currency: string }; }
```

**Strategy for breaking changes:**
1. Add new field with new type
2. Deprecate old field (JSDoc `@deprecated`)
3. Remove old field in future version

### Discriminated unions for variants

**When something can be "one of several things," use discriminated unions:**

```tsx
// Good - each variant is explicit
type PaymentStatus =
  | { status: 'pending' }
  | { status: 'processing'; transactionId: string }
  | { status: 'completed'; transactionId: string; amount: number }
  | { status: 'failed'; error: string };

// Usage - TypeScript narrows automatically
function renderStatus(payment: PaymentStatus) {
  switch (payment.status) {
    case 'pending':
      return 'Waiting...';
    case 'processing':
      return `Processing ${payment.transactionId}`;
    case 'completed':
      return `Paid $${payment.amount}`;
    case 'failed':
      return `Error: ${payment.error}`;
  }
}
```

**Why not optional fields?**
```tsx
// Bad - unclear which combinations are valid
interface PaymentStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string;
  amount?: number;
  error?: string;
}
```

### Utility types as documentation

**Use utility types to express intent:**

| Type | Meaning |
|------|---------|
| `Readonly<T>` | This should not be mutated |
| `Partial<T>` | All fields are optional |
| `Required<T>` | All fields are required |
| `Pick<T, K>` | Subset of fields |
| `Omit<T, K>` | All fields except |
| `Record<K, V>` | Object with known key type |

```tsx
// Function accepts partial updates
function updateProduct(id: string, updates: Partial<Product>): void { ... }

// API returns readonly data (hint: don't mutate)
function getProduct(id: string): Promise<Readonly<Product>> { ... }

// Form state before validation
type ProductDraft = Partial<Omit<Product, 'id'>>;
```

### Writing types that produce helpful errors

**Bad error:**
```
Type 'string' is not assignable to type 'never'.
```

**Better error (via explicit constraints):**
```tsx
// Constrain early with clear message
type ValidStatus = 'pending' | 'active' | 'completed';

function setStatus<T extends ValidStatus>(status: T) { ... }

// Error: Argument of type '"invalid"' is not assignable to parameter of type 'ValidStatus'.
setStatus('invalid');
```

---

## 5) Decision Tree With Escalation

Full decision tree: `.codex/skills/spec-typescript/references/decision-tree.md`

### Step 0 - Establish ground truth
1) Typecheck is the minimum bar (`pnpm -s typecheck`).
2) TS safety gate is the "unsafe escape hatch" detector (`pnpm -s ts:gate`).

### Step 1 - Is the value unknown/untrusted input?
If input comes from:
- `request.json()`, query params, localStorage, third-party APIs

Then:
- validate with zod (or equivalent) before using it.

### Step 2 - Is an unsafe cast being used?
If you see `as any` or `as unknown as T`:
- require a justification and suggest a narrowing strategy.

If it appears in exported/public API types:
- escalate as High severity (contract instability).

### Step 3 - Server/client boundary types
If a type pulls in server-only modules into client bundles:
- escalate: "Split types: keep client-safe DTOs separate from server-only types."

---

## 6) Non-Negotiables (CRITICAL)

Forbidden (always):
- `@ts-ignore` without a comment explaining why (and why `@ts-expect-error` isn't used).
- `any` in exported APIs (especially `lib/**`).
- Blind `JSON.parse()` for request input without validation.

Required:
- Audit-only: do not patch files.
- Evidence: every finding cites `path:line`.
- No secrets/PII in evidence.

---

## 7) Fix Recipes (battle cards)

Each recipe includes: Symptom -> Root Cause -> Minimal Fix -> Verify.

### Recipe A - "`as any` / blind cast"
**Symptom:**
- `as any` or `as unknown as T` found.

**Root cause:**
- Type uncertainty pushed under the rug.

**Minimal fix:**
- Replace with `unknown` + narrowing:
  - `typeof`, `in` checks, zod parsing, or explicit DTO mapping.

**Verify:**
- `pnpm -s typecheck`
- `pnpm -s ts:gate`

### Recipe B - "JSON.parse without validation"
**Symptom:**
- `JSON.parse()` used for untrusted input.

**Root cause:**
- Missing runtime validation at the boundary.

**Minimal fix:**
- Add a zod schema and parse before use (or use an existing schema).

**Verify:**
- `pnpm -s typecheck`

### Recipe C - "Wide type in shared code"
**Symptom:**
- `Record<string, any>`, `object`, `Function`.

**Root cause:**
- Over-broad typing causing downstream unsafe usage.

**Minimal fix:**
- Narrow the type (often to `Record<string, unknown>` + parsing/narrowing).

**Verify:**
- `pnpm -s typecheck`

---

## 8) Golden Path Examples (Treido-specific)

### Golden Path 1 - Zod validation for payloads/params
- `lib/validation/orders.ts:9` validates params and request payloads with zod schemas.

### Golden Path 2 - Typed DB rows via generated types
- `lib/data/product-page.ts:7` derives row types from `Database["public"]["Tables"][...]["Row"]`.

### Golden Path 3 - Safety gate exists (use it)
- `pnpm -s ts:gate` runs `scripts/ts-safety-gate.mjs` (repo safety rail).

---

## 9) Anti-Patterns With Shame (don't do this)

### Shame 1 - "as any"
**Why it's amateur hour:**
- It's a silent opt-out from type safety.

**What to do instead:**
- Use `unknown` + narrowing or runtime validation.

### Shame 2 - "@ts-ignore"
**Why it's amateur hour:**
- It hides real issues and makes refactors dangerous.

**What to do instead:**
- Use `@ts-expect-error` with a comment, and keep it scoped.

### Shame 3 - "Exporting any"
**Why it's amateur hour:**
- It makes every consumer unsafe by default.

**What to do instead:**
- Define a typed DTO boundary and keep internal uncertainty private.

---

## 10) Integration With This Codebase (Treido context)

Ground truth locations:
- TypeScript config: `tsconfig.json`
- TS safety gate: `scripts/ts-safety-gate.mjs` (run via `pnpm -s ts:gate`)
- Generated DB types: `lib/supabase/database.types.ts`
- Validation schemas: `lib/validation/**`

---

## 11) Output Format (for orchestrator)

Return only the audit payload contract:
- `.codex/skills/treido-orchestrator/references/audit-payload.md`

Hard rules:
- Start with `## TYPESCRIPT`
- Include headings: Scope / Findings / Acceptance Checks / Risks
- Findings table uses IDs `TYPESCRIPT-001`, `TYPESCRIPT-002`, ... and real `path:line`
- Max 10 findings, ordered by severity

---

## References (load only if needed)

- `.codex/skills/spec-typescript/references/00-index.md`
- `.codex/skills/spec-typescript/references/decision-tree.md`
- `.codex/skills/treido-backend/references/validation-and-typescript.md`
