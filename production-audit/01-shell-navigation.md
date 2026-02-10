# Phase 1: Shell & Navigation

> Mobile app shell audit — persistent chrome (headers, tab bar, footer), global drawers, overlay sequencing, safe area insets, and hydration behavior across all viewports.

| Field | Value |
|-------|-------|
| **Scope** | App shell chrome wrapping every route: headers (5 variants), bottom tab bar (5 columns), footer, 6 global drawers, category browse drawer, cookie consent, geo welcome modal, guest sell CTA, safe area insets |
| **Routes** | Global — applies to all routes under `(main)` layout |
| **Priority** | P0 |
| **Dependencies** | None — this is the foundation phase |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | No (shell renders for all users; auth drawer tested unauthenticated) |
| **Status** | 📝 Planned |

---

## Source Files

| Role | Path | Purpose |
|------|------|---------|
| Root locale layout | `app/[locale]/layout.tsx` | `<html>`, `<body>`, `LocaleProviders` |
| Main group layout | `app/[locale]/(main)/layout.tsx` | `OnboardingProvider` wraps `StorefrontLayout` |
| Storefront layout | `app/[locale]/_components/storefront-layout.tsx` | Fetches category tree, wraps in `CommerceProviders` |
| Shell (all chrome) | `app/[locale]/_components/storefront-shell.tsx` | `CategoryDrawerProvider` → `HeaderProvider` → `PageShell` → all chrome components |
| Page surface wrapper | `app/[locale]/_components/page-shell.tsx` | `data-slot="page-shell"`, `min-h-dvh`, `bg-background` or `bg-surface-subtle` |
| AppHeader | `app/[locale]/_components/app-header.tsx` | `data-slot="app-header"`, `data-hydrated="true"`, auto-detects variant from pathname |
| Homepage header (mobile) | `components/layout/header/mobile/homepage-header.tsx` | Hamburger + logo + inline search + wishlist + cart |
| Product header (mobile) | `components/layout/header/mobile/product-header.tsx` | Back + seller info + share |
| Contextual header (mobile) | `components/layout/header/mobile/contextual-header.tsx` | Back + title + subcategory circles |
| Profile header (mobile) | `components/layout/header/mobile/profile-header.tsx` | Back + profile info + follow |
| Minimal header (mobile) | `components/layout/header/mobile/minimal-header.tsx` | Centered logo only |
| Sidebar / hamburger menu | `components/layout/sidebar/sidebar-menu.tsx` | `data-testid="mobile-menu-trigger"` |
| MobileTabBar | `app/[locale]/_components/mobile-tab-bar.tsx` | 5-column bottom nav: Home, Categories, Sell, Chat, Profile |
| SiteFooter | `app/[locale]/_components/site-footer.tsx` | `id="footerHeader"`, `role="contentinfo"`, conditional mobile visibility |
| SkipLinks | `app/[locale]/_components/skip-links.tsx` | Keyboard-only skip navigation |
| CookieConsent | `app/[locale]/_components/cookie-consent.tsx` | `role="dialog"`, `aria-labelledby="cookie-consent-title"` |
| GeoWelcomeModal | `app/[locale]/_components/geo-welcome-modal.tsx` | Region selection popup, sequenced after cookie consent |
| GeoWelcome hook | `hooks/use-geo-welcome.ts` | Storage keys: `geo-welcome-dismissed`, `geo-region-confirmed`, `geo-last-shown` |
| GuestSellCta | `app/[locale]/_components/guest-sell-cta.tsx` | Unauthenticated sell prompt, sequenced after geo welcome |
| GlobalDrawers | `app/[locale]/_components/global-drawers.tsx` | Renders: `ProductQuickViewDrawer`, `CartDrawer`, `MessagesDrawer`, `AccountDrawer`, `AuthDrawer`, `ProductQuickViewDialog` |
| CategoryBrowseDrawer | `app/[locale]/_components/category-browse-drawer.tsx` | `data-testid="mobile-category-drawer"`, L0→L1 category navigation |
| Auth drawer | `components/mobile/drawers/auth-drawer.tsx` | `data-testid="mobile-auth-drawer"` |
| Account drawer | `components/mobile/drawers/account-drawer.tsx` | `data-testid="mobile-account-drawer"` |
| Cart drawer | `components/mobile/drawers/cart-drawer.tsx` | Cart items list + checkout CTA |
| Messages drawer | `components/mobile/drawers/messages-drawer.tsx` | Recent conversations list |
| Product quick-view drawer | `components/mobile/drawers/product-quick-view-drawer.tsx` | Product preview bottom sheet |
| useIsMobile | `hooks/use-mobile.ts` | `useSyncExternalStore`, `getServerSnapshot() => false`, breakpoint 768px |
| Drawer context | `components/providers/drawer-context.tsx` | `useDrawer()` — `openMessages`, `openAccount`, `openAuth`, `closeCart`, etc. |
| Category drawer context | `components/mobile/category-nav/category-drawer-context.tsx` | `useCategoryDrawer()` — `openRoot`, `openCategory`, `close` |
| Global CSS | `app/globals.css` | `--spacing-header`, `--spacing-bottom-nav`, `--app-header-offset`, `--control-default` |

