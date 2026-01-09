# Agent Design Guide: "Invisible Utility"

**Objective:** Create a mobile-first marketplace interface that feels native, utilitarian, and instant.
**Reference Style:** eBay Mobile, Vinted, Native iOS Settings.

## 1. Core Principles

### A. The "No Scale" Rule
*   **Forbidden:** Do NOT use `active:scale-95` or bouncy animations.
*   **Required:** Use `active:opacity-70` or `active:bg-gray-100` for touch feedback.
*   **Reasoning:** Scale animations feel "webby" and slow. Opacity/Color changes feel "native" and instant.

### B. The "Border Over Shadow" Rule
*   **Forbidden:** Deep drop shadows (`shadow-xl`, `shadow-2xl`) for cards.
*   **Required:** Use 1px borders (`border border-gray-100` or `border-gray-200`).
*   **Reasoning:** Flat designs with distinct borders are easier to scan on mobile screens than elevated cards.

### C. Typography & Density
*   **Font:** Inter or San Francisco.
*   **Sizes:** 
    *   `text-[11px]` + Uppercase + Bold for Labels (Metadata).
    *   `text-[16px]` for Body (prevents iOS zoom on inputs).
    *   `text-[22px]`+ for Prices/Headlines.
*   **Spacing:** Tighten gaps. Use `gap-2` or `gap-3` by default. Avoid `gap-6` or `gap-8` unless separating major sections.

## 2. Color Palette (Zinc/Slate)
Do not use colored backgrounds for layout. Use Whites and Grays.

| Variable | Tailwind Class | Hex (Ref) | Usage |
| :--- | :--- | :--- | :--- |
| Background | `bg-white` | #FFFFFF | Cards, Headers, Modals |
| Canvas | `bg-gray-50` | #F9FAFB | App Background, Inputs |
| Text Primary | `text-gray-900` | #0F172A | Headings, Prices |
| Text Secondary | `text-gray-500` | #64748B | Metadata, Subtitles |
| Border | `border-gray-200` | #E2E8F0 | Dividers, Inputs |
| Brand/Action | `bg-gray-900` | #0F172A | Primary Buttons (Black) |

## 3. Mobile Ergonomics
*   **Touch Targets:** Minimum height `42px` for buttons.
*   **Safe Areas:** Always use `pb-safe` (padding-bottom: env(safe-area-inset-bottom)) for fixed footers.
*   **Sticky Elements:** Headers and Action Footers should be `sticky` or `fixed`.
