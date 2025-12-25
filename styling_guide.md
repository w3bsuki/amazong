# Product Page Styling Guide

This guide documents the design patterns and styling rules used to create the high-conversion "Marketplace" product page (eBay-inspired).

## 1. Color Palette

*   **Primary Action Color (eBay Blue):** `#3665f3`
    *   Used for: "Buy It Now" button, Links, "Add to Cart" border/text.
    *   Hover state: `blue-700` or `bg-blue-50` for outlines.
*   **Secondary Action Color:** `slate-900` (Black/Dark Gray)
    *   Used for: Primary text, Headings, "Add to Watchlist" icon.
*   **Urgency/Alert Color:** `red-600` or `orange-500`
    *   Used for: "Trending" icons, "Low Stock" warnings, Sold counts.
*   **Backgrounds:**
    *   Page: `bg-background` (White)
    *   Sections/Containers: `bg-gray-50` or `bg-gray-100` for separation.
    *   Borders: `border-gray-200` or `border-gray-300`.

## 2. Typography & Hierarchy

*   **Product Title:**
    *   `text-2xl` or `text-3xl`, `font-bold`, `text-slate-900`.
    *   Leading should be `snug` or `tight`.
*   **Price:**
    *   **Sale Price:** `text-3xl`, `font-bold`, `text-slate-900`, `tracking-tight`.
    *   **Original Price:** `text-sm`, `text-gray-500`, `line-through`.
    *   **Currency:** Always formatted with `Intl.NumberFormat`.
*   **Labels:**
    *   `text-sm`, `font-normal`, `text-slate-900` (e.g., "Price:", "Condition:", "Shipping:").
    *   Fixed width for alignment (e.g., `min-w-[60px]`).

## 3. Layout Patterns

### The "Buy Box" (Right Column)
*   **Sticky Positioning:** `sticky top-24` to stay visible while scrolling.
*   **Clean Container:** `border-none`, `shadow-none` (blends with page) OR subtle border if needed.
*   **Information Density:** High. Use compact vertical spacing (`space-y-3` or `space-y-4`).
*   **Seller Strip:**
    *   Located immediately under the title.
    *   Format: `[Seller Name] (Score) | [Feedback %] | [Links]`.
    *   Use `text-sm` and `text-blue-700` for links.

### Urgency & Social Proof
*   **Trending Box:**
    *   `bg-gray-100`, `rounded-lg`, `p-4`.
    *   Icons: `Zap` (Red), `Eye` (Black).
    *   Text: **Bold** statement + regular detail (e.g., "**This one's trending.** 104 sold.").

### Buttons & Inputs
*   **Primary Buttons:**
    *   Shape: `rounded-full` (Pill shape).
    *   Height: `h-12` (Large touch target).
    *   Font: `text-lg`, `font-bold`.
    *   Width: `w-full`.
*   **Inputs (Quantity):**
    *   `text-center`, `w-20`.
    *   Placed next to stock status.

## 4. Component Specifics

### "Find Similar Items" Bar
*   Placed above the main grid.
*   `bg-gray-50`, `border`, `rounded-lg`.
*   Contains: Seller Avatar, Seller Name, Small thumbnails of other items.

### Shipping & Returns Table
*   Simple text rows with icons (`Truck`, `RotateCcw`, `ShieldCheck`).
*   `text-sm`.
*   Gray text for details, Black bold text for headers.

## 5. "Styling Ideas" / Cross-Sell Section
*   **Container:** `bg-gray-50`, `rounded-xl`, `p-8`.
*   **Layout:** Flex or Grid.
*   **Cards:** Clean white cards, `shadow-sm`, `border-none` or subtle border.
*   **Bundle Logic:** Main Item + Accessories = Total Price.

---

**Goal:** Create a sense of trust, urgency, and value. Prioritize information density and clear calls to action.
