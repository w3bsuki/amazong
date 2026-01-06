# Frontend Tasks (Execution Queue)

Owner: Frontend agent(s)

This is the day-to-day queue for frontend work. The overall go-live checklist remains `tasks.md`.

Read first: `docs/workflow.md`, `docs/frontend.md`, `docs/DESIGN.md`, `docs/ENGINEERING.md`.

## P0: Start here (today)

- [x] Run Playwright MCP audit on P0 flows (mobile 390x844 + desktop 1440x900) and write findings into the next section
- [ ] Fix the single ugliest high-traffic surface first (1-3 files), then run `tsc` + `e2e:smoke` and log the batch in `tasks.md`
- [x] Home promo cards: eager-load the first promo image (LCP warning reduction)
- [ ] Product pages i18n sweep: replace hardcoded strings, add missing keys to `messages/en.json` + `messages/bg.json`, and verify `/en` + `/bg` parity
- [ ] `/plans` UX fix: reproduce why plan checkout/creation doesn't work, identify whether it's UI state/validation vs server/action failure, and file a P0 batch

## P0 audit findings (fill this in)

For each issue:
- Surface (URL + viewport)
- What’s wrong (token drift/spacing/typography/touch targets/IA)
- Candidate files (from scan reports first)
- “Done when” acceptance criteria

### Findings (Jan 6, 2026)

- Surface: `http://localhost:3000/en` @ 390x844
	- What’s wrong: hero area feels “off-token” vs the rest of the app (palette drift hotspot from scan). This is likely where the first impression consistency breaks.
	- Candidate files: `components/desktop/marketplace-hero.tsx`
	- Done when: hero uses semantic tokens only (no palette classes), dense spacing (`gap-2/3`), flat cards (`border`, `rounded-md`), and typography aligns with `docs/DESIGN.md`.

- Surface: `http://localhost:3000/en/search` @ 390x844 + 1440x900
	- What’s wrong: product surfaces are the “golden component” area — any drift here multiplies across search/home/category grids. Scan-driven next target.
	- Candidate files: `components/shared/product/product-card.tsx`
	- Done when: product card uses tokens only, no arbitrary values, consistent title/price/meta hierarchy, predictable touch targets, and no non-essential motion.

- Surface: `http://localhost:3000/en/tech_haven/office-suite-license` (product page) @ 390x844 + 1440x900
	- What’s wrong: visible hardcoded English strings on the page (e.g. “Key Details”, “Description”, “Shipping & Returns”, “Buyer Protection”, “Write a Review”), and currency/price formatting feels cramped (“BGN 99.99incl. VAT”).
	- Candidate files: `app/[locale]/[username]/[productSlug]/page.tsx` (and any shared product detail components), plus `messages/en.json` + `messages/bg.json` for i18n.
	- Done when: all customer-facing strings are next-intl keys with `/en` and `/bg` parity; spacing around price/VAT label reads cleanly.

- Surface: `http://localhost:3000/en/checkout` @ 390x844 + 1440x900
	- What’s wrong: checkout page lacks a clear H1/primary heading in the DOM (harder to orient + weak a11y). Also a top arbitrary-value offender in scan.
	- Candidate files: `app/[locale]/(checkout)/_components/checkout-page-client.tsx`
	- Done when: clear page heading exists, form/summary spacing uses tokens (no arbitrary sizes), and layout is consistent across viewports.

- Surface: `http://localhost:3000/en/auth/login` @ 390x844 + 1440x900
	- What’s wrong: login form is an arbitrary-value drift hotspot; likely inconsistent control sizing vs the rest of app.
	- Candidate files: `app/[locale]/(auth)/_components/login-form.tsx`
	- Done when: no arbitrary values in the form layout/sizing (where feasible), inputs/buttons match shared sizing conventions.

- Surface: hidden drift (scan-driven)
	- What’s wrong: gradients exist in toast styling even if not visible in the basic route audit.
	- Candidate files: `components/ui/toast.tsx`
	- Done when: toast styles are flat (no gradients) and align with semantic tokens.

## Batch Log entry to copy into tasks.md

Paste a short entry per batch you ship:

- Batch name: FE audit notes + unblock smoke warmup
- Owner: FE
- Scope (1–3 files): docs/frontend_tasks.md, e2e/global-setup.ts
- Risk: low
- Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit` + `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

- Batch name: Checkout sheet sizing cleanup
- Owner: FE
- Scope (1–3 files): app/[locale]/(checkout)/_components/checkout-page-client.tsx
- Risk: low
- Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit` + `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

- Batch name: Home hero flat-card alignment
- Owner: FE
- Scope (1–3 files): components/desktop/marketplace-hero.tsx
- Risk: low
- Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit` + `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

- Batch name: ProductCard condition i18n
- Owner: FE
- Scope (1–3 files): components/shared/product/product-card.tsx, messages/en.json, messages/bg.json
- Risk: low
- Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit` + `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

- Batch name: Plans page locale fix (no BG strings on /en)
- Owner: FE
- Scope (1–3 files): app/[locale]/(plans)/_components/plans-page-client.tsx
- Risk: low
- Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit` + `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

- Batch name: 
- Owner: FE
- Scope (1–3 files):
- Risk: low / med / high
- Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit` + `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Scan-driven quick targets (start with these)

Palette drift top offenders (from `cleanup/palette-scan-report.txt`):
- `components/desktop/marketplace-hero.tsx`
- `app/[locale]/(account)/account/plans/plans-content.tsx`
- `app/[locale]/(chat)/_components/chat-interface.tsx`
- `components/ui/toast.tsx` (gradients)

Arbitrary value top offenders (from `cleanup/arbitrary-scan-report.txt`):
- `app/[locale]/(main)/_components/promo-cards.tsx`
- `components/layout/sidebar/sidebar.tsx`
- `components/pricing/plan-card.tsx`
- `app/[locale]/(auth)/_components/login-form.tsx`
- `app/[locale]/(checkout)/_components/checkout-page-client.tsx`

## Guardrails (frontend)

- No redesigns: preserve layout intent; tighten consistency and hierarchy only.
- No gradients; no new animations; remove non-essential `framer-motion` where it makes screens feel "different".
- Prefer tokens/utilities over Tailwind palette + arbitrary values; promote true constants to `app/globals.css` tokens.
- Keep changes in 1-3 files and always record a Batch Log entry in `tasks.md`.

## P2: Over-engineering cleanup (only after P0/P1 is stable)

- [ ] Simplify `components/auth/post-signup-onboarding-modal.tsx` (reduce one-off sizing/radii and non-essential motion; preserve UX)
- [ ] Simplify provider complexity where it adds cost/drift (start with `components/providers/message-context.tsx`; keep behavior identical)
- [ ] Refactor `components/layout/sidebar/sidebar.tsx` to remove arbitrary sizing where feasible (no layout redesign)
