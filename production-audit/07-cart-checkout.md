# Phase 7: Cart & Checkout

> Validate the full cart-to-payment flow on mobile — cart drawer interactions, full cart page with quantity controls and sticky footer, checkout flow with address/shipping/payment sections, Stripe hosted checkout redirect, order confirmation, and cart badge accuracy.

| Field | Value |
|-------|-------|
| **Scope** | Cart drawer, full cart page, checkout flow (3 steps), Stripe hosted checkout redirect, success/confirmation page, cart badge |
| **Routes** | `/cart`, `/checkout`, `/checkout/success` |
| **Priority** | P0 |
| **Dependencies** | Phase 1 (Shell), Phase 6 (PDP — adds items to cart) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | No (guest checkout supported; auth gate shown at checkout for payment) |
| **Status** | 📝 Planned |

---

## Source Files

| File | Role |
|------|------|
| `app/[locale]/(main)/cart/page.tsx` | Cart page route |
| `app/[locale]/(main)/cart/_components/cart-page-client.tsx` | `CartPageClient` — full cart page with items, summary, mobile sticky footer |
| `components/mobile/drawers/cart-drawer.tsx` | `CartDrawer` — mobile slide-up drawer with item list, quantity controls, checkout CTA |
| `components/layout/header/cart/mobile-cart-dropdown.tsx` | `MobileCartDropdown` — header cart icon with `CountBadge`, opens drawer or navigates to `/cart` |
| `components/shared/count-badge.tsx` | `CountBadge` — badge with `data-slot="count-badge"` |
| `app/[locale]/(checkout)/layout.tsx` | `CheckoutLayout` — minimal chrome with `CheckoutHeader` + `CheckoutFooter` |
| `app/[locale]/(checkout)/checkout/page.tsx` | Checkout page route |
| `app/[locale]/(checkout)/_components/checkout-page-client.tsx` | `CheckoutPageClient` — address, shipping, order items, summary, payment CTA |
| `app/[locale]/(checkout)/_components/checkout-header.tsx` | `CheckoutHeader` — 3-step progress (shipping → payment → review), mobile dots |
| `app/[locale]/(checkout)/_components/checkout-footer.tsx` | `CheckoutFooter` |
| `app/[locale]/(checkout)/_components/address-section.tsx` | `AddressSection` — saved + new address forms |
| `app/[locale]/(checkout)/_components/shipping-method-section.tsx` | `ShippingMethodSection` — standard/express picker |
| `app/[locale]/(checkout)/_components/order-items-section.tsx` | `OrderItemsSection` / `OrderItemsSectionDesktop` |
| `app/[locale]/(checkout)/_components/checkout-types.ts` | Types + `SHIPPING_COSTS` |
| `app/[locale]/(checkout)/checkout/success/page.tsx` | Success page route |
| `app/[locale]/(checkout)/_components/checkout-success-page-client.tsx` | `CheckoutSuccessPageClient` — order confirmation with `orderId` |

---

## Prerequisites

| # | Condition | How to verify |
|---|-----------|---------------|
| 1 | Phase 1 (Shell) passes — tab bar, StorefrontShell render | Phase 1 audit green |
| 2 | Device viewport set to Pixel 5 (393×851) or iPhone 12 (390×844) | Playwright `use: { viewport }` |
| 3 | Locale set to `en` | URL prefix `/en/` |
| 4 | At least one product exists and can be added to cart | Seed data / known PDP route |
| 5 | Cart has ≥ 1 item (for cart/checkout scenarios) | Add via PDP "Add to Cart" or localStorage injection |
| 6 | Cart is empty (for empty-state scenario S7.8) | Clear localStorage `cart` key |

---

## Routes Under Test

| Route | Description | Auth |
|-------|-------------|------|
| `/en/cart` | Full cart page — item list, summary, sticky footer | Public |
| `/en/checkout` | Checkout page — address, shipping, items, payment CTA | Public (auth gate at payment) |
| `/en/checkout/success?session_id=…` | Order confirmation — verifies Stripe session | Public |

