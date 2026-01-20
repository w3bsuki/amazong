# Treido Monetization Strategy - FINALIZED

**Created:** 2026-01-20  
**Last Updated:** 2026-01-20  
**Status:** ✅ FINALIZED - Ready for Implementation  
**Goal:** Best fees in Bulgaria while remaining profitable

---

## 📋 Quick Context for New Chat Sessions

When starting a new chat, reference this file and:
1. Check current DB state: `SELECT * FROM subscription_plans WHERE is_active = true`
2. Check code: `lib/stripe-connect.ts` → Dynamic fee lookup (NEEDS UPDATE)
3. Review this doc for the finalized hybrid model

---

## 🏆 FINAL DECISION: Hybrid Buyer-Protection Model

After comprehensive competitor analysis, we're implementing a **hybrid model** that:
- **Attracts sellers** with 0% seller fees (personal) - matches OLX
- **Monetizes safely** via transparent buyer protection fees
- **Rewards loyalty** with subscription tiers that reduce buyer fees
- **Supports B2B** with reasonable seller fees for businesses (they expect costs)

---

## 🔬 Competitor Analysis (Researched 2026-01-20)

### Bulgarian Market

| Platform | Model | Seller Fee | Buyer Fee | How They Profit |
|----------|-------|------------|-----------|-----------------|
| **OLX.bg** | Classifieds | 0% | 0% | Paid boosts (TOP/Featured), NO buyer protection |
| **Bazar.bg** | Classifieds | 0% | 0% | Advertising, NO buyer protection |

**Key Insight:** Bulgarian users are trained on 0% seller fees. Any seller commission = instant bypass via chat ("pay cash, save X%").

### International C2C Platforms

| Platform | Model | Seller Fee | Buyer Fee | Notes |
|----------|-------|------------|-----------|-------|
| **Vinted** | C2C Fashion | **0%** | **5% + €0.70** | Buyer Protection model - HIGHLY SUCCESSFUL |
| **Depop** | C2C Fashion | **0%** | ~5% | Similar to Vinted |
| **Wallapop** (Spain) | C2C General | 0-3% | €0.99-3.99 shipping protection | Local = free, shipped = fees |
| **Mercari** (US) | C2C General | 10% | 0% | Traditional seller-pays |

### Large B2C/B2B Marketplaces

| Platform | Model | Seller Fee | Buyer Fee | Notes |
|----------|-------|------------|-----------|-------|
| **eBay** | Full Marketplace | **13.6% + $0.30-0.40** | 0% | High fees, global reach |
| **Amazon** | Full Marketplace | **8-15%** referral + $39.99/mo | 0% | FBA adds fulfillment costs |
| **Etsy** | Handmade/Vintage | **6.5%** + $0.20 listing | 0% | Plus payment processing (~3%) |

### Key Learnings

1. **Vinted Model Works:** 0% seller + buyer protection = massive adoption in Europe
2. **eBay is Too Expensive:** 13%+ seller fees work only with global reach
3. **Subscriptions Add Value:** eBay/Amazon stores justify fees with tools + lower rates
4. **Local Competition:** OLX's 0% is unbeatable for sellers, but NO protection = scams
5. **Payment Processing:** Stripe costs ~2-2.5% in EU. Any fee below 3% loses money on small orders.

---

## 💰 FINALIZED Fee Structure

### Core Principles

1. **Seller Fee = 0% (Personal)** - Match OLX, prevent bypass
2. **Buyer Protection Fee** - Buyers pay for safety (Vinted model)
3. **Small Business Seller Fee** - Businesses expect B2B costs
4. **Subscriptions Reduce Fees** - Clear value for upgrades
5. **Minimum Viable Fee** - 3% minimum to cover Stripe costs

### Personal Account Tiers

| Plan | Monthly | Listings | Seller Fee | Buyer Protection | Boosts |
|------|---------|----------|------------|------------------|--------|
| **Free** | €0 | 30 | **0%** | 4.0% + €0.50 | 0 |
| **Plus** | €4.99 | 150 | **0%** | 3.5% + €0.40 | 2/mo |
| **Pro** | €9.99 | 500 | **0%** | 3.0% + €0.30 | 5/mo |

### Business Account Tiers  

| Plan | Monthly | Listings | Seller Fee | Buyer Protection | Boosts |
|------|---------|----------|------------|------------------|--------|
| **Business Free** | €0 | 100 | **1.5%** | 3.0% + €0.35 | 0 |
| **Business Pro** | €49.99 | 2,000 | **1.0%** | 2.5% + €0.25 | 20/mo |
| **Business Enterprise** | €99.99 | ∞ | **0.5%** | 2.0% + €0.20 | 50/mo |

### Fee Caps (Buyer Protection)

