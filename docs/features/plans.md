# Plans & Subscriptions

## Goal

Offer tiered subscription plans for Personal and Business sellers that reduce buyer fees, increase listing limits, include boost credits, and unlock business tooling. Plans are the primary mechanism for aligning seller investment with platform revenue.

## Current Status

- Requirements: subset of R14 (Business Dashboard) — see REQUIREMENTS.md §R14
- Production: 🟡 Partial — core plan infrastructure works; advanced business features (team seats, API access) not implemented

## Requirements Mapping

| Req ID | Description | Status |
|--------|-------------|--------|
| R14.1 | Dashboard access gating (by subscription tier) | ✅ |
| R14.6 | Subscription management (upgrade, downgrade, cancel) | ✅ |

Plans are closely related to monetization (fee reduction per tier) — see [monetization.md](./monetization.md) for the full fee table.

## Implementation Notes

### Personal Plans

| Plan | Monthly | Active Listings | Seller Fee | Buyer Protection |
|------|---------|-----------------|------------|------------------|
| Free | €0 | 30 | 0% | 4% + €0.50 (cap €15) |
| Plus | €4.99 | 150 | 0% | 3.5% + €0.40 (cap €14) |
| Pro | €9.99 | 500 | 0% | 3% + €0.30 (cap €12) |

### Business Plans

| Plan | Monthly | Active Listings | Seller Fee | Buyer Protection |
|------|---------|-----------------|------------|------------------|
| Free | €0 | 100 | 1.5% | 3% + €0.35 (cap €12) |
| Pro | €49.99 | 2,000 | 1% | 2.5% + €0.25 (cap €10) |
| Enterprise | €99.99 | Unlimited | 0.5% | 2% + €0.20 (cap €8) |

### Boosts

- Paid plans include **monthly boost credits** (24h boosts)
- One-time paid boosts available as add-ons: 24h / 7d / 30d durations
- Boosts increase listing visibility in feed and search results

### Routes

| Path | Group | Auth | Purpose |
|------|-------|------|---------|
| `/plans` | (plans) | public | Pricing page (public comparison) |
| `/account/plans` | (account) | auth | Current plan and billing |
| `/account/plans/upgrade` | (account) | auth | Upgrade flow (modal overlay) |
| `/dashboard/upgrade` | (business) | business | Business plan upgrade |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/plans` | GET | Get all subscription plans |
| `/api/subscriptions/checkout` | POST | Create Stripe checkout session for plan |
| `/api/subscriptions/portal` | POST | Generate Stripe billing portal link |
| `/api/subscriptions/webhook` | POST | Process subscription lifecycle events |

### Server Actions

- `subscriptions.ts` — Subscription checkout, portal access, plan changes

### DB Tables

| Table | Purpose |
|-------|---------|
| `subscription_plans` | Plan definitions: name, Stripe Price ID, listing limits, fee percentages, boost credits |
| `subscriptions` | Active user subscriptions: plan reference, billing period, Stripe subscription ID, status |

### Special Patterns

- **Upgrade modal**: `/account/plans/upgrade` uses a parallel route `@modal` for overlay upgrade without losing account context
- **Stripe Billing Portal**: plan changes, cancellation, and invoice history handled via Stripe's hosted portal
- **Plan enforcement**: listing limit checked at publish time via `/api/seller/limits`; exceeded limits block new listings

## Known Gaps & V1.1+ Items

| Item | Status | Notes |
|------|--------|-------|
| Team seats | ⬜ Deferred | Enterprise feature — must implement before marketing |
| API access | ⬜ Deferred | Enterprise feature — must implement before marketing |
| Annual billing | ⬜ Deferred | Monthly only for V1 |
| Plan trial periods | ⬜ Deferred | No free trials in V1 |
| BGN currency display | ⬜ Deferred | Plans stored in EUR; BGN conversion in UI planned |

## Cross-References

- [monetization.md](./monetization.md) — Full fee model, revenue streams, worked examples
- [PAYMENTS.md](../PAYMENTS.md) — Stripe subscription integration, billing portal
- [DATABASE.md](../DATABASE.md) — subscription_plans, subscriptions tables
- [ROUTES.md](../ROUTES.md) — (plans) and (account) route groups
- `docs/business/monetization.mdx` — Detailed plan pricing and limits

---

*Last updated: 2026-02-08*
