# UI/UX + A11y Audit (Desktop + Mobile)

Date: 2026-01-22

# Mobile UI/UX + A11y Audit (Playwright MCP)

Date: 2026-01-22

Target: http://localhost:3000 (locale: /en)

## Method
- Playwright MCP navigation + console error capture.
- Route scan via in‑browser `fetch` for all static routes.
- DOM‑level a11y heuristics (missing names/labels, missing alt, tap targets < 32px, duplicate landmarks).
- Manual mobile UX review on core flows (home, search, categories, cart, checkout, auth, product, members, help).

## Viewport
- Playwright MCP viewport width ~756px (below md breakpoint; mobile nav visible).
- Tool limitation: cannot force 390×844 in this session.

## Limitations
- No auth credentials for account/seller/admin/business/chat routes.
- Dynamic IDs/tokens missing for some routes.
- Not every button clicked; this pass uses automated a11y heuristics + manual spot checks.

## Treido Audit - 2026-01-22

### Critical (blocks release)
- [ ] Members page hard error (Supabase code 42703) → /en/members → fix query/column and error handling.
- [ ] Hydration mismatch errors on /en and /en/tech_haven/philips-sonicare-diamondclean → fix SSR/CSR divergence to avoid UI flicker + broken interactions.

### High (next sprint)
- [ ] /en/help renders an empty main region + generic title → add content or redirect to /en/customer-service.
- [ ] /en/auth/welcome appears blank (image‑only, generic title) → add content/CTAs or redirect.
- [ ] Icon‑only controls missing accessible names (home/product/search/login) → add `aria-label` or visible text.
- [ ] Header search input lacks a label (placeholder‑only) → add label/aria‑label.
- [ ] Missing alt text on many images (home/search/categories) → add alt or `aria-hidden` for decorative imagery.
- [ ] Tap targets below 32px (logo, footer links, cookie banner, avatar links) → increase size.
- [ ] Home page has nested `<main>` landmarks → flatten to a single main landmark.
- [ ] /en/categories/fashion logs a 404 resource error → fix missing asset reference.

### Deferred (backlog)
- [ ] Generic titles on /en/plans, /en/checkout, /en/checkout/success, /en/auth/forgot-password, /en/auth/reset-password, /en/auth/sign-up-success, /en/auth/error.
- [ ] Dense card actions (wishlist + add to cart + share) reduce mobile scanability → reduce to one primary action.
- [ ] Category list pages are text‑heavy on mobile → collapse sublabels and improve hierarchy.
- [ ] Cookie banner “Learn more” link is tiny → rework layout for easier access.

## A11y snapshot summary (DOM heuristics)

| Route | Buttons no name | Links no name | Inputs no label | Images missing alt | Small targets | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| /en | 1 | 0 | 1 | 24 | 3 | 2 `<main>` landmarks; hydration warning seen |
| /en/search | 2 | 0 | 1 | 18 | 3 | Filters + checkbox controls |
| /en/categories | 1 | 0 | 1 | 24 | 1 | Long text blocks |
| /en/cart | 1 | 0 | 1 | 0 | 2 | Empty cart state |
| /en/checkout | 0 | 0 | 0 | 0 | 1 | Empty checkout state; generic title |
| /en/auth/login | 1 | 1 | 1 | 0 | 5 | Tiny legal links + checkbox issue |
| /en/tech_haven/philips-sonicare-diamondclean | 2 | 2 | 1 | 1 | 3 | Hydration warning seen |

## Mobile UI/UX Roast (Observed)

### Home (/en)
- Category ribbon is a mile long; everything after the first few tabs becomes a cognitive tax.
- Promoted listings look almost identical to organic cards; sponsored content is easy to miss.
- Cards are overstuffed with price/rating/badges/actions; the primary action is not clear.
- Search affordance reads like a button, not an input; zero label context.

### Search (/en/search)
- Filters + sort are visually weak and not sticky; mobile needs a pinned control bar.
- Card density is high, scanability drops quickly.

### Categories (/en/categories)
- Each card dumps a paragraph of subcategories; on mobile it reads like a wall of text.
- No quick jump or search affordance for 24 categories.

### Product page (/en/tech_haven/philips-sonicare-diamondclean)
- Action overload: share + wishlist + chat + add to cart, plus tabs and accordions competing for attention.
- Primary CTA is not dominant; it’s visually equal to secondary actions.
- Shipping/returns blocks feel like filler without prioritization.

### Cart (/en/cart) + Checkout (/en/checkout)
- Empty checkout state is functional but generic; no guidance beyond “continue shopping.”
- Title is generic (“Treido”), which hurts clarity and accessibility.

