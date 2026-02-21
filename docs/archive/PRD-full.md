# PRD — Treido

> The product bible. Any agent working on any feature reads this first.
> For technical stack see `docs/STACK.md`. For UI/UX contract see `docs/DESIGN.md`.

---

## 1. Product Identity

| Field | Value |
|-------|-------|
| **Name** | Treido |
| **URL** | treido.eu |
| **Tagline** | Trade smarter. Buy and sell anything. |
| **Name origin** | "Trade" + "do" — a slang fusion. Trading made actionable. |
| **Type** | Online marketplace (C2C + B2B) |
| **Currency** | EUR |
| **Languages** | English, Bulgarian (more planned) |
| **Deployment** | Vercel (web app, no native mobile apps yet) |

### What Treido Is

Treido is a marketplace where individuals and businesses buy and sell products. It runs at treido.eu as a web application. Anyone can list something for sale. Any business can run a full storefront with a Shopify-like backend — without needing developers, hosting, or a custom website.

The platform handles payments (Stripe), messaging (real-time chat), order management, seller payouts, reviews, wishlists, and subscription plans. Everything is designed to be fast, simple, and secure.

### What Makes Treido Different

1. **Secure payments built in.** Card payments via Stripe. No cash-on-delivery scams, no failed pickups, no trust issues. Buyers pay, sellers get paid.
2. **Business backend without Shopify.** Businesses get a full dashboard — product management, orders, analytics, bulk operations — with Treido as their storefront. No separate website needed.
3. **AI-first future.** The platform is designed to evolve into an AI-managed marketplace. Agents will help sellers list products in 10 seconds (photo → auto-fill → done), help buyers find exactly what they need, and manage business operations through any channel.
4. **Premium, clean experience.** Not "good enough" — we aim for the best shopping UX on the market. Calm, scannable, touch-confident design. Modal-based browsing on desktop so you never lose your scroll position.
5. **EU-native, globally ambitious.** EUR payments, GDPR compliance, multi-language from day one. Launching in Bulgaria, expanding across Europe and worldwide.

---

## 2. Problem Statement

### What's broken today

Existing platforms in the Bulgarian and Eastern European market fail their users:

**OLX / Bazar.bg:**
- No card payments — buyers and sellers rely on cash, bank transfers, or delivery-on-receipt
- Delivery scams: buyer orders via message, seller ships via courier, buyer never picks up → seller pays ~€5-10 in return delivery fees
- No seller verification, no buyer protection
- No business features — businesses use the same basic listing form as individuals
- Dated UX — feels like 2010

**Facebook Marketplace:**
- No payment processing at all — pure messaging + meetups
- No order management, tracking, or dispute resolution
- No business profiles or storefront capabilities
- Privacy concerns — tied to personal Facebook account

**eBay (EU):**
- Complex, overwhelming interface
- Not localized for Eastern European markets
- High fees for small sellers
- No AI assistance

**Shopify (for businesses):**
- Requires building and maintaining a separate website
- Needs developers for customization
- Monthly fees regardless of sales
- No built-in marketplace traffic — you bring your own customers

### What Treido fixes

Treido combines the marketplace reach of OLX/eBay with the business tools of Shopify, adds secure card payments, and wraps it in a modern, clean experience. Sellers list in minutes, buyers pay securely, and businesses get a full backend without hiring developers.

---

## 3. Vision & North Star

### Short-term (V1 — launch)
A working marketplace where people in Bulgaria can safely buy and sell products with card payments, real-time chat, order tracking, and a clean mobile + desktop experience.

### Medium-term (6-12 months)
Expand to more EU countries. Add AI-assisted listing (photo → auto-fill). Build out the business dashboard to match Shopify's core feature set. Integrate with local carriers (Speedy, Econt). Grow the product database.

### Long-term (2-3 years) — The North Star
Treido becomes the world's largest AI-managed marketplace. The vision:

- **Massive product database.** Businesses and distributors worldwide upload their catalogs. Chinese distributors, EU retailers, individual sellers — all on one platform.
- **AI agents everywhere.** Users don't need to open a browser or app. They message their Treido AI assistant on WhatsApp, in the app, or by voice. "I want a BMW 340xi, 2020 or newer, under €30K." The agent searches, filters, compares, and presents options with generative UI.
- **10-second listing.** Open the app → click upload → snap a photo → AI recognizes the item, fills all fields, sets competitive pricing → listed. No forms, no typing, no friction.
- **Business AI operations.** Business sellers manage their entire store through AI agents. Check competitors' prices, restock inventory, respond to customer messages, run promotions — all through conversation.
- **Generative UI.** The interface adapts to what the user is looking for. Searching for cars? The UI shows car-specific filters (year, make, mileage). Browsing fashion? Size guides, color swatches, outfit suggestions. The AI shapes the experience.
- **Paid AI tiers.** Free users get basic AI search. Premium users get customizable shopping agents, market analysis, competitor tracking, and business intelligence.

