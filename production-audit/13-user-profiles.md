# Phase 13: User Profiles

> Validate the full mobile user/seller profile experience — public profile pages with tabs (products, reviews), seller directory, follow/unfollow, verification badges, profile header, product grids, and 404 handling for non-existent users.

| Field | Value |
|-------|-------|
| **Scope** | Public user/seller profile pages, product listings by user, seller directory |
| **Routes** | `/:username`, `/sellers` |
| **Priority** | P2 |
| **Dependencies** | Phase 1 (Shell) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | No (public pages; follow/message require auth) |
| **Status** | 📝 Planned |

---

## Source Files

| File | Role |
|------|------|
| `app/[locale]/[username]/page.tsx` | Profile page — server component with ISR, `generateStaticParams` pre-renders top 25 active sellers |
| `app/[locale]/[username]/profile-client.tsx` | `PublicProfileClient` — full client profile UI (tabs, products, reviews, stats, social links) |
| `app/[locale]/[username]/layout.tsx` | Profile layout wrapper |
| `app/[locale]/[username]/loading.tsx` | Profile loading skeleton |
| `app/[locale]/[username]/error.tsx` | Profile error boundary |
| `app/[locale]/[username]/not-found.tsx` | Profile 404 page |
| `app/[locale]/[username]/_components/follow-seller-button.tsx` | `FollowSellerButton` — follow/unfollow toggle with auth gate |
| `app/[locale]/[username]/_components/seller-verification-badge.tsx` | `SellerVerificationBadge` — verified seller indicator |
| `app/[locale]/[username]/[productSlug]/` | PDP under profile (covered in Phase 6) |
| `components/shared/profile/profile-shell.tsx` | `ProfileShell` — shared profile page wrapper |
| `components/shared/profile/profile-stats.tsx` | `ProfileStats` — stats display (products, sales, rating, followers) |
| `components/shared/profile/profile-tabs.tsx` | `ProfileTabs` — tab navigation (Products, Reviews, About) |
| `components/shared/profile/profile-settings-panel.tsx` | `ProfileSettingsPanel` — own-profile settings (edit, share) |
| `components/shared/profile/profile-header-sync.tsx` | `ProfileHeaderSync` — mobile header sync for profile routes |
| `components/shared/product/card/mobile.tsx` | `MobileProductCard` — product card in profile product grid |
| `app/[locale]/(main)/sellers/page.tsx` | Sellers directory page — `TopSellersHero` + `SellersDirectoryClient` |
| `app/[locale]/(main)/sellers/loading.tsx` | Sellers directory loading skeleton |
| `app/[locale]/(main)/sellers/_components/sellers-directory-client.tsx` | `SellersDirectoryClient` — client grid of seller cards |
| `app/[locale]/(main)/sellers/_components/top-sellers-hero.tsx` | `TopSellersHero` — hero banner with breadcrumb |
| `app/[locale]/(main)/sellers/_components/sellers-empty-state.tsx` | `SellersEmptyState` — empty state when no sellers found |
| `app/[locale]/(main)/sellers/_lib/get-top-sellers.ts` | `getTopSellers` — Supabase query for seller list |
| `app/actions/seller-follows.ts` | `followSeller`, `unfollowSeller` server actions |

---

## Prerequisites

| # | Condition | How to verify |
|---|-----------|---------------|
| 1 | Phase 1 (Shell) passes — mobile shell, bottom nav, header verified | Phase 1 audit green |
| 2 | Device viewport set to Pixel 5 (393×851) or iPhone 12 (390×844) | Playwright `use: { viewport }` |
| 3 | Locale set to `en` | URL prefix `/en/` |
| 4 | At least one active seller profile with ≥ 2 published products | Seed data or existing database state |
| 5 | Seller profile has reviews (≥ 1 seller review) | Needed for reviews tab scenario |
| 6 | A non-existent username known for 404 testing | e.g., `__nonexistent_user_12345__` |
| 7 | Authenticated user available for follow scenario | Login via auth flow or restore session |
| 8 | Overlays dismissed (cookie consent + geo modal) | `localStorage.setItem('cookie-consent', 'accepted'); localStorage.setItem('geo-welcome-dismissed', 'true')` |

---

## Routes Under Test