---

## Prerequisites

### Overlay Dismissal (clean state for all scenarios except S1.10–S1.13)

```typescript
await page.addInitScript(() => {
  localStorage.setItem('cookie-consent', 'accepted');
  localStorage.setItem('geo-welcome-dismissed', 'true');
});
```

### Hydration Wait

```typescript
// Wait for header hydration before interacting
await page.waitForSelector('header[data-slot="app-header"][data-hydrated="true"]', { timeout: 10_000 });
// Wait for tab bar mount (client-only, useState + useEffect guard)
await page.waitForSelector('[data-testid="mobile-tab-bar"]', { timeout: 10_000 });
```

### Auth State

- **Unauthenticated** for all scenarios in this phase.
- Auth drawer (S1.9a) tested in guest mode — opens login/signup tabs.

### Test Data

- No product or user data required — shell chrome is static across all routes.
- Category tree must be seeded (used by category drawer and header pills).

### Environment Variables

- `NEXT_PUBLIC_E2E` must NOT be `"true"` for overlay tests (S1.10–S1.13), as cookie consent and geo modal are suppressed in E2E mode.

---

## Routes Under Test

| # | Route | URL Pattern | Header Variant | Tab Bar | Footer (Mobile) |
|---|-------|-------------|----------------|---------|-----------------|
| 1 | Homepage | `/en` | `homepage` → `MobileHomepageHeader` | ✅ Visible | ✅ Visible |
| 2 | Search | `/en/search` | `homepage` → `MobileHomepageHeader` | ✅ Visible | ❌ Hidden |
| 3 | Category root | `/en/categories` | `contextual` → `MobileContextualHeader` | ✅ Visible | ❌ Hidden |
| 4 | Category detail | `/en/categories/electronics` | `contextual` → `MobileContextualHeader` | ✅ Visible | ❌ Hidden |
| 5 | Product detail | `/en/{username}/{slug}` | `product` → `MobileProductHeader` | ❌ Hidden | ❌ Hidden |
| 6 | User profile | `/en/{username}` | `profile` → `MobileProfileHeader` | ✅ Visible | ❌ Hidden |
| 7 | Auth login | `/en/auth/login` | `minimal` → `MobileMinimalHeader` | ✅ Visible | ❌ Hidden |
| 8 | Cart | `/en/cart` | `default` → `MobileHomepageHeader` | ❌ Hidden | ❌ Hidden |
| 9 | Assistant | `/en/assistant` | `contextual` → `MobileContextualHeader` | ❌ Hidden | ❌ Hidden |
| 10 | About (legal) | `/en/about` | `default` → `MobileHomepageHeader` | ✅ Visible | ✅ Visible |
| 11 | Terms (legal) | `/en/terms` | `default` → `MobileHomepageHeader` | ✅ Visible | ✅ Visible |
| 12 | Sell | `/en/sell` | `default` → `MobileHomepageHeader` | ✅ Visible | ❌ Hidden |

---

## Test Scenarios

### S1.1: Tab Bar Renders With 5 Items on Homepage

**Steps:**

1. Navigate to `/en`.
2. Wait for hydration: `await page.waitForSelector('[data-testid="mobile-tab-bar"]', { timeout: 10_000 })`.
3. Locate the tab bar nav: `page.locator('nav[data-testid="mobile-tab-bar"]')`.
4. Verify the tab bar dock is visible: `page.locator('[data-testid="mobile-tab-bar-dock"]')`.
5. Count grid children inside `[data-testid="mobile-tab-bar-dock"] .grid.grid-cols-5` — expect exactly 5 items.
6. Verify tab labels by text content:
   - Column 1: `page.locator('[data-testid="mobile-tab-bar"] a[href="/"]')` — text includes localized "Home".
   - Column 2: `page.locator('[data-testid="mobile-tab-bar"] button[aria-haspopup="dialog"]').first()` — text includes localized "Categories".
   - Column 3: `page.locator('[data-testid="mobile-tab-sell"]')` — Sell button with `Plus` icon inside a circle.
   - Column 4: `page.locator('[data-testid="mobile-tab-bar"] button[aria-haspopup="dialog"]').nth(1)` — text includes localized "Chat".
   - Column 5: `page.locator('[data-testid="mobile-tab-profile"]')` — text includes localized "Profile".
7. Verify the nav has `aria-label` attribute (value from `t("mobileNavigation")`).
8. Verify the nav has CSS class `md:hidden` (hidden on desktop breakpoint).