### Auth (/en/auth/login)
- Duplicate/hidden checkbox input creates confusion for screen readers.
- “Create account” is a link that wraps a button → nested interactive element.
- Legal links are tiny and easy to mis‑tap.

### Help (/en/help)
- Main content is empty; the route reads like a dead end.

### Members (/en/members)
- Hard error (Supabase 42703) → page fails and shows error boundary.

## Route scan results (Playwright MCP fetch)

### Public marketing/support/legal
| Route | Status | Final URL | Title / Notes |
| --- | ---: | --- | --- |
| /en | 200 | /en | Home | Treido |
| /en/about | 200 | /en/about | About Us | Treido |
| /en/blog | 200 | /en/blog | Treido Blog | Treido |
| /en/careers | 200 | /en/careers | Careers at Treido | Treido |
| /en/investors | 200 | /en/investors | Investor Relations | Treido |
| /en/advertise | 200 | /en/advertise | Advertise with Treido | Treido |
| /en/affiliates | 200 | /en/affiliates | Affiliate Program | Treido |
| /en/suppliers | 200 | /en/suppliers | Supplier Portal | Treido |
| /en/sellers | 200 | /en/sellers | Title duplicated (“Top sellers | Treido | Treido”) |
| /en/store-locator | 200 | /en/store-locator | Store Locator | Treido |
| /en/gift-cards | 200 | /en/gift-cards | Treido Gift Cards | Treido |
| /en/registry | 200 | /en/registry | Celebrate every milestone with Treido Registry | Treido |
| /en/free-shipping | 200 | /en/free-shipping | Shipping Information | Treido |
| /en/accessibility | 200 | /en/accessibility | Accessibility | Treido |
| /en/members | 200 | /en/members | Error boundary (Supabase 42703) |
| /en/todays-deals | 200 | /en/todays-deals | Today’s Deals | Treido |
| /en/search | 200 | /en/search | Search Results | Treido |
| /en/categories | 200 | /en/categories | Categories | Treido |
| /en/cart | 200 | /en/cart | Cart | Treido |
| /en/wishlist | 200 | /en/wishlist | My Wishlist | Treido |
| /en/customer-service | 200 | /en/customer-service | Customer Service | Treido |
| /en/help | 200 | /en/help | Generic title (“Treido”), empty main |
| /en/faq | 200 | /en/faq | FAQ | Treido |
| /en/contact | 200 | /en/contact | Contact Us | Treido |
| /en/security | 200 | /en/security | Security at Treido | Treido |
| /en/feedback | 200 | /en/feedback | Feedback | Treido |
| /en/returns | 200 | /en/returns | Returns & Refunds | Treido |
| /en/terms | 200 | /en/terms | Terms of Service | Treido |
| /en/privacy | 200 | /en/privacy | Privacy Policy | Treido |
| /en/cookies | 200 | /en/cookies | Cookie Policy | Treido |
| /en/plans | 200 | /en/plans | Generic title (“Treido”) |

### Category pages
| Route | Status | Final URL | Title |
| --- | ---: | --- | --- |
| /en/categories/fashion | 200 | /en/categories/fashion | Fashion - Shop | Treido |
| /en/categories/electronics | 200 | /en/categories/electronics | Electronics - Shop | Treido |
| /en/categories/home | 200 | /en/categories/home | Home & Kitchen - Shop | Treido |
| /en/categories/beauty | 200 | /en/categories/beauty | Beauty - Shop | Treido |
| /en/categories/health-wellness | 200 | /en/categories/health-wellness | Health - Shop | Treido |
| /en/categories/sports | 200 | /en/categories/sports | Sports - Shop | Treido |
| /en/categories/baby-kids | 200 | /en/categories/baby-kids | Kids - Shop | Treido |
| /en/categories/gaming | 200 | /en/categories/gaming | Gaming - Shop | Treido |
| /en/categories/automotive | 200 | /en/categories/automotive | Automotive - Shop | Treido |
| /en/categories/pets | 200 | /en/categories/pets | Pets - Shop | Treido |
| /en/categories/real-estate | 200 | /en/categories/real-estate | Real Estate - Shop | Treido |
| /en/categories/software | 200 | /en/categories/software | Software - Shop | Treido |
| /en/categories/grocery | 200 | /en/categories/grocery | Grocery & Food - Shop | Treido |
| /en/categories/wholesale | 200 | /en/categories/wholesale | Wholesale - Shop | Treido |
| /en/categories/hobbies | 200 | /en/categories/hobbies | Hobbies - Shop | Treido |
| /en/categories/jewelry-watches | 200 | /en/categories/jewelry-watches | Jewelry & Watches - Shop | Treido |
| /en/categories/bulgarian-traditional | 200 | /en/categories/bulgarian-traditional | Bulgarian Traditional - Shop | Treido |
| /en/categories/e-mobility | 200 | /en/categories/e-mobility | E-Mobility - Shop | Treido |
| /en/categories/services | 200 | /en/categories/services | Services & Events - Shop | Treido |
| /en/categories/books | 200 | /en/categories/books | Books - Shop | Treido |
| /en/categories/movies-music | 200 | /en/categories/movies-music | Movies & Music - Shop | Treido |
| /en/categories/jobs | 200 | /en/categories/jobs | Jobs - Shop | Treido |
| /en/categories/collectibles | 200 | /en/categories/collectibles | Collectibles - Shop | Treido |
| /en/categories/tools-home | 200 | /en/categories/tools-home | Tools & Industrial - Shop | Treido |