| Route | Description | Auth |
|-------|-------------|------|
| `/en/:username` | Public user/seller profile — avatar, bio, tabs (products/reviews), stats | No |
| `/en/sellers` | Sellers directory — hero, grid of top seller cards, breadcrumb | No |

---

## Known Bugs

None identified for profile or seller directory routes.

---

## Scenarios

### S13.1 — Profile Page: Seller Profile Renders with Stats and Tabs

**Goal:** Verify a seller's public profile page renders correctly on mobile with avatar, display name, stats, bio, and tab navigation.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a known seller's profile | `await page.goto('/en/<seller-username>')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert profile avatar/image is visible | `page.locator('img[alt*="avatar" i], img[alt*="profile" i]').first()` or UserAvatar component |
| 4 | Assert display name or username heading | `await expect(page.locator('h1, h2').first()).toBeVisible()` — seller name text |
| 5 | Assert `SellerVerificationBadge` if seller is verified | `page.locator('text=/verified/i')` or CheckCircle icon near name |
| 6 | Assert `ProfileStats` are visible | Stats row/pills: products count, sales count, rating, followers |
| 7 | Assert bio text (if set) | Bio paragraph below name/stats |
| 8 | Assert `ProfileTabs` renders with at least Products tab | `page.getByRole('tab', { name: /products/i })` or `page.getByRole('tablist')` |
| 9 | Assert Products tab is default active | Products tab has active/selected state |
| 10 | Assert social links render (if seller has them) | Icons for Facebook, Instagram, etc. if present |
| 11 | 📸 Screenshot | `phase-13-S13.1-seller-profile-render.png` |

**Expected:**
- `PublicProfileClient` renders inside `ProfileShell` wrapper.
- Avatar renders via `UserAvatar` component with proper sizing for mobile.
- `ProfileStats` shows at least product count and rating for sellers.
- `ProfileTabs` tablist is horizontally scrollable on mobile if many tabs.
- `SellerVerificationBadge` appears for verified sellers with CheckCircle icon.
- Page uses cached data via `getPublicProfileData` — fast initial load.
- No horizontal overflow on 390px / 393px viewport.

---

### S13.2 — Profile Page: Product Grid Under Products Tab

**Goal:** Verify the Products tab displays the seller's listings in a mobile-optimized grid using `MobileProductCard`.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to seller profile with ≥ 2 products | `await page.goto('/en/<seller-username>')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert Products tab is active (default) | Tab has selected state |
| 4 | Assert product grid renders | `page.locator('.grid')` within products tabpanel |
| 5 | Count visible product cards | `await expect(page.locator('[class*="grid"] > *').first()).toBeVisible()` — at least 2 items |
| 6 | Assert each card has product image | `page.locator('img').nth(1)` — product images within grid |
| 7 | Assert each card has title | Text content within each card |
| 8 | Assert each card has price | Price text with currency symbol (€) |
| 9 | Tap on a product card | `await page.locator('[class*="grid"] > *').first().tap()` |
| 10 | Verify navigation to PDP | URL matches `/<seller-username>/<productSlug>` pattern |
| 11 | 📸 Screenshot | `phase-13-S13.2-profile-product-grid.png` |

**Expected:**
- Products render using `MobileProductCard` component — image, title, price, condition badge.
- Grid is 2-column on mobile (`grid-cols-2`).
- Cards are tappable and navigate to `/:username/:productSlug` PDP.
- Product count in stats matches the number of visible products (or paginated correctly).
- Empty state renders if seller has zero products (e.g., `EmptyStateCTA`).
- No layout breaks or overflow on smallest viewport (390px).

---

### S13.3 — Follow Seller Button: Auth-Gated Toggle

**Goal:** Verify the `FollowSellerButton` is visible on other sellers' profiles, requires auth, and toggles follow/unfollow state.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a seller profile as authenticated user (not own profile) | `await page.goto('/en/<other-seller-username>')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert follow button is visible | `page.getByRole('button', { name: /follow/i })` |
| 4 | Assert button shows "Follow" (not already following) | Button text is "Follow" — not "Following" or "Unfollow" |
| 5 | Tap Follow button | `await page.getByRole('button', { name: /follow/i }).tap()` |
| 6 | Assert button state changes to "Following" or "Unfollow" | Button text updates optimistically |
| 7 | Assert toast or feedback | Success toast: `toast.success(...)` or inline state change |
| 8 | Tap again to unfollow | `await page.getByRole('button', { name: /following|unfollow/i }).tap()` |
| 9 | Assert button reverts to "Follow" state | Button text returns to "Follow" |
| 10 | 📸 Screenshot | `phase-13-S13.3-follow-button-toggle.png` |