| Order Value | Personal Free | Personal Pro | Business Enterprise |
|-------------|---------------|--------------|---------------------|
| Cap at | €15.00 | €12.00 | €8.00 |

**Rationale:** On a €400 item, 4% = €16. Cap prevents excessive fees on high-ticket items.

---

## 📊 Example Fee Calculations

### €50 Item - Personal Free Seller

```
Item price:           €50.00
Buyer Protection:     €2.50 (50 × 4% + €0.50)
────────────────────────────────
Buyer pays:           €52.50
Seller receives:      €50.00 (100%!)

Platform revenue:     €2.50
Stripe costs (~2%):   -€1.05
────────────────────────────────
Net platform:         €1.45 (2.9% effective margin)
```

### €50 Item - Personal Pro Seller  

```
Item price:           €50.00
Buyer Protection:     €1.80 (50 × 3% + €0.30)
────────────────────────────────
Buyer pays:           €51.80
Seller receives:      €50.00 (100%!)

Platform revenue:     €1.80
Stripe costs (~2%):   -€1.04
────────────────────────────────
Net platform:         €0.76 (1.5% margin - acceptable with subscription)
```

### €50 Item - Business Pro Seller

```
Item price:           €50.00
Seller fee (1%):      -€0.50
Buyer Protection:     €1.50 (50 × 2.5% + €0.25)
────────────────────────────────
Buyer pays:           €51.50
Seller receives:      €49.50 (99%!)

Platform revenue:     €2.00
Stripe costs (~2%):   -€1.03
────────────────────────────────
Net platform:         €0.97 (1.9% margin)
```

### €10 Item - Personal Free (Small Order)

```
Item price:           €10.00
Buyer Protection:     €0.90 (10 × 4% + €0.50)
────────────────────────────────
Buyer pays:           €10.90
Seller receives:      €10.00

Platform revenue:     €0.90
Stripe costs:         -€0.45 (1.5% + €0.25)
────────────────────────────────
Net platform:         €0.45 (4.5% margin!)
```

**Key insight:** The fixed €0.50 fee makes small orders MORE profitable percentage-wise.

---

## 🔄 Migration from Current State

### Current DB (Problem)

The current `subscription_plans` table has:
- High seller-pays fees (3-12%)
- No buyer protection columns
- BGN/$ mixed currency references

### Required Changes

1. **Add new columns:**
   - `buyer_protection_percent` DECIMAL(4,2)
   - `buyer_protection_fixed` DECIMAL(5,2)
   - `buyer_protection_cap` DECIMAL(5,2)
   - `seller_fee_percent` DECIMAL(4,2) -- replaces final_value_fee semantics

2. **Update existing plans** with new fee structure

3. **Update code:**
   - `lib/stripe-connect.ts` - Dynamic fee calculation
   - Checkout flow - Show buyer protection fee
   - Plans page - Display new fee structure

---

## 🔧 Implementation Tasks

### Phase 1: Database Schema Update

