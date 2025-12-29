# 🎯 TREIDO.EU MASTER FIX PLAN

> **Created:** December 29, 2025  
> **Source:** Desktop & Mobile Audits Consolidated  
> **Goal:** Production-ready marketplace in 4 phases  
> **Principle:** NO over-engineering. Real fixes only.

---

## 📊 Issue Summary (Revised)

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Truly Broken Links | ~8 | - | - | - |
| Branding | 3 | 2 | - | - |
| Localization | 5 | 4 | 3 | - |
| Content/Data | 3 | 3 | 2 | - |
| UI/UX | - | 6 | 8 | 10 |
| **Total** | **~19** | **15** | **13** | **10** |

**Note:** Many "broken" links from original audit are actually useful "Coming Soon" pages:
- /investors, /store-locator, /accessibility, /affiliates, /advertise, /suppliers, /careers, /blog
- /cookies, /security already have full content!
- Only Amazon-specific links (pharmacy, optical, clinic, etc.) need removal

---

## ✅ ALREADY COMPLETED

- [x] AMZN → Treido branding (40+ files updated)
- [x] Page titles updated
- [x] Logo text updated
- [x] Meta descriptions updated
- [x] Test file assertions updated

---

## 🚀 PHASE 1: TRUST KILLERS (Day 1-2)

**Goal:** Remove everything that makes users leave immediately.

### 1.1 Clean Up Footer Links (Strategic Cleanup)
**Time:** 1 hour  
**Principle:** Keep USEFUL features, only remove truly irrelevant links.

#### ✅ KEEP (Already Working or Useful "Coming Soon" pages):
```
WORKING PAGES:
├── /about            ✓ Has real content
├── /contact          ✓ Has real content
├── /privacy          ✓ Has real content
├── /terms            ✓ Has real content  
├── /returns          ✓ Has real content
├── /customer-service ✓ Has real content
├── /cookies          ✓ Has real cookie policy content
├── /security         ✓ Has real security info (250 lines!)
├── /plans            ✓ Membership/plans page exists
├── /sell             ✓ Seller flow works

USEFUL "COMING SOON" PAGES (Keep - good features):
├── /investors        ✓ Good for potential sponsors/investors
├── /store-locator    ✓ Good for business accounts (physical stores)
├── /accessibility    ✓ Important for compliance
├── /affiliates       ✓ Partner program placeholder
├── /advertise        ✓ Business opportunity
├── /suppliers        ✓ B2B feature
├── /careers          ✓ Shows company is growing
├── /blog             ✓ Content marketing placeholder
├── /gift-cards       ✓ Has page (fix later)
├── /registry         ✓ Has page (fix later)
├── /free-shipping    ✓ Has page (fix later)
```

#### ❌ REMOVE (Truly Irrelevant - Amazon-specific):
```
REMOVE from footer config:
├── /pharmacy         ✗ Not a pharmacy business
├── /optical          ✗ Not an optical business  
├── /clinic           ✗ Not a clinic business
├── /recalls          ✗ Not applicable yet
├── /same-day-delivery ✗ Not implementing
├── /order-pickup     ✗ Not implementing
├── /privacy-choices  ✗ Redundant with /privacy
├── /interest-based-ads ✗ Amazon-specific
└── CA Privacy Rights  ✗ EU marketplace, not California
```

#### 🆕 ADD (Useful Missing Features):
```
CREATE these pages:
├── /feedback         → Simple form: text + input to send feedback
```

### 1.2 Social Media Links
**Time:** 0 mins  
**Action:** KEEP social media icons in footer. Update URLs when real accounts are created.
**Rationale:** Social proof is important. Placeholder links with "#" are fine for now.

### 1.3 Fix 404 Page Localization  
**Time:** 1 hour  
**Files:** `app/[locale]/not-found.tsx` or `app/global-not-found.tsx`

```tsx
// Ensure all text is localized via messages/bg.json and messages/en.json
// Ensure links have locale prefix: /{locale}/search, /{locale}/todays-deals
```

### 1.4 Fake/Test Products - DEFER
**Time:** 0 hours now  
**Action:** Leave fake/test products for now. Will clean up in a future sprint.
**Rationale:** Focus on trust-killing UI issues first. Test products don't hurt as much as broken links.

---

## ✅ PHASE 2: CONSISTENCY (Day 3-5) — COMPLETED ✓

**Goal:** Make the site feel professional and consistent.
**Status:** ✅ COMPLETED on December 29, 2025

### 2.1 ✅ Standardize Currency Display
**Time:** 3 hours  
**Files:** `lib/currency.ts`, `lib/format-price.ts`, price display components

