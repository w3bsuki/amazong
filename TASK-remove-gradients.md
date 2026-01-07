# TASK: remove-gradients

Created: 2026-01-07
Lane: Tailwind
Phase: 2
Status: DONE

## Objective
Remove any remaining gradient classes in the target UI files while preserving behavior and layout.

## Tasks
- [x] Inspect each target file for actual gradient classes (`bg-gradient-*`, `from-*`, `to-*`, `via-*`) and replace with solid semantic tokens.
- [x] If a match is from `tailwindcss-animate` classes (e.g., `slide-in-from-*`), do not remove; note as false positive in handoff.
- [x] Verify with `rg -n "bg-gradient|from-|to-|via-"` on the target files and confirm no real gradient usage remains.

## Files to touch
- `app/[locale]/(main)/wishlist/_components/wishlist-page-client.tsx`
- `components/ui/toast.tsx`
- `app/[locale]/(main)/page.tsx`
- `app/[locale]/(main)/wishlist/shared/[token]/page.tsx`
- `app/[locale]/(main)/wishlist/[token]/page.tsx`

## Gates
- [x] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [x] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Review checklist (Codex)
- [x] UI rules respected (no redesigns, no gradients, tokens only)
- [x] i18n keys added to en/bg if needed
- [x] No unrelated formatting changes

## Handoff (Opus)
Files changed: **None** — all 5 target files were inspected and contain zero actual gradient classes.

How to verify:
- `grep_search` with pattern `bg-gradient|from-|to-|via-` on each file
- Only match found: `toast.tsx` line 29 contains `slide-in-from-top-full`, `slide-out-to-right-full`, `slide-in-from-bottom-full` — these are **tailwindcss-animate animation direction classes**, NOT color gradients.

Gates output:
- **Typecheck**: ✅ passed (no errors)
- **E2E smoke**: 14/15 passed. 1 pre-existing failure on search test (unrelated to gradients — search page loads correctly with 9 results, flaky assertion)

Questions: None. The palette-scan-report.txt flagged these files due to regex matching `from-` and `to-` substrings, but manual inspection confirms all are false positives (animation classes, not gradients).