**Expected:**
- `FollowSellerButton` uses `followSeller` / `unfollowSeller` server actions.
- Button is NOT visible on own profile (`isOwnProfile === true` hides it).
- Toggle is optimistic — UI updates before server confirmation.
- Unauthenticated users see the button but tapping triggers auth redirect or sign-in prompt.
- Button meets 44×44px minimum touch target on mobile.

---

### S13.4 — Message Seller Button: Auth-Gated CTA

**Goal:** Verify the message/chat button on a seller profile requires authentication and navigates to the chat flow.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a seller profile as authenticated user | `await page.goto('/en/<seller-username>')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert message/chat button is visible | `page.getByRole('button', { name: /message|chat|contact/i })` or ChatCircle icon |
| 4 | Assert button is not visible on own profile | Navigate to own profile → button hidden |
| 5 | Tap message button on other seller's profile | `await page.getByRole('button', { name: /message|chat|contact/i }).tap()` |
| 6 | Assert navigation to chat or conversation initiation | URL changes to `/messages` or chat drawer opens |
| 7 | 📸 Screenshot | `phase-13-S13.4-message-seller-button.png` |

**Expected:**
- Message button renders with ChatCircle icon.
- Button is hidden on own profile (`isOwnProfile === true`).
- Tapping navigates to `/messages` with conversation context or opens chat flow.
- Unauthenticated users are redirected to login before messaging.
- Button meets minimum touch target size (44px).

---

### S13.5 — Profile 404: Non-Existent User

**Goal:** Verify navigating to a non-existent username renders the `not-found.tsx` 404 page without crash or error.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a non-existent username | `await page.goto('/en/__nonexistent_user_12345__')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert 404 not-found page renders | `await expect(page.locator('text=/not found|doesn.t exist|404/i')).toBeVisible()` |
| 4 | Assert no crash or error boundary triggered | `error.tsx` content not shown — clean 404 from `not-found.tsx` |
| 5 | Assert navigation/header still functional | Header and bottom tab bar remain interactive |
| 6 | Assert back/home link is present | Link to return to homepage or browse |
| 7 | 📸 Screenshot | `phase-13-S13.5-profile-404.png` |

**Expected:**
- Server component calls `notFound()` when `getPublicProfileData` returns null/no profile.
- `not-found.tsx` in `app/[locale]/[username]/` renders the 404 UI.
- Page is a clean, styled 404 — not a raw error or blank page.
- Mobile shell (header + tab bar) remains intact around the 404 content.
- No console errors or unhandled exceptions.

---

### S13.6 — Sellers Directory Page

**Goal:** Verify the `/sellers` directory page renders a hero banner, seller count, and grid of seller cards on mobile.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to sellers directory | `await page.goto('/en/sellers')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert `TopSellersHero` banner renders | Hero section with title text and breadcrumb |
| 4 | Assert breadcrumb navigation is visible | `page.locator('nav').filter({ hasText: /home/i })` — `AppBreadcrumb` |
| 5 | Assert seller count text | `page.locator('text=/\\d+ seller/i')` — e.g., "12 sellers" |
| 6 | Assert seller cards grid renders | `page.locator('.grid')` with seller card children |
| 7 | Assert each seller card has avatar and name | Seller avatar image + username/display_name text per card |
| 8 | Assert cards are tappable — navigate to seller profile | Tap first seller card → URL changes to `/:username` |
| 9 | Assert empty state if no sellers | `SellersEmptyState` renders when `sellersWithStats.length === 0` |
| 10 | 📸 Screenshot | `phase-13-S13.6-sellers-directory.png` |

**Expected:**
- `TopSellersHero` renders with gradient/colored hero banner, breadcrumb, title, subtitle.
- Sellers fetched via `getTopSellers` Supabase query, rendered by `SellersDirectoryClient`.
- Seller cards display avatar, name, product count, rating.
- Grid is responsive — single column or 2-column on mobile.
- Cards link to individual seller profile pages (`/:username`).
- Page uses `PageShell variant="muted"` wrapper.
- `SellersEmptyState` shown if database returns zero sellers.
- No horizontal overflow on 390px / 393px viewport.

---

### S13.7 — MobileProfileHeader Renders on Profile Route

**Goal:** Verify that the mobile profile header (`ProfileHeaderSync`) renders correctly when viewing a `/:username` route, showing the seller's name and contextual actions.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a seller profile | `await page.goto('/en/<seller-username>')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert mobile header shows seller identity | Username or display name in header bar |
| 4 | Assert share button in header | `page.getByRole('button', { name: /share/i })` — ShareNetwork icon |
| 5 | Scroll down the profile page | `await page.evaluate(() => window.scrollBy(0, 400))` |
| 6 | Assert header remains sticky/visible during scroll | Header element stays visible at top |
| 7 | Assert back navigation is available | Back arrow/button in header to return to previous page |
| 8 | 📸 Screenshot | `phase-13-S13.7-mobile-profile-header.png` |

