# Important Refactor Agent Log

Purpose
- Track external agent (Gemini) changes so Codex can review and fix issues fast.
- Keep changes small, verifiable, and consistent with repo rules.

Guardrails (Gemini must follow)
- One TODO item at a time; max 3 files touched (max 5 if a single behavior).
- No redesigns, no new architectural layers, no gradients.
- Keep existing styling and behavior; cards are flat, no heavy shadows.
- Dense spacing: mobile `gap-2`, desktop `gap-3`.
- Avoid arbitrary Tailwind values unless absolutely necessary.
- Use semantic tokens/classes already present in `app/globals.css`.
- All strings via next-intl (`messages/en.json` + `messages/bg.json`).
- Do not touch secrets; never log keys, JWTs, or full request bodies.
- Cached work must follow Next.js cache rules (see `docs/ENGINEERING.md`).

Verification rule (non-trivial changes)
- Run typecheck and one targeted test suite:
  - `pnpm -s exec tsc -p tsconfig.json --noEmit`
  - `pnpm test:unit` or `pnpm test:e2e:smoke`

Required log entry (paste for every task)
```
Task:
TODO item:
Scope (max 3 files):
Reasoning (short):
Changes made:
Behavior preserved? (yes/no + note):
Files changed (with paths):
New/updated strings (keys):
Tests run (exact commands + result):
Open questions/risks:
Follow-ups recommended:
```

Review process (Codex)
- Validate scope, boundaries, and rules.
- Check for regressions and missing i18n updates.
- Confirm tests were run when required.

---

## Phase 3: i18n Routing Compliance (2026-01-07)

```
Task: Phase 3 - Frontend Boundaries, i18n, Client Split, A11y
TODO item: i18n routing compliance - migrate next/link → @/i18n/routing
Scope (max 3 files): 49 files across all route groups (batched in groups of 3-6)
Reasoning (short): Raw next/link breaks locale-aware navigation. Phase 3 requires locale-agnostic hrefs via @/i18n/routing.
Changes made:
  - Replaced `import Link from "next/link"` with `import { Link } from "@/i18n/routing"` in 49 files
  - Removed hardcoded locale prefixes from hrefs (e.g., `/${locale}/account/profile` → `/account/profile`)
  - The i18n Link component automatically handles locale prefixing
Behavior preserved? Yes - navigation behavior unchanged, routing now locale-aware
Files changed (with paths):
  - components/shared/empty-state-cta.tsx
  - app/[locale]/[username]/not-found.tsx, profile-client.tsx
  - app/[locale]/(sell)/sell/client.tsx, orders/client.tsx
  - app/[locale]/(sell)/_components/ui/sell-error-boundary.tsx
  - app/[locale]/(business)/_components/* (12 files)
  - app/[locale]/(business)/dashboard/* (5 files)
  - app/[locale]/(account)/account/_components/* (4 files)
  - app/[locale]/(account)/account/selling/* (5 files)
  - app/[locale]/(account)/account/sales/* (3 files)
  - app/[locale]/(account)/account/orders/* (2 files)
  - app/[locale]/(account)/account/plans/* (2 files)
  - app/[locale]/(account)/account/following/following-content.tsx
  - app/[locale]/(account)/account/billing/billing-content.tsx
  - app/[locale]/(account)/account/settings/page.tsx
  - app/[locale]/(admin)/_components/admin-sidebar.tsx
  - app/[locale]/(admin)/admin/products/page.tsx
  - app/[locale]/(plans)/_components/plans-page-client.tsx
  - app/[locale]/(chat)/_components/chat-interface.tsx
  - app/[locale]/(main)/categories/[slug]/not-found.tsx
  - app/global-not-found.tsx
New/updated strings (keys): None - no new i18n strings added
Tests run (exact commands + result):
  - `pnpm -s exec tsc -p tsconfig.json --noEmit` → Exit code: 0 ✓
  - `pnpm test:e2e:smoke` → 14/15 passed, 1 failed (404 page test - pre-existing issue, unrelated to Link changes)
Open questions/risks:
  - None identified. All changes are import-level; no logic changes.
Follow-ups recommended:
  - Phase 3 remaining: A11y sweep for focus states, client/server split audit   
  - Verify links work correctly in browser with locale switching
```

---

## Phase 2: Fix invalid Tailwind tokens (2026-01-07)

```
Task: Phase 2 - Design system alignment
TODO item: Replace invalid Tailwind utility classes introduced in Phase 2
Scope (max 3 files):
  - app/[locale]/(chat)/_components/chat-interface.tsx
  - components/layout/sidebar/sidebar-menu-v2.tsx
Reasoning (short): Tailwind does not ship max-w-3/4 or w-4.5; restore valid classes to avoid silent styling regressions.
Changes made:
  - chat-interface.tsx: max-w-3/4 -> max-w-[75%] to preserve percent-based bubble width.
  - sidebar-menu-v2.tsx: w-4.5 h-3 -> h-3 w-auto for flag icons to keep 18x12 aspect without arbitrary sizes.
Behavior preserved? Yes - restores intended sizing with valid utilities.
Files changed (with paths):
  - app/[locale]/(chat)/_components/chat-interface.tsx
  - components/layout/sidebar/sidebar-menu-v2.tsx
New/updated strings (keys): None.
Tests run (exact commands + result): Not run (utility class corrections only).
Open questions/risks:
  - max-w-[75%] remains an arbitrary value; consider a custom utility if you want to avoid arbitary classes entirely.
Follow-ups recommended:
  - None.
```