**Expected:** Tab bar is visible at bottom of screen with exactly 5 columns: Home (link), Categories (button), Sell (link with circle icon), Chat (button), Profile (button). All items have visible icons and labels. The nav element has proper ARIA labeling.

**Screenshot checkpoint:** `phase-01-S1.1-tab-bar-5-items-homepage.png`

---

### S1.2: Tab Bar Active State Per Route

**Steps:**

1. **Homepage active:**
   - Navigate to `/en`.
   - Wait for `[data-testid="mobile-tab-bar"]`.
   - Verify Home tab (`a[href="/"]`) has `aria-current="page"` and classes `bg-surface-subtle text-foreground`.
   - Verify other tabs do NOT have `aria-current="page"`.
   - Screenshot: `phase-01-S1.2a-tab-active-home.png`.

2. **Categories active:**
   - Navigate to `/en/categories`.
   - Wait for `[data-testid="mobile-tab-bar"]`.
   - Verify Categories button has visual active state (classes `bg-surface-subtle text-foreground`).
   - Screenshot: `phase-01-S1.2b-tab-active-categories.png`.

3. **Sell active:**
   - Navigate to `/en/sell`.
   - Wait for `[data-testid="mobile-tab-bar"]`.
   - Verify Sell tab (`[data-testid="mobile-tab-sell"]`) has `aria-current="page"` and the inner circle has classes `border-foreground bg-foreground text-background`.
   - Screenshot: `phase-01-S1.2c-tab-active-sell.png`.

4. **Profile active (guest — opens auth drawer):**
   - Navigate to `/en`.
   - Click `[data-testid="mobile-tab-profile"]`.
   - Verify Profile tab shows active state while auth drawer is open.
   - Close the drawer.
   - Screenshot: `phase-01-S1.2d-tab-active-profile-guest.png`.

**Expected:** Each route highlights its corresponding tab with `bg-surface-subtle text-foreground`. Inactive tabs show `text-muted-foreground`. Only one tab is active at a time.

**Screenshot checkpoint:** `phase-01-S1.2a-tab-active-home.png`, `phase-01-S1.2b-tab-active-categories.png`, `phase-01-S1.2c-tab-active-sell.png`, `phase-01-S1.2d-tab-active-profile-guest.png`

---

### S1.3: Tab Bar Hidden on PDP, Cart, and Assistant

**Steps:**

1. **PDP (product page):**
   - Navigate to a product page matching `/{username}/{slug}` pattern (e.g., `/en/testuser/test-product`).
   - Wait for page load.
   - Verify `[data-testid="mobile-tab-bar"]` is NOT in the DOM (component returns `null` for product pages).
   - Screenshot: `phase-01-S1.3a-tab-hidden-pdp.png`.

2. **Cart:**
   - Navigate to `/en/cart`.
   - Verify `[data-testid="mobile-tab-bar"]` is NOT in the DOM (component returns `null` for cart page).
   - Screenshot: `phase-01-S1.3b-tab-hidden-cart.png`.

3. **Assistant:**
   - Navigate to `/en/assistant`.
   - Verify `[data-testid="mobile-tab-bar"]` is NOT in the DOM (component returns `null` for assistant page).
   - Screenshot: `phase-01-S1.3c-tab-hidden-assistant.png`.

**Expected:** Tab bar is completely removed from DOM (not just visually hidden) on product pages, cart page, and assistant page. These pages have their own sticky bottom chrome (buy box, checkout footer, chat input respectively).

**Screenshot checkpoint:** `phase-01-S1.3a-tab-hidden-pdp.png`, `phase-01-S1.3b-tab-hidden-cart.png`, `phase-01-S1.3c-tab-hidden-assistant.png`

---

### S1.4: Tab Bar Safe Area Padding

**Steps:**

1. Navigate to `/en`.
2. Wait for `[data-testid="mobile-tab-bar"]`.
3. Locate the `CardContent` inside the dock: `page.locator('[data-testid="mobile-tab-bar-dock"] [class*="pb-safe"]')`.
4. Verify the `CardContent` element has class `pb-safe` applied.
5. Evaluate computed padding-bottom on the `CardContent` element via `page.evaluate()`:
   ```javascript
   const el = document.querySelector('[data-testid="mobile-tab-bar-dock"]');
   const cardContent = el?.querySelector('[class*="pb-safe"]');
   return getComputedStyle(cardContent).paddingBottom;
   ```
6. On devices without safe area (standard emulator), `env(safe-area-inset-bottom)` resolves to `0px` — verify `pb-safe` class is present regardless (for real device coverage).
7. Verify `<main>` element (`#main-content`) has class `pb-tabbar-safe` so content scrolls clear of the fixed tab bar.

**Expected:** The tab bar's `CardContent` has `pb-safe` class applied (maps to `padding-bottom: env(safe-area-inset-bottom)`). The `<main>` element has `pb-tabbar-safe` class to prevent content from being clipped behind the fixed tab bar.