### Checkout + Auth
| Route | Status | Final URL | Title / Notes |
| --- | ---: | --- | --- |
| /en/checkout | 200 | /en/checkout | Generic title (“Treido”) |
| /en/checkout/success | 200 | /en/checkout/success | Generic title (“Treido”) |
| /en/auth/login | 200 | /en/auth/login | Sign In | Treido |
| /en/auth/sign-up | 200 | /en/auth/sign-up | Create Account | Treido |
| /en/auth/forgot-password | 200 | /en/auth/forgot-password | Generic title (“Treido”) |
| /en/auth/reset-password | 200 | /en/auth/reset-password | Generic title (“Treido”) |
| /en/auth/sign-up-success | 200 | /en/auth/sign-up-success | Generic title (“Treido”) |
| /en/auth/welcome | 200 | /en/auth/welcome | Generic title; page appears blank |
| /en/auth/error | 200 | /en/auth/error | Generic title (“Treido”) |

### Seller / Account / Chat (auth gated)
| Route | Status | Final URL | Notes |
| --- | ---: | --- | --- |
| /en/sell | 200 | /en/auth/login?next=%2Fen%2Fsell | Silent auth gate |
| /en/sell/orders | 200 | /en/auth/login?next=%2Fen%2Fsell%2Forders | Silent auth gate |
| /en/seller/dashboard | 200 | /en/seller/dashboard | Likely auth‑gated (verify with credentials) |
| /en/seller/settings/payouts | 200 | /en/seller/settings/payouts | Likely auth‑gated (verify with credentials) |
| /en/account | 200 | /en/auth/login?next=%2Fen%2Faccount | Silent auth gate |
| /en/account/addresses | 200 | /en/auth/login?next=%2Fen%2Faccount%2Faddresses | Silent auth gate |
| /en/account/billing | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fbilling | Silent auth gate |
| /en/account/orders | 200 | /en/auth/login?next=%2Fen%2Faccount%2Forders | Silent auth gate |
| /en/account/payments | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fpayments | Silent auth gate |
| /en/account/plans | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fplans | Silent auth gate |
| /en/account/plans/upgrade | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fplans%2Fupgrade | Silent auth gate |
| /en/account/profile | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fprofile | Silent auth gate |
| /en/account/security | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fsecurity | Silent auth gate |
| /en/account/settings | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fsettings | Silent auth gate |
| /en/account/notifications | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fnotifications | Silent auth gate |
| /en/account/sales | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fsales | Silent auth gate |
| /en/account/selling | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fselling | Silent auth gate |
| /en/account/selling/edit | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fselling%2Fedit | Silent auth gate |
| /en/account/wishlist | 200 | /en/auth/login?next=%2Fen%2Faccount%2Fwishlist | Silent auth gate |
| /en/account/following | 200 | /en/auth/login?next=%2Fen%2Faccount%2Ffollowing | Silent auth gate |
| /en/chat | 200 | /en/auth/login?next=%2Fen%2Fchat | Silent auth gate |