---

## Known Bugs

| ID | Summary | Severity | Status |
|----|---------|----------|--------|
| LAUNCH-006 | Cart badge count doesn't match server truth — client/server desync | P1 | Open |

---

## Scenarios

### S7.1 — Cart drawer opens from header cart icon

**Goal:** Verify tapping the cart icon in the mobile header opens the cart drawer via `MobileCartDropdown` → `useDrawer().openCart()`.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en` (home) with ≥ 1 item in cart | `await page.goto('/en')` |
| 2 | Locate the cart button in the mobile header | `page.getByRole('button', { name: /cart/i })` — the `MobileCartDropdown` button with `touch-manipulation` |
| 3 | Tap the cart button | `await cartButton.tap()` |
| 4 | Wait for drawer to appear | `await expect(page.locator('[data-vaul-drawer]')).toBeVisible()` |
| 5 | Assert drawer header shows cart title and item count | `DrawerTitle` text matches i18n `CartDropdown.title`, count in parentheses `(N)` |
| 6 | Assert close button is visible | `page.getByRole('button', { name: /close/i })` — `DrawerClose` with `X` icon |
| 7 | 📸 Screenshot | `cart-drawer-open` |

**Expected:**
- Cart drawer slides up from the bottom with Vaul animation.
- Header shows cart icon with item count, title and close button.
- Drawer content is scrollable if items exceed viewport.

---

### S7.2 — Cart drawer displays items with image, title, price, quantity

**Goal:** Verify each cart item in the drawer renders image, title, price, variant name, and quantity controls.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Open cart drawer (S7.1 steps 1-4) | Drawer visible with ≥ 1 item |
| 2 | Locate first cart item row | `page.locator('[data-vaul-drawer] .flex.gap-2').first()` |
| 3 | Assert item image is visible | Image container: `div.size-14.bg-muted.rounded-xl.overflow-hidden.border.border-border` with `<img>` inside |
| 4 | Assert item title is visible | Link with `text-sm text-foreground` and `line-clamp-2` |
| 5 | Assert item price is visible | `span.text-sm.font-semibold.tabular-nums` |
| 6 | Assert quantity display is visible | `span.min-w-touch.text-sm.font-medium.tabular-nums` showing quantity number |
| 7 | Assert minus button is visible | `page.getByRole('button', { name: /decrease/i })` — `IconButton` with `Minus` icon |
| 8 | Assert plus button is visible | `page.getByRole('button', { name: /increase/i })` — `IconButton` with `Plus` icon |
| 9 | Assert remove button is visible | `page.getByRole('button', { name: /remove/i })` — `IconButton` with `Trash` icon |
| 10 | 📸 Screenshot | `cart-drawer-item-details` |

**Expected:**
- Each item shows a 56×56 image in a rounded container (`size-14 rounded-xl`).
- Title is a tappable link to the PDP (`line-clamp-2`).
- Price formatted as EUR with `tabular-nums`.
- Quantity controls (−, count, +) and delete button are all visible.

---

### S7.3 — Cart drawer quantity controls work (data-vaul-no-drag)

**Goal:** Verify quantity +/− buttons work without triggering drawer drag (they have `data-vaul-no-drag`).

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Open cart drawer with ≥ 1 item at quantity 1 | S7.1 steps 1-4 |
| 2 | Note current quantity | Read `span.min-w-touch.text-sm.font-medium.tabular-nums` text — expect `1` |
| 3 | Tap the plus (+) button | `await page.getByRole('button', { name: /increase/i }).first().tap()` |
| 4 | Assert quantity incremented | Expect span text = `2` |
| 5 | Assert drawer is still open (not dismissed by drag) | `await expect(page.locator('[data-vaul-drawer]')).toBeVisible()` |
| 6 | Tap the minus (−) button | `await page.getByRole('button', { name: /decrease/i }).first().tap()` |
| 7 | Assert quantity decremented | Expect span text = `1` |
| 8 | Assert `data-vaul-no-drag` attribute on both buttons | `await expect(plusBtn).toHaveAttribute('data-vaul-no-drag', '')` |
| 9 | 📸 Screenshot | `cart-drawer-quantity-changed` |

**Expected:**
- Tapping +/− changes the quantity number.
- Drawer remains open — `data-vaul-no-drag` prevents accidental dismiss.
- Subtotal in the footer updates to reflect new quantity.

---

### S7.4 — Cart drawer remove item

**Goal:** Verify the Trash button removes an item from the cart drawer.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Open cart drawer with ≥ 1 item | S7.1 steps 1-4 |
| 2 | Count items before removal | `const itemsBefore = await page.locator('[data-vaul-drawer] .flex.gap-2.py-2').count()` |
| 3 | Tap the remove (Trash) button on the first item | `await page.getByRole('button', { name: /remove/i }).first().tap()` |
| 4 | Wait for item to be removed | `await expect(page.locator('[data-vaul-drawer] .flex.gap-2.py-2')).toHaveCount(itemsBefore - 1)` |
| 5 | If last item removed, assert empty state appears | Empty state: `ShoppingCart` icon + empty message text |
| 6 | 📸 Screenshot | `cart-drawer-item-removed` |

**Expected:**
- Item disappears from the list.
- Subtotal recalculates.
- If cart is now empty, shows empty state with icon, message, and "Start Shopping" CTA.

---

### S7.5 — Cart drawer "View Cart" navigates to /cart

**Goal:** Verify the "View Cart" button in the drawer footer navigates to the full cart page.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Open cart drawer with ≥ 1 item | S7.1 steps 1-4 |
| 2 | Assert footer shows subtotal and two CTAs | Footer: `DrawerFooter.border-t.border-border` with subtotal, checkout button, and "View Cart" button |
| 3 | Locate "View Cart" button | `page.locator('[data-vaul-drawer]').getByRole('link', { name: /view cart/i })` — `Button variant="outline" size="sm"` linked to `/cart` |
| 4 | Tap "View Cart" | `await viewCartLink.tap()` |
| 5 | Wait for navigation | `await page.waitForURL('**/cart')` |
| 6 | Assert cart page renders | `await expect(page.locator('h1')).toContainText(/cart/i)` |
| 7 | 📸 Screenshot | `cart-page-from-drawer` |

**Expected:**
- Drawer closes on navigation.
- URL changes to `/en/cart`.
- Full cart page renders with items matching drawer state.

---

### S7.6 — Cart page: item list, summary, mobile sticky footer

**Goal:** Verify the full cart page renders items with quantity controls, order summary, and a fixed bottom CTA on mobile.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/cart` with ≥ 1 item | `await page.goto('/en/cart')` |
| 2 | Wait for cart to render | `await page.waitForSelector('.bg-card.rounded-lg.border')` |
| 3 | Assert page title visible | `h1` with cart title text |
| 4 | Assert item count subtitle | Text showing `N item(s)` |
| 5 | Assert first item card structure | Container: `bg-card rounded-lg border border-border/50 p-2.5` |
| 6 | Assert item image | Link wrapping `relative shrink-0 size-20 bg-background rounded-md overflow-hidden border border-border/50` — 80×80 container |
| 7 | Assert item title is a link | `font-medium hover:text-primary line-clamp-2 text-sm leading-snug` |
| 8 | Assert "In Stock" badge | `CheckCircle` icon + `text-2xs text-success` |
| 9 | Assert quantity selector | `div.flex.items-center.h-touch-lg.rounded-xl.border.border-border.bg-surface-subtle.overflow-hidden` with −, count, + |
| 10 | Assert delete (Trash) button | `IconButton` with `aria-label` matching `delete` translation |
| 11 | Assert wishlist (Heart) button | `IconButton` with `aria-label` matching `saveForLater` translation |
| 12 | Assert mobile sticky footer is visible | `div.fixed.bottom-0.inset-x-0.bg-background.border-t.border-border.z-40` (hidden on `lg:`) |
| 13 | Assert footer shows total and checkout CTA | Total price + `Button variant="cta"` with `ArrowRight` icon |
| 14 | Assert desktop sidebar is hidden on mobile | `div.hidden.lg\\:block` should not be visible |
| 15 | 📸 Screenshot | `cart-page-full` |