**Expected:**
- `ProfileHeaderSync` syncs the mobile header with profile route context.
- Header shows condensed seller identity (name or username).
- Share action button triggers native share or copy-to-clipboard.
- Header is sticky: remains visible as user scrolls through profile content.
- Back navigation returns to previous page (browser history or explicit back arrow).
- Header styling matches the `StorefrontShell` mobile header pattern.

---

### S13.8 — Own Profile: Settings Panel Visible

**Goal:** Verify that when a logged-in user views their own profile, the `ProfileSettingsPanel` is shown with edit and share actions instead of follow/message buttons.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Authenticate as a user with a profile | Login via auth flow |
| 2 | Navigate to own profile | `await page.goto('/en/<own-username>')` |
| 3 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 4 | Assert `ProfileSettingsPanel` renders | Edit profile button or gear icon visible |
| 5 | Assert Follow button is NOT visible | `await expect(page.getByRole('button', { name: /follow/i })).not.toBeVisible()` |
| 6 | Assert Message button is NOT visible | `await expect(page.getByRole('button', { name: /message|chat/i })).not.toBeVisible()` |
| 7 | Assert edit profile CTA | `page.getByRole('button', { name: /edit/i })` or `page.getByRole('link', { name: /edit profile/i })` — PencilSimple icon |
| 8 | Assert share profile action | `page.getByRole('button', { name: /share/i })` — ShareNetwork icon |
| 9 | Tap edit profile | Tap edit button/link |
| 10 | Assert navigation to profile edit or account settings | URL changes to `/account/profile` or settings route |
| 11 | 📸 Screenshot | `phase-13-S13.8-own-profile-settings.png` |

**Expected:**
- `isOwnProfile === true` triggers `ProfileSettingsPanel` rendering.
- Follow and Message buttons are hidden on own profile.
- Edit profile button uses PencilSimple icon, navigates to account settings.
- Share profile button uses ShareNetwork icon, triggers share/copy flow.
- Settings panel fits mobile layout without overflow.
- All CTAs meet 44×44px minimum touch target.

---

## Findings

| ID | Scenario | Severity | Description | Screenshot | Device |
|----|----------|----------|-------------|------------|--------|
| — | — | — | — | — | — |

---

## Summary

| Metric | Value |
|--------|-------|
| Scenarios | 8 |
| Executed | 0 |
| Passed | 0 |
| Issues found | 0 |
| Blockers | 0 |
| Status | 📝 Planned |

Phase 13 covers 2 public routes (`/:username` and `/sellers`) spanning the profile and seller directory surface. The profile page (`PublicProfileClient`) is a rich client component with tabs (products, reviews), stats, social links, and conditional actions (follow/message for visitors, edit/share for own profile). Profile data is hybrid-cached — public data via `'use cache'` in `getPublicProfileData` with ISR pre-rendering top 25 active sellers, while user-specific data (`isOwnProfile`, `isFollowing`) remains dynamic. No `data-testid` attributes exist in profile components — all selectors must rely on structural queries, ARIA roles, or text content. The seller directory uses `PageShell variant="muted"` with a hero banner and `SellersDirectoryClient` grid. Key risk areas include follow button auth gating, profile 404 rendering via `notFound()`, and mobile header synchronization via `ProfileHeaderSync`.
