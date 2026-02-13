# Trust & Safety

## Goal

Build the minimum trust and safety layer required for a real-money marketplace launch: product/user reviews and ratings, reporting and blocking, dispute resolution with payout blocking, seller verification and limits, reputation badges, and admin moderation tooling. Trust failures directly cause chargebacks, disputes, and brand damage — this is a launch-critical area.

## Current Status

- Requirements: 12/14 complete (R11: 8/8 + R13: 4/6) — see REQUIREMENTS.md §R11, §R13
- Production: 🟡 Partial — admin moderation basic; prohibited items enforcement manual

## Requirements Mapping

| Req ID | Description | Status |
|--------|-------------|--------|
| **R11: Reviews & Ratings** | | |
| R11.1 | Leave product review | ✅ |
| R11.2 | Seller feedback | ✅ |
| R11.3 | Buyer feedback | ✅ |
| R11.4 | Display reviews on PDP | ✅ |
| R11.5 | Display reviews on profile | ✅ |
| R11.6 | Helpful vote | ✅ |
| R11.7 | Delete own review | ✅ |
| R11.8 | Validation rules (no duplicate reviews) | ✅ |
| **R13: Trust & Safety** | | |
| R13.1 | Report product | ✅ |
| R13.2 | Report user | ✅ |
| R13.3 | Report conversation | ✅ |
| R13.4 | Block user | ✅ |
| R13.5 | Admin moderation | 🟡 In progress (basic queue) |
| R13.6 | Prohibited items enforcement | 🟡 In progress (manual) |

## Implementation Notes

### Reviews & Ratings

- **Post-order rating prompt**: triggered after order completion (buyer confirms received)
- **Display**: average rating, count, distribution, written reviews on PDP and seller profile
- **Validation**: one review per buyer per order; no self-reviews; basic profanity filtering
- **Helpful votes**: community-driven quality signal

### Seller Trust Signals

| Signal | Source | Display |
|--------|--------|---------|
| Average rating + count | `reviews` table | Stars + count on profile/PDP |
| Completed sales | `orders` (completed status) | Number on profile |
| Cancellation rate | Derived from `orders` | Percentage (if above threshold) |
| Dispute rate | Derived from `orders` | Percentage (if above threshold) |
| Response time | `messages` table | TBD — optional indicator |

### Reputation Badges

| Category | Badge | Threshold |
|----------|-------|-----------|
| Verification | Phone verified | Phone verification complete |
| Verification | Stripe payouts enabled | Connect onboarding complete |
| Verification | Business verified | KYB complete |
| Performance | Rising seller | ≥ 10 sales, rating ≥ 4.5, disputes < 5% |
| Performance | Trusted seller | ≥ 50 sales, rating ≥ 4.7, disputes < 3% |
| Performance | Top seller | ≥ 200 sales, rating ≥ 4.8, disputes < 2% |

**Anti-gaming rules:**
- Only paid + completed orders count as sales
- Exclude: fully refunded (seller fault), canceled pre-shipment, confirmed fraud
- Badges revoked if thresholds drop below (with hysteresis to prevent flickering)
- Thresholds stored in `badge_definitions` — editable without redeploys

### Disputes

**5 dispute types** (V1):

| Type | Description |
|------|-------------|
| Item not received (INR) | Buyer claims non-delivery |
| Damaged | Item arrived damaged |
| Not as described | Item doesn't match listing |
| Counterfeit | Suspected fake/counterfeit |
| Harassment | Abusive behavior in chat |

**State machine:** `dispute opened → payout blocked → admin review → resolution (refund/release/partial)`

**Critical rule:** Payout release bugs are **SEV-0** incidents — "stop-the-line" policy.

### Routes

| Path | Group | Auth | Purpose |
|------|-------|------|---------|
| `/:username` | [username] | public | Seller profile with ratings, badges, reviews |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/badges` | GET | Get current user's badges |
| `/api/badges/evaluate` | POST | Evaluate badge eligibility |
| `/api/badges/feature/:badgeId` | POST | Feature a badge on profile |
| `/api/badges/:userId` | GET | Get a user's public badges |

### Server Actions

- `reviews.ts` — Product review CRUD, helpful votes
- `buyer-feedback.ts` — Buyer feedback (from seller)
- `seller-feedback.ts` — Seller feedback (from buyer)
- `blocked-users.ts` — User blocking
- `seller-follows.ts` — Seller follows (trust signal)

### DB Tables

| Table | Purpose |
|-------|---------|
| `reviews` | Product reviews with rating, text, images, seller response, helpful count |
| `profiles` | Role/account type (buyer/seller/admin, personal/business) |
| `private_profiles` | Sensitive data (email, phone, Stripe customer ID, VAT) |
| `badge_definitions` | Badge types, thresholds, icons — editable without deploys |
| `user_badges` | Awarded badges per user (materialized or computed) |
| `seller_stats` | Aggregated seller metrics (maintained via triggers/jobs) |

### Key Behaviors

- **Reporting**: creates moderation queue entry; admin triages with enforceable actions (warn, suspend, ban)
- **Blocking**: bilateral — blocked user cannot message, view profile details, or purchase from blocker
- **Dispute → payout block**: automatic; payout release waits for admin resolution
- **Evidence uploads**: photos and tracking references attached to disputes

## Known Gaps & V1.1+ Items

| Item | Status | Notes |
|------|--------|-------|
| R13.5: Admin moderation | 🟡 In progress | Basic queue exists; advanced tooling (bulk actions, auto-rules) deferred |
| R13.6: Prohibited items | 🟡 In progress | Manual enforcement; automated detection/ML scoring deferred |
| Automated fraud scoring | ⬜ Deferred | ML-based fraud detection is post-V1 |
| Complex arbitration | ⬜ Deferred | V1 keeps dispute resolution simple and admin-driven |
| Mutual ratings | ❓ Open question | Do sellers rate buyers? Undecided |
| Community badges | ⬜ Deferred | "Early adopter", "contributor" — future |
| Response time display | ❓ Open question | May create pressure or spam; needs testing |

## Cross-References

- [PAYMENTS.md](../domain/PAYMENTS.md) — Escrow lifecycle, payout blocking during disputes, refund processing
- [DATABASE.md](../domain/DATABASE.md) — reviews, badge_definitions, user_badges, seller_stats tables
- [chat.md](./chat.md) — Report conversation, block user flows
- [buying.md](./buying.md) — Buyer protection claims, order disputes
- [PRD.md](../archive/2026-02-doc-reset/pre-cutover-docs/PRD.md) §6.9 (Reviews), §6.10 (Trust & Safety), §12 (Operations)
- `../../context/business/specs/prd-trust-safety.mdx` — Detailed V1 trust requirements
- `../../context/business/specs/prd-reputation-badges-ratings.mdx` — Badge system design

---

*Last updated: 2026-02-08*
