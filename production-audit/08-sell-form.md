# Phase 8: Sell Form

> Validate the complete mobile sell wizard — 5-step Framer Motion stepper, photo upload with compression, localStorage draft auto-save/restore, category tree selection, condition/attribute drawers, pricing inputs, review summary, and publish flow with payout gating.

| Field | Value |
|-------|-------|
| **Scope** | Multi-step mobile sell wizard (5 steps), stepper with Framer Motion transitions, photo upload with client-side compression, localStorage draft persistence (2s debounce auto-save), category selection, condition selector drawer, dynamic attributes, pricing, review & publish flow, payout-status gating |
| **Routes** | `/sell` |
| **Priority** | P0 |
| **Dependencies** | Phase 1 (Shell), Phase 3 (Auth — sell requires authenticated seller) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | Yes — unauthenticated users see `SignInPrompt`; users without `is_seller` flag see onboarding redirect |
| **Status** | ✅ Complete (code audit 2026-02-11) |

---

## Source Files

| File | Role |
|------|------|
| `app/[locale]/(sell)/layout.tsx` | `SellLayout` — standalone minimal layout, no site header/footer. `PageShell variant="muted"` + `<main className="flex-1 flex flex-col">` |
| `app/[locale]/(sell)/sell/page.tsx` | Server page — auth check, seller data fetch, payout status, categories |
| `app/[locale]/(sell)/sell/client.tsx` | `SellPageClient` — auth gate, onboarding gate, renders `UnifiedSellForm` |
| `app/[locale]/(sell)/_components/sell-form-unified.tsx` | `UnifiedSellForm` — wraps `SellFormProvider` + responsive layout split (`hidden lg:block` desktop / `lg:hidden` mobile) |
| `app/[locale]/(sell)/_components/sell-form-provider.tsx` | `SellFormProvider` — react-hook-form `FormProvider`, draft key `sell-form-draft-v4`, 2s debounce auto-save, progress tracking |
| `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx` | `MobileLayout` — 5-step wizard: What → Category → Details → Pricing → Review. Per-step field validation via `form.trigger()` |
| `app/[locale]/(sell)/_components/layouts/stepper-wrapper.tsx` | `StepperWrapper` — animated step dots (`motion.div`), progress bar (`h-0.5 bg-border/50` + `bg-primary` fill), direction-aware `AnimatePresence` transitions, sticky header/footer |
| `app/[locale]/(sell)/_components/steps/step-what.tsx` | Step 1 — `TitleField` (compact) + `PhotosField` (compact, max 8) |
| `app/[locale]/(sell)/_components/steps/step-category.tsx` | Step 2 — `CategorySelector` with auto-advance on leaf selection (300ms delay) |
| `app/[locale]/(sell)/_components/steps/step-details.tsx` | Step 3 — condition drawer, dynamic DB-fetched attributes, description textarea, additional photos grid |
| `app/[locale]/(sell)/_components/steps/step-pricing.tsx` | Step 4 — format selector (fixed/auction), price input (`inputMode="decimal"`), currency drawer, quantity stepper, accept-offers toggle |
| `app/[locale]/(sell)/_components/steps/step-review.tsx` | Step 5 — `ReviewField` with edit-step mapping, "Publish Listing" button in footer |
| `app/[locale]/(sell)/_components/fields/photos-field.tsx` | `PhotosField` — `useDropzone`, `compressImage()`, upload progress, `PhotoThumbnail` grid, `ImagePreviewModal` |
| `app/[locale]/(sell)/_components/ui/upload-zone.tsx` | `UploadZone` — `rounded-2xl border-2 border-dashed min-h-44 sm:min-h-48 touch-manipulation`, drag states |
| `app/[locale]/(sell)/_components/ui/photo-thumbnail.tsx` | `PhotoThumbnail` — remove, reorder (drag & drop), cover badge, preview tap |
| `app/[locale]/(sell)/_components/ui/image-preview-modal.tsx` | `ImagePreviewModal` — full-screen image preview overlay |
| `app/[locale]/(sell)/_components/ui/progress-header.tsx` | `ProgressHeader` — desktop progress bar + mobile step dots (`h-1 rounded-full, active w-6 bg-primary, inactive w-2 bg-hover`), save status (CloudCheck/Spinner), manual save (FloppyDisk) |
| `app/[locale]/(sell)/_components/ui/payout-required-modal.tsx` | `PayoutRequiredModal` — shown when publishing without Stripe Connect ready |
| `app/[locale]/(sell)/_components/ui/category-modal/` | Category tree selector — 3-level L0→L1→L2 hierarchy |
| `app/[locale]/(sell)/_components/sell-error-boundary.tsx` | `SellErrorBoundary` — error boundary wrapping the form |

---

## Prerequisites

| # | Condition | How to verify |
|---|-----------|---------------|
| 1 | Phase 1 (Shell) passes — `PageShell`, basic layout rendering | Phase 1 audit green |
| 2 | Device viewport set to Pixel 5 (393×851) or iPhone 12 (390×844) | Playwright `use: { viewport }` |
| 3 | Locale set to `en` | URL prefix `/en/` |
| 4 | Authenticated user session with `is_seller = true` and valid `username` | Logged-in seller account |
| 5 | At least one category tree exists (L0→L1→L2) with attributes | Seed data or production state |
| 6 | `localStorage` clear of `sell-form-draft-v4` at test start | `page.evaluate(() => localStorage.removeItem('sell-form-draft-v4'))` |
| 7 | Upload API endpoint `/api/upload-image` is functional | Server running |

