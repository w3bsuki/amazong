# AMZN Design System & Style Guide

This document serves as the single source of truth for UI/UX patterns, ensuring a consistent, professional, and "app-like" experience across the platform.

**Core Philosophy:**
*   **Tight & Dense:** Avoid "huge gaps". Use 4px/8px grids.
*   **Pixel Perfect:** Strict alignment (e.g., `px-4` everywhere on mobile).
*   **Native Feel:** Snap scrolling, proper touch targets, no layout shifts.
*   **Semantic Tokens:** Use Tailwind v4 semantic tokens (e.g., `bg-secondary`, `text-tiny`) instead of hardcoded values.

---

## 1. Layout & Spacing

### The 4px Grid
We use a strict 4px baseline grid.
*   **Minimum Gap:** `4px` (`gap-1`, `p-1`, `m-1`)
*   **Standard Gap:** `8px` (`gap-2`) or `12px` (`gap-3`)
*   **Section Spacing:** `4px` to `12px` (Mobile), `24px` to `32px` (Desktop).

### Mobile Alignment Rules
*   **Horizontal Padding:** ALWAYS use **`px-4` (16px)** for the main container content.
    *   *Why?* Creates a perfect vertical alignment line down the left/right.
*   **Vertical Rhythm:** Use **`space-y-1` (4px)** or **`space-y-2` (8px)** between tight sections.
    *   *Avoid:* `space-y-0.5` (too jammed) or `space-y-6` (too loose) on mobile.

### Scrollable Rails (Horizontal Lists)
For horizontal scrolling lists (categories, products):
*   **Container:** `flex overflow-x-auto no-scrollbar snap-x snap-mandatory`
*   **Padding:** `px-4` (container) + `scroll-pl-4` (for snap alignment).
*   **Gap:** `gap-3` (12px) is the sweet spot.
*   **Touch Optimization:** Add `touch-action-manipulation` to prevent browser zoom/delay on tap.

---

## 2. Typography

Use the semantic type scale defined in `globals.css`.

| Token | Size | Line Height | Usage |
| :--- | :--- | :--- | :--- |
| `text-2xs` | 10px | 14px | **Badges only**. Too small for reading. |
| `text-tiny` | 11px | 16px | Helper text, secondary labels. *Use sparingly.* |
| `text-xs` | 12px | 16px | Captions, timestamps, tertiary text |
| `text-sm` | 14px | 20px | **Body text**, standard labels |
| `text-base` | 16px | 24px | Headings, prices, emphasis |

**Font Weights:**
*   `font-regular` (400): Body text.
*   `font-medium` (500): Interactive elements (tabs, pills), secondary headings.
*   `font-semibold` (600): Prices, primary headings, buttons.
*   `font-bold` (700): Hero titles, major emphasis.

---

## 3. Colors & Theming

Always use semantic tokens. Never hardcode hex values.

### Backgrounds
*   `bg-background`: Main page background.
*   `bg-card`: Cards, modals, sheets.
*   `bg-secondary`: Secondary elements (category circles, pills).
*   `bg-muted`: Disabled states, skeletons, subtle backgrounds.

### Text
*   `text-foreground`: Primary text.
*   `text-muted-foreground`: Secondary text.
*   `text-primary`: Brand color text.
*   `text-cta-trust-blue-text`: Text on blue CTA backgrounds.

### Interactive & CTAs
*   `bg-cta-trust-blue`: **Primary Call-to-Action** (Buy Now, Sign In). The core "Trust Blue".
*   `bg-cta-primary`: Generic primary actions.
*   `bg-cta-add-cart`: Specific for "Add to Cart" actions.
*   `bg-secondary` + `hover:bg-secondary/80`: Secondary actions.

### Domain-Specific Tokens
We have specialized tokens for e-commerce states. Use these instead of generic colors.

**Prices:**
*   `text-price-regular`: Standard price.
*   `text-price-sale`: Discounted price (usually red/orange).
*   `text-price-original`: Strikethrough original price.
*   `text-price-savings`: "You save $X" text.

**Stock & Shipping:**
*   `text-stock-available`: In stock (green-ish).
*   `text-stock-low`: Low stock warning (orange-ish).
*   `text-stock-out`: Out of stock (red/gray).
*   `text-shipping-free`: Free shipping label.
*   `text-shipping-express`: Express shipping label.

**Deals & Trust:**
*   `bg-deal` / `text-deal`: Deal badges.
*   `text-verified`: Verified purchase/seller checkmarks.
*   `text-top-rated`: Top rated seller icons.
*   `text-rating`: Star rating stars (filled).
*   `text-rating-empty`: Empty stars.

**Account & Dashboard:**
*   `bg-account-stat-bg`: Background for stat cards.
*   `text-account-stat-value`: Big numbers in stats.
*   `text-account-stat-label`: Labels in stats.

---

## 4. Components

### Category Circles (Mobile)
*   **Size:** `size-14` (56px). *Exceeds 44px min touch target.*
*   **Icon:** `26px` (`text-primary`).
*   **Background:** `bg-secondary` (Light Gray).
*   **Border:** `border border-border/40`.
*   **Shadow:** None (Flat design).
*   **Text:** `text-tiny`, `font-medium`, `text-center`.

### Quick Pills (Filter Tabs)
*   **Height:** `h-8` (32px). *Visually compact, but ensure wide padding.*
*   **Padding:** `px-4` (16px).
*   **Radius:** `rounded-full`.
*   **Typography:** `text-xs`, `font-medium`.
*   **Active State:** `bg-cta-trust-blue text-cta-trust-blue-text shadow-sm`.
*   **Inactive State:** `bg-muted text-muted-foreground hover:bg-muted/80`.

### Product Cards
*   **Padding:** `p-2` or `p-3`.
*   **Border:** `border-border`.
*   **Radius:** `rounded-xl`.
*   **Image:** Aspect ratio `square` or `4/5`.

---

## 5. Touch Targets & "Modern Dense" Philosophy

We follow a **"Modern Dense"** approach similar to Amazon, Temu, and eBay. We prioritize information density while maintaining usability through smart spacing.

### The "Safe Area" Rule
*   **Max Touch Target:** **40px** is our strict maximum.
    *   **40px (Max Standard):** Used for primary inputs, search bars, and main navigation. We do **not** use 44px.
    *   **36px (Dense Standard):** Used for secondary buttons and dense lists.
*   **Dense Actions (Contextual):** Can be **32px - 36px** (e.g., Filter pills, "Add to Cart" in lists).

### Standard Sizes
*   **Inputs / Selects:** `h-10` (40px) is the standard.
*   **Primary Buttons:** `h-10` (40px) is the max size.
*   **Secondary / Dense Buttons:** `h-9` (36px) or `h-8` (32px).
*   **Icon Buttons:** `size-9` (36px) or `size-10` (40px).
*   **Secondary / Dense Buttons:** `h-9` (36px) or `h-8` (32px).
*   **Icon Buttons:** `size-9` (36px) or `size-10` (40px).

### Touch Optimization
*   **Manipulation:** Always add `touch-action-manipulation` to interactive elements to remove the 300ms tap delay on mobile.
*   **Focus Rings:** Ensure `focus-visible:ring-2` is present for accessibility, even on smaller elements.

---

## 6. Tailwind v4 & Shadcn Theming

We use **Tailwind CSS v4** with a CSS-first configuration.

### Configuration
*   **Theme Source:** All theme tokens are defined in `app/globals.css` using the `@theme` directive.
*   **No Config JS:** We avoid `tailwind.config.ts` for theme values. Use CSS variables instead.
*   **Semantic Tokens:** Use the semantic aliases (e.g., `--color-brand`, `--spacing-touch`) defined in the CSS.

### Shadcn Compatibility
*   We use **CSS Variables** for all shadcn components (`--primary`, `--secondary`, etc.).
*   **Radius:** Controlled by `--radius` variable.
*   **Colors:** All colors use the `oklch()` color space for better gamut and interpolation.

---

## 7. "Don'ts" (Anti-Patterns)

*   ❌ **Don't** use `shadow-sm` on small interactive elements (circles, pills) unless active. Keep it flat.
*   ❌ **Don't** mix padding sizes (e.g., `px-2` then `px-4`). Stick to `px-4` for containers.
*   ❌ **Don't** use `text-[11px]`. Use `text-tiny`.
*   ❌ **Don't** leave "huge gaps". If a gap looks bigger than 16px on mobile, question it.