---

## 4. Target Users

### Persona 1: The Casual Seller
**Maria, 22, Sofia.** Sells vintage clothing and accessories she finds in thrift shops. Lists 2-5 items per week. Uses her phone for everything. Wants to list items fast (photo + price + done) and get paid without hassle. Doesn't want to learn complicated tools.

**Needs:** Fast mobile listing, secure payment, shipping options, chat with buyers.
**Frustration with alternatives:** OLX has no card payments — buyers flake on meetups or never pick up deliveries.

### Persona 2: The Small Business Owner
**Stefan, 38, Plovdiv.** Runs a small electronics repair shop. Wants an online presence to sell refurbished devices and accessories. Can't afford Shopify + a developer. Needs a storefront, inventory management, and order tracking.

**Needs:** Business dashboard, bulk product management, analytics, subscription plan, professional public profile.
**Frustration with alternatives:** Shopify requires a separate website + developer. OLX has no business tools.

### Persona 3: The Buyer
**Ivan, 28, Varna.** Looking for a good deal on a used laptop. Browses during commute on his phone. Wants to find products fast, see reviews, compare sellers, and pay with a card. Doesn't want to message sellers back-and-forth to agree on a price and delivery.

**Needs:** Search + filters, product details with images, reviews, add to cart, card checkout, order tracking.
**Frustration with alternatives:** No card payments on OLX. Facebook Marketplace has no checkout flow.

### Persona 4: The Business Distributor (Future)
**Chen Wei, 45, Shenzhen.** Runs a wholesale electronics distribution company. Wants to reach European buyers and businesses. Needs bulk catalog upload, order management at scale, and integration with logistics.

**Needs:** API/bulk upload, high listing limits, analytics, B2B features.
**When:** V2-V3 — not V1 scope.

---

## 5. Design Philosophy

### Brand Personality
**Premium & Clean.** Treido should feel like Stripe or Apple's storefront — calm confidence, not visual noise. When someone opens treido.eu, they should feel: "This is trustworthy. This is easy. This is modern."

Avoid: bright/playful (Vinted), dense/utilitarian (Amazon), cluttered (eBay).

### UX Principles

1. **Simplicity first.** Every flow should have the minimum possible steps. If a form can be 3 fields instead of 8, it's 3 fields. If a journey can be 2 screens instead of 5, it's 2 screens.
2. **No lost context.** On desktop, products open in modals — not new pages. Users never lose their scroll position or browsing state. Navigation should feel like staying in one place, not jumping between pages.
3. **Response, not decoration.** Motion communicates feedback (tap response, loading state, success). No decorative animations, no bouncing logos, no sliding carousels that nobody asked for.
4. **Touch-confident.** Every interactive element is comfortably tappable. No tiny links, no cramped grids. The app should feel as natural as a native iOS app on mobile.
5. **Scannable.** Users should be able to scan a page and find what they need in under 2 seconds. Clear hierarchy, obvious CTAs, breathing room between elements.

### Color & Visual Language
- 70% neutral surfaces (background, cards, subtle grays)
- 20% contrast elements (text, borders, icons)
- 10% accent (primary actions, status badges, highlights)
- Semantic tokens only — no raw colors in code
- Full token system defined in `app/globals.css`

### Responsive Strategy
**Mobile-first design, desktop excellence.** Most traffic comes from mobile, so mobile layouts are designed first. But desktop is NOT an afterthought — it gets its own patterns:

| Behavior | Mobile | Desktop |
|----------|--------|---------|
| Product browsing | Vertical scroll, full-width cards | Grid layout, sidebar filters |
| Product detail | Full page or sheet | Modal overlay (preserves scroll) |
| Navigation | Bottom tab bar | Sidebar + header |
| Sell flow | Bottom sheet / drawer | Modal |
| Forms | Full-screen steps | Inline or modal |

Key desktop patterns:
- **Modal-based browsing:** Products open in modals, not pages. Close modal → back to exactly where you were.
- **Sidebar navigation:** Persistent sidebar with section navigation.
- **Multi-panel layouts:** Dashboard shows multiple data panels simultaneously.
- **Dense but readable:** More information density than mobile, but still clean and scannable.

