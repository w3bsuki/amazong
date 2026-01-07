# Frontend Tasks (Execution Queue)

Owner: Frontend agent(s)

This is the day-to-day queue for frontend work (**queue only**). The overall go-live checklist + batch log remains `tasks.md`.

Rules:
- Don’t treat this file as canonical; don’t duplicate/replace `tasks.md`.
- Prefer “one behavior” tasks with a 1-sentence **Done when** and 2–4 verification steps.
- When a batch ships, record it in `tasks.md` using the agreed medium format (`docs/gpt+opus.md`).

Read first: `docs/opusvsgpt.md`, `docs/guides/frontend.md`, `docs/DESIGN.md`, `docs/ENGINEERING.md`.

## P0: Start here (today)

- [ ] **Next P0:** Re-test `/en/plans` checkout end-to-end after BE fixes Stripe currency mismatch; record evidence in `tasks.md`.
- [ ] **Chat routing:** decide + standardize conversation deep-links (`/chat?conversation=<id>` vs `/chat/<id>`) and align with Next.js App Router + Supabase Realtime
	- Surface: `/{locale}/chat` (mobile + desktop)
	- What’s wrong: conversation selection currently uses a search param (`?conversation=`) which is easy for client state but feels non-canonical; unclear expectations for deep links/back button/share links.
	- Notes:
		- SEO is effectively irrelevant for chat (auth-gated); still prefer `robots: noindex` on chat routes to avoid accidental indexing.
		- Realtime subscription logic should be keyed off the selected conversation id regardless of URL shape.
	- Candidate files: `app/[locale]/(chat)/chat/page.tsx`, `app/[locale]/(chat)/_components/messages-page-client.tsx`, `app/[locale]/(chat)/_components/conversation-list.tsx`, `components/providers/message-context.tsx`
	- Done when: we either (A) migrate to a dynamic segment route (`/chat/<conversationId>`) with clean back behavior, or (B) explicitly keep `?conversation=` and document why; in both cases deep links work, back/forward works, and there’s no extra refetch/churn.
	- Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit` + `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- [ ] **Chat mobile list polish:** tighten conversation list UI/UX on mobile (no redesign, token-only)
	- Surface: `/{locale}/chat` @ 390x844
	- What’s wrong: conversation list feels off-token/ugly on mobile (spacing/hierarchy); also contains hardcoded fallbacks/time abbreviations.
	- Task doc: `TASK-chat-mobile-conversation-list-polish.md`
	- Candidate files: `app/[locale]/(chat)/_components/conversation-list.tsx`, `messages/en.json`, `messages/bg.json`
	- Done when: list feels consistent with the rest of the app, no hardcoded strings, localized time labels, and gates pass.
	- Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit` + `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- [x] Run Playwright MCP audit on P0 flows (mobile 390x844 + desktop 1440x900) and write findings into the next section
- [x] Pick 1 issue from the findings below (home/search/product/checkout/login/toast) and ship it as a 1-3 file batch, then run `tsc` + `e2e:smoke` and log the batch in `tasks.md`
  - Shipped: auth E2E password toggle deterministic fix (accessible name selectors + dev overlay wait)
- [x] Home promo cards: eager-load the first promo image (LCP warning reduction)
- [x] Product pages i18n sweep: replace hardcoded strings, add missing keys to `messages/en.json` + `messages/bg.json`, and verify `/en` + `/bg` parity
  - Removed hardcoded EN/BG dictionaries from `lib/view-models/product-page.ts`
  - View-model now returns locale-agnostic `conditionKey` + raw attribute `key/value` pairs
  - Added `attr*` and `val*` translation keys to `ProductDetails` namespace in both message files
  - Translation happens at render-time in `ItemSpecifics` (desktop) and `mobile-product-page.tsx` (mobile)