**Expected:**
- Items render in `bg-card` cards with 80px images, title links, stock badge, price, quantity selector, delete, and wishlist buttons.
- Quantity selector uses `h-touch-lg` (48px) touch targets in a rounded container.
- Mobile sticky footer is fixed at bottom with `pb-safe` for safe-area inset.
- Footer shows total price and a "Checkout" CTA button.
- Desktop order summary sidebar (`hidden lg:block`) is not visible on mobile.

---

### S7.7 — Cart badge count accuracy (LAUNCH-006 verification)

**Goal:** Verify the header cart badge (`CountBadge`) count matches the actual number of items in the cart. Cross-reference LAUNCH-006.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en` with known cart state (e.g. 2 items) | `await page.goto('/en')` |
| 2 | Locate the cart badge | `page.locator('[data-slot="count-badge"]')` |
| 3 | Assert badge is visible | `await expect(badge).toBeVisible()` |
| 4 | Assert badge text matches expected count | `await expect(badge).toHaveText('2')` |
| 5 | Assert badge styling | CSS: `absolute -top-1 -right-1 h-4 min-w-4 bg-cart-badge px-1 text-2xs leading-none text-primary-foreground ring-1 ring-header-bg` |
| 6 | Navigate to `/en/cart` | `await page.goto('/en/cart')` |
| 7 | Count items on cart page | `const pageItemCount = await page.locator('.bg-card.rounded-lg.border.border-border\\/50').count()` |
| 8 | Navigate back to `/en` | `await page.goto('/en')` |
| 9 | Assert badge count equals page item count | Badge text === `String(pageItemCount)` |
| 10 | 📸 Screenshot | `cart-badge-count` |

**Expected:**
- `CountBadge` renders with `data-slot="count-badge"`.
- Count matches items on the cart page.
- Badge uses `bg-cart-badge` theme token and `ring-1 ring-header-bg` outline.
- **LAUNCH-006 check:** If badge count ≠ server truth, document as confirmed bug.

---

### S7.8 — Empty cart state with CTA

**Goal:** Verify the empty cart page shows a friendly empty state with navigation CTAs.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Clear cart (remove all items or clear localStorage) | Ensure cart is empty |
| 2 | Navigate to `/en/cart` | `await page.goto('/en/cart')` |
| 3 | Wait for cart ready state | `await page.waitForSelector('.size-24')` — the large empty-state icon |
| 4 | Assert empty state icon | `div.size-24.bg-surface-subtle.rounded-full` with `ShoppingCart` icon inside |
| 5 | Assert empty title | `h1.text-2xl.font-semibold` with `emptyTitle` translation |
| 6 | Assert empty description | `p.text-muted-foreground` |
| 7 | Assert "Continue Shopping" CTA | `page.getByRole('link', { name: /continue shopping/i })` — `Button size="lg" className="rounded-full h-12"` linking to `/` |
| 8 | Assert "View Deals" CTA | `page.getByRole('link', { name: /deals/i })` — `Button variant="outline" size="lg" className="rounded-full h-12"` linking to `/todays-deals` |
| 9 | Assert mobile sticky footer is NOT visible | No fixed-bottom checkout bar when cart is empty |
| 10 | 📸 Screenshot | `cart-empty-state` |

**Expected:**
- Large duotone shopping cart icon (96px circle) centered on page.
- Title and description text below the icon.
- Two CTAs: primary "Continue Shopping" and outline "View Deals", both `h-12 rounded-full`.
- Recently viewed products section may appear below if user has browsing history.
- No sticky footer when cart is empty.

---

### S7.9 — Checkout page: 3-step progress indicator (mobile dots)

**Goal:** Verify the checkout header renders the mobile 3-step progress indicator as colored dots.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/checkout` with ≥ 1 item | `await page.goto('/en/checkout')` |
| 2 | Wait for checkout header | `await page.waitForSelector('header.sticky.top-0')` |
| 3 | Assert header height | `h-11` on mobile (44px) |
| 4 | Assert Treido logo link | `page.getByRole('link', { name: /back to home/i })` with `ShoppingCart` icon + "Treido" text |
| 5 | Assert mobile progress dots are visible | `page.locator('.md\\:hidden .flex.gap-1')` — 3 dots |
| 6 | Assert each dot is `h-1 w-6 rounded-full` | All 3 dot divs match sizing |
| 7 | Assert step 1 dot is filled (primary) | First dot: `bg-primary` (active step) |
| 8 | Assert steps 2-3 dots are unfilled | Remaining dots: `bg-muted` |
| 9 | Assert desktop step circles are hidden on mobile | `nav.hidden.md\\:flex` should not be visible |
| 10 | Assert secure badge | `Lock` icon with `text-success` |
| 11 | 📸 Screenshot | `checkout-progress-mobile` |