---

## 6. Core User Journeys

### Journey 1: Browse → Buy
```
1. User lands on treido.eu (or opens app)
2. Browses homepage feed OR searches / uses filters
3. Clicks a product → modal opens (desktop) or PDP loads (mobile)
4. Views images, price, description, seller info, reviews
5. Clicks "Add to Cart"
6. Goes to cart → reviews items and totals
7. Clicks "Checkout"
8. If not logged in → login/signup (required for checkout security)
9. Enters/selects shipping address
10. Selects shipping method
11. Confirms payment (Stripe)
12. Sees order confirmation
13. Tracks order status (pending → confirmed → shipped → delivered)
14. Receives item → marks as received
15. Optionally leaves a review
```

### Journey 2: List an Item (Casual Seller)
```
1. Clicks "Sell" button (prominent in nav)
2. Modal/drawer opens with minimal form
3. Step 1: Upload photo(s)
4. Step 2: Title, description, category (L1 → L2 → L3 → L4)
5. Step 3: Price, condition, location (pre-filled from profile)
6. Reviews listing preview
7. Clicks "Publish"
8. Listing goes live immediately
9. Optional: boost listing for visibility
```
**Target time:** Under 2 minutes for a basic listing. Under 30 seconds with AI autofill (future).

### Journey 3: Business Setup
```
1. Signs up → selects "Business" account type during onboarding
2. Completes business profile (name, logo, description)
3. Connects Stripe account for payouts
4. Navigates to /dashboard
5. Adds products (individually or bulk)
6. Manages orders as they come in
7. Upgrades plan for higher limits / features
8. Views analytics and sales data
```

### Journey 4: Order Lifecycle (Seller Side)
```
1. Buyer purchases → seller gets notification
2. Chat auto-created between buyer and seller
3. Seller acknowledges order (confirmed)
4. Seller ships → enters tracking info (shipped)
5. Buyer receives → marks as received (delivered)
6. Order completes → seller gets paid
```

### Journey 5: Order Lifecycle (Full State Machine)
```
Buyer pays
  → Order created (status: pending)
  → Seller acknowledges (status: confirmed)
  → Seller ships + adds tracking (status: shipped)
  → Buyer receives (status: delivered)
  → Buyer confirms receipt (status: completed)
  → Seller payout processed

Edge cases:
  → Buyer disputes → manual review
  → Seller doesn't ship within X days → auto-cancel option
  → Buyer never confirms → auto-complete after X days
```

---

## 7. Feature Inventory (V1)

Every feature Treido ships at V1 launch, grouped by domain. All of these are built (or scaffolded) in the current codebase.

### Authentication & Security
- Email/password signup and login
- Google OAuth
- Password reset flow (forgot → email → reset)
- Email confirmation
- Session management (HTTP-only cookies via Supabase SSR)
- Protected routes (middleware + server-side guards)

### Onboarding
- Post-signup wizard: account type selection → profile setup → interests → complete
- Account type: Personal or Business
- Onboarding gate: incomplete users redirected until wizard is done

### Marketplace & Browsing
- Homepage with product feeds (recent, trending, deals)
- Search with text query
- Category navigation (24 main categories with subcategories)
- Filters: price range, condition, location, category, rating
- Product grid (responsive: cards adapt to viewport)
- Sort options (relevance, price, date)
- Deals section

### Product Detail Page (PDP)
- Image gallery (swipe on mobile, thumbnails on desktop)
- Product info: title, price, description, condition, location
- Category breadcrumbs
- Seller card (name, rating, profile link)
- Reviews section
- Add to cart button
- Wishlist toggle
- Share functionality
- On desktop: opens as modal from browse view

### Sell Flow
- Multi-step form (currently full page, target: modal/drawer)
- Image upload (multiple images)
- Required fields: title, description, category, price
- Category picker with subcategories (L1 → L2 → L3 → L4)
- Condition selector
- Location (pre-filled from profile)
- Draft saving
- AI autofill from photos (scaffolded, enhancement planned)
- Listing preview before publish

### Cart & Wishlist
- Add/remove items from cart
- Cart page with item list, quantities, and totals
- Wishlist with add/remove
- Wishlist sharing
- Cart/wishlist drawers on mobile
- Persistent across sessions (for logged-in users)

### Checkout
- Shipping address entry/selection
- Shipping method selection
- Payment via Stripe (card)
- Order summary review
- Success/confirmation page
- Requires authenticated user (no guest checkout)

