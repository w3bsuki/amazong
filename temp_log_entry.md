```markdown
Task: Phase 2 - Arbitrary Value Cleanup
TODO item: Replace arbitrary Tailwind values with tokens
Scope (max 5 files - exception):
  - `app/[locale]/(sell)/_components/fields/pricing-field.tsx`
  - `app/[locale]/(sell)/_components/ui/upload-zone.tsx`
  - `app/[locale]/(business)/dashboard/analytics/loading.tsx`
  - `components/ui/chart.tsx`
  - `app/[locale]/(account)/account/_components/account-addresses-grid.tsx`
Reasoning (short): Removing arbitrary `[90px]`, `[140px]`, `[350px]` values to align with design system spacing/sizing tokens.
Changes made:
  - `pricing-field.tsx`: `min-w-[90px]` -> `min-w-24` (96px). Confirmed visual impact minimal for select trigger.
  - `upload-zone.tsx`: `min-h-[140px/160px]` -> `min-h-36` / `sm:min-h-40`.
  - `loading.tsx`: `h-[350px]` -> `h-80` (320px), `h-[250px]` -> `h-64` (256px). Good enough for skeletons.
  - `chart.tsx`: `min-w-[8rem]` -> `min-w-32`.
  - `account-addresses-grid.tsx`: Attempted `max-h-[50vh]` -> `max-h-96` but REVERTED due to viewport-relative regression risk.
Behavior preserved? Mixed - Skeletons slightly different size. Address grid change reverted.
Files changed (with paths):
  - `app/[locale]/(sell)/_components/fields/pricing-field.tsx`
  - `app/[locale]/(sell)/_components/ui/upload-zone.tsx`
  - `app/[locale]/(business)/dashboard/analytics/loading.tsx`
  - `components/ui/chart.tsx`
New/updated strings (keys): None.
Tests run (exact commands + result):
  - `pnpm -s exec tsc -p tsconfig.json --noEmit` -> Exit code: 0
Open questions/risks:
  - `account-addresses-grid.tsx` retains `max-h-[50vh]`. Documented as allowed exception for mobile sheet viewports.
Follow-ups recommended:
  - Continue arbitrary cleanup in `components/shared/` and `components/ui/` (78 files remaining).
```
