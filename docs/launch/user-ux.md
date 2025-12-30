# ⭐ User UX (Reviews, Wishlist, Cart UX)

> **Status**: 🔴 60% Complete
> **Priority**: P0

---

## Feature Breakdown

### Reviews & Ratings
| Feature | Status | Notes |
|---------|--------|-------|
| Display product reviews | ✅ | Working |
| Display seller rating | ⚠️ | Shows "0.0" for new sellers |
| **Submit review** | ❌ | **NOT IMPLEMENTED** |
| Edit/delete own review | ❌ | Not implemented |
| Review after purchase | ❌ | Flow not built |

### Wishlist
| Feature | Status | Notes |
|---------|--------|-------|
| Add/remove from wishlist | ✅ | Working |
| Persistent (DB-backed) | ✅ | For logged-in users |
| Shareable wishlists | ✅ | Working |
| Auto-cleanup sold items | ✅ | Working |
| **Guest wishlist UX** | ⚠️ | Toast lacks login button |

### Cart UX
| Feature | Status | Notes |
|---------|--------|-------|
| Guest cart (localStorage) | ✅ | Working |
| Logged-in cart (Supabase) | ✅ | Working |
| Cart merge on login | ✅ | Working |
| Empty cart state | ⚠️ | Needs better CTA |

---

## 🔴 Issues to Fix

### P0 - Launch Blockers
- [ ] **Review submission not implemented** - Users cannot leave reviews
- [ ] **Wishlist login toast** - No "Click to login" button, just text

### P1 - High Priority
- [ ] **New seller rating** - Show "New Seller" badge instead of "0.0"
- [ ] **Review prompt after delivery** - Prompt buyer to review
- [ ] **Cart empty state** - Add "Continue shopping" button
- [ ] **Wishlist remove UX** - Confirm before removing

### P2 - Nice to Have
- [ ] Review with photos
- [ ] Helpful/not helpful votes on reviews
- [ ] Sort reviews by rating/date
- [ ] Wishlist price alerts

---

## 🧪 Test Cases

### Manual QA - Reviews
| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 1 | View product reviews | Reviews displayed with ratings | ⬜ |
| 2 | Submit review after purchase | Review saved, appears on product | ⬜ |
| 3 | View seller rating | Accurate rating or "New Seller" | ⬜ |
| 4 | Try to review without purchase | Prevented or prompted to buy | ⬜ |

### Manual QA - Wishlist
| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 5 | Add to wishlist (logged in) | Heart fills, item in wishlist | ⬜ |
| 6 | Add to wishlist (guest) | Toast with LOGIN BUTTON appears | ⬜ |
| 7 | Remove from wishlist | Item removed, heart empties | ⬜ |
| 8 | View wishlist page | All saved items displayed | ⬜ |
| 9 | Share wishlist | Shareable link works | ⬜ |

### Automated (E2E)
- [e2e/reviews.spec.ts](../../e2e/reviews.spec.ts)

---

## 📁 Key Files

```
# Reviews
app/actions/
└── reviews.ts                     # Review fetching (NO SUBMIT!)

# Wishlist
lib/
└── wishlist-store.ts              # Wishlist state (265 lines)

app/[locale]/(main)/
└── wishlist/page.tsx              # Wishlist page

# Components
components/
├── buyer/
│   └── wishlist-button.tsx        # Heart toggle
└── pricing/
    └── reviews-display.tsx        # Review list
```

---

## 📝 Review Submission Implementation Needed

**This is the biggest gap.** Need to implement:

### 1. Database Table (if not exists)
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  buyer_id UUID REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),  -- Verify purchase
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, buyer_id)  -- One review per product per buyer
);
```

### 2. Server Action
```typescript
// app/actions/reviews.ts - ADD THIS
export async function submitReview(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Must be logged in')
  
  // Verify user purchased this product
  const { data: order } = await supabase
    .from('order_items')
    .select('order_id')
    .eq('product_id', formData.get('productId'))
    .eq('orders.buyer_id', user.id)
    .single()
  
  if (!order) throw new Error('Must purchase to review')
  
  // Submit review
  await supabase.from('reviews').insert({
    product_id: formData.get('productId'),
    buyer_id: user.id,
    order_id: order.order_id,
    rating: formData.get('rating'),
    title: formData.get('title'),
    content: formData.get('content')
  })
}
```

### 3. Review Form Component
Need to build UI for submitting reviews on product page.

---

## 📝 Wishlist Login Toast Fix

Current behavior (broken):
```typescript
// Just shows text toast
toast({ description: 'Please log in to add to wishlist' })
```

Should be:
```typescript
toast({
  description: 'Please log in to add to wishlist',
  action: (
    <ToastAction altText="Login" onClick={() => router.push('/login')}>
      Log in
    </ToastAction>
  )
})
```

File to fix: `components/buyer/wishlist-button.tsx` or equivalent

---

## 📝 New Seller Rating Display

Instead of "0.0 ⭐" for sellers with no reviews:

```typescript
// Before
<span>{seller.rating || 0} ⭐</span>

// After
{seller.review_count > 0 ? (
  <span>{seller.rating} ⭐ ({seller.review_count} reviews)</span>
) : (
  <Badge variant="secondary">New Seller</Badge>
)}
```

---

## 🎯 Acceptance Criteria for Launch

### Reviews
- [ ] Users can submit reviews after purchase
- [ ] Reviews display on product page
- [ ] Seller ratings calculated correctly
- [ ] New sellers show "New Seller" badge

### Wishlist
- [ ] Add to wishlist works (logged in)
- [ ] Guest users see toast WITH login button
- [ ] Wishlist page displays all items
- [ ] Can remove items from wishlist

### Cart
- [ ] Empty cart has clear CTA
- [ ] Guest cart persists
- [ ] Cart merges on login