### Orders (Buyer)
- Order list with status
- Order detail with timeline
- Status tracking: pending → confirmed → shipped → delivered → completed
- Proof of delivery
- Chat link to seller

### Sales (Seller)
- Sales/orders list with status
- Order acknowledgment flow
- Ship + add tracking
- Order status management
- Payout tracking (via Stripe Connect)

### Chat & Messaging
- Real-time messaging (Supabase Realtime)
- Auto-created conversation on purchase
- Pre-purchase messaging (configurable per seller — toggle in account settings)
- Image attachments
- Order-linked conversations
- Notifications

### Plans & Subscriptions
- Pricing page with plan comparison
- Subscription management via Stripe
- Customer portal (Stripe-hosted)
- Plan-based feature limits (listings, boosts, etc.)
- Plan tiers: **[OPEN — pricing and limits to be finalized. See §10]**

### Boosts
- Listing boost purchase
- Visibility indicator on boosted listings
- Duration tracking
- Plan-based boost limits

### Reviews & Ratings
- Product reviews (text + star rating)
- Seller ratings
- Buyer feedback
- Review display on PDP and seller profile

### Public Profiles
- Public profile page (`/[username]`)
- Display name, avatar, bio, rating
- Seller's listings
- Reviews received
- Follow/unfollow

### Account Settings
- Profile editing (name, avatar, bio)
- Address management
- Security settings (password change)
- Billing/payment methods
- Notification preferences
- Pre-purchase messaging toggle

### Business Dashboard (`/dashboard`)
- Product management (list, edit, delete, bulk operations)
- Order management
- Sales analytics and statistics
- Inventory tracking
- Business profile settings
- **Future:** QR scanner for inventory, bulk CSV import/export, advanced analytics

### Admin Panel
- User management
- Product moderation
- Order oversight
- Seller management
- System health

### Internationalization
- Full UI in English and Bulgarian
- Locale-prefixed URLs (`/en/...`, `/bg/...`)
- Locale detection + cookie persistence
- EUR currency formatting
- Date/number formatting per locale

---

## 8. Feature Specifications

Detailed behavior for key flows. Agents reference these when building or modifying features.

### 8.1 Authentication

**Sign up:** Email + password → email confirmation sent → user clicks confirm link → redirected to onboarding wizard. Password requirements: minimum 8 characters, strength indicator shown.

