# Issues / Deferred (triage)

## 2026-02-01

- TW4: remove container-query arbitrary threshold `@[250px]/card:*` (widespread)
  - Evidence: `app/[locale]/(admin)/_components/admin-stats-cards.tsx:46` and many other occurrences (see `rg -n "@\\[250px\\]"`).
  - Rationale: fixing properly likely requires a tokenized container breakpoint strategy; avoid broad UI churn in this round.

- TW4: `components/ui/switch.tsx` uses CSS-var class `h-(--switch-h)` (token rail question)
  - Evidence: `components/ui/switch.tsx:16` (per TW4 audit).
  - Rationale: needs an agreed token-safe pattern (CSS-first token or component-level styles) to avoid regressions.

- SHADCN: shared composites use raw controls instead of primitives (medium)
  - Evidence: `components/shared/filters/filter-list.tsx:67` (raw `<input>`), `components/shared/filters/filter-list.tsx:93` (raw `<button>`), `components/shared/dropdown-product-item.tsx:62` (raw `<button>`).
  - Rationale: some of these are intentional for custom UX; revisit as part of a focused “controls standardization” pass.

- NEXTJS/boundaries: `no-restricted-imports` warnings in route code + Storybook config
  - Evidence: `.storybook/preview.tsx:15` (imports `../app/globals.css`), `app/[locale]/(account)/account/billing/page.tsx:5` (imports `@/app/actions/subscriptions`).
  - Rationale: warnings are non-blocking; likely needs rule scoping/tuning rather than per-file workarounds.

