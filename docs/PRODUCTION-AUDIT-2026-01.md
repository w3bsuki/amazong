# Production Readiness Audit (Top 10)

Generated: 2026-01-07
Scope: UI/UX polish and design-system conformance.

## Top Issues

1) Gradients still present (13 violations) — RESOLVED
- Status: Searched flagged files; no gradient classes or inline gradients remain. Run tailwind palette/gradient scan to confirm 0.

2) Arbitrary Tailwind values backlog (189 cases)
- Top offenders: app/[locale]/(business)/_components/products-table.tsx; app/[locale]/(chat)/chat/loading.tsx; components/layout/sidebar/sidebar.tsx; components/pricing/plan-card.tsx; components/layout/sidebar/sidebar-menu.tsx; components/ui/drawer.tsx.
- Risk: Inconsistent sizing; harder theming; bundle bloat.
- Action: Swap to tokens (container widths, touch heights, text-2xs/text-sm, gap-2/gap-3) using reference in cleanup/DESIGN-SYSTEM-STATUS.md. Target <20.

3) Typography audit not executed (Agent-1)
- Symptom: Mixed font sizes/weights on sell/account/plans/product pages; badges using ad-hoc sizes.
- Risk: Visual noise, accessibility text hierarchy issues.
- Action: Apply typography scale (text-2xs/xs/sm/base, font-medium/semibold) from AGENT-1-TYPOGRAPHY-AUDIT.md. Prioritize: forms in app/[locale]/(sell)/**, account dashboard, pricing cards.

4) Spacing/layout audit not executed (Agent-2)
- Symptom: Non-token gaps/padding, inconsistent touch targets in forms/nav/sidebar/cart.
- Risk: Tap target failures; uneven density on mobile.
- Action: Normalize to gap-2 (mobile) / gap-3 (desktop), p-2/p-3 cards, min-h-touch* utilities; replace ad-hoc widths with container tokens. Focus: /sell form stack, account pages, product grid, cart.

5) Dark mode parity not 100%
- Status: ~95% parity; minor gaps per cleanup/DESIGN-SYSTEM-STATUS.md (canvas/surface/order tokens inheriting refs).
- Risk: Edge cases with unreadable text/backgrounds; potential snapshot diffs.
- Action: Audit remaining pages with dark theme toggled; add explicit dark tokens where inheritance causes low contrast.

6) Tailwind palette/gradient scanner noisy
- Source: TASK-tighten-tailwind-scan-false-positives.md; current script over-reports.
- Risk: Alert fatigue; harder to spot real violations.
- Action: Refine scripts/scan-tailwind-palette.mjs to ignore template literals and allowed tokens; rebaseline reports.

7) Chat mobile regressions
- Source: TASK-fix-chat-mobile-scroll-and-avatars.md.
- Symptoms: Scroll containment issues; broken avatars on mobile.
- Risk: Core feature reliability hit on mobile buyers/sellers.
- Action: Fix scroll container sizing (likely overflow-y), avatar sizing; verify on 375px viewport via Playwright smoke.

## Verification Gates (post-fix)
- pnpm -s exec tsc -p tsconfig.json --noEmit
- REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
*** End Patch