---

## Routes Under Test

| Route | Description | Auth |
|-------|-------------|------|
| `/en/sell` | Sell form — multi-step wizard (mobile), single-page (desktop) | Authenticated seller |

---

## Known Bugs

| ID | Summary | Severity | Status |
|----|---------|----------|--------|
| SELL-001 | Sell form stuck on last step (Review), cannot publish listing | P0 | 🔴 Open (confirmed) |
| SELL-002 | Sell wizard components need shadcn refactor | P1 | 🟠 Open (confirmed) |

---

## Scenarios

### S8.1 — Auth gate: unauthenticated user sees sign-in prompt

**Goal:** Verify that visiting `/sell` without authentication shows `SignInPrompt` instead of the sell form.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Clear cookies / use incognito context | `await context.clearCookies()` |
| 2 | Navigate to `/en/sell` | `await page.goto('/en/sell')` |
| 3 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 4 | Assert sell form is NOT visible | `await expect(page.locator('text=/What are you selling/i')).not.toBeVisible()` |
| 5 | Assert sign-in prompt is visible | `await expect(page.locator('text=/sign in/i').first()).toBeVisible()` |
| 6 | Assert ProgressHeader renders with 0% progress | Verify header with step dots is present at top |
| 7 | 📸 Screenshot | `sell-auth-gate-signin-prompt` |

**Expected:**
- `SignInPrompt` component renders in the center of the page.
- `ProgressHeader` shows at sticky top with `progressPercent={0}`.
- No sell form fields are visible.

---

### S8.2 — Step 1 (What): title input and photo upload zone render

**Goal:** Verify Step 1 renders with the heading, title input, and photo upload zone.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Log in as a seller | Auth setup |
| 2 | Navigate to `/en/sell` | `await page.goto('/en/sell')` |
| 3 | Wait for form to load | `await page.waitForLoadState('networkidle')` |
| 4 | Assert Step 1 heading is visible | `await expect(page.locator('h2:has-text("What are you selling?")')).toBeVisible()` |
| 5 | Assert subtitle text | `await expect(page.locator('text=/Give your item a name and add a photo/i')).toBeVisible()` |
| 6 | Assert title input field is visible | `await expect(page.locator('input').first()).toBeVisible()` — TitleField compact |
| 7 | Assert upload zone is visible | `await expect(page.locator('.rounded-2xl.border-dashed')).toBeVisible()` |
| 8 | Assert upload zone has `min-h-44` or equivalent min-height | Computed style check ≥ 176px |
| 9 | Assert upload zone text | `await expect(page.locator('text=/Tap to add photos/i')).toBeVisible()` |
| 10 | Assert photo count badge shows `0/8` | `await expect(page.locator('text=0/8')).toBeVisible()` |
| 11 | Assert stepper header: step dots visible, first dot is active (wider) | Verify `motion.div` with `w-8` (32px) for active dot |
| 12 | Assert "Continue" button in sticky footer | `await expect(page.locator('button:has-text("Continue")')).toBeVisible()` |
| 13 | Assert "Continue" is disabled (no title/photo yet) | `await expect(page.locator('button:has-text("Continue")')).toBeDisabled()` |
| 14 | 📸 Screenshot | `sell-step1-what-initial` |

**Expected:**
- Step 1 renders heading "What are you selling?" with subtitle.
- Title input and upload zone are visible.
- Upload zone has `rounded-2xl border-2 border-dashed min-h-44 touch-manipulation`.
- "Continue" button is disabled until both title (≥5 chars) and ≥1 photo are provided.

---

### S8.3 — Step 1: photo upload — tap zone, image appears in grid

