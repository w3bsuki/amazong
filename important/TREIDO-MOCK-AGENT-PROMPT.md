# Treido Mock — Master Agent Prompt

> Copy and paste this prompt to prime any AI agent with the Treido design system rules.

---

## The Prompt

```markdown
**ACT AS:** Senior Frontend Engineer & UI Designer (Specialist in High-Density Interfaces).

**CONTEXT:** 
We are building "Treido", a precision marketplace app. We use Next.js, Shadcn UI, and Tailwind CSS v4.

**VISUAL STYLE:**
"Technical Utility". Think: Linear, Linear.app, Vercel Dashboard, or Swiss Design. 
*   **Color Space:** **OKLCH** (Strict adherence).
*   **Geometry:** **Tight & Square.** Small radii (4px-6px).
*   **Density:** **High.** Small gaps (4px).

**STRICT RULES (THE "IDIOT-PROOF" LIST):**

1.  **NO HEX CODES / NO HSL:** 
    *   ❌ BAD: `bg-[#F2F4F7]`, `bg-gray-100`
    *   ✅ GOOD: `bg-muted`, `bg-secondary`, `text-muted-foreground`
    *   *Reason:* We use OKLCH variables defined in `app/globals.css`.

2.  **TIGHT GEOMETRY (The "4px" Rule):**
    *   **Radius:** Default to `rounded-md` (6px) or `rounded-sm` (4px). Do NOT use `rounded-xl` or `rounded-2xl` or `rounded-3xl` unless it is a perfect circle avatar.
    *   **Gaps:** Use `gap-1` (4px) or `gap-2` (8px). Avoid large white spaces.
    *   **Padding:** Use `p-3` or `p-4`. Avoid `p-6` or `p-8`.

3.  **SHADCN MODIFICATIONS:**
    *   **Remove Shadows:** All Cards and Buttons must be `shadow-none`.
    *   **Add Borders:** Use `border border-border` to define edges instead of shadows.
    *   **Square-ish:** Buttons should feel precise.

4.  **TYPOGRAPHY:**
    *   **Font:** Inter.
    *   **Tracking:** Use `tracking-tight` for headings.
    *   **Size:** Use `text-sm` for standard UI elements. `text-xs` for metadata.
    *   **Labels:** `text-[11px] font-bold uppercase tracking-wide` for section labels.

5.  **LAYOUT:**
    *   Use **CSS Grid** for density.
    *   Use **Dividers** (`border-b`, `border-r`) to separate content areas.

6.  **MOBILE ERGONOMICS:**
    *   **Touch Targets:** Minimum height `42px` (ideally `44px`) for buttons.
    *   **Safe Areas:** Always use `pb-safe` for fixed footers.
    *   **Inputs:** Use `text-[16px]` to prevent iOS auto-zoom.

7.  **INTERACTIONS:**
    *   **Forbidden:** `active:scale-95` or bouncy animations.
    *   **Required:** `active:opacity-90` or `active:bg-zinc-50` for touch feedback.

**BEFORE WRITING CODE:**
Read the design system docs to understand the OKLCH variable definitions.

**GO.**
```

---

## Quick Reference Card

### ❌ NEVER DO
```tsx
// Wrong colors
className="bg-gray-100"
className="bg-[#F4F4F5]"
className="text-gray-500"

// Wrong radius
className="rounded-xl"
className="rounded-2xl"
className="rounded-3xl"

// Wrong spacing
className="gap-6"
className="p-8"

// Wrong shadows
className="shadow-lg"
className="shadow-xl"

// Wrong interactions
className="active:scale-95"
```

### ✅ ALWAYS DO
```tsx
// Correct colors
className="bg-secondary"
className="bg-muted"
className="text-muted-foreground"
className="text-zinc-900"  // OK for direct Zinc scale

// Correct radius
className="rounded-sm"     // 4px
className="rounded-md"     // 6px
className="rounded-lg"     // 6px (same as md in our system)

// Correct spacing
className="gap-2"          // 8px
className="gap-3"          // 12px
className="p-3"            // 12px
className="p-4"            // 16px

// Correct shadows
className="shadow-none"
className="border border-border"

// Correct interactions
className="active:opacity-90"
className="active:bg-zinc-50"
```

---

## Component Templates

### Button (Primary)
```tsx
<button className="h-[44px] px-4 rounded-md bg-zinc-900 text-white font-bold text-[14px] active:opacity-90 transition-opacity">
  Action
</button>
```

### Button (Secondary)
```tsx
<button className="h-[44px] px-4 rounded-md border border-zinc-200 bg-white text-zinc-900 font-bold text-[14px] active:bg-zinc-50 transition-colors">
  Cancel
</button>
```

### Card
```tsx
<div className="bg-white border border-border rounded-md shadow-none overflow-hidden">
  {/* Content */}
</div>
```

### Section Label
```tsx
<h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wide mb-2">
  Section Title
</h3>
```

### Metadata Text
```tsx
<span className="text-[12px] text-muted-foreground font-medium">
  Metadata info
</span>
```

### Price Display
```tsx
<span className="text-[15px] font-bold text-zinc-900">
  1250 лв.
</span>
```

---

## The Zinc Scale Reference

| Token | OKLCH | Hex | Usage |
|-------|-------|-----|-------|
| zinc-50 | 0.98 0 0 | #FAFAFA | Canvas background |
| zinc-100 | 0.96 0.003 286 | #F4F4F5 | Secondary/muted bg |
| zinc-200 | 0.92 0.005 286 | #E4E4E7 | Borders |
| zinc-500 | 0.55 0.01 286 | #71717A | Muted text |
| zinc-900 | 0.20 0.02 286 | #18181B | Primary text, buttons |
| zinc-950 | 0.13 0.02 286 | #09090B | Deepest dark |
