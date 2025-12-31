# 🚨 Production Readiness Fix Plan

> **Based on:** audit1.md + audit2.md (Playwright Browser Automation)  
> **Created:** December 30, 2025  
> **Updated:** December 30, 2025  
> **Target:** EU Market Launch Ready  
> **Current Status:** ✅ 8/9 COMPLETE - 1 P1 remaining (Cart loading)

---

## Executive Summary

Two comprehensive browser audits identified **9 actionable issues** blocking production launch. This document provides exact file locations, code changes, and implementation steps for each fix.

### Priority Overview

| Priority | Count | Description | Est. Time |
|----------|-------|-------------|-----------|
| **P0** | 5 | Launch blockers - must fix | 6-8 hours |
| **P1** | 4 | High priority - quality launch | 4-6 hours |
| **Total** | 9 | | 10-14 hours |

---

## 🔴 P0 - LAUNCH BLOCKERS (Must Fix)

### P0-1: Currency Hardcoded to USD Instead of EUR

**Status:** ❌ Critical - Legal/Compliance Issue  
**Impact:** EU customers charged in wrong currency  
**Complexity:** 🟢 Low (1 line change)  
**Time:** 5 minutes

#### Location
```
app/[locale]/(checkout)/_actions/checkout.ts
Line 42
```

#### Current Code
```typescript
currency: "usd",
```

#### Fix
```typescript
currency: "eur",
```

#### Verification
1. Add item to cart
2. Proceed to checkout
3. Verify Stripe session shows EUR currency

---

### P0-2: Wishlist Toast Missing for Guests (No Feedback)

**Status:** ❌ Critical - UX Broken  
**Impact:** Guests click wishlist, nothing happens - confusing  
**Complexity:** 🟡 Medium  
**Time:** 30 minutes

#### Location
```
components/providers/wishlist-context.tsx
Lines 158-161 (addToWishlist function)
```

#### Current Code (Line 158-161)
```typescript
if (!userId) {
  toast.error(t.signInRequired)
  return
}
```

#### Issue
The toast shows but has no action button. Audit2 reports NO toast appears at all - possibly a render issue.

#### Fix
```typescript
import { useRouter } from "next/navigation"

// Inside WishlistProvider component:
const router = useRouter?.() // Optional since this is a provider

if (!userId) {
  toast.error(t.signInRequired, {
    action: {
      label: locale === "bg" ? "Вход" : "Sign In",
      onClick: () => {
        // Use window.location for providers without router context
        window.location.href = `/${getLocale()}/auth/login`
      }
    },
    duration: 5000,
  })
  return
}
```

#### Alternative Fix (if sonner doesn't support action in toast.error)
```typescript
import { toast } from "sonner"

if (!userId) {
  toast(t.signInRequired, {
    action: {
      label: locale === "bg" ? "Вход" : "Sign In",
      onClick: () => window.location.href = `/${getLocale()}/auth/login`
    },
    duration: 5000,
  })
  return
}
```

#### Verification
1. Open product page as guest (not logged in)
2. Click wishlist/heart button
3. Toast should appear with "Sign In" button
4. Clicking button should redirect to login page

---

### P0-3: Seller Rating Shows "0.0" Instead of "New Seller"

**Status:** ❌ Critical - Trust Issue  
**Impact:** New sellers appear untrustworthy with "0.0" rating  
**Complexity:** 🟡 Medium  
**Time:** 45 minutes

#### Locations (2 files to fix)
1. `components/mobile/product/mobile-seller-trust-line.tsx`
2. Desktop equivalent (product-page-layout.tsx seller section)

#### Current Code (mobile-seller-trust-line.tsx, lines 31-38)
```typescript
// Format rating display
const displayRating = rating != null 
  ? typeof rating === "number" 
    ? rating.toFixed(1) 
    : rating 
  : null;
```

#### Fix
```typescript
// Format rating display - show "New Seller" for 0 rating
const hasRating = rating != null && Number(rating) > 0;
const displayRating = hasRating
  ? typeof rating === "number" 
    ? rating.toFixed(1) 
    : rating 
  : null;

const isNewSeller = !hasRating;
```