**Expected:**
- Checkout header is sticky at top (`sticky top-0 z-50`).
- Mobile shows 3 horizontal dots (each `h-1 w-6 rounded-full`), first filled with `bg-primary`.
- Desktop step circles with labels (`hidden md:flex`) are not visible on mobile.
- Secure lock badge in the right corner.

---

### S7.10 — Checkout: address section renders

**Goal:** Verify the address section renders on the checkout page with either saved addresses or a new address form.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/checkout` with ≥ 1 item | `await page.goto('/en/checkout')` |
| 2 | Wait for mobile checkout layout | `await page.waitForSelector('.lg\\:hidden')` |
| 3 | Locate the address card | Card with `MapPin` icon and "Shipping Address" title text |
| 4 | Assert card header is visible | `CardTitle` with `MapPin` icon + shipping address text |
| 5 | If authenticated with saved addresses: assert address selector | Saved address radio buttons or list |
| 6 | If no saved addresses or guest: assert new address form | Input fields for first name, last name, address, city, state, zip |
| 7 | Assert form fields have proper labels/placeholders | Each input accessible |
| 8 | 📸 Screenshot | `checkout-address-section` |

**Expected:**
- Address section renders inside a `Card` with `MapPin` icon header.
- For authenticated users: saved address list with selection or "Manage Addresses" link.
- For guests/new users: new address form with 6 fields (firstName, lastName, address, city, state, zip).
- "Manage Addresses" link visible for authenticated users linking to `/account/addresses`.

---

### S7.11 — Checkout: shipping method selection

**Goal:** Verify the shipping method section allows selecting between standard and express shipping.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/checkout` with ≥ 1 item | `await page.goto('/en/checkout')` |
| 2 | Locate shipping method card | Card with `Truck` icon and "Shipping Method" title text |
| 3 | Assert card header | `CardTitle` with `Truck` icon |
| 4 | Assert at least 2 shipping options visible | Standard and Express methods from `SHIPPING_COSTS` |
| 5 | Assert standard shipping is selected by default | `shippingMethod` state defaults to `"standard"` |
| 6 | Tap express shipping option | Select the express radio/button |
| 7 | Assert express is now selected | Visual selection indicator updates |
| 8 | Assert order summary reflects updated shipping cost | Shipping line in summary card changes from "Free" to the express price |
| 9 | 📸 Screenshot | `checkout-shipping-method` |

