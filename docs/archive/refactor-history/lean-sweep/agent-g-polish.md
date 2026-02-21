# Phase G — Final Polish

> **Scope:** CSS cleanup, missing metadata, remaining oversized file splits.
> **Read `refactor/shared-rules.md` first.**
> **For CSS work, also read `docs/DESIGN.md` and `app/globals.css`.**

---

## Step 1: Add missing metadata

```bash
grep -rL "generateMetadata\|export const metadata" app/[locale]/**/page.tsx 2>/dev/null
```

For pages missing metadata, add:
```tsx
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Page Title — Treido",
    description: "Brief description.",
  }
}
```

For dynamic pages (`[productSlug]`, `[id]`, `[username]`), use params:
```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params
  return { title: `${productName} — Treido` }
}
```

**Skip:** admin pages, internal tools.

## Step 2: CSS cleanup

### Run style gates:
```bash
pnpm -s styles:gate
```
Fix every violation.

### Audit inline styles:
```bash
grep -rn "style={{" app/ components/ --include="*.tsx"
```
Convert to Tailwind where possible. Keep truly dynamic values.

### Audit `!important`:
```bash
grep -rn "!important" app/ components/ --include="*.tsx" --include="*.css"
```
Remove unless overriding third-party library styles.

## Step 3: Split remaining oversized files

After phases A-F, check which files are still >300 lines:

```powershell
Get-ChildItem -Recurse -Include *.tsx,*.ts -LiteralPath app,components,lib,hooks |
  ForEach-Object { $lc = (Get-Content -LiteralPath $_.FullName | Measure-Object -Line).Lines; if ($lc -gt 300) { "$lc`t$($_.FullName)" } } |
  Sort-Object -Descending
```

**Skip these (intentionally large):**
- `lib/supabase/database.types.ts` — auto-generated
- `app/api/admin/docs/seed/templates.ts` — data file

**Split candidates by pattern:**
- Types → extract to colocated `types.ts`
- Sub-components → extract to own files
- Utility functions → extract to colocated `utils.ts`
- Constants/config → extract to `constants.ts`

**Don't split** files that are cohesive — a 320-line component that's one well-structured piece is fine.

## Step 4: Error boundary coverage

```bash
# Check which route groups have error.tsx
Get-ChildItem -Recurse -Filter error.tsx -LiteralPath "app\[locale]" | Select-Object DirectoryName
```

Every user-facing route group should have an `error.tsx`. Create missing ones:
```tsx
"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <button onClick={reset} className="text-primary underline">Try again</button>
    </div>
  )
}
```

## Step 5: i18n parity check

```bash
pnpm -s test:unit -- -t "i18n"
```

If keys are missing:
- Missing in `bg.json` → add with `[BG] ` prefix (placeholder for human translation)
- Missing in `en.json` → add
- Extra in one → dead translation, remove

## Verification

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

Then final build:
```bash
pnpm build 2>&1 | tee build-lean-sweep.txt
```

Compare with `build-baseline.txt` for before/after metrics.

## Output

Log final metrics in `refactor/tasks.md`:
- Files, LOC, "use client" count, >300L count, clone %, bundle sizes
- Before/after comparison