#### Update JSX (lines 69-75)
```typescript
{/* Replace rating display section */}
<div className="flex items-center gap-2">
  {isNewSeller ? (
    <span className="text-tiny font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
      {locale === "bg" ? "Нов продавач" : "New Seller"}
    </span>
  ) : (
    <>
      {displayRating && (
        <div className="flex items-center gap-0.5 shrink-0">
          <Star className="size-3 fill-rating text-rating" />
          <span className="text-tiny font-medium text-foreground">{displayRating}</span>
        </div>
      )}
      {displayPositive && (
        <span className="text-tiny text-muted-foreground">
          {displayPositive} {t.positive}
        </span>
      )}
    </>
  )}
</div>
```

#### Verification
1. Find a product from a seller with no reviews
2. Check product page - should show "New Seller" badge
3. Verify seller with reviews still shows rating correctly

---

### P0-4: Review Submission NOT IMPLEMENTED

**Status:** ❌ Critical - Core Feature Missing  
**Impact:** Users cannot leave reviews - marketplace cannot build trust  
**Complexity:** 🔴 High  
**Time:** 2-3 hours

#### Files to Create/Modify
1. **CREATE:** `app/actions/reviews.ts` - Server action
2. **MODIFY:** Product page - Add review form
3. **VERIFY:** Database schema exists (confirmed in migrations)

#### Implementation: app/actions/reviews.ts

```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface SubmitReviewInput {
  productId: string
  rating: number
  title?: string
  comment?: string
}

interface ReviewResult {
  success: boolean
  error?: string
  review?: {
    id: string
    rating: number
    comment: string | null
    created_at: string
  }
}

export async function submitReview(input: SubmitReviewInput): Promise<ReviewResult> {
  const supabase = await createClient()
  
  // 1. Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "You must be logged in to leave a review" }
  }

  // 2. Validate rating
  if (!input.rating || input.rating < 1 || input.rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5" }
  }

  // 3. Verify user purchased this product (optional but recommended)
  const { data: purchase } = await supabase
    .from("order_items")
    .select(`
      id,
      order:orders!inner(buyer_id, status)
    `)
    .eq("product_id", input.productId)
    .eq("orders.buyer_id", user.id)
    .in("orders.status", ["delivered", "completed"])
    .limit(1)
    .maybeSingle()

  // For now, allow reviews without purchase verification
  // Uncomment below to require purchase:
  // if (!purchase) {
  //   return { success: false, error: "You must purchase this product before reviewing" }
  // }

  // 4. Check if user already reviewed this product
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", input.productId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existingReview) {
    return { success: false, error: "You have already reviewed this product" }
  }

  // 5. Insert the review
  const { data: review, error: insertError } = await supabase
    .from("reviews")
    .insert({
      product_id: input.productId,
      user_id: user.id,
      rating: input.rating,
      comment: input.comment || null,
    })
    .select("id, rating, comment, created_at")
    .single()

  if (insertError) {
    console.error("Error inserting review:", insertError)
    return { success: false, error: "Failed to submit review. Please try again." }
  }

  // 6. Update product rating aggregate (trigger should handle this, but backup)
  // The database trigger in 20251214100000_reviews_feedback_system.sql handles this

  // 7. Revalidate the product page
  revalidatePath(`/[locale]/product/${input.productId}`)

  return { 
    success: true, 
    review: review 
  }
}

export async function getProductReviews(productId: string) {
  const supabase = await createClient()
  
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      user:profiles!reviews_user_id_fkey(
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return reviews
}

export async function canUserReview(productId: string): Promise<{ canReview: boolean; reason?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { canReview: false, reason: "login_required" }
  }

  // Check if already reviewed
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existingReview) {
    return { canReview: false, reason: "already_reviewed" }
  }

  return { canReview: true }
}
```

