# TypeScript 5.9 — Strict Mode Patterns Reference

## DO

### Full strict mode
Our tsconfig enables maximum strictness:

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noImplicitOverride": true,
  "exactOptionalPropertyTypes": true
}
```

### Proper typing for all values
Use inference where clear, explicit types at boundaries.

```tsx
// Inference works — no annotation needed
const products = await getProducts() // type is Product[]

// Boundary (function signature) — annotate
export async function getProduct(id: string): Promise<Product | null> {
  // ...
}
```

### Discriminated unions for state
Replace boolean flags with discriminated unions.

```tsx
// ✅ GOOD
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

// ❌ BAD
type Result<T> = { data?: T; error?: string; success: boolean }
```

### `satisfies` for type-safe object literals
Use `satisfies` to validate shape without widening.

```tsx
const config = {
  theme: "dark",
  locale: "en",
} satisfies AppConfig
```

### `NoInfer<T>` to prevent undesirable inference

```tsx
function createOption<C extends string>(choices: C[], defaultChoice?: NoInfer<C>) {
  // TypeScript won't infer the default from a wider type
}
```

### Narrow with type predicates (inferred in 5.5+)

```tsx
// TypeScript 5.5+ infers: (x: unknown) => x is number
const isNumber = (x: unknown) => typeof x === "number"

// For complex cases, explicit predicate
function isProduct(item: unknown): item is Product {
  return typeof item === "object" && item !== null && "id" in item && "title" in item
}
```

### Use `as const` for literal types

```tsx
const STATUSES = ["active", "sold", "archived"] as const
type Status = (typeof STATUSES)[number] // "active" | "sold" | "archived"
```

---

## DON'T

### Don't use `any`
Zero tolerance. Use `unknown` and narrow, or use proper generics.

```tsx
// ❌ BAD
function handle(data: any) { ... }

// ✅ GOOD
function handle(data: unknown) {
  if (isProduct(data)) { ... }
}
```

### Don't use `@ts-ignore` or `@ts-expect-error`
Fix the type error instead. If it's a library issue, type-cast narrowly.

```tsx
// ❌ BAD
// @ts-expect-error — library types are wrong
const val = thing.prop

// ✅ GOOD — narrow cast
const val = (thing as { prop: string }).prop
```

### Don't use `as` for type assertions (broadly)
Use it only for narrowing, never for widening or lying to TypeScript.

```tsx
// ❌ BAD — lying to TypeScript
const user = {} as User

// ✅ OK — narrowing something you know
const id = params.id as string // from validated URL params
```

### Don't use `!` non-null assertion
Handle the null case explicitly.

```tsx
// ❌ BAD
const user = getUser()!

// ✅ GOOD
const user = getUser()
if (!user) throw new Error("User not found")
```

### Don't use `enum`
Use `as const` objects or union types instead.

```tsx
// ❌ BAD
enum Status { Active, Sold }

// ✅ GOOD
const Status = { Active: "active", Sold: "sold" } as const
type Status = (typeof Status)[keyof typeof Status]
```

---

## OUR SETUP

- **TypeScript 5.9.3** with maximum strictness
- **Target:** ES6, module resolution: bundler
- **Paths:** `@/*` maps to project root
- **Plugins:** Next.js type plugin for typed routes
- **Zod 4.3.5** for runtime validation at boundaries (forms, webhooks, API inputs)
- **Internal code** is fully typed — Zod only at system edges
