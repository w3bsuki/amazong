# Phase 04 - i18n and TypeScript Hardening

## Objective

Reduce locale and typing debt while preserving user-visible behavior.

## Context7 docs used (date + links)

- Date: 2026-02-07
- https://github.com/vercel/next.js/blob/v16.1.5/docs/01-app/01-getting-started/09-caching-and-revalidating.mdx

## Checklist

- [x] Kept moved/edited UI paths on `next-intl` usage patterns where applicable.
- [x] Reduced inline locale branching in touched files to existing formatting/content differences only.
- [x] Removed targeted unsafe casts (`as any`) in inventory hot path.
- [x] Removed targeted non-null assertions in order/timeline/status/avatar touched paths.
- [x] Reduced high-signal warnings in touched files (`no-unsafe-argument`, `react-hooks/exhaustive-deps`, `sonarjs/no-nested-template-literals`, `sonarjs/no-duplicate-string`).
- [x] Maintained i18n parity (`__tests__/i18n-messages-parity.test.ts` passes in `pnpm -s test:unit`).
- [x] Ran full gates and recorded output in Phase 06.

## Files touched

- `app/[locale]/(business)/dashboard/inventory/page.tsx` (removed `as any`, extracted typed helper)
- `app/[locale]/(account)/account/orders/[id]/_components/order-timeline.tsx` (removed non-null assertion usage)
- `app/[locale]/(business)/_components/order-detail-view.tsx` (removed non-null assertion usage)
- `app/[locale]/(sell)/sell/orders/_components/order-status-actions.tsx` (removed non-null assertion usage)
- `lib/avatar-palettes.ts` (removed non-null assertion usage)
- `components/shared/charts/chart-area-interactive.tsx` (safe date formatting helper for tooltip/ticks)
- `app/[locale]/(account)/account/_components/plans-modal.tsx` (typed API response guard, callback deps)
- `app/[locale]/(account)/account/plans/plans-content.tsx` (import boundary cleanup)
- `components/mobile/mobile-tab-bar.tsx` (duplicate/nested-template warning reductions)
- `components/layout/cookie-consent.tsx` (control-flow cleanup and lint-safe effect)
- `e2e/mobile-responsiveness.spec.ts` (spread over `Array.from`)

## Verification output

- `pnpm -s typecheck` -> pass
- `pnpm -s lint` -> pass with warnings (no errors)
- `node scripts/ts-safety-gate.mjs` -> `[ts:gate] OK (0 findings; baseline enforced)`

## Decision log

- Preserved auth/payment behavior; changes are type-safety and UI-contract hardening only.
- Chose strict runtime guards for modal plan payloads rather than unchecked assertions.
- Kept repo-wide warning backlog out of scope; fixed targeted classes in touched files.

## Done

- [x] Phase 04 complete
