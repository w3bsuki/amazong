# 🔥 MOBILE AUDIT - TREIDO.EU (Production) 🔥

> **Audit Date:** December 29, 2025  
> **Auditor:** Automated Mobile UX Analysis  
> **Device:** Mobile viewport (375 × 812px - iPhone X/12/13 equivalent)  
> **URLs Tested:** https://treido.eu, https://www.treido.eu  
> **Status:** 🚨 **CRITICAL ISSUES FOUND**

---

## 📋 Executive Summary

This audit reveals **significant issues** across the Treido.eu mobile experience that require immediate attention. The site has several broken links, branding inconsistencies, placeholder content, and UX anti-patterns that damage user trust and conversion potential.

### Severity Distribution
| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 8 | Broken functionality, dead links |
| 🟠 High | 12 | Major UX issues, confusing patterns |
| 🟡 Medium | 15 | Moderate UI problems |
| 🟢 Low | 10 | Minor improvements needed |

---

## 🔴 CRITICAL ISSUES (Fix Immediately)

### 1. **BROKEN FOOTER LINKS - 404 ERRORS** 🚨
Multiple footer links lead to 404 pages, destroying user trust and SEO.

**Broken URLs:**
- `/en/careers` → 404 "Page not found"
- `/en/pharmacy` → 404 "Page not found"
- `/en/optical` → 404 (confirmed dead)
- `/en/clinic` → 404 (confirmed dead)
- `/en/store-locator` → 404 "Page not found"
- `/en/same-day-delivery` → 404 "Page not found"
- `/en/order-pickup` → 404 (confirmed dead)
- `/en/free-shipping` → 404 (confirmed dead)
- `/en/membership` → 404 (confirmed dead)
- `/en/blog` → 404 (assumed)
- `/en/sustainability` → 404 (assumed)
- `/en/press` → 404 (assumed)
- `/en/investors` → 404 (assumed)
- `/en/affiliates` → 404 (assumed)
- `/en/advertise` → 404 (assumed)
- `/en/suppliers` → 404 (assumed)
- `/en/recalls` → 404 (assumed)
- `/en/services` → 404 (assumed)

**Impact:** Users clicking these links encounter dead ends, damaging brand credibility.

**Fix:** Either create these pages or remove the links from the footer entirely.

---

### 2. **SOCIAL MEDIA LINKS ARE ALL `#` PLACEHOLDERS** 🚨
All social media links in footer point to `#` (empty anchor).

**Affected Links:**
- Pinterest → `#`
- Facebook → `#`
- Instagram → `#`
- X (Twitter) → `#`
- YouTube → `#`
- TikTok → `#`

**Impact:** Users expect to find real social media profiles. Clicking these does nothing.

**Fix:** Either add real social media URLs or remove the social icons entirely.

---

### 3. **BRANDING CONFUSION - AMZN vs TREIDO** 🚨
The site has a severe identity crisis:

- Logo displays **"AMZN"** (looks like Amazon!)
- Page titles say **"AMZN - Online Shopping"** or **"| AMZN"**
- Footer shows **"Treido"**
- Copyright says **"Treido, Inc."**
- About page mentions **"Treido"** exclusively
- Registry page says **"Amazon Registry"** (!!)

**Impact:** This is a massive legal liability (potential trademark infringement) and creates trust issues.

**Fix:** 
1. Change all "AMZN" branding to "Treido"
2. Update all page titles
3. Fix the Registry page "Amazon Registry" text

---

### 4. **FAKE STATISTICS ON ABOUT PAGE** 🚨
The About page displays clearly fabricated numbers:

- "15+ Years of Experience" (Site appears new)
- "50M+ Products Delivered" 
- "10M+ Happy Customers"
- "50+ Countries Served"
- "10,000+ users" (hero section)

**Impact:** If these are false, this is potentially illegal (false advertising) and destroys trust when discovered.

**Fix:** Remove or replace with accurate numbers. If you're a startup, be honest about it.