#### Review Form Component (Brief Spec)
- Add "Write a Review" button to `CustomerReviewsHybrid` component
- Open modal/dialog with star rating selector
- Optional title and comment fields
- Submit calls `submitReview` action
- Show success/error toast

#### Verification
1. Log in as a user
2. Navigate to a product page
3. Click "Write a Review" button
4. Select star rating, write comment
5. Submit - review should appear in list
6. Try to submit again - should show "already reviewed" error

---

### P0-5: Sell Page Blank for Guests

**Status:** ❌ Critical - Lost Conversions  
**Impact:** Potential sellers see blank page, leave  
**Complexity:** 🟢 Low (component exists but may not render)  
**Time:** 30 minutes

#### Location
```
app/[locale]/(sell)/sell/client.tsx
app/[locale]/(sell)/_components/sign-in-prompt.tsx
```

#### Current Issue
The `SignInPrompt` component EXISTS and looks great, but the page shows blank. Possible causes:
1. `isAuthChecking` stays true (loading state stuck)
2. Server-side props not passing `initialUser: null` correctly

#### Debug Steps
1. Check if `isAuthChecking` timeout (2000ms) is firing
2. Verify `SellFormSkeleton` vs `SignInPrompt` render conditions

#### Fix (if isAuthChecking stuck)
```typescript
// In SellPageClient, line 64-65:
// If no initialUser, immediately show SignInPrompt without auth check
useEffect(() => {
  if (!initialUser) {
    setIsAuthChecking(false)
    return
  }
  // ... rest of auth state listener
}, [initialUser, seller])
```

#### Alternative: Force show SignInPrompt for guests
```typescript
// Line 116-127: Simplify condition
if (isAuthChecking && !initialUser) {
  // Don't show skeleton for guests, show prompt immediately
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SellHeader />
      <div className="flex-1 flex flex-col justify-center overflow-y-auto">
        <SignInPrompt />
      </div>
    </div>
  )
}
```

#### Verification
1. Log out completely
2. Navigate to `/en/sell`
3. Should see "Turn your items into instant cash" hero
4. Should see "Start Selling" and "Create Free Account" buttons

---

## 🟠 P1 - HIGH PRIORITY (Quality Launch)

### P1-1: EU Compliance - Missing ODR Link

**Status:** ⚠️ Legal Requirement  
**Location:** `components/layout/footer/site-footer.tsx`  
**Time:** 15 minutes

#### Fix
Add to `legalLinks` array:
```typescript
const legalLinks = [
  { label: t('terms'), href: '/terms' },
  { label: t('privacy'), href: '/privacy' },
  { label: t('cookies'), href: '/cookies' },
  // ADD THIS:
  { 
    label: locale === "bg" ? "Онлайн решаване на спорове" : "Online Dispute Resolution",
    href: "https://ec.europa.eu/consumers/odr"
  },
]
```

Also add to translation files:
```json
// messages/en.json - Footer section
"odr": "Online Dispute Resolution"

// messages/bg.json - Footer section
"odr": "Онлайн решаване на спорове"
```

---

### P1-2: EU Compliance - Missing Company Info

**Status:** ⚠️ Legal Requirement  
**Location:** Footer copyright section  
**Time:** 15 minutes

#### Fix
Add company registration info above copyright:
```tsx
{/* Company Info - Required for EU */}
<p className="text-xs text-primary-foreground/70 text-center mb-2">
  Treido Ltd. • 123 Sample Street, Sofia, Bulgaria • 
  Company Reg: BG123456789 • VAT: BG123456789
</p>

{/* Copyright */}
<p className="text-xs text-primary-foreground/80 text-center">
  {t('copyright', { year: currentYear })}
</p>
```

---

### P1-3: EU Compliance - No VAT Indicator on Prices

**Status:** ⚠️ Legal Requirement  
**Time:** 1-2 hours (multiple components)

#### Locations
- Product cards
- Product detail page
- Cart
- Checkout

#### Fix Pattern
```typescript
// After price display, add:
<span className="text-xs text-muted-foreground ml-1">
  {locale === "bg" ? "с ДДС" : "incl. VAT"}
</span>
```