**Expected:**
- Shipping method card shows with `Truck` icon header.
- `ShippingMethodSection` renders in compact mode on mobile (`compact` prop).
- Standard is pre-selected; tapping express updates the selection.
- Summary card shipping line updates to reflect the chosen method cost.

---

### S7.12 — Checkout: "Proceed to Payment" triggers Stripe hosted redirect

**Goal:** Verify the checkout CTA calls `createCheckoutSessionAction` and redirects to Stripe's hosted checkout page. Note: actual Stripe redirect may fail in test environment — verify the action is triggered.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/checkout` with ≥ 1 item, authenticated | `await page.goto('/en/checkout')` |
| 2 | Fill required address fields (if new address form shown) | Fill firstName, lastName, address, city, state, zip |
| 3 | Locate the mobile sticky footer CTA | `div.lg\\:hidden.fixed.inset-x-0.bottom-0` → `Button` with `Lock` icon + "Complete Order · €X.XX" text |
| 4 | Assert CTA is enabled | `await expect(ctaButton).toBeEnabled()` |
| 5 | Set up route intercept for Stripe | `await page.route('**/api/checkout/**', route => route.fulfill({ status: 200, body: JSON.stringify({ ok: true, url: 'https://checkout.stripe.com/test' }) }))` |
| 6 | Tap the CTA button | `await ctaButton.tap()` |
| 7 | Assert loading state shows spinner | `SpinnerGap` spinner with "Processing…" text |
| 8 | Assert redirect attempt | `await page.waitForURL(/checkout\.stripe\.com|\/checkout/)` or verify `window.location.href` was set |
| 9 | 📸 Screenshot | `checkout-payment-redirect` |