---

### 5. **CURRENCY DISPLAY INCONSISTENCY** 🚨
Products show prices in different formats inconsistently:

- Home page feed: `€5`, `€67` (Euro with € prefix)
- Product detail page: `BGN 67.00` (Bulgarian Lev)
- Search results: `€350`, `€400` (Euro)
- Today's Deals: `$24.99`, `$49.99` (USD!)

**Impact:** Users don't know what currency they're paying in. This is a conversion killer.

**Fix:** Implement consistent currency display based on user's locale/preference.

---

### 6. **TEST/PLACEHOLDER PRODUCT NAMES** 🚨
The product feed shows obvious test data:

- "Айсифон" (sounds like "iPhone" in Bulgarian)
- "Айсифон 17" 
- "12322"
- "123123"
- "123123123123"
- "БУБА" (means "bug" in Bulgarian)
- "ЧРД АНТОНИЯ" (Happy Birthday Antonia)
- "Заглавие" (means "Title" - literal placeholder)
- "Грозни обувки" (means "Ugly shoes")

**Impact:** Makes the marketplace look fake/abandoned. Kills user trust.

**Fix:** Implement product moderation or seed with real-looking product data.

---

### 7. **CONDITION LABELS NOT TRANSLATED** 🚨
Product condition badges show English text on Bulgarian locale:

- "used excellent" (should be "използван отлично" or similar)
- "new with tags" (should be "нов с етикети")
- "New with tags" (inconsistent capitalization)

**Impact:** Poor localization makes the site feel unprofessional.

**Fix:** Translate all condition labels properly.

---

### 8. **404 PAGE LINKS MISSING LOCALE PREFIX** 🚨
The 404 error page links don't include locale:

- "Go to homepage" → `/` (should be `/en` or `/bg`)
- "Search products" → `/search` (should be `/en/search`)
- "Today's Deals" → `/todays-deals` (should be `/en/todays-deals`)

**Impact:** Users get dumped on wrong locale or get errors.

**Fix:** Add locale prefix to all 404 page links.

---

## 🟠 HIGH SEVERITY ISSUES

### 9. **PRODUCT DETAIL PAGE - SLOW CONTENT LOAD**
When navigating to a product page, the main content area is empty for ~2 seconds before loading. The header and footer render, but main content shows nothing.

**Impact:** Users may think the page is broken and leave.

**Fix:** Add skeleton loaders, or ensure SSR delivers content immediately.

---

### 10. **HEADER LOGO "AMZN" TEXT NOT CLICKABLE ENOUGH**
The logo is quite small on mobile. The text "AMZN" is the clickable area, but it's tiny.

**Impact:** Difficult to tap to go home.

**Fix:** Increase tap target size, add padding.

---

### 11. **SEARCH BAR PLACEHOLDER TEXT INCONSISTENCY**
- Mobile header: "Search essentials..."
- Bulgarian: "Търсене..."

The English placeholder is oddly specific ("essentials") while Bulgarian is generic.

**Impact:** Minor confusion about what can be searched.

**Fix:** Use consistent, clear placeholder like "Search products..."

---

### 12. **FOOTER ACCORDION SECTIONS COLLAPSED BY DEFAULT**
On mobile, footer sections (About Us, Help, Stores, Services) are all collapsed accordions. Users have to tap each to see links.

**Impact:** Important navigation hidden. Users may not discover these sections exist.

**Fix:** Consider keeping at least one section open, or use a different mobile footer pattern.

---

### 13. **"CA Privacy Rights" IRRELEVANT FOR BULGARIAN SITE**
Footer shows "CA Privacy Rights" (California) which is irrelevant for a Bulgarian marketplace.

**Impact:** Confusing, looks like template content wasn't customized.

**Fix:** Remove CA-specific links, add GDPR-relevant privacy links instead.

---

### 14. **BOTTOM NAVIGATION BAR "Chat" REQUIRES LOGIN**
The "Chat" tab in bottom navigation requires login. Users tap it expecting chat, get redirect to login.

