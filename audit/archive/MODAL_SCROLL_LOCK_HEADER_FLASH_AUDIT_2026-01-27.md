# Modal Scroll Lock & Header Flash Audit

**Date:** January 27, 2026  
**Scope:** Desktop Modal Scroll Lock + Sticky Header Flash Issue  
**Priority:** HIGH — Affects perceived polish and UX quality

---

## Executive Summary

When opening/closing Radix Dialog modals on desktop, a visual "flash" or "jitter" is observed in the sticky header. This occurs because **react-remove-scroll** (used internally by Radix) modifies body styles dynamically, which can cause layout shifts and stacking context changes.

**Root Cause:** Conflict between:
1. `react-remove-scroll` — JS library that adds `position: relative` + `padding-right` to body when modals open
2. CSS approaches like `scrollbar-gutter: stable` — reserves scrollbar space permanently
3. Sticky header positioning — relies on stable body layout

---

## Table of Contents

1. [Problem Description](#problem-description)
2. [Technical Deep Dive](#technical-deep-dive)
3. [What react-remove-scroll Does](#what-react-remove-scroll-does)
4. [Solutions Analysis](#solutions-analysis)
5. [Recommended Fix](#recommended-fix)
6. [Implementation](#implementation)
7. [Testing](#testing)

---

## Problem Description

### Symptoms

1. **Header "flash"** — When a Dialog opens or closes, the sticky header briefly jumps/flashes
2. **Layout shift** — Content appears to shift left/right by ~17px (scrollbar width)
3. **Visual jitter** — Elements briefly re-render during modal state transitions

### Reproduction Steps

1. Navigate to `http://localhost:3000/en` (homepage)
2. Scroll down to see the product listing feed
3. Click on any product card that opens a quickview modal (uses intercepting routes)
4. Observe the header area when the modal opens
5. Close the modal (click X, click backdrop, or press Escape)
6. **Observe:** Header "flashes" or appears to briefly jitter

### Affected Components

| Component | File | Role |
|-----------|------|------|
| Dialog | `components/ui/dialog.tsx` | Modal wrapper using `@radix-ui/react-dialog` |
| AppHeader | `components/layout/header/app-header.tsx` | Sticky header (`sticky top-0 z-50`) |
| ProductRouteModal | `app/[locale]/(main)/search/_components/product-route-modal.tsx` | Intercepting route modal |

---

## Technical Deep Dive

### The Scroll Lock Problem

When a modal opens, the background page must be prevented from scrolling. There are two main approaches:

#### Approach 1: JS-based (react-remove-scroll)

```tsx
// What Radix Dialog does internally via react-remove-scroll:
body {
  position: relative;        // NEW: added to body
  overflow: hidden;          // Prevent scroll
  padding-right: 17px;       // Compensate for removed scrollbar
}
```

**Pros:** Works on all browsers, compensates for scrollbar width  
**Cons:** Modifies body styles, can cause layout shifts

#### Approach 2: CSS-native (scrollbar-gutter)

```css
html {
  scrollbar-gutter: stable;  /* Always reserve scrollbar space */
}
```

**Pros:** No JS, no layout shift when scrollbar appears/disappears  
**Cons:** Modern browsers only, doesn't prevent scroll alone

### The Conflict

When both approaches are used together:

1. `scrollbar-gutter: stable` reserves 17px permanently
2. When modal opens, `react-remove-scroll` adds `padding-right: 17px`
3. **Result:** Double compensation = 34px shift = visual glitch

### Why the Header Flashes

The sticky header (`position: sticky; top: 0`) is affected because:

1. **Stacking Context Change:** Adding `position: relative` to body can create a new stacking context
2. **Reflow Trigger:** Any change to body padding/position causes the browser to reflow
3. **Animation Timing:** The modal fade-in animation and body style changes happen asynchronously
4. **GPU Compositing:** Some elements may need to be re-composited, causing visible flicker

---

## What react-remove-scroll Does

`react-remove-scroll` is a React library used by Radix primitives (Dialog, DropdownMenu, etc.) to:

1. Prevent background scroll when modals are open
2. Preserve scroll position
3. Handle iOS Safari quirks
4. Compensate for scrollbar removal

### Source Code Insight

When a Dialog opens, react-remove-scroll:

```js
// Simplified from react-remove-scroll source
const lockStyles = {
  position: 'relative',
  overflow: 'hidden',
  // Calculate scrollbar width dynamically
  paddingRight: `${getScrollbarWidth()}px`,
};

// Applied to body
document.body.style.position = lockStyles.position;
document.body.style.overflow = lockStyles.overflow;
document.body.style.paddingRight = lockStyles.paddingRight;
```

### The position: relative Problem

When `position: relative` is added to body:

1. Any absolutely positioned children are now relative to body (usually already the case)
2. **New stacking context** may be created in some cases
3. Fixed/sticky positioned elements can be affected by ancestor changes
4. Browser triggers a **reflow + repaint** cycle

---

## Solutions Analysis

### Solution 1: Remove scrollbar-gutter (Current)

```css
html {
  /* scrollbar-gutter: stable; — REMOVED */
  overflow-x: clip;
}

body {
  position: relative;  /* Permanent to prevent flash */
  overflow-x: clip;
}
```

**Status:** Implemented but still has issues  
**Pros:** No double compensation  
**Cons:** Body position: relative alone doesn't prevent the flash from react-remove-scroll's other modifications

### Solution 2: CSS Override (Rejected)

```css
body {
  scrollbar-gutter: stable;
  /* Override react-remove-scroll */
  padding-right: 0 !important;
  margin-right: 0 !important;
}
```

**Status:** Rejected by user as "hacky"  
**Pros:** Works reliably  
**Cons:** `!important` overrides feel wrong, masks the library's behavior

### Solution 3: Custom Scroll Lock Hook (Complex)

Replace react-remove-scroll with a custom implementation that:
- Uses `overflow: hidden` only
- Relies on `scrollbar-gutter: stable` for compensation
- Never modifies body position/padding

```tsx
// Custom hook approach
function useScrollLock(enabled: boolean) {
  useEffect(() => {
    if (enabled) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [enabled]);
}
```

**Status:** Requires patching Radix components  
**Pros:** Clean, no conflicts  
**Cons:** Lot of work, may break with Radix updates

### Solution 4: Dialog modal={false} + Custom Overlay (Vaul Approach)

The Drawer component already solved this problem:

```tsx
// From drawer.tsx - CustomOverlay without react-remove-scroll
function DrawerOverlay({ ... }) {
  return (
    // Custom overlay that doesn't use Radix's overlay
    <DrawerClose asChild>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-overlay-dark touch-none"
        onWheel={(e) => e.preventDefault()}  // Manual scroll prevention
        {...props}
      />
    </DrawerClose>
  )
}
```

**Status:** Could be adapted for Dialog  
**Pros:** Proven to work for Drawer  
**Cons:** Requires custom Dialog implementation

### Solution 5: CSS Containment (Experimental)

```css
[data-slot="app-header"] {
  contain: layout style paint;
  will-change: transform;
}
```

**Status:** Experimental  
**Pros:** Isolates header from body changes  
**Cons:** May have unintended side effects, not guaranteed to fix

### Solution 6: Radix Dialog with modal={false} + Manual Inert

```tsx
<Dialog modal={false}>
  <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
    {/* Content */}
  </DialogContent>
</Dialog>

// Plus: manually set inert on main content
useEffect(() => {
  if (open) {
    document.querySelector('main')?.setAttribute('inert', '');
  } else {
    document.querySelector('main')?.removeAttribute('inert');
  }
}, [open]);
```

**Status:** Not currently supported by our Dialog  
**Pros:** Bypasses react-remove-scroll entirely  
**Cons:** Requires accessibility testing, may need focus trap library

---

## Recommended Fix

### ✅ IMPLEMENTED: Custom Dialog Overlay (Same as Drawer)

We adopted the same pattern used by the Drawer component:

1. **`modal={false}`** on Radix Dialog root - bypasses `react-remove-scroll` entirely
2. **Custom overlay** (button element) with `touch-none` + `onWheel` to prevent scroll manually
3. **CSS containment** on header for additional isolation

```tsx
// dialog.tsx - Custom overlay like Drawer
function DialogOverlay({ className, blur = "sm", ...props }) {
  return (
    <DialogClose asChild>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-50 bg-overlay-dark touch-none outline-none",
          "animate-in fade-in-0",
          blurClasses[blur],
          className,
        )}
        onWheel={(e) => e.preventDefault()}
        {...props}
      />
    </DialogClose>
  )
}
```

**Why this works:**
- `modal={false}` prevents Radix from invoking `react-remove-scroll`
- No body style modifications = no stacking context changes = no header flash
- Manual scroll prevention via `onWheel` + `touch-none` CSS
- Same proven pattern as Drawer component

### Short-term (CSS Mitigation) - Also Applied

Apply `will-change: transform` and `contain` properties to the header to isolate it from body style changes:

```css
/* globals.css */
[data-slot="app-header"] {
  /* Promote to compositing layer - isolates from body changes */
  will-change: transform;
  /* Contain layout to prevent reflows affecting children */
  contain: layout style;
  /* Ensure new stacking context */
  isolation: isolate;
}
```

**Why this helps:**
1. `will-change: transform` promotes the header to its own GPU layer
2. `contain: layout style` prevents body changes from reflowing header internals
3. `isolation: isolate` creates a new stacking context, isolating from body changes

### Medium-term (Library Approach)

Consider using `@radix-ui/react-dialog` with a custom overlay like the Drawer component does:

```tsx
// Create a custom DialogOverlay that doesn't use react-remove-scroll
function DialogOverlay({ className, onClose, ...props }) {
  // Prevent wheel events manually
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
  };

  return (
    <DialogPrimitive.Close asChild>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-50 bg-overlay-dark backdrop-blur-sm",
          "touch-none outline-none",
          className
        )}
        onWheel={handleWheel}
        {...props}
      />
    </DialogPrimitive.Close>
  );
}
```

### Long-term (Architecture)

1. **Unify modal approach:** Both Dialog and Drawer should use the same scroll lock strategy
2. **Consider Vaul for dialogs:** Vaul (the library behind Drawer) handles scroll lock elegantly
3. **Monitor Radix updates:** Track https://github.com/radix-ui/primitives/issues for scroll lock improvements

---

## Implementation

### Step 1: Apply CSS Containment to Header

```css
/* app/globals.css - Add to @layer base */

[data-slot="app-header"] {
  /* GPU layer promotion for smooth animations and isolation */
  will-change: transform;
  /* Contain layout reflows */
  contain: layout style;
  /* New stacking context */
  isolation: isolate;
}
```

### Step 2: Ensure body has permanent position: relative

```css
/* app/globals.css - Already implemented */

body {
  position: relative;  /* Permanent - prevents stacking context shifts */
  /* ... other styles ... */
}
```

### Step 3: Remove scrollbar-gutter (Already Done)

Confirmed: `scrollbar-gutter: stable` has been removed from html/body.

### Step 4: Test and Validate

Run the test suite and manually verify:

```bash
pnpm test:e2e --project=chromium
```

Manual verification:
1. Open homepage
2. Scroll down
3. Open product quickview modal
4. Close modal
5. Verify no header flash

---

## Testing

### Automated Test

```typescript
// e2e/modal-header-flash.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Modal scroll lock', () => {
  test('header should not flash when modal opens/closes', async ({ page }) => {
    await page.goto('/en');
    
    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');
    
    // Scroll down to products
    await page.evaluate(() => window.scrollTo(0, 800));
    
    // Get initial header position
    const header = page.locator('[data-slot="app-header"]');
    const initialBox = await header.boundingBox();
    
    // Open a product modal (via intercepting route)
    await page.click('text=Open product');
    await page.waitForSelector('[role="dialog"]');
    
    // Check header hasn't moved
    const afterOpenBox = await header.boundingBox();
    expect(afterOpenBox?.y).toBe(initialBox?.y);
    expect(afterOpenBox?.height).toBe(initialBox?.height);
    
    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForSelector('[role="dialog"]', { state: 'detached' });
    
    // Check header still hasn't moved
    const afterCloseBox = await header.boundingBox();
    expect(afterCloseBox?.y).toBe(initialBox?.y);
    expect(afterCloseBox?.height).toBe(initialBox?.height);
  });
});
```

### Visual Regression Test

Consider adding Percy or Chromatic snapshot comparison for header during modal transitions.

---

## Related Issues

- Vaul (Drawer) already solved this: See `components/ui/drawer.tsx` comments
- iOS Safari scroll issues: Same root cause, different manifestation
- React Remove Scroll GitHub: https://github.com/theKashey/react-remove-scroll

---

## Files Modified

| File | Change |
|------|--------|
| `app/globals.css` | Remove `scrollbar-gutter`, add body `position: relative`, add header containment |
| `components/ui/dialog.tsx` | Potentially add `modal={false}` option + custom overlay |
| `components/layout/header/app-header.tsx` | Ensure `data-slot="app-header"` is present |

---

## Conclusion

The header flash is caused by `react-remove-scroll`'s body style modifications conflicting with sticky positioning. The recommended fix applies CSS containment to isolate the header from body changes, combined with keeping body in a permanent `position: relative` state.

For a complete fix, consider adopting the Drawer's approach of using a custom overlay that doesn't invoke react-remove-scroll, or waiting for Radix to improve their scroll lock handling.

**Action Items:**
1. ✅ Remove `scrollbar-gutter: stable` (done)
2. ✅ Add permanent `position: relative` to body (done)
3. ✅ Add CSS containment to header (done)
4. ✅ Use custom Dialog overlay (like Drawer) with `modal={false}` (done)
5. 🔲 Test thoroughly across browsers (Chrome, Firefox, Safari)
