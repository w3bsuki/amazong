# 🔥 TREIDO.EU Desktop Audit - BRUTAL HONEST ROAST

**Audit Date:** December 29, 2025  
**URL Tested:** https://www.treido.eu / https://treido.eu  
**Testing Method:** Playwright MCP Browser Automation  
**Verdict:** ⚠️ **PRODUCTION-UNREADY** - Major issues found

---

## 🚨 CRITICAL ISSUES (Must Fix Immediately)

### 1. **BRANDING IDENTITY CRISIS** 
- **Page Title shows "AMZN"** not "Treido" — you literally named yourself after Amazon's stock ticker
- Header logo says **"AMZN"** — this is copyright/trademark infringement waiting to happen
- Footer says "Treido" but header says "AMZN" — **inconsistent brand identity**
- Tab title shows `| AMZN` suffix on every page
- **Fix:** Pick ONE name and use it consistently everywhere

### 2. **BROKEN FOOTER LINKS - ALL SOCIAL MEDIA DEAD**
Every single social media link in the footer points to `#`:
- Pinterest → `#` ❌
- Facebook → `#` ❌  
- Instagram → `#` ❌
- X (Twitter) → `#` ❌
- YouTube → `#` ❌
- TikTok → `#` ❌

**This is embarrassing.** Either remove them or add real links.

### 3. **MASSIVE 404 PAGE EPIDEMIC**
The following footer links lead to **404 pages**:

| Link | Status |
|------|--------|
| `/bg/careers` | 404 ❌ |
| `/bg/blog` | 404 ❌ |
| `/bg/sustainability` | 404 ❌ |
| `/bg/press` | 404 ❌ |
| `/bg/investors` | 404 ❌ |
| `/bg/affiliates` | 404 ❌ |
| `/bg/advertise` | 404 ❌ |
| `/bg/suppliers` | 404 ❌ |
| `/bg/recalls` | 404 ❌ |
| `/bg/feedback` | 404 ❌ |
| `/bg/accessibility` | 404 ❌ |
| `/bg/security` | 404 ❌ |
| `/bg/store-locator` | 404 ❌ |
| `/bg/pharmacy` | 404 ❌ |
| `/bg/optical` | 404 ❌ |
| `/bg/clinic` | 404 ❌ |
| `/bg/services` | 404 ❌ |
| `/bg/membership` | 404 ❌ |
| `/bg/same-day-delivery` | 404 ❌ |
| `/bg/order-pickup` | 404 ❌ |
| `/bg/free-shipping` | 404 ❌ |
| `/bg/cookies` | 404 ❌ |
| `/bg/privacy-choices` | 404 ❌ |
| `/bg/interest-based-ads` | 404 ❌ |
| `/bg/help` (from login page) | 404 ❌ |

**That's 24+ broken links in the footer alone!** This destroys user trust.

### 4. **404 PAGE NOT LOCALIZED**
The 404 error page shows:
- "Page not found" (English)
- "The page you're looking for doesn't exist or has been moved." (English)
- "Go to homepage" (English)
- "Search products" (English)

**But the site is in Bulgarian!** This is jarring UX.

---

## 🔴 MAJOR UI/UX ISSUES

### 5. **EMPTY/LOADING CONTENT ON FIRST RENDER**
Multiple pages show empty `<main>` content for 1-2 seconds before loading:
- `/bg/cart` - Shows "Зареждане на количката..." forever initially
- `/bg/tech_haven/playstation-5-console` - Empty main area on first load
- `/bg/returns` - Empty main area
- `/bg/terms` - Takes 2+ seconds to render content

**Users will think the site is broken.**

### 6. **NAVIGATION BAR INCONSISTENCY**
- The navigation shows both header nav AND secondary nav
- "Меню" button opens a modal but navigation links are already visible
- Redundant navigation creates confusion

### 7. **BREADCRUMB INCONSISTENCY**
- Some pages show "Amazong" (wrong spelling of Amazon)
- Some pages show proper breadcrumb structure
- `/bg/search` breadcrumb shows "Amazong" instead of "Treido" or "Начало"

