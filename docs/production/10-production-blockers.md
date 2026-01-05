# 🚧 Production Blockers & Tasks (January 2026)

> **Domain:** treido.eu  
> **Status:** Blocking production launch  
> **Created:** January 5, 2026

---

## 🔴 CRITICAL BLOCKERS (Must Fix Before Launch)

### 1. Supabase Auth Configuration
**Priority:** 🔴 CRITICAL - Users cannot sign up/verify email  
**Status:** ⬜ Not Started

**Problem:** Email verification links point to old URL instead of treido.eu

**Action Required (Dashboard):**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update **Site URL** to `https://treido.eu`
3. Update **Redirect URLs** to include:
   - `https://treido.eu/**`
   - `https://www.treido.eu/**`
4. Update email templates to use new domain

**Verification:**
- Test signup flow end-to-end
- Verify email links redirect correctly

---

### 2. Stripe Configuration (New Account)
**Priority:** 🔴 CRITICAL - Payments not working  
**Status:** ⬜ Not Started

**Problem:** Using new Stripe account - products/prices not configured

**Action Required (Stripe Dashboard):**

#### A. Create Products in Stripe Dashboard
1. **Basic Plan** (Free)
   - No Stripe product needed (handled in-app)

2. **Premium Plan**
   - Create Product: "Treido Premium"
   - Monthly Price: €X.XX/month (set your price)
   - Yearly Price: €XX.XX/year (set your price)
   - Copy Price IDs

3. **Business Plan**
   - Create Product: "Treido Business"
   - Monthly Price: €XX.XX/month
   - Yearly Price: €XXX.XX/year
   - Copy Price IDs

#### B. Update Supabase `subscription_plans` table
```sql
UPDATE subscription_plans 
SET stripe_price_monthly_id = 'price_xxx', stripe_price_yearly_id = 'price_xxx'
WHERE tier = 'premium';

UPDATE subscription_plans 
SET stripe_price_monthly_id = 'price_xxx', stripe_price_yearly_id = 'price_xxx'
WHERE tier = 'business';
```

#### C. Configure Webhook
1. Create webhook endpoint: `https://treido.eu/api/subscriptions/webhook`
2. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
3. Copy webhook secret → set as `STRIPE_WEBHOOK_SECRET` env var

#### D. Update Environment Variables
```env
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=https://treido.eu
```

**Verification:**
- Test checkout flow with test card
- Verify webhook receives events
- Check subscription status updates in Supabase

---

### 3. Checkout URL Configuration
**Priority:** 🔴 CRITICAL  
**Status:** ⬜ Not Started

**Problem:** Stripe checkout success/cancel URLs may point to wrong domain

**Files to verify:**
- `app/api/subscriptions/checkout/route.ts` (lines 121-122)
- `app/api/boost/checkout/route.ts`
- Any other checkout routes

**Current code uses:**
```typescript
success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/plans?success=true...`
cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/plans?canceled=true`
```

**Action:** Ensure `NEXT_PUBLIC_APP_URL=https://treido.eu` in production env

---

## 🟡 HIGH PRIORITY TASKS

### 4. Social Media Links - Premium Feature
**Priority:** 🟡 HIGH  
**Status:** ⬜ Not Started

**Partner Concern:** Social links bad for personal sellers (users leave platform)

**Proposed Solution:**
- **Personal accounts:** Remove social links (Facebook, Instagram, Twitter, TikTok)
- **Business accounts:** Keep social links visible
- **Premium sellers:** Add social links as premium perk

**Files to modify:**
- `app/[locale]/(account)/account/profile/public-profile-editor.tsx`
- `app/[locale]/[username]/profile-client.tsx`
- `app/[locale]/[username]/page.tsx`

**Implementation:**
```typescript
// In profile display component
const showSocialLinks = profile.account_type === 'business' || profile.subscription_tier === 'premium'
```

**For profile editor:**
- Hide social links section for basic personal sellers
- Show upgrade prompt instead

---

### 5. Homepage Default Tab → Promoted
**Priority:** 🟡 HIGH  
**Status:** ⬜ Not Started

**Requirement:** Homepage should open with "Promoted" tab active instead of "All"

**File:** `components/sections/tabbed-product-feed.tsx`

**Current (line 75):**
```typescript
const [activeTab, setActiveTab] = useState<FeedTab>("all")
```

**Change to:**
```typescript
const [activeTab, setActiveTab] = useState<FeedTab>("promoted")
```

**Considerations:**
- Ensure promoted products exist to avoid empty state
- May need fallback to "all" if no promoted products
- Update URL params sync if applicable

---

### 6. Category Circles Ordering
**Priority:** 🟡 HIGH  
**Status:** ⬜ Needs Design Decision

**Problem:** Category circles need consistent ordering

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **A. Alphabetical** | Predictable, easy to implement, works across locales | May not match user intent |
| **B. By listing count** | Shows popular categories first | Changes over time (caching issues), first seller determines order |
| **C. By search volume** | Matches user demand | Requires analytics data we may not have |
| **D. Manual ordering** | Full control, optimized for business | Requires admin UI, maintenance burden |

**Recommendation:** Start with **Option A (Alphabetical)** for launch simplicity, then iterate based on data.

