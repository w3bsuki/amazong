# 💰 AMAZONG Business Model & Monetization Strategy

## Executive Summary

This document outlines the complete monetization strategy for the Amazong marketplace platform, inspired by Amazon and eBay's proven business models but tailored for the Bulgarian market.

---

## 📊 Revenue Streams

### 1. Commission Fees (Primary Revenue)
Transaction-based fees on every sale.

| Account Tier | Commission Rate |
|--------------|-----------------|
| Basic (Free) | 10% |
| Premium | 7% |
| Business | 5% |

### 2. Subscription Plans (Recurring Revenue)

| Plan | Monthly | Yearly | Features |
|------|---------|--------|----------|
| **Basic** | Free | Free | 10 listings, 10% commission |
| **Premium** | 9.99 лв | 99 лв | Unlimited listings, 7% commission, Premium badge, Analytics |
| **Business** | 29.99 лв | 299 лв | All Premium + 5% commission, Verified badge, API access |

### 3. Boosted Listings (Pay-per-Action)

| Duration | Price |
|----------|-------|
| 7 days | 2.99 лв |
| 14 days | 4.99 лв |
| 30 days | 8.99 лв |

**Benefits of Boosted Listings:**
- Featured in "Препоръчани продукти" (Recommended Products) section
- Higher search ranking
- "Boost" badge visibility
- Priority in category pages

---

## 🏪 Account Tiers

### Basic Account (Free)
**Target:** Casual sellers, trying the platform

**Features:**
- Up to 10 active listings
- Standard search visibility
- 10% commission on sales
- Basic seller dashboard
- Email support

**Restrictions:**
- Cannot boost listings
- No analytics access
- No API access

### Premium Account (9.99 лв/month)
**Target:** Regular sellers, small businesses

**Features:**
- Unlimited active listings
- 7% commission (3% savings)
- "Premium Seller" badge
- Full analytics dashboard
- Priority customer support
- Access to boosted listings
- Bulk listing tools

### Business Account (29.99 лв/month)
**Target:** Established businesses, brands

**Features:**
- Everything in Premium
- 5% commission (5% savings)
- "Verified Business" badge
- Featured in "Top Brands" section
- API access for integrations
- Dedicated account manager
- Custom store page
- Business verification required

---

## 🏷️ Product Tags & Badges System

### Seller-Selected Tags
Tags that sellers can add to their listings:

| Tag | Badge Color | Effect |
|-----|-------------|--------|
| `new` | Green | "NEW" badge |
| `sale` | Red | "SALE" badge, appears in Deals |
| `limited` | Purple | "LIMITED" badge |
| `trending` | Orange | "TRENDING" badge |
| `premium` | Blue | "PREMIUM" badge |
| `handmade` | Amber | "HANDMADE" badge |
| `eco-friendly` | Emerald | "ECO" badge |

### System-Assigned Tags (Automatic)
| Tag | Criteria | Effect |
|-----|----------|--------|
| `bestseller` | Top 10% sales in category | "BESTSELLER" badge |
| `top-rated` | Rating ≥ 4.5, 10+ reviews | Featured in recommendations |
| `verified` | Business account verified | Trust indicator |

---

## 📍 Homepage Section Logic

### "Нови" (Newest) Tab
```sql
SELECT * FROM products 
ORDER BY created_at DESC 
LIMIT 12
```

### "Промоции" (Deals) Tab
```sql
SELECT * FROM products 
WHERE list_price > price 
   OR 'sale' = ANY(tags)
ORDER BY created_at DESC
LIMIT 12
```

### "Топ продажби" (Best Sellers) Tab
```sql
SELECT * FROM products 
ORDER BY review_count DESC, rating DESC 
LIMIT 12
```

### "Оферти на деня" (Deals of Day) Section
```sql
SELECT * FROM products 
WHERE list_price > price 
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY (list_price - price) / list_price DESC
LIMIT 10
```

