# Button & Interactive Elements Audit

**Date:** January 28, 2026  
**Scope:** All clickable elements across the Treido mobile application

---

## Summary

| Category | Total Found | Working | Issues |
|----------|------------|---------|--------|
| Navigation Buttons | 25+ | 25+ | 0 |
| CTA Buttons | 15+ | 15+ | 0 |
| Icon Buttons | 40+ | 40+ | 0 |
| Toggle Switches | 5+ | 5+ | 0 |
| Quantity Controls | 6 | 4 | 2 (disabled at max) |
| Form Buttons | 10+ | 8+ | 2 (disabled states) |
| Filter Buttons | 20+ | 20+ | 0 |

---

## Header Buttons

### Logo & Navigation

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| `treido.` logo | Header left | Navigate to homepage | ✅ Working |
| Account link | Header | Navigate to `/account` | ✅ Working |

### Search Controls

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Search button | Search bar | Submit search query | ✅ Working |
| AI Mode toggle | Search bar | Toggle AI search mode | ✅ Working |

### Header Actions

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Wishlist | Header icons | Navigate to wishlist | ✅ Working |
| Messages | Header icons | Navigate to chat | ✅ Working |
| Notifications | Header icons | Navigate to notifications | ✅ Working |
| Create listing | Header icons | Navigate to sell form | ✅ Working |
| Cart | Header icons | Navigate to cart | ✅ Working |

---

## Product Card Buttons

### Interaction Buttons

| Button | Visual | Action | States |
|--------|--------|--------|--------|
| Wishlist (add) | Heart outline | Add to wishlist | Default, Hover |
| Wishlist (remove) | Heart filled | Remove from wishlist | Active |
| Add to Cart | Cart icon | Add item to cart | Default, Hover |
| In Cart | Check icon | Already in cart | Active (non-clickable visual) |
| Product link | Card area | Navigate to PDP | Cursor pointer on hover |

### Badge Elements (Non-interactive)

| Element | Appearance | Purpose |
|---------|------------|---------|
| Promo badge | "Promo" tag | Indicates promoted listing |
| Discount badge | "-21%" format | Shows discount percentage |
| Verification badge | Checkmark | Seller verification |

---

## Product Detail Page Buttons

### Image Gallery

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Share | Image overlay | Open share menu | ✅ Working |
| Enlarge | Image overlay | Open fullscreen viewer | ✅ Working |
| Thumbnail 1 | Below main | Switch to image 1 | ✅ Working |
| Thumbnail 2 | Below main | Switch to image 2 | ✅ Working |

### Product Actions

| Button | Visual | Action | Status |
|--------|--------|--------|--------|
| Add to Watchlist | Bookmark icon | Add to watch list | ✅ Working |
| Share | Share icon | Open share options | ✅ Working |

### Quantity Controls

| Button | Visual | Action | Status |
|--------|--------|--------|--------|
| Decrease (-) | Minus icon | Reduce quantity | ⚠️ Disabled at min |
| Increase (+) | Plus icon | Increase quantity | ✅ Working |

### Primary CTAs

| Button | Visual | Action | Status |
|--------|--------|--------|--------|
| Add to Cart | Cart icon + text | Add item to cart | ✅ Working |
| Buy Now | Lightning icon | Direct checkout | ✅ Working |

### Seller Actions

| Button | Visual | Action | Status |
|--------|--------|--------|--------|
| Message | Chat icon + text | Open chat with seller | ✅ Working |
| View Store | Store icon + text | Navigate to store | ✅ Working |

### Review Section

| Button | Visual | Action | Status |
|--------|--------|--------|--------|
| Write a review | Pencil icon | Open review form | ✅ Working |
| Be the first | Text button | Open review form | ✅ Working |

---

## Cart Page Buttons

### Item Actions

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Delete | Per item | Remove from cart | ✅ Working |
| Decrease qty | Per item | Reduce quantity | ✅ Working |
| Increase qty | Per item | Increase quantity | ⚠️ Disabled at 99 |
| Save for later | Per item | Move to wishlist | ✅ Working |

### Cart Summary

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Proceed to checkout | Summary section | Go to checkout | ✅ Working |

---

## Checkout Page Buttons

### Navigation

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Back to cart | Top left | Return to cart | ✅ Working |
| Edit | Order items | Return to cart | ✅ Working |
| Manage addresses | Address section | Go to address book | ✅ Working |

### Address Selection

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Address card | Address section | Select address | ✅ Working |
| + Use new address | Below addresses | Add new address | ✅ Working |

### Shipping Method

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Standard | Radio option | Select standard | ✅ Working (default) |
| Express | Radio option | Select express | ✅ Working |
| Overnight | Radio option | Select overnight | ✅ Working |

### Primary CTA

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Proceed to Payment | Summary bottom | Go to payment step | ✅ Working |

---

## Account Dashboard Buttons

### Sidebar Navigation

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Overview | Nav list | Go to overview | ✅ Working |
| Orders | Nav list | Go to orders | ✅ Working |
| Wishlist | Nav list | Go to wishlist | ✅ Working |
| Following | Nav list | Go to following | ✅ Working |
| Messages | Nav list | Go to chat | ✅ Working |
| Profile | Settings section | Go to profile | ✅ Working |
| Security | Settings section | Go to security | ✅ Working |
| Addresses | Settings section | Go to addresses | ✅ Working |
| Payments | Settings section | Go to payments | ✅ Working |
| Billing | Settings section | Go to billing | ✅ Working |
| Notifications | Settings section | Go to notifications | ✅ Working |
| Selling | Seller section | Go to selling | ✅ Working |
| Sales | Seller section | Go to sales | ✅ Working |
| View Plans | Upgrade card | Go to plans | ✅ Working |
| Back to Store | Bottom nav | Go to homepage | ✅ Working |