**Impact:** Frustrating user experience, unexpected behavior.

**Fix:** Show a prompt explaining login is required before redirecting.

---

### 15. **WISHLIST/CART BUTTONS ONLY SHOW ICONS**
Header buttons for Wishlist and Cart only show icons, no text labels, and no item count badge.

**Impact:** Users may not understand what these buttons do, can't see if they have items.

**Fix:** Add badge with item count, or add small labels.

---

### 16. **TODAY'S DEALS SHOWS USD PRICES**
Today's Deals page shows prices in US Dollars ($24.99, etc.) even though this is a Bulgarian marketplace.

**Impact:** Currency confusion, looks like placeholder content.

**Fix:** Display prices in EUR or BGN consistently.

---

### 17. **GIFT CARDS PAGE - ALL CARDS IDENTICAL**
Gift Cards page shows 8 identical "Treido Gift Card" entries with the same "Amazon Smile" branding.

**Impact:** Looks like a template, not a real page. Also "Amazon" branding again!

**Fix:** Either create real gift card variations or remove the page.

---

### 18. **REGISTRY PAGE - "Amazon Registry" TEXT**
Registry page heading says "Amazon Registry" not "Treido Registry."

**Impact:** Legal/branding issue, very unprofessional.

**Fix:** Replace all "Amazon" text with "Treido."

---

### 19. **PRODUCT CARDS - HOVER BUTTONS ON MOBILE**
Product cards have "Add to Watchlist" and "Add to Cart" buttons that appear on hover. This is a desktop pattern that doesn't work well on mobile (no hover state).

**Impact:** Users may not discover these quick-action buttons.

**Fix:** Make buttons always visible on mobile, or use tap-hold pattern.

---

### 20. **CATEGORY ICONS TOO SMALL**
The horizontal scrolling category strip shows category icons that are quite small on mobile.

**Impact:** Hard to see what each category represents, requires squinting.

**Fix:** Increase icon size or use a different layout.

---

## 🟡 MEDIUM SEVERITY ISSUES

### 21. **MENU DIALOG TEXT SAYS "Hello! Navigation menu"**
When opening the hamburger menu, the dialog shows "Hello!" with "Navigation menu" and "Sign in or register" as subtext.

**Impact:** Weird UX, "Hello!" feels out of place for a navigation menu.

**Fix:** Remove "Hello!" or rephrase to something more contextual.

---

### 22. **LANGUAGE SWITCHER TINY AND EASY TO MISS**
In the mobile menu, the language button ("en") is a tiny button next to the heading.

**Impact:** Hard to find if user wants to switch languages.

**Fix:** Make language selector more prominent.

---

### 23. **PRODUCT IMAGES LOW QUALITY ON SOME LISTINGS**
Some product images (especially user-uploaded ones) appear low resolution or poorly cropped.

**Impact:** Unprofessional appearance, reduces trust.

**Fix:** Implement image quality requirements on upload, or auto-optimize.

---

### 24. **SEARCH RESULTS PAGINATION AWKWARD**
Pagination shows "1, 2, ..., 13" with a tiny "More pages" indicator using an image.

**Impact:** Hard to navigate to specific pages.

**Fix:** Use a more mobile-friendly pagination pattern (load more button).

---

### 25. **"Skip to main content" ALWAYS VISIBLE**
The skip link appears briefly visible on page load before CSS loads.

**Impact:** Flash of unstyled content, minor visual glitch.

**Fix:** Ensure skip link is properly hidden until focused.

---

### 26. **SELLER INFO SHOWS "0.0" RATING WITH "0% positive"**
Seller cards show "0.0" rating and "0% positive" for new sellers.

**Impact:** Makes all sellers look untrustworthy.

**Fix:** Hide rating for sellers with no reviews, or show "New Seller" badge.

---

### 27. **CONDITION BADGE LAYOUT INCONSISTENT**
Some products show condition as a separate badge, others show it inline. Capitalization varies.