**Goal:** Verify that uploading a photo via the upload zone produces a thumbnail in the grid.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/sell` as seller (Step 1 active) | Auth + navigation |
| 2 | Locate the file input inside upload zone | `const fileInput = page.locator('.rounded-2xl.border-dashed input[type="file"]')` |
| 3 | Upload a test image via `setInputFiles` | `await fileInput.setInputFiles('test/fixtures/test-image.jpg')` |
| 4 | Wait for upload progress to appear | `await expect(page.locator('text=/Uploading/i').or(page.locator('.animate-spin'))).toBeVisible({ timeout: 5000 })` |
| 5 | Wait for upload to complete | `await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 15000 })` |
| 6 | Assert a photo thumbnail appears in the grid | `await expect(page.locator('img[alt]').first()).toBeVisible()` |
| 7 | Assert photo count badge updates to `1/8` | `await expect(page.locator('text=1/8')).toBeVisible()` |
| 8 | 📸 Screenshot | `sell-step1-photo-uploaded` |

**Expected:**
- File input accepts JPEG/PNG/WebP up to 10MB.
- Upload progress indicator appears during upload.
- After upload, a `PhotoThumbnail` appears in the `grid-cols-4` grid.
- Badge updates from `0/8` to `1/8`.

---

### S8.4 — Step 1: photo thumbnail — remove and cover badge

**Goal:** Verify photo thumbnails have remove functionality and the first photo shows a "Cover" badge.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | From S8.3 state (1 photo uploaded) | |
| 2 | Assert first photo has "Cover" badge or `isPrimary` indicator | `await expect(page.locator('text=/Cover/i').first()).toBeVisible()` — from StepDetails photo grid, or check `isPrimary` visual |
| 3 | Hover/tap on the photo thumbnail | `await page.locator('img[alt]').first().hover()` |
| 4 | Assert remove button appears (X icon, `rounded-full bg-surface-overlay`) | `await expect(page.locator('button:has(.size-3)').first()).toBeVisible()` |
| 5 | Upload a second photo | `await fileInput.setInputFiles('test/fixtures/test-image-2.jpg')` |
| 6 | Wait for second thumbnail | `await expect(page.locator('text=2/8')).toBeVisible()` |
| 7 | Remove the first photo (tap X button) | `await page.locator('[class*="photo"] button, [class*="group"] button:has(svg)').first().click()` |
| 8 | Assert photo count drops to `1/8` | `await expect(page.locator('text=1/8')).toBeVisible()` |
| 9 | Assert remaining photo now shows "Cover" badge (auto-promoted) | Cover badge visible on first remaining photo |
| 10 | 📸 Screenshot | `sell-step1-photo-remove-reorder` |

**Expected:**
- First photo shows "Cover" label.
- Remove button (X in `rounded-full bg-surface-overlay`) appears on hover/focus.
- Removing the cover photo auto-promotes the next photo to `isPrimary`.
- Count badge updates correctly.

---

### S8.5 — Step navigation: Steps 1→2 via "Continue" button

**Goal:** Verify "Continue" navigation from Step 1 to Step 2 with validation gating.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | From Step 1, fill title with ≥5 characters | `await page.locator('input').first().fill('Test Product Title')` |
| 2 | Upload at least one photo (S8.3) | Photo uploaded + visible |
| 3 | Assert "Continue" button becomes enabled | `await expect(page.locator('button:has-text("Continue")')).toBeEnabled()` |
| 4 | Tap "Continue" | `await page.locator('button:has-text("Continue")').tap()` |
| 5 | Assert Step 2 heading appears | `await expect(page.locator('h2:has-text("Choose a category")')).toBeVisible()` |
| 6 | Assert stepper dots update — dot 2 is now active (wider) | Check second `motion.div` has `w-8` (32px) |
| 7 | Assert progress bar advances | Progress bar `width` > 20% |
| 8 | 📸 Screenshot | `sell-step2-category-initial` |

**Expected:**
- "Continue" is disabled until `title.trim().length >= 5` AND `images.length > 0`.
- Tapping "Continue" triggers `form.trigger(['title', 'images'])` validation.
- On success, step advances from 1 → 2 with Framer Motion slide animation.
- Stepper dots and progress bar update.

---

### S8.6 — Step 2 (Category): 3-level category tree selection

**Goal:** Verify the category selector shows the L0→L1→L2 hierarchy and auto-advances on leaf selection.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | From Step 2 (S8.5 result) | Category step active |
| 2 | Assert heading "Choose a category" | `await expect(page.locator('h2:has-text("Choose a category")')).toBeVisible()` |
| 3 | Assert subtitle text | `await expect(page.locator('text=/The category determines/i')).toBeVisible()` |
| 4 | Assert L0 categories are visible | `await expect(page.locator('[class*="rounded"]').first()).toBeVisible()` — CategorySelector items |
| 5 | Tap an L0 category | `await page.locator('[class*="rounded"]').first().tap()` |
| 6 | Assert L1 subcategories appear | Wait for subcategory list to render |
| 7 | Tap an L1 category | `await page.locator('[class*="rounded"]').nth(1).tap()` |
| 8 | Assert L2 leaf categories appear (or selection completes) | |
| 9 | Tap an L2 leaf category | Selection finalizes |
| 10 | Assert "Selected category" confirmation panel appears | `await expect(page.locator('text=/Selected category/i')).toBeVisible()` — `bg-selected border-selected-border` panel |
| 11 | Assert breadcrumb path with ` › ` separator | `await expect(page.locator('.bg-selected').locator('text=/›/'))` |
| 12 | Assert auto-advance to Step 3 after ~300ms | `await expect(page.locator('h2:has-text("Product details")')).toBeVisible({ timeout: 2000 })` |
| 13 | 📸 Screenshot | `sell-step2-category-selected` (capture before auto-advance) |

**Expected:**
- Category tree shows 3-level hierarchy.
- Selecting a leaf category shows confirmation panel with `bg-selected border-selected-border`.
- After 300ms delay, form auto-advances to Step 3 via `setCurrentStep(3)`.

---

### S8.7 — Step 3 (Details): condition drawer, attributes, description

**Goal:** Verify Step 3 renders condition selector, dynamic attributes, and description textarea.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | From Step 3 (after category selection) | Details step active |
| 2 | Assert heading "Product details" | `await expect(page.locator('h2:has-text("Product details")')).toBeVisible()` |
| 3 | Assert condition `SelectionRow` is visible | `await expect(page.locator('text=/Condition/i')).toBeVisible()` |
| 4 | Assert condition shows placeholder "Select condition" | `await expect(page.locator('text=/Select condition/i')).toBeVisible()` |
| 5 | Tap condition row | `await page.locator('button:has-text("Select condition")').tap()` |
| 6 | Assert condition Drawer opens | `await expect(page.locator('[role="dialog"]:has-text("Item condition")')).toBeVisible()` |
| 7 | Assert condition options are visible (New, Like New, etc.) | `await expect(page.locator('[role="dialog"] button').first()).toBeVisible()` |
| 8 | Tap a condition option (e.g., "Like New") | `await page.locator('[role="dialog"] button:has-text("Like New")').tap()` |
| 9 | Assert drawer closes | `await expect(page.locator('[role="dialog"]:has-text("Item condition")')).not.toBeVisible()` |
| 10 | Assert condition row now shows selected value | `await expect(page.locator('text=/Like New/i')).toBeVisible()` |
| 11 | Assert condition row has `bg-selected border-selected-border` styling | Visual check |
| 12 | Assert description textarea is visible | `await expect(page.locator('textarea')).toBeVisible()` |
| 13 | Assert description character counter shows `0/2000` | `await expect(page.locator('text=0/2000')).toBeVisible()` |
| 14 | Type a description | `await page.locator('textarea').fill('Great condition, barely used. Perfect for gifting.')` |
| 15 | Assert character counter updates | `await expect(page.locator('text=/\/2000/')).toBeVisible()` |
| 16 | Assert photos grid is visible with "Add" button | `await expect(page.locator('text=/Photos/i')).toBeVisible()` |
| 17 | 📸 Screenshot | `sell-step3-details-filled` |

**Expected:**
- Condition selector renders as a `SelectionRow` (`h-14 rounded-xl border`).
- Tapping opens a `Drawer` with `DrawerContent` containing condition options (each `h-14 rounded-xl`).
- Dynamic attributes section appears if the selected category has DB-defined attributes.
- Description textarea has `rows={4}`, `maxLength={2000}`, character counter.
- Additional photos grid (`grid-cols-4 gap-2`) with an "Add" button.

---

### S8.8 — Step 4 (Pricing): price input, format, quantity, offers toggle

**Goal:** Verify the pricing step renders all controls: format selector, price input, quantity stepper, and accept-offers toggle.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to Step 4 (fill steps 1–3, then "Continue") | Steps 1–3 complete |
| 2 | Assert heading "Price & shipping" | `await expect(page.locator('h2:has-text("Price & shipping")')).toBeVisible()` |
| 3 | Assert format selector: two buttons (Fixed Price / Auction) in `grid-cols-2` | `await expect(page.locator('button:has-text("Fixed Price")').or(page.locator('[class*="grid-cols-2"] button').first())).toBeVisible()` |
| 4 | Assert Fixed Price is selected by default | `await expect(page.locator('button.bg-selected').first()).toBeVisible()` — or check `bg-selected border-selected-border` |
| 5 | Assert price input area with currency symbol `€` | `await expect(page.locator('text=€')).toBeVisible()` |
| 6 | Assert price input has `inputMode="decimal"` | `await expect(page.locator('input[inputmode="decimal"]')).toBeVisible()` |
| 7 | Assert price input placeholder "0.00" | `await expect(page.locator('input[placeholder="0.00"]')).toBeVisible()` |
| 8 | Enter price | `await page.locator('input[inputmode="decimal"]').first().fill('25.50')` |
| 9 | Assert currency button "EUR" with dropdown chevron | `await expect(page.locator('button:has-text("EUR")')).toBeVisible()` |
| 10 | Assert quantity stepper is visible with default value 1 | `await expect(page.locator('input[type="number"]')).toHaveValue('1')` |
| 11 | Tap quantity "+" button | `await page.locator('button[aria-label="Increase quantity"]').tap()` |
| 12 | Assert quantity updates to 2 | `await expect(page.locator('input[type="number"]')).toHaveValue('2')` |
| 13 | Assert "Accept offers" toggle row | `await expect(page.locator('text=/Accept offers/i')).toBeVisible()` |
| 14 | Assert Switch component is visible | `await expect(page.locator('[role="switch"]')).toBeVisible()` |
| 15 | Assert "Continue" button is now enabled (price > 0) | `await expect(page.locator('button:has-text("Continue")')).toBeEnabled()` |
| 16 | 📸 Screenshot | `sell-step4-pricing-filled` |

**Expected:**
- Format selector renders two iOS-style cards (`h-14 rounded-xl border`), Fixed Price active by default.
- Price input area (`h-16 px-4`) with `€` symbol and `text-3xl font-bold` input.
- Currency button opens a `Drawer` with currency options (EUR only for Bulgarian market).
- Quantity stepper with `−` / number / `+` in a `h-14 rounded-xl border` container.
- Accept-offers toggle row with `Handshake` icon and `Switch` component.

---

### S8.9 — Step 5 (Review): summary and "Publish Listing" button

**Goal:** Verify the Review step shows a summary of all filled data and the "Publish Listing" CTA in the footer.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to Step 5 (complete steps 1–4, "Continue" from Step 4) | All steps filled |
| 2 | Assert heading "Review & publish" | `await expect(page.locator('h2:has-text("Review & publish")')).toBeVisible()` |
| 3 | Assert subtitle | `await expect(page.locator('text=/Review your listing before publishing/i')).toBeVisible()` |
| 4 | Assert `ReviewField` renders summary sections (photos, title, category, condition, price) | Multiple summary rows visible |
| 5 | Assert edit buttons are present in review sections | Buttons that call `onEditStep` to navigate back |
| 6 | Assert footer shows "Publish Listing" button (not "Continue") | `await expect(page.locator('button:has-text("Publish Listing")')).toBeVisible()` |
| 7 | Assert "Publish Listing" button has `h-12 rounded-md text-base font-bold` | Computed style check |
| 8 | Assert "Publish Listing" button has Rocket icon | `await expect(page.locator('button:has-text("Publish Listing") svg')).toBeVisible()` |
| 9 | Assert "Publish Listing" is enabled (all required fields filled) | `await expect(page.locator('button:has-text("Publish Listing")')).toBeEnabled()` |
| 10 | 📸 Screenshot | `sell-step5-review-ready` |

**Expected:**
- `ReviewField` renders a summary of all form data.
- Each section has an "Edit" button that maps to the correct step (1=What, 3=Details, 4=Pricing).
- Footer replaces "Continue" with "Publish Listing" + `Rocket` icon (`weight="fill"`).
- Button is enabled only when: `images.length > 0 && title.trim().length >= 5 && categoryId && condition && price > 0`.

---

### S8.10 — Stepper header: dots, progress bar, back/close buttons

**Goal:** Verify the stepper header renders correctly across all steps with dots, progress, back, and close.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/sell` as seller | Step 1 active |
| 2 | Assert header is sticky at top | `await expect(page.locator('header.sticky')).toBeVisible()` — `sticky top-0 z-40` |
| 3 | Assert header has `bg-background/95 backdrop-blur-md` | Computed `backdropFilter` includes `blur` |
| 4 | Assert header has `border-b border-border/40` | Bottom border visible |
| 5 | Assert header has `pt-safe` for safe-area inset | Class `pt-safe` present |
| 6 | Assert 5 step dots are visible in center | `await expect(page.locator('header .rounded-full')).toHaveCount(5)` |
| 7 | Assert dot 1 is active: wider (`w-8` / 32px) and `bg-primary` | First dot width ≈ 32px |
| 8 | Assert dots 2–5 are inactive: narrow (`w-2` / 8px) and `bg-border` | Remaining dots width ≈ 8px |
| 9 | Assert progress bar below dots | `await expect(page.locator('header .h-0\\.5, header [class*="h-0.5"]')).toBeVisible()` |
| 10 | Assert progress bar shows ~20% fill (step 1 of 5) | Width of `bg-primary` inner div ≈ 20% |
| 11 | Assert back button (CaretLeft) is NOT visible on Step 1 | No `button[aria-label="Back"]` or CaretLeft icon visible |
| 12 | Assert close button (X) links to `/` | `await expect(page.locator('header a:has(svg)')).toHaveAttribute('href', /^\/(en)?(\/)?\/?$/)` |
| 13 | Navigate to Step 2 | Fill Step 1 + Continue |
| 14 | Assert back button (CaretLeft) IS visible on Step 2 | `await expect(page.locator('button[aria-label="Back"]')).toBeVisible()` |
| 15 | Assert dot 2 is now active, dots 1 already completed (`bg-primary` but narrow) | Dot 2 width ≈ 32px |
| 16 | 📸 Screenshot | `sell-stepper-header-step2` |