- [x] `/plans` UX fix: reproduce why plan checkout/creation doesn't work, identify whether it's UI state/validation vs server/action failure, and file a P0 batch
  - Fixed: CTA now shows deterministic loading and either redirects to Stripe or shows specific inline error (no dead click)
  - Also: admin orders page calls `await connection()` to mark the route dynamic (cacheComponents-safe) and eliminate prerender fetch rejection noise

## P0 audit findings (fill this in)

For each issue:
- Surface (URL + viewport)
- What’s wrong (token drift/spacing/typography/touch targets/IA)
- Candidate files (from scan reports first)
- “Done when” acceptance criteria

### Findings (Jan 6, 2026)

- [x] Surface: `http://localhost:3000/en` @ 390x844 ✅ DONE (2026-01-06)
	- What's wrong: hero area feels "off-token" vs the rest of the app (palette drift hotspot from scan). This is likely where the first impression consistency breaks.
	- Candidate files: `components/desktop/marketplace-hero.tsx`
	- Done when: hero uses semantic tokens only (no palette classes), dense spacing (`gap-2/3`), flat cards (`border`, `rounded-md`), and typography aligns with `docs/DESIGN.md`.
	- Resolution: Applied dense spacing (`gap-3`, `space-y-2`), reduced padding, tighter badge, consistent button sizing (`size="default"`), and aligned typography scale (`text-xl lg:text-2xl`).

- [x] Surface: `http://localhost:3000/en/search` @ 390x844 + 1440x900 ✅ DONE (2026-01-06)
	- What's wrong: product surfaces are the "golden component" area — any drift here multiplies across search/home/category grids. Scan-driven next target.
	- Candidate files: `components/shared/product/product-card.tsx`
	- Done when: product card uses tokens only, no arbitrary values, consistent title/price/meta hierarchy, predictable touch targets, and no non-essential motion.
	- Resolution: Replaced `size-7 + min-h-touch-sm min-w-touch-sm` with unified `size-touch-sm` token; added missing `min-w-touch-sm` + `w-touch-sm` + `size-touch-sm` utilities to globals.css; i18n-ed hardcoded "Free" and "sold" strings via existing `t("freeShipping")` and `t("sold")` keys.

- Surface: `http://localhost:3000/en/tech_haven/office-suite-license` (product page) @ 390x844 + 1440x900
	- What’s wrong: visible hardcoded English strings on the page (e.g. “Key Details”, “Description”, “Shipping & Returns”, “Buyer Protection”, “Write a Review”), and currency/price formatting feels cramped (“BGN 99.99incl. VAT”).
	- Candidate files: `app/[locale]/[username]/[productSlug]/page.tsx` (and any shared product detail components), plus `messages/en.json` + `messages/bg.json` for i18n.
	- Done when: all customer-facing strings are next-intl keys with `/en` and `/bg` parity; spacing around price/VAT label reads cleanly.

- [x] Surface: `http://localhost:3000/en/checkout` @ 390x844 + 1440x900 ✅ DONE (2026-01-06)
	- What's wrong: checkout page lacks a clear H1/primary heading in the DOM (harder to orient + weak a11y). Also a top arbitrary-value offender in scan.
	- Candidate files: `app/[locale]/(checkout)/_components/checkout-page-client.tsx`
	- Done when: clear page heading exists, form/summary spacing uses tokens (no arbitrary sizes), and layout is consistent across viewports.
	- Resolution: Added H1 (`sr-only` on mobile, visible on desktop header row), replaced arbitrary `h-12` button heights with `h-10` design token.

- [x] Surface: `http://localhost:3000/en/auth/login` @ 390x844 + 1440x900 ✅ DONE (2026-01-06)
	- What's wrong: login form is an arbitrary-value drift hotspot; likely inconsistent control sizing vs the rest of app.
	- Candidate files: `app/[locale]/(auth)/_components/login-form.tsx`
	- Done when: no arbitrary values in the form layout/sizing (where feasible), inputs/buttons match shared sizing conventions.
	- Resolution: Removed explicit `h-10` from buttons (rely on `size="lg"`), standardized password toggle button to `size-8` with `size-4` icons for consistency.

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