**Screenshot checkpoint:** `phase-01-S1.4-tab-safe-area-padding.png`

---

### S1.5: Homepage Header Variant Renders

**Steps:**

1. Navigate to `/en`.
2. Wait for `header[data-slot="app-header"][data-hydrated="true"]`.
3. Verify the header is present and visible: `page.locator('header[data-slot="app-header"]')`.
4. Verify the header has CSS `fixed inset-x-0 top-0 z-40` (fixed positioning).
5. Verify `MobileHomepageHeader` content is rendered (mobile-only, `md:hidden`):
   - Hamburger menu trigger: `page.locator('[data-testid="mobile-menu-trigger"]')` — visible.
   - Logo text "treido.": `page.locator('header[data-slot="app-header"] >> text=treido.')` — visible.
   - Inline search button: `page.locator('header[data-slot="app-header"] button[aria-haspopup="dialog"]').first()` — visible, contains magnifying glass icon and placeholder text.
   - Wishlist button: visible in the header actions area.
   - Cart dropdown: visible in the header actions area.
6. Verify the header `<div>` wrapper has `h-(--control-primary)` class (48px height for the main row).

**Expected:** Homepage renders `MobileHomepageHeader` with hamburger menu, "treido." logo, inline search pill, wishlist icon, and cart icon. Header is fixed at top with `z-40`.

**Screenshot checkpoint:** `phase-01-S1.5-homepage-header-variant.png`

---

### S1.6: Contextual Header on /categories

**Steps:**

1. Navigate to `/en/categories`.
2. Wait for `header[data-slot="app-header"][data-hydrated="true"]`.
3. Verify `MobileContextualHeader` is rendered:
   - Back button: `page.locator('header[data-slot="app-header"] a[href*="/categories"], header[data-slot="app-header"] button').filter({ has: page.locator('svg') }).first()` — ArrowLeft icon visible.
   - Page title in header center area.
   - Search action button (magnifying glass icon).
   - Cart action button.
   - Wishlist action button.
4. If subcategories exist, verify the subcategory circles row is rendered below the main header bar.
5. Navigate to `/en/categories/electronics` (or another known category slug).
6. Verify the contextual header shows the category name as the title.
7. Verify the back button returns to `/en/categories`.

**Expected:** Category pages render `MobileContextualHeader` with back arrow, category title, and action icons. Subcategory circles appear below the main bar when subcategories exist.

**Screenshot checkpoint:** `phase-01-S1.6-contextual-header-categories.png`

---

### S1.7: Minimal Header on /auth/login

**Steps:**

1. Navigate to `/en/auth/login`.
2. Wait for `header[data-slot="app-header"][data-hydrated="true"]`.
3. Verify `MobileMinimalHeader` is rendered:
   - Only a centered "treido." logo link (pointing to `/`): `page.locator('header[data-slot="app-header"] a[href="/"] >> text=treido.')`.
   - No hamburger menu: `page.locator('[data-testid="mobile-menu-trigger"]')` — count is 0 or not visible.
   - No search button.
   - No cart/wishlist icons.
4. Verify the minimal header wrapper has classes `border-b border-border-subtle bg-background pt-safe md:hidden`.
5. Verify the inner container has class `h-(--control-primary)` and `justify-center`.

**Expected:** Auth pages render `MobileMinimalHeader` — a clean header with only the centered "treido." logo. No navigation actions, no hamburger. The header has a subtle bottom border.

**Screenshot checkpoint:** `phase-01-S1.7-minimal-header-auth-login.png`

---

### S1.8: Header Height Matches CSS Custom Properties

**Steps:**

1. Navigate to `/en`.
2. Wait for `header[data-slot="app-header"][data-hydrated="true"]`.
3. Measure the header's rendered height via `page.evaluate()`:
   ```javascript
   const header = document.querySelector('header[data-slot="app-header"]');
   return header.getBoundingClientRect().height;
   ```
4. Read the `--spacing-header` CSS custom property:
   ```javascript
   return getComputedStyle(document.documentElement).getPropertyValue('--spacing-header').trim();
   ```
   Expected: `3rem` (48px).
5. Read the `--app-header-offset` value set dynamically by `AppHeader`'s `ResizeObserver`:
   ```javascript
   return getComputedStyle(document.documentElement).getPropertyValue('--app-header-offset').trim();
   ```
   This should be a pixel value matching the actual rendered header height (e.g., `56px` for homepage with category pills).
6. Verify `<main id="main-content">` has class `pt-app-header` — its `padding-top` should match `--app-header-offset`.
7. Verify no content is visually obscured behind the fixed header by scrolling down and checking the first visible content element is not clipped.

**Expected:** `--spacing-header` is `3rem` (48px). `--app-header-offset` is dynamically set by `ResizeObserver` to the actual header height in pixels. The `<main>` padding-top equals `--app-header-offset`, preventing content from being hidden behind the fixed header.