**Sign in:** Email + password OR Google OAuth. On success: session cookie set, redirect to previous page or homepage. Failed login: generic error message (don't reveal if email exists).

**Password reset:** Enter email → reset link sent → user clicks link → new password form → success → redirect to login.

**Session:** HTTP-only cookies managed by `@supabase/ssr`. Server-side: `getUser()` verifies tokens (never `getSession()`). Client-side: `AuthStateManager` subscribes to auth state changes, throttled refresh every 30 seconds.

**Sign out:** POST request (mutation safety). Clears cookies, redirects to homepage.

### 8.2 Sell Flow

**Target experience:** Open modal/drawer → upload photos → fill minimal fields → publish. Should take under 2 minutes.

**Required fields:**
- Photos (at least 1, up to 10)
- Title (3-100 characters)
- Description (optional but encouraged)
- Category (hierarchical: L1 → L2 → L3 → L4 as applicable)
- Price (EUR, minimum €0.50)
- Condition (new, like new, good, fair, for parts)

**Pre-filled from profile:** Location (city/region)

**Steps:**
1. Upload images
2. Item details (title, description, category, condition)
3. Pricing and review

**AI autofill (future):** User uploads photo → AI recognizes item type → pre-fills title, category, condition estimate, suggested price. User reviews and adjusts. Target: reduce listing to a 10-second task.

**After publish:** Listing immediately visible in marketplace. Seller can edit, pause, or delete from account.

### 8.3 Checkout

**Flow:** Cart → Checkout → address → shipping → payment → confirmation.

**Authentication required.** No guest checkout. Users must sign up or log in before completing a purchase. This is a security decision — identity verification protects both buyers and sellers.

**Address:** User selects a saved address or enters a new one. New addresses are saved to their profile for future use.

**Shipping:** Seller-defined shipping options. Buyer selects from available methods and sees cost before payment.

**Payment:** Stripe Checkout (card payments). Standard Stripe security (3D Secure when required).

**Success:** Order confirmation page with order number, estimated delivery, and link to order tracking.

**Webhook:** Stripe webhook creates the order record. Webhook handler is idempotent (keyed by `stripe_payment_intent_id`).

### 8.4 Chat

**Technology:** Supabase Realtime for real-time messaging.

**Auto-creation:** When a buyer completes a purchase, a conversation is automatically created between buyer and seller, linked to the order.

**Pre-purchase messaging:** Sellers can enable/disable this in their account settings. When enabled, buyers can message the seller from the PDP before purchasing. When disabled, the "Message Seller" option is hidden.

**Features:**
- Text messages
- Image attachments
- Order context (linked order displayed in chat header)
- Read receipts (via Realtime)
- Notifications for new messages

**Moderation:** Report button on messages for abuse/spam.

### 8.5 Business Dashboard

**Purpose:** Give business sellers a Shopify-like backend without needing a separate website or developers.

**Current state:** Scaffolded with core product and order management.

**Target features (V1):**
- Product list with search/filter/sort
- Add/edit/delete products
- Bulk operations (select multiple → bulk action)
- Order management (same as seller orders, but in dashboard context)
- Basic analytics (sales, views, revenue over time)
- Business profile editing
- Stripe Connect status and payout info

**Future features (V2+):**
- QR code scanner for inventory
- CSV/bulk import/export
- Advanced analytics (conversion rates, traffic sources, competitor pricing)
- Customer management (buyer list, purchase history)
- Automated pricing suggestions via AI

### 8.6 Order Lifecycle

**States:**
| Status | Meaning | Triggered by |
|--------|---------|-------------|
| `pending` | Payment received, order created | Stripe webhook |
| `confirmed` | Seller acknowledged the order | Seller action |
| `shipped` | Seller shipped, tracking added | Seller action |
| `delivered` | Item received by buyer | Buyer confirmation |
| `completed` | Order finalized, seller paid | System (after delivered) |
| `cancelled` | Order cancelled | Buyer/seller/system |
| `disputed` | Buyer opened a dispute | Buyer action |

**Auto-completion:** If buyer doesn't mark as received within 14 days after "shipped" status + tracking shows delivered → system auto-completes. **[OPEN — exact policy TBD]**

**Cancellation:** Buyer can cancel before seller confirms. After confirmation, cancellation requires negotiation via chat or dispute.

---

## 9. Categories & Taxonomy

Treido has a hierarchical category system stored in Supabase.

**Structure:** Up to 4 levels deep (L1 → L2 → L3 → L4).

**Example:**
```
Electronics (L1)
  → Phones & Tablets (L2)
    → Smartphones (L3)
      → Apple (L4)
      → Samsung (L4)
    → Tablets (L3)
  → Computers (L2)
    → Laptops (L3)
    → Desktops (L3)
```

**Main categories (~24):** Electronics, Fashion, Home & Garden, Vehicles, Sports, Books, Baby & Kids, Beauty, Pets, Services, and more. Full list managed in Supabase.

**Category attributes:** Different categories can have specific attributes. For example:
- Vehicles: year, make, model, mileage, fuel type
- Fashion: size, color, brand, gender
- Electronics: brand, model, storage capacity, condition

**Category badges:** Visual indicators on category cards (defined in `lib/badges/`).

**Listing scope:** Users can list anything that falls within the defined categories. The category system is the content boundary — if a category doesn't exist for something, it can be added via admin.

---

## 10. Revenue Model

Revenue comes from three streams. **Pricing details are not finalized — this section will be updated after monetization research is completed.**

### Stream 1: Subscription Plans
Sellers (personal and business) choose a plan tier. Higher tiers unlock more features.

**Plan structure (draft):**

| Tier | Audience | Listings | Features | Price |
|------|----------|----------|----------|-------|
| Free | Casual sellers | Limited | Basic listing, chat, payments | €0 |
| Pro | Active sellers | More | Boosts, analytics, AI features | **[OPEN]** |
| Business | Companies | Highest/Unlimited | Full dashboard, bulk tools, priority support, advanced AI | **[OPEN]** |

**Key limits controlled by plan:**
- Number of active listings
- Number of boosts per month
- Access to AI features (listing autofill, shopping assistant)
- Access to analytics depth
- Transaction fee percentage

### Stream 2: Transaction Fees
Platform takes a percentage of each sale via Stripe Connect. Fee percentage varies by seller plan tier (lower fees on higher plans as an incentive to upgrade).

**Fee structure:** **[OPEN — to be finalized]**
- Fees stored in DB (`subscription_plans` table), not hardcoded
- Calculated by `getFeesForSeller()` and `calculateTransactionFees()` in `lib/stripe-connect.ts`

### Stream 3: Listing Boosts
Sellers pay to boost listings for increased visibility. Charged via Stripe Checkout.

**Boost behavior:**
- Boosted listings appear higher in search results and feeds
- Visual indicator shows listing is boosted
- Duration-based (hours/days depending on purchase)
- Boost limits per plan tier

### Seller Payouts
- Sellers receive payments via Stripe Connect (Express accounts)
- **Payout timing:** **[OPEN — direct payout vs escrow to be finalized]**
- Options under consideration:
  - Direct payout after buyer confirms delivery
  - Escrow with auto-release after X days if no dispute
  - Direct payout with post-purchase dispute resolution
- Stripe Connect fields gate payout eligibility: `details_submitted`, `charges_enabled`, `payouts_enabled`

### Buyer Protection
- **[OPEN — buyer protection model to be designed]**
- Goals: Vinted-like buyer protection feel
- Card payments eliminate cash scams
- Dispute resolution flow needed for V1

---

## 11. Competitive Landscape

| Competitor | Strengths | Weaknesses | Treido Advantage |
|------------|-----------|------------|-----------------|
| **OLX / Bazar.bg** | Large user base in Bulgaria, known brand | No card payments, scam-prone, no business tools, dated UX | Secure payments, modern UX, business dashboard |
| **Facebook Marketplace** | Massive reach, zero listing cost | No payment processing, no order management, privacy tied to FB | Full commerce flow, independent identity, professional tools |
| **eBay** | Global reach, buyer protection | Complex UX, not localized for E. Europe, high fees | Simpler UX, local-first, AI-first roadmap, lower barrier |
| **Vinted** | Great mobile UX, buyer protection | Clothing only, no B2B, limited categories | All categories, B2B support, business dashboard |
| **Shopify** | Powerful business tools | Requires separate website + dev work, no marketplace traffic | Treido IS the storefront — no dev needed, built-in marketplace traffic |

### Treido's Unique Position
Treido combines marketplace traffic (like eBay/OLX) + business backend (like Shopify) + secure payments (like Vinted) + AI-first future (like nobody else in this market). No existing platform offers all four.

---

## 12. Trust & Safety

### Seller Verification
- **V1:** Manual verification. Sellers can apply for "Verified" status. Admin reviews identity/business documents.
- **Future:** AI-powered verification. An AI agent checks listing images, account history, seller behavior patterns, and auto-approves or flags for human review.

### Product Moderation
- **V1:** Admin panel for reviewing reported listings. Manual moderation queue.
- **Future:** AI moderation — auto-detect prohibited items, fake listings, stock photos of items the seller doesn't have.

### Reporting
- Report button on listings, profiles, and chat messages
- Report categories: scam, fake item, inappropriate content, harassment
- Reports route to admin moderation queue

### Payment Security
- All payments through Stripe (PCI-compliant, 3D Secure)
- No direct money exchange between users
- Webhook signature verification before any DB write
- Idempotent webhook handlers prevent duplicate orders

### Data Protection
- GDPR compliance (EU requirement)
- Supabase RLS (Row Level Security) on all user data
- HTTP-only session cookies
- No PII in logs
- `getUser()` server verification (never trust client JWTs alone)

---

## 13. Shipping & Logistics

### V1: Seller-Managed Shipping
- Seller chooses the carrier and ships the item
- Seller enters tracking information when shipping
- Buyer sees tracking link in order details
- Buyer and seller can discuss shipping preferences via chat

### Shipping Options
- Sellers define available shipping methods when listing
- Buyers select from available methods at checkout
- Pickup in person is an option (seller enables it per listing)

### Future: Carrier Integration
- **Speedy** (Bulgarian carrier) — label printing, automated tracking
- **Econt** (Bulgarian carrier) — same
- **EU carriers** — DHL, DPD, etc. as we expand
- **In-app shipping labels** — sellers print labels directly from dashboard
- **Calculated shipping** — automatic cost calculation based on weight/dimensions/distance

---

## 14. Internationalization

### Current State
- **Supported locales:** English (`en`), Bulgarian (`bg`)
- **URL structure:** Always locale-prefixed (`/en/...`, `/bg/...`)
- **Default locale:** English
- **Locale detection:** Cookie (`NEXT_LOCALE`) + `Accept-Language` header
- **Translation system:** `next-intl` with JSON message files

### Requirements
- All UI text (labels, buttons, errors, placeholders, tooltips) must be translated in both languages
- Message files (`messages/en.json`, `messages/bg.json`) must have identical key sets
- Production must never show raw translation keys to users
- User-generated content (listings, reviews, messages) stays in the language the user wrote it

### Future
- Additional languages as we expand to new markets
- AI-powered translation of user-generated content (listing descriptions, reviews)
- RTL support if expanding to Middle East markets

---

## 15. Launch Criteria (V1)

V1 launches when ALL of these work reliably:

### Must Work
- [ ] User can sign up, log in, reset password, sign out
- [ ] User completes onboarding (account type, profile)
- [ ] User can browse, search, and filter products
- [ ] User can view product details with images, info, reviews
- [ ] User can add items to cart and wishlist
- [ ] User can complete checkout with Stripe card payment
- [ ] Seller can list a product with images, description, category, price
- [ ] Seller receives and manages orders (confirm, ship, track)
- [ ] Chat works between buyer and seller
- [ ] Order lifecycle works end-to-end (purchase → delivery → completion)
- [ ] Reviews and ratings work
- [ ] Plans page exists with subscription management
- [ ] Boost purchase and display works
- [ ] Business dashboard has product + order management
- [ ] Public profiles display correctly
- [ ] Admin panel allows user/product/order management
- [ ] Full English and Bulgarian translations
- [ ] Mobile and desktop UX meet quality bar (see `docs/DESIGN.md`)

### Must Be Secure
- [ ] Stripe webhook idempotency (no duplicate orders on replay)
- [ ] Refund/dispute flow tested end-to-end
- [ ] Stripe environment separation (prod keys + webhook secrets)
- [ ] Leaked password protection enabled
- [ ] RLS enabled on all user data tables
- [ ] `getUser()` used everywhere (no `getSession()` for auth)
- [ ] No PII in logs
- [ ] GDPR-compliant data handling

### Must Be Clean
- [ ] Codebase < 400 files, < 45K LOC (refactor target)
- [ ] Zero typecheck errors
- [ ] Zero lint errors
- [ ] Style gates pass
- [ ] Unit tests pass
- [ ] No test/dummy data in production

---

## 16. V1 Scope Boundaries

These features are explicitly **not in V1**. They inform the direction but should not be built, designed for, or scaffolded during V1 work unless specifically requested.

| Feature | Why not V1 | When |
|---------|-----------|------|
| AI shopping agent | Core marketplace must work first | V2 |
| AI sell autofill (photo → auto-fill) | Enhancement, not blocker | V2 |
| WhatsApp/external channel agents | Requires stable AI agent first | V3 |
| Generative UI | Requires large product database + AI foundation | V3 |
| Native iOS/Android apps | Web app must be solid first | V2-V3 |
| Auction/bidding | Fixed-price marketplace first | V3+ |
| B2B bulk pricing / wholesale | Need usage data first | V2-V3 |
| Multi-currency (beyond EUR) | EUR covers launch markets | V2 |
| Carrier integration (Speedy/Econt) | Seller-managed shipping works for V1 | V2 |
| Shipping label printing | Requires carrier integration | V2 |
| CSV/API bulk catalog import | Dashboard manual entry for V1 | V2 |
| QR scanner for inventory | Nice-to-have for businesses | V2 |
| Advanced analytics | Basic stats for V1, deep analytics later | V2 |
| Email notifications (transactional) | In-app notifications for V1 | V1.5 |
| Saved searches / alerts | Search must be solid first | V2 |
| Seller verification badges | Manual verification V1, automated later | V2 |
| Business networking features | Marketplace must have traction first | V3+ |

---

## 17. Success Metrics

For V1 launch, we track these signals to know if the platform works. No hard numeric targets — we observe patterns and iterate.

**Platform health:**
- Users can complete the full buy flow without errors
- Sellers can list and manage products without friction
- Page load times stay under 3 seconds on mobile
- Chat messages deliver in real-time
- Payment success rate (Stripe dashboard)

**Engagement signals:**
- New listings per week (growing = healthy)
- Completed transactions per week
- Return user rate
- Chat activity (buyers messaging sellers)
- Wishlist usage

**Business signals:**
- Plan upgrades (Free → Pro, Pro → Business)
- Boost purchases
- Seller retention (sellers listing multiple items over time)

---

## 18. Future Roadmap

### V1.5 — Polish & Expand
- Email notifications (order updates, shipping, reviews)
- Improved search relevance
- Enhanced mobile UX refinements
- Performance optimization
- Bug fixes and stability

### V2 — AI & Growth
- AI listing autofill (photo → details → publish in 10 seconds)
- AI search assistant (natural language product search)
- Carrier integration (Speedy, Econt for Bulgaria)
- Shipping label printing
- CSV/bulk product import for businesses
- Advanced analytics dashboard
- Additional EU markets
- Seller verification badges (automated)

### V3 — The Platform
- Full AI shopping agents (conversational commerce)
- WhatsApp / external channel integration
- Generative UI (adaptive interface based on context)
- Business AI agents (competitor tracking, pricing, inventory management)
- Global expansion (worldwide shipping, distributors)
- B2B features (wholesale, bulk pricing, business networking)
- Native mobile apps
- Paid AI tiers (personalized shopping agents)
- Multi-currency support
- Auction / bidding system

---

## 19. Technical Context

For agents working on the codebase. Full details in `docs/STACK.md`.

| Layer | Tech | Key detail |
|-------|------|------------|
| Framework | Next.js 16, App Router | Server Components by default |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS v4, shadcn/ui | CSS-first config, semantic tokens only |
| Auth | Supabase Auth (`@supabase/ssr`) | `getUser()` only — `getSession()` banned |
| Database | Supabase Postgres + RLS | Client selection in `docs/STACK.md` § Supabase |
| Payments | Stripe (Checkout, Connect, Subscriptions) | Webhook verification mandatory |
| Messaging | Supabase Realtime | Real-time chat |
| i18n | next-intl | `en` + `bg`, locale-prefixed URLs |
| AI (future) | Vercel AI SDK | Chat-based agent interface |
| Hosting | Vercel | Edge middleware, ISR |

### Key Technical Constraints
- `getUser()` only — `getSession()` is banned (security: JWT spoofing risk)
- Webhooks: `constructEvent()` before any DB write
- Handlers must be idempotent
- Route-private `_components/` never imported across route groups
- Semantic tokens only — no palette classes, no raw hex, no arbitrary values
- No `select('*')` in hot paths
- Correct Supabase client per context (see `docs/STACK.md` § Supabase)

---

## 20. Glossary

Consistent terminology across all project documentation.

| Term | Meaning | Don't say |
|------|---------|-----------|
| **listing** | A product posted for sale | ad, post, item (when referring to the listing entity) |
| **PDP** | Product Detail Page — the full view of a single listing | product page, listing page |
| **server action** | Function in `app/actions/` with `"use server"` | action, server-side action |
| **route handler** | Function in `app/api/` (GET/POST/etc.) | API route, REST endpoint |
| **cached fetcher** | Function in `lib/data/` using `"use cache"` | data fetcher, query function |
| **webhook** | External service calling our API (Stripe → our route handler) | callback, hook |
| **envelope** | Standard return shape from server actions (`{ data, error }`) | response, result |
| **plan** | Subscription tier (Free/Pro/Business) | package, membership |
| **boost** | Paid visibility upgrade for a listing | promote, feature, highlight |
| **payout** | Money sent from Treido/Stripe to seller | payment (ambiguous — payment = buyer pays) |
| **seller** | User who lists products (personal or business) | vendor, merchant |
| **dashboard** | Business seller management interface at `/dashboard` | admin panel (that's different), backend |
| **admin panel** | Treido team management interface | dashboard (that's for sellers) |
| **locale** | Language+region code (en, bg) | language (technically broader) |
| **token** | CSS custom property for theming (`--color-primary`) | variable, color, theme value |

---

## 21. Open Questions

Decisions not yet made. These must be resolved before or shortly after V1 launch.

| ID | Question | Context | Status |
|----|----------|---------|--------|
| OPEN-001 | What are the exact plan tiers, limits, and pricing? | Had research docs but they may be deleted. Need to check old git history or recreate. | **Unresolved** |
| OPEN-002 | Direct payout vs escrow? | Leaning toward direct payout with post-sale dispute resolution. Need to consider Stripe fees and buyer protection UX. | **Leaning direct** |
| OPEN-003 | Buyer protection model | Want Vinted-like buyer protection feel. Need to design the dispute/refund flow. | **Unresolved** |
| OPEN-004 | Auto-complete policy for orders | If buyer never confirms receipt, when does the order auto-complete? 14 days? 30 days? | **Leaning 14 days** |
| OPEN-005 | Business vs Personal platform separation | Should there be a mode switch (personal/business listings) or unified feed? Current: unified. | **Leaning unified** |
| OPEN-006 | Transaction fee percentages per plan | Need to model economics. Higher plan = lower fee to incentivize upgrades. | **Unresolved** |
| OPEN-007 | Pre-purchase messaging default | Toggle exists. Should it be on or off by default for new sellers? | **Leaning off** |

---

*Last updated: 2026-02-18*
*Filled via questionnaire between human and Copilot*
