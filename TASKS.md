# Tasks — Active (Phase-Aligned)

> Single execution queue. Phase-aligned with `docs/strategy/CAPABILITY-MAP.md`.
> Codex picks tasks here, executes, and checks boxes.
> Each task: description + context + acceptance criteria.

---

## How to Use This File

**Codex:** Read AGENTS.md first → Read `docs/state/NOW.md` → Find your assigned task below. Load listed context docs. Execute. Check boxes.
**Orchestrator:** Creates tasks from audits/planning. Verifies completion. Archives shipped work.
**Human:** Picks which task to send to Codex. Bridges orchestrator and Codex.

## Task Metadata

Tasks use format: `PH<phase>-<area>-<number>`. Example: `PH0-LAUNCH-001`.
Phase alignment tells agents WHY this task matters in the bigger picture.

---

## Phase 0 — Launch Hardening (Current)

> V1 Bulgaria launch readiness. Close blockers, fix broken areas, harden trust surface.

### 0.1 Launch Blockers (Human Approval Required)

- [ ] **PH0-LAUNCH-001:** Verify Stripe webhook idempotency — no duplicate orders on replay
  - Context: `docs/features/checkout-payments.md`
  - Capability: Webhook idempotency + replay safety
  - Done: replay same `checkout.session.completed` event twice → second is no-op, order count unchanged

- [ ] **PH0-LAUNCH-002:** Test refund/dispute flow end-to-end
  - Context: `docs/features/checkout-payments.md`
  - Capability: Refund/dispute operational flow
  - Done: trigger refund from Stripe dashboard → order status updates → buyer notified

- [ ] **PH0-LAUNCH-003:** Verify Stripe environment separation (prod keys + webhook secrets)
  - Context: `docs/features/checkout-payments.md`, `docs/STACK.md`
  - Capability: Environment separation (dev/prod payments)
  - Done: prod and dev use separate Stripe accounts, no test keys in prod env

- [ ] **PH0-LAUNCH-004:** Enable leaked password protection + re-run Supabase Security Advisor
  - Context: `docs/features/auth.md`
  - Capability: Auth/session hardening
  - Done: Supabase Security Advisor returns no critical findings
  - Note (2026-02-23): `password_hibp_enabled` is `false`; enabling via API failed with `402 Payment Required` (Pro plan+). Security Advisor: 1 warning, 0 critical.

### 0.2 Core Journey Breakages

- [x] **PH0-FIX-002:** Sell flow UX is terrible — needs redesign
  - Context: `docs/features/sell-flow.md`
  - Capability: Sell flow quality and completion
  - Done: seller can list a product end-to-end with clear UX, image upload works, form validation helpful

- [x] **PH0-FIX-003:** Account settings broken on mobile, incomplete on desktop
  - Context: `docs/features/auth.md`, `docs/DESIGN.md`
  - Capability: Account/profile reliability
  - Done: all settings accessible on mobile (375px), no overflow, no broken interactions

### 0.3 Trust/Compliance Hardening

- [ ] **PH0-REFACTOR-001:** Domain 6 — lib/, actions/, api/ refactoring (auth/payment sensitive)
  - Context: `refactor/domains/06-lib-actions-api.md`
  - BLOCKED: Contains payment/auth action refactors. Needs human approval before execution.
  - Note (2026-02-23): Completed safe `lib/` hardening pass. Full gate passes.
  - Done: domain refactored per plan, verification passes, no auth/payment regressions

- [x] **PH0-TRUST-001:** Checkout buyer protection UX (blocking/warning)
  - Context: `docs/features/checkout-payments.md`
  - Capability: Stripe checkout + escrow lifecycle
  - Done: buyer protection fee visible before payment, clear explanation text

- [x] **PH0-TRUST-002:** PDP report modal/flow (trust & safety)
  - Done: report button opens modal, user selects reason + submits, report stored in DB

- [x] **PH0-TRUST-003:** Verify product data sanity — no test/dummy listings
  - Done: audit shows only real listings, categories make sense
  - Finding (2026-02-26): dummy/test listings found only in `supabase/seed.sql` (local seed); no other repo-held production data sources contain dummy listings.

### 0.5 UI/UX Polish — Inspiration Audit (ref: `designs/ui-ux-dream-weaver/`)

> Patterns identified from UI mockup prototype. Goal: adopt the cleaner visual feel
> without losing our functional depth (real data, i18n, auth, multi-step sell, advanced filters).
> Reference screenshots in the original conversation + `designs/ui-ux-dream-weaver/UI_UX_GUIDE.md`.