**Expected:**
- Header: `sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 pt-safe`.
- 5 `motion.div` dots: active dot `w-8 h-2 bg-primary rounded-full`, completed dots `w-2 bg-primary`, future dots `w-2 bg-border`.
- Progress bar: `h-0.5 bg-border/50` track with `bg-primary` fill animated via `motion.div`.
- Back button hidden on Step 1, visible on Steps 2–5 (`size-10 -ml-2 rounded-md hover:bg-muted`).
- Close button (X icon) links to `/`.

---

### S8.11 — Stepper footer: sticky bottom, safe-area padding, CTA states

**Goal:** Verify the stepper footer renders correctly with safe-area padding and state-appropriate CTAs.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/sell` as seller | Step 1 active |
| 2 | Assert footer is sticky at bottom | `await expect(page.locator('footer.sticky')).toBeVisible()` — `sticky bottom-0` |
| 3 | Assert footer has `bg-background/95 backdrop-blur-md` | Computed `backdropFilter` includes `blur` |
| 4 | Assert footer has `border-t border-border/40` | Top border visible |
| 5 | Assert footer has `pb-safe` for safe-area inset | Class `pb-safe` present |
| 6 | Assert "Continue" button dimensions: `w-full h-12 rounded-md text-base font-bold` | Computed height ≈ 48px, full width |
| 7 | Assert "Continue" button has ArrowRight icon | SVG icon present in button |
| 8 | Navigate to Step 5 (Review) | Complete steps 1–4 |
| 9 | Assert footer CTA changes to "Publish Listing" | `await expect(page.locator('button:has-text("Publish Listing")')).toBeVisible()` |
| 10 | Assert "Publish Listing" has Rocket icon | SVG icon in button |
| 11 | Assert footer max-width constraint `max-w-lg` | Check `max-w-lg` on inner div |
| 12 | 📸 Screenshot | `sell-stepper-footer-publish` |

**Expected:**
- Footer: `sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/40 px-4 pt-4 pb-safe`.
- Steps 1–4: "Continue" button with `ArrowRight` icon.
- Step 5: "Publish Listing" button with `Rocket weight="fill"` icon.
- All CTAs: `w-full h-12 rounded-md text-base font-bold gap-2.5`.
- Inner container: `mx-auto max-w-lg pb-4`.

---

### S8.12 — Stepper transitions: Framer Motion spring animations

**Goal:** Verify direction-aware slide transitions between steps using Framer Motion.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/sell` as seller | Step 1 active |
| 2 | Complete Step 1 and tap "Continue" | Fill title + photo, tap Continue |
| 3 | Observe forward transition | Step 1 exits left (`x: -100`), Step 2 enters from right (`x: 100 → 0`) |
| 4 | Assert Step 2 content is visible after animation | `await expect(page.locator('h2:has-text("Choose a category")')).toBeVisible()` |
| 5 | Tap Back button (CaretLeft) | `await page.locator('button[aria-label="Back"]').tap()` |
| 6 | Observe backward transition | Step 2 exits right (`x: 100`), Step 1 enters from left (`x: -100 → 0`) |
| 7 | Assert Step 1 content is visible after animation | `await expect(page.locator('h2:has-text("What are you selling?")')).toBeVisible()` |
| 8 | Assert content area scrolls to top on step change | `contentRef.scrollTo({ top: 0 })` is called |
| 9 | 📸 Screenshot | `sell-stepper-transition` |

