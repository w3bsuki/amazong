# Comprehensive Playwright Audit Plan

## Project Overview
- **Project**: AMZN E-Commerce Marketplace
- **Stack**: Next.js (latest), React 19, Supabase, Tailwind CSS v4, shadcn/ui
- **Database**: 20 tables including profiles, sellers, products, orders, messages, etc.
- **Localization**: next-intl (en/bg)
- **Date**: December 1, 2025

---

## 1. Route Inventory

### Public Routes (Main Layout)
| Route | Purpose | Status | Notes |
|-------|---------|--------|-------|
| `/` | Homepage | ⏳ Pending | Hero, categories, deals |
| `/search` | Search results | ⏳ Pending | Filters, pagination |
| `/categories` | Category listing | ⏳ Pending | All categories grid |
| `/categories/[slug]` | Category products | ⏳ Pending | Subcategories, products |
| `/product/[id]` | Product detail | ⏳ Pending | Buy box, reviews, images |
| `/cart` | Shopping cart | ⏳ Pending | Cart items, checkout link |
| `/checkout` | Checkout flow | ⏳ Pending | Shipping, payment |
| `/seller/[id]` | Seller store | ⏳ Pending | Seller products, rating |
| `/sellers` | Seller directory | ⏳ Pending | All sellers |
| `/todays-deals` | Daily deals | ⏳ Pending | Sale products |
| `/gift-cards` | Gift cards | ⏳ Pending | Gift card purchase |
| `/registry` | Gift registry | ⏳ Pending | Registry management |
| `/wishlist` | Public wishlist | ⏳ Pending | Shared wishlists |

### Auth Routes
| Route | Purpose | Status | Notes |
|-------|---------|--------|-------|
| `/auth/login` | Login page | ⏳ Pending | Email/password |
| `/auth/sign-up` | Registration | ⏳ Pending | New user signup |
| `/auth/sign-up-success` | Success page | ⏳ Pending | Post-signup |
| `/auth/error` | Auth errors | ⏳ Pending | Error handling |
| `/auth/callback` | OAuth callback | ⏳ Pending | SSO redirect |

### Account Routes (Protected)
| Route | Purpose | Status | Notes |
|-------|---------|--------|-------|
| `/account` | Account dashboard | ⏳ Pending | User overview |
| `/account/orders` | Order history | ⏳ Pending | Past orders |
| `/account/addresses` | Saved addresses | ⏳ Pending | CRUD addresses |
| `/account/payments` | Payment methods | ⏳ Pending | Cards, billing |
| `/account/wishlist` | Personal wishlist | ⏳ Pending | Saved items |
| `/account/messages` | Messaging center | ⏳ Pending | Buyer-seller chat |
| `/account/security` | Security settings | ⏳ Pending | Password, 2FA |
| `/account/selling` | Seller dashboard | ⏳ Pending | Listings, sales |
| `/account/plans` | Subscription plans | ⏳ Pending | Seller tiers |

### Seller Routes
| Route | Purpose | Status | Notes |
|-------|---------|--------|-------|
| `/sell` | Sell landing page | ⏳ Pending | Become seller CTA |
| `/seller/dashboard` | Seller dashboard | ⏳ Pending | Analytics, listings |

### Static Pages
| Route | Purpose | Status | Notes |
|-------|---------|--------|-------|
| `/about` | About page | ⏳ Pending | Company info |
| `/contact` | Contact form | ⏳ Pending | Support contact |
| `/terms` | Terms of service | ⏳ Pending | Legal |
| `/privacy` | Privacy policy | ⏳ Pending | Legal |
| `/returns` | Return policy | ⏳ Pending | Returns info |
| `/customer-service` | Help center | ⏳ Pending | FAQ, support |

---

## 2. Component Audit Checklist

### Navigation Components
- [ ] **Site Header** (`site-header.tsx`)
  - Logo clickable → homepage
  - Search bar functional
  - Cart icon with badge
  - User dropdown (logged in/out states)
  - Language switcher
- [ ] **Mega Menu** (`mega-menu.tsx`)
  - Hover/click opens menu
  - Categories load correctly
  - Links navigate properly
- [ ] **Mobile Menu** (`mobile-menu-sheet.tsx`)
  - Hamburger opens sheet
  - All links work
  - Proper close behavior
- [ ] **Mobile Tab Bar** (`mobile-tab-bar.tsx`)
  - All 5 tabs functional
  - Active state highlight
  - Cart badge updates
- [ ] **Breadcrumb** (`app-breadcrumb.tsx`)
  - Correct hierarchy
  - All links functional

### Product Components
- [ ] **Product Card** (`product-card.tsx`)
  - Image loads
  - Title truncation
  - Price displays correctly
  - Rating stars
  - Click navigates to product
- [ ] **Product Price** (`product-price.tsx`)
  - Currency formatting
  - Sale price display
  - Discount percentage
- [ ] **Add to Cart** (`add-to-cart.tsx`)
  - Quantity selector
  - Add button works
  - Toast notification
- [ ] **Product Variant Selector** (`product-variant-selector.tsx`)
  - Size selection
  - Color selection
  - Price updates

### Cart & Checkout
- [ ] **Cart Dropdown** (`mobile-cart-dropdown.tsx`)
  - Items display
  - Quantity update
  - Remove items
  - Total calculation
- [ ] **Sticky Add to Cart** (`sticky-add-to-cart.tsx`)
  - Appears on scroll (mobile)
  - Functional buttons
- [ ] **Sticky Checkout Button** (`sticky-checkout-button.tsx`)
  - Visible on cart page
  - Navigate to checkout

### User Components
- [ ] **Contact Seller Button** (`contact-seller-button.tsx`)
  - Visible on product pages
  - Creates conversation
  - Redirects to messages
- [ ] **Conversation List** (`conversation-list.tsx`)
  - Shows all conversations
  - Unread count
  - Click to open
- [ ] **Chat Interface** (`chat-interface.tsx`)
  - Send messages
  - Receive messages
  - Real-time updates

### Search & Filters
- [ ] **Desktop Search** (`desktop-search.tsx`)
  - Search input
  - Suggestions dropdown
  - Submit works
- [ ] **Mobile Search Overlay** (`mobile-search-overlay.tsx`)
  - Opens correctly
  - Search functional
- [ ] **Desktop Filters** (`desktop-filters.tsx`)
  - Category filter
  - Price range
  - Rating filter
- [ ] **Mobile Filters** (`mobile-filters.tsx`)
  - Sheet opens
  - All filters work
- [ ] **Sort Select** (`sort-select.tsx`)
  - All options work
  - URL updates

### UI Components (shadcn)
- [ ] Button variants (default, outline, ghost, destructive)
- [ ] Cards (product, promo, seller)
- [ ] Dialogs/Modals
- [ ] Dropdowns
- [ ] Forms & validation
- [ ] Toasts/Notifications
- [ ] Tabs
- [ ] Accordions
- [ ] Tooltips

---

## 3. User Flow Test Scenarios

### Flow 1: Guest Browse & Search
1. Visit homepage
2. Use mega menu to browse categories
3. Search for a product
4. Apply filters
5. View product details
6. Add to cart (should prompt login)

### Flow 2: User Registration & Login
1. Navigate to sign-up
2. Complete registration form
3. Verify redirect/success page
4. Login with credentials
5. Verify session state

### Flow 3: Complete Purchase
1. Login as buyer
2. Browse/search products
3. Add multiple items to cart
4. Review cart
5. Proceed to checkout
6. Enter shipping address
7. Complete payment
8. Order confirmation

### Flow 4: Seller Product Listing
1. Login as seller
2. Navigate to /sell
3. Create new product listing
4. Upload images
5. Set price, description, category
6. Publish listing
7. Verify product appears in search

### Flow 5: Buyer-Seller Messaging
1. Login as buyer
2. Find product by seller (radevalentin@gmail.com)
3. Click "Contact Seller" button
4. Send message
5. Verify conversation created
6. Check message appears in /account/messages

### Flow 6: Mobile Experience
1. Resize to mobile viewport (375px)
2. Test mobile menu navigation
3. Test mobile tab bar
4. Test mobile search
5. Test mobile product view
6. Test mobile cart
7. Test mobile checkout

---

## 4. Accessibility & Performance Checks

### Accessibility
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] ARIA labels
- [ ] Color contrast
- [ ] Screen reader compatibility
- [ ] Alt text on images

### Performance
- [ ] Page load times
- [ ] Image optimization
- [ ] Lazy loading
- [ ] No layout shift
- [ ] Smooth animations

---

## 5. Issue Categories

### Critical (P0) - Blocking
- Routes returning 404/500
- Buttons not clickable
- Forms not submitting
- Auth not working

### High (P1) - Major UX Impact
- Missing "Contact Seller" buttons
- Cart not updating
- Search not returning results
- Mobile layout broken

### Medium (P2) - Minor UX Impact
- Styling inconsistencies
- Missing hover states
- Translation issues
- Slow loading components

### Low (P3) - Polish
- Minor spacing issues
- Animation tweaks
- Color inconsistencies

---

## 6. Test Account Information

**Test Buyer Account:**
- Email: (to be provided)
- Password: (to be provided)

**Test Seller Account (radevalentin@gmail.com):**
- Has existing product listings
- Used for messaging tests

---

## 7. Audit Progress Tracking

| Section | Started | Completed | Issues Found |
|---------|---------|-----------|--------------|
| Homepage | ⏳ | ❌ | 0 |
| Navigation | ⏳ | ❌ | 0 |
| Auth Flow | ⏳ | ❌ | 0 |
| Product Pages | ⏳ | ❌ | 0 |
| Cart/Checkout | ⏳ | ❌ | 0 |
| Account Pages | ⏳ | ❌ | 0 |
| Messaging | ⏳ | ❌ | 0 |
| Seller Flow | ⏳ | ❌ | 0 |
| Mobile UX | ⏳ | ❌ | 0 |

---

## 8. Findings & Resolutions

### Issues Found
(Will be populated during audit)

| ID | Type | Route/Component | Description | Severity | Status |
|----|------|-----------------|-------------|----------|--------|
| 1 | | | | | ⏳ |

### Fixes Applied
(Will be populated as issues are resolved)

| Issue ID | Fix Description | Files Changed |
|----------|-----------------|---------------|
| | | |

---

## 9. Audit Commands & Setup

```bash
# Start dev server
pnpm dev

# Playwright MCP will be used via:
# - mcp_playwright_browser_navigate
# - mcp_playwright_browser_click
# - mcp_playwright_browser_type
# - mcp_playwright_browser_screenshot
# - mcp_playwright_browser_console_messages
```

---

*Audit created: December 1, 2025*
*Last updated: December 1, 2025*