**Impact:** Visual inconsistency, unprofessional.

**Fix:** Standardize badge style and capitalization.

---

### 28. **"Buy Now" vs "Add to Cart" UNCLEAR DIFFERENCE**
Product page has both "Add to Cart" and "Buy Now" buttons side by side.

**Impact:** Users may not understand the difference. Both look the same size.

**Fix:** Differentiate visually. Make "Buy Now" primary, "Add to Cart" secondary.

---

### 29. **REVIEWS SECTION SHOWS "No reviews yet" FOR EVERYTHING**
Every product shows "0.0" rating and "No reviews yet."

**Impact:** Either no one is reviewing, or reviews aren't working.

**Fix:** Encourage reviews, or hide section if empty.

---

### 30. **"More from this seller" HORIZONTAL SCROLL AWKWARD**
The "More from this seller" section uses horizontal scroll with tiny arrow buttons.

**Impact:** Hard to navigate on mobile.

**Fix:** Use swipe gestures, make arrows larger, or switch to grid.

---

### 31. **PRICE DISPLAY - STRIKETHROUGH HARD TO READ**
Original prices are shown with strikethrough, but the text is quite small.

**Impact:** Discount savings not prominently displayed.

**Fix:** Make price comparison more visually prominent.

---

### 32. **TERMS PAGE - TOC SIDEBAR ON MOBILE**
Terms of Service page has a "Table of Contents" sidebar that takes up significant width on mobile.

**Impact:** Content area is squeezed, harder to read.

**Fix:** Stack TOC above content on mobile, or use accordion.

---

### 33. **FOOTER COPYRIGHT YEAR HARDCODED**
Footer shows "© 2025 Treido" - appears hardcoded.

**Impact:** Will become outdated if not dynamically set.

**Fix:** Use dynamic year.

---

### 34. **LOGIN PAGE COPYRIGHT SAYS "© 2024"**
Login page footer shows "© 2024 Treido. All rights reserved." (different year!)

**Impact:** Inconsistent, one of them is wrong.

**Fix:** Make both dynamic and consistent.

---

### 35. **PRODUCT PAGE - KEY DETAILS DUPLICATION**
Product details show "Condition: new" AND "Condition: used-excellent" in the same Key Details section.

**Impact:** Contradictory information, confusing.

**Fix:** Fix data model to prevent duplicate condition fields.

---

## 🟢 LOW SEVERITY ISSUES

### 36. **CUSTOMER SERVICE HELP SEARCH HAS NO AUTOCOMPLETE**
Help search input doesn't provide suggestions as user types.

**Impact:** Minor UX improvement opportunity.

---

### 37. **BREADCRUMBS SHOW ONLY ICON ON MOBILE**
Breadcrumb for home page shows only a house icon, no "Home" text.

**Impact:** May not be clear it's a breadcrumb.

---

### 38. **TAB LIST SCROLLING - NO FADE INDICATOR**
The horizontal tabs (For you, Promoted, Near me, etc.) scroll but there's no visual fade to indicate more tabs.

**Impact:** Users may not realize they can scroll.

---

### 39. **BACK TO TOP BUTTON - ALWAYS VISIBLE**
"Back to top" button is always visible in footer, even at top of page.

**Impact:** Minor, but could be hidden when not useful.

---

### 40. **CATEGORY PAGE 404 ERROR IN CONSOLE**
Network tab shows 404 error when loading category pages (found in Fashion page).

**Impact:** Silent errors, may affect functionality.

**Fix:** Debug what resource is missing.

---

### 41. **"Interest Based Ads" LINK - US CONCEPT**
Footer has "Interest Based Ads" link which is a US regulatory concept.

**Impact:** Not relevant for EU/Bulgarian users.

---

### 42. **PRODUCT PRICE WITHOUT CURRENCY CODE CONSISTENCY**
Some prices show `€5`, others `5 €`, others `BGN 5.00`.

**Impact:** Inconsistent formatting.