**Expected:**
- Forward navigation: content slides left-to-right (`pageVariants` with `direction > 0`).
- Backward navigation: content slides right-to-left (`direction < 0`).
- Spring physics: `stiffness: 300, damping: 30`.
- `AnimatePresence mode="wait"` prevents two steps from rendering simultaneously.
- Content area resets scroll position to top on each step change.

---

### S8.13 — Back/forward navigation: data preserved between steps

**Goal:** Verify that navigating backward and forward preserves all entered data.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Complete Steps 1–3 with data | Title: "Test Product", 1 photo, category selected, condition: "Like New", description: "Great item" |
| 2 | Tap Back on Step 3 | Return to Step 2 |
| 3 | Assert category selection is preserved | Selected category path still visible |
| 4 | Tap Back on Step 2 | Return to Step 1 |
| 5 | Assert title is preserved | `await expect(page.locator('input').first()).toHaveValue('Test Product')` |
| 6 | Assert photo thumbnail is preserved | Photo grid still shows 1 image |
| 7 | Navigate forward to Step 3 again | Continue → Continue (or via category auto-advance) |
| 8 | Assert condition "Like New" is still selected | `await expect(page.locator('text=/Like New/i')).toBeVisible()` |
| 9 | Assert description is preserved | `await expect(page.locator('textarea')).toHaveValue('Great item')` |
| 10 | 📸 Screenshot | `sell-data-preserved-after-navigation` |