```sql
-- Migration: Add buyer protection fee structure
-- File: supabase/migrations/YYYYMMDD_buyer_protection_fees.sql

-- Add buyer protection columns to subscription_plans
ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS seller_fee_percent DECIMAL(4,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS buyer_protection_percent DECIMAL(4,2) DEFAULT 4.0,
ADD COLUMN IF NOT EXISTS buyer_protection_fixed DECIMAL(5,2) DEFAULT 0.50,
ADD COLUMN IF NOT EXISTS buyer_protection_cap DECIMAL(5,2) DEFAULT 15.00;

-- Clear existing plans and insert new structure
DELETE FROM public.subscription_plans WHERE is_active = true;

-- Personal Plans
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  seller_fee_percent, buyer_protection_percent, buyer_protection_fixed, buyer_protection_cap,
  boosts_included, priority_support, analytics_access, badge_type, 
  description, description_bg, features, is_active, currency
) VALUES
-- Free
('Free', 'free', 'personal', 0.00, 0.00, 30, 
 0.00, 4.00, 0.50, 15.00,
 0, false, 'none', NULL,
 'Start selling for free. 0% seller fees.',
 'Започнете да продавате безплатно. 0% такси за продавачи.',
 '["30 active listings", "0% seller fee", "8 photos per listing", "30-day duration"]'::jsonb,
 true, 'EUR'),
 
-- Plus
('Plus', 'plus', 'personal', 4.99, 49.90, 150, 
 0.00, 3.50, 0.40, 14.00,
 2, false, 'basic', 'plus',
 'For regular sellers. Lower buyer fees.',
 'За редовни продавачи. По-ниски такси за купувачи.',
 '["150 active listings", "0% seller fee", "Lower buyer protection (3.5%)", "2 boosts/month", "Plus badge"]'::jsonb,
 true, 'EUR'),

-- Pro
('Pro', 'pro', 'personal', 9.99, 99.90, 500, 
 0.00, 3.00, 0.30, 12.00,
 5, true, 'full', 'pro',
 'For power sellers. Best personal rates.',
 'За активни продавачи. Най-добри лични тарифи.',
 '["500 active listings", "0% seller fee", "Lowest buyer protection (3%)", "5 boosts/month", "Pro badge", "Priority support"]'::jsonb,
 true, 'EUR');

-- Business Plans
INSERT INTO public.subscription_plans (
  name, tier, account_type, price_monthly, price_yearly, max_listings, 
  seller_fee_percent, buyer_protection_percent, buyer_protection_fixed, buyer_protection_cap,
  boosts_included, priority_support, analytics_access, badge_type, 
  description, description_bg, features, is_active, currency
) VALUES
-- Business Free
('Business Free', 'free', 'business', 0.00, 0.00, 100, 
 1.50, 3.00, 0.35, 12.00,
 0, false, 'basic', 'business',
 'Free for verified businesses.',
 'Безплатно за верифицирани бизнеси.',
 '["100 active listings", "1.5% seller fee", "3% buyer protection", "Business badge"]'::jsonb,
 true, 'EUR'),

-- Business Pro
('Business Pro', 'professional', 'business', 49.99, 499.90, 2000, 
 1.00, 2.50, 0.25, 10.00,
 20, true, 'full', 'business_pro',
 'Professional tools for growing businesses.',
 'Професионални инструменти за растящи бизнеси.',
 '["2,000 active listings", "1% seller fee", "2.5% buyer protection", "20 boosts/month", "/dashboard access"]'::jsonb,
 true, 'EUR'),

-- Business Enterprise
('Business Enterprise', 'enterprise', 'business', 99.99, 999.90, NULL, 
 0.50, 2.00, 0.20, 8.00,
 50, true, 'full', 'enterprise',
 'Best rates for high-volume businesses.',
 'Най-добри тарифи за високообемни бизнеси.',
 '["Unlimited listings", "0.5% seller fee", "2% buyer protection (lowest)", "50 boosts/month", "Dedicated support"]'::jsonb,
 true, 'EUR');
```

### Phase 2: Update Stripe Connect Code

```typescript
// lib/stripe-connect.ts - UPDATED

import "server-only"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import type Stripe from "stripe"

/**
 * Fee structure for a transaction based on seller's plan.
 */
export interface TransactionFees {
  sellerFeePercent: number
  buyerProtectionPercent: number
  buyerProtectionFixed: number
  buyerProtectionCap: number
}

/**
 * Get fee structure for a seller based on their subscription tier.
 */
export async function getFeesForSeller(sellerId: string): Promise<TransactionFees> {
  const supabase = await createClient()
  
  // Get seller's tier and account type
  const { data: seller } = await supabase
    .from("sellers")
    .select("tier, account_type")
    .eq("id", sellerId)
    .single()
  
  if (!seller) {
    // Default to personal free tier
    return {
      sellerFeePercent: 0,
      buyerProtectionPercent: 4.0,
      buyerProtectionFixed: 0.50,
      buyerProtectionCap: 15.00
    }
  }
  
  // Get plan fees
  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("seller_fee_percent, buyer_protection_percent, buyer_protection_fixed, buyer_protection_cap")
    .eq("tier", seller.tier || "free")
    .eq("account_type", seller.account_type || "personal")
    .eq("is_active", true)
    .single()
  
  return {
    sellerFeePercent: plan?.seller_fee_percent ?? 0,
    buyerProtectionPercent: plan?.buyer_protection_percent ?? 4.0,
    buyerProtectionFixed: plan?.buyer_protection_fixed ?? 0.50,
    buyerProtectionCap: plan?.buyer_protection_cap ?? 15.00
  }
}

/**
 * Calculate all fees for a transaction.
 */
export function calculateTransactionFees(
  itemPriceEur: number,
  fees: TransactionFees
): {
  sellerFee: number
  buyerProtectionFee: number
  sellerReceives: number
  buyerPays: number
  platformRevenue: number
} {
  // Calculate seller fee
  const sellerFee = itemPriceEur * (fees.sellerFeePercent / 100)
  
  // Calculate buyer protection (percentage + fixed, capped)
  const buyerProtectionRaw = (itemPriceEur * (fees.buyerProtectionPercent / 100)) + fees.buyerProtectionFixed
  const buyerProtectionFee = Math.min(buyerProtectionRaw, fees.buyerProtectionCap)
  
  return {
    sellerFee: Math.round(sellerFee * 100) / 100,
    buyerProtectionFee: Math.round(buyerProtectionFee * 100) / 100,
    sellerReceives: Math.round((itemPriceEur - sellerFee) * 100) / 100,
    buyerPays: Math.round((itemPriceEur + buyerProtectionFee) * 100) / 100,
    platformRevenue: Math.round((sellerFee + buyerProtectionFee) * 100) / 100
  }
}
```