**Expected:**
- CTA button shows total amount with `Lock` icon (not a PaymentElement — Stripe hosted redirect flow).
- Tapping triggers `createCheckoutSessionAction` server action.
- Loading state shows `SpinnerGap` spinner + "Processing…" text, button disabled.
- On success, browser redirects to `result.url` (Stripe hosted checkout page).
- No embedded Stripe Elements on this page — pure redirect flow.

---

### S7.13 — Checkout success: order confirmation with order ID

**Goal:** Verify the `/checkout/success` page shows order confirmation after Stripe payment.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/checkout/success?session_id=test_session_123` | `await page.goto('/en/checkout/success?session_id=test_session_123')` |
| 2 | Intercept the verify action | Mock `verifyAndCreateOrderAction` to return `{ ok: true, orderId: 'ORD-12345' }` |
| 3 | Wait for loading to complete | Initially shows `SpinnerGap` spinner with "Verifying…" text |
| 4 | Assert success icon | `div.size-16` with `CheckCircle` icon in `bg-success/10 rounded-full` container |
| 5 | Assert success title | `h1.text-lg.font-semibold` with "Payment Successful" text |
| 6 | Assert thank-you description | `p.text-sm.text-muted-foreground` |
| 7 | Assert order ID display | `bg-surface-subtle rounded-md` container with order ID `ORD-12345` in `font-mono font-medium` |
| 8 | Assert "View Orders" link | `page.getByRole('link', { name: /view orders/i })` — links to `/orders` |
| 9 | Assert "Continue Shopping" link | `page.getByRole('link', { name: /continue shopping/i })` — links to `/` with `ArrowRight` icon |
| 10 | Assert info items | `Package` icon with order-created text, `Envelope` icon with email confirmation text |
| 11 | 📸 Screenshot | `checkout-success-confirmation` |

**Expected:**
- Large green `CheckCircle` icon (64px circle) centered.
- Order ID shown in a monospace font inside a subtle surface container.
- Two action buttons: "View Orders" (outline) and "Continue Shopping" (primary).
- Package and Envelope info items describe next steps.
- No main navigation — checkout layout provides minimal chrome.

---

### S7.14 — Remove item from cart on cart page

**Goal:** Verify the Trash button on the full cart page removes an item.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/cart` with ≥ 2 items | `await page.goto('/en/cart')` |
| 2 | Count items before removal | `const before = await page.locator('.bg-card.rounded-lg.border.border-border\\/50.p-2\\.5').count()` |
| 3 | Locate the delete button on the first item | `page.getByRole('button', { name: /delete/i }).first()` — `IconButton` with `Trash` icon, `hover:bg-destructive-subtle` |
| 4 | Tap the delete button | `await deleteBtn.tap()` |
| 5 | Wait for item removal | `await expect(page.locator('.bg-card.rounded-lg.border.border-border\\/50.p-2\\.5')).toHaveCount(before - 1)` |
| 6 | Assert subtotal updated | Total in sticky footer reflects remaining items |
| 7 | Assert item count subtitle updated | `N item(s)` text decremented |
| 8 | 📸 Screenshot | `cart-page-item-removed` |