**DONE:**
- ✅ Changed English locale from USD ($) to EUR (€) in `lib/currency.ts`
- ✅ Both locales now use EUR as the currency
- ✅ Bulgarian: `29,99 €` (symbol after, comma decimal)
- ✅ English: `€29.99` (symbol before, dot decimal via Irish English formatting)

### 2.2 ✅ Fix Condition Label Translations
**Time:** 1 hour  
**Files:** `messages/bg.json`, `messages/en.json`, product card components

**DONE:**
- ✅ Added full condition translations to both message files:
  - `conditionNew`: "Ново" / "New"
  - `conditionNewWithTags`: "Ново с етикети" / "New with Tags"
  - `conditionUsed`: "Използвано" / "Used"
  - `conditionUsedExcellent`: "Използвано - отлично" / "Used - Excellent"
  - `conditionUsedGood`: "Използвано - добро" / "Used - Good"
  - `conditionUsedFair`: "Използвано - задоволително" / "Used - Fair"
  - `conditionRefurbished`: "Рефърбиширано" / "Refurbished"
- ✅ Updated `product-buy-box.tsx` formatCondition function
- ✅ Updated `product-card.tsx` with `translateCondition()` for badge display

### 2.3 ✅ Fix Registry Page Localization
**Time:** 2 hours  
**Files:** `app/[locale]/(main)/registry/page.tsx`, messages files

**DONE:**
- ✅ Removed all "Amazon Registry" references
- ✅ Added `RegistryPage` translations section to both `bg.json` and `en.json`
- ✅ Updated page to use `getTranslations("RegistryPage")`
- ✅ All hero text, buttons, registry types, and benefits now translated

### 2.4 Fix Returns Page (Empty Content) — SKIPPED
**Status:** Already has full content (312 lines with proper translations)

### 2.5 Remove Fake Statistics from About Page — SKIPPED
**Status:** Already updated with honest messaging ("Growing Fast", "Made for Bulgaria", etc.)

---

## 🎨 PHASE 3: UX POLISH (Day 6-10)

**Goal:** Improve user experience without over-engineering.

### 3.1 Add Loading Skeletons
**Time:** 4 hours  
**Priority Pages:** Product page, Cart, Search results

```tsx
// Use existing shadcn/ui Skeleton component
// Replace blank loading states with shimmer skeletons
```

### 3.2 Fix Product Review Inconsistencies
**Time:** 2 hours  
**Issue:** Product shows "4.9 rating, 15,600 reviews" but breakdown shows 0 reviews

**Fix:** 
- If no reviews exist, show "No reviews yet" consistently
- Don't show fake aggregate ratings
- Hide star breakdown if empty

### 3.3 Fix Seller Rating Display
**Time:** 1 hour  
**Issue:** Shows "0.0" and "0% positive" for new sellers

**Fix:**
- If seller has 0 reviews → Show "New Seller" badge instead
- Only show rating when seller has 5+ reviews

### 3.4 Fix Mobile Product Card Buttons
**Time:** 2 hours  
**Issue:** Wishlist/Cart buttons only appear on hover (desktop pattern)

**Fix:** 
- Make buttons always visible on mobile viewport
- Use CSS `@media (hover: none)` to detect touch devices

### 3.5 Fix Copyright Year
**Time:** 15 mins  
**Issue:** Hardcoded "© 2024" and "© 2025" in different places

**Fix:**
```tsx
const currentYear = new Date().getFullYear();
// Use {currentYear} in all copyright strings
```

### 3.6 Fix Header Logo Tap Target
**Time:** 30 mins  
**Issue:** Logo too small on mobile, hard to tap

**Fix:** Add padding to increase tap target to minimum 44x44px

---

## 🧹 PHASE 4: CLEANUP (Day 11-14)

**Goal:** Remove cruft and finalize for production.

### 4.1 Remove Gift Cards Page (if not functional)
**Time:** 30 mins  
**Issue:** Shows 8 identical skeleton cards with Amazon branding

**Options:**
- Remove from navigation until feature is ready
- Or create proper gift card functionality

### 4.2 Clean Up Footer Structure
**Time:** 1 hour  
**Current:** 4 columns with 29+ links (24 broken)
**After Phase 1:** 4 columns with ~5 links each = simpler

### 4.3 Fix Today's Deals Mock Data
**Time:** 2 hours  
**Issue:** Shows static Amazon products (Fire TV, Echo Dot) with USD prices

**Fix:**
- Replace with real deals from marketplace sellers
- Or hide "Today's Deals" until feature is real
- At minimum, fix the currency

### 4.4 Accessibility Quick Wins
**Time:** 2 hours

