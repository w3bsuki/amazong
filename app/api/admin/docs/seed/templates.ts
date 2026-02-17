export type AdminDocTemplate = {
  title: string
  slug: string
  category:
    | "product"
    | "policies"
    | "payments"
    | "plans"
    | "roadmap"
    | "ops"
    | "guides"
    | "legal"
    | "general"
  status: "draft" | "published" | "archived"
  content: string
}

export const ADMIN_DOC_TEMPLATES: AdminDocTemplate[] = [
  {
    title: "Product: Platform PRD (Ultimate)",
    slug: "prd-platform-ultimate",
    category: "product",
    status: "draft",
    content: `# Product: Platform PRD (Ultimate)

This is the internal single source of truth for what Treido is building.

## Vision

Treido is a Bulgarian-first marketplace for safe C2C/B2B commerce with:

- on-platform payments (Stripe)
- transparent Buyer Protection (buyer-paid)
- Stripe Connect payouts (Express)
- predictable disputes/refunds
- low friction for personal sellers (0% seller fee)

## Core scope (V1)

- Listings: create/edit, photos, categories, browse/search
- Chat: buyer ↔ seller
- Checkout: Stripe payments + Buyer Protection fee
- Orders: lifecycle statuses and receipts
- Payouts: Connect onboarding + release rules
- Trust & safety: reports, blocks, moderation tooling
- Ratings/reviews: minimum viable for launch

## Non-scope (V1)

- Cash on delivery (COD)
- Public community forums/groups
- Cross-border shipping automation (unless built end-to-end)

## Success metrics

- paid conversion rate (checkout → paid)
- completion rate (paid → completed)
- dispute rate and resolution time
- chargeback rate

## Related docs

- Monetization & plans
- Payments runbooks
- Trust & safety PRDs
`,
  },
  {
    title: "Product: Accounts, Roles & Permissions (v1)",
    slug: "product-accounts-roles-permissions-v1",
    category: "product",
    status: "draft",
    content: `# Product: Accounts, Roles & Permissions (v1)

## Account types

- **Personal**: default, 0% seller fee, limited listings by plan
- **Business**: business seller fee + dashboard tooling via subscription tier

## Core roles

- Buyer (can purchase, dispute, rate)
- Seller (can list, ship, respond to disputes)
- Admin (can access /admin, moderation, operational tooling)

## Verification

- Phone verified (required before certain actions, if enforced)
- Stripe Connect onboarding (required before payouts)
- Business verification (KYB) to show “Business” label and unlock B2B tooling

## Permissions (examples)

- Only admins can access admin ops tables (docs/tasks/notes)
- Only sellers can create listings and receive payouts
- Only verified businesses can access future B2B networking features
`,
  },
  {
    title: "Product: Reputation (Ratings & Badges)",
    slug: "prd-reputation-ratings-badges",
    category: "product",
    status: "draft",
    content: `# Product: Reputation (Ratings & Badges)

Goal: make the marketplace feel **trustworthy** and **alive**.

## V1 (minimum viable)

- Post-order ratings after successful completion
- Display seller rating + count + completed sales

## Badges (V1.1 target)

Badge examples (data-driven thresholds):

- Rising seller: ≥ 10 completed sales
- Trusted seller: ≥ 50 completed sales + strong rating + low dispute rate
- Top seller: ≥ 200 completed sales + very low disputes

## Rules (anti-gaming)

- Only paid + completed orders count as “sales”
- Exclude fraud and seller-fault full refunds
- Badges can be revoked if metrics drop (with a cooldown window)
`,
  },
  {
    title: "Product: B2B Networking (Future)",
    slug: "prd-b2b-networking-future",
    category: "product",
    status: "draft",
    content: `# Product: B2B Networking (Future)

This is a future module. Default posture: **defer** until V1 is stable.

## Goal

Enable verified businesses/distributors to connect privately for sourcing and partnerships.

## Hard requirements

- Verified-only access (KYB)
- Strong rate limiting + reporting + enforcement
- Separate surface from consumer chat

## Risks

- Spam and outreach abuse
- High moderation burden

## Decision

Do not build before payments + disputes + moderation are production-stable.
`,
  },
  {
    title: "Legal: Jurisdictions & Availability (Draft)",
    slug: "legal-jurisdictions-availability",
    category: "legal",
    status: "draft",
    content: `# Legal: Jurisdictions & Availability (Draft)

Internal planning document. Not legal advice.

## Initial launch posture

- Primary launch market: Bulgaria
- Expansion: EU/EEA countries where Stripe + operations + compliance are ready

## What determines availability

- Stripe availability (payments + Connect payouts)
- consumer protection obligations
- data protection (GDPR for EU/EEA)
- sanctions/restricted territories (always excluded)
- ops coverage (support, disputes, moderation language)

## Enablement checklist (before turning on a country)

- Legal review notes recorded
- Terms/Privacy updated for the jurisdiction
- Support playbooks ready and staffed
- Monitoring and incident response ready
`,
  },
  {
    title: "Policy: Privacy (Draft)",
    slug: "policy-privacy-draft",
    category: "policies",
    status: "draft",
    content: `# Policy: Privacy (Draft)

Internal outline. Not legal advice.

## Data categories

- account/profile data
- listings and marketplace activity
- messages (subject to retention rules)
- orders and payment metadata (Stripe ids, totals)
- dispute evidence and moderation actions

## Processors

- Stripe (payments, Connect onboarding)
- Supabase (database, auth, storage)
- email/SMS provider (notifications)

## Retention (to finalize)

- transaction data: accounting/legal window
- messages: safety + disputes
- dispute evidence: longer than dispute window
`,
  },
  {
    title: "Policy: Terms of Service (Draft)",
    slug: "policy-terms-draft",
    category: "policies",
    status: "draft",
    content: `# Policy: Terms of Service (Draft)

Internal outline. Not legal advice.

## Covers

- accounts and eligibility
- listings rules + prohibited items
- fees (Buyer Protection, business seller fee, subscriptions, boosts)
- payments (Stripe only; no COD for V1)
- payout release conditions
- disputes/refunds and evidence rules
- enforcement (bans, removals)
`,
  },
  {
    title: "Monetization: Hybrid Buyer Protection (v1)",
    slug: "monetization-hybrid-buyer-protection-v1",
    category: "plans",
    status: "draft",
    content: `# Monetization: Hybrid Buyer Protection (v1)

## Model (non-negotiable)

- Personal sellers: **0% seller fee** (they keep 100% of item price)
- Businesses: **small seller fee** (0.5-1.5%)
- Buyers: **Buyer Protection** fee (transparent, percent + fixed, capped)

## Buyer Protection fee formula

\`\`\`
buyer_fee = min(
  item_price * buyer_protection_percent + buyer_protection_fixed,
  buyer_protection_cap
)
\`\`\`

## Current fee table (plan-driven)

| Account | Plan | Seller fee | Buyer protection |
|--------:|------|------------|------------------|
| Personal | Free | 0% | 4% + €0.50 (cap €15) |
| Personal | Plus | 0% | 3.5% + €0.40 (cap €14) |
| Personal | Pro | 0% | 3% + €0.30 (cap €12) |
| Business | Free | 1.5% | 3% + €0.35 (cap €12) |
| Business | Pro | 1% | 2.5% + €0.25 (cap €10) |
| Business | Enterprise | 0.5% | 2% + €0.20 (cap €8) |

## Boosts (v1)

Boosts are optional paid add-ons for visibility. Boosts are never required for core selling.

| SKU | Duration | Price |
|-----|----------|-------|
| \`boost_24h\` | 24 hours | €0.99 |
| \`boost_7d\` | 7 days | €4.99 |
| \`boost_30d\` | 30 days | €14.99 |

Notes:

- Plan boosts included per month are **24h boost credits** (not 7d/30d boosts).
- Boosted listings must be labeled (e.g. “Boosted” / “Ad”).

## Why this is the right model (summary)

- Seller commissions in C2C are often bypassed → keep personal seller fee at 0%.
- Buyers accept a protection fee when the value is clear (escrow + dispute handling).
- Businesses can pay for professional needs (invoices, dashboards, tooling).

## Open questions

- Do we show all fees in EUR, BGN, or both (and what conversion rate)?
- What is the default auto-confirm window after delivery (48h vs 72h)?
`,
  },
  {
    title: "Boosts: Packs, Ranking & Refunds (v1)",
    slug: "boosts-packs-ranking-refunds-v1",
    category: "plans",
    status: "draft",
    content: `# Boosts: Packs, Ranking & Refunds (v1)

## Boost SKUs (v1)

All boost charges are in **EUR** (Stripe).

| SKU | Duration | Price |
|-----|----------|-------|
| \`boost_24h\` | 24 hours | €0.99 |
| \`boost_7d\` | 7 days | €4.99 |
| \`boost_30d\` | 30 days | €14.99 |

## Ranking behavior (v1)

- Boosted listings appear **before** non-boosted listings within the same feed/filter/sort.
- Among boosted listings, order is:
  1) later \`boost_expires_at\` first
  2) then the feed’s normal sort (e.g. newest)
- Boosted listings must be labeled (e.g. “Boosted” / “Ad”).

## Guardrails (v1)

- A listing can have **at most 1 active boost** at a time.
- Only the listing owner can purchase a boost.
- Boosts never override moderation. If a listing is removed/hidden, the boost is considered consumed.

## Refunds (v1)

- If a boost fails to activate due to platform error, provide a **refund** or **boost credit**.
- Once a boost is active/consumed, it is **non-refundable**, except for verifiable platform outages or fraud review.
`,
  },
  {
    title: "Limits & Guardrails Matrix (v1)",
    slug: "limits-guardrails-matrix-v1",
    category: "plans",
    status: "draft",
    content: `# Limits & Guardrails Matrix (v1)

## Plan entitlements (v1)

### Personal

| Plan | Max active listings | Boosts / month | Analytics | Priority support |
|------|---------------------|----------------|----------|------------------|
| Free | 30 | 0 | None | No |
| Plus | 150 | 2× 24h boosts | Basic | No |
| Pro | 500 | 5× 24h boosts | Full | Yes |

### Business

| Plan | Max active listings | Boosts / month | \`/dashboard\` access | Team seats |
|------|---------------------|----------------|-----------------------|-----------|
| Business Free | 100 | 0 | No | – |
| Business Pro | 2,000 | 20× 24h boosts | Yes | Up to 3 |
| Business Enterprise | Unlimited | 50× 24h boosts | Yes (full) | Unlimited |

## Operational guardrails (v1)

| Area | Rule | Applies to | Value |
|------|------|------------|-------|
| Verification | Email verified | Everyone | Required to transact |
| Verification | Phone verified | Sellers | Required before selling |
| Verification | Stripe Connect onboarding | Sellers | Required before payouts |
| Verification | Business verification | Business accounts | Required to label as Business |
| Shipping | Ship-by window | Sellers | If not shipped in 7 days → buyer can cancel + refund |
| Delivery | Auto-confirm window | Orders | 72h after delivery if no dispute |
| Disputes | Open dispute window | Buyers | Within 72h of delivery |
| Disputes | Seller response SLA | Sellers | 48h to respond with evidence |
| Evidence | Photo evidence window | Buyers | 48h for “wrong item / damaged” claims |
| Payouts | Escrow release | Platform | No transfer until confirmed/auto-confirmed and no dispute |
| Refunds | Refund includes Buyer Protection fee | Seller fault / dispute win | Yes |
| Boosts | One active boost per listing | Sellers | Enforced |
| Boosts | Boost label required | UI | Always show “Boosted” / “Ad” badge |
`,
  },
  {
    title: "Roadmap: V1 Launch Scope",
    slug: "roadmap-v1-launch-scope",
    category: "roadmap",
    status: "draft",
    content: `# Roadmap: V1 Launch Scope

## Goal

Launch a safe, complete marketplace MVP (Vinted-style). **No COD**.

## V1 must-have

- Listings: create/edit, photos, categories, search
- Chat: buyer ↔ seller
- Checkout: Stripe payment + Buyer Protection fee
- Orders: lifecycle, status tracking, receipts
- Payouts: Stripe Connect (Express) onboarding + release rules
- Ratings/reviews: minimum viable
- Trust & safety: reports, blocks, moderation basics
- Returns/refunds + dispute intake (minimum viable)

## Launch gates (no ship without)

- Webhook idempotency verified
- Refund flow tested end-to-end
- Support playbooks written (refunds, disputes, fraud)
- Monitoring + alerting for payment failures and webhook lag
`,
  },
  {
    title: "Payments: Stripe Connect & Escrow Release",
    slug: "payments-stripe-connect-escrow-release",
    category: "payments",
    status: "draft",
    content: `# Payments: Stripe Connect & Escrow Release

## Pattern

Use **Separate Charges and Transfers**:

- Buyer is charged on the platform Stripe account
- Transfer to seller Connected Account happens only after:
  - delivery confirmation, or
  - dispute resolution

## Minimal order statuses

- pending_payment → paid → shipped → delivered → completed
- cancelled / refunded
- disputed

## Webhooks (minimum)

- payment_intent.succeeded / payment_intent.payment_failed
- charge.refunded
- charge.dispute.created / charge.dispute.closed
- account.updated (Connect onboarding)

## Open questions

- Do we require phone verification before allowing Stripe onboarding?
- Which carriers do we support in V1 for tracking?
`,
  },
  {
    title: "Policies: Returns & Refunds (v1)",
    slug: "policy-returns-refunds-v1",
    category: "policies",
    status: "draft",
    content: `# Returns & Refunds (v1)

## Goals

- Predictable outcomes for buyers and sellers
- Reduce fraud while keeping the UX simple

## Baseline rules

- Payments are on-platform (Stripe). COD is not supported.
- Refunds are processed through Stripe.

## Typical eligible scenarios

- Not shipped within allowed window → cancel + refund
- Not received (tracking failure) → dispute → refund if confirmed
- Not as described / damaged / counterfeit → dispute with evidence

## Dispute workflow (minimum)

1. Buyer opens dispute (reason + evidence)
2. Seller responds within SLA
3. Support decision:
   - refund buyer, or
   - release funds to seller, or
   - partial refund
`,
  },
  {
    title: "Launch Plan (v1)",
    slug: "launch-plan-v1",
    category: "ops",
    status: "draft",
    content: `# Launch Plan (v1)

## Pre-launch

- Policies finalized (returns/refunds, prohibited items, KYC)
- Stripe Connect onboarding + webhooks validated
- Support workflows written and tested
- Seed initial supply (trusted sellers, partnerships)

## Launch week

- Gradual rollout (invite/waitlist if needed)
- Daily monitoring: payments, disputes, fraud signals, crash rate
- Strict rollback rules for payment regressions

## Post-launch

- Improve onboarding conversion (“Buy” vs “Sell” CTA)
- Add missing features discovered in real usage
- Start growth loops (referrals, SEO, partnerships)
`,
  },
  {
    title: "KPIs & Metrics (v1)",
    slug: "kpis-metrics-v1",
    category: "plans",
    status: "draft",
    content: `# KPIs & Metrics (v1)

## North Star (pick 1 primary)

- **GMV (Gross Merchandise Value)**
- **Completed orders** (orders reaching \`completed\`)

## Funnel KPIs (buyer)

| Stage | Metric | Definition |
|------:|--------|------------|
| Awareness | sessions | unique visits (by locale + device) |
| Intent | search rate | % sessions that perform search |
| Consideration | PDP views | product detail page views |
| Conversion | checkout start rate | checkout starts / PDP views |
| Payment | paid conversion | paid orders / checkout starts |
| Fulfillment | delivered rate | delivered / paid |
| Success | completion rate | completed / paid |

## Supply KPIs (seller)

- activated sellers (≥1 listing)
- listing completion rate
- sell-through rate (orders / active listings)
- time-to-first-sale

## Trust KPIs (non-negotiable)

- dispute rate (disputed / paid)
- refund rate (refunded / paid)
- chargeback rate (chargebacks / paid)
- time-to-resolution for disputes

## Operating cadence

- Daily: webhook lag, payment failures, dispute queue
- Weekly: NSM + funnel + supply + trust review
- Monthly: unit economics and risk review

## Stop-the-line triggers (draft)

- payout release bug (any)
- webhook lag above threshold (define)
- chargeback rate spike (define)
`,
  },
  {
    title: "Unit Economics (v1)",
    slug: "unit-economics-v1",
    category: "plans",
    status: "draft",
    content: `# Unit Economics (v1)

## Fee model (plan-driven)

Buyer Protection fee:

\`\`\`
buyer_fee = min(
  item_price * buyer_protection_percent + buyer_protection_fixed,
  buyer_protection_cap
)
\`\`\`

Business seller fee:

\`\`\`
seller_fee = item_price * seller_fee_percent
\`\`\`

## Example (Personal Free, €50 item)

- Buyer fee: \`min(€50×4% + €0.50, €15) = €2.50\`
- Buyer total: \`€52.50\`
- Seller receives: \`€50.00\`
- Platform gross (pre-cost): \`€2.50\`

## Costs to model

- Stripe processing (variable + fixed)
- refunds/chargebacks (loss rate)
- support cost per dispute (time + tooling)
- fraud loss buffer

## Contribution margin (simple)

\`\`\`
contribution = buyer_fee + seller_fee
  - stripe_cost
  - refunds_loss
  - support_allocation
\`\`\`

## Requirements

- Store fee components on the order at purchase time (no retroactive changes).
- Plans/fees are DB-configured (no hard-coded fee math).
`,
  },
  {
    title: "Go-to-Market (Bulgaria) (v1)",
    slug: "gtm-bulgaria-v1",
    category: "ops",
    status: "draft",
    content: `# Go-to-Market (Bulgaria) (v1)

## Positioning (simple)

- **No COD**
- **Buyer Protection**
- **Verified sellers + businesses**
- **Modern UX**

## Phase 0: Supply seeding (T-30 → T-7)

- recruit trusted early sellers (quality inventory)
- onboard verified businesses (density in key categories)
- pick 3–5 “wedge” categories to win first

## Phase 1: Launch (T-7 → T+14)

- controlled rollout (invite/waitlist if needed)
- daily monitoring: payments, disputes, fraud signals, crash rate
- tight feedback loop with early sellers

## Phase 2: Growth loops (T+14 → T+90)

- SEO (indexable listings + category pages)
- referrals (later; only after trust metrics are stable)
- creator/influencer partnerships
- partnerships (couriers, payment education, local businesses)

## Open questions

- Which categories are our initial wedge?
- What CAC ceiling do we accept for paid acquisition tests?
`,
  },
  {
    title: "Risk Register (v1)",
    slug: "risk-register-v1",
    category: "ops",
    status: "draft",
    content: `# Risk Register (v1)

This is a living register. Review weekly during launch.

| Risk | Likelihood | Impact | Owner | Mitigation |
|------|------------|--------|-------|------------|
| Fraud spike | Med | High | Ops | verification, seller limits, dispute process, monitoring |
| Chargeback spike | Low–Med | High | Payments | clear UX, evidence capture, fast support, policy alignment |
| Webhook idempotency gaps | Med | High | Eng | idempotent handlers, event storage, alerting, replay tooling |
| Support overload | Med | High | Ops | macros, workflows, admin tooling, SLAs |
| Regulatory / KYC ambiguity | Med | High | Legal/Ops | Stripe Connect first, policy + retention, counsel review |
| Off-platform leakage | High | Med | Product | keep fees low, trust messaging, lower friction |
| Counterfeits | Med | High | Trust | prohibited items, takedowns, evidence requirements |
`,
  },
  {
    title: "Governance & Operating Cadence",
    slug: "governance-operating-cadence",
    category: "ops",
    status: "draft",
    content: `# Governance & Operating Cadence

## Weekly cadence

- Metrics review (NSM + trust KPIs)
- Support/dispute review (top issues, root causes)
- Shipping plan (what is releasing this week)

## Decision process

- Write decisions (DEC format) before big scope/fee changes.
- Prefer small reversible experiments.
- Keep launch gates explicit for payments/trust.

## Security posture (minimum)

- admin-only routes enforced server-side
- RLS on sensitive tables
- no secrets/PII in logs
`,
  },
  {
    title: "Policy: KYC / KYB / AML (v1)",
    slug: "policy-kyc-kyb-aml-v1",
    category: "policies",
    status: "draft",
    content: `# Policy: KYC / KYB / AML (v1)

## Goal

Prevent fraud and meet payment-provider requirements.

## What Stripe covers

- Connect onboarding collects identity/banking info for payouts.
- Businesses can provide KYB details via Stripe.

## What the platform covers

- phone verification (anti-spam and account recovery)
- seller limits for new accounts (price caps, listing caps)
- manual reviews for first sales / flagged disputes

## Data handling (principles)

- minimize what we store (prefer Stripe-hosted onboarding)
- define retention windows for verification artifacts and disputes
`,
  },
  {
    title: "Policy: Prohibited Items (v1)",
    slug: "policy-prohibited-items-v1",
    category: "policies",
    status: "draft",
    content: `# Policy: Prohibited Items (v1)

## Always prohibited

- illegal goods (drugs, weapons, etc.)
- counterfeit goods and replicas
- stolen items
- hacked accounts, credentials, codes

## Enforcement

- listing removal
- account suspension/ban
- funds hold where allowed by policy/provider
`,
  },
  {
    title: "Payments: Webhooks & Idempotency Checklist",
    slug: "payments-webhooks-idempotency-checklist",
    category: "payments",
    status: "draft",
    content: `# Payments: Webhooks & Idempotency Checklist

## Non-negotiables

- webhooks are the source of truth
- every handler is idempotent
- no secrets/PII in logs

## Minimum events

- payment_intent.succeeded / payment_intent.payment_failed
- charge.refunded
- charge.dispute.created / charge.dispute.closed
- account.updated (Connect onboarding)

## Operational checks

- store event id and short-circuit duplicates
- alert on webhook lag
- refund + dispute flows tested end-to-end in staging
`,
  },
  {
    title: "Admin: Security & Access Checklist",
    slug: "admin-security-access-checklist",
    category: "ops",
    status: "draft",
    content: `# Admin: Security & Access Checklist

## Access model

- only \`role = admin\` can access admin routes
- admin Supabase client (service role) is only used after auth verification

## Data controls

- RLS on admin tables: docs/tasks/notes are admin-only
- avoid leaking whether an admin panel exists (silent redirects for non-admins)

## Operational hygiene

- no secrets in logs
- audit payment-related admin actions
`,
  },
  {
    title: "Ops: Support Playbook (v1)",
    slug: "ops-support-playbook-v1",
    category: "ops",
    status: "draft",
    content: `# Ops: Support Playbook (v1)

This is Treido’s internal playbook for refunds, disputes, and user support during launch.

## Goals

- Fast, predictable outcomes
- Evidence-based decisions
- Protect Stripe standing (keep chargebacks low)

## Intake tags

- pre-shipment cancellation
- seller did not ship
- item not received (INR)
- damaged
- not as described
- counterfeit
- harassment / abuse
- payments / technical

## SLA targets (launch)

- First response: same day for payments/disputes, otherwise within 24h
- Dispute decision: within 48h once evidence is complete

## Evidence checklist

- order timeline + status
- tracking + delivery confirmation
- photos (item + packaging)
- listing mismatch evidence
- relevant chat excerpts

## Escalations

- Engineering: webhook/order mismatch, payout release issues, systemic payment failures
- Trust & safety: counterfeit indicators, repeated scam patterns
`,
  },
  {
    title: "Ops: Dispute Resolution Matrix (v1)",
    slug: "ops-dispute-resolution-matrix-v1",
    category: "ops",
    status: "draft",
    content: `# Ops: Dispute Resolution Matrix (v1)

Adjust only via a documented decision (DEC).

| Dispute type | Required evidence | Default outcome | SLA | Notes |
|-------------|-------------------|-----------------|-----|------|
| Seller did not ship | no tracking after ship window | refund buyer | 24–48h | warn seller |
| Item not received (INR) | carrier + tracking | refund if delivery fails | 24–72h | if marked delivered, request buyer evidence |
| Damaged item | photos of item + packaging | partial/full refund | 48h | severity-based |
| Not as described | photos + mismatch vs listing | partial/full refund | 48h | needs clear mismatch |
| Counterfeit | photos + authenticity indicators | refund + enforcement | 48h | preserve evidence |
| Harassment/abuse | chat excerpts | enforcement action | 24h | restrict messaging if needed |

## Payout safety

- Any dispute blocks payout release until resolved.
- Payout release bug is SEV-0.
`,
  },
  {
    title: "Ops: Moderation Playbook (v1)",
    slug: "ops-moderation-playbook-v1",
    category: "ops",
    status: "draft",
    content: `# Ops: Moderation Playbook (v1)

## Goals

- Remove prohibited/counterfeit items quickly
- Reduce scams and harassment
- Keep enforcement consistent

## Report categories

- prohibited items
- counterfeit / replicas
- scam / fraud attempt
- harassment / hate speech
- spam / duplicate listings

## Actions (ladder)

1. Warn
2. Remove listing
3. Temporary restriction (posting or messaging)
4. Suspension
5. Ban (with documentation)

## Counterfeit handling

- remove listing quickly
- preserve evidence (listing + photos + chat + order)
- restrict seller pending review
`,
  },
  {
    title: "Ops: Incident Response",
    slug: "ops-incident-response",
    category: "ops",
    status: "draft",
    content: `# Ops: Incident Response

## Severity levels

- SEV-0: payments/payouts broken, security incident, data leak risk
- SEV-1: checkout degraded, large portion of users impacted
- SEV-2: partial outage, major feature degraded
- SEV-3: minor issue with workaround

## Roles

- Incident commander (IC)
- Scribe
- Technical owner

## Process

1. Declare severity + owner
2. Mitigate (stop bleeding)
3. Diagnose root cause
4. Resolve + verify
5. Postmortem + follow-ups
`,
  },
  {
    title: "Ops: Data Governance & Retention (draft)",
    slug: "ops-data-governance-retention-draft",
    category: "legal",
    status: "draft",
    content: `# Ops: Data Governance & Retention (draft)

Internal draft. Align with legal counsel before publishing externally.

## Principles

- least privilege access
- minimize stored sensitive data (prefer Stripe-hosted onboarding)
- clear retention windows
- auditability for admin actions

## Data categories

- PII (email, phone, addresses)
- payments metadata (Stripe ids, order totals)
- chat content (user messages)
- trust artifacts (dispute evidence, moderation logs)
- internal ops docs (admin docs/tasks/notes)

## Retention (to finalize)

- Orders: legal/accounting requirements
- Chat: only as needed for disputes/safety
- Evidence: longer than dispute window
- Logs: short retention with secure access
`,
  },
  {
    title: "Docs: Governance",
    slug: "docs-governance",
    category: "guides",
    status: "draft",
    content: `# Docs: Governance

Treido documentation lives in three layers:

1) Canonical engineering docs (repo \`/docs\`)
2) Company docs (repo \`/docs-site\`)
3) Operational docs (admin \`/admin/docs\`)

## Change process

- For big changes (fees, scope, payout rules): write a DEC first.
- Keep open questions explicit and close them one by one.
- Prefer small edits over rewrites.
`,
  },
]