### Admin + Business dashboard (auth gated)
| Route | Status | Final URL | Notes |
| --- | ---: | --- | --- |
| /en/admin | 200 | /en/admin | Browser navigation redirected to /en/auth/login |
| /en/admin/users | 200 | /en/admin/users | Browser navigation redirected to /en/auth/login |
| /en/admin/products | 200 | /en/admin/products | Browser navigation redirected to /en/auth/login |
| /en/admin/sellers | 200 | /en/admin/sellers | Browser navigation redirected to /en/auth/login |
| /en/admin/orders | 200 | /en/admin/orders | Browser navigation redirected to /en/auth/login |
| /en/admin/tasks | 200 | /en/admin/tasks | Browser navigation redirected to /en/auth/login |
| /en/admin/notes | 200 | /en/admin/notes | Browser navigation redirected to /en/auth/login |
| /en/admin/docs | 200 | /en/admin/docs | Browser navigation redirected to /en/auth/login |
| /en/dashboard | 200 | /en/dashboard | Browser navigation redirected to /en/auth/login |
| /en/dashboard/analytics | 200 | /en/dashboard/analytics | Browser navigation redirected to /en/auth/login |
| /en/dashboard/accounting | 200 | /en/dashboard/accounting | Browser navigation redirected to /en/auth/login |
| /en/dashboard/customers | 200 | /en/dashboard/customers | Browser navigation redirected to /en/auth/login |
| /en/dashboard/discounts | 200 | /en/dashboard/discounts | Browser navigation redirected to /en/auth/login |
| /en/dashboard/inventory | 200 | /en/dashboard/inventory | Browser navigation redirected to /en/auth/login |
| /en/dashboard/marketing | 200 | /en/dashboard/marketing | Browser navigation redirected to /en/auth/login |
| /en/dashboard/orders | 200 | /en/dashboard/orders | Browser navigation redirected to /en/auth/login |
| /en/dashboard/products | 200 | /en/dashboard/products | Browser navigation redirected to /en/auth/login |
| /en/dashboard/settings | 200 | /en/dashboard/settings | Browser navigation redirected to /en/auth/login |
| /en/dashboard/upgrade | 200 | /en/dashboard/upgrade | Browser navigation redirected to /en/auth/login |

### Dynamic samples
| Route | Status | Final URL | Title |
| --- | ---: | --- | --- |
| /en/tech_haven | 200 | /en/tech_haven | tech_haven (@tech_haven) | Treido |
| /en/tech_haven/philips-sonicare-diamondclean | 200 | /en/tech_haven/philips-sonicare-diamondclean | Philips Sonicare DiamondClean | tech_haven | Treido |

## Dynamic routes not fully audited
- /en/[username]/[productSlug] beyond sampled
- /en/categories/:slug/:subslug
- /en/wishlist/:token and /en/wishlist/shared/:token
- /en/account/orders/:id and /en/account/selling/:id/edit
- /en/dashboard/orders/:orderId and /en/dashboard/products/:productId/edit
- /en/chat/:conversationId

## What I need to complete “every single page/button”
- Test accounts for user, seller, admin, business.
- Sample IDs/tokens for dynamic routes.
- Permission to script click‑through flows and destructive actions (if any).
|---|---:|---|---|

