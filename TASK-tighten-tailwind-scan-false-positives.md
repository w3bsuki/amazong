# TASK: tighten-tailwind-scan-false-positives

Created: 2026-01-07
Lane: Repo/Tooling (Tailwind)
Phase: 2
Status: PENDING

## Objective
Reduce false positives in the Tailwind palette/gradient scan so it stops flagging `tailwindcss-animate` direction classes like `slide-in-from-*` and `slide-out-to-*` as “gradients”.

## Context
- `pnpm -s exec node scripts/scan-tailwind-palette.mjs` currently reports “gradient” matches in files that do not contain actual gradient utilities.
- Known false positive patterns:
  - `slide-in-from-*`, `slide-out-to-*` (tailwindcss-animate)
  - other non-gradient uses of `from-`/`to-` in classnames or comments

## Tasks
- [ ] Update the scan logic to detect actual gradients more precisely:
  - Prefer matching `bg-gradient-to-*` or `from-*`/`to-*` only when used together in a probable gradient cluster
  - Explicitly ignore known animation patterns (at least `slide-in-from-` and `slide-out-to-`)
  - Done when: scan output no longer lists `components/ui/toast.tsx`, `components/layout/cookie-consent.tsx`, or sell layout files purely due to animation classes.

- [ ] Keep the scan strict for real gradients:
  - Done when: introducing a real `bg-gradient-to-r from-* to-*` in a test file triggers the scan.

## Files to touch
- `scripts/scan-tailwind-palette.mjs`
- (optional) `cleanup/palette-scan-report.txt` is generated output; do not hand-edit it.

## Gates
- [ ] `pnpm -s exec node scripts/scan-tailwind-palette.mjs` (manual check)

## Handoff (Opus)
Files changed:
How to verify:
Gates output:
Questions:
