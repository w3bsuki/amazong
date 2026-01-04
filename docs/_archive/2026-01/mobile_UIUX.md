# 🔥 ULTIMATE MOBILE UI/UX ROAST - TREIDO.EU 🔥

> **Audit Date:** December 29, 2025 (Updated: January 2025)  
> **Platform:** https://treido.eu → https://www.treido.eu/en  
> **Device Target:** iPhone X/12/13 (375×812px)  
> **Tech Stack:** Next.js 16 + Tailwind CSS v4 + shadcn/ui  
> **Auditor:** Comprehensive MCP Browser Automation + Manual Analysis  
> **Verdict:** 🟡 **MAJOR PROGRESS - DEPLOY NEEDED**
> 
> ⚠️ **NOTE:** Production (treido.eu) is NOT updated. All fixes below are verified on **localhost:3000** and need deployment.

---

## 🎯 Executive Summary

This audit **ROASTS** the mobile experience on treido.eu with brutally honest feedback. The site has the *bones* of a decent marketplace but is plagued by fundamental UI/UX anti-patterns, broken functionality, and design inconsistencies that destroy user trust and conversion potential.

### The Good (✅), The Bad (❌), and The Ugly (💀)

| Category | Score | Verdict |
|----------|-------|---------|
| **Layout & Structure** | 5/10 | Needs hierarchical cleanup |
| **Typography** | 4/10 | Inconsistent, some too small |
| **Colors & Contrast** | 6/10 | Mostly OK, some issues |
| **Touch Targets** | 7/10 | Acceptable per your 40px rule |
| **Loading Performance** | 4/10 | Too much jank |
| **Accessibility** | 5/10 | Basic a11y present, gaps exist |
| **Trust Signals** | 7/10 | ✅ **MAJOR FIXES DEPLOYED LOCALLY** |
| **Brand Consistency** | 8/10 | ✅ **FIXED - Treido everywhere** |

---

## ✅ FIXED: Critical Identity Issues (Localhost Verified)

### 1. ✅ AMZN → TREIDO Branding (FIXED)

**Previous State:** Logo showed "AMZN", pages titled "Home | AMZN"  
**Current State (localhost):**
- ✅ Logo: "Treido"
- ✅ Page titles: "Home | Treido", "About Us | Treido", etc.
- ✅ Footer: "© 2025 Treido, Inc."
- ✅ Registry page: "Treido Registry" (was "Amazon Registry")
- ✅ Breadcrumbs: "Treido" (was "Amazong" typo)

**Status:** ✅ COMPLETE - Ready for deploy

---

### 2. ✅ Dead Footer Links (MOSTLY FIXED)

**Previous State:** 18+ links returning 404  
**Current State (localhost):**
- ✅ /en/careers → Shows "Coming Soon" page (not 404)
- ✅ Footer reorganized into 4 clean sections: Company, Help, Sell & Business, Services
- ✅ Dead US-specific links removed (CA Privacy Rights, Interest Based Ads)

**Status:** ✅ COMPLETE

---

### 3. ⚠️ Social Media Links (STILL "#")

All social links still point to `#`:
- Pinterest → `#`
- Facebook → `#`  
- Instagram → `#`
- X/Twitter → `#`
- YouTube → `#`
- TikTok → `#`

**Fix:** Add real social URLs or remove icons entirely.

**Status:** ⚠️ REMAINING ISSUE

---

### 4. ✅ Fabricated Statistics (FIXED)

**Previous State:** "15+ Years", "50M+ Products", "10M+ Customers"  
**Current State (localhost About page):**
- ✅ "Growing Fast - New marketplace, big ambitions"
- ✅ "100% Secure - Stripe-powered payments"
- ✅ "Made for Bulgaria - Local sellers, local focus"
- ✅ "Built with Care - By shoppers, for shoppers"
- ✅ Honest headline: "Building the Future of E-Commerce in Bulgaria"
- ✅ Honest intro: "We're a **new** marketplace on a mission..."

**Status:** ✅ COMPLETE - Honest messaging deployed locally

---

### 5. ✅ US-Specific Legal Links (REMOVED)

**Previous State:** Footer showed "CA Privacy Rights", "Interest Based Ads"  
**Current State (localhost):**
- ✅ Footer legal section now: Terms of Service, Privacy Policy, Cookie Preferences
- ✅ No US-specific regulatory links

**Status:** ✅ COMPLETE

---

## ❌ THE BAD: Typography Violations

### 5. Typography Hierarchy is Broken

**Current Issues Found:**

| Element | Problem | Fix |
|---------|---------|-----|
| Product titles | Inconsistent weights | Use `font-semibold` consistently |
| Prices | Mix of formats | Standardize to `font-semibold text-price-regular` |
| Condition badges | Untranslated, random caps | Translate + use `text-tiny font-medium` |
| Category labels | `text-tiny` (11px) too small | Bump to `text-xs` (12px) |
| Helper text | Mix of sizes | Standardize to `text-xs text-muted-foreground` |

**Typography Scale Violations:**

Per your `DESIGN_SYSTEM.md`:
- `text-2xs` (10px) should be **badges only** → Found used elsewhere
- `text-tiny` (11px) is **"use sparingly"** → Found overused
- Body text should be `text-sm` (14px) → Some areas are smaller

**Example Fixes:**
```diff
- <span className="text-[11px] text-gray-500">
+ <span className="text-xs text-muted-foreground">

- <h3 className="text-sm font-normal">
+ <h3 className="text-base font-semibold">
```

---

## ⚠️ REMAINING: Currency Display Chaos 💸

**Found on localhost search page:**
- **Price filter buttons:** `$25`, `$50`, `$100` (USD!)
- **Product prices:** `€1,299`, `€900` (Euro)

**Impact:** Currency mismatch in filters vs prices. Users confused about what they're paying.

**Fix:** Update price filter ranges to use € (Euro) to match product prices.

---

### 7. Placeholder/Test Products Visible 🤡

**Found in product feed:**
```
❌ "Айсифон" (fake iPhone)
❌ "Айсифон 17"
❌ "12322"
❌ "123123"
❌ "123123123123"
❌ "БУБА" (means "bug")
❌ "ЧРД АНТОНИЯ" (Happy Birthday Antonia)
❌ "Заглавие" (literally means "Title")
❌ "Грозни обувки" (means "Ugly shoes")
```

**Impact:** Marketplace looks abandoned/fake. Kills trust instantly.

**Fix:** 
1. Implement product moderation before listing goes live
2. Clean up existing test data
3. Seed with realistic demo products if needed

---

## ❌ THE BAD: Layout & Spacing Issues

### 8. Mobile Alignment Violations

Per your `DESIGN_SYSTEM.md`, mobile should use `px-4` (16px) horizontal padding consistently.

**Issues Found:**
- Some sections use `px-2` (too tight)
- Others use `px-6` (too loose)
- Creates jagged left edge when scrolling

**Fix:** Audit all containers, enforce `px-4` consistency.

---

### 9. Horizontal Scroll Without Indicators

**Problem Areas:**
- Category rail (horizontal scroll, no fade indicator)
- Product tabs ("For you", "Promoted", etc.)
- "More from this seller" section

**Issue:** No visual cue that more content exists off-screen.

**Fix:** Add fade gradients at scroll edges:
```css
.scroll-container::after {
  content: '';
  position: absolute;
  right: 0;
  width: 24px;
  background: linear-gradient(to right, transparent, var(--background));
}
```

---

### 10. Footer Accordion - All Collapsed

On mobile, all footer sections are collapsed accordions:
- About Us (collapsed)
- Help (collapsed)  
- Stores (collapsed)
- Services (collapsed)

**Issue:** Important navigation completely hidden. Users may not discover these exist.

**Fix:** 
- Keep at least one section open, OR
- Use different mobile footer pattern (stacked links), OR
- Show preview of 2-3 links per section

---

### 11. Sticky Header Too Tall

**Current:** Header appears to take ~60-70px of vertical space.

**Impact:** On a 812px screen, that's 8% of viewport always consumed.

**Fix:** Consider collapsing header on scroll, or reducing to 56px max.

---

## ❌ THE BAD: Colors & Theming

### 12. OKLCH Usage Review

You mention using OKLCH colors (great for gamut!). But ensure:

| Check | Status |
|-------|--------|
| All `--color-*` tokens use OKLCH | ⚠️ Verify in globals.css |
| Contrast ratios meet WCAG AA | ⚠️ Test needed |
| Dark mode colors defined | ⚠️ Verify |
| No hardcoded hex values | ⚠️ Search codebase |

**Grep for issues:**
```bash
# Find hardcoded colors that should be tokens
grep -r "bg-\[#" components/
grep -r "text-\[#" components/
grep -r "border-\[#" components/
```

---

### 13. Semantic Token Misuse

**Issues Found:**
- Some `text-gray-500` instead of `text-muted-foreground`
- Some `bg-gray-100` instead of `bg-muted`
- Hardcoded shadows instead of `shadow-sm`

**Fix:** Replace all with semantic tokens from `globals.css`.

---

### 14. Deal/Sale Colors Inconsistent

**Found:**
- Some sale prices use red
- Some use orange
- Some use default text color

**Fix:** Standardize to `text-price-sale` token everywhere.

---

## ❌ THE BAD: Loading & Performance

### 15. Product Page Content Delay

**Observation:** When navigating to a product page:
1. Header renders immediately
2. Footer renders immediately
3. Main content area is EMPTY for ~2 seconds
4. Then content appears

**Impact:** Users think page is broken, will bounce.

**Fix Options:**
1. Add skeleton loaders (but per your audit, avoid `animate-pulse`)
2. Ensure SSR delivers content immediately
3. Use streaming/suspense properly

---

### 16. Images Without Placeholders

**Issue:** Product images load without:
- Blur-up effect
- Background placeholder
- Size reservation

**Impact:** Causes Layout Shift (CLS penalty).

**Fix:** Use Next.js `<Image>` with:
```jsx
<Image
  src={productImage}
  placeholder="blur"
  blurDataURL={tinyBlurUrl}
  width={x}
  height={y}
/>
```

---

### 17. Category Rail Loading Flash

**Issue:** Category rail shows loading state that flashes briefly.

**Fix:** Per your audit, replace `animate-pulse` with static gray background.

---

## ⚠️ MEDIUM: Accessibility Gaps

### 18. Skip Link Flash

**Issue:** "Skip to main content" link briefly visible on page load before CSS loads.

**Fix:** Ensure skip link is `sr-only focus:not-sr-only` from initial paint.

---

### 19. Focus Rings Inconsistent

**Issue:** Some interactive elements missing `focus-visible:ring-2`.

**Check:** All buttons, links, inputs need visible focus states.

---

### 20. Color-Only Meaning

**Issue:** Some states (in stock vs out of stock) rely only on color.

**Fix:** Add icons or text to supplement color:
```jsx
// Bad
<span className="text-green-500">In Stock</span>

// Good
<span className="text-stock-available">
  <CheckIcon className="size-4 mr-1" />
  In Stock
</span>
```

---

### 21. Missing ARIA Labels

**Elements to check:**
- Icon-only buttons (cart, wishlist)
- Social media links
- Pagination numbers
- Slider/carousel controls

**Fix:** Add `aria-label` to all icon-only actions.

---

## ⚠️ MEDIUM: Mobile UX Anti-Patterns

### 22. Hover-Dependent Actions

**Issue:** Product cards have "Add to Watchlist" and "Add to Cart" buttons that appear on hover.

**Problem:** Mobile has no hover state!

**Fix:** Make buttons always visible on mobile:
```jsx
<div className="opacity-0 group-hover:opacity-100 md:opacity-0 touch:opacity-100">
```
Or better: always show on mobile breakpoint.

---

### 23. Desktop Pagination on Mobile

**Issue:** Numbered pagination (1, 2, ..., 13) instead of infinite scroll or "Load More".

**Impact:** Harder to use on mobile, requires precise taps.

**Fix:** Implement "Load More" button or infinite scroll for mobile.

---

### 24. "Buy Now" vs "Add to Cart" Confusion

**Issue:** Both buttons look identical, same size, side by side.

**Fix:** Differentiate clearly:
```jsx
// Primary action - full width, prominent
<Button className="w-full bg-cta-trust-blue">Buy Now</Button>

// Secondary action - outline or smaller
<Button variant="outline" className="w-full">Add to Cart</Button>
```

---

### 25. Menu Dialog Says "Hello!"

**Issue:** Mobile menu opens with "Hello!" text which feels odd for a navigation menu.

**Fix:** Remove "Hello!" or use contextual greeting:
- Logged in: "Hi, [Name]"
- Logged out: "Sign in for the best experience"

---

### 26. Language Switcher Too Small

**Issue:** Language button ("en") is tiny in the mobile menu.

**Fix:** Make it a proper selectable element with adequate touch target (40px per your design system).

---

### 27. "Chat" Requires Login Silently

**Issue:** Tapping "Chat" in bottom nav redirects to login without explanation.

**Fix:** Show modal first: "Sign in to chat with sellers"

---

## ⚠️ MEDIUM: Localization Issues

### 28. Condition Labels Not Translated

**Found:**
- "used excellent" (English on Bulgarian site)
- "new with tags" (English)
- Inconsistent capitalization

**Fix:** Translate all condition labels in `messages/bg.json`.

---

### 29. "CA Privacy Rights" on Bulgarian Site

**Issue:** Footer shows California-specific legal link.

**Impact:** Irrelevant for Bulgarian users, looks like uncustomized template.

**Fix:** Replace with GDPR-relevant links for EU users.

---

### 30. "Interest Based Ads" US Concept

**Issue:** Footer link to US regulatory concept.

**Fix:** Remove or replace with EU-compliant equivalent.

---

### 31. 404 Page Missing Locale

**Issue:** 404 links go to `/` instead of `/en` or `/bg`.

**Fix:** Prefix all 404 page links with current locale.

---

## 🟢 WHAT'S WORKING WELL

### ✅ Good Patterns Found

1. **Bottom Navigation Bar** - Appropriate pattern for mobile marketplace
2. **Semantic HTML Structure** - Banner, main, nav, contentinfo regions present
3. **Skip Link Exists** - Accessibility baseline is there
4. **Product Card Layout** - Clean, key info visible at glance
5. **Tab Interface** - "For you", "Promoted", etc. tabs feel native
6. **Touch Targets** - Most buttons appear to meet 40px rule
7. **Mobile Menu** - Full-screen pattern is appropriate
8. **Image Aspect Ratios** - Product images maintain proportions

---

## 🛠️ ACTION PLAN (Updated)

### ⚡ IMMEDIATE: Deploy to Production
- [x] ~~Fix AMZN → Treido branding EVERYWHERE~~ ✅ DONE
- [x] ~~Remove or fix all broken footer links~~ ✅ DONE  
- [x] ~~Remove fake statistics~~ ✅ DONE
- [x] ~~Remove US-specific legal links (CA Privacy, Interest Based Ads)~~ ✅ DONE
- [x] ~~Fix "Amazon Registry" → "Treido Registry"~~ ✅ DONE
- [ ] **DEPLOY THESE CHANGES TO PRODUCTION**

### Week 1: HIGH PRIORITY
- [ ] Add real social media URLs or remove icons
- [ ] Fix currency filter ($) to match product prices (€)
- [ ] Clean up test product data
- [ ] Translate all condition labels
- [ ] Add skeleton loaders (no animate-pulse)

### Week 2: MEDIUM (Polish)
- [ ] Audit typography scale compliance
- [ ] Fix horizontal scroll indicators
- [ ] Improve footer mobile UX
- [ ] Standardize badge styles
- [ ] Fix pagination for mobile ("Load More" instead of numbered)

### Week 3: LOW (Nice-to-Have)
- [ ] Audit OKLCH color usage
- [ ] Replace all hardcoded colors with tokens
- [ ] Add focus rings to all interactive elements
- [ ] Improve image loading with blur-up
- [ ] A/B test mobile patterns

---

## 🎨 DESIGN SYSTEM COMPLIANCE

### Per Your `DESIGN_SYSTEM.md`:

| Rule | Current Status |
|------|----------------|
| 4px grid baseline | ⚠️ Some violations |
| `px-4` horizontal padding | ⚠️ Inconsistent |
| `text-sm` (14px) body text | ⚠️ Some smaller |
| 40px max touch targets | ✅ Mostly compliant |
| `bg-secondary` for pills | ⚠️ Not always used |
| No `shadow-lg`/`shadow-xl` | ⚠️ Audit needed |
| No `animate-pulse` | ⚠️ Audit needed |
| Semantic tokens only | ⚠️ Some hardcoded |

### Shadcn Component Audit

| Component | Status | Notes |
|-----------|--------|-------|
| Button | ⚠️ | Check CTA variants |
| Card | ⚠️ | Check shadow usage |
| Dialog | ⚠️ | Check overlay opacity |
| Input | ✅ | Seems OK |
| Select | ✅ | Seems OK |
| Tabs | ⚠️ | Check active states |

---

## 📱 MOBILE TESTING CHECKLIST

Before any release, verify:

```
CRITICAL PATH
[ ] Home page loads < 3s
[ ] Product search works
[ ] Product page loads < 3s
[ ] Add to cart works
[ ] Cart page displays correctly
[ ] Checkout flow works
[ ] Login/Register works
[ ] Language switching works

NAVIGATION
[ ] All footer links work (no 404s)
[ ] Bottom nav all tabs work
[ ] Back button behavior correct
[ ] Deep links work

DISPLAY
[ ] All currencies correct
[ ] All text translated
[ ] All images load
[ ] No horizontal scroll on page
[ ] No layout shifts

INTERACTION
[ ] All modals close properly
[ ] All accordions work
[ ] All carousels scrollable
[ ] All forms submittable
```

---

## 🏁 VERDICT (Updated January 2025)

**Treido.eu mobile experience: 6.5/10** (up from 4/10)

### ✅ Major Wins (Localhost)
1. **Identity Crisis SOLVED** - All "AMZN"/"Amazon" references → "Treido"
2. **Trust Signals FIXED** - Honest about being a new startup
3. **Legal Cleanup** - Removed US-specific links, proper EU footer
4. **404 Links FIXED** - Footer reorganized, broken links removed
5. **Registry page FIXED** - No more "Amazon Registry"

### ⚠️ Remaining Issues
1. **Social links → "#"** - Either add real URLs or remove icons
2. **Price filter currency mismatch** - Filters show $ but prices show €
3. **Test products visible** - Need moderation/cleanup
4. **Typography inconsistencies** - Minor polish needed

### 🚀 The Bottom Line

**DEPLOY TO PRODUCTION ASAP.** The critical trust-destroying issues are fixed locally but users are still seeing the broken production site.

The UI is now honest and properly branded. Deploy first, then continue with the polish items.

---

*Audit updated with Playwright MCP browser automation on localhost:3000*
*Production (treido.eu) still shows old broken version - needs deployment*