**Expected:**
- All form data is managed by `react-hook-form` via `SellFormProvider` and persists across step navigation.
- Photos, title, category, condition, attributes, description, and pricing all survive back/forward traversal.

---

### S8.14 — Draft auto-save: fill data → reload → data restored from localStorage

**Goal:** Verify that the 2-second debounce auto-save persists form data to `localStorage` and restores it on page reload.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Clear any existing draft | `await page.evaluate(() => localStorage.removeItem('sell-form-draft-v4'))` |
| 2 | Navigate to `/en/sell` as seller | Fresh form |
| 3 | Fill title: "Draft Test Product" | `await page.locator('input').first().fill('Draft Test Product')` |
| 4 | Upload a photo | `await fileInput.setInputFiles(...)` |
| 5 | Wait at least 3 seconds for auto-save to trigger | `await page.waitForTimeout(3000)` — 2s debounce + buffer |
| 6 | Assert localStorage has draft | `const draft = await page.evaluate(() => localStorage.getItem('sell-form-draft-v4')); expect(draft).toBeTruthy()` |
| 7 | Assert draft contains the title | `expect(JSON.parse(draft).title).toBe('Draft Test Product')` |
| 8 | Reload the page | `await page.reload()` |
| 9 | Wait for form to load and draft to restore | `await page.waitForLoadState('networkidle')` |
| 10 | Assert title is restored | `await expect(page.locator('input').first()).toHaveValue('Draft Test Product')` |
| 11 | Assert photo is restored (if URL stored in draft) | Photo grid shows image |
| 12 | 📸 Screenshot | `sell-draft-restored-after-reload` |

**Expected:**
- `SellFormProvider.saveDraft()` saves to `localStorage` key `sell-form-draft-v4` after 2s of inactivity.
- `loadDraft()` on mount checks for existing draft and restores if `images.length || title || categoryId`.
- Title, photos, category, condition, description, price — all restored from draft.
- `draftRestoredRef` prevents double-restoring.