#### A. Landing Page (Home) — Layout & Visual Hierarchy

- [x] **PH0-UX-001:** Add Category Icon Grid above SmartRail on mobile home
  - Add a "Categories" section with icon grid (6–8 items) between header and SmartRail
  - Pattern: 52px rounded-xl tiles with lucide icons + 10px labels below
  - Include "See all →" link to /categories
  - Use semantic tokens only (`bg-surface-subtle`, `text-muted-foreground`)
  - Scroll horizontally on overflow, hide scrollbar
  - Done: category icon row visible on mobile home, links to category pages

- [x] **PH0-UX-002:** Differentiate SmartRail (categories) vs DiscoveryRail (scope) visually
  - SmartRail = category navigation (stronger pills, `bg-foreground/text-background` active)
  - DiscoveryRail = discovery scope (lighter ghost pills, keep current border style)
  - Add a thin `border-t border-border` divider between category icon grid and SmartRail
  - Tighten vertical spacing between rails — they currently feel disconnected
  - Done: two rails have clearly different visual weight, no confusion about purpose

- [x] **PH0-UX-003:** Tighten home page vertical rhythm and section spacing
  - Consistent `px-4` (px-inset) gutters throughout
  - Section labels: "Categories" heading (15px semibold) with "See all" link
  - Predictable spacing: `space-y-1` between stacked rails, `pt-2` before feed
  - Remove excess whitespace between DiscoveryRail and first product row
  - Done: home feels tighter and more editorial, no floating orphan spacing

#### B. Product Cards — Content-First Tightening

- [x] **PH0-UX-004:** Reorder product card info hierarchy to Price → Title → Seller
  - Current: Category badge → Seller row → Title → Price
  - Target: Price (strongest, `text-sm font-semibold tabular-nums`) → Title (compact, muted) → Seller (smallest, with avatar + verified badge)
  - Price is the hero element — make it the first line after the image
  - Keep seller always visible (per user request) but visually smallest
  - Done: price is the first text element under every product image

- [x] **PH0-UX-005:** Reduce product card visual noise
  - Remove card borders and shadows if present (flat design)
  - Limit image overlay badges to max 1 (prefer discount % or condition, not both)
  - Category badge: remove from card face (already filterable via rails)
  - Condition badge: move to image overlay (`absolute bottom-2 left-2`, glass style)
  - Discount badge: keep on image (`absolute top-2 left-2`, destructive style)
  - Keep wishlist button for hover/tap but ensure it doesn't clutter
  - Done: cards are cleaner, image is the hero, max 1 text overlay on image

- [x] **PH0-UX-006:** Tighten product card typography and spacing
  - Image: `aspect-[3/4]` for taller editorial crop (currently 4/3 landscape)
  - Text area: `space-y-0.5` between lines (currently `gap-1.5`, too loose)
  - Price: `text-sm font-semibold` (14px)
  - Title: `text-xs text-muted-foreground line-clamp-2 leading-snug` (12px)
  - Seller: `text-2xs text-muted-foreground/70` with smaller avatar (16px)
  - Grid gap: `gap-x-3 gap-y-5` for breathing room between cards
  - Done: cards match content-first editorial feel, tighter text stack

#### C. Search Page — Empty State & Discovery

- [x] **PH0-UX-007:** Add "empty query" search home state with Recent + Trending
  - When search input is empty: show "Recent" section (chip pills of past searches) + "Trending" section (numbered list, 1–5)
  - Recent: horizontal wrap chips, `rounded-full bg-surface-subtle text-xs`
  - Trending: numbered list with dividers, rank number + search term
  - Include "Clear" button for recent searches
  - Store recent searches in localStorage (max 10, deduplicated)
  - Done: search page has useful empty state, not just a blank page

- [x] **PH0-UX-008:** Tighten search results layout
  - When results show: category chips appear as horizontal filter bar below search
  - Show result count: "12 results for 'query'" in muted text
  - Keep existing advanced filter capabilities (seller mode, attributes) accessible via filter button
  - Done: search results feel cleaner with inline context

#### D. Sell Form — Visual Polish (keep 5-step wizard)

- [x] **PH0-UX-009:** Flatten sell form input surfaces
  - Inputs: `bg-surface-subtle rounded-xl` (consistent), no nested card containers
  - Labels: `text-xs font-semibold text-foreground mb-1.5`
  - Consistent field spacing: `space-y-5` between field groups
  - Price input: euro prefix with absolute positioning (`pl-7`)
  - Textarea: matching bg/radius, `resize-none`, with character count
  - Done: sell form inputs match the flat, consistent feel

