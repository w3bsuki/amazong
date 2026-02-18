# PRD — Treido

> Read this first. It tells you what we're building.

---

## What Is Treido

Treido is a marketplace at **treido.eu** where people and businesses across the EU buy and sell products. Payments in EUR. Two languages: English and Bulgarian, more coming.

Think eBay meets modern mobile-first design. C2C and B2B on one platform. Any person can list something for sale. Any business can run a full storefront. Buyers get a fast, clean shopping experience with search, filters, wishlists, and secure checkout.

What makes Treido different:
- **AI-first.** An AI agent that helps sellers upload inventory, auto-fill listings from photos, and helps buyers find what they need.
- **Mobile-first.** Built for phones first, desktop second. Every flow must feel native on mobile.
- **Best-in-class UX.** We're not building "good enough." We want the best shopping experience — faster, cleaner, and more personal than eBay, OLX, or Bazar.
- **EU-native.** Euro payments, GDPR-compliant, multi-language from day one.

---

## Who Uses It

### Buyers (anyone)
- Browse, search, filter products
- Add to cart, wishlist
- Checkout with Stripe (card payments)
- Track orders, confirm delivery
- Chat with sellers
- Leave reviews

### Personal Sellers (individuals)
- List items for sale via the sell form
- Manage listings from `/account/selling`
- Receive orders, ship, track
- Chat with buyers
- Get paid via Stripe Connect

### Business Sellers (companies)
- Everything personal sellers can do, plus:
- Full dashboard at `/dashboard` — products, orders, inventory, analytics
- Business profile with branding
- Higher listing limits, boost access
- Subscription plans (Pro, Business tiers)

### Admins (us)
- User management, order oversight, product moderation
- System health monitoring

---

## How Money Works

Revenue comes from three streams:

1. **Subscription plans** — Sellers choose a plan (Free, Pro, Business). Higher tiers unlock more listings, boosts, analytics, and features.
2. **Transaction fees** — Platform takes a percentage on each sale via Stripe Connect. Fees vary by seller plan.
3. **Listing boosts** — Sellers pay to boost listings for more visibility. Charged via Stripe checkout.

Payouts to sellers happen via Stripe Connect (Express accounts) with escrow — funds release after buyer confirms delivery.

*Revenue model will iterate. For now: plans + transaction fees + boosts.*

---

## Core User Journeys

### New User → First Purchase
1. Lands on treido.eu → browses homepage or searches
2. Finds a product → views PDP (images, price, seller info, reviews)
3. Adds to cart → goes to checkout
4. Signs up (or signs in) → completes onboarding (name, account type)
5. Enters address, selects shipping → pays with Stripe
6. Receives order confirmation → tracks status
7. Gets the item → marks as received → leaves review
8. Chat with seller if needed at any point

### New Seller → First Sale
1. Signs up → completes onboarding → selects "Personal" or "Business"
2. Goes to `/sell` → fills multi-step form (photos, title, category, price, condition)
3. AI helps auto-fill from photos if wanted
4. Publishes listing → it appears in marketplace
5. Buyer purchases → seller gets notification + chat created
6. Seller marks order as "received" (acknowledged)
7. Seller ships → marks as "shipped" with tracking
8. Buyer confirms delivery → seller gets paid

### Business Seller → Storefront
1. Chooses "Business" during onboarding
2. Sets up business profile
3. Connects Stripe for payouts
4. Uses `/dashboard` to manage products, orders, inventory
5. Upgrades plan for higher limits and boosts
6. Boosts listings for visibility

### Order Lifecycle
```
Buyer pays → Order created (pending)
  → Seller acknowledges (confirmed)
  → Seller ships (shipped + tracking)
  → Buyer receives (delivered)
  → Buyer confirms receipt (completed)
  → Seller gets paid (payout released)
```
Chat is auto-created between buyer and seller on purchase. Both get notifications at each status change.

---

## Platform Features (V1 Launch)

**Auth:** Sign up, sign in, OAuth, password reset, email confirmation, session management
**Onboarding:** Account type selection, profile setup, interests, business profile
**Selling:** Multi-step sell form, image upload, AI autofill, category attributes, drafts
**Browsing:** Homepage feeds, search with filters, category navigation, product grid
**PDP:** Image gallery, product info, seller card, reviews, add to cart, share
**Cart & Wishlist:** Cart with totals, wishlist with sharing, drawers on mobile
**Checkout:** Address, shipping method, Stripe payment, success confirmation
**Orders:** Buyer order tracking, seller order management, status timeline, proof of delivery
**Chat:** Real-time messaging, order-linked conversations, image attachments, notifications
**Plans:** Pricing page, Stripe subscription, customer portal, plan limits
**Boosts:** Listing boost purchase, visibility indicator, duration tracking
**Reviews:** Product reviews, buyer/seller feedback, ratings
**Profiles:** Public profile, settings, addresses, security, billing, following
**Dashboard:** Business seller hub — products, orders, analytics, settings
**Admin:** User/order/product management, moderation
**i18n:** English + Bulgarian, EUR currency

---

## Future Vision

These are NOT in scope for V1. They inform direction, not current work.

- **AI Shopping Agent** — An AI that lives in the app. Helps buyers find products, compare options, get recommendations. Helps sellers manage inventory, price competitively, respond to buyers.
- **Seller Inventory Sync** — Businesses upload their full catalog (CSV, API, or AI-assisted) and it syncs to treido.eu automatically.
- **Mobile Apps** — Native iOS/Android apps built from the same codebase.
- **Auctions & Bidding** — Auction-style listings alongside fixed-price.
- **B2B Networking** — Business-to-business discovery, bulk orders, wholesale pricing.
- **Advanced Analytics** — Deep insights for sellers on views, conversion, trending categories.
- **Email Notifications** — Transactional emails for orders, shipping, reviews.
- **Saved Searches** — Email/push alerts when matching products appear.
- **Seller Verification** — Verified badge for trusted sellers (identity + track record).
- **Multi-currency** — Support for multiple EU currencies beyond EUR.
- **Shipping Integration** — Direct integration with carriers for label printing and tracking.

---

## Technical Context

For agents working on the codebase — this is what powers the platform:

| Layer | Tech |
|-------|------|
| Framework | Next.js 16, App Router, Server Components |
| Styling | Tailwind CSS v4, shadcn/ui |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Database | Supabase Postgres + RLS |
| Payments | Stripe (Checkout, Connect, Subscriptions) |
| i18n | next-intl (en, bg) |
| Hosting | Vercel |
| AI | OpenAI (sell autofill, search, assistant) |

Full technical details: `AGENTS.md`, `ARCHITECTURE.md`, `docs/DOMAINS.md`

---

## Key Principle

**Same features, less code.** The platform works. The features are built. The problem is that the codebase is bloated — 810 files, ~112K LOC for what should be a ~400 file, ~45K LOC app. The refactor goal is to cut the codebase in half while keeping everything working perfectly. No new features until the code is clean.

---

*Last updated: 2026-02-18*
