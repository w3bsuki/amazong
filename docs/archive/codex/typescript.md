
> Execution Status: Reference Only
> This playbook is an input reference. Active execution tracking lives in codex/master-refactor-plan.md and codex/phases/*.md.

# Task: TypeScript Strictness Audit & Refactor

> **Read `codex/AGENTS.md` first.** It contains the project context, folder map, non-negotiables, and verification gates.

## Objective

Eliminate all type-safety escapes in the codebase. Every `any`, every `as` assertion, every `@ts-ignore` is a hidden bug. Find them all and fix them properly with real types.

---

## Phase 1: Suppress-Directive Sweep

### 1.1 Find and Fix All `@ts-nocheck`

```bash
grep -rn "@ts-nocheck" --include="*.ts" --include="*.tsx" app/ components/ lib/ hooks/
```

For each file with `@ts-nocheck`:
1. Remove the directive.
2. Fix every type error that surfaces.
3. Run `pnpm -s typecheck` to verify.

Known location: `supabase/functions/ai-shopping-assistant/index.ts` has `@ts-nocheck`. This is an Edge Function (Deno runtime) — fix the types but be careful with Deno-specific APIs. If you can't fully type it, replace `@ts-nocheck` with targeted `@ts-expect-error` comments on specific lines with explanations.

### 1.2 Find and Fix All `@ts-ignore`

```bash
grep -rn "@ts-ignore" --include="*.ts" --include="*.tsx" app/ components/ lib/ hooks/
```

Every `@ts-ignore` is hiding a real type problem. For each one:
1. Remove the directive.
2. Understand the type error.
3. Fix the root cause (add proper types, narrow types, fix the signature).
4. If the error is genuinely unfixable (rare library typing bug), convert to `@ts-expect-error` with a comment explaining why.

### 1.3 Find and Fix All `@ts-expect-error`

```bash
grep -rn "@ts-expect-error" --include="*.ts" --include="*.tsx" app/ components/ lib/ hooks/
```

These are better than `@ts-ignore` but still should be minimized. For each one:
1. Check if the underlying issue has been fixed (types updated, library updated).
2. Try removing the directive — if it compiles clean, the suppression is stale. Delete it.
3. If the error persists, ensure the comment explains why it's necessary.

---

## Phase 2: `any` Type Elimination

### 2.1 Find All Explicit `any` Types

```bash
grep -rn ": any" --include="*.ts" --include="*.tsx" app/ components/ lib/ hooks/
grep -rn "<any>" --include="*.ts" --include="*.tsx" app/ components/ lib/ hooks/
grep -rn "as any" --include="*.ts" --include="*.tsx" app/ components/ lib/ hooks/
```

For each `any` found:
1. **Function parameters**: Replace with the actual expected type. If it's a generic handler, use `unknown` and narrow.
2. **Return types**: Infer from the function body or add the explicit return type.
3. **Variable declarations**: Replace with the correct type from context.
4. **`as any` casts**: These are the most dangerous. Remove the cast and fix the underlying type mismatch. Common patterns:
   - `zodResolver(...) as any` — Use proper `Resolver<T>` type from `@hookform/resolvers`
   - `response.json() as any` — Parse with Zod schema and use the inferred type
   - `data as any` — Usually means the data shape isn't properly typed from Supabase

### 2.2 Find All `as unknown as T` Double-Casts

```bash
grep -rn "as unknown as" --include="*.ts" --include="*.tsx" app/ components/ lib/ hooks/
```

Double-casts are a code smell. Each one means the types are fundamentally wrong somewhere. Fix the source of the mismatch rather than casting around it.

---

## Phase 3: Non-Null Assertion Cleanup

### 3.1 Find All `!` Non-Null Assertions

```bash
grep -rn "\w\!" --include="*.ts" --include="*.tsx" app/ components/ lib/ hooks/ | grep -v "!=\|!==\|<!--\|//"
```

This will be noisy. Focus on patterns like:
- `user.email!` — Replace with null check + early return
- `params.id!` — Replace with validation
- `document.getElementById(...)!` — Replace with null check
- `array[0]!` — The project has `noUncheckedIndexedAccess: true` in tsconfig, so these should already be caught

For each non-null assertion:
1. Add a proper null/undefined check.
2. Handle the null case (throw, early return, or provide a default).
3. Remove the `!`.

---

## Phase 4: Type Definition Consolidation

### 4.1 Audit `lib/types/`

Currently contains:
- `lib/types/badges.ts`
- `lib/types/categories.ts`
- `lib/types/messages.ts`
- `lib/types/products.ts`

Check for:
- Types defined here that are also defined elsewhere (duplicates in `app/` route files, `components/` props, etc.)
- Types that are unused — delete them
- Types that should be auto-generated from Supabase (`lib/supabase/database.types.ts`) but are manually duplicated — delete the manual copies and import from the generated file

### 4.2 Audit Inline Type Definitions

Search for large inline type definitions in component files:
```bash
grep -rn "type \w\+ = {" --include="*.tsx" app/ components/ | head -50
grep -rn "interface \w\+ {" --include="*.tsx" app/ components/ | head -50
```

If a type is used across multiple files, extract it to `lib/types/`. If it's used only in one file, keep it inline.

### 4.3 Check for Duplicate Type Names

```bash
grep -rn "^export type \|^export interface " --include="*.ts" --include="*.tsx" app/ components/ lib/ hooks/ | sort -t: -k3 | uniq -f2 -D
```

If the same type name is exported from multiple files, consolidate into one canonical location.

---

## Phase 5: Function Return Type Audit

### 5.1 Public Library Functions

All exported functions in `lib/` should have explicit return types. This makes the API contract clear and catches accidental changes.

```bash
grep -rn "^export function\|^export async function\|^export const .* = (" --include="*.ts" lib/
```

For each function without an explicit return type, add one.

### 5.2 Server Actions

All server actions in `app/actions/` should have explicit return types. This is especially important because server actions cross the network boundary.

```bash
grep -rn "^export async function\|^export const .* = async" --include="*.ts" app/actions/
```

---

## Phase 6: TSConfig Cleanup

### 6.1 Verify Excludes

Check that every path in `tsconfig.json` `exclude` array corresponds to a real folder:
- `node_modules` — exists (always)
- `.next` — exists (build output)
- `scripts` — exists
- `vitest.config.ts` — exists (file)
- `__tests__` — exists
- `e2e` — exists
- `test` — exists
- `playwright-report` — exists
- `test-results` — may or may not exist
- `supabase/functions` — exists
- `inspiration` — **verify if this folder exists. If not, remove from excludes.**
- `temp-tradesphere-audit` — **verify if this folder exists. If not, remove from excludes.**
- `refactor` — **verify if this folder exists. If not, remove from excludes.**
- `shadcn-tailwind-v4-ecommerce-ui-guide` — **may be deleted by dead-code.md task. If deleted, remove from excludes.**
- `docs/archive` — **may be deleted by dead-code.md task. If deleted, remove from excludes.**

### 6.2 Verify Compiler Options

The current config is strict. Verify these settings are present and keep them:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `noImplicitOverride: true`
- `exactOptionalPropertyTypes: true`

---

## Verification

After all changes:

```bash
pnpm -s typecheck    # Must pass with zero errors
pnpm -s lint         # Must pass
pnpm -s ts:gate      # Must pass (TS safety gate script)
pnpm -s test:unit    # Must pass
```

---

## Completion Criteria

- Zero `@ts-nocheck` directives in runtime code (`app/`, `components/`, `lib/`, `hooks/`)
- Zero `@ts-ignore` directives in runtime code
- Zero untyped `any` in runtime code (excluding auto-generated files like `database.types.ts`)
- Zero `as any` casts in runtime code
- All `lib/` exported functions have explicit return types
- All server actions have explicit return types
- `tsconfig.json` excludes reference only existing paths
- `pnpm -s typecheck` and `pnpm -s ts:gate` pass cleanly