**Screenshot checkpoint:** `phase-01-S1.8-header-height-measurement.png`

---

### S1.9: Global Drawers Open and Close

**Steps:**

1. **S1.9a — Auth Drawer (guest → profile tab):**
   - Navigate to `/en`.
   - Wait for `[data-testid="mobile-tab-bar"]`.
   - Click `[data-testid="mobile-tab-profile"]`.
   - Wait for `[data-testid="mobile-auth-drawer"]` to appear.
   - Verify the auth drawer is visible with `max-h-dialog rounded-t-2xl` styling.
   - Verify login/signup form content is present.
   - Dismiss by tapping the backdrop (Vaul overlay `[data-vaul-overlay]`) or swiping down.
   - Verify drawer closes and `[data-testid="mobile-auth-drawer"]` is no longer visible.
   - Screenshot: `phase-01-S1.9a-auth-drawer-open.png`.

2. **S1.9b — Category Browse Drawer:**
   - Navigate to `/en`.
   - Click the Categories tab in `[data-testid="mobile-tab-bar"]` (second button, `aria-haspopup="dialog"`).
   - Wait for `[data-testid="mobile-category-drawer"]` to appear.
   - Verify the drawer has a title, search input, and category list items.
   - Verify each category item has a `CaretRight` chevron icon.
   - Tap a category item — verify subcategories load or navigation occurs.
   - Close via the X button (`DrawerClose` inside the drawer header).
   - Verify drawer closes.
   - Screenshot: `phase-01-S1.9b-category-drawer-open.png`.

3. **S1.9c — Messages Drawer:**
   - Navigate to `/en`.
   - Click the Chat tab in `[data-testid="mobile-tab-bar"]` (fourth button, `aria-haspopup="dialog"`).
   - Wait for the messages drawer to appear (`DrawerContent` with `max-h-dialog-sm`).
   - Verify the drawer shows either empty state (ChatCircle icon + empty message) or conversation list.
   - Close via backdrop tap or X button.
   - Screenshot: `phase-01-S1.9c-messages-drawer-open.png`.

4. **S1.9d — Cart Drawer:**
   - Navigate to `/en`.
   - Locate and click the cart icon in the header (inside `MobileCartDropdown` rendered by `MobileHomepageHeader`).
   - Wait for the cart drawer to appear (`DrawerContent`).
   - Verify the drawer shows either empty state (ShoppingCart icon + empty message) or cart items.
   - Verify the drawer header shows "Cart" title with item count.
   - Close via backdrop or X button.
   - Screenshot: `phase-01-S1.9d-cart-drawer-open.png`.

5. **S1.9e — Account Drawer (requires auth — skip if unauthenticated):**
   - If authenticated: click `[data-testid="mobile-tab-profile"]`.
   - Wait for `[data-testid="mobile-account-drawer"]` to appear.
   - Verify quick links are present: `[data-testid="account-drawer-quick-links"]`.
   - Close via backdrop or X button.
   - Note: Skip this sub-scenario if running unauthenticated — auth drawer opens instead (covered in S1.9a).
   - Screenshot: `phase-01-S1.9e-account-drawer-open.png` (auth-only).

6. **S1.9f — Drawer backdrop dismissal (all drawers):**
   - For each drawer opened above, verify that tapping `[data-vaul-overlay]` closes the drawer.
   - Verify that after closing, no residual overlay remains (`[data-vaul-overlay]` should not be in the DOM or should have `opacity: 0`).

**Expected:** All drawers open as bottom sheets with `rounded-t-2xl` styling, display appropriate content, and close cleanly via backdrop tap, X button, or swipe-down gesture. No residual overlays after closing.

**Screenshot checkpoint:** `phase-01-S1.9a-auth-drawer-open.png`, `phase-01-S1.9b-category-drawer-open.png`, `phase-01-S1.9c-messages-drawer-open.png`, `phase-01-S1.9d-cart-drawer-open.png`, `phase-01-S1.9e-account-drawer-open.png`

---

### S1.10: Cookie Consent Bottom Sheet Appears on Fresh Visit

> **Prerequisite:** Do NOT inject the overlay dismissal script for this scenario. Use a clean localStorage state.

**Steps:**

1. Navigate to `/en` WITHOUT the `addInitScript` that sets `cookie-consent` in localStorage.
   Ensure `NEXT_PUBLIC_E2E` is NOT `"true"` (cookie consent is skipped in E2E mode via `if (isE2E) return null`).
2. Wait 1000ms (the component uses `setTimeout(() => setIsVisible(true), 1000)` delay).
3. Verify the cookie consent dialog appears:
   - Outer wrapper: `page.locator('[role="dialog"][aria-labelledby="cookie-consent-title"]')` — visible.
   - Mobile bottom sheet (md:hidden): class includes `bg-card border border-border pb-safe mx-3 mb-3 rounded-lg shadow-lg`.
   - Title element: `page.locator('#cookie-consent-title')` — contains cookie icon and title text.
   - Description: `page.locator('#cookie-consent-description')` — contains description and "Learn More" link to `/cookies`.
