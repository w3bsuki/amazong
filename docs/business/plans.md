# Plans & Perks (Treido.eu)

**Last updated:** 2026-01-14

This doc defines the **plan catalog**: names, pricing, and exactly what each plan unlocks.

Related:
- Monetization model: `docs/business/model.md`
- Phase scope: `docs/roadmap/v1.md`, `docs/roadmap/v2.md`

## Account Types & Surfaces

### Personal (default)

- Primary surface: `/account`
- Selling: `/sell` and `/account/selling`

### Business (verified businesses)

- Everything in Personal, plus **Shopify-style tools** in `/dashboard`
- Business accounts should be gated by verification where required (invoices, badges, higher limits)

### Dashboard modules (what “/dashboard access” means)

When a plan includes `/dashboard`, it includes these product surfaces:

- `/dashboard` (overview)
- `/dashboard/orders`
- `/dashboard/products`
- `/dashboard/inventory`
- `/dashboard/analytics`
- `/dashboard/accounting`
- `/dashboard/customers`
- `/dashboard/discounts`
- `/dashboard/settings`

## Pricing conventions

- **Displayed currency:** BGN (with EUR equivalent where needed)
- **Billing:** Stripe may bill in EUR depending on implementation
- **Annual billing:** 20% discount vs monthly (default policy)

## Plan catalog (recommended for V1 → V2)

Goal: keep it simple (3 personal + 3 business), with clear reasons to upgrade:

- Personal plans focus on **higher limits + included boosts**
- Business plans focus on **/dashboard access + growth tooling**

### Personal plans

| Plan | Price | Active listings | Boosts/mo | Badge | Analytics | Support | `/dashboard` |
|------|-------|-----------------|-----------|-------|----------|---------|--------------|
| Free | 0 BGN | 20 | 0 | — | — | Community | ❌ |
| Premium | 9.99 BGN/mo | 100 | 2 | Premium | Basic | Email | ❌ |
| Pro | 19.99 BGN/mo | 500 | 10 | Pro | Full | Priority | ❌ |

### Business plans

| Plan | Price | Active listings | Boosts/mo | Team | Analytics | Support | `/dashboard` |
|------|-------|-----------------|-----------|------|----------|---------|--------------|
| Business Starter | 49.99 BGN/mo | 2,000 | 20 | 2 seats | Full | Priority | ✅ |
| Business Pro | 99.99 BGN/mo | Unlimited | 50 | 5 seats | Full + exports | Priority | ✅ |
| Business Enterprise | 199.99 BGN/mo | Unlimited | 200 | Unlimited | Custom | Dedicated | ✅ |

Notes:

- All plans can buy extra boosts a-la-carte.
- “Team seats” and “exports/API” are roadmap items if not already implemented; do not sell them until they exist.

## Plan details (what each plan gives)

### Personal — Free

Best for casual sellers.

- Up to 20 active listings
- Buy boosts when needed
- `/account` access

### Personal — Premium

Best for regular sellers.

- 100 active listings
- 2 boosts/month included
- Premium seller badge
- Basic analytics (views, favorites, messages)

### Personal — Pro

Best for power sellers.

- 500 active listings
- 10 boosts/month included
- Pro badge + priority support
- Full analytics (performance, listings, conversion where applicable)

### Business — Business Starter

Best for small businesses that need a dashboard.

- `/dashboard` access (inventory + orders + analytics + marketing)
- 2,000 active listings
- 20 boosts/month included
- Invoice support (when business verification exists)

### Business — Business Pro

Best for growing stores.

- Unlimited listings
- 50 boosts/month included
- Team seats up to 5 (if/when implemented)
- Data exports / API access (if/when implemented)

### Business — Business Enterprise

Best for large sellers / brands.

- Unlimited listings + highest boost allocation
- Dedicated support
- Custom integrations and commercial terms

## V1 vs V2 applicability (avoid confusion)

- **V1 (classifieds-first):** plans primarily control listing limits + included boosts. There is no commission because payments happen off-platform.
- **V2 (payments):** buyer pays on-platform. The recommended model charges a transparent **buyer protection fee** (see `docs/business/model.md`) and keeps seller fees at 0% by default.

## Implementation mapping (developer note)

The plan catalog should map 1:1 to `subscription_plans` (Supabase) fields:

- `account_type`: `personal` / `business`
- `price_monthly`, `price_yearly`, `currency`
- `max_listings` (active listing limit)
- `boosts_included` (monthly credits)
- `analytics_access`, `priority_support`, `badge_type`, `features[]`
