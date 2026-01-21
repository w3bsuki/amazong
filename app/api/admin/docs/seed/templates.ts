export type AdminDocTemplate = {
  title: string
  slug: string
  category: "policies" | "payments" | "plans" | "roadmap" | "guides" | "general"
  status: "draft" | "published" | "archived"
  content: string
}

export const ADMIN_DOC_TEMPLATES: AdminDocTemplate[] = [
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

- Listings: create/edit, photos, categories, search/browse
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
    category: "plans",
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
    category: "plans",
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
    category: "general",
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
    category: "general",
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
    category: "guides",
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
    category: "guides",
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
    category: "guides",
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
    category: "guides",
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
    category: "guides",
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
    category: "policies",
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
