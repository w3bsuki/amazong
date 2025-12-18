# 🏆 Complete Verification & Badge System

> **Production-Ready System for Marketplace Trust & Gamification**  
> Version: 1.0 | Date: December 2025

---

## 📑 Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Account Types & Flow](#account-types--flow)
4. [Badge System Design](#badge-system-design)
   - [Seller Badges (Personal)](#seller-badges-personal)
   - [Seller Badges (Business)](#seller-badges-business)
   - [Buyer Badges](#buyer-badges)
5. [Verification System](#verification-system)
6. [Rating & Review System](#rating--review-system)
7. [Database Schema](#database-schema)
8. [Business Rules & Thresholds](#business-rules--thresholds)
9. [Implementation Plan](#implementation-plan)
10. [UI/UX Considerations](#uiux-considerations)

---

## 📋 Executive Summary

This document outlines a comprehensive **Trust & Gamification System** that:

- ✅ Distinguishes **Personal** vs **Business** sellers at registration
- ✅ Awards **performance-based badges** to incentivize good behavior
- ✅ Implements **buyer ratings** for two-way trust
- ✅ Creates **verification tiers** for both account types
- ✅ Enables **searchable/filterable** seller types
- ✅ Promotes **gamification** to drive engagement

### Key Principle
> Users who **buy only** don't need personal/business designation - they're just "buyers"  
> Users who **sell** MUST choose personal/business to enable proper filtering and profiles

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER ACCOUNT STRUCTURE                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐                                                      │
│   │   PROFILE    │ ◄── Base user (auth.users + profiles table)         │
│   │   (Buyer)    │     Every user starts here                          │
│   └──────┬───────┘                                                      │
│          │                                                              │
│          ▼                                                              │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │              WANTS TO SELL? → /sell page                      │     │
│   └──────────────────────────────────────────────────────────────┘     │
│          │                                                              │
│          ├──────────────────┬──────────────────────────────────┐       │
│          ▼                  ▼                                   │       │
│   ┌──────────────┐   ┌──────────────┐                          │       │
│   │   PERSONAL   │   │   BUSINESS   │                          │       │
│   │    SELLER    │   │    SELLER    │                          │       │
│   │              │   │              │                          │       │
│   │ - Avatar     │   │ - Logo       │                          │       │
│   │ - Bio        │   │ - Company    │                          │       │
│   │ - Instagram- │   │ - VAT/EIK    │                          │       │
│   │   style      │   │ - Website    │                          │       │
│   │   profile    │   │ - Social     │                          │       │
│   │              │   │ - Shopify-   │                          │       │
│   │              │   │   style      │                          │       │
│   └──────────────┘   └──────────────┘                          │       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 👤 Account Types & Flow

### 1. Pure Buyer (No Store)
- **Profile only** - basic user account
- Can purchase, leave reviews, message sellers
- Gets **buyer badges** based on purchase history
- **No personal/business designation needed**

### 2. Personal Seller
- Individual selling personal items, handmade goods, side hustle
- **Instagram-style profile**: avatar, bio, social links
- Subject to **personal seller badges** based on performance
- Simpler verification (ID optional, not required for basic selling)

### 3. Business Seller
- Registered business/professional seller
- **Shopify-style profile**: logo, company info, VAT/EIK, multiple social links, business address
- Subject to **business seller badges** and **verification levels**
- Can get **Verified Business** badge with document verification

---

## 🏅 Badge System Design

### Core Badge Categories

| Category | Who Gets It | Based On |
|----------|-------------|----------|
| **Seller Milestone** | Personal/Business Sellers | Listings count, sales volume |
| **Seller Rating** | Personal/Business Sellers | Review scores, feedback |
| **Seller Special** | Personal/Business Sellers | Manual awards, achievements |
| **Buyer Milestone** | All Buyers | Purchase history |
| **Buyer Rating** | All Buyers | Seller feedback on buyer |
| **Verification** | Both | Document/identity verification |
| **Subscription** | Sellers | Paid plan badges |

---

### 🏷️ Seller Badges (Personal)

Personal sellers get badges that feel "individual" and friendly:

#### Milestone Badges (Based on Listings/Sales)

| Badge Name | Criteria | Icon | Color |
|------------|----------|------|-------|
| **New Seller** | 0 active listings (just created store) | 🌱 | `gray` |
| **Getting Started** | 1-10 active listings | 🚀 | `blue` |
| **Active Seller** | 11-25 active listings | ⚡ | `cyan` |
| **Power Seller** | 26-100 active listings | 💪 | `purple` |
| **Super Seller** | 100+ active listings | 🔥 | `orange` |

#### Sales Volume Badges

| Badge Name | Criteria | Icon | Color |
|------------|----------|------|-------|
| **First Sale** | 1 completed sale | 🎉 | `green` |
| **Rising Star** | 10+ completed sales | ⭐ | `yellow` |
| **Trusted Seller** | 50+ completed sales | ✅ | `emerald` |
| **Established** | 100+ completed sales | 🏆 | `gold` |
| **Elite Seller** | 500+ completed sales | 👑 | `amber` |
| **Legend** | 1000+ completed sales | 💎 | `diamond` |

#### Rating Badges (Based on Feedback)

| Badge Name | Criteria | Icon | Color |
|------------|----------|------|-------|
| **Well Reviewed** | 4.0+ avg rating, 10+ reviews | ⭐⭐⭐⭐ | `yellow` |
| **Highly Rated** | 4.5+ avg rating, 25+ reviews | 🌟 | `amber` |
| **Top Rated** | 4.8+ avg rating, 50+ reviews | 🏅 | `gold` |
| **Exceptional** | 4.9+ avg rating, 100+ reviews | 🏆 | `gradient-gold` |

#### Special Achievement Badges (Personal)

| Badge Name | Criteria | Icon | Color |
|------------|----------|------|-------|
| **Fast Shipper** | 95%+ orders shipped within 24h (min 20 orders) | 📦 | `blue` |
| **Quick Responder** | <2hr avg response time, 50+ conversations | 💬 | `cyan` |
| **Repeat Seller** | 30%+ repeat customers | 🔄 | `purple` |
| **Community Favorite** | 100+ store followers | ❤️ | `pink` |
| **Veteran** | Account 2+ years old with consistent activity | 🎖️ | `slate` |

---

### 🏢 Seller Badges (Business)

Business sellers get badges that feel "professional" and corporate:

#### Business Milestone Badges

| Badge Name | Criteria | Icon | Color |
|------------|----------|------|-------|
| **New Business** | Just registered as business seller | 🏢 | `gray` |
| **Emerging Business** | 1-50 active listings | 📈 | `blue` |
| **Growing Business** | 51-200 active listings | 📊 | `indigo` |
| **Established Business** | 201-500 active listings | 🏛️ | `purple` |
| **Enterprise** | 500+ active listings | 🌐 | `violet` |

#### Business Sales Volume

| Badge Name | Criteria | Icon | Color |
|------------|----------|------|-------|
| **First Business Sale** | 1 completed sale | 📝 | `green` |
| **Active Business** | 25+ completed sales | 📋 | `teal` |
| **Thriving Business** | 100+ completed sales | 💼 | `emerald` |
| **Top Business** | 500+ completed sales | 🏆 | `gold` |
| **Market Leader** | 2000+ completed sales | 👑 | `amber` |
| **Industry Giant** | 10000+ completed sales | 💎 | `diamond` |

#### Business Verification Badges

| Badge Name | Criteria | Icon | Color |
|------------|----------|------|-------|
| **Verified Business** | VAT/EIK verified via registry lookup | ✓ | `blue` |
| **Verified Pro** | Full document verification + VAT | ✓✓ | `emerald` |
| **Verified Enterprise** | On-site verification + dedicated manager | ✓✓✓ | `gold` |

#### Business Rating Badges

| Badge Name | Criteria | Icon | Color |
|------------|----------|------|-------|
| **Trusted Business** | 4.0+ avg rating, 25+ reviews | ⭐ | `yellow` |
| **Preferred Business** | 4.5+ avg rating, 100+ reviews | 🌟 | `amber` |
| **Premium Business** | 4.8+ avg rating, 250+ reviews | 🏅 | `gold` |
| **Excellence Award** | 4.9+ avg rating, 500+ reviews | 🏆 | `gradient-gold` |

---

### 🛒 Buyer Badges

Buyers get badges too! This creates two-way trust and incentivizes good buyer behavior:

#### Purchase Milestone Badges

| Badge Name | Criteria | Icon | Color |
|------------|----------|------|-------|
| **New Buyer** | 0 purchases (just joined) | 👋 | `gray` |
| **First Purchase** | 1 completed order | 🎉 | `green` |
| **Active Shopper** | 5+ completed orders | 🛍️ | `blue` |
| **Frequent Buyer** | 25+ completed orders | 💳 | `purple` |
| **VIP Shopper** | 100+ completed orders | 💎 | `violet` |
| **Platinum Buyer** | 500+ completed orders | 👑 | `gold` |

#### Buyer Rating Badges (From Seller Feedback)

Sellers can rate buyers after transactions:

| Badge Name | Criteria | Icon | Color |
|------------|----------|------|-------|
| **Good Buyer** | 4.0+ avg rating from sellers, 5+ ratings | ⭐ | `yellow` |
| **Great Buyer** | 4.5+ avg rating from sellers, 15+ ratings | 🌟 | `amber` |
| **Excellent Buyer** | 4.8+ avg rating from sellers, 30+ ratings | 🏅 | `gold` |
| **Dream Customer** | 4.9+ avg rating from sellers, 50+ ratings | 💫 | `gradient-gold` |

#### Buyer Engagement Badges

| Badge Name | Criteria | Icon | Color |
|------------|----------|------|-------|
| **Helpful Reviewer** | 10+ product reviews left | 📝 | `blue` |
| **Review Expert** | 50+ product reviews, avg 3+ helpfulness | ✍️ | `purple` |
| **Conversation Starter** | Messaged 10+ different sellers | 💬 | `cyan` |
| **Loyal Follower** | Following 20+ stores | ❤️ | `pink` |
| **Wishlist Pro** | 100+ items in wishlist | 📋 | `orange` |

---

## ✅ Verification System

### Personal Seller Verification Levels

| Level | Name | Requirements | Trust Score |
|-------|------|--------------|-------------|
| 0 | **Unverified** | Just created store | 0 |
| 1 | **Email Verified** | Confirmed email (automatic via auth) | +10 |
| 2 | **Phone Verified** | Added & verified phone number | +15 |
| 3 | **ID Verified** | Uploaded government ID (optional) | +25 |
| 4 | **Address Verified** | Confirmed physical address | +15 |
| 5 | **Fully Verified** | All above complete | +35 |

**Max Personal Trust Score: 100 points**

### Business Seller Verification Levels

| Level | Name | Requirements | Trust Score |
|-------|------|--------------|-------------|
| 0 | **Unverified Business** | Selected "business" at registration | 0 |
| 1 | **Basic Business** | Email + phone verified | +15 |
| 2 | **Registered Business** | VAT/EIK number validated via API | +30 |
| 3 | **Document Verified** | Business registration docs reviewed | +25 |
| 4 | **Address Verified** | Business address confirmed | +15 |
| 5 | **Premium Verified** | Bank account/payment method verified | +15 |

**Max Business Trust Score: 100 points**

### Buyer Trust Score

| Level | Name | Requirements | Trust Score |
|-------|------|--------------|-------------|
| 0 | **New** | Just registered | 0 |
| 1 | **Email Verified** | Confirmed email | +15 |
| 2 | **Phone Verified** | Added phone | +15 |
| 3 | **Payment Verified** | Completed a purchase | +20 |
| 4 | **Established** | 5+ completed orders, no disputes | +25 |
| 5 | **Trusted** | 20+ orders, 0 disputes, good ratings | +25 |

**Max Buyer Trust Score: 100 points**

### Trust Score Display

```
Trust Score: 85/100 ████████░░
```

---

## ⭐ Rating & Review System

### Product Reviews (Existing - Enhanced)

```typescript
interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;           // Buyer
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;            // NEW: Review title
  comment?: string;
  images?: string[];         // NEW: Review images
  verified_purchase: boolean; // NEW: Did they actually buy it?
  helpful_count: number;     // NEW: How many found this helpful
  created_at: Date;
  updated_at: Date;
}
```

### Seller Feedback (Existing - From Buyer to Seller)

```typescript
interface SellerFeedback {
  id: string;
  buyer_id: string;
  seller_id: string;
  order_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  // Category ratings (eBay-style)
  item_as_described: boolean;
  shipping_speed: boolean;
  communication: boolean;
  created_at: Date;
}
```

### **NEW: Buyer Feedback (From Seller to Buyer)**

Sellers can rate buyers after order completion:

```typescript
interface BuyerFeedback {
  id: string;
  seller_id: string;
  buyer_id: string;
  order_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  // Category ratings
  payment_promptness: boolean;  // Did they pay quickly?
  communication: boolean;       // Were they responsive?
  reasonable_expectations: boolean; // Were requests reasonable?
  created_at: Date;
}
```

### Feedback Restrictions

- Seller can leave buyer feedback **only after order is delivered**
- Buyer can leave seller feedback **only after order is delivered**
- Feedback can be edited within **30 days**
- Disputed feedback goes to admin review
- Both parties can **respond** to feedback (visible publicly)

---

## 💾 Database Schema

### New Tables

```sql
-- =====================================================
-- VERIFICATION & BADGE SYSTEM - COMPLETE SCHEMA
-- =====================================================

-- =====================================================
-- 1. BADGE DEFINITIONS (What badges exist)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.badge_definitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,           -- 'new_seller', 'top_rated', etc.
  name TEXT NOT NULL,                  -- Display name
  name_bg TEXT,                        -- Bulgarian translation
  description TEXT,
  description_bg TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'seller_milestone', 'seller_rating', 'seller_special',
    'buyer_milestone', 'buyer_rating', 'buyer_special',
    'verification', 'subscription'
  )),
  account_type TEXT CHECK (account_type IN ('personal', 'business', 'buyer', 'all')),
  icon TEXT,                           -- Emoji or icon name
  color TEXT,                          -- Tailwind color class
  tier INTEGER DEFAULT 0,              -- For ordering/hierarchy
  is_automatic BOOLEAN DEFAULT true,   -- Auto-awarded vs manual
  is_active BOOLEAN DEFAULT true,
  -- Criteria (JSONB for flexibility)
  criteria JSONB DEFAULT '{}',         -- {"min_sales": 50, "min_rating": 4.8}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. USER BADGES (Which users have which badges)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badge_definitions(id) ON DELETE CASCADE NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  awarded_by UUID REFERENCES public.profiles(id),  -- NULL = automatic
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT,
  metadata JSONB DEFAULT '{}',         -- Additional context
  UNIQUE(user_id, badge_id)
);

-- =====================================================
-- 3. VERIFICATION STATUS (Per user)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_verification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  -- Verification flags
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  phone_number TEXT,
  id_verified BOOLEAN DEFAULT false,
  id_document_type TEXT,               -- 'passport', 'id_card', 'drivers_license'
  id_verified_at TIMESTAMPTZ,
  address_verified BOOLEAN DEFAULT false,
  address_verified_at TIMESTAMPTZ,
  -- Trust score (calculated)
  trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. BUSINESS VERIFICATION (For business sellers only)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.business_verification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE UNIQUE NOT NULL,
  -- Business details
  legal_name TEXT,
  vat_number TEXT,
  eik_number TEXT,                     -- Bulgarian company ID
  vat_verified BOOLEAN DEFAULT false,
  vat_verified_at TIMESTAMPTZ,
  -- Document verification
  registration_doc_url TEXT,
  registration_verified BOOLEAN DEFAULT false,
  registration_verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  -- Bank verification
  bank_verified BOOLEAN DEFAULT false,
  bank_verified_at TIMESTAMPTZ,
  -- Overall status
  verification_level INTEGER DEFAULT 0 CHECK (verification_level >= 0 AND verification_level <= 5),
  verification_notes TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. BUYER FEEDBACK (Sellers rating buyers)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.buyer_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  -- Category ratings
  payment_promptness BOOLEAN DEFAULT true,
  communication BOOLEAN DEFAULT true,
  reasonable_expectations BOOLEAN DEFAULT true,
  -- Seller response
  seller_response TEXT,
  seller_response_at TIMESTAMPTZ,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- One feedback per order
  UNIQUE(seller_id, buyer_id, order_id)
);

-- =====================================================
-- 6. SELLER STATS (Cached/Aggregated for performance)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.seller_stats (
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE PRIMARY KEY,
  -- Listing stats
  total_listings INTEGER DEFAULT 0,
  active_listings INTEGER DEFAULT 0,
  -- Sales stats
  total_sales INTEGER DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  -- Rating stats
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  five_star_reviews INTEGER DEFAULT 0,
  positive_feedback_pct DECIMAL(5, 2) DEFAULT 0,
  -- Category ratings
  item_described_pct DECIMAL(5, 2) DEFAULT 100,
  shipping_speed_pct DECIMAL(5, 2) DEFAULT 100,
  communication_pct DECIMAL(5, 2) DEFAULT 100,
  -- Engagement stats
  follower_count INTEGER DEFAULT 0,
  response_time_hours DECIMAL(5, 2),
  response_rate_pct DECIMAL(5, 2) DEFAULT 100,
  -- Shipping performance
  shipped_on_time_pct DECIMAL(5, 2) DEFAULT 100,
  -- Dates
  first_sale_at TIMESTAMPTZ,
  last_sale_at TIMESTAMPTZ,
  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. BUYER STATS (Cached/Aggregated)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.buyer_stats (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  -- Purchase stats
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  -- Rating stats (from sellers)
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  -- Engagement
  reviews_written INTEGER DEFAULT 0,
  stores_following INTEGER DEFAULT 0,
  wishlist_count INTEGER DEFAULT 0,
  conversations_started INTEGER DEFAULT 0,
  -- Dispute stats
  disputes_opened INTEGER DEFAULT 0,
  disputes_won INTEGER DEFAULT 0,
  -- Timestamps
  first_purchase_at TIMESTAMPTZ,
  last_purchase_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. ENHANCED REVIEWS (Add missing columns)
-- =====================================================
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS seller_response TEXT,
ADD COLUMN IF NOT EXISTS seller_response_at TIMESTAMPTZ;

-- =====================================================
-- 9. ENHANCED SELLER FEEDBACK (Add response)
-- =====================================================
ALTER TABLE public.seller_feedback
ADD COLUMN IF NOT EXISTS buyer_response TEXT,
ADD COLUMN IF NOT EXISTS buyer_response_at TIMESTAMPTZ;

-- =====================================================
-- 10. ADD ACCOUNT TYPE TO SELLERS (If not exists)
-- =====================================================
ALTER TABLE public.sellers
ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'personal' 
  CHECK (account_type IN ('personal', 'business'));

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON public.user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_awarded ON public.user_badges(awarded_at);

CREATE INDEX IF NOT EXISTS idx_user_verification_user ON public.user_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verification_trust ON public.user_verification(trust_score);

CREATE INDEX IF NOT EXISTS idx_business_verification_seller ON public.business_verification(seller_id);
CREATE INDEX IF NOT EXISTS idx_business_verification_vat ON public.business_verification(vat_number);

CREATE INDEX IF NOT EXISTS idx_buyer_feedback_buyer ON public.buyer_feedback(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_feedback_seller ON public.buyer_feedback(seller_id);
CREATE INDEX IF NOT EXISTS idx_buyer_feedback_rating ON public.buyer_feedback(rating);

CREATE INDEX IF NOT EXISTS idx_seller_stats_rating ON public.seller_stats(average_rating);
CREATE INDEX IF NOT EXISTS idx_seller_stats_sales ON public.seller_stats(total_sales);

CREATE INDEX IF NOT EXISTS idx_buyer_stats_rating ON public.buyer_stats(average_rating);
CREATE INDEX IF NOT EXISTS idx_buyer_stats_orders ON public.buyer_stats(total_orders);

CREATE INDEX IF NOT EXISTS idx_sellers_account_type ON public.sellers(account_type);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_stats ENABLE ROW LEVEL SECURITY;

-- Badge definitions - public read
CREATE POLICY "badge_definitions_select" ON public.badge_definitions
  FOR SELECT USING (is_active = true);

-- User badges - public read (to show on profiles)
CREATE POLICY "user_badges_select" ON public.user_badges
  FOR SELECT USING (revoked_at IS NULL);

-- User verification - owner can view, limited public view
CREATE POLICY "user_verification_select_own" ON public.user_verification
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_verification_update_own" ON public.user_verification
  FOR UPDATE USING (auth.uid() = user_id);

-- Business verification - owner and admin
CREATE POLICY "business_verification_select_own" ON public.business_verification
  FOR SELECT USING (
    seller_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Buyer feedback - public read
CREATE POLICY "buyer_feedback_select" ON public.buyer_feedback
  FOR SELECT USING (true);

CREATE POLICY "buyer_feedback_insert" ON public.buyer_feedback
  FOR INSERT WITH CHECK (
    seller_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_id 
      AND status IN ('delivered', 'completed')
      AND EXISTS (
        SELECT 1 FROM order_items 
        WHERE order_id = orders.id AND seller_id = auth.uid()
      )
    )
  );

-- Stats - public read
CREATE POLICY "seller_stats_select" ON public.seller_stats
  FOR SELECT USING (true);

CREATE POLICY "buyer_stats_select" ON public.buyer_stats
  FOR SELECT USING (true);
```

---

## 📊 Business Rules & Thresholds

### Badge Award Thresholds (JSONB criteria examples)

```json
// Seller Milestone Badges
{
  "new_seller": {"max_listings": 0},
  "getting_started": {"min_listings": 1, "max_listings": 10},
  "active_seller": {"min_listings": 11, "max_listings": 25},
  "power_seller": {"min_listings": 26, "max_listings": 100},
  "super_seller": {"min_listings": 101}
}

// Sales Volume Badges
{
  "first_sale": {"min_sales": 1},
  "rising_star": {"min_sales": 10},
  "trusted_seller": {"min_sales": 50},
  "established": {"min_sales": 100},
  "elite_seller": {"min_sales": 500},
  "legend": {"min_sales": 1000}
}

// Rating Badges
{
  "well_reviewed": {"min_rating": 4.0, "min_reviews": 10},
  "highly_rated": {"min_rating": 4.5, "min_reviews": 25},
  "top_rated": {"min_rating": 4.8, "min_reviews": 50},
  "exceptional": {"min_rating": 4.9, "min_reviews": 100}
}

// Buyer Badges
{
  "first_purchase": {"min_orders": 1},
  "active_shopper": {"min_orders": 5},
  "frequent_buyer": {"min_orders": 25},
  "vip_shopper": {"min_orders": 100},
  "platinum_buyer": {"min_orders": 500}
}
```

### Badge Evaluation Schedule

| Frequency | What's Evaluated |
|-----------|------------------|
| **Real-time** | First sale, first purchase, verification status changes |
| **Hourly** | Listing counts, active listings |
| **Daily** | Rating averages, sales totals, response times |
| **Weekly** | Shipping performance, repeat customer rates |

### Trust Score Calculation

```typescript
function calculateSellerTrustScore(verification: UserVerification, stats: SellerStats): number {
  let score = 0;
  
  // Verification points (max 40)
  if (verification.email_verified) score += 10;
  if (verification.phone_verified) score += 15;
  if (verification.id_verified) score += 10;
  if (verification.address_verified) score += 5;
  
  // Performance points (max 60)
  if (stats.total_sales >= 10) score += 10;
  if (stats.total_sales >= 50) score += 10;
  if (stats.average_rating >= 4.0) score += 10;
  if (stats.average_rating >= 4.5) score += 10;
  if (stats.positive_feedback_pct >= 95) score += 10;
  if (stats.shipped_on_time_pct >= 95) score += 10;
  
  return Math.min(score, 100);
}
```

---

## 🚀 Implementation Plan

### Phase 1: Database Setup (Week 1)
- [ ] Create migration file with all new tables
- [ ] Add seed data for badge definitions
- [ ] Create database functions for stats calculation
- [ ] Set up triggers for automatic stat updates

### Phase 2: Backend Logic (Week 1-2)
- [ ] Create badge evaluation service
- [ ] Create trust score calculation service
- [ ] Create stats aggregation cron jobs
- [ ] Add API endpoints for badge data

### Phase 3: Seller Profile Updates (Week 2)
- [ ] Update create-store-wizard for personal/business selection
- [ ] Add verification status to seller dashboard
- [ ] Display badges on store profiles
- [ ] Add badge section to account settings

### Phase 4: Buyer Features (Week 2-3)
- [ ] Add buyer feedback UI for sellers
- [ ] Display buyer badges on profiles
- [ ] Add buyer stats to account page
- [ ] Implement buyer rating prompts

### Phase 5: Search & Filtering (Week 3)
- [ ] Add account_type filter to search
- [ ] Add badge filters (Top Rated, Verified Business)
- [ ] Add trust score sorting option
- [ ] Update product cards to show seller badges

### Phase 6: Polish & Optimization (Week 3-4)
- [ ] Badge animation on award
- [ ] Badge detail modals
- [ ] Performance optimization
- [ ] A/B testing badge visibility

---

## 🎨 UI/UX Considerations

### Badge Display Priority

On limited space (product cards), show badges in this order:
1. **Verification badge** (Verified Business, ID Verified)
2. **Rating badge** (Top Rated, Highly Rated)
3. **Subscription badge** (Pro, Enterprise)
4. **Milestone badge** (Elite Seller, Power Seller)

### Badge Colors (Tailwind)

```typescript
const BADGE_COLORS = {
  // Verification
  verified: "bg-blue-500 text-white",
  verified_pro: "bg-emerald-500 text-white",
  verified_enterprise: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
  
  // Ratings
  top_rated: "bg-gradient-to-r from-yellow-400 to-amber-500 text-black",
  highly_rated: "bg-amber-500 text-white",
  well_reviewed: "bg-yellow-500 text-black",
  
  // Milestones - Personal
  new_seller: "bg-gray-400 text-white",
  getting_started: "bg-blue-400 text-white",
  active_seller: "bg-cyan-500 text-white",
  power_seller: "bg-purple-500 text-white",
  super_seller: "bg-orange-500 text-white",
  
  // Milestones - Business
  new_business: "bg-gray-500 text-white",
  emerging_business: "bg-blue-500 text-white",
  growing_business: "bg-indigo-500 text-white",
  established_business: "bg-purple-600 text-white",
  enterprise: "bg-violet-600 text-white",
  
  // Sales
  first_sale: "bg-green-500 text-white",
  rising_star: "bg-yellow-400 text-black",
  trusted_seller: "bg-emerald-500 text-white",
  established: "bg-amber-600 text-white",
  elite_seller: "bg-amber-500 text-white",
  legend: "bg-gradient-to-r from-cyan-400 to-blue-500 text-white",
  
  // Buyer
  vip_shopper: "bg-violet-500 text-white",
  platinum_buyer: "bg-gradient-to-r from-gray-300 to-gray-400 text-black",
  dream_customer: "bg-gradient-to-r from-pink-400 to-purple-500 text-white",
};
```

### Badge Component Example

```tsx
interface BadgeProps {
  badge: BadgeDefinition;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

function SellerBadge({ badge, size = "md", showTooltip = true }: BadgeProps) {
  const sizeClasses = {
    sm: "h-4 px-1.5 text-[10px]",
    md: "h-5 px-2 text-xs",
    lg: "h-6 px-3 text-sm",
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className={cn(
            "inline-flex items-center gap-1 rounded-full font-medium",
            sizeClasses[size],
            BADGE_COLORS[badge.code]
          )}>
            <span>{badge.icon}</span>
            <span>{badge.name}</span>
          </span>
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent>
            <p className="font-medium">{badge.name}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
```

### Store Profile Badge Section

```tsx
function StoreProfileBadges({ badges }: { badges: UserBadge[] }) {
  // Group badges by category
  const grouped = groupBy(badges, b => b.badge_definition.category);
  
  return (
    <div className="space-y-4">
      {/* Verification badges - always first */}
      {grouped.verification && (
        <div className="flex flex-wrap gap-2">
          {grouped.verification.map(b => (
            <SellerBadge key={b.id} badge={b.badge_definition} size="lg" />
          ))}
        </div>
      )}
      
      {/* Performance badges */}
      <div className="flex flex-wrap gap-1.5">
        {[...grouped.seller_rating || [], ...grouped.seller_milestone || []].map(b => (
          <SellerBadge key={b.id} badge={b.badge_definition} />
        ))}
      </div>
      
      {/* Special achievements */}
      {grouped.seller_special && (
        <div className="flex flex-wrap gap-1.5">
          {grouped.seller_special.map(b => (
            <SellerBadge key={b.id} badge={b.badge_definition} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🔍 Search & Filter Integration

### New Search Filters

```typescript
interface SearchFilters {
  // Existing
  category?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: string;
  
  // NEW: Seller filters
  sellerType?: "personal" | "business" | "all";
  verifiedOnly?: boolean;
  topRatedOnly?: boolean;  // 4.8+ rating, 50+ reviews
  minSellerRating?: number;
  minSellerSales?: number;
  minTrustScore?: number;
}
```

### Filter UI Example

```tsx
<div className="space-y-4">
  <h4 className="font-medium">Seller Type</h4>
  <RadioGroup value={sellerType} onValueChange={setSellerType}>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="all" id="all" />
      <Label htmlFor="all">All Sellers</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="personal" id="personal" />
      <Label htmlFor="personal">
        <User className="inline w-4 h-4 mr-1" />
        Personal Sellers
      </Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="business" id="business" />
      <Label htmlFor="business">
        <Buildings className="inline w-4 h-4 mr-1" />
        Business Sellers
      </Label>
    </div>
  </RadioGroup>
  
  <Separator />
  
  <h4 className="font-medium">Seller Quality</h4>
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Checkbox id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
      <Label htmlFor="verified">Verified Sellers Only</Label>
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox id="topRated" checked={topRatedOnly} onCheckedChange={setTopRatedOnly} />
      <Label htmlFor="topRated">
        <Star className="inline w-4 h-4 mr-1 text-yellow-500" />
        Top Rated (4.8+)
      </Label>
    </div>
  </div>
</div>
```

---

## 📈 Analytics & Reporting

### Seller Dashboard Metrics

```typescript
interface SellerDashboardStats {
  // Current badges
  badges: UserBadge[];
  
  // Progress to next badge
  nextBadge: {
    badge: BadgeDefinition;
    progress: number;      // 0-100
    requirement: string;   // "15 more sales needed"
  } | null;
  
  // Trust score
  trustScore: number;
  trustBreakdown: {
    verification: number;
    performance: number;
  };
  
  // Performance trends
  ratingTrend: "up" | "down" | "stable";
  salesTrend: "up" | "down" | "stable";
}
```

### Badge Progress UI

```tsx
function BadgeProgress({ nextBadge }: { nextBadge: NextBadge }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Next Badge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="text-2xl">{nextBadge.badge.icon}</div>
          <div className="flex-1">
            <p className="font-medium">{nextBadge.badge.name}</p>
            <p className="text-xs text-muted-foreground">
              {nextBadge.requirement}
            </p>
            <Progress value={nextBadge.progress} className="mt-2 h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## ✨ Summary

This verification and badge system provides:

1. **Clear Account Separation**: Personal vs Business sellers with appropriate verification paths
2. **Two-Way Trust**: Both sellers AND buyers get rated, creating accountability
3. **Gamification**: Badges encourage good behavior and create competition
4. **Search & Discovery**: Users can filter by seller type, verification, and ratings
5. **Scalability**: Stat caching and indexed queries ensure performance
6. **Flexibility**: JSONB criteria allows easy badge rule changes without migrations

### Next Steps

1. Review and approve this plan
2. Create database migration
3. Implement badge evaluation service
4. Update UI components
5. Test and iterate

---

*Document created: December 2025*  
*Status: Ready for implementation review*
