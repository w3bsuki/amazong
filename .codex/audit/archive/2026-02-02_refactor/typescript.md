# TypeScript Issues Audit

> Audit Date: 2026-02-02 | Auditor: spec-typescript | Status: ✅ Complete

---

## Summary

**Type Safety Score: 85/100** — Good overall, with isolated issues in specific files.

| Category | Count | Severity |
|----------|-------|----------|
| Explicit `any` | 8 | 🔴 High |
| `as any` casts | 12 | 🔴 High |
| `as unknown as T` | 28 | 🟠 Medium |
| `@ts-ignore` | 1 | 🔴 High |
| Non-null assertions | 7 | 🟠 Medium |

---

## High Priority (Phase 2)

### Explicit `any` Usage

| Path:Line | Current | Suggested Fix |
|-----------|---------|---------------|
| `app/[locale]/(main)/categories/[categorySlug]/page.tsx` | 4 `any` parameters | Derive types from `getCategoryContext` |
| `app/[locale]/(account)/account/inventory/page.tsx` | `(product as any).variant_count` | Extend Product type |
| Various API routes | `any` in request parsing | Use Zod schemas |

### `@ts-ignore` Comments

| Path:Line | Issue | Fix |
|-----------|-------|-----|
| Edge Function | `.overlaps()` method | Add proper types or use alternative method |

---

## Medium Priority (Phase 3)

### `as unknown as T` Casts

**Pattern:** Supabase data layer relies heavily on double-casting

```typescript
const data = result.data as unknown as Product[]
```

**Locations:** 28 occurrences across `lib/data/*.ts`

**Fix:** Create typed query helpers:
```typescript
// lib/supabase/typed-queries.ts
export async function typedSelect<T>(
  query: PostgrestFilterBuilder
): Promise<T[]> {
  const { data, error } = await query;
  if (error) throw error;
  return data as T[];
}
```

### Non-null Assertions

| Path | Usage | Risk |
|------|-------|------|
| Various | `user!.id` | Generally safe (after auth check) |
| Form handlers | `formData.get('field')!` | Should use null coalescing |

---

## Low Priority (Phase 4)

### Missing Type-Only Imports

Some files use regular imports for types:
```typescript
// Current
import { User } from '@supabase/supabase-js';

// Should be
import type { User } from '@supabase/supabase-js';
```

---

## tsconfig.json Assessment

**Status:** ✅ Well-configured

- `strict: true` ✅
- `noImplicitAny: true` ✅
- `strictNullChecks: true` ✅

---

## Recommended Actions

1. **Phase 2:** Fix explicit `any` in categories page
2. **Phase 2:** Remove single `@ts-ignore`
3. **Phase 3:** Create typed Supabase query helpers
4. **Phase 4:** Audit and fix `import type` usage

---

*Generated: 2026-02-02*
