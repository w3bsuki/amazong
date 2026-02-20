# Tailwind CSS v4 Audit + Refactor — Report

Completed: 2026-02-20

## Findings

- Repo is CSS-first (Tailwind v4): no `tailwind.config.*` present; styling gates (`pnpm -s styles:gate`) already enforce semantic token contract.
- `app/legacy-vars.css` is imported by `app/globals.css` but appears to contain many stale/unused custom properties (recommended cleanup after confirming no dynamic usage).
- `app/utilities.css` contained two dead utilities (`.shadow-card`, `.promoted-glow`) with no callsites.

## Changes Made

- Removed unused utilities from `app/utilities.css` (`.shadow-card`, `.promoted-glow`) to reduce CSS bloat without affecting UI.

## What Was NOT Changed (and why)

- No token palette/arbitrary/gradient refactors were needed because `styles:gate` already passes.
- No UI/UX styling/layout changes (pixel parity preserved).

## Recommendations

- Prune/archival pass for `app/legacy-vars.css`: remove truly-unused vars or move reference-only values into docs to keep shipped CSS lean.
- Keep `styles:gate` as the enforcement mechanism (mechanical over manual review).

