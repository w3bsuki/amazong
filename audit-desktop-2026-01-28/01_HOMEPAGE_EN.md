# Homepage (EN) Audit - http://localhost:3000/en

**Date:** January 28, 2026  
**Viewport:** 1920x1080  
**Screenshot:** See audit-desktop-2026-01-28/screenshots/homepage_en_1920.png

## Page Overview

- **Title:** Home | Treido
- **Language:** en
- **URL:** /en

## Header Components

### Skip Links ✅
- "Skip to main content" → #main-content
- "Skip to sidebar" → #shell-sidebar
- "Skip to products" → #product-grid
- "Skip to footer" → #footerHeader

### Navigation Bar ✅
| Element | Status | Notes |
|---------|--------|-------|
| Menu Button | ✅ | Hamburger icon with "Menu" label |
| Logo (treido.) | ✅ | Links to /en |
| Search Button | ✅ | Shows placeholder "Search..." |
| Wishlist Button | ✅ | Heart icon |
| Cart Link | ✅ | Links to /en/cart, bag icon |

### Category Pills ✅
All categories present and interactive:
- All (pressed/active) ✅
- Fashion ✅
- Tech ✅
- Home ✅
- Beauty ✅
- Health ✅
- Sports ✅
- Kids ✅
- Gaming ✅
- Auto ✅
- Pets ✅
- Real Estate ✅
- Software ✅
- Grocery & Food ✅
- Wholesale ✅
- Hobbies ✅
- Jewelry ✅
- Bulgarian Traditional ✅
- E-Mobility ✅
- Services ✅
- Books ✅
- Media ✅
- Jobs ✅
- Collect ✅
- Tools & Industrial ✅

## Main Content Sections

### 1. Promoted Listings Section ✅
- **Header:** "Promoted Listings" with flame icon
- **See All Link:** Links to /en/todays-deals
- **Products:** 8 promotional cards with discounts
- **Card Features:**
  - Promo badge ✅
  - Discount percentage ✅
  - Add to wishlist button ✅
  - Product image ✅
  - Sale price ✅
  - Original price (strikethrough) ✅
  - Product name ✅
  - Rating with star icon ✅
  - Review count ✅

### 2. Today's Offers Section ✅
- **Header:** "Today's Offers" with special icon
- **Products:** 8 deal cards
- Mix of courses, books, software, and products

### 3. Trending in Fashion Section ✅
- **Header:** "Trending in Fashion"
- **See All Link:** Links to /en/categories/fashion
- **Products:** 8 fashion items

### 4. Electronics Section ✅
- **Header:** "Electronics"
- **See All Link:** Links to /en/categories/electronics
- **Products:** 8 electronics items

### 5. Automotive Deals Section ✅
- **Header:** "Automotive Deals"
- **See All Link:** Links to /en/categories/automotive
- **Products:** 8 automotive items

### 6. Product Listing Grid ✅
- **Sort/Filter Bar:**
  - Sort and filter button ✅
  - Newest (dropdown) ✅
  - Offers ✅
  - Nearby ✅
  - Sale ✅
  - Top Rated ✅
  - Free Ship ✅
- **Listing Count:** "12 listings"
- **Product Cards:** Grid layout with product cards

### 7. Trust Badges ✅
- Protected (shield icon)
- Fast Ship (delivery icon)
- Best Prices (tag icon)

### 8. Sell CTA Banner ✅
- Text: "Have something to sell?"
- Subtext: "Free to list • Reach thousands"
- Links to: /en/sell

## Footer Components ✅

### Footer Sections
| Section | Status | Expanded |
|---------|--------|----------|
| Company | ✅ | Collapsed |
| Help | ✅ | Expanded |
| Sell & Business | ✅ | Collapsed |
| Services | ✅ | Collapsed |

### Help Links (Expanded)
- Treido Help → /en/customer-service
- Returns → /en/returns
- Track Orders → /en/account/orders
- Contact Us → /en/contact
- Security → /en/security
- Feedback → /en/feedback

### Legal Links
- Terms of Service → /en/terms
- Privacy Policy → /en/privacy
- Cookie Preferences → /en/cookies
- Online Dispute Resolution → external EU link

### Company Info
- Treido Ltd. • Sofia, Bulgaria
- Company Reg: BG123456789
- VAT: BG123456789
- TM & © 2026 Treido, Inc. or its affiliates

## Accessibility Analysis

| Criteria | Status | Notes |
|----------|--------|-------|
| H1 presence | ✅ | Proper heading hierarchy |
| Skip links | ✅ | All skip links present |
| Button labels | ✅ | Buttons have accessible names |
| Image alt text | ✅ | Product images have alt text |
| Keyboard navigation | ⚠️ | Needs testing |
| Focus indicators | ⚠️ | Needs testing |
| ARIA landmarks | ✅ | banner, main, contentinfo present |

## Console Errors

1. ⚠️ Hydration mismatch warning:
   - "A tree hydrated but some attributes of the..."
   - Appears twice

## Buttons Inventory

| Button | Type | State | Location |
|--------|------|-------|----------|
| Menu | Icon | Normal | Header |
| Search... | Text | Normal | Header |
| Wishlist | Icon | Normal | Header |
| All (category) | Pill | Pressed | Category nav |
| Fashion | Pill | Normal | Category nav |
| Tech | Pill | Normal | Category nav |
| ... | ... | ... | ... |
| Add to wishlist | Icon | Normal | Product cards (multiple) |
| Sort and filter | Icon | Normal | Filter bar |
| Newest | Dropdown | Normal | Filter bar |
| Offers | Filter | Normal | Filter bar |
| Nearby | Filter | Normal | Filter bar |
| Sale | Filter | Normal | Filter bar |
| Top Rated | Filter | Normal | Filter bar |
| Free Ship | Filter | Normal | Filter bar |
| Company | Accordion | Collapsed | Footer |
| Help | Accordion | Expanded | Footer |
| Sell & Business | Accordion | Collapsed | Footer |
| Services | Accordion | Collapsed | Footer |

## Links Inventory (Sample)

Total visible links: ~100+

### Header Links
- Logo → /en
- Cart → /en/cart

### Product Links
- Sample: /en/tech_haven/sk-ii-facial-treatment-essence
- Sample: /en/shop4e/aysifon-17-f6d41cb1
- Sample: /en/categories/fashion

### Footer Links
- /en/customer-service
- /en/returns
- /en/account/orders
- /en/contact
- /en/security
- /en/feedback
- /en/terms
- /en/privacy
- /en/cookies
- /en/sell

## Issues Found

### Critical
- None

### Warning
- Hydration mismatch errors in console (React)

### Minor
- None detected

## Recommendations

1. Investigate and fix hydration mismatch warnings
2. Consider lazy loading for images below the fold
3. Verify all wishlist buttons have proper aria-label