### 8. **MIXED CURRENCY DISPLAY**
- Homepage promo banners show `$200`, `$50%` discounts (USD)
- Product prices show `€` (Euro) 
- Some product pages show `лв.` (Bulgarian Lev)
- **Pick ONE currency for the Bulgarian market (should be BGN/лв.)**

### 9. **MIXED LANGUAGE CONTENT**
- English product titles: "PlayStation 5 Console", "MacBook Pro 16" M3 Max"
- Bulgarian UI: "Добави в количката", "Филтри"
- Product conditions in English: "used excellent", "new with tags"
- Registry page is 100% English despite Bulgarian locale
- **Localize ALL content or use English throughout**

### 10. **FAKE/MOCK DATA VISIBLE**
Homepage listings include obvious test data:
- Product named "12322"
- Product named "123123123123"  
- Product named "Заглавие" (literally "Title")
- Product named "Айсифон" (phonetic iPhone)
- All from seller "shop4e"

**This screams "not a real marketplace"**

---

## 🟠 MODERATE ISSUES

### 11. **TODAY'S DEALS - STATIC MOCK DATA**
The "Today's Deals" page shows:
- Amazon branded products (Fire TV Stick, Echo Dot)
- Prices in `$` (USD) - wrong currency for Bulgaria
- Static countdown timers that don't sync
- Same generic deals every time

### 12. **REGISTRY PAGE NOT LOCALIZED**
`/bg/registry` shows:
- "Celebrate every milestone with Amazon Registry" (English)
- "Whatever you're celebrating, we've got you covered" (English)
- "Wedding Registry", "Baby Registry", "Birthday Gift List" (English)
- "Earth's Biggest Selection" (English)
- Buttons: "Create a Registry", "Find a Registry" (English)

**This page wasn't translated AT ALL**

### 13. **GIFT CARDS PAGE IS A SKELETON**
`/bg/gift-cards` shows:
- 8 identical "Подаръчна карта Treido" cards
- No real gift card images
- No price selection
- No purchase functionality visible

### 14. **SELLER RATINGS ARE SUSPICIOUS**
Product pages show:
- `tech_haven` seller with "0.0" rating and "0% положителни"
- Yet products have thousands of reviews (15,600 reviews!)
- This inconsistency destroys trust

### 15. **PRODUCT PAGE REVIEWS DON'T MATCH**
PlayStation 5 Console shows:
- "4.9" rating with "15600 total" reviews
- But breakdown shows: 5★: 0, 4★: 0, 3★: 0, 2★: 0, 1★: 0
- "No reviews yet." message at bottom

**The numbers don't add up!**

### 16. **SLOW LOADING STATES**
- Cart page: Shows loading spinner, then "Зареждане на количката..."
- Product pages: Blank main area before content loads
- No skeleton loaders or proper loading states

### 17. **LOGIN BUTTON DISABLED BY DEFAULT**
On `/bg/auth/login`:
- "Влез" button is `[disabled]` before any input
- No clear indication of what's required
- Should show validation errors instead

---

## 🟡 MINOR ISSUES

### 18. **CATEGORY CAROUSEL AWKWARDNESS**
- "Previous slide" button is always disabled initially
- 24+ categories crammed into horizontal scroll
- No indication of how many categories exist

### 19. **SEARCH PAGE METADATA MISMATCH**
- Header shows "20 намерени продукта" (20 products found)
- Below shows "246 резултата" (246 results)
- **Which is it?**

### 20. **TAB FILTERS UX**
Homepage tabs: "Всички", "Най-нови", "Най-продавани", etc.
- 9 different filter tabs in a row
- Overwhelming for users
- "Близо до мен" requires location but doesn't prompt for permission

### 21. **FOOTER STRUCTURE TOO HEAVY**
Four columns of links:
- "За нас" - 9 links (24 broken)
- "Помощ" - 8 links (most broken)
- "Магазини" - 5 links (all broken)
- "Услуги" - 7 links (most broken)

**Remove broken links until pages exist**

### 22. **INCONSISTENT BUTTON STYLES**
- Primary buttons: Various orange/amber shades
- Secondary buttons: Sometimes outlined, sometimes filled
- Ghost buttons: Inconsistent hover states

### 23. **PRODUCT CARD HOVER STATES**
- Wishlist/Cart buttons appear on hover
- But cursor is already `[cursor=pointer]` on entire card
- Confusing click targets

### 24. **ACCESSIBILITY ISSUES**
- Skip to main content link exists ✓
- But many interactive elements lack proper ARIA labels
- Rating stars are just images without alt text
- Carousels don't announce slide changes

---

## 📊 PAGE-BY-PAGE AUDIT SUMMARY

| Page | Status | Issues |
|------|--------|--------|
| Homepage `/bg` | ⚠️ Functional | Mock data, mixed currencies, AMZN branding |
| Search `/bg/search` | ⚠️ Functional | Mixed languages, fake product count |
| Today's Deals `/bg/todays-deals` | ⚠️ Functional | Static mock data, USD prices |
| Cart `/bg/cart` | ✅ Works | Slow initial load |
| Login `/bg/auth/login` | ✅ Works | Disabled button UX |
| Product Page | ⚠️ Functional | Contradictory review data |
| Categories `/bg/categories/*` | ✅ Works | English subcategory names |
| Gift Cards `/bg/gift-cards` | ⚠️ Skeleton | No real functionality |
| Registry `/bg/registry` | ❌ Not Localized | 100% English |
| Customer Service `/bg/customer-service` | ✅ Works | Good implementation |
| About `/bg/about` | ✅ Works | Fake statistics |
| Contact `/bg/contact` | ✅ Works | Good form |
| Privacy `/bg/privacy` | ✅ Works | Slow load |
| Terms `/bg/terms` | ✅ Works | Slow load |
| Returns `/bg/returns` | ❌ Empty | No content |
| Careers `/bg/careers` | ❌ 404 | Page missing |
| Blog `/bg/blog` | ❌ 404 | Page missing |
| Store Locator `/bg/store-locator` | ❌ 404 | Page missing |
| Membership `/bg/membership` | ❌ 404 | Page missing |

---

## 🎯 PRIORITY ACTION ITEMS

### CRITICAL (Do Today)
1. ✅ **DONE** - Change all "AMZN" branding to "Treido" (40+ files updated)
2. ⬜ Remove or fix ALL broken footer links (24+)
3. ⬜ Fix social media links (remove or add real URLs)
4. ⬜ Localize 404 page to Bulgarian

### HIGH (This Week)
5. ⬜ Remove fake/test product data from homepage
6. ⬜ Translate Registry page to Bulgarian
7. ⬜ Fix product review inconsistencies
8. ⬜ Standardize currency to BGN (лв.)
9. ⬜ Add proper loading states/skeletons
10. ⬜ Fix Returns page (empty content)

### MEDIUM (This Month)
11. ⬜ Implement real Gift Cards functionality
12. ⬜ Translate all product titles/conditions
13. ⬜ Create missing pages or remove links
14. ⬜ Fix seller rating display
15. ⬜ Add proper accessibility labels

### LOW (Backlog)
16. ⬜ Improve category carousel UX
17. ⬜ Consolidate tab filters
18. ⬜ Streamline footer
19. ⬜ Standardize button styles

---

## 💡 RECOMMENDATIONS

### Brand Identity
- **Pick ONE name:** Treido
- **Remove ALL Amazon/AMZN references** - legal liability
- **Create brand guidelines** and follow them

### Localization Strategy
- **Option A:** Full Bulgarian localization (current intent)
  - Translate ALL UI, products, and content
  - Use BGN currency only
- **Option B:** English with Bulgarian support
  - Use English as primary, Bulgarian as fallback

### Content Strategy
- Remove all mock/test data before launch
- Don't show features that don't work
- "Coming Soon" pages better than 404s

### Technical Debt
- Implement proper loading states
- Add error boundaries
- Fix SSR/hydration issues causing blank pages

---

## 🏁 FINAL VERDICT

**Overall Score: 4/10**

The site has a solid foundation but is absolutely **NOT ready for production**. The mix of broken links, inconsistent branding, unlocalized content, and fake data makes it feel like a development environment accidentally deployed to production.

**Before going live:**
1. Fix the 24+ broken footer links
2. Remove all AMZN/Amazon references  
3. Translate everything to Bulgarian
4. Remove test/mock data
5. Implement proper loading states

The core e-commerce functionality (search, product pages, cart) works, but the surrounding experience screams "unfinished project."

---

*Audit conducted with Playwright MCP automation by GitHub Copilot*

---

## 📋 FIX PLAN

### Phase 1: Branding Fix ✅ COMPLETED
**Files Updated (40+):**
- `app/[locale]/layout.tsx` - Page title template & OpenGraph
- `components/layout/header/site-header.tsx` - Header logo (mobile + desktop)
- `components/layout/header/minimal-header.tsx` - Auth page header
- `components/navigation/app-breadcrumb.tsx` - Default home label
- `components/desktop/desktop-hero-cta.tsx` - Hero aria-label
- `components/layout/cookie-consent.tsx` - Event name
- `components/common/geo-welcome-modal.tsx` - Event listener
- `app/[locale]/(main)/page.tsx` - Homepage meta description
- `app/[locale]/(main)/search/page.tsx` - Search meta
- `app/[locale]/(main)/about/page.tsx` - About meta
- `app/[locale]/(main)/sellers/page.tsx` - Sellers meta
- `app/[locale]/(main)/members/page.tsx` - Members meta
- `app/[locale]/(main)/todays-deals/page.tsx` - Breadcrumb
- `app/[locale]/(main)/(support)/contact/page.tsx` - Contact meta
- `app/[locale]/(main)/(legal)/terms/page.tsx` - Terms meta
- `app/[locale]/(main)/sellers/_components/top-sellers-hero.tsx` - Breadcrumb
- `app/[locale]/(main)/members/_components/members-page-client.tsx` - Breadcrumb
- `app/[locale]/(main)/search/_components/search-header.tsx` - Breadcrumb
- `app/[locale]/(auth)/_components/login-form.tsx` - Logo alt
- `app/[locale]/(auth)/_components/sign-up-form.tsx` - Logo alt
- `app/[locale]/(checkout)/_components/checkout-header.tsx` - Header logo
- `app/[locale]/(checkout)/_components/checkout-footer.tsx` - Copyright
- `app/[locale]/(sell)/_components/seller-onboarding-wizard.tsx` - Translations
- `app/[locale]/(plans)/_components/plans-page-client.tsx` - Footer copyright
- `app/[locale]/(account)/account/profile/public-profile-editor.tsx` - Profile URLs
- `app/[locale]/[username]/page.tsx` - Profile page meta
- `app/[locale]/[username]/[productSlug]/page.tsx` - Product page meta
- `app/sitemap.ts` - Sitemap base URL
- `lib/url-utils.ts` - URL helper defaults
- `lib/view-models/product-page.ts` - Product metadata
- `lib/validations/auth.ts` - Reserved usernames
- `lib/image-utils.ts` - Comment update
- `app/actions/username.ts` - Reserved usernames
- `messages/en.json` - Amazon Music/Appstore/Live → Treido
- `messages/bg.json` - Amazon Music/Appstore/Live → Treido
- `e2e/full-flow.spec.ts` - Test assertions updated
- `e2e/orders.spec.ts` - Test email domain

### Phase 2: Social Media Links (You will do)
Create real social media accounts and update:
- `components/layout/footer/site-footer.tsx` (or wherever footer links are)
- Replace all `href="#"` with actual URLs

### Phase 3: Broken Footer Pages (You will do)
Either create pages or remove links for:
- `/bg/careers` - Create or remove
- `/bg/blog` - Create or remove
- `/bg/store-locator` - Create or remove
- `/bg/membership` - Create or remove
- etc. (see full list above)

### Phase 4: Localization
- Localize 404 page to Bulgarian
- Translate Registry page
- Review all English strings in Bulgarian locale