export const ADMIN_DOC_TEMPLATES_BG: AdminDocTemplate[] = [
  {
    title: "Продукт: PRD на платформата (Ultimate)",
    slug: "prd-platform-ultimate",
    category: "product",
    status: "draft",
    content: `# Продукт: PRD на платформата (Ultimate)

Това е вътрешният “single source of truth” за това какво изгражда Treido.

## Визия

Treido е marketplace (първо България) за безопасна C2C/B2B търговия с:

- плащания в платформата (Stripe)
- прозрачна “Защита на купувача” (плаща купувачът)
- изплащания през Stripe Connect (Express)
- предвидими спорове/възстановявания
- ниско триене за лични продавачи (0% такса продавач)

## Основен обхват (V1)

- Обяви: създаване/редакция, снимки, категории, търсене/разглеждане
- Чат: купувач ↔ продавач
- Checkout: Stripe плащане + такса “Защита на купувача”
- Поръчки: жизнен цикъл и разписки
- Изплащания: Connect онбординг + правила за освобождаване
- Trust & safety: сигнали, блокиране, модерация (минимум)
- Оценки/отзиви: минимално за пускане

## Извън обхват (V1)

- Наложен платеж (COD)
- Публични community форуми/групи
- Автоматизация на международни доставки (ако не е готово край-до-край)

## Метрики за успех

- конверсия (checkout → paid)
- completion rate (paid → completed)
- % спорове и време за решение
- chargeback rate

## Свързани документи

- Монетизация и планове
- Payments runbooks
- Trust & safety PRDs
`,
  },
  {
    title: "Продукт: Акаунти, роли и права (v1)",
    slug: "product-accounts-roles-permissions-v1",
    category: "product",
    status: "draft",
    content: `# Продукт: Акаунти, роли и права (v1)

## Типове акаунти

- **Личен**: по подразбиране, 0% такса продавач, лимит обяви според план
- **Бизнес**: бизнес такса продавач + dashboard инструменти според абонамент

## Роли

- Купувач (може да купува, да отваря спор, да оценява)
- Продавач (може да пуска обяви, да изпраща, да отговаря по спорове)
- Админ (достъп до /admin, модерация и оперативни инструменти)

## Верификация

- Потвърден телефон (ако се изисква преди ключови действия)
- Stripe Connect онбординг (задължително преди изплащания)
- Бизнес верификация (KYB) за етикет “Business” и бъдещи B2B функции

## Права (примери)

- Само админи имат достъп до admin ops таблици (docs/tasks/notes)
- Само продавачи могат да създават обяви и да получават изплащания
- Само verified бизнеси имат достъп до бъдещ B2B нетуъркинг
`,
  },
  {
    title: "Продукт: Репутация (оценки и значки)",
    slug: "prd-reputation-ratings-badges",
    category: "product",
    status: "draft",
    content: `# Продукт: Репутация (оценки и значки)

Цел: marketplace-ът да изглежда **безопасен** и **жив**.

## V1 (минимум)

- Оценки след успешно приключена поръчка
- Показваме рейтинг + брой оценки + брой завършени продажби

## Значки (цел V1.1)

Примери (threshold-и, които са data-driven):

- “Rising seller”: ≥ 10 завършени продажби
- “Trusted seller”: ≥ 50 завършени продажби + силен рейтинг + нисък % спорове
- “Top seller”: ≥ 200 завършени продажби + много нисък % спорове

## Правила (anti-gaming)

- Само paid + completed поръчки се броят за “sales”
- Изключваме fraud и пълни refund-и по вина на продавача
- Значките могат да се отнемат, ако метриките паднат (с cooldown прозорец)
`,
  },
  {
    title: "Продукт: B2B нетуъркинг (бъдещо)",
    slug: "prd-b2b-networking-future",
    category: "product",
    status: "draft",
    content: `# Продукт: B2B нетуъркинг (бъдещо)

Това е future модул. Постура: **деферираме**, докато V1 стане стабилен.

## Цел

Verified бизнеси/дистрибутори да се свързват за sourcing и партньорства.

## Hard requirements

- Достъп само за verified бизнеси (KYB)
- Силни rate limits + репорт + enforcement
- Отделна повърхност от consumer чата

## Рискове

- Спам и abuse
- Висок модераторски товар

## Решение

Не се изгражда преди плащания + спорове + модерация да са production-stable.
`,
  },
  {
    title: "Правно: Юрисдикции и наличност (чернова)",
    slug: "legal-jurisdictions-availability",
    category: "legal",
    status: "draft",
    content: `# Правно: Юрисдикции и наличност (чернова)

Вътрешен документ за планиране. Не е правен съвет.

## Пускане

- Основен пазар: България
- Разширяване: EU/EEA при готови Stripe + операции + съответствие

## Какво определя наличност

- Stripe наличност (плащания + Connect изплащания)
- consumer protection изисквания
- защита на данните (GDPR за EU/EEA)
- санкции/забранени територии (винаги изключени)
- ops капацитет (support, спорове, език за модерация)

## Чеклист (преди да включим държава)

- бележки от legal review
- Terms/Privacy обновени за юрисдикцията
- playbooks готови и екипът е подсигурен
- мониторинг и incident response готови
`,
  },
  {
    title: "Политика: Поверителност (чернова)",
    slug: "policy-privacy-draft",
    category: "policies",
    status: "draft",
    content: `# Политика: Поверителност (чернова)

Вътрешен outline. Не е правен съвет.

## Категории данни

- акаунт/профил
- обяви и активност
- съобщения (според retention правила)
- поръчки и payment metadata (Stripe ids, суми)
- доказателства за спорове и модерация

## Процесори

- Stripe (плащания, Connect онбординг)
- Supabase (база, auth, storage)
- email/SMS доставчик (нотификации)

## Retention (за финализиране)

- транзакции: счетоводен/правен период
- съобщения: безопасност + спорове
- доказателства: по-дълго от dispute прозореца
`,
  },
  {
    title: "Политика: Условия за ползване (чернова)",
    slug: "policy-terms-draft",
    category: "policies",
    status: "draft",
    content: `# Политика: Условия за ползване (чернова)

Вътрешен outline. Не е правен съвет.

## Покрива

- акаунти и изисквания
- правила за обяви + забранени артикули
- такси (Защита на купувача, бизнес такса продавач, абонаменти, буустове)
- плащания (Stripe; без COD за V1)
- условия за освобождаване на изплащания
- спорове/възстановявания и доказателства
- enforcement (банове, сваляне на обяви)
`,
  },
  {
    title: "Монетизация: Хибридна защита на купувача (v1)",
    slug: "monetization-hybrid-buyer-protection-v1",
    category: "plans",
    status: "draft",
    content: `# Монетизация: Хибридна защита на купувача (v1)

## Модел (недискутиран)

- Лични продавачи: **0% такса продавач** (получават 100% от цената)
- Бизнеси: **малка такса продавач** (0.5–1.5%)
- Купувачи: такса **Защита на купувача** (прозрачна, процент + фиксирана, с таван)

## Формула за такса „Защита на купувача“

\`\`\`
buyer_fee = min(
  item_price * buyer_protection_percent + buyer_protection_fixed,
  buyer_protection_cap
)
\`\`\`

## Текуща таблица с такси (по план)

| Тип акаунт | План | Такса продавач | Защита на купувача |
|-----------:|------|----------------|--------------------|
| Личен | Free | 0% | 4% + €0.50 (таван €15) |
| Личен | Plus | 0% | 3.5% + €0.40 (таван €14) |
| Личен | Pro | 0% | 3% + €0.30 (таван €12) |
| Бизнес | Free | 1.5% | 3% + €0.35 (таван €12) |
| Бизнес | Pro | 1% | 2.5% + €0.25 (таван €10) |
| Бизнес | Enterprise | 0.5% | 2% + €0.20 (таван €8) |

## Буустове (v1)

Буустовете са опционални платени добавки за видимост. Те не са задължителни за основните продажби.

| SKU | Продължителност | Цена |
|-----|------------------|------|
| \`boost_24h\` | 24 часа | €0.99 |
| \`boost_7d\` | 7 дни | €4.99 |
| \`boost_30d\` | 30 дни | €14.99 |

Бележки:

- Буустовете включени в плановете са **24ч кредити** (не 7д/30д).
- Буустнатите обяви трябва да са обозначени (напр. „Бууст“ / „Реклама“).

## Защо този модел е правилният (обобщение)

- Комисионите в C2C често се заобикалят → 0% за лични продавачи.
- Купувачите приемат такса за защита, когато стойността е ясна (ескроу + спорове).
- Бизнесите могат да плащат за професионални нужди (фактури, табла, инструменти).

## Отворени въпроси

- Показваме ли всички такси в EUR, BGN или и двете (и какъв курс)?
- Какъв е стандартният прозорец за авто-потвърждение след доставка (48ч vs 72ч)?
`,
  },
  {
    title: "Буустове: пакети, подреждане и възстановявания (v1)",
    slug: "boosts-packs-ranking-refunds-v1",
    category: "plans",
    status: "draft",
    content: `# Буустове: пакети, подреждане и възстановявания (v1)

## Бууст SKU-та (v1)

Всички такси за бууст са в **EUR** (Stripe).

| SKU | Продължителност | Цена |
|-----|------------------|------|
| \`boost_24h\` | 24 часа | €0.99 |
| \`boost_7d\` | 7 дни | €4.99 |
| \`boost_30d\` | 30 дни | €14.99 |

## Поведение на подреждане (v1)

- Буустнатите обяви са **преди** небуустнатите в рамките на същия фийд/филтър/сортиране.
- Между буустнатите подредбата е:
  1) по-късен \`boost_expires_at\` първи
  2) след това нормалното сортиране на фийда (напр. най-нови)
- Буустнатите обяви трябва да са обозначени (напр. „Бууст“ / „Реклама“).

## Ограничения (v1)

- Обявата може да има **най-много 1 активен бууст**.
- Само собственикът на обявата може да купи бууст.
- Буустовете не отменят модерация. Ако обява е свалена/скрита, буустът се счита за изразходван.

## Възстановявания (v1)

- Ако буустът не се активира поради грешка на платформата, даваме **възстановяване** или **кредит за бууст**.
- След като буустът е активен/изразходван, той е **невъзстановим**, освен при доказани сривове или измама.
`,
  },
  {
    title: "Матрица лимити и ограничения (v1)",
    slug: "limits-guardrails-matrix-v1",
    category: "plans",
    status: "draft",
    content: `# Матрица лимити и ограничения (v1)

## Права по планове (v1)

### Лични

| План | Макс. активни обяви | Буустове / месец | Аналитика | Приоритетна поддръжка |
|------|----------------------|------------------|-----------|-----------------------|
| Free | 30 | 0 | Няма | Не |
| Plus | 150 | 2× 24ч буустове | Базова | Не |
| Pro | 500 | 5× 24ч буустове | Пълна | Да |

### Бизнес

| План | Макс. активни обяви | Буустове / месец | Достъп до \`/dashboard\` | Места в екипа |
|------|----------------------|------------------|--------------------------|----------------|
| Business Free | 100 | 0 | Не | – |
| Business Pro | 2,000 | 20× 24ч буустове | Да | До 3 |
| Business Enterprise | Без лимит | 50× 24ч буустове | Да (пълно) | Без лимит |

## Оперативни ограничения (v1)

| Област | Правило | За кого | Стойност |
|--------|--------|---------|---------|
| Верификация | Потвърден имейл | Всички | Задължително за транзакции |
| Верификация | Потвърден телефон | Продавачи | Задължително преди продажба |
| Верификация | Stripe Connect онбординг | Продавачи | Задължително преди изплащане |
| Верификация | Бизнес верификация | Бизнес акаунти | Нужно за етикет „Business“ |
| Доставка | Прозорец за изпращане | Продавачи | Ако не е изпратено до 7 дни → купувачът може да откаже + възстановяване |
| Доставка | Авто-потвърждение | Поръчки | 72ч след доставка без спор |
| Спорове | Прозорец за спор | Купувачи | До 72ч след доставка |
| Спорове | SLA за отговор | Продавачи | 48ч за отговор с доказателства |
| Доказателства | Снимки | Купувачи | 48ч за „грешен/повреден“ артикул |
| Изплащания | Ескроу освобождаване | Платформа | Без превод преди потвърждение/авто-потвърждение и без спор |
| Възстановявания | Такса „Защита на купувача“ | Вина на продавач/спор спечелен | Да |
| Буустове | Един активен бууст | Продавачи | Налага се |
| Буустове | Етикет „Бууст“ | UI | Винаги показвай „Бууст“ / „Реклама“ |
`,
  },
  {
    title: "Пътна карта: Обхват за пускане V1",
    slug: "roadmap-v1-launch-scope",
    category: "roadmap",
    status: "draft",
    content: `# Пътна карта: Обхват за пускане V1

## Цел

Да пуснем безопасен, завършен marketplace MVP (в стил Vinted). **Без наложен платеж**.

## Задължително за V1

- Обяви: създаване/редакция, снимки, категории, търсене/разглеждане
- Чат: купувач ↔ продавач
- Checkout: Stripe плащане + такса „Защита на купувача“
- Поръчки: жизнен цикъл, статуси, разписки
- Изплащания: Stripe Connect (Express) онбординг + правила за освобождаване
- Рейтинги/отзиви: минимум необходимото
- Trust & safety: сигнали, блокиране, базова модерация
- Връщания/възстановявания + приемане на спорове (минимум)

## Пускови условия (без тях не пускаме)

- Идемпотентност на уебкуковете е потвърдена
- Потокът за възстановяване е тестван край-до-край
- Написани са плейбуци за поддръжка (refunds, спорове, измами)
- Мониторинг + аларми за платежни провали и забавени уебкукове
`,
  },
  {
    title: "Плащания: Stripe Connect и освобождаване от ескроу",
    slug: "payments-stripe-connect-escrow-release",
    category: "payments",
    status: "draft",
    content: `# Плащания: Stripe Connect и освобождаване от ескроу

## Модел

Използваме **Separate Charges and Transfers**:

- Купувачът плаща към основния Stripe акаунт
- Преводът към Connected Account на продавача се случва само след:
  - потвърждение на доставка, или
  - решение по спор

## Минимални статуси на поръчка

- pending_payment → paid → shipped → delivered → completed
- cancelled / refunded
- disputed

## Уебкукове (минимум)

- payment_intent.succeeded / payment_intent.payment_failed
- charge.refunded
- charge.dispute.created / charge.dispute.closed
- account.updated (Connect онбординг)

## Отворени въпроси

- Изискваме ли телефонна верификация преди Stripe онбординг?
- Кои куриери поддържаме за тракинг във V1?
`,
  },
  {
    title: "Политика: Връщания и възстановявания (v1)",
    slug: "policy-returns-refunds-v1",
    category: "policies",
    status: "draft",
    content: `# Връщания и възстановявания (v1)

## Цели

- Предвидими резултати за купувачи и продавачи
- Намаляване на измамите със семпъл UX

## Базови правила

- Плащанията са през платформата (Stripe). Наложен платеж не се поддържа.
- Възстановяванията се обработват чрез Stripe.

## Типични допустими сценарии

- Не е изпратено в разрешения прозорец → отказ + възстановяване
- Не е получено (проблем с тракинг) → спор → възстановяване при потвърждение
- Не отговаря на описанието / повредено / фалшиво → спор с доказателства

## Поток за спор (минимум)

1. Купувачът отваря спор (причина + доказателства)
2. Продавачът отговаря в рамките на SLA
3. Решение от поддръжката:
   - възстановяване на купувача, или
   - освобождаване на средствата към продавача, или
   - частично възстановяване
`,
  },
  {
    title: "План за пускане (v1)",
    slug: "launch-plan-v1",
    category: "ops",
    status: "draft",
    content: `# План за пускане (v1)

## Преди пускане

- Политики финализирани (връщания/възстановявания, забранени артикули, KYC)
- Stripe Connect онбординг + уебкукове валидирани
- Поддръжката е описана и тествана
- Създадена начална наличност (доверени продавачи, партньорства)

## Седмица на пускане

- Поетапно разгръщане (покани/лист с изчакване при нужда)
- Ежедневен мониторинг: плащания, спорове, сигнали за измама, crash rate
- Строги правила за rollback при регресии в плащанията

## След пускане

- Подобряване на онбординг конверсията („Купи“ vs „Продай“ CTA)
- Добавяне на липсващи функции, открити в реална употреба
- Стартиране на growth цикли (реферали, SEO, партньорства)
`,
  },
  {
    title: "KPIs и метрики (v1)",
    slug: "kpis-metrics-v1",
    category: "plans",
    status: "draft",
    content: `# KPIs и метрики (v1)

## North Star (избери 1 основен)

- **GMV (Gross Merchandise Value)**
- **Завършени поръчки** (поръчки със статус \`completed\`)

## Фунил KPIs (купувач)

| Етап | Метрика | Определение |
|-----:|---------|-------------|
| Осведоменост | сесии | уникални посещения (по локал + устройство) |
| Намерение | търсене | % сесии, които търсят |
| Разглеждане | PDP прегледи | прегледи на детайлна страница |
| Конверсия | старт на checkout | checkout стартира / PDP прегледи |
| Плащане | платена конверсия | платени поръчки / старт на checkout |
| Изпълнение | доставени | доставени / платени |
| Успех | завършени | завършени / платени |

## Supply KPIs (продавач)

- активирани продавачи (≥1 обява)
- процент завършени обяви
- sell-through rate (поръчки / активни обяви)
- време до първа продажба

## Trust KPIs (недискутирани)

- спорен процент (спорове / платени)
- процент възстановявания (възстановени / платени)
- chargeback rate (chargebacks / платени)
- време за решаване на спорове

## Оперативен ритъм

- Ежедневно: уебкук лаг, платежни провали, опашка със спорове
- Седмично: NSM + фунил + supply + trust преглед
- Месечно: юнит икономика и риск преглед

## Stop-the-line тригери (чернова)

- грешка при освобождаване на изплащания (всякаква)
- уебкук лаг над праг (да се дефинира)
- скок в chargeback rate (да се дефинира)
`,
  },
  {
    title: "Юнит икономика (v1)",
    slug: "unit-economics-v1",
    category: "plans",
    status: "draft",
    content: `# Юнит икономика (v1)

## Модел на таксите (по план)

Такса „Защита на купувача“:

\`\`\`
buyer_fee = min(
  item_price * buyer_protection_percent + buyer_protection_fixed,
  buyer_protection_cap
)
\`\`\`

Такса продавач (бизнес):

\`\`\`
seller_fee = item_price * seller_fee_percent
\`\`\`

## Пример (Личен Free, артикул €50)

- Такса купувач: \`min(€50×4% + €0.50, €15) = €2.50\`
- Общо за купувача: \`€52.50\`
- Продавачът получава: \`€50.00\`
- Платформен брутен приход (преди разходи): \`€2.50\`

## Разходи за моделиране

- Stripe обработка (променлив + фиксиран)
- възстановявания/chargebacks (loss rate)
- разход за поддръжка на спор (време + инструменти)
- буфер за загуби от измама

## Марж на принос (опростено)

\`\`\`
contribution = buyer_fee + seller_fee
  - stripe_cost
  - refunds_loss
  - support_allocation
\`\`\`

## Изисквания

- Записвай компонентите на таксите в поръчката при покупка (без ретроактивни промени).
- Плановете/таксите са конфигурируеми в БД (без хардкод).
`,
  },
  {
    title: "Go-to-Market (България) (v1)",
    slug: "gtm-bulgaria-v1",
    category: "ops",
    status: "draft",
    content: `# Go-to-Market (България) (v1)

## Позициониране (кратко)

- **Без наложен платеж**
- **Защита на купувача**
- **Потвърдени продавачи + бизнеси**
- **Модерен UX**

## Фаза 0: Seed на наличност (T-30 → T-7)

- привличане на доверени ранни продавачи (качествена наличност)
- онбординг на верифицирани бизнеси (плътност в ключови категории)
- избор на 3–5 „wedge“ категории за първоначална победа

## Фаза 1: Пускане (T-7 → T+14)

- контролирано разгръщане (покани/лист с изчакване при нужда)
- ежедневен мониторинг: плащания, спорове, сигнали за измама, crash rate
- стегната обратна връзка с ранните продавачи

## Фаза 2: Growth цикли (T+14 → T+90)

- SEO (индексирани обяви + категорийни страници)
- реферали (по-късно; след стабилни trust метрики)
- партньорства с креатори/инфлуенсъри
- партньорства (куриери, платежно образование, локални бизнеси)

## Отворени въпроси

- Кои са началните ни „wedge“ категории?
- Какъв CAC праг приемаме за тестове с платена реклама?
`,
  },
  {
    title: "Регистър на рисковете (v1)",
    slug: "risk-register-v1",
    category: "ops",
    status: "draft",
    content: `# Регистър на рисковете (v1)

Това е жив регистър. Преглежда се седмично при пускане.

| Риск | Вероятност | Въздействие | Отговорник | Митигиране |
|------|------------|-------------|------------|------------|
| Скок в измами | Средна | Високо | Ops | верификация, лимити, процес за спорове, мониторинг |
| Скок в chargeback-и | Ниска–Средна | Високо | Payments | ясен UX, събиране на доказателства, бърза поддръжка, политика |
| Пропуски в идемпотентността | Средна | Високо | Eng | идемпотентни хендлъри, storage на събития, аларми, replay инструменти |
| Претоварена поддръжка | Средна | Високо | Ops | макроси, workflow-и, админ инструменти, SLA |
| Регулаторна/KYC неяснота | Средна | Високо | Legal/Ops | Stripe Connect първо, политика + retention, преглед от юристи |
| Изтичане извън платформата | Висока | Средна | Product | ниски такси, trust messaging, по-нисък friction |
| Фалшификати | Средна | Високо | Trust | забранени артикули, сваляния, изисквания за доказателства |
`,
  },
  {
    title: "Управление и оперативен ритъм",
    slug: "governance-operating-cadence",
    category: "ops",
    status: "draft",
    content: `# Управление и оперативен ритъм

## Седмичен ритъм

- Преглед на метрики (NSM + trust KPIs)
- Преглед на поддръжка/спорове (основни проблеми, коренни причини)
- План за доставки (какво излиза тази седмица)

## Процес за решения

- Пишем решения (формат DEC) преди големи промени в обхват/такси.
- Предпочитаме малки обратими експерименти.
- Държим „launch gates“ ясни за плащания/доверие.

## Минимална сигурност

- админ маршрути са защитени сървърно
- RLS на чувствителни таблици
- без тайни/PII в логове
`,
  },
  {
    title: "Политика: KYC / KYB / AML (v1)",
    slug: "policy-kyc-kyb-aml-v1",
    category: "policies",
    status: "draft",
    content: `# Политика: KYC / KYB / AML (v1)

## Цел

Предотвратяване на измами и покриване на изискванията на платежния доставчик.

## Какво покрива Stripe

- Connect онбординг събира идентификационни/банкови данни за изплащания.
- Бизнесите предоставят KYB данни през Stripe.

## Какво покрива платформата

- телефонна верификация (анти-спам и възстановяване на акаунт)
- лимити за нови продавачи (ценови лимити, лимити за обяви)
- ръчни прегледи при първи продажби / флагнати спорове

## Обработка на данни (принципи)

- минимизираме това, което съхраняваме (Stripe-хостнат онбординг)
- дефинираме прозорци за retention на верификации и спорове
`,
  },
  {
    title: "Политика: Забранени артикули (v1)",
    slug: "policy-prohibited-items-v1",
    category: "policies",
    status: "draft",
    content: `# Политика: Забранени артикули (v1)

## Винаги забранени

- незаконни стоки (наркотици, оръжия и др.)
- фалшификати и реплики
- крадени артикули
- хакнати акаунти, креденшъли, кодове

## Приложение

- сваляне на обява
- спиране/бан на акаунт
- задържане на средства, когато е позволено от политика/доставчик
`,
  },
  {
    title: "Плащания: Чеклист за уебкукове и идемпотентност",
    slug: "payments-webhooks-idempotency-checklist",
    category: "payments",
    status: "draft",
    content: `# Плащания: Чеклист за уебкукове и идемпотентност

## Недискутирани правила

- уебкуковете са източник на истина
- всеки хендлър е идемпотентен
- без тайни/PII в логове

## Минимални събития

- payment_intent.succeeded / payment_intent.payment_failed
- charge.refunded
- charge.dispute.created / charge.dispute.closed
- account.updated (Connect онбординг)

## Оперативни проверки

- пазим event id и прекратяваме дублирането
- аларми при забавени уебкукове
- refund + dispute потоци са тествани край-до-край в staging
`,
  },
  {
    title: "Админ: Чеклист сигурност и достъп",
    slug: "admin-security-access-checklist",
    category: "ops",
    status: "draft",
    content: `# Админ: Чеклист сигурност и достъп

## Модел на достъп

- само \`role = admin\` има достъп до админ маршрути
- админ Supabase клиент (service role) се използва само след верификация

## Контроли на данни

- RLS на админ таблици: docs/tasks/notes са само за админи
- без изтичане дали админ панел съществува (тихи пренасочвания за не-админи)

## Оперативна хигиена

- без тайни в логовете
- одит на админ действия, свързани с плащания
`,
  },
  {
    title: "Операции: Наръчник за поддръжка (v1)",
    slug: "ops-support-playbook-v1",
    category: "ops",
    status: "draft",
    content: `# Операции: Наръчник за поддръжка (v1)

Това е вътрешният наръчник на Treido за възстановявания, спорове и поддръжка по време на пускането.

## Цели

- Бързи, предвидими решения
- Решения на база доказателства
- Защита на Stripe статуса (нисък chargeback)

## Тагове за прием

- отказ преди изпращане
- продавачът не е изпратил
- не е получено (INR)
- повредено
- не отговаря на описанието
- фалшиво
- тормоз / злоупотреба
- плащания / техническо

## Целеви SLA (пускане)

- Първи отговор: същия ден за плащания/спорове, иначе до 24ч
- Решение по спор: до 48ч след като доказателствата са пълни

## Чеклист доказателства

- таймлайн на поръчката + статус
- тракинг + потвърждение за доставка
- снимки (артикул + опаковка)
- доказателства за несъответствие
- релевантни чат откъси

## Ескалации

- Engineering: разминаване в уебкук/поръчка, проблем с изплащане, системни платежни грешки
- Trust & safety: индикатори за фалшиви артикули, повтарящи се измами
`,
  },
  {
    title: "Операции: Матрица за решаване на спорове (v1)",
    slug: "ops-dispute-resolution-matrix-v1",
    category: "ops",
    status: "draft",
    content: `# Операции: Матрица за решаване на спорове (v1)

Промени само чрез документирано решение (DEC).

| Тип спор | Нужни доказателства | Стандартен резултат | SLA | Бележки |
|---------|---------------------|---------------------|-----|---------|
| Продавачът не е изпратил | няма тракинг след прозореца | възстановяване | 24–48ч | предупреждение за продавача |
| Не е получено (INR) | куриер + тракинг | възстановяване при провал | 24–72ч | ако е маркирано доставено, искаме доказателства от купувача |
| Повредено | снимки на артикул + опаковка | частично/пълно възстановяване | 48ч | според тежестта |
| Не отговаря на описанието | снимки + несъответствие | частично/пълно възстановяване | 48ч | нужни ясни разлики |
| Фалшиво | снимки + индикатори | възстановяване + санкция | 48ч | запазване на доказателства |
| Тормоз/злоупотреба | чат откъси | санкция | 24ч | ограничаване на съобщенията при нужда |

## Безопасност на изплащанията

- Всеки спор блокира изплащане до решение.
- Бъг при изплащане е SEV-0.
`,
  },
  {
    title: "Операции: Наръчник за модерация (v1)",
    slug: "ops-moderation-playbook-v1",
    category: "ops",
    status: "draft",
    content: `# Операции: Наръчник за модерация (v1)

## Цели

- Бързо премахване на забранени/фалшиви артикули
- Намаляване на измами и тормоз
- Последователно прилагане на правилата

## Категории сигнали

- забранени артикули
- фалшиви / реплики
- измама / опит за измама
- тормоз / реч на омразата
- спам / дублирани обяви

## Действия (стъпала)

1. Предупреждение
2. Сваляне на обява
3. Временни ограничения (публикуване или съобщения)
4. Суспендиране
5. Бан (с документация)

## Работа с фалшификати

- сваляне на обява възможно най-бързо
- запазване на доказателства (обява + снимки + чат + поръчка)
- ограничаване на продавача до преглед
`,
  },
  {
    title: "Операции: Реакция при инциденти",
    slug: "ops-incident-response",
    category: "ops",
    status: "draft",
    content: `# Операции: Реакция при инциденти

## Нива на тежест

- SEV-0: плащания/изплащания са счупени, инцидент със сигурност, риск от теч на данни
- SEV-1: checkout е деградирал, засегната е голяма част от потребителите
- SEV-2: частичен outage, основна функция е деградирала
- SEV-3: малък проблем с workaround

## Роли

- Incident commander (IC)
- Scribe
- Technical owner

## Процес

1. Декларирай тежест + отговорник
2. Митигирай (спри щетата)
3. Диагностицирай коренната причина
4. Разреши + верифицирай
5. Postmortem + последващи действия
`,
  },
  {
    title: "Операции: Управление и задържане на данни (чернова)",
    slug: "ops-data-governance-retention-draft",
    category: "legal",
    status: "draft",
    content: `# Операции: Управление и задържане на данни (чернова)

Вътрешна чернова. Съгласувайте с юристи преди външно публикуване.

## Принципи

- минимални права за достъп
- минимизиране на чувствителни данни (Stripe-хостнат онбординг)
- ясни прозорци за задържане
- одитируемост на админ действията

## Категории данни

- PII (имейл, телефон, адреси)
- платежни метаданни (Stripe ids, суми)
- чат съдържание (потребителски съобщения)
- trust артефакти (доказателства, модерационни логове)
- вътрешни ops документи (admin docs/tasks/notes)

## Задържане (за финализиране)

- Поръчки: според законови/счетоводни изисквания
- Чат: само докато е нужно за спорове/сигурност
- Доказателства: по-дълго от прозореца за спорове
- Логове: кратко задържане със защитен достъп
`,
  },
  {
    title: "Документация: Управление",
    slug: "docs-governance",
    category: "guides",
    status: "draft",
    content: `# Документация: Управление

Документацията на Treido живее в три слоя:

1) Канонични инженерни документи (repo \`/docs\`)
2) Компания документи (repo \`/docs-site\`)
3) Оперативни документи (admin \`/admin/docs\`)

## Процес за промяна

- При големи промени (такси, обхват, правила за изплащане): пишем DEC първо.
- Държим отворените въпроси ясни и ги затваряме един по един.
- Предпочитаме малки редакции преди пренаписвания.
`,
  },
]