### Phase 3: Checkout Flow Update

Update checkout to show buyer protection fee as a separate line item:

```
────────────────────────────────
Item:                    €50.00
Buyer Protection:         €2.50
────────────────────────────────
Total:                   €52.50
────────────────────────────────
```

### Phase 4: Plans Page Update

- Update messaging: "Sellers: 0% fees"
- Show buyer protection rates by tier
- Add interactive calculator: "See what buyers pay"

---

## 📚 Reference Files

| File | Purpose | Status |
|------|---------|--------|
| `lib/stripe-connect.ts` | Platform fee calculation | ⚠️ NEEDS UPDATE |
| `app/[locale]/(checkout)/_actions/checkout.ts` | Checkout flow | ⚠️ NEEDS UPDATE |
| `app/[locale]/(plans)/_components/plans-page-client.tsx` | Plans UI | ⚠️ NEEDS UPDATE |
| `docs/business/model.md` | Monetization model doc | ⚠️ UPDATE |
| `docs/business/plans.md` | Full plan catalog | ⚠️ UPDATE |
| `supabase/migrations/` | DB schema | 📝 NEW MIGRATION |

---

## 📈 Competitive Positioning

### Marketing Messages

**To Sellers:**
> "List free. Sell free. Keep 100% of every sale."
> "0% seller fees - the same as OLX, but with buyer protection."
> "Lower fees than any marketplace in Bulgaria."

**To Buyers:**
> "Shop with confidence. Buyer Protection included."
> "Small fee, big peace of mind. No scams."
> "Secure payment, full refund if item doesn't arrive."

**To Businesses:**
> "The lowest fees for verified businesses."
> "Scale with enterprise plans. Just 0.5% commission."
> "Professional tools, competitive rates."

### Comparison Table (For Marketing)

| Feature | Treido | OLX.bg | eBay | Vinted |
|---------|--------|--------|------|--------|
| Seller fee (personal) | **0%** | 0% | 10-13% | 0% |
| Seller fee (business) | **0.5-1.5%** | 0% | 10-13% | N/A |
| Buyer protection | ✅ **3-4%** | ❌ None | ✅ | ✅ 5%+€0.70 |
| Safe payments | ✅ | ❌ | ✅ | ✅ |
| Business tools | ✅ | Limited | ✅ | ❌ |
| Local market | ✅ Bulgaria | ✅ | ⚠️ Global | ⚠️ Fashion |

---

## 🗓️ Implementation Roadmap

### Week 1: Database & Core
- [ ] Create new migration with fee columns
- [ ] Update subscription_plans data
- [ ] Update lib/stripe-connect.ts

### Week 2: Checkout & UI
- [ ] Update checkout to show buyer protection
- [ ] Update plans page with new messaging
- [ ] Add fee calculator component

### Week 3: Testing & Docs
- [ ] Test all fee scenarios
- [ ] Update docs/business/model.md
- [ ] Update docs/business/plans.md
- [ ] Create admin documentation

### Week 4: Launch
- [ ] Deploy to production
- [ ] Monitor fee calculations
- [ ] Gather user feedback

---

## 📝 Decision Log

### 2026-01-20 - FINALIZED
**Decision:** Hybrid Buyer-Protection Model

**Rationale:**
1. Vinted model is proven successful in Europe
2. 0% seller matches OLX, prevents bypass
3. Buyers accept protection fees (value is clear)
4. Business seller fees are industry standard
5. Subscriptions add clear value (fee reductions + tools)

**Approved fees:**
- Personal: 0% seller / 3-4% + €0.30-0.50 buyer
- Business: 0.5-1.5% seller / 2-3% + €0.20-0.35 buyer
- Caps: €8-15 depending on tier

---

## 💬 Context for New Sessions

**TL;DR:**
1. **Treido** = Bulgarian marketplace competing with OLX.bg
2. **Bulgaria EUR** = January 2026, EUR is primary currency
3. **OLX = 0% fees** but full of scams, no buyer protection
4. **Our model** = Vinted-style: 0% seller + buyer protection fee
5. **Personal** = 0% seller fee, buyers pay 3-4% protection
6. **Business** = 0.5-1.5% seller fee + lower buyer protection
7. **Current code is wrong** = `PLATFORM_FEE_PERCENT = 10` is hardcoded, needs dynamic lookup

**Key goal:** Best fees in Bulgaria (< 5% total) while profitable after Stripe costs (~2.5%).