**Files to modify:**
- `components/mobile/category-nav/category-circles.tsx`
- `lib/category-tree.ts` (add sorting utility)
- `components/navigation/category-subheader.tsx`

**Implementation notes:**
- Sort by localized name (BG alphabet differs from EN)
- For subcategories within automotive: same logic applies
- Can later add `display_order` column to `categories` table for manual control

---

### 7. Search Input - White Text Bug
**Priority:** 🟡 HIGH  
**Status:** ⬜ Needs Investigation

**Problem:** Search shows white letters instead of black (user reported)

**Investigation findings:**
- `desktop-search.tsx` line 142 uses `text-foreground` ✅ (should be dark)
- `Input` component uses proper semantic colors ✅
- CSS variables define `--color-foreground: oklch(0.12 0 0)` (nearly black) ✅

**Possible causes:**
1. **Browser-specific rendering** - Test in different browsers
2. **Dark mode incorrectly triggered** - Check if `.dark` class is on `<html>`
3. **Header context override** - Header has white text tokens that might leak
4. **Specific device/screen** - User may be on mobile with different styling

**Files to check:**
- `components/desktop/desktop-search.tsx` (line 128-142)
- `components/shared/search/mobile-search-overlay.tsx`
- `app/globals.css` - header text tokens (lines 131-136)

**Debug steps:**
1. Open DevTools on the search input
2. Check computed `color` value
3. Trace which CSS rule is setting it
4. If it's `--header-text`, the input is inheriting header context incorrectly

**Likely fix:**
```typescript
// Force foreground color explicitly if needed
className="text-foreground bg-background !text-[oklch(0.12_0_0)] ..."
```

Or scope the input outside the header's text context.

---

## 🟢 MEDIUM PRIORITY - UI/UX Polish

### 8. Typography & Styling Audit
**Priority:** 🟢 MEDIUM  
**Status:** ⬜ Not Started

**Problem:** Inconsistent typography across onboarding, product page, sell form

**Design System Reference:** `docs/DESIGN.md`

**Pages to audit:**
1. **Onboarding flow** (`components/auth/post-signup-onboarding-modal.tsx`)
2. **Product page** (`app/[locale]/(product)/...`)
3. **Sell form** (`app/[locale]/(sell)/_components/sell-form-unified.tsx`)

**Typography standards (from globals.css):**
- `text-2xs` (10px) - badges, tiny labels
- `text-xs` (12px) - captions, meta
- `text-sm` (14px) - body text (standard)
- `text-base` (16px) - prices, emphasis
- Headings: `text-lg`, `text-xl`, `text-2xl`

**Checklist:**
- [ ] Remove arbitrary values (`text-[13px]`, `h-[42px]`)
- [ ] Use semantic tokens from `globals.css`
- [ ] Consistent spacing: mobile `gap-2`, desktop `gap-3`
- [ ] No gradients (per design rules)
- [ ] Cards: `border`, `rounded-md` max, no heavy shadows

---

### 9. Location Display for Business Accounts
**Priority:** 🟢 MEDIUM  
**Status:** ⬜ Not Started

**Requirement:** Keep location visible for business accounts even if social links removed

**Files:**
- `app/[locale]/[username]/profile-client.tsx`
- `app/[locale]/(account)/account/profile/public-profile-editor.tsx`

**Logic:**
```typescript
// Always show location for business
const showLocation = profile.account_type === 'business' || profile.location
```

---

## 📋 Task Execution Order

### Sprint 1: Critical Blockers (Day 1)
```
Task 1 (Supabase Auth) → Task 2 (Stripe) → Task 3 (URLs)
```
**Estimated time:** 2-3 hours (mostly dashboard config)

### Sprint 2: Feature Changes (Day 1-2)
```
Task 5 (Homepage tab) → Task 7 (Search bug) → Task 4 (Social links)
```
**Estimated time:** 3-4 hours

### Sprint 3: Design & Polish (Day 2-3)
```
Task 6 (Category ordering) → Task 8 (Typography) → Task 9 (Location)
```
**Estimated time:** 4-6 hours

---

## ✅ Verification Checklist

Before marking production-ready:

- [ ] Email verification works with treido.eu links
- [ ] Stripe checkout completes successfully
- [ ] Webhook events processed correctly
- [ ] Homepage opens on Promoted tab
- [ ] Search input shows black text
- [ ] Category circles are ordered consistently
- [ ] Social links hidden for personal sellers
- [ ] Location shows for business accounts
- [ ] Typography is consistent across key pages

---

## 🔗 Related Documentation

- [MASTER_PLAN.md](./MASTER_PLAN.md) - Overall production plan
- [02-supabase.md](./02-supabase.md) - Supabase configuration
- [09-go-live.md](./09-go-live.md) - Go-live checklist
- [DESIGN.md](../DESIGN.md) - Design system reference

---

## 💡 Post-Launch Iterations

**Category ordering evolution:**
1. Launch with alphabetical
2. Add analytics tracking for category clicks
3. After 2-4 weeks, analyze data
4. Implement dynamic ordering based on popularity
5. Consider admin UI for manual overrides

**Premium features roadmap:**
- Social links for premium (done)
- Boosted listings in promoted tab
- Analytics dashboard for sellers
- Priority customer support