---

### S8.15 — Draft clear: after publish or "New Listing"

**Goal:** Verify that `clearDraft()` removes the localStorage draft after successful publish and on "New Listing."

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Fill form and trigger auto-save | Wait 3s for draft to persist |
| 2 | Assert draft exists in localStorage | `await page.evaluate(() => localStorage.getItem('sell-form-draft-v4'))` is non-null |
| 3 | Complete all steps and tap "Publish Listing" | Full form flow |
| 4 | Wait for success screen or processing screen | `await expect(page.locator('text=/Published!/i').or(page.locator('text=/Publishing/i'))).toBeVisible({ timeout: 15000 })` |
| 5 | Assert draft is cleared | `const draft = await page.evaluate(() => localStorage.getItem('sell-form-draft-v4')); expect(draft).toBeNull()` |
| 6 | If success screen: tap "New" button | `await page.locator('button:has-text("New")').tap()` |
| 7 | Assert form resets to Step 1 with empty fields | Title empty, photo grid empty, step 1 active |
| 8 | Assert draft remains cleared | `expect(await page.evaluate(() => localStorage.getItem('sell-form-draft-v4'))).toBeNull()` |
| 9 | 📸 Screenshot | `sell-draft-cleared-after-publish` |

**Expected:**
- `clearDraft()` calls `localStorage.removeItem('sell-form-draft-v4')`.
- Called after successful `createListingAction` submission.
- Called after tapping "New" (Plus icon) button on success screen, which also resets form via `form.reset(defaultSellFormValuesV4)` and `setCurrentStep(1)`.

---

### S8.16 — SELL-001: attempt to publish from Review step

**Goal:** Reproduce and document SELL-001 — sell form stuck on Review step, cannot publish.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Complete all 5 steps with valid data | Title ≥5 chars, ≥1 photo, category, condition, price > 0 |
| 2 | Assert "Publish Listing" button is enabled on Step 5 | `await expect(page.locator('button:has-text("Publish Listing")')).toBeEnabled()` |
| 3 | Tap "Publish Listing" | `await page.locator('button:has-text("Publish Listing")').tap()` |
| 4 | Observe: does the form transition to processing/success? | Look for "Publishing..." or "Published!" |
| 5 | If stuck: assert no loading spinner appears | `await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 5000 })` |
| 6 | If stuck: check for error toast | `await page.locator('[data-sonner-toast]').textContent()` |
| 7 | If stuck: check browser console for errors | `page.on('console', msg => ...)` |
| 8 | 📸 Screenshot | `sell-001-publish-attempt` |
| 9 | Document result | Bug confirmed / fixed / cannot reproduce |

**Expected (if bug present):**
- Tapping "Publish Listing" does nothing — no loading state, no transition, no error.
- Form remains on Step 5 (Review).
- Likely cause: `form.handleSubmit()` validation failure or `onSubmit` callback issue.

**Expected (if fixed):**
- Processing screen appears ("Publishing..." with `CloudArrowUp` animation).
- Followed by success screen ("Published!") with `CheckCircle` icon, product preview card, action buttons.

---

### S8.17 — Payout gating: PayoutRequiredModal on publish without Stripe

**Goal:** Verify that attempting to publish without a ready Stripe Connect account shows the `PayoutRequiredModal`.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Log in as seller WITHOUT completed Stripe Connect setup | `details_submitted=false` or `charges_enabled=false` or `payouts_enabled=false` |
| 2 | Complete all steps with valid data | Full form filled |
| 3 | Tap "Publish Listing" | `await page.locator('button:has-text("Publish Listing")').tap()` |
| 4 | Assert `PayoutRequiredModal` appears | `await expect(page.locator('[role="dialog"]')).toBeVisible()` |
| 5 | Assert modal explains Stripe setup requirement | Look for "payout" or "Stripe" or "connect" text |
| 6 | Assert modal has action button (link to Stripe setup) | Button or link visible |
| 7 | 📸 Screenshot | `sell-payout-required-modal` |

**Expected:**
- `handleSubmit` checks `isPayoutReady(payoutStatus)` before submitting.
- If not ready: stores form data in `pendingSubmitData`, opens `PayoutRequiredModal`.
- Modal explains the requirement and provides a path to complete Stripe onboarding.
- Form data is NOT lost — preserved in `pendingSubmitData` state.

---

### S8.18 — No horizontal overflow on any step