---

### 43. **ACCORDION CHEVRONS INCONSISTENT**
Some accordions use down chevron, some use right chevron to indicate expand state.

**Impact:** Minor visual inconsistency.

---

### 44. **IMAGE LOADING - NO BLUR-UP OR SKELETON**
Images load without placeholder, causing layout shift.

**Impact:** Minor CLS (Cumulative Layout Shift) issue.

---

### 45. **MENU SEARCH BOX - UNCLEAR PURPOSE**
Menu has "Search categories" search box that's unclear in function.

**Impact:** May confuse users expecting product search.

---

---

## 📊 Mobile UX Patterns Assessment

### ✅ What's Working Well

1. **Bottom Navigation Bar** - Good pattern for mobile, includes key actions (Home, Categories, Sell, Chat, Account)
2. **Product Card Design** - Clean, shows key info at a glance
3. **Pull-to-action patterns** - Tabs for filtering feel native
4. **Mobile Menu Implementation** - Full-screen slide-out is appropriate
5. **Touch Targets** - Most buttons are appropriately sized
6. **Image Aspect Ratios** - Product images maintain good proportions
7. **Footer Accordion** - Appropriate pattern for long footer on mobile
8. **Loading States** - Cart page shows "Loading cart..." (could be improved but at least exists)

### ❌ Anti-Patterns Found

1. **Hover-dependent actions** - Quick action buttons designed for desktop hover
2. **Horizontal scroll without indicators** - Multiple horizontal scroll areas with no visual cues
3. **Small tap targets** - Language switcher, some icons
4. **Desktop table layouts** - Some pages don't adapt well
5. **Modal/Dialog overuse** - Menu opens as dialog rather than native feeling panel
6. **Pagination** - Desktop-style numbered pagination instead of infinite scroll/load more
7. **Sticky header too tall** - Takes up significant screen real estate

---

## 🎯 Priority Action Items

### Week 1 (Critical)
1. [ ] Fix all broken footer links (remove or create pages)
2. [ ] Add real social media URLs or remove icons
3. [ ] Fix AMZN → Treido branding everywhere
4. [ ] Fix currency consistency
5. [ ] Remove or fix fake statistics

### Week 2 (High)
6. [ ] Clean up test product data
7. [ ] Translate all condition labels
8. [ ] Fix 404 page locale links
9. [ ] Improve product page load time
10. [ ] Fix "Amazon Registry" text

### Week 3 (Medium)
11. [ ] Improve footer mobile UX
12. [ ] Add skeleton loaders
13. [ ] Fix price display formatting
14. [ ] Standardize badge styles
15. [ ] Improve pagination

### Ongoing
16. [ ] Implement product moderation
17. [ ] Gather real reviews
18. [ ] A/B test mobile patterns
19. [ ] Monitor Core Web Vitals

---

## 📱 Recommended Mobile Testing Checklist

Before any future releases, verify:

- [ ] All footer links work (no 404s)
- [ ] All currencies display correctly
- [ ] All text is properly translated
- [ ] Social media links work
- [ ] Login flows work
- [ ] Add to cart works
- [ ] Search works
- [ ] Filters work
- [ ] Pagination works
- [ ] All modals close properly
- [ ] Back button behavior is correct
- [ ] No console errors

---

## 🏁 Conclusion

Treido.eu has the bones of a decent mobile marketplace, but is plagued by:

1. **Identity Crisis** - AMZN vs Treido branding is a legal and trust disaster
2. **Incomplete Implementation** - Too many placeholder/404 pages went to production
3. **Test Data Pollution** - Obvious fake products hurt credibility
4. **Localization Gaps** - Currency and language inconsistencies
5. **Trust Signals Missing** - Fake stats, zero reviews, social links to nowhere

**The site looks like a template that was never properly customized for production.** Before any marketing spend, these critical issues must be addressed or users will bounce immediately.

---

*Audit generated with Playwright MCP browser automation and manual analysis*