### "Препоръчани продукти" (Featured/Recommended)
```sql
SELECT p.*, s.tier 
FROM products p
JOIN sellers s ON p.seller_id = s.id
WHERE p.is_boosted = true 
   OR p.is_featured = true
   OR s.tier IN ('premium', 'business')
AND p.rating >= 4.0
ORDER BY p.is_boosted DESC, s.tier DESC, p.rating DESC
LIMIT 12
```

---

## 💳 Payment Integration (Future)

### Recommended Payment Providers for Bulgaria
1. **Stripe** - Primary (supports BGN)
2. **PayPal** - Secondary
3. **ePay.bg** - Local Bulgarian payment
4. **Borica** - Bank card processing

### Payment Flow
1. Buyer pays → Platform holds funds
2. Seller ships product
3. Buyer confirms receipt (or 7-day auto-confirm)
4. Platform releases funds minus commission

---

## 📈 Revenue Projections

### Conservative Estimates (Year 1)

| Metric | Monthly | Yearly |
|--------|---------|--------|
| Active Sellers | 500 | 500 |
| Premium Subscriptions (20%) | 100 × 9.99 лв | 999 лв |
| Business Subscriptions (5%) | 25 × 29.99 лв | 750 лв |
| Average GMV | 50,000 лв | 600,000 лв |
| Commission Revenue (8% avg) | 4,000 лв | 48,000 лв |
| Boost Revenue | 500 лв | 6,000 лв |
| **Total Monthly Revenue** | **~6,250 лв** | **~75,000 лв** |

---

## 🔄 Comparison: Amazon vs eBay vs Amazong

| Feature | Amazon | eBay | Amazong |
|---------|--------|------|---------|
| Individual Seller Fee | $0.99/item | Free (250/mo) | Free (10 listings) |
| Pro/Store Subscription | $39.99/mo | $4.95-$2,999/mo | 9.99-29.99 лв/mo |
| Referral Fee | 8-15% | 10-15% | 5-10% |
| Boosted Listings | Amazon Ads | Promoted Listings | Boost System |
| Business Verification | Brand Registry | Business Seller | Business Account |

---

## 🚀 Implementation Phases

### Phase 1: MVP (Current)
- [x] Basic seller registration
- [x] Product listing with tags
- [x] Normal/Boosted listing selection
- [x] Tag badge display

### Phase 2: Subscriptions
- [ ] Subscription plans page
- [ ] Payment integration (Stripe)
- [ ] Premium/Business upgrade flow
- [ ] Seller tier enforcement

### Phase 3: Analytics & Tools
- [ ] Seller analytics dashboard
- [ ] Bulk listing tools
- [ ] API for Business accounts
- [ ] Automated boost expiry

### Phase 4: Optimization
- [ ] A/B testing for boost pricing
- [ ] Dynamic commission rates
- [ ] Seller performance tiers
- [ ] Loyalty rewards

---

## 📋 Database Schema Summary

```sql
-- Seller Tiers
sellers.tier: 'basic' | 'premium' | 'business'
sellers.commission_rate: 10.00 | 7.00 | 5.00

-- Product Visibility
products.tags: ['new', 'sale', 'limited', ...]
products.is_boosted: boolean
products.boost_expires_at: timestamp
products.listing_type: 'normal' | 'boosted'

-- Subscriptions
subscriptions.plan_type: 'basic' | 'premium' | 'business'
subscriptions.status: 'active' | 'cancelled' | 'expired'
subscriptions.expires_at: timestamp

-- Boost Tracking
listing_boosts.price_paid: decimal
listing_boosts.duration_days: integer
listing_boosts.is_active: boolean
```

---

## ✅ Action Items

1. **Apply Database Migration**
   ```bash
   supabase db push
   # or run: supabase/migrations/20251201000000_seller_tiers_subscriptions.sql
   ```

2. **Create Subscription Plans Page**
   - `/account/plans` - View and upgrade plans
   - `/account/billing` - Payment history

3. **Integrate Payment Provider**
   - Stripe recommended for Bulgaria
   - Handle recurring subscriptions

4. **Add Seller Dashboard Analytics**
   - Sales metrics
   - Boost performance
   - Commission tracking

---

**Last Updated:** December 1, 2025
**Status:** Phase 1 Complete, Phase 2 In Progress
