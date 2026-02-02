# Desktop Buying Audit — Treido V1

> Buyer flows tested on desktop viewports (1920x1080, 1440x900)

| Status | ✅ Complete |
|--------|-------------|
| Viewport | Desktop |
| Tested | 2026-02-02 |

---

## Test Matrix

| Test | 1920x1080 | 1440x900 | Status |
|------|-----------|----------|--------|
| Homepage load | ✅ | ✅ | Pass |
| Category navigation | ✅ | ⬜ | Pass (via Today's Deals) |
| Search + filters | 🔄 | 🔄 | Redirects to onboarding |
| Product detail page | ✅ | ✅ | Pass |
| Add to cart | ⬜ | ⬜ | Requires auth |
| Cart management | 🔄 | 🔄 | Redirects to onboarding |
| Checkout flow | ✅ | ✅ | Pass (empty state) |
| Order confirmation | ⬜ | ⬜ | Requires completed order |

---

## Test Results

### 1. Homepage Load (`/`)

| Field | Result |
|-------|--------|
| Status | ✅ Pass |
| Title | "Home \| Treido" |
| Load | Full page loads with products |
| Layout | No horizontal scroll ✅ |

**Content Verified:**
- ✅ Skip links for accessibility (main content, sidebar, products, footer)
- ✅ Header with: Menu, Logo, Search, Wishlist, Cart buttons
- ✅ Category tabs (All, Fashion, Tech, Home, Beauty, Health, Sports, Kids, Gaming, Auto, Pets, Real Estate, Software, Grocery & Food, Wholesale, Hobbies, Jewelry, Bulgarian Traditional, E-Mobility, Services, Books, Media, Jobs, Collect, Tools & Industrial)
- ✅ "Promoted Listings" section with products
- ✅ "Today's Offers" section with discounted products  
- ✅ "Trending in Fashion" section
- ✅ "Electronics" section
- ✅ "Automotive Deals" section
- ✅ Product grid with filters (Newest, Offers, Nearby, Sale, Top Rated, Free Ship)
- ✅ Product cards with images, prices, discounts, ratings
- ✅ "Have something to sell?" CTA banner
- ✅ Footer with Company, Help, Sell & Business, Services sections
- ✅ Mobile navigation bar (Home, Categories, Sell, Chat, Account)

**Product Card Features:**
- ✅ Product images
- ✅ Discount badges (e.g., "-21%", "Promo")
- ✅ "Add to wishlist" button
- ✅ Current price and original price
- ✅ Product title
- ✅ Star ratings with review count

---

### 2. Category Navigation

| Field | Result |
|-------|--------|
| Status | ✅ Pass |
| Tested Via | Today's Deals page |
| Notes | `/categories` redirects to onboarding |

**Categories Route Issue:**
- `/categories` page redirects unauthenticated users to `/onboarding/account-type`
- This may be intentional (session-based category preferences) or a bug
- **See ISSUE-002**

---

### 3. Today's Deals (`/todays-deals`)

| Field | Result |
|-------|--------|
| Status | ✅ Pass |
| Title | "Today's Deals \| Treido" |
| Products | 48 deals displayed |

**Page Structure:**
- ✅ Breadcrumb: Treido > Today's Deals
- ✅ Header with icon, title "Today's Deals", description
- ✅ Product count: "48 deals found"
- ✅ Product grid with discount badges up to -75%
- ✅ Product categories displayed (Services, Software, Books, etc.)
- ✅ Ratings and review counts shown
- ✅ Mobile navigation present

---

### 4. Search + Filters (`/search`)

| Field | Result |
|-------|--------|
| Status | ⚠️ Issue |
| Behavior | Redirects to onboarding |
| Routes | `/search?q=phone` → `/onboarding/account-type` |
| Issue | **ISSUE-002**: Search requires session |

---

### 5. Product Detail Page

| Field | Result |
|-------|--------|
| Status | ✅ Pass |
| Route | `/:username/:productSlug` |

**Tested:** `/tech_haven/google-pixel-8-pro`

| Field | Value |
|-------|-------|
| Title | "Google Pixel 8 Pro \| tech_haven \| Treido" |
| H1 | "Google Pixel 8 Pro" |
| Images | 24 images on page |
| Buttons | 36 buttons |
| SEO | JSON-LD structured data present |

**JSON-LD Verified:**
- ✅ @type: "Product"
- ✅ name, description, image array
- ✅ sku (product UUID)
- ✅ offers with price in EUR

---

### 6. Cart (`/cart`)

| Field | Result |
|-------|--------|
| Status | ⚠️ Issue |
| Title | "Cart \| Treido" (briefly) |
| Behavior | Redirects to onboarding |
| Issue | **ISSUE-002**: Cart requires session |

---

### 7. Checkout (`/checkout`)

| Field | Result |
|-------|--------|
| Status | ✅ Pass |
| Title | "Checkout \| Treido" |
| Content | Header with "Secure Checkout" label |
| State | Empty/loading state (no cart items) |

---

## Issues Found

### ISSUE-002: Public Routes Redirect to Onboarding

| Field | Value |
|-------|-------|
| Viewport | Desktop |
| Routes | `/search`, `/cart`, `/categories` |
| Severity | 🟠 High |
| Type | UX/Routing |
| Expected | These routes should be public per docs/05-ROUTES.md |
| Actual | Unauthenticated users redirected to `/onboarding/account-type` |
| Impact | Users cannot search or view cart without completing onboarding |
| Docs Conflict | Routes doc marks `/search`, `/cart`, `/categories` as "public" |

**Affected Routes:**
- `/search?q=*` - Should allow guest search
- `/cart` - Should allow guest cart (documented as public)
- `/categories` - Should show category listing

---

*Last updated: 2026-02-02*
