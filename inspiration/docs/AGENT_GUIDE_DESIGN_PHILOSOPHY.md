# Agent Design Guide: "Invisible Utility"

**Objective:** Create a mobile-first marketplace interface that feels native, utilitarian, and instant.
**Reference Style:** eBay Mobile, Vinted, Native iOS Settings.

## 1. Core Principles

### A. The "No Scale" Rule
*   **Forbidden:** Do NOT use bouncy `scale-90` animations for main navigation.
*   **Required:** Use `active:opacity-70` or `active:bg-zinc-100` for touch feedback.
*   **Reasoning:** Scale animations feel "webby". Opacity changes feel "native" (iOS style).

### B. The "Border Over Shadow" Rule
*   **Forbidden:** Deep drop shadows (`shadow-xl`, `shadow-2xl`) for cards.
*   **Required:** Use 1px borders (`border border-zinc-200`).
*   **Reasoning:** Flat designs with distinct borders are easier to scan on mobile screens.

### C. The "48px Rhythm" (New)
*   **Strict Rule:** All Headers and Bottom Navigation bars must be exactly `h-[48px]`.
*   **Reasoning:** 48px is the perfect touch target size and creates vertical symmetry.

## 2. Navigation Patterns

### A. "Double Decker" Focus Mode (Deep Hierarchy)
When a user selects a category, **split the UI**:
1.  **Row 1 (Context):** A dedicated row for "Back" and "Current Category".
2.  **Row 2 (Options):** A dedicated full-width row for the *next* choices.
*   **Why:** Prevents cramping. "Back" buttons should not fight for space with "Next" buttons.

### B. The "Command Strip" Bottom Nav
*   **No Floating:** The bottom nav must be `w-full`, fixed to the bottom, solid white.
*   **Center Button:** The "Sell" button can be distinct (e.g., black square `w-[34px]`) but must fit within the grid.

## 3. Typography & Density
*   **Font:** Inter.
*   **Sizes:** 
    *   `text-[10px]` + Uppercase + Bold for Labels.
    *   `text-[16px]` for Body/Inputs.
    *   `text-[22px]`+ for Prices.
*   **Spacing:** Tighten gaps. `gap-2` (8px) is the default unit.

## 4. Mobile Ergonomics
*   **Touch Targets:** Minimum height `40px` for tappable buttons.
*   **Safe Areas:** Always use `pb-safe` and `pt-safe-top`.
*   **Sticky Elements:** Headers are `sticky top-0`. Footers are `fixed bottom-0`.