4. Verify two action buttons are present:
   - Accept button: `page.getByRole('button', { name: /accept/i })`.
   - Decline button: `page.getByRole('button', { name: /decline/i })`.
5. Verify "Manage Preferences" link points to `/cookies`.
6. Verify the cookie consent dialog is positioned above the tab bar: outer `div` has class `bottom-tabbar-offset`.
7. Verify the wrapper has `pointer-events-none` but the inner sheet has `pointer-events-auto`.

**Expected:** On a fresh visit without any stored consent, the cookie consent bottom sheet slides in after a 1-second delay. It shows a title, description, Accept All button, Decline button, and Manage Preferences link. It is positioned above the tab bar with `bottom-tabbar-offset`.

**Screenshot checkpoint:** `phase-01-S1.10-cookie-consent-appears.png`

---

### S1.11: Cookie Consent Dismissal Persists

**Steps:**

1. Start from the state at end of S1.10 (cookie consent visible).
2. Click the "Accept All" button: `page.getByRole('button', { name: /accept/i }).click()`.
3. Verify the cookie consent dialog disappears from the DOM.
4. Verify localStorage has the value:
   ```javascript
   return localStorage.getItem('cookie-consent');
   ```
   Expected: `"accepted"`.
5. Verify a `treido:cookie-consent` CustomEvent was dispatched (use `page.evaluate()` to add a listener before clicking).
6. Reload the page: `await page.reload()`.
7. Wait for page hydration.
8. Verify the cookie consent dialog does NOT appear (the component reads `localStorage.getItem('cookie-consent')` during `useEffect` and skips if value exists).
9. **Alternate test — Decline path:**
   - Clear localStorage: `await page.evaluate(() => localStorage.removeItem('cookie-consent'))`.
   - Reload page and wait for consent to appear.
   - Click X button (decline): `page.locator('[role="dialog"][aria-labelledby="cookie-consent-title"] button[aria-label]').first()`.
   - Verify localStorage: `"declined"`.
   - Verify consent does not reappear on next load.

**Expected:** Accepting or declining cookie consent persists the decision to `localStorage('cookie-consent')`. The dialog does not reappear on subsequent page loads. The `treido:cookie-consent` event is dispatched on both accept and decline.

**Screenshot checkpoint:** `phase-01-S1.11-cookie-consent-accepted.png`

---

### S1.12: Geo Welcome Modal Sequencing

> **Prerequisite:** Clean localStorage — no `cookie-consent`, no `geo-welcome-dismissed`. `NEXT_PUBLIC_E2E` must NOT be `"true"`.

**Steps:**

1. Navigate to `/en` with NO localStorage items set.
2. Wait for the cookie consent dialog to appear (~1 second delay).
3. Verify the geo welcome modal is NOT visible yet (the `GeoWelcomeModal` component guards on: `safeToOpen && hasCookieDecision && !isLoading && isOpen`).
4. Accept cookie consent by clicking the accept button.
5. Verify the `treido:cookie-consent` event fires and `localStorage.getItem('cookie-consent')` is set.
6. Now the GeoWelcomeModal should begin its own sequencing:
   - Step 1: `requestIdleCallback` (or 750ms fallback `setTimeout`).
   - Step 2: Polls for `header[data-hydrated="true"]` with 50ms interval, 2-second deadline.
   - Step 3: Checks `localStorage.getItem('cookie-consent')` is truthy.
7. Wait for the geo welcome modal to appear (up to 3 seconds after cookie consent acceptance):
   ```javascript
   await page.waitForSelector('.fixed.bottom-24 .rounded-lg.border.border-border.bg-card', { timeout: 5_000 });
   ```
8. Verify the modal content:
   - Globe icon in a circle badge.
   - Title containing detected country name.
   - Region selector (`Select` component) with options: BG, UK, EU, US, WW — each with flag emoji.
   - "Confirm" button.
   - "Show all products" decline button.
   - "Change anytime" text.
9. Dismiss by clicking the X close button: `page.locator('.fixed.bottom-24 button[aria-label]').first()`.
10. Verify `localStorage.getItem('geo-welcome-dismissed')` is `"true"`.
11. Reload page — verify the geo modal does NOT reappear.

**Expected:** The geo welcome modal appears ONLY after: (1) browser idle or 750ms timeout, (2) header is hydrated (`data-hydrated="true"`), and (3) cookie consent has been acted upon. It never overlaps with the cookie consent dialog. Dismissal persists via localStorage.

**Screenshot checkpoint:** `phase-01-S1.12-geo-welcome-modal-sequenced.png`

---

### S1.13: Content Not Clipped Behind Fixed Header or Tab Bar

**Steps:**

