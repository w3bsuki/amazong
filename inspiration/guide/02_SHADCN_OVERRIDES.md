# 02. Shadcn Component Overrides (Technical/Tight)

**Role:** Frontend Architect
**Context:** Instructions for overriding Shadcn defaults. When you install a Shadcn component, modify the code immediately to match these rules.

## 1. Button (`components/ui/button.tsx`)

**Goal:** Rectangular, precise, tactile. No "pill" shapes for default buttons.

*   **Radius:** `rounded-md` (6px).
*   **Variants:**
    *   `default`: `bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 active:scale-[0.99]`
    *   `outline`: `border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900`
    *   `secondary`: `bg-zinc-100 text-zinc-900 hover:bg-zinc-200`
    *   `ghost`: `hover:bg-zinc-100 text-zinc-900`
*   **Height:** `h-10` (40px) or `h-[44px]` (44px) for touch.
*   **Focus:** Remove `ring-offset`. Use `focus-visible:ring-1 focus-visible:ring-zinc-900`.

## 2. Input (`components/ui/input.tsx`)

**Goal:** Structured data entry. Distinct from the white surface.

*   **Background:** `bg-zinc-50` (Zinc 50). This differentiates inputs from white cards.
*   **Border:** `border-zinc-200` -> Focus `border-zinc-900`.
*   **Radius:** `rounded-md` (6px).
*   **Font Size:** `text-[16px]` (16px) to prevent iOS zoom.
*   **Height:** `h-[44px]` minimum.

## 3. Card (`components/ui/card.tsx`)

**Goal:** Data containment.

*   **Container:** `rounded-md border border-zinc-200 bg-white text-zinc-900 shadow-none`.
*   **Padding:** Remove default large padding. Use utility classes `p-3` or `p-4` directly.
*   **Shadow:** **FORBIDDEN**. Use Borders.

## 4. Sheet / Drawer

*   **Mobile:** Use `vaul` (Drawer) style.
*   **Corner:** `rounded-t-xl`.
*   **Overlay:** `bg-black/40` backdrop blur (Standard iOS feel).

## 5. Separator

*   **Color:** `bg-zinc-200`.
*   **Usage:** Use frequently to divide lists instead of massive whitespace.