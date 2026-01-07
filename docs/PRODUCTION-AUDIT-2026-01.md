# Production Readiness Audit (Top 10)

Generated: 2026-01-07
Scope: UI/UX polish, Supabase security/perf, tooling reliability.

## Top Issues

1) Gradients still present (13 violations)
- Files: app/[locale]/(main)/wishlist/_components/wishlist-page-client.tsx; components/ui/toast.tsx; app/[locale]/(main)/page.tsx; app/[locale]/(main)/wishlist/shared/[token]/page.tsx; app/[locale]/(main)/wishlist/[token]/page.tsx; app/[locale]/(sell)/_components/layouts/desktop-layout.tsx; components/layout/cookie-consent.tsx; components/sections/start-selling-banner.tsx; components/shared/filters/mobile-filters.tsx.
- Risk: Fails design rules; visual inconsistency; extra CSS output.
- Action: Replace with semantic solids (bg-primary, bg-cta-trust-blue, bg-brand) per cleanup/DESIGN-SYSTEM-STATUS.md.

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

6) Supabase leaked-password protection not enabled
- Source: TASK-enable-leaked-password-protection.md.
- Risk: Auth security gap; fails security gate P0.
- Action: Enable leaked-password protection in Supabase dashboard; document acceptance if deferred.

7) Supabase security/performance advisors not part of CI cadence
- Current: Manual MCP commands only (docs/supabase_tasks.md). Unused indexes list is stale.
- Risk: Drift between db and app; missed RLS/security regressions.
- Action: Schedule MCP runs weekly; capture advisories; decide keep/drop unused indexes post-launch after idx_scan check.

8) Playwright dev server port conflicts
- Source: TASK-e2e-auto-pick-free-port.md; current config pins port 3000.
- Risk: CI flakiness when port busy; local collisions.
- Action: Update playwright.config.ts to auto-pick free port or reuse existing server reliably; align scripts/run-playwright.mjs.

9) Tailwind palette/gradient scanner noisy
- Source: TASK-tighten-tailwind-scan-false-positives.md; current script over-reports.
- Risk: Alert fatigue; harder to spot real violations.
- Action: Refine scripts/scan-tailwind-palette.mjs to ignore template literals and allowed tokens; rebaseline reports.

10) Chat mobile regressions
- Source: TASK-fix-chat-mobile-scroll-and-avatars.md.
- Symptoms: Scroll containment issues; broken avatars on mobile.
- Risk: Core feature reliability hit on mobile buyers/sellers.
- Action: Fix scroll container sizing (likely overflow-y), avatar sizing; verify on 375px viewport via Playwright smoke.

## Verification Gates (post-fix)
- pnpm -s exec tsc -p tsconfig.json --noEmit
- REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
- For Supabase changes: rerun mcp_supabase_get_advisors security/performance.