- Add aria-labels to icon-only buttons
- Add alt text to rating stars
- Ensure skip-link is properly hidden
- Test with keyboard navigation

### 4.5 Final Testing Checklist
**Time:** 2 hours

Run these before declaring "production ready":
- [ ] All footer links work (no 404s)
- [ ] Currency is consistent (BGN for /bg, EUR for /en)
- [ ] All UI text is translated
- [ ] No test/placeholder products visible
- [ ] Login/Register flow works
- [ ] Add to cart works
- [ ] Search works
- [ ] Mobile menu works
- [ ] No console errors

---

## 📋 FILE-BY-FILE CHANGE LIST

### Phase 1 Files
| File | Action |
|------|--------|
| `components/layout/footer/site-footer.tsx` | Remove only truly irrelevant links (pharmacy, optical, etc.) |
| `app/[locale]/not-found.tsx` or `app/global-not-found.tsx` | Add translations, fix link prefixes |
| `app/[locale]/(main)/feedback/page.tsx` | **CREATE** - Simple feedback form page |
| Database (Supabase) | DEFER - Clean test products later |

### Phase 2 Files
| File | Action |
|------|--------|
| `lib/format-price.ts` | Enforce locale-based currency |
| `messages/bg.json` | Add condition translations |
| `messages/en.json` | Add condition translations |
| `app/[locale]/(main)/registry/*` | Translate or remove |
| `app/[locale]/(main)/returns/*` | Add content |
| `app/[locale]/(main)/about/page.tsx` | Remove fake stats |

### Phase 3 Files
| File | Action |
|------|--------|
| `components/ui/skeleton.tsx` | Verify exists |
| Product page components | Add skeletons |
| Product card components | Fix reviews display |
| Seller components | Fix rating display |
| `components/layout/footer/*` | Fix copyright year |
| Header components | Increase logo tap target |

### Phase 4 Files
| File | Action |
|------|--------|
| Navigation config | Remove gift cards if needed |
| `app/[locale]/(main)/todays-deals/*` | Fix currency, data |
| Various | Accessibility fixes |

---

## ⏱️ TIME ESTIMATE (Revised)

| Phase | Duration | Effort |
|-------|----------|--------|
| Phase 1: Trust Killers | 1 day | ~3 hours |
| Phase 2: Consistency | 2-3 days | ~8 hours |
| Phase 3: UX Polish | 3-4 days | ~12 hours |
| Phase 4: Cleanup | 2-3 days | ~8 hours |
| **Total** | **8-11 days** | **~31 hours** |

*Note: Phase 1 reduced from 5h to 3h since we're keeping useful pages and deferring test data cleanup*

---

## 🚫 WHAT WE'RE NOT DOING (Anti Over-Engineering)

1. ❌ Not removing useful "Coming Soon" pages (investors, store-locator, accessibility, etc.)
2. ❌ Not removing social media icons (keep them, update URLs later)
3. ❌ Not deleting test products yet (clean up in future sprint)
4. ❌ Not implementing real gift cards (keep page, fix later)
5. ❌ Not redesigning the footer (just remove truly irrelevant stuff)
6. ❌ Not implementing real-time review aggregation (just hide fake numbers)
7. ❌ Not building a CMS for static pages (hardcode is fine)
8. ❌ Not implementing A/B testing yet (fix basics first)

## ✅ WHAT WE ARE DOING (Smart Decisions)

1. ✅ Keep /investors - potential sponsors can learn about us
2. ✅ Keep /store-locator - business accounts can link physical stores
3. ✅ Keep /cookies, /security - legal/trust pages already have content!
4. ✅ Keep /accessibility - compliance important
5. ✅ Keep social media icons - social proof matters
6. ✅ Create /feedback - simple text + form to collect user feedback
7. ✅ Only remove Amazon-specific junk (pharmacy, optical, clinic, etc.)

---

## ✅ SUCCESS CRITERIA

After completing all phases:

1. **Zero 404s** from any navigation link
2. **Consistent branding** - "Treido" everywhere
3. **Consistent currency** - BGN for Bulgarian, EUR for English
4. **No test data** visible to users
5. **All text localized** in user's language
6. **Professional appearance** - no placeholder content
7. **Basic accessibility** - keyboard navigable, labeled buttons
8. **Mobile-friendly** - all interactions work on touch

---

## 🏁 READY TO START?

Begin with Phase 1. Each task is independent - can be done in any order within the phase.

```bash
# Suggested order:
1. Remove only irrelevant footer links (pharmacy, optical, clinic, etc.)
2. Create /feedback page (simple form)
3. 404 page localization
4. Test data cleanup - DEFERRED to future sprint
```

---

*Plan created from Desktop Audit + Mobile Audit consolidation*
