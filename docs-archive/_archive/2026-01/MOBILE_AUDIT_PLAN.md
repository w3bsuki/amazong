# Mobile Audit & Refactor Plan (Tailwind v4 + Shadcn)

**Goal:** Achieve a clean, "eBay-style" C2C/B2B ecommerce look.
**Core Principles:**
*   **No "Flashy" Effects:** Remove all `shadow-lg`, `shadow-xl`, `animate-pulse`, `glow` effects.
*   **Flat & Clean:** Use borders and subtle background colors instead of shadows for depth.
*   **Mobile First:** Prioritize touch targets (40px+), readable text (14px+), and proper spacing.
*   **Strict Tailwind v4:** Use semantic tokens (`--spacing-touch`, `--color-border`) defined in `globals.css`.
*   **Shadcn Standard:** Ensure all components use standard shadcn primitives without custom "hacks".

---

## 1. Global Design System Cleanup

### Shadows & Effects
- [ ] **Audit `globals.css`:**
    - [ ] Redefine `--shadow-*` tokens to be minimal/flat (eBay style).
    - [ ] Remove or flatten `--shadow-lg`, `--shadow-xl` to be subtle borders or very faint shadows.
- [ ] **Remove Hardcoded Effects:**
    - [ ] Search and replace `shadow-lg`, `shadow-xl`, `shadow-2xl` with `shadow-sm` or `border`.
    - [ ] Search and replace `animate-pulse` with static skeletons or remove entirely if distracting.
    - [ ] Remove any `box-shadow` or `filter: drop-shadow` in custom CSS.

### Typography & Spacing
- [ ] **Mobile Text Sizes:**
    - [ ] Ensure body text is at least `14px` (`text-sm` or `--text-body`).
    - [ ] Limit `10px`/`11px` (`text-2xs`, `text-tiny`) to non-critical badges only.
- [ ] **Touch Targets:**
    - [ ] Verify all interactive elements are at least 40x40px (or have 40px padding areas).
    - [ ] Use `--spacing-touch` variables.

---

## 2. Component Refactoring (The "No-Glow" List)

Identify and clean up these specific components found to have "flashy" styles:

- [ ] **Charts (`components/ui/chart.tsx`):** Remove `shadow-xl`.
- [ ] **Skip Links (`components/shared/skip-links.tsx`):** Remove `shadow-lg`, make it flat/high-contrast.
- [ ] **Category Rail (`components/shared/category-rail.tsx`):** Remove `animate-pulse`, use simple gray background for loading.
- [ ] **Toasts (`components/providers/sonner.tsx`):** Remove `shadow-lg`, use `border`.
- [ ] **Plan Cards (`components/pricing/plan-card.tsx`):** Remove `animate-pulse`.
- [ ] **Sidebar (`components/layout/sidebar/sidebar-menu.tsx`):** Remove `animate-pulse`.
- [ ] **AI Elements (`components/ai-elements/prompt-input.tsx`, `components/ai/ai-chatbot.tsx`):** Remove `animate-pulse`, `shadow-lg`.
- [ ] **Plans Page (`app/[locale]/(plans)/_components/plans-page-client.tsx`):** Remove `animate-pulse`.

---

## 3. Onboarding & Dialogs Fix

The "weird" onboarding dialog needs a complete overhaul.

- [ ] **Refactor `components/common/geo-welcome-modal.tsx`:**
    - [ ] **Visuals:** Remove any glows, heavy shadows, or "pop-up" animations.
    - [ ] **Layout:** Ensure it looks native on mobile (bottom sheet or full-screen modal).
    - [ ] **Content:** Simplify the text and actions.
    - [ ] **Behavior:** Ensure it doesn't conflict with Cookie Consent or other modals.
- [ ] **General Dialog Audit (`components/ui/dialog.tsx`):**
    - [ ] Ensure `DialogOverlay` is a simple `bg-black/50` (or lighter).
    - [ ] Ensure `DialogContent` has no massive shadow, just a clean border.

---

## 4. Route-by-Route Mobile Audit Checklist

Execute this checklist for each major route on a mobile viewport (390px width).

### Routes to Check:
1.  [ ] **Home** (`/`)
2.  [ ] **Search Results** (`/search?q=...`)
3.  [ ] **Product Detail** (`/product/[slug]`)
4.  [ ] **Category Page** (`/category/[slug]`)
5.  [ ] **Cart** (`/cart`)
6.  [ ] **Checkout** (`/checkout`)
7.  [ ] **Auth** (`/auth/login`, `/auth/register`)
8.  [ ] **Account Dashboard** (`/account`)

### Checklist for Each Route:
- [ ] **No Horizontal Scroll:** Page fits 100% width.
- [ ] **Touch Targets:** All buttons/links are easy to tap (no "fat finger" issues).
- [ ] **No Glows/Shadows:** Design looks flat and clean.
- [ ] **Spacing:** No huge gaps (>24px) or tiny gaps (<4px) unless intentional.
- [ ] **Loading States:** No jarring `animate-pulse` effects; use subtle skeletons.
- [ ] **Shadcn Usage:** Components look consistent (buttons, inputs, cards).

---

## 5. Execution Plan

1.  **Step 1:** Fix `globals.css` shadows.
2.  **Step 2:** Refactor `geo-welcome-modal.tsx`.
3.  **Step 3:** Batch remove `shadow-lg`/`animate-pulse` from identified components.
4.  **Step 4:** Run the route audit and fix issues as they are found.