1. Navigate to `/en` (homepage — has both header and tab bar).
2. Wait for hydration: `header[data-slot="app-header"][data-hydrated="true"]` and `[data-testid="mobile-tab-bar"]`.
3. Scroll to the very top of the page.
4. Measure the `<main id="main-content">` element's position:
   ```javascript
   const main = document.querySelector('#main-content');
   const rect = main.getBoundingClientRect();
   return { top: rect.top };
   ```
5. Verify `main.top >= 0` (i.e., the main content starts at or below the visible viewport top — not behind the header, which is fixed and handled by `pt-app-header` padding).
6. Read `--app-header-offset`:
   ```javascript
   return getComputedStyle(document.documentElement).getPropertyValue('--app-header-offset');
   ```
7. Verify main's computed `padding-top` matches `--app-header-offset`.
8. Scroll to the very bottom of the page.
9. Verify the last visible content element above the tab bar is not clipped:
   ```javascript
   const tabBar = document.querySelector('[data-testid="mobile-tab-bar"]');
   const tabBarTop = tabBar.getBoundingClientRect().top;
   // Get the last child of main visible above the tab bar
   const main = document.querySelector('#main-content');
   const mainBottom = main.getBoundingClientRect().bottom;
   return { tabBarTop, mainBottom };
   ```
10. Verify `mainBottom` (with padding) clears the tab bar area — the `pb-tabbar-safe` class on `<main>` should provide adequate padding.

**Expected:** Content is fully visible between the header and tab bar. No text, images, or interactive elements are hidden underneath the fixed header (top) or the fixed tab bar (bottom). The `pt-app-header` and `pb-tabbar-safe` classes ensure proper spacing.

**Screenshot checkpoint:** `phase-01-S1.13-content-not-clipped.png`

---

### S1.14: Footer Visibility Rules

**Steps:**

1. **Homepage — footer visible on mobile:**
   - Navigate to `/en`.
   - Scroll to bottom of page.
   - Verify `footer#footerHeader` is visible (NOT hidden): it should NOT have `hidden md:block` class.
   - Verify footer has `role="contentinfo"` and proper `aria-label`.
   - Verify mobile accordion layout is rendered (`.lg:hidden` section with `Accordion`).
   - Screenshot: `phase-01-S1.14a-footer-visible-homepage.png`.

2. **Legal page (about) — footer visible on mobile:**
   - Navigate to `/en/about`.
   - Scroll to bottom.
   - Verify `footer#footerHeader` is visible — `/about` is in `footerVisibleRoutes`.
   - Screenshot: `phase-01-S1.14b-footer-visible-about.png`.

3. **App page (categories) — footer hidden on mobile:**
   - Navigate to `/en/categories`.
   - Scroll to bottom.
   - Verify `footer#footerHeader` has class `hidden md:block` applied (the `isFooterVisibleOnMobile` flag is `false` for `/categories`).
   - The footer element is in the DOM but hidden via CSS.
   - Screenshot: `phase-01-S1.14c-footer-hidden-categories.png`.

4. **Sell page — footer hidden on mobile:**
   - Navigate to `/en/sell`.
   - Scroll to bottom.
   - Verify footer is hidden (`hidden md:block`).
   - Screenshot: `phase-01-S1.14d-footer-hidden-sell.png`.

5. Verify footer sections on mobile (when visible):
   - "Back to Top" button: `footer button[aria-label]` — hidden on mobile (`hidden lg:block`).
   - Accordion sections: Company, Help, Sell & Business, Services.
   - Social links section (if env vars configured).
   - Legal links: Terms, Privacy, Cookies, ODR.
   - Copyright text with current year.

**Expected:** Footer is visible on mobile for homepage and legal/support routes (`/`, `/about`, `/terms`, `/privacy`, `/cookies`, `/accessibility`, `/customer-service`, `/contact`, `/help`, `/returns`, `/security`, `/feedback`, `/sellers`). Footer is hidden on mobile for app pages (`/categories`, `/search`, `/sell`, `/cart`, `/account/*`, etc.) — the tab bar replaces it.

**Screenshot checkpoint:** `phase-01-S1.14a-footer-visible-homepage.png`, `phase-01-S1.14b-footer-visible-about.png`, `phase-01-S1.14c-footer-hidden-categories.png`, `phase-01-S1.14d-footer-hidden-sell.png`

---

### S1.15: SAFE-001 — Measure Actual --spacing-bottom-nav Value

**Steps:**

1. Navigate to `/en`.
2. Wait for `[data-testid="mobile-tab-bar"]`.
3. Read the CSS custom property `--spacing-bottom-nav`:
   ```javascript
   return getComputedStyle(document.documentElement).getPropertyValue('--spacing-bottom-nav').trim();
   ```