- [x] **PH0-UX-010:** Standardize chip selectors across sell form steps
  - Category and condition chips: same component/style system
  - Chip: `px-3 py-1.5 rounded-full text-xs font-medium`
  - Active: `bg-foreground text-background`
  - Inactive: `bg-surface-subtle text-muted-foreground hover:text-foreground`
  - Done: all chip selectors in sell form look and behave identically

- [x] **PH0-UX-011:** Polish photo upload step thumbnail row
  - Add button: `w-20 h-20 rounded-xl border-2 border-dashed border-border`
  - Thumbnails: `w-20 h-20 rounded-xl` with remove X button + "Cover" badge on first
  - Horizontal scroll with hidden scrollbar
  - Done: photos step matches the clean thumbnail row pattern

#### E. Category Filtering Bar

- [x] **PH0-UX-012:** Add filter bar pattern to category browse pages
  - Pattern: `Filter` button (with badge count) + `|` vertical divider + "All" pill + category pills
  - Subcategory row appears below when a category is selected (label prefix + child pills)
  - Show listing count below chip rows
  - Reuse SmartRail component where possible
  - Done: category browse has the clean horizontal filter bar feel

### 0.6 Phase 0 Exit Criteria

- All launch blockers closed (PH0-LAUNCH-001..004)
- Core journeys stable (sell, browse, checkout, account)
- Launch gates green (`pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`)
- P2 sections (12-15) audited or deprioritized with rationale

---

## Phase 1 — Liquidity + Conversion (Next)

> Post-launch. Grow supply, improve buyer conversion, build trust signals.

### 1.1 Supply Seeding & Listing Velocity

*(Tasks to be created post-launch based on GTM wedge category decisions)*

### 1.2 Buyer Conversion & Trust UX

- [ ] **PH1-BUYER-001:** Buyer confirmation email on checkout completion
  - Context: `docs/features/checkout-payments.md`
  - Capability: Transactional email + trust communications
  - Done: email sent with order summary, delivery estimate, seller info

- [ ] **PH1-BUYER-002:** PDP mobile seller bio surface
  - Context: `docs/features/product-cards.md`, `docs/DESIGN.md`
  - Done: seller name, avatar, rating, join date visible on mobile PDP

### 1.3 Seller Retention Foundations

*(Tasks to be created when Phase 1 begins)*

### 1.4 Phase 1 Exit Criteria

- Listing and transaction growth with healthy trust metrics
- Business dashboard baseline functional
- Commerce Graph canonical entity contracts stable

---

## Phase 2 — AI Listings MVP

> AI-powered listing creation. Photo → draft in seconds.

### 2.1 AI Platform Foundations

*(Tasks created when Phase 2 begins. See `docs/architecture/AI-PLATFORM.md` for architecture.)*

### 2.2 Photo-to-Listing Autofill

### 2.3 Pricing Suggestions MVP

### 2.4 Phase 2 Exit Criteria

- AI listing MVP with measurable publish-speed and quality gains
- Prompt registry and eval harness operational
- Guardrails and schema validation enforced

---

## Phase 3 — AI Business Operator MVP

*(See `docs/strategy/CAPABILITY-MAP.md` for capability inventory)*

## Phase 4 — Buyer Agent + EU Expansion

*(See `docs/strategy/CAPABILITY-MAP.md` for capability inventory)*

## Phase 5 — Fulfillment Intelligence + Autonomy Pilots

*(See `docs/strategy/CAPABILITY-MAP.md` for capability inventory)*

---

## Completed Recently

- [x] **FIX-001:** Search repair — search returns relevant results, filters work *(2026-02-24)*
- [x] **MOBILE-001:** Full mobile UI/UX audit and alignment pass *(2026-02-21)*
- [x] **MOTION-001:** Motion & structure pass — Framer Motion polish *(2026-02-21)*
- [x] **REFACTOR-002:** hooks/ production audit/refactor *(2026-02-23)*

---

## Codex Prompts (ready to paste)

**Single task:**
```
Read AGENTS.md. Then do task PH0-LAUNCH-001 from TASKS.md.
```

**Phase 0 batch:**
```
Read AGENTS.md. Do all unchecked tasks in "Phase 0" of TASKS.md, top to bottom.
```

**Specific area:**
```
Read AGENTS.md. Read docs/architecture/AI-PLATFORM.md. Then do task PH2-AI-001 from TASKS.md.
```

---

*Last updated: 2026-02-26*