Or modify price formatter:
```typescript
const formatPrice = (price: number, includeVat = true) => {
  const formatted = new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(price)
  
  return includeVat 
    ? `${formatted} ${locale === "bg" ? "с ДДС" : "incl. VAT"}`
    : formatted
}
```

---

### P1-4: Cart Page Loading State Issue

**Status:** ⚠️ Audit reported stuck loading  
**Location:** `app/[locale]/(main)/cart/_components/cart-page-client.tsx`  
**Time:** 30 minutes

#### Issue
Audit2 reported cart shows "Loading cart..." indefinitely.

#### Likely Cause
`mounted` state never becomes true, or `useCart` hook has SSR mismatch.

#### Fix
The component already has `mounted` state protection (lines 30-33). Check if the issue is:
1. localStorage access failing silently
2. Hydration mismatch

Add error boundary:
```typescript
useEffect(() => {
  try {
    setMounted(true)
  } catch (error) {
    console.error("Cart mount error:", error)
    setMounted(true) // Force mount anyway
  }
}, [])
```

---

## 📋 Implementation Order

### Day 1 (4 hours)
1. ✅ P0-1: Currency fix (5 min) - DONE
2. ✅ P0-2: Wishlist toast (30 min) - DONE
3. ✅ P0-3: Seller rating (45 min) - DONE
4. ✅ P0-5: Sell page fix (30 min) - DONE
5. ✅ P1-1: ODR link (15 min) - DONE
6. ✅ P1-2: Company info (15 min) - DONE

### Day 2 (4-6 hours)
1. ✅ P0-4: Reviews implementation (2-3 hours) - DONE
2. ✅ P1-3: VAT indicators (1-2 hours) - DONE
3. 🔨 P1-4: Cart loading (30 min)

### Day 3 (Testing)
1. Run full E2E test suite
2. Manual browser verification
3. Mobile testing
4. Cross-locale testing (EN + BG)

---

## 🧪 Verification Checklist

### P0 Fixes
- [ ] Checkout creates EUR Stripe session
- [ ] Guest wishlist click shows toast with login button
- [ ] New sellers show "New Seller" badge
- [ ] Reviews can be submitted by logged-in users
- [ ] /sell page shows sign-in prompt for guests

### P1 Fixes
- [ ] Footer has ODR link
- [ ] Footer shows company registration
- [ ] Prices show "incl. VAT"
- [ ] Cart page loads without getting stuck

### E2E Test Updates Needed
- [ ] `e2e/reviews.spec.ts` - Add submission test
- [ ] `e2e/smoke.spec.ts` - Add wishlist guest test
- [ ] `e2e/seller-routes.spec.ts` - Verify new seller badge

---

## Files Changed Summary

| File | Change Type | Priority |
|------|-------------|----------|
| `app/[locale]/(checkout)/_actions/checkout.ts` | Modify | P0 |
| `components/providers/wishlist-context.tsx` | Modify | P0 |
| `components/mobile/product/mobile-seller-trust-line.tsx` | Modify | P0 |
| `app/actions/reviews.ts` | **CREATE** | P0 |
| `app/[locale]/(sell)/sell/client.tsx` | Modify | P0 |
| `components/layout/footer/site-footer.tsx` | Modify | P1 |
| `messages/en.json` | Modify | P1 |
| `messages/bg.json` | Modify | P1 |
| `lib/format-price.ts` (or equivalent) | Modify | P1 |

---

## Next Steps

1. **Start with P0-1** (currency) - immediate 1-line fix
2. **Batch P0-2, P0-3, P0-5** - quick UI fixes
3. **Dedicate focused time to P0-4** (reviews) - largest item
4. **Run typecheck** after each batch: `pnpm -s exec tsc -p tsconfig.json --noEmit`
5. **Re-run audit** with Playwright after all fixes
6. **Update LAUNCH_PAD.md** status after verification

---

*Document generated from audit1.md and audit2.md analysis*