| /en/account | 200 | /en/account | Generic title “Treido” |
| /en/account/profile | 200 | /en/account/profile | ERR_UNKNOWN_URL_SCHEME (avatar) |
| /en/account/addresses | 200 | /en/account/addresses | OK |
| /en/account/orders | 200 | /en/account/orders | OK |
| /en/account/orders/1 | 200 | /en/account/orders/1 | ID appears to resolve even if order missing |
| /en/account/payments | 200 | /en/account/payments | OK |
| /en/account/billing | 200 | /en/account/billing | 500 + billing fetch failed |
| /en/account/plans | 200 | /en/account/plans | OK |
| /en/account/plans/upgrade | 200 | /en/account/plans/upgrade | OK |
| /en/account/wishlist | 200 | /en/account/wishlist | OK |
| /en/account/notifications | 200 | /en/account/notifications | 400 on data fetch |
| /en/account/settings | 200 | /en/account/settings | OK |
| /en/account/security | 200 | /en/account/security | OK |
| /en/account/selling | 200 | /en/account/selling | OK |
| /en/account/selling/edit | 200 | /en/account/selling/edit | 400 on data fetch |
| /en/account/selling/1/edit | 200 | /en/account/selling | 400 and redirect back |
| /en/account/sales | 200 | /en/account/sales | OK |
| /en/chat | 200 | /en/chat | OK |
| /en/chat/1 | 200 | /en/chat/1 | OK (no visible thread data) |
| /en/seller/dashboard | 200 | /en/account | Redirected to account (no seller access) |
| /en/seller/settings/payouts | 200 | /en/seller/settings/payouts | 400 on data fetch |
| /en/business/dashboard | 200 | /en/business/dashboard | “Product Not Found” (route mismatch) |
| /en/business/dashboard/* | 404 | same | 404 + icon.svg invalid host |
| /en/admin | 200 | /en/admin | 404 asset fetch (likely missing bundle) |
| /en/admin/users | 200 | /en/admin/users | 404 asset fetch |
| /en/admin/products | 200 | /en/admin/products | 404 asset fetch |
| /en/admin/orders | 200 | /en/admin/orders | 404 asset fetch |
| /en/admin/sellers | 200 | /en/admin/sellers | 404 asset fetch |
| /en/admin/tasks | 200 | /en/admin/tasks | 404 asset fetch |
| /en/admin/notes | 200 | /en/admin/notes | 404 asset fetch |
| /en/admin/docs | 200 | /en/admin/docs | 404 asset fetch |

Admin side‑nav targets that resolve to Not Found:

| Route | Status | Final URL | Notes |
|---|---:|---|---|
| /en/admin/categories | 200 | same | “Product Not Found” page |
| /en/admin/brands | 200 | same | “Product Not Found” page |
| /en/admin/messages | 200 | same | “Product Not Found” page + 400 fetch |
| /en/admin/subscriptions | 200 | same | “Product Not Found” page |
| /en/admin/analytics | 200 | same | “Product Not Found” page |
| /en/admin/settings | 200 | same | “Product Not Found” page |

Additional console warnings during auth scan:
- Chart components logging `width(-1) / height(-1)` (layout measurement bug).
- `icon.svg` loaded from `http://0.0.0.0:3000` (invalid host).
- “Cart sync skipped (RPC unavailable): integer out of range” indicates backend RPC bug.

---

# Mobile Route Scan Results (390×844)

| Route | Status | Final URL | Notes |
|---|---:|---|---|
| /en | 200 | /en | OK |
| /en/search | 200 | /en/search | OK |
| /en/categories | 200 | /en/categories | OK |
| /en/cart | 200 | /en/cart | OK |
| /en/tech_haven/philips-sonicare-diamondclean | 200 | same | OK |
| /en/checkout | 200 | /en/checkout | Generic title “Treido” |
| /en/auth/login | 200 | /en/auth/login | OK |
| /en/terms | 200 | /en/terms | OK |
| /en/privacy | 200 | /en/privacy | OK |
| /en/sell | 200 | /en/auth/login?next=%2Fen%2Fsell | Silent auth gate |

---

# Authenticated Mobile Route Scan Results (390×844)

| Route | Status | Final URL | Notes |
|---|---:|---|---|
| /en/account | 200 | /en/account | Generic title “Treido” |
| /en/account/profile | 200 | /en/account/profile | ERR_UNKNOWN_URL_SCHEME (avatar) |
| /en/account/orders | 200 | /en/account/orders | OK |
| /en/account/wishlist | 200 | /en/account/wishlist | OK |
| /en/chat | 200 | /en/chat | 400 on data fetch |
| /en/sell | 200 | /en/sell | 400 on data fetch |
| /en/admin | 200 | /en/admin | OK (admin shell loads) |

---

# Routes Discovered But Not Fully Audited (Auth/Dynamic)

- /en/business/dashboard/* (routes exist but return 404/Not Found)
- /en/seller/* (seller dashboard redirect; payouts 400)
- /en/chat/* (thread‑level data not verified)
- /en/[username] and /en/[username]/[productSlug]
- /en/categories/[slug] and /en/categories/[slug]/[subslug]
- /en/wishlist/[token] and /en/wishlist/shared/[token]

Provide sample slugs/IDs for dynamic routes (category slugs, wishlist tokens, real order IDs) to complete a true full audit.

---

# Immediate Recommendations

1) Fix /en/members query error (Supabase column mismatch).
2) Fix /en/auth/welcome redirect and invalid asset URLs.
3) Remove or normalize custom URL schemes for avatars (use https/data URLs).
4) Assign meaningful page titles for all public/auth pages.
5) Flatten landmark structure (single `<main>` per page).
6) Simplify product card actions; introduce a single primary CTA.
7) Make filters/sort controls sticky and visually stronger on mobile.
8) Add visible labels or tooltips for icon-only actions.
9) Fix billing/notifications/seller payout fetches returning 400/500.
10) Fix business dashboard 404s or remove routes from nav until ready.
11) Resolve chart layout measurements (width/height -1) to prevent empty graphs.
12) Fix admin side‑nav route mapping or create missing admin pages.
13) Replace `http://0.0.0.0:3000/icon.svg` with a valid absolute/relative asset URL.
14) Fix “Buy Now” to reliably route to checkout.
15) Wrap optimistic state updates in transitions/actions to remove React warnings.
16) Fix PhotoSwipe chunk loading warnings for image lightbox.

---

# What I need to finish the “every single page/button” pass
- Test accounts for user, seller, admin, business.
- Sample dynamic slugs/IDs (category slugs, wishlist token, product slugs).
- Confirmation on whether I can auto‑generate test data or use seeded fixtures.