4. Expected value from `app/globals.css` line 545: `3.5rem`.
5. Convert to pixels: `3.5rem * 16px = 56px`.
6. Measure the actual rendered height of the tab bar dock:
   ```javascript
   const dock = document.querySelector('[data-testid="mobile-tab-bar-dock"]');
   return dock.getBoundingClientRect().height;
   ```
7. Compare the rendered height against `--spacing-bottom-nav` (56px).
8. Document the discrepancy: DESIGN.md says 48px (`--spacing-bottom-nav: 3rem`), but CSS defines 3.5rem (56px).
9. Check if `pb-tabbar-safe` (if any custom utility) uses `--spacing-bottom-nav` — if so, content spacing might be wrong.

**Expected:** `--spacing-bottom-nav` is `3.5rem` (56px) in CSS. DESIGN.md documents it as 48px (3rem). The actual rendered tab bar height should match 56px. Document exact values for the SAFE-001 bug verification — is the discrepancy causing any visible spacing issue?

**Screenshot checkpoint:** `phase-01-S1.15-safe-001-bottom-nav-measurement.png`

---

### S1.16: HYDRA-002 — useIsMobile Flash on Initial Load

**Steps:**

1. Navigate to `/en` with **network throttling** set to "Slow 3G" to exaggerate hydration timing:
   ```typescript
   // Playwright CDP session for throttling
   const client = await page.context().newCDPSession(page);
   await client.send('Network.emulateNetworkConditions', {
     offline: false,
     downloadThroughput: 50 * 1024, // 50 KB/s
     uploadThroughput: 20 * 1024,
     latency: 400,
   });
   ```
2. Before navigation, inject a MutationObserver to detect content flashes:
   ```javascript
   await page.addInitScript(() => {
     window.__hydraFlashes = [];
     const observer = new MutationObserver((mutations) => {
       for (const mutation of mutations) {
         for (const node of mutation.addedNodes) {
           if (node instanceof HTMLElement && node.dataset.testid === 'mobile-tab-bar') {
             window.__hydraFlashes.push({
               timestamp: Date.now(),
               type: 'tab-bar-mount',
             });
           }
         }
       }
     });
     document.addEventListener('DOMContentLoaded', () => {
       observer.observe(document.body, { childList: true, subtree: true });
     });
   });
   ```
3. Navigate to `/en`.
4. Wait for full hydration.
5. Retrieve the flash data:
   ```javascript
   return window.__hydraFlashes;
   ```
6. The `MobileTabBar` component uses `useState(false) + useEffect → setMounted(true)` and returns `null` during SSR. This means the tab bar is NOT in the initial server HTML — it appears only after React hydration completes. Check if there's a visible layout shift when the tab bar mounts (space reserved via `pb-tabbar-safe` vs. actual tab bar appearing).
7. Check `useIsMobile()` behavior: since `getServerSnapshot()` returns `false`, any component using `useIsMobile()` will briefly render as desktop during hydration on mobile viewport:
   - Look for elements with `md:hidden` that should be visible but briefly aren't.
   - Look for elements with `hidden md:block` that briefly flash as visible.
8. Measure CLS (Cumulative Layout Shift) during hydration:
   ```javascript
   return new Promise(resolve => {
     new PerformanceObserver((list) => {
       let cls = 0;
       for (const entry of list.getEntries()) cls += entry.value;
       resolve(cls);
     }).observe({ entryTypes: ['layout-shift'] });
     setTimeout(() => resolve(0), 5000);
   });
   ```

**Expected:** The `MobileTabBar` mounts client-side only (hydration guard with `useState(false)`), which means there will be a brief period where the tab bar is absent from the DOM. `useIsMobile()` returns `false` during SSR, potentially causing mobile-only components to flash. Document: (a) how long the tab bar takes to appear after initial paint, (b) whether any visible content jump occurs, (c) measured CLS value.

**Screenshot checkpoint:** `phase-01-S1.16-hydra-002-initial-load.png`

---

## Known Bugs to Verify

| Bug ID | Component | Expected Behavior | Actual Behavior (Claimed) | Verify In |
|--------|-----------|-------------------|---------------------------|-----------|
| **SAFE-001** | `app/globals.css` line 545 | `--spacing-bottom-nav` matches DESIGN.md documentation (48px / 3rem) | CSS defines `3.5rem` (56px), DESIGN.md says 48px — mismatch | S1.15 |
| **HYDRA-002** | `hooks/use-mobile.ts` | `useIsMobile()` returns correct value immediately on mobile | Returns `false` during SSR (`getServerSnapshot`), then updates client-side — causes content flash | S1.16 |

---

## Findings

> Filled during audit execution.

| # | Severity | Component | Description | Screenshot | Repro Steps |
|---|----------|-----------|-------------|------------|-------------|

---

## Summary

| Metric | Value |
|--------|-------|
| Routes tested | — |
| Scenarios executed | 0 / 16 |
| Findings | — |
| Known bugs verified | 0 / 2 (SAFE-001, HYDRA-002) |
| Status | 📝 Planned |
