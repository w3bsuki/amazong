-- Insert comprehensive monetization strategy document
INSERT INTO admin_docs (id, title, slug, category, status, content, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Monetization Strategy v2.0',
  'monetization-strategy-v2',
  'plans',
  'published',
  $DOC$# Monetization Strategy v2.0

**Last Updated:** 2026-01-20
**Status:** Active / Under Review
**Owner:** Product Team

---

## Executive Summary

Treido uses a **hybrid buyer-pays model** optimized for the Bulgarian market:

- **Personal sellers:** 0% commission (compete with OLX)
- **Business sellers:** 0.5-1.5% commission (they expect B2B costs)
- **Buyers:** Pay a transparent "Buyer Protection Fee" (2-4% + fixed)
- **Subscriptions:** Unlock more listings, boosts, and reduced fees

This model:
1. Matches OLX's 0% for casual sellers
2. Provides buyer protection (OLX's weakness)
3. Monetizes through protection fees + subscriptions
4. Rewards high-volume sellers with lower rates

---

## Revenue Streams

### 1. Buyer Protection Fee (Primary)

Charged to buyers at checkout. Covers:
- Escrow/payment holding
- Dispute resolution
- Money-back guarantee
- Customer support costs

| Seller Type | Buyer Protection Fee |
|-------------|---------------------|
| Personal (Free) | 4% + €0.50 |
| Personal (Subscribed) | 2.5-3% + €0.25-0.35 |
| Business (Free) | 2.5% + €0.35 |
| Business (Subscribed) | 1.5-2% + €0.20-0.25 |

### 2. Seller Commission (Business Only)

Only business accounts pay seller commission:

| Business Plan | Seller Commission |
|---------------|-------------------|
| Starter (Free) | 1.5% |
| Pro | 1.0% |
| Enterprise | 0.5% |

Personal sellers always pay **0%**.

### 3. Subscriptions (Growth Revenue)

Subscriptions provide:
- More active listings
- Included boost credits
- Lower transaction fees
- Business tools (/dashboard)

See "Fee Structure" section for full breakdown.

### 4. Visibility Products (Optional)

A-la-carte products:
| Product | Duration | Price |
|---------|----------|-------|
| Boost | 24h | €0.99 |
| Boost | 7d | €4.99 |
| Boost | 30d | €14.99 |
| Urgent Badge | 3d | €0.49 |
| Top in Category | 24h | €1.49 |
| Homepage Featured | 24h | €2.99 |

---

## Fee Structure

### Personal Sellers

| Plan | Monthly | Listings | Seller Fee | Buyer Protection |
|------|---------|----------|------------|------------------|
| **Free** | €0 | 30 | 0% | 4% + €0.50 |
| **Plus** | €9.99 | 150 | 0% | 3% + €0.35 |
| **Pro** | €29.99 | 500 | 0% | 2.5% + €0.25 |

### Business Sellers

| Plan | Monthly | Listings | Seller Fee | Buyer Protection |
|------|---------|----------|------------|------------------|
| **Starter** | €0 | 100 | 1.5% | 2.5% + €0.35 |
| **Pro** | €49.99 | 1,000 | 1.0% | 2% + €0.25 |
| **Enterprise** | €99.99 | Unlimited | 0.5% | 1.5% + €0.20 |

### Example: €50 Item Sale

| Scenario | Seller Gets | Buyer Pays | Total Fee | Platform Net |
|----------|-------------|------------|-----------|--------------|
| Personal Free | €50.00 | €52.50 | 5% | ~€1.25 |
| Personal Pro | €50.00 | €51.50 | 3% | ~€0.75 |
| Business Starter | €49.25 | €51.60 | 4.7% | ~€1.10 |
| Business Enterprise | €49.75 | €50.95 | 2.4% | ~€0.45 |

---

## Unit Economics

### Stripe Processing Fees (Bulgaria/EU)

| Type | Fee |
|------|-----|
| EU cards | 1.5% + €0.25 |
| Non-EU cards | 2.9% + €0.25 |
| Express account transfers | 0.25% |
| Average blended | ~2.0-2.5% |

### Margin Analysis (€50 sale)

**Personal Free seller (4% + €0.50 buyer fee):**
```
Buyer protection collected:  €2.50
Stripe processing:          -€1.00
Stripe transfer:            -€0.13
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform net:                €1.37 (2.7%)
```

**Business Enterprise (0.5% seller + 1.5% + €0.20 buyer):**
```
Seller commission:           €0.25
Buyer protection collected:  €0.95
Stripe processing:          -€1.00
Stripe transfer:            -€0.13
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform net:                €0.07 (0.14%)
```

**Note:** Enterprise is low-margin per transaction but relies on subscription revenue + volume.

### Break-Even Points

| Plan | Monthly Cost | Fee Savings | Break-even Sales |
|------|--------------|-------------|------------------|
| Personal Plus | €9.99 | 1% buyer fee | €1,000/mo |
| Personal Pro | €29.99 | 1.5% buyer fee | €2,000/mo |
| Business Pro | €49.99 | 1% total | €5,000/mo |

---

## Competitive Positioning

### vs. OLX Bulgaria

| Aspect | Treido | OLX |
|--------|--------|-----|
| Seller fee | 0% | 0% |
| Buyer protection | ✅ Yes | ❌ No |
| Safe payments | ✅ Yes | ❌ Cash/bank only |
| Scam risk | Low | High |
| Business tools | ✅ Dashboard | ❌ Limited |

**Positioning:** "Same 0% for sellers, but with buyer protection."

### vs. eBay

| Aspect | Treido | eBay |
|--------|--------|------|
| Seller fee | 0-1.5% | 10-13% |
| Buyer fee | 2-4% | 0% |
| Total fee | 2-5% | 10-13% |

**Positioning:** "70% lower fees than eBay."

### vs. Vinted

| Aspect | Treido | Vinted |
|--------|--------|--------|
| Seller fee | 0% | 0% |
| Buyer fee | 2-4% | 5% + €0.70 |
| Categories | All | Fashion only |

**Positioning:** "Lower fees, more categories."

---

## Marketing Messages

### To Personal Sellers
> "List free. Sell free. Keep 100% of every sale."
> "Zero fees for sellers. Really."

### To Buyers
> "Shop with confidence. Buyer Protection included."
> "Small fee, big peace of mind. Never get scammed."

### To Businesses
> "The lowest marketplace fees in Bulgaria."
> "0.5% commission on Enterprise. Scale without limits."

---

## Implementation Notes

### Database Schema

```sql
-- subscription_plans table columns:
- seller_commission_percent (was: final_value_fee/commission_rate)
- buyer_protection_percent (NEW)
- buyer_protection_fixed (NEW)
```

### Code Changes Required

1. `lib/stripe-connect.ts` - Dynamic fee lookup (currently hardcoded at 10%)
2. Checkout flow - Show buyer protection as line item
3. Plans page - Update fee display and messaging

### Checkout Display

```
Item:                €50.00
Buyer Protection:    €2.50
━━━━━━━━━━━━━━━━━━━━━━━━━━
Total:               €52.50

✓ Money-back guarantee
✓ Secure payment
✓ Dispute resolution included
```

---

## Open Questions

1. **Minimum order value?** Should we require €10+ for online payment to avoid losing money on small transactions?

2. **Fee caps?** Should buyer protection fee cap at €20-30 for expensive items?

3. **Category variations?** Should electronics/vehicles have different fee structures?

4. **Promotional periods?** Launch with reduced fees to acquire users?

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-20 | 2.0 | Hybrid buyer-pays model, business seller fees |
| 2026-01-14 | 1.1 | Added Vinted-style buyer protection concept |
| 2025-12-01 | 1.0 | Initial seller-pays model (deprecated) |
$DOC$,
  now(),
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  updated_at = now();
;