**Goal:** Verify that no step in the sell wizard causes horizontal overflow or scroll.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/sell` as seller | Step 1 active |
| 2 | Assert no horizontal overflow on Step 1 | `const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth); expect(overflow).toBe(false)` |
| 3 | Navigate to Step 2 | |
| 4 | Assert no horizontal overflow on Step 2 | Same check |
| 5 | Navigate to Step 3, fill condition | |
| 6 | Assert no horizontal overflow on Step 3 | Same check |
| 7 | Navigate to Step 4, fill price | |
| 8 | Assert no horizontal overflow on Step 4 | Same check |
| 9 | Navigate to Step 5 | |
| 10 | Assert no horizontal overflow on Step 5 | Same check |
| 11 | 📸 Screenshot per step if overflow detected | `sell-overflow-step-{N}` |

**Expected:**
- `overflow-x-hidden` is set on the content `<main>` element in `StepperWrapper`.
- Content container: `mx-auto max-w-lg px-4 py-6` — comfortably within 393px viewport.
- No element (including modals, drawers, or uploaded photo grids) causes `scrollWidth > clientWidth`.
- Upload zone: `min-h-44` + `rounded-2xl` fits within padded container.

---

## Execution Evidence Log

> Required for release sign-off. Add one row per executed scenario.

| Scenario ID | Auto Result | Manual Result | Owner | Build/Commit | Screenshot/Video | Defect ID | Severity | Retest Result | Sign-off |
|-------------|-------------|---------------|-------|--------------|------------------|-----------|----------|---------------|---------|
| S8.1 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | `/sell` gate in `sell/client.tsx` | — | — | — | ✅ |
| S8.2 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Step 1 render in `step-what.tsx` + `photos-field.tsx` | — | — | — | ✅ |
| S8.3 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Upload flow in `photos-field.tsx` + `upload-zone.tsx` | — | — | — | ✅ |
| S8.4 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Thumbnail/remove/cover in `photo-thumbnail.tsx` + review field | — | — | — | ✅ |
| S8.5 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | `handleNext` flow in `mobile-layout.tsx` | — | — | — | ✅ |
| S8.6 | N/A (code trace) | ❌ Fail | Codex | working-tree (2026-02-11) | Category selector accepts non-leaf and auto-advances | SELL-001 | P0 | ❌ Fail | ✅ |
| S8.7 | N/A (code trace) | ⚠ Partial | Codex | working-tree (2026-02-11) | Details step works, but category correction path is miswired from review | SELL-STEP-002 | P1 | ⚠ Partial | ✅ |
| S8.8 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Pricing validation and controls in `step-pricing.tsx` | — | — | — | ✅ |
| S8.9 | N/A (code trace) | ⚠ Partial | Codex | working-tree (2026-02-11) | Review renders/publish CTA exists; hardcoded text and edit mapping issues remain | SELL-002 | P1 | ⚠ Partial | ✅ |
| S8.10 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Stepper header/progress in `stepper-wrapper.tsx` | — | — | — | ✅ |
| S8.11 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Sticky footer CTA + safe-area classes in `stepper-wrapper.tsx` | — | — | — | ✅ |
| S8.12 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Framer motion transitions in `stepper-wrapper.tsx` | — | — | — | ✅ |
| S8.13 | N/A (code trace) | ❌ Fail | Codex | working-tree (2026-02-11) | Review edit mapping sends Category/Condition to Step 3 instead of Step 2 | SELL-STEP-002 | P1 | ❌ Fail | ✅ |
| S8.14 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Draft save/restore in `sell-form-provider.tsx` (`sell-form-draft-v4`) | — | — | — | ✅ |
| S8.15 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Draft clear on publish/new listing in `sell-form-unified.tsx` | — | — | — | ✅ |
| S8.16 | N/A (code trace) | ❌ Fail | Codex | working-tree (2026-02-11) | Publish can fail on non-leaf category despite completed wizard state | SELL-001 | P0 | ❌ Fail | ✅ |
| S8.17 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Stripe payout gating modal in `sell-form-unified.tsx` + `payout-required-modal.tsx` | — | — | — | ✅ |
| S8.18 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | `overflow-x-hidden` + constrained container in `stepper-wrapper.tsx` | — | — | — | ✅ |

---

## Findings

| ID | Scenario | Severity | Description | Screenshot |
|----|----------|----------|-------------|------------|
| SELL-001 | S8.6, S8.16 | P0 | Root cause confirmed: Step 2 accepts any selected category and auto-advances (`step-category.tsx:32-41`) while publish enforces DB leaf-only (`sell.ts:225-230`). User can reach Review with invalid category, then publish fails. | N/A (code audit) |
| SELL-STEP-002 | S8.13 | P1 | Review "Category & Condition" edit maps to Step 3 instead of Step 2 (`step-review.tsx:18-23`), making category correction non-intuitive after publish failure. | N/A (code audit) |
| SELL-002 | S8.9 | P1 | Wizard remains partially inconsistent: mixed hardcoded UX copy and non-tokenized/legacy patterns in review and payout helper text block full refactor completion. | N/A (code audit) |
| SELL-I18N-003 | S8.9 | P2 | Hardcoded user-facing strings in review (`"Edit"`, `"Cover"`, shipping labels with emojis, Terms copy) bypass `next-intl`. | N/A (code audit) |
| SELL-CURRENCY-004 | S8.9 | P2 | Currency mismatch: schema enforces `EUR` but review UI still includes `BGN/USD` symbol map (`review-field.tsx`). | N/A (code audit) |

---

## Summary

| Metric | Value |
|--------|-------|
| Total scenarios | 18 |
| Passed | 13 |
| Failed | 3 |
| Partial | 2 |
| New bugs found | 3 (SELL-STEP-002, SELL-I18N-003, SELL-CURRENCY-004) |
| Known bugs confirmed | 2 (SELL-001, SELL-002) |
| Known bugs resolved | 0 |
| Blocked | 0 |
| Status | ✅ Complete (code audit) |