**Expected:**
- Item card disappears from the list.
- Subtotal and item count update immediately.
- If last item removed, page transitions to empty state (S7.8).

---

### S7.15 — Checkout auth gate for unauthenticated users

**Goal:** Verify unauthenticated users see an auth gate notice on the checkout page with sign-in CTA.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/checkout` with ≥ 1 item, NOT authenticated | `await page.goto('/en/checkout')` |
| 2 | Wait for checkout to render | `await page.waitForSelector('.lg\\:hidden')` |
| 3 | Assert auth gate notice is visible | `div[role="alert"]` with `Lock` icon and auth-required title/description |
| 4 | Assert "Sign In" primary CTA | `page.getByRole('link', { name: /sign in/i })` — links to `/auth/login?next=/checkout` |
| 5 | Assert "Back to Cart" secondary CTA | `page.getByRole('link', { name: /back to cart/i })` — links to `/cart` |
| 6 | Assert address and shipping sections are hidden | `AddressSection` and `ShippingMethodSection` not rendered when `isAuthGateActive` |
| 7 | Assert mobile footer shows "Sign In" button (not payment CTA) | Footer button links to auth login with `Lock` icon |
| 8 | 📸 Screenshot | `checkout-auth-gate` |

**Expected:**
- Auth gate alert with `Lock` icon, title, and description rendered at top.
- Two CTAs: "Sign In" (primary) and "Back to Cart" (secondary).
- Address and shipping sections are conditionally hidden (`!isAuthGateActive`).
- Mobile sticky footer shows "Sign In" button instead of "Complete Order" payment CTA.
- Order items section still visible (user can see what they're buying).

---

## Cross-Cutting Checks

| Check | How | Applicable Scenarios |
|-------|-----|---------------------|
| No horizontal overflow | `document.documentElement.scrollWidth <= window.innerWidth` | All |
| Touch targets ≥ 44px | Verify `h-touch-lg` (48px) on quantity selector, sticky footer CTA ≥ 48px | S7.6, S7.3 |
| Safe-area inset | Sticky footer uses `pb-safe` on cart page, `pb-safe` on checkout footer | S7.6, S7.12 |
| `tabular-nums` on prices | All price displays use `tabular-nums` for alignment | S7.2, S7.6, S7.7 |
| i18n: price formatting | EUR formatting via `Intl.NumberFormat` with locale-aware separator | All price scenarios |
| Color contrast | Badge `bg-cart-badge` on `ring-header-bg` must meet 4.5:1 | S7.7 |
| Drawer `data-vaul-no-drag` | 3 elements marked: Trash, Minus, Plus buttons | S7.3, S7.4 |
| No `data-testid` attributes | Cart/checkout components lack `data-testid` — selectors use ARIA roles + text | All |

---

## Findings

_To be populated during audit execution._

| ID | Scenario | Severity | Description | Screenshot | Device |
|----|----------|----------|-------------|------------|--------|

---

## Summary

| Metric | Value |
|--------|-------|
| Total scenarios | 15 |
| Passed | — |
| Failed | — |
| New bugs found | — |
| Known bugs verified | LAUNCH-006 (S7.7) |
| Blockers | — |

---

*Phase 7 of 18 · Created 2026-02-09*
