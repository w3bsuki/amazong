# 📐 TREIDO MASTER STYLE GUIDE

**Status:** ACTIVE
**Stack:** Next.js 14, Tailwind v4, Shadcn UI
**Aesthetic:** "Invisible Utility" (Ref: Linear, Vercel, iOS Settings)

---

## 1. THE LAWS OF PHYSICS (Strict Rules)

### 🔴 The Anti-Patterns (NEVER DO THIS)
*   ❌ **No Drop Shadows:** Never use `shadow-md`, `shadow-lg`, or `shadow-xl`. They look cheap on mobile.
    *   *Alternative:* Use `border border-zinc-200`.
*   ❌ **No Large Radius:** Never use `rounded-2xl` or `rounded-3xl` for cards.
    *   *Alternative:* Use `rounded-md` (6px) or `rounded-lg` (8px).
*   ❌ **No "Floaty" Elements:** Things should feel attached to the grid.
*   ❌ **No Bouncy Animations:** No `spring` or `bounce`. Use `duration-200 ease-out`.
*   ❌ **No Stacking Headers:** Never stack more than 3 rows in the sticky header (App Header + Nav Row + Optional Filter). Ideally 2 rows.

### 🟢 The Patterns (ALWAYS DO THIS)
*   ✅ **The "Zinc" Palette:**
    *   Background: `bg-white` (Cards) or `bg-zinc-50` (App Background).
    *   Text: `text-zinc-900` (Primary), `text-zinc-500` (Secondary).
    *   Border: `border-zinc-200` (Standard), `border-zinc-100` (Subtle).
*   ✅ **The "Touch Target" Standard:**
    *   Headers: `h-[48px]`.
    *   Bottom Nav: `h-[48px]`.
    *   Inputs/Buttons: `h-[44px]` (Minimum for easy tapping).
*   ✅ **The "Active" State:**
    *   Buttons/Cards must react to touch.
    *   Use `active:bg-zinc-100` or `active:opacity-70`.

---

## 2. TAILWIND TOKENS (Reference)

We use **Tailwind v4**. Configuration is in `app/globals.css`.

| Token | Class | Value (Visual Description) |
| :--- | :--- | :--- |
| **Radius** | `rounded-md` | **6px** (The standard for cards/inputs) |
| **Small Radius** | `rounded-sm` | **4px** (For inner badges/tags) |
| **Border** | `border-border` | **Zinc 200** (#E4E4E7) - Crisp grey |
| **App Bg** | `bg-secondary` | **Zinc 50** (#FAFAFA) - Off-white |
| **Card Bg** | `bg-white` | **White** (#FFFFFF) |
| **Primary** | `bg-primary` | **Zinc 900** (#18181B) - Soft Black |
| **Input Bg** | `bg-input` | **Zinc 50** (#FAFAFA) - Distinguishes from card |

---

## 3. TYPOGRAPHY HIERARCHY

Font: **Inter** (Variable).

*   **Page Title:** `text-[16px] font-bold text-zinc-900`.
*   **Card Title:** `text-[13px] font-medium text-zinc-900 leading-tight`.
*   **Price:** `text-[16px]` or `text-[20px]` font-bold text-zinc-900 tracking-tight.
*   **Metadata:** `text-[10px]` or `text-[11px]` font-bold text-zinc-400 uppercase tracking-wide.
*   **Input Text:** `text-[16px]` (Crucial to prevent iOS zoom).

---

## 4. LAYOUT RHYTHM

*   **Container Padding:** `px-3` (12px) is the standard horizontal padding.
*   **Grid Gap:** `gap-2` (8px). Tighter than standard web design.
*   **Section Spacing:** `py-3` or `py-4`.
*   **Sticky Header:** Always `sticky top-0 z-40 bg-white shadow-sm`.
*   **Fixed Footer:** Always `fixed bottom-0 w-full bg-white border-t border-zinc-200 pb-safe`.

---

## 5. REFACTORING STRATEGY (For Agents)

When asked to update an existing component:
1.  **Strip Shadows:** Remove all `shadow-*` classes.
2.  **Add Borders:** Add `border border-zinc-200`.
3.  **Tighten Radius:** Change `rounded-xl` to `rounded-md`.
4.  **Fix Heights:** Ensure headers/inputs are `h-[48px]` or `h-[44px]`.
5.  **Check Backgrounds:** Ensure `bg-zinc-50` is used for the page, `bg-white` for cards.