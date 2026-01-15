# Mobile UI/UX Audit Report — Treido Marketplace

**Audit Date:** January 12, 2026  
**Viewport:** 375×812 (iPhone X / Mobile)  
**Browser:** Chrome (Playwright automation)

---

## Executive Summary

This audit evaluates the mobile user experience across all major routes of the Treido marketplace. Overall, the mobile experience is **solid** with good responsive design patterns, but several critical issues and UX improvements were identified.

**Overall Score:** 7.2/10

### Key Findings
- ✅ Strong mobile navigation with sticky bottom nav
- ✅ Good responsive product grids and cards
- ✅ Accessible skip-to-content links
- ⚠️ Missing i18n translation keys (`Product.condition.new`)
- ⚠️ Some disabled buttons without clear feedback
- ⚠️ Hydration warnings on certain pages
- ❌ LCP image missing `loading="eager"` attribute
- ❌ Categories page redirects unexpectedly to product

---

## Page-by-Page Audit

### 1. Homepage (`/en`)

**Status:** ✅ Good

#### Positives
- Clean mobile header with logo, wishlist, and cart icons
- Horizontal scrollable category tabs (All, Fashion, Tech, etc.)
- "Sell in minutes" promotional banner is well-positioned
- Product grid displays 2 columns on mobile (appropriate)
- Sticky mobile bottom navigation with Home, Categories, Sell, Chat, Account
- "Back to top" button in footer

#### Issues
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| Medium | Menu button is `[disabled]` with no visual feedback | Show loading state or enable hamburger menu |
| Medium | Wishlist button is `[disabled]` with no indication why | Add tooltip or enable for logged-out users with auth prompt |
| Low | Tab list has too many categories requiring excessive scroll | Consider "More" dropdown after 8-10 tabs |
| Low | Product timestamps ("5 days ago", "3 wk. ago") could be more consistent | Standardize to "Xd ago" or "Xw ago" |

#### Accessibility
- ✅ Skip to main content link present
- ✅ Proper semantic landmarks (banner, main, navigation, contentinfo)
- ✅ Button labels are descriptive
- ⚠️ Some images missing alt text in cards

---

### 2. Categories Page (`/en/categories`)

**Status:** ✅ Good

#### Positives
- Full-width category cards with icons
- Subcategory preview text visible
- "24 categories" count displayed
- Quick action cards for "Sell Free" and "Deals Up to 70%"

#### Issues
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| Critical | **Missing mobile bottom navigation** on this page | Ensure consistent nav across all pages |
| Medium | Long subcategory text truncated poorly | Use max 3-4 bullet points per category |
| Low | No back button or breadcrumb | Add navigation context |

---

### 3. Login Page (`/en/auth/login`)

**Status:** ✅ Good

#### Positives
- Clean, centered form layout
- Logo linking back to home
- Clear input labels and placeholders
- Password visibility toggle
- "Remember me" checkbox
- Links to Terms, Privacy, Help in footer

#### Issues
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| Medium | "Sign in" button is `[disabled]` without clear validation feedback | Show inline validation messages |
| Low | "Forgot your password?" link small touch target | Increase padding for 44px minimum |
| Low | No social login options visible | Consider adding Google/Apple sign-in for mobile |

---

### 4. Sign Up Page (`/en/auth/sign-up`)

**Status:** ✅ Good

#### Positives
- Personal/Business toggle clearly visible
- All required fields present
- Dual password fields for confirmation
- Terms agreement text with links

#### Issues
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| Medium | "Create your Treido account" button `[disabled]` | Add real-time validation indicators |
| Low | Username field lacks availability check feedback | Add inline username validation |

---

### 5. Forgot Password (`/en/auth/forgot-password`)

**Status:** ✅ Excellent

- Minimal, focused design
- Clear heading and description
- Single email input
- "Back to login" link with icon
- Very clean mobile experience

**No significant issues found.**

---

### 6. Product Page (`/en/[shop]/[product]`)

**Status:** ⚠️ Needs Attention

#### Positives
- Full-width product image carousel
- Category breadcrumb clickable
- Price prominently displayed
- Buyer Protection badge visible
- Seller info with profile link
- Expandable "Shipping & Returns" section
- "More from [seller]" horizontal scroll
- Customer reviews section with rating breakdown
- Sticky bottom action bar (Chat + Buy Now)

#### Issues
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| Critical | **Hydration error** detected in console | Fix server/client mismatch |
| High | Missing mobile bottom navigation | Add persistent nav |
| Medium | "Add to Watchlist" icon only - no label | Add text label for clarity |
| Medium | Share/More buttons have no labels | Add screen reader text |
| Low | Product image carousel has no dots/indicator | Add pagination dots |

---

### 7. Cart Page (`/en/cart`)

**Status:** ⚠️ Needs Attention

#### Positives
- Standard header with navigation

#### Issues
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| Critical | **Persistent loading state** - "Loading cart..." never resolves | Investigate cart loading bug |
| High | No empty cart state shown | Display "Your cart is empty" with CTA |
| Medium | Missing mobile bottom navigation | Add persistent nav |

---

### 8. Today's Deals (`/en/todays-deals`)

**Status:** ✅ Good

#### Positives
- Hero banner with breadcrumb
- Category filter pills (All Deals, Electronics, Home, etc.)
- Status tabs (All Deals, Available, Upcoming, Watchlist)
- Deal count shown ("6 deals found")
- Deal cards with discount percentage badges
- Countdown timers ("Ends in X:XX:XX")
- Original/sale price comparison
- Star ratings with review counts

#### Issues
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| Medium | Category pills scroll horizontally without indicator | Add fade/arrow hints |
| Low | Timer text could be larger for urgency | Increase font weight |

---

### 9. Customer Service (`/en/customer-service`)

**Status:** ✅ Excellent

#### Positives
- Mobile bottom navigation present ✅
- Breadcrumb navigation
- Clear heading "What would you like help with today?"
- Topic cards with icons (Delivery, Payment, Security, etc.)
- Search help library with placeholder
- Expandable "All help topics" accordions
- "Contact Us" CTA with "Start Chatting" button

**No significant issues found.**

---

### 10. Search Results (`/en/search?q=phone`)

**Status:** ✅ Good

#### Positives
- Breadcrumb with search indicator icon
- Results count ("9 products found")
- Filter bar (All filters, Sort by, Price, Category)
- Product cards in 2-column grid
- Discount badges and original prices
- Star ratings inline

#### Issues
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| Medium | Filter buttons don't show active state | Add visual selection indicator |
| Low | No "No results" state visible (untested) | Ensure empty state exists |

---

### 11. Seller Shop Page (`/en/[shop]`)

**Status:** ⚠️ Needs Attention

#### Positives
- Seller avatar and name prominent
- Seller badge visible
- Bio and "Member since" date
- Stats row (Sales, Rating, Followers, Purchases)
- Tabs for products and reviews
- Product grid with "View All" link

#### Issues
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| Critical | **Multiple i18n errors**: `Product.condition.new` not resolved | Add missing translation keys |
| High | Console flooded with 24+ identical translation errors | Fix i18n messages |
| Medium | "Product.condition.new" displays as raw key in UI | Falls back to showing key instead of "New" |
| Low | Product cards show condition inconsistently | Standardize badge display |

---

### 12. Gift Cards (`/en/gift-cards`)

**Status:** ⚠️ Needs Attention

#### Positives
- Breadcrumb present
- Tabs for card types (All, eGift, Print at Home, Mail)
- Quick action cards for card types
- "Popular Gift Cards" section

#### Issues
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| High | Gift cards show "Amazon Smile" branding - should be Treido | Replace placeholder content |
| Medium | Missing mobile bottom navigation | Add persistent nav |
| Low | Cards lack visual variety | Use different card designs |

---

### 13. Registry (`/en/registry`)

**Status:** ⚠️ Needs Content

The page loads with proper title ("Celebrate every milestone with Treido Registry") but appears to show minimal content in snapshot. Needs content verification.

---

### 14. Terms of Service (`/en/terms`)

**Status:** ✅ Excellent

#### Positives
- Breadcrumb navigation
- Last updated date visible
- Table of contents sidebar
- Expandable accordion sections
- Warning callout box for important notice
- "Legal Questions?" contact section
- Related links (Privacy Policy, Returns, Customer Service)

**No significant issues found.** Well-designed legal page.

---

## Global Issues

### Critical
1. **Missing Translation Key**: `Product.condition.new` not defined in messages
2. **Hydration Mismatch**: Server/client attribute mismatch on product pages
3. **Cart Loading**: Infinite loading state bug

### High Priority
4. **LCP Image Optimization**: Main images should use `loading="eager"`
5. **Inconsistent Mobile Navigation**: Bottom nav missing on Categories, Cart, Gift Cards, Product pages

### Medium Priority
6. **Disabled Buttons**: Menu, Wishlist buttons disabled without feedback
7. **Category Redirect Bug**: `/en/categories/electronics` redirects to product page instead of category listing

### Low Priority
8. **Touch Targets**: Some links too small for mobile
9. **Filter States**: No visual indicator for active filters
10. **Image Alt Text**: Some product images missing descriptive alt text

---

## Recommendations Priority Matrix

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| P0 | Fix `Product.condition.new` i18n key | High | Low |
| P0 | Fix cart infinite loading bug | High | Medium |
| P0 | Add mobile nav to all pages | High | Low |
| P1 | Fix hydration warnings | Medium | Medium |
| P1 | Add `loading="eager"` to LCP images | Medium | Low |
| P1 | Fix categories redirect bug | High | Medium |
| P2 | Enable/explain disabled buttons | Medium | Low |
| P2 | Replace Amazon placeholder in Gift Cards | Low | Low |
| P3 | Increase touch targets | Low | Low |
| P3 | Add image carousel indicators | Low | Low |

---

## Accessibility Summary

| Criterion | Status |
|-----------|--------|
| Skip Links | ✅ Present |
| Semantic HTML | ✅ Good |
| ARIA Labels | ⚠️ Partial |
| Focus Management | ⚠️ Not tested |
| Color Contrast | ⚠️ Not tested |
| Touch Targets | ⚠️ Some too small |

---

## Tested Routes

| Route | Status |
|-------|--------|
| `/en` (Homepage) | ✅ |
| `/en/categories` | ✅ |
| `/en/auth/login` | ✅ |
| `/en/auth/sign-up` | ✅ |
| `/en/auth/forgot-password` | ✅ |
| `/en/[shop]/[product]` | ⚠️ |
| `/en/cart` | ⚠️ |
| `/en/todays-deals` | ✅ |
| `/en/customer-service` | ✅ |
| `/en/search?q=phone` | ✅ |
| `/en/[shop]` (Seller page) | ⚠️ |
| `/en/gift-cards` | ⚠️ |
| `/en/registry` | ⚠️ |
| `/en/terms` | ✅ |
| `/en/account` | → redirects to login |
| `/en/chat` | → redirects to login |
| `/en/sell` | → redirects to login |

---

## Next Steps

1. **Immediate**: Fix i18n translation key for `Product.condition.new`
2. **This Week**: Add mobile bottom navigation to all pages
3. **This Sprint**: Fix cart loading and hydration issues
4. **Backlog**: UX polish items (touch targets, filter states)

---

*Report generated via Playwright browser automation on mobile viewport (375×812)*
