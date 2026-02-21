# Phase E — Utility Consolidation

> **Scope:** Merge scattered lib/ modules that serve the same purpose.
> **Read `refactor/shared-rules.md` first.**

---

## Target 1: Price Utilities (3 files → 1)

**Read:**
- `lib/price-formatting.ts` (58 L) — core formatting
- `lib/currency.ts` (55 L) — re-exports from price-formatting + adds wrapper
- `lib/format-price.ts` (92 L) — re-exports from price-formatting + different wrapper

### Problem
`formatPrice` is defined in BOTH `currency.ts` and `format-price.ts` with different signatures.
Both proxy through `price-formatting.ts`. Three files to do one job.

### Solution
1. Read all three completely
2. Read all consumers: `grep -rn "from.*currency\|from.*format-price\|from.*price-formatting" app/ components/ lib/ --include="*.ts" --include="*.tsx"`
3. Merge into a single `lib/price.ts`
4. Export all needed functions from one place
5. Update all imports
6. Delete the old files

**Expected reduction:** ~90 lines

## Target 2: Logger (2 files → 1)

**Read:**
- `lib/structured-log.ts` (77 L) — `logEvent()`, `logError()` with JSON + redaction
- `lib/logger.ts` (23 L) — thin wrapper adding `logger.debug/info/warn/error`

### Problem
Half the codebase imports `logger`, half imports `structured-log` directly. The wrapper adds almost nothing.

### Solution
1. Read both files
2. Count consumers of each: `grep -rn "from.*logger\|from.*structured-log" app/ components/ lib/ --include="*.ts" --include="*.tsx"`
3. Merge into `lib/logger.ts` (keep the better name)
4. Update all imports
5. Delete `structured-log.ts`

**Expected reduction:** ~20 lines

## Target 3: Search Products (2 files → 1)

**Read:**
- `app/[locale]/(main)/search/_lib/search-products.ts` (~215 L)
- `app/[locale]/(main)/categories/[slug]/_lib/search-products.ts` (~157 L)

### Problem
Two separate `search-products.ts` files with overlapping Supabase query logic.

### Solution
1. Read both completely
2. Identify the shared query logic vs. route-specific differences
3. If substantially the same → extract shared logic to `lib/data/search-products.ts`
4. If different enough → at minimum extract the shared Supabase query builder
5. Update both routes to use the shared version

**Expected reduction:** ~100 lines

## Target 4: Misc lib/ deduplication

### Check for these overlaps:
```bash
# Image utilities — are these all needed?
grep -rn "from.*image-utils\|from.*image-compression\|from.*normalize-image-url" app/ components/ --include="*.tsx" --include="*.ts"
```

- `lib/image-utils.ts` — image URL utilities
- `lib/image-compression.ts` — client-side compression
- `lib/normalize-image-url.ts` — URL normalization

If `normalize-image-url.ts` does one thing that `image-utils.ts` also does → merge. If they serve distinct purposes → keep.

### Check for unused lib/ files:
```bash
# For each file in lib/, check if it has any external imports
for f in lib/*.ts; do
  count=$(grep -rn "$(basename $f .ts)" app/ components/ hooks/ --include="*.ts" --include="*.tsx" -l 2>/dev/null | wc -l)
  if [ "$count" -eq 0 ]; then echo "UNUSED: $f"; fi
done
```

## Verification

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

## Output

Log in `refactor/lean-sweep/extractions.md`:
- Files merged (old paths → new path)
- Imports updated (count)
- Files deleted (list)
- Lines removed (total)