### Main Content

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Toggle sidebar | Header | Open/close sidebar | ✅ Working |
| Account switcher | Sidebar bottom | Switch accounts | ✅ Working |

---

## Authentication Buttons

### Login Page

| Button | Visual | Action | Status |
|--------|--------|--------|--------|
| Sign in | Primary button | Submit login | ⚠️ Disabled until valid |
| Show password | Eye icon | Toggle password visibility | ✅ Working |
| Remember me | Checkbox | Toggle remember | ✅ Working |
| Create account | Secondary button | Go to signup | ✅ Working |

### Forgot Password Link

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Forgot password? | Password field | Go to reset | ✅ Working |

---

## Sell Page Buttons

### Header

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Home | Top left | Return to homepage | ✅ Working |
| Save | Top right | Save draft | ⚠️ Disabled (no changes) |

### Main Content

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Set Up Payouts | Card CTA | Open Stripe Connect | ✅ Working |

---

## Search & Filter Buttons

### Sort Controls

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Sort dropdown | Results header | Change sort order | ✅ Working |
| Price filter | Filter bar | Filter by price | ✅ Working |
| Reviews filter | Filter bar | Filter by rating | ✅ Working |
| Save search | Results header | Save current search | ✅ Working |

### Rating Filters

| Button | Visual | Action | Status |
|--------|--------|--------|--------|
| 4+ stars | Star icons | Filter 4+ ratings | ✅ Working |
| 3+ stars | Star icons | Filter 3+ ratings | ✅ Working |
| 2+ stars | Star icons | Filter 2+ ratings | ✅ Working |
| 1+ stars | Star icons | Filter 1+ ratings | ✅ Working |

### Price Filters

| Button | Visual | Action | Status |
|--------|--------|--------|--------|
| Under $25 | Text | Filter price range | ✅ Working |
| $25 to $50 | Text | Filter price range | ✅ Working |
| $50 to $100 | Text | Filter price range | ✅ Working |
| $100 to $200 | Text | Filter price range | ✅ Working |
| $200 & Above | Text | Filter price range | ✅ Working |

### Category Filters

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Category link | Sidebar | Navigate to category | ✅ Working |
| Expand button | Per category | Show subcategories | ✅ Working |

### Availability

| Button | Visual | Action | Status |
|--------|--------|--------|--------|
| Include Out of Stock | Checkbox | Toggle filter | ✅ Working |

---

## Chat Page Buttons

### Header

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| New message | Header right | Start new conversation | ✅ Working |

### Conversation List

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Conversation card | List item | Select conversation | ✅ Working |
| Search input | List header | Search conversations | ✅ Working |

---

## Footer Buttons

### Main Footer

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Back to top | Footer top | Scroll to top | ✅ Working |
| All footer links | Footer columns | Navigate | ✅ Working |

---

## Categories Page Buttons

### Category Cards

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Category card (×24) | Main content | Navigate to category | ✅ Working |

### Quick Actions

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| Sell Free | Bottom cards | Go to sell form | ✅ Working |
| Deals | Bottom cards | Go to deals | ✅ Working |

---

## Legal Pages Buttons

### Terms of Service

| Button | Location | Action | Status |
|--------|----------|--------|--------|
| TOC links (×12) | Sidebar | Anchor navigation | ✅ Working |
| Accordion toggles | Main content | Expand/collapse | ✅ Working |
| Contact Legal | Card CTA | Go to contact | ✅ Working |
| Email link | Card | Open email client | ✅ Working |
| Related page links | Bottom cards | Navigate | ✅ Working |

---

## View Toggle Buttons

### Homepage Grid

| Button | Visual | Action | Status |
|--------|--------|--------|--------|
| Grid view | Grid icon | Switch to grid | ✅ Working (default) |
| List view | List icon | Switch to list | ✅ Working |

---

## Disabled Button States

| Button | Condition | Visual Feedback |
|--------|-----------|-----------------|
| Sign in | Form invalid | Grayed out, non-clickable |
| Save (sell) | No changes | Grayed out, non-clickable |
| Increase qty | At max (99) | Grayed out, non-clickable |
| Decrease qty | At min (1) | Grayed out, non-clickable |

---

## Touch Target Analysis

### Buttons Meeting 44×44px Minimum

- ✅ Primary CTAs (Add to Cart, Buy Now, Checkout)
- ✅ Navigation links
- ✅ Icon buttons (wishlist, share, etc.)
- ✅ Form buttons

### Potentially Small Targets

- ⚠️ Rating stars in filters (review needed)
- ⚠️ Breadcrumb links (may be tight spacing)
- ⚠️ Footer links (dense layout)

---

## Recommendations

1. **Add loading states** to all async action buttons
2. **Implement hover/focus feedback** consistently
3. **Add confirmation dialogs** for destructive actions (delete)
4. **Improve disabled state messaging** - explain why disabled
5. **Audit touch targets** - ensure all ≥44px
