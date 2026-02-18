# Domain 7 — Cross-Cutting Sweep + Final Report

> **Scope:** Route hygiene, CSS cleanup, dead code final pass, duplicate audit, full build, final report.
> **Read `refactor/shared-rules.md` first.**
> **This is the last task. Run it comprehensively.**

---

## Step 1: Route hygiene

### Missing metadata (53 pages):
```bash
# Find pages without metadata
Get-ChildItem -Recurse -Filter page.tsx -LiteralPath "app\[locale]" | ForEach-Object {
  $content = Get-Content -LiteralPath $_.FullName -Raw
  if ($content -notmatch "generateMetadata|export const metadata") {
    Write-Host $_.FullName.Replace("J:\amazong\","")
  }
}
```
Add `generateMetadata` to every user-facing page missing it. Skip admin/internal pages.

### Missing error boundaries:
```bash
Get-ChildItem -Recurse -Filter error.tsx -LiteralPath "app\[locale]" | Select-Object DirectoryName
```
Every user-facing route group should have `error.tsx`.

## Step 2: CSS cleanup

```bash
pnpm -s styles:gate
```
Fix every violation. Then:
- Audit inline `style={{` for Tailwind conversion opportunities
- Audit `!important` usage — remove unless overriding third-party

## Step 3: Dead code final pass

```bash
pnpm -s exec knip --reporter compact
```
Remove everything knip flags. Grep-verify before deleting.

## Step 4: Duplicate final audit

```bash
pnpm -s dupes
```
Document remaining duplicates. If any are actionable (>50L duplicate blocks), consolidate.

## Step 5: "use client" final sweep

```bash
pnpm -s architecture:scan
```
If `"use client"` count is still >120, do another targeted pass:
- List all "use client" files
- For each: does it use useState/useEffect/useRef/event handlers/browser APIs?
- If no → remove "use client"

## Step 6: i18n parity

```bash
pnpm -s test:unit -- -t "i18n"
```
Fix any key mismatches between `en.json` and `bg.json`.

## Step 7: Full build

```bash
pnpm build 2>&1 | tee build-final.txt
```
Must succeed with zero errors. Compare with `build-baseline.txt`.

## Step 8: Generate final report

Create `refactor/FINAL-REPORT.md`:

```markdown
# Refactor Program — Final Report

## Metrics: Before → After

| Metric | Baseline | Final | Change |
|--------|----------|-------|--------|
| Source files | 762 | ? | ? |
| LOC | ~48K | ? | ? |
| "use client" | 357 | ? | ? |
| >300L files | 125 | ? | ? |
| >500L files | 44 | ? | ? |
| Tiny <50L files | ? | ? | ? |
| Missing metadata | 58 | ? | ? |
| Clone % | 3.06% | ? | ? |

## Changes by Domain
[Summary of what changed in each domain task]

## What Wasn't Touched (and why)
- Auth internals (lib/auth/) — high risk, needs human review
- Webhook handlers — high risk
- DB schema/migrations — out of scope
- database.types.ts — auto-generated

## Remaining Technical Debt
[Items flagged but not addressed]

## Auth/Payment Audit Findings
[Key findings from domain 6 audit-only items]
```

## Step 9: Update all trackers

- Mark all tasks complete in `refactor/CURRENT.md`
- Update metrics tables to final values
- Append final session entry to `refactor/log.md`

## Verification

Full suite:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit && pnpm build
```
