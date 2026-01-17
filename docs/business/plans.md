# Plans & Perks (Treido.eu)

**Last updated:** 2026-01-17

This doc defines the **plan catalog**: names, pricing, and exactly what each plan unlocks.

Related:
- Monetization model: `docs/business/model.md`
- Phase scope: `docs/roadmap/v1.md`, `docs/roadmap/v2.md`
- Market research: `docs/research/bulgarian-market-2026.md`

---

## Account Types & Surfaces

### Personal (default)

- Primary surface: `/account`
- Selling: `/sell` and `/account/selling`

### Business (verified businesses)

- Everything in Personal, plus **Shopify-style tools** in `/dashboard`
- Business accounts should be gated by verification where required (invoices, badges, higher limits)

### Dashboard modules (what "/dashboard access" means)

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

---

## Pricing Strategy

### Market Context (Bulgaria, January 2026)

Bulgaria adopted the Euro on January 1, 2026. Our pricing is designed to be:
- **20-30% lower than OLX.bg** for market entry
- **Competitive with Bazar.bg** (which is mostly free)
- **Simple and transparent** (unlike OLX's complex tier system)

### Pricing Conventions

- **Primary currency:** EUR (Euro) — Bulgaria's new official currency
- **Display:** EUR, with BGN reference during transition period
- **Billing:** Stripe in EUR
- **Annual billing:** ~17% discount vs monthly (2 months free)

---

## Plan Catalog (V1 Launch)

Goal: Simple structure (3 personal + 3 business) with clear upgrade value.

### Personal Plans

| Plan | Monthly | Yearly | Active Listings | Photos/listing | Duration | Boosts/mo | Badge | Analytics | Support |
|------|---------|--------|-----------------|----------------|----------|-----------|-------|-----------|---------|
| **Free** | €0 | €0 | 20 | 8 | 30 days | 0 | — | — | Community |
| **Premium** | €4.99 | €49.90 | 100 | 15 | 60 days | 2 | Premium | Basic | Email |
| **Pro** | €9.99 | €99.90 | 500 | 20 | 90 days | 10 | Pro | Full | Priority |

### Business Plans

| Plan | Monthly | Yearly | Active Listings | Photos/listing | Duration | Boosts/mo | Team | Analytics | Support | Dashboard |
|------|---------|--------|-----------------|----------------|----------|-----------|------|-----------|---------|-----------|
| **Business Starter** | €24.99 | €249.90 | 2,000 | 25 | 90 days | 20 | 2 seats | Full | Priority | ✅ |
| **Business Pro** | €49.99 | €499.90 | 5,000 | 30 | Unlimited | 50 | 5 seats | Full + exports | Priority | ✅ |
| **Business Enterprise** | €99.99 | €999.90 | Unlimited | Unlimited | Unlimited | 200 | Unlimited | Custom | Dedicated | ✅ |

### Comparison to OLX.bg

| Feature | Treido Free | OLX Free | Advantage |
|---------|-------------|----------|-----------|
| Active listings | 20 | Limited by annual quota | Treido |
| Photos per listing | 8 | 8 | Equal |
| Listing duration | 30 days | 30 days | Equal |
| Categories | All | Limited per category | Treido |

---

## Boost Pricing (A-la-carte)

### V1 Boost Products

| Product | Duration | Price (EUR) | OLX Equivalent | Notes |
|---------|----------|-------------|----------------|-------|
| **Boost (Standard)** | 24 hours | €0.75 | ~€1+ (Bronze) | Entry-level, test market |
| **Boost (Week)** | 7 days | €2.99 | ~€3+ (Silver) | Expected bestseller |
| **Boost (Month)** | 30 days | €9.99 | ~€8+ (Gold) | Power sellers |
| **Urgent Badge** | 3 days | €0.49 | N/A | Cosmetic, high margin |
| **Top in Category** | 24 hours | €1.49 | Similar | Limited inventory |
| **Homepage Featured** | 24 hours | €2.99 | ~€5+ | Premium placement |

### Boost Bundles (Planned)

| Bundle | Contents | Price | Savings |
|--------|----------|-------|---------|
| **Starter Pack** | 3 × Week Boost | €7.99 | 11% |
| **Power Pack** | 5 × Week Boost + 2 × Homepage | €19.99 | 17% |
| **Business Pack** | 10 × Week Boost + 5 × Top Category | €39.99 | 20% |

### Boost Allocation by Plan

| Plan | Monthly Boost Credits | Value (if purchased) |
|------|----------------------|----------------------|
| Free | 0 | €0 |
| Premium | 2 | €6 |
| Pro | 10 | €30 |
| Business Starter | 20 | €60 |
| Business Pro | 50 | €150 |
| Business Enterprise | 200 | €600 |

**Note:** Unused boosts do NOT roll over.

---

## Feature Comparison Matrix

### Personal Plans

| Feature | Free | Premium | Pro |
|---------|------|---------|-----|
| **Active listings** | 20 | 100 | 500 |
| **Photos per listing** | 8 | 15 | 20 |
| **Listing duration** | 30 days | 60 days | 90 days |
| **Boosts included** | 0 | 2/mo | 10/mo |
| **Seller badge** | ❌ | ⭐ Premium | 🌟 Pro |
| **Analytics** | ❌ | Basic | Full |
| **Priority in search** | ❌ | ❌ | ✅ Slight |
| **Support** | Community | Email | Priority |
| **Featured seller** | ❌ | ❌ | Eligible |
| **API access** | ❌ | ❌ | ❌ |

### Business Plans

| Feature | Starter | Pro | Enterprise |
|---------|---------|-----|------------|
| **Active listings** | 2,000 | 5,000 | Unlimited |
| **Photos per listing** | 25 | 30 | Unlimited |
| **Listing duration** | 90 days | Unlimited | Unlimited |
| **Boosts included** | 20/mo | 50/mo | 200/mo |
| **Team members** | 2 | 5 | Unlimited |
| **Dashboard access** | ✅ | ✅ | ✅ |
| **Inventory management** | ✅ | ✅ | ✅ |
| **Analytics exports** | ❌ | ✅ | ✅ |
| **API access** | ❌ | Read-only | Full |
| **Priority in search** | ✅ | ✅ | ✅ Max |
| **Support** | Priority | Priority | Dedicated |
| **Custom branding** | ❌ | ❌ | ✅ |
| **Invoice support** | ✅ | ✅ | ✅ |
| **Bulk import** | ❌ | ✅ | ✅ |

---

## Plan Details

### Personal — Free

**Best for:** Casual sellers, first-time users

**Includes:**
- Up to 20 active listings
- 8 photos per listing
- 30-day listing duration (auto-expire)
- Buy boosts a-la-carte
- `/account` access
- Community support (forums, FAQ)

**Limitations:**
- No included boosts
- No analytics
- No seller badge

### Personal — Premium (€4.99/mo)

**Best for:** Regular sellers who want visibility

**Includes:**
- Up to 100 active listings
- 15 photos per listing
- 60-day listing duration
- 2 boosts/month included
- ⭐ Premium seller badge (trust signal)
- Basic analytics (views, favorites, messages)
- Email support

**Upgrade value:** Included boosts worth €6/mo

### Personal — Pro (€9.99/mo)

**Best for:** Power sellers, semi-professional

**Includes:**
- Up to 500 active listings
- 20 photos per listing
- 90-day listing duration
- 10 boosts/month included
- 🌟 Pro badge + slight priority in search
- Full analytics (performance, conversion tracking)
- Priority email support
- Eligible for "Featured Seller" program

**Upgrade value:** Included boosts worth €30/mo

### Business — Business Starter (€24.99/mo)

**Best for:** Small businesses getting started

**Includes:**
- `/dashboard` access (full business tooling)
- Up to 2,000 active listings
- 25 photos per listing
- 90-day listing duration
- 20 boosts/month included
- 2 team member seats
- Full analytics
- Priority support
- Invoice/VAT support
- Priority in search

### Business — Business Pro (€49.99/mo)

**Best for:** Growing businesses with inventory

**Includes:**
- Everything in Starter, plus:
- Up to 5,000 active listings
- 30 photos per listing
- Unlimited listing duration
- 50 boosts/month included
- 5 team member seats
- Analytics exports (CSV, PDF)
- Read-only API access
- Bulk listing import

### Business — Business Enterprise (€99.99/mo)

**Best for:** Large retailers, brands, agencies

**Includes:**
- Everything in Pro, plus:
- Unlimited listings
- Unlimited photos per listing
- 200 boosts/month included
- Unlimited team members
- Full API access
- Custom analytics and reporting
- Dedicated account manager
- Custom branding options
- SLA guarantees
- Custom contract terms available

---

## V1 vs V2 Applicability

- **V1 (classifieds-first):** plans primarily control listing limits + included boosts. There is no commission because payments happen off-platform.
- **V2 (payments):** buyer pays on-platform. The recommended model charges a transparent **buyer protection fee** (see `docs/business/model.md`) and keeps seller fees at 0% by default.

---

## Implementation Mapping (Developer Note)

The plan catalog should map 1:1 to `subscription_plans` (Supabase) fields:

- `account_type`: `personal` / `business`
- `price_monthly`, `price_yearly`, `currency`
- `max_listings` (active listing limit)
- `max_photos_per_listing`
- `listing_duration_days` (null = unlimited)
- `boosts_included` (monthly credits)
- `analytics_access`: `none` / `basic` / `full` / `custom`
- `priority_support`: boolean
- `badge_type`: `null` / `premium` / `pro` / `business`
- `features[]`: JSON array of feature flags
- `team_seats`: number (null = unlimited)
- `has_dashboard`: boolean
- `api_access`: `none` / `read` / `full`

### Stripe Product/Price IDs

| Plan | Product ID | Monthly Price ID | Yearly Price ID |
|------|------------|------------------|-----------------|
| Premium | `prod_treido_premium` | `price_premium_monthly` | `price_premium_yearly` |
| Pro | `prod_treido_pro` | `price_pro_monthly` | `price_pro_yearly` |
| Business Starter | `prod_treido_business_starter` | `price_starter_monthly` | `price_starter_yearly` |
| Business Pro | `prod_treido_business_pro` | `price_business_pro_monthly` | `price_business_pro_yearly` |
| Business Enterprise | `prod_treido_enterprise` | `price_enterprise_monthly` | `price_enterprise_yearly` |

*Note: Replace with actual Stripe IDs after creation*

---

## FAQ

### Can I upgrade/downgrade anytime?
Yes. Upgrades are prorated. Downgrades take effect at the next billing cycle.

### What happens to my boosts if I downgrade?
Unused boosts remain until the end of the current billing period.

### Can I buy extra boosts beyond my plan?
Yes, all users can purchase boosts a-la-carte at any time.

### What if I exceed my listing limit?
You cannot publish new listings until you remove some or upgrade.

### Are there annual discounts?
Yes, yearly plans save ~17% (equivalent to 2 months free).

### Can I get a refund?
Within the first 14 days if you haven't used premium features extensively. See Terms of Service.

---

## Notes

- All plans can buy extra boosts a-la-carte.
- "Team seats" and "exports/API" are roadmap items; do not sell until implemented.
- Prices are set for market entry; may be adjusted after 6 months based on data.

