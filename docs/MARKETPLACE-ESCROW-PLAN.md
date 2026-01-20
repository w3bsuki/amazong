# Marketplace Escrow & Trust System — Implementation Plan

> **Purpose**: This document defines the complete buyer/seller protection system for Treido marketplace. AI agents should use this as the source of truth for implementing and auditing the escrow payment flow, seller verification, order management, and dispute resolution.

---

## Table of Contents

1. [Overview](#overview)
2. [Seller Verification & Onboarding](#seller-verification--onboarding)
3. [Payment Flow (Escrow)](#payment-flow-escrow)
4. [Order Lifecycle](#order-lifecycle)
5. [Delivery Confirmation](#delivery-confirmation)
6. [Dispute Resolution](#dispute-resolution)
7. [Trust & Reputation System](#trust--reputation-system)
8. [Database Schema Requirements](#database-schema-requirements)
9. [Notifications](#notifications)
10. [Audit Checklist](#audit-checklist)

---

## Overview

Treido is a marketplace where individual sellers and businesses can list products. Buyers pay via Stripe, funds are held until delivery is confirmed, then released to sellers. This protects both parties from fraud.

### Core Principles

- **Buyer pays first** — money is secured before seller ships
- **Platform holds funds** — not transferred to seller until delivery confirmed
- **Evidence-based disputes** — tracking data and photos determine outcomes
- **Progressive trust** — new sellers have limits, trusted sellers get benefits

---

## Seller Verification & Onboarding

### Required Verifications (Launch)

| Step | Required | Storage | Notes |
|------|----------|---------|-------|
| Email verification | ✅ Yes | Supabase Auth | Already implemented via Supabase |
| Phone verification | ✅ Yes | `profiles.phone`, `profiles.phone_verified` | Bulgarian +359 numbers, OTP via SMS |
| Stripe Connect onboarding | ✅ Yes | `profiles.stripe_account_id`, `profiles.stripe_onboarding_complete` | Stripe handles identity/banking |
| Seller agreement acceptance | ✅ Yes | `profiles.seller_agreement_accepted_at` | Timestamp when ToS accepted |
| Profile photo | ⚠️ Optional | `profiles.avatar_url` | Social trust, not identity |

### Seller Account Types

| Type | Commission | Requirements |
|------|------------|--------------|
| Individual | 0% seller fee, buyer pays ~5% protection fee | Phone + Stripe Connect |
| Business | 1% seller fee, buyer pays ~4% protection fee | Phone + Stripe Connect + Business registration |

### Progressive Trust Tiers

```
NEW SELLER (0 sales):
- Max 5 active listings
- Max item price: €100
- Payout held 7 days after delivery confirmation
- Manual review on first sale

VERIFIED SELLER (5+ completed sales, 0 disputes):
- Max 20 active listings  
- Max item price: €500
- Payout held 3 days after delivery confirmation

TRUSTED SELLER (20+ sales, <2% dispute rate):
- Unlimited listings
- No price cap
- Payout next business day
- "Trusted Seller" badge displayed
- Featured in search results
```

### Implementation Tasks

- [ ] Add `phone` and `phone_verified` columns to profiles table
- [ ] Implement SMS OTP verification flow (Twilio or similar)
- [ ] Add `seller_tier` enum column: `new`, `verified`, `trusted`
- [ ] Add `stripe_account_id` and `stripe_onboarding_complete` to profiles
- [ ] Create Stripe Connect onboarding flow for sellers
- [ ] Add `seller_agreement_accepted_at` timestamp
- [ ] Implement listing limits based on seller tier
- [ ] Implement price limits based on seller tier

---

## Payment Flow (Escrow)

### How It Works

```
1. Buyer clicks "Buy Now" 
2. Buyer pays via Stripe (card)
3. Payment goes to PLATFORM's Stripe account (held)
4. Seller notified: "Payment received — please ship"
5. Seller ships item, enters tracking number
6. Buyer receives item
7. Buyer confirms receipt OR 72h auto-confirm after delivery
8. Platform transfers funds to seller's Connected Account (minus fees)
```

### Stripe Implementation

Use **Separate Charges and Transfers** pattern:
- Charge goes to platform account
- Transfer to connected account happens AFTER delivery confirmed
- Platform controls timing of transfer

**NOT** destination charges (those transfer immediately).

### Fee Structure

| Fee Type | Amount | Paid By | When |
|----------|--------|---------|------|
| Stripe processing | ~2.9% + €0.25 | Absorbed into buyer fee | At purchase |
| Buyer protection fee | 3-5% of item price | Buyer | At purchase |
| Seller commission | 0-1% based on tier | Seller | At payout |

### Implementation Tasks

- [ ] Set up Stripe Connect platform account
- [ ] Implement payment intent creation with manual capture or separate charges
- [ ] Store `payment_intent_id` and `transfer_id` on orders
- [ ] Create transfer-to-seller function (triggered on delivery confirmation)
- [ ] Implement fee calculation logic
- [ ] Add `payout_status` to orders: `pending`, `processing`, `completed`, `failed`
- [ ] Implement payout delay based on seller tier (7 days / 3 days / next day)

---

## Order Lifecycle

### Order Statuses

```
PENDING_PAYMENT     → Buyer initiated checkout
PAID                → Payment captured, awaiting shipment
SHIPPED             → Seller entered tracking, item in transit
DELIVERED           → Courier marked as delivered
COMPLETED           → Buyer confirmed OR auto-confirmed, funds released
DISPUTED            → Buyer opened dispute
CANCELLED           → Order cancelled (refunded if paid)
REFUNDED            → Dispute resolved in buyer's favor
```

### Status Transitions

```
PENDING_PAYMENT → PAID (on successful charge)
PAID → SHIPPED (seller enters tracking)
PAID → CANCELLED (seller doesn't ship in 7 days)
SHIPPED → DELIVERED (courier API or manual)
DELIVERED → COMPLETED (buyer confirms or 72h passes)
DELIVERED → DISPUTED (buyer claims issue)
DISPUTED → COMPLETED (resolved for seller)
DISPUTED → REFUNDED (resolved for buyer)
```

### Implementation Tasks

- [ ] Add `status` enum to orders table with all statuses above
- [ ] Add `tracking_number` and `tracking_carrier` columns
- [ ] Add `shipped_at`, `delivered_at`, `completed_at` timestamps
- [ ] Add `auto_confirm_at` timestamp (set to delivered_at + 72h)
- [ ] Create background job to auto-confirm orders past `auto_confirm_at`
- [ ] Add `dispute_id` foreign key for disputed orders

---

## Delivery Confirmation

### Buyer Confirmation Flow

When order status is `DELIVERED`:

1. Buyer sees "Confirm Receipt" button
2. Buyer can:
   - **Confirm receipt** → Order completes, seller gets paid
   - **Report issue** → Opens dispute flow
   - **Do nothing** → Auto-confirms after 72 hours

### Photo Evidence (Optional but Recommended)

For added protection, buyer can upload photo when confirming:
- Photo of received package
- Photo of item matching listing

This creates evidence trail for potential disputes.

### Auto-Confirmation Rules

```
IF order.status == 'DELIVERED' 
AND now() > order.delivered_at + 72 hours
AND no open dispute exists
THEN:
  - Set order.status = 'COMPLETED'
  - Trigger payout to seller
  - Notify seller: "Order completed, payout processing"
```

### Implementation Tasks

- [ ] Create delivery confirmation UI for buyers
- [ ] Add optional photo upload on receipt confirmation
- [ ] Store confirmation photos in Supabase Storage
- [ ] Implement auto-confirmation background job (runs hourly)
- [ ] Add `confirmed_by` column: `buyer`, `auto`, `admin`
- [ ] Add `confirmation_photo_url` column

---

## Dispute Resolution

### Dispute Types

| Type | Description | Evidence Required |
|------|-------------|-------------------|
| `not_received` | Buyer claims item never arrived | Tracking data |
| `wrong_item` | Item doesn't match listing | Photos within 48h |
| `damaged` | Item arrived damaged | Photos within 48h |
| `not_as_described` | Quality/condition mismatch | Photos + description |

### Dispute Flow

```
1. Buyer opens dispute (within 72h of delivery)
2. Buyer provides:
   - Dispute type
   - Description
   - Photo evidence (required for wrong_item, damaged, not_as_described)
3. Seller notified, has 48h to respond with evidence
4. Platform reviews evidence
5. Decision made:
   - SELLER_WINS → Funds released to seller
   - BUYER_WINS → Refund issued to buyer
   - SPLIT → Partial refund (rare)
```

### Evidence Hierarchy

| Evidence | Outcome |
|----------|---------|
| Tracking shows delivered + signature | Seller wins (not_received claims) |
| Tracking shows delivered, no signature | Review needed |
| No tracking provided | Buyer wins |
| Clear photo of wrong/damaged item | Buyer wins |
| Photos inconclusive | Platform discretion |

### Implementation Tasks

- [ ] Create `disputes` table with type, status, evidence fields
- [ ] Add `dispute_reason` and `dispute_evidence_urls` columns
- [ ] Create dispute submission UI for buyers
- [ ] Create dispute response UI for sellers
- [ ] Create admin dispute resolution dashboard
- [ ] Add `dispute_status`: `open`, `pending_seller`, `under_review`, `resolved`
- [ ] Add `dispute_resolution`: `seller_wins`, `buyer_wins`, `split`
- [ ] Implement refund flow for buyer-wins disputes
- [ ] Add dispute deadline timestamps

---

## Trust & Reputation System

### Seller Ratings

After order completion, buyer can rate seller:
- **Star rating**: 1-5 stars
- **Review text**: Optional written review
- **Aspects**: Shipping speed, item accuracy, communication

### Seller Metrics (Internal)

| Metric | Calculation | Impact |
|--------|-------------|--------|
| `dispute_rate` | disputes / total_orders | Tier downgrade if >5% |
| `cancel_rate` | cancelled / total_orders | Warning if >10% |
| `avg_ship_time` | avg days to ship | Shown to buyers |
| `response_rate` | messages replied / received | Shown to buyers |

### Fraud Detection Flags

| Flag | Trigger | Action |
|------|---------|--------|
| `multiple_disputes` | 3+ disputes in 30 days | Manual review |
| `high_value_new_seller` | New seller, item >€100 | Manual review |
| `suspicious_velocity` | 10+ orders in 1 hour | Temporary hold |
| `mismatched_location` | IP country ≠ profile country | Flag for review |

### Buyer Limits (Anti-Fraud)

| Buyer Status | Limits |
|--------------|--------|
| New buyer (0 purchases) | Max €100 per order |
| Verified buyer (3+ purchases) | Max €500 per order |
| Established buyer (10+ purchases, 0 disputes) | No limits |

### Implementation Tasks

- [ ] Create `reviews` table (order_id, rating, text, created_at)
- [ ] Add `seller_rating_avg` and `seller_rating_count` to profiles
- [ ] Create rating submission UI (post-completion)
- [ ] Add `seller_metrics` JSON column or separate table
- [ ] Implement seller tier calculation (daily job)
- [ ] Create `fraud_flags` table for manual review queue
- [ ] Implement buyer purchase limits
- [ ] Create admin fraud review dashboard

---

## Database Schema Requirements

### New Tables Needed

```
disputes
  - id (uuid, PK)
  - order_id (FK to orders)
  - type (enum: not_received, wrong_item, damaged, not_as_described)
  - status (enum: open, pending_seller, under_review, resolved)
  - resolution (enum: seller_wins, buyer_wins, split, null)
  - buyer_description (text)
  - buyer_evidence_urls (text[])
  - seller_response (text)
  - seller_evidence_urls (text[])
  - admin_notes (text)
  - opened_at (timestamp)
  - seller_response_deadline (timestamp)
  - resolved_at (timestamp)
  - resolved_by (FK to profiles, admin)

reviews
  - id (uuid, PK)
  - order_id (FK to orders, unique)
  - seller_id (FK to profiles)
  - buyer_id (FK to profiles)
  - rating (int, 1-5)
  - text (text, nullable)
  - shipping_rating (int, 1-5)
  - accuracy_rating (int, 1-5)
  - communication_rating (int, 1-5)
  - created_at (timestamp)

fraud_flags
  - id (uuid, PK)
  - user_id (FK to profiles)
  - order_id (FK to orders, nullable)
  - flag_type (enum: multiple_disputes, high_value_new_seller, etc)
  - severity (enum: low, medium, high)
  - status (enum: pending, reviewed, dismissed, actioned)
  - notes (text)
  - created_at (timestamp)
  - reviewed_at (timestamp)
  - reviewed_by (FK to profiles)
```

### Profile Table Additions

```
profiles (add columns):
  - phone (text)
  - phone_verified (boolean, default false)
  - phone_verified_at (timestamp)
  - stripe_account_id (text)
  - stripe_onboarding_complete (boolean, default false)
  - seller_tier (enum: new, verified, trusted)
  - seller_agreement_accepted_at (timestamp)
  - seller_rating_avg (decimal)
  - seller_rating_count (int)
  - total_sales_count (int)
  - dispute_count (int)
  - last_tier_calculation (timestamp)
```

### Orders Table Additions

```
orders (add columns):
  - status (enum with all statuses)
  - tracking_number (text)
  - tracking_carrier (text)
  - shipped_at (timestamp)
  - delivered_at (timestamp)
  - completed_at (timestamp)
  - auto_confirm_at (timestamp)
  - confirmed_by (enum: buyer, auto, admin)
  - confirmation_photo_url (text)
  - payment_intent_id (text)
  - transfer_id (text)
  - payout_status (enum: pending, processing, completed, failed)
  - payout_amount (decimal)
  - payout_at (timestamp)
  - buyer_fee_amount (decimal)
  - seller_commission_amount (decimal)
```

---

## Notifications

### Required Notifications

| Event | Recipient | Channel | Message |
|-------|-----------|---------|---------|
| Order placed | Seller | Email + Push + In-app | "New order! Please ship within 7 days" |
| Order shipped | Buyer | Email + In-app | "Your order has shipped! Tracking: X" |
| Order delivered | Buyer | Email + Push + In-app | "Your order was delivered. Confirm receipt" |
| Order completed | Seller | Email + In-app | "Order completed! Payout processing" |
| Payout sent | Seller | Email + In-app | "€X sent to your bank account" |
| Dispute opened | Seller | Email + Push + In-app | "Dispute opened. Respond within 48h" |
| Dispute resolved | Both | Email + In-app | "Dispute resolved in [party]'s favor" |
| Auto-confirm warning | Buyer | Push + In-app | "Order auto-confirms in 24h" |
| Ship reminder | Seller | Email + Push | "Please ship order #X (5 days remaining)" |

### Implementation Tasks

- [ ] Create notification preferences in profiles
- [ ] Set up email templates for each notification type
- [ ] Implement in-app notification system
- [ ] Set up push notifications (optional, for mobile)
- [ ] Create notification triggers on order status changes
- [ ] Implement reminder jobs (ship reminder, auto-confirm warning)

---

## Audit Checklist

Use this checklist to verify the system is production-ready.

### Seller Verification

- [ ] Phone verification flow works (send OTP, verify OTP)
- [ ] Only verified phone numbers can list products
- [ ] Stripe Connect onboarding flow completes successfully
- [ ] Seller agreement must be accepted before first listing
- [ ] Seller tier is calculated correctly based on history
- [ ] Listing limits enforced based on tier
- [ ] Price limits enforced based on tier

### Payment Flow

- [ ] Payments captured to platform account (not direct to seller)
- [ ] Payment intent ID stored on order
- [ ] Funds not transferred until delivery confirmed
- [ ] Fees calculated correctly (buyer fee + seller commission)
- [ ] Transfer to connected account works
- [ ] Payout delay respects seller tier
- [ ] Failed payouts are retried and logged

### Order Management

- [ ] All order statuses transition correctly
- [ ] Tracking number can be entered by seller
- [ ] Order auto-cancels if not shipped in 7 days
- [ ] Order status updates trigger notifications
- [ ] Order history visible to both parties

### Delivery Confirmation

- [ ] Buyer can confirm receipt
- [ ] Photo upload works (optional)
- [ ] Auto-confirmation job runs and completes orders
- [ ] Auto-confirm warning sent 24h before
- [ ] Confirmation triggers payout process

### Disputes

- [ ] Buyer can open dispute within 72h of delivery
- [ ] Dispute types and evidence upload work
- [ ] Seller receives notification and can respond
- [ ] Admin can review and resolve disputes
- [ ] Refund processed correctly on buyer-wins
- [ ] Funds released correctly on seller-wins

### Trust System

- [ ] Reviews can be submitted after completion
- [ ] Seller rating average calculated correctly
- [ ] Seller tier updates based on metrics
- [ ] Fraud flags generated for suspicious activity
- [ ] Admin can review fraud flags
- [ ] Buyer limits enforced based on history

### Notifications

- [ ] All notification types send correctly
- [ ] Email delivery works (check spam)
- [ ] In-app notifications display
- [ ] Notification preferences respected

### Edge Cases

- [ ] Seller deletes account mid-order → Order completes, payout to last known account
- [ ] Buyer deletes account mid-order → Order completes normally
- [ ] Stripe Connect account deauthorized → Flag for admin, hold payouts
- [ ] Payment fails after order created → Order cancelled, no charge
- [ ] Dispute opened after auto-confirm → Still allowed within 72h window

---

## Integration Points

### External Services

| Service | Purpose | Status |
|---------|---------|--------|
| Stripe Connect | Payments, seller payouts, identity | Needs setup |
| Twilio / SMS provider | Phone OTP verification | Needs setup |
| Email provider | Transactional emails | Check existing |
| Push notifications | Mobile alerts | Optional |
| Courier APIs (Econt, Speedy, BoxNow) | Auto-tracking updates | Future |

### Supabase Features Used

- Auth (existing)
- Database (tables above)
- Storage (evidence photos)
- Edge Functions (webhooks, background jobs)
- Realtime (order status updates)

---

## Priority Order for Implementation

### Phase 1: Core Escrow (Week 1-2)
1. Database schema additions
2. Stripe Connect setup
3. Payment flow (charge to platform)
4. Order status management
5. Manual delivery confirmation
6. Transfer to seller on completion

### Phase 2: Verification (Week 2-3)
1. Phone verification flow
2. Seller onboarding improvements
3. Seller agreement acceptance
4. Basic tier system

### Phase 3: Protection (Week 3-4)
1. Dispute submission flow
2. Evidence upload
3. Admin dispute dashboard
4. Refund processing

### Phase 4: Trust (Week 4-5)
1. Review system
2. Seller ratings display
3. Fraud detection flags
4. Buyer/seller limits

### Phase 5: Polish (Week 5-6)
1. All notifications
2. Auto-confirmation job
3. Payout delays by tier
4. Edge case handling

---

## Questions for Product Decision

Before implementation, decide:

1. **Photo on receipt**: Required or optional?
2. **Dispute window**: 72 hours or longer?
3. **Auto-confirm delay**: 72 hours or adjustable?
4. **Payout delays**: 7/3/1 days or different?
5. **SMS provider**: Twilio, MessageBird, or Bulgarian provider?
6. **Courier integration**: Phase 1 or later?

---

*Last updated: January 2026*
*Document owner: Product/Engineering*
