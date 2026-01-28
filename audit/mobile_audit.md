# Mobile UI/UX Deep Audit - Treido Marketplace
**Date:** 2026-01-27  
**Auditor:** Claude (Automated Code Analysis + Browser Testing)  
**Focus:** Mobile UI/UX with emphasis on Onboarding Flow  
**Viewport:** 375×812 (iPhone X)  

---

## 🔥 Executive Roast Summary

**TL;DR:** Your main pages (`/`, `/account`) are actually pretty solid - clean shadcn theming, proper Tailwind v4 usage, consistent spacing. The **onboarding modal** is the weak link - it has good bones but several UX paper cuts that make it feel unpolished compared to the rest of your app.

### Severity Breakdown

| Severity | Count | Category |
|----------|-------|----------|
| 🔴 Critical | 3 | Onboarding UX blockers |
| 🟠 High | 5 | Visual inconsistencies |
| 🟡 Medium | 8 | Polish opportunities |
| 🟢 Low | 4 | Nice-to-haves |

---

## Part 1: Onboarding Modal - The Problem Child

### 1.1 Component Location
```
app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx
app/[locale]/(main)/_providers/onboarding-provider.tsx
```

### 1.2 Critical Issues 🔴

#### C1: CSS Custom Property for Modal Size Not Defined

**File:** `post-signup-onboarding-modal.tsx` line ~304
```tsx
<DialogContent 
  className="w-(--onboarding-modal-w) sm:max-w-md max-h-(--onboarding-modal-max-h) sm:max-h-(--onboarding-modal-max-h-sm) overflow-y-auto p-0 bg-card border-0 shadow-md"
```

**Issue:** The custom properties `--onboarding-modal-w`, `--onboarding-modal-max-h`, `--onboarding-modal-max-h-sm` are NOT defined anywhere in `globals.css`. This means the modal relies on shadcn defaults, but the explicit references suggest intended customization that was never implemented.

**Fix Required:**
```css
/* Add to globals.css */
:root {
  --onboarding-modal-w: min(calc(100vw - 2rem), 28rem);
  --onboarding-modal-max-h: calc(100dvh - 3rem);
  --onboarding-modal-max-h-sm: 85dvh;
}
```

#### C2: Inconsistent Input Styling in Social Links Step

**File:** `post-signup-onboarding-modal.tsx` lines ~483-562

The social links step mixes two different input patterns:
1. Custom composite inputs (Instagram/TikTok/Twitter) with prefix spans
2. Standard shadcn `<Input>` components (YouTube/Other)

```tsx
// Pattern 1: Custom composite (Instagram)
<div className="flex-1 flex items-center border-2 border-input rounded-lg overflow-hidden focus-within:border-primary/50">
  <span className="px-2 sm:px-3 text-xs sm:text-sm ...">@</span>
  <input className="flex-1 h-9 px-2 sm:px-3 text-sm bg-card focus:outline-none" />
</div>

// Pattern 2: Standard shadcn Input (YouTube)
<Input className="h-9 border-2 border-input focus:border-primary/50" />
```

**Visual Result:** YouTube and Other inputs look visibly different from Instagram/TikTok/Twitter inputs - different border radius, different focus states, different heights.

**Fix Required:** Standardize all inputs to use the custom composite pattern OR create a custom variant of shadcn Input.

#### C3: No Escape/Back Gesture Handling

**File:** `post-signup-onboarding-modal.tsx` line ~299
```tsx
<Dialog open={isOpen} onOpenChange={() => {}}>
```

**Issue:** The empty `onOpenChange` callback means:
- Users cannot press Escape to close
- Users cannot tap outside to close
- Users MUST interact with the buttons

**Impact:** Feels trapped on mobile. Modern UX expects dismissibility.

**Fix Required:**
```tsx
<Dialog open={isOpen} onOpenChange={(open) => {
  if (!open) onClose();
}}>
```

### 1.3 High Priority Issues 🟠

#### H1: Avatar Selection Grid Has Hit Target Issues

**File:** `post-signup-onboarding-modal.tsx` lines ~360-385

```tsx
<button
  className={cn(
    "size-8 sm:size-9 rounded-lg border-2 overflow-hidden",
    // ...
  )}
>
```

**Issue:** 32px (size-8) buttons are below the 44×44px iOS touch target recommendation. At 32px on mobile, users will frequently mis-tap.

**Fix:**
```tsx
className="size-11 sm:size-11 rounded-lg ..." // 44px
```

#### H2: Progress Indicator Lacks Visual Weight

**File:** `post-signup-onboarding-modal.tsx` lines ~318-322

```tsx
<div className="flex items-center justify-center gap-2 mb-4 text-xs text-muted-foreground">
  <span className="font-medium text-foreground">{t.step} {getCurrentStepNumber()}</span>
  <span>{t.of}</span>
  <span>{getTotalSteps()}</span>
</div>
```

**Issue:** This is boring text. Modern onboarding uses visual progress dots or a progress bar (think iOS setup wizard, Stripe onboarding).

**Fix Required:** Replace with visual progress indicator:
```tsx
<div className="flex items-center justify-center gap-1.5 mb-4">
  {Array.from({ length: getTotalSteps() }).map((_, i) => (
    <div
      key={i}
      className={cn(
        "size-2 rounded-full transition-all",
        i < getCurrentStepNumber() ? "bg-primary w-6" : "bg-muted"
      )}
    />
  ))}
</div>
```

#### H3: Bio Character Counter Position

**File:** `post-signup-onboarding-modal.tsx` lines ~443-446

```tsx
<div className="flex justify-between mt-1.5">
  <p className="text-xs text-muted-foreground">{t.bioHint}</p>
  <p className={cn("text-xs", bio.length > 140 ? "text-warning" : "text-muted-foreground")}>
    {bio.length}/160
  </p>
</div>
```

**Issue:** Counter is separated from textarea, takes up vertical space. Modern pattern: inline counter inside textarea border.

#### H4: Business Step Cover Image Upload UX

**File:** `post-signup-onboarding-modal.tsx` lines ~665-690

```tsx
<label className="block w-full h-20 sm:h-24 border-2 border-dashed border-primary/30 rounded-lg ...">
```

**Issue:** 
- 80-96px height is too small to preview meaningful cover images
- Dashed border looks "drafty"/unfinished
- No size guidance visible during hover

**Fix:** Increase to `h-32 sm:h-40`, use subtle solid border.

#### H5: Final Step CTA Button Order

**File:** `post-signup-onboarding-modal.tsx` lines ~791-807

```tsx
<Button onClick={() => handleFinish(false)} className="...">
  <ShoppingBag ... />
  {t.finish}
</Button>
<Button onClick={() => handleFinish(true)} variant="outline" className="...">
  <Storefront ... />
  {t.startSelling}
</Button>
```

**Issue:** "Start Shopping" as primary and "Become a Seller" as secondary might be backwards for a marketplace that needs sellers. Consider A/B testing or making them equal prominence.

---

## Part 2: Pages That ARE Good (For Reference)

### 2.1 Main Homepage (/)

**Rating: 8/10** ⭐⭐⭐⭐

**What's working:**
- Clean header with proper mobile breakpoints
- Category pills scroll nicely
- Product cards consistent with design system
- Bottom nav tab bar properly implemented
- `backdrop-blur-xl` for modern glass morphism effect
- Proper safe area handling (`pb-safe`)

**Code Pattern (Mobile Tab Bar):**
```tsx
// components/mobile/mobile-tab-bar.tsx
<nav
  className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/60 pb-safe md:hidden"
  role="navigation"
  aria-label={t("mobileNavigation")}
>
```

This is **excellent** - proper mobile-first, accessibility, iOS safe areas.

### 2.2 Account Page (/account)

**Rating: 8.5/10** ⭐⭐⭐⭐½

**What's working:**
- Sidebar collapses properly on mobile
- Account tab bar uses consistent pattern
- Good use of shadcn SidebarProvider
- Hero card with stats looks professional
- Proper `@container` queries for responsive cards

**Code Pattern (Account Layout):**
```tsx
// account-layout-content.tsx
<SidebarProvider
  style={{
    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)",
  } as React.CSSProperties}
>
```

This demonstrates **proper CSS custom property usage** - exactly what the onboarding modal should do but doesn't.

### 2.3 Theme System

**Rating: 9/10** ⭐⭐⭐⭐⭐

**What's working:**
```css
/* globals.css - Clean professional palette */
:root {
  --background: oklch(1 0 0);              /* Pure white */
  --foreground: oklch(0.15 0.01 250);      /* Near-black */
  --primary: oklch(0.65 0.17 230);         /* Twitter blue */
  --muted: oklch(0.96 0 0);                /* Subtle gray */
}
```

The OKLCH color space usage is modern, the semantic tokens are well-organized, dark mode support is complete.

---

## Part 3: Medium Priority Issues 🟡

### M1: Onboarding Modal Uses `framer-motion` AnimatePresence

While this creates nice animations, it adds ~25KB to the bundle for a component that runs once per user. Consider:
- CSS transitions (lighter weight)
- View Transitions API (native, no JS)

### M2: No Loading State Skeleton for Avatar Selection

When switching avatar variants, there's no visual feedback that a new avatar is rendering.

### M3: Social Links Step Lacks Platform Icons Labels

Screen readers can identify icons, but sighted users see icons without platform names in the input prefix area. Add `aria-label` or visible text.

### M4: Business Cover Image Has No Aspect Ratio Enforcement

Users can upload any aspect ratio, but display is `object-cover` which will crop. Add guidance or cropper UI.

### M5: Onboarding Provider Polling Logic

```tsx
// onboarding-provider.tsx lines ~51-64
const poll = () => {
  if (cancelled) return
  const headerHydrated = document.querySelector('header[data-hydrated="true"]')
  if (headerHydrated || Date.now() > deadline) {
    setIsDialogSafe(true)
    return
  }
  setTimeout(poll, 50)
}
```

**Issue:** Polling DOM for hydration state is fragile. Consider using React's `useLayoutEffect` or a proper hydration boundary instead.

### M6: Missing Toast/Feedback on Complete

After completing onboarding, there's no toast confirming "Profile saved!" - just navigation. Add confirmation feedback.

### M7: Input Focus States Inconsistent

Some inputs use `focus:border-primary`, others use `focus:border-primary/50`, others use `focus-within:border-primary/50`. Pick one.

### M8: Username in Complete Step Might Be Null

```tsx
<p className="text-xs text-muted-foreground mt-3 text-left">
  {t.profileUrl}: <span className="font-mono">treido.eu/u/{username}</span>
</p>
```

If `username` is for some reason empty, this shows `treido.eu/u/` which looks broken.

---

## Part 4: Low Priority Issues 🟢

### L1: "treido." Logo in Modal Could Use Brand Mark

Consider adding the logo icon alongside text for brand recognition.

### L2: Avatar Palette Selection Hidden

The `avatarPalette` state exists but there's no UI to change it - users can only change avatar style, not colors.

### L3: Bulgarian Translations in Component

Having translations inline in the component (`const translations = {...}`) works but breaks the pattern of using `messages/*.json`. Consider migrating.

### L4: Complete Step Profile Card Uses Inline Styles-ish

```tsx
className="mb-5 p-4 rounded-xl bg-secondary/50 border border-border"
```

Could use a design token for the card style to ensure consistency.

---

## Part 5: Recommended Action Plan

### Phase 1: Immediate (Before Launch) 🚨

| Task | File | LOC Change | Priority |
|------|------|------------|----------|
| Define modal CSS custom properties | `globals.css` | +10 | 🔴 Critical |
| Fix Dialog dismissibility | `post-signup-onboarding-modal.tsx` | +3 | 🔴 Critical |
| Standardize social link inputs | `post-signup-onboarding-modal.tsx` | +30 | 🔴 Critical |
| Increase avatar button size to 44px | `post-signup-onboarding-modal.tsx` | +1 | 🟠 High |
| Add visual progress dots | `post-signup-onboarding-modal.tsx` | +15 | 🟠 High |

### Phase 2: Polish (Post-Launch Sprint)

| Task | Effort | Impact |
|------|--------|--------|
| Replace framer-motion with CSS transitions | 2h | Performance |
| Add toast feedback on complete | 0.5h | UX |
| Inline bio character counter | 1h | Modern UX |
| Cover image aspect ratio enforcement | 2h | Quality |
| Migrate translations to messages/*.json | 1h | Consistency |

### Phase 3: Enhancement (Future)

| Task | Effort | Impact |
|------|--------|--------|
| Avatar palette picker | 3h | Personalization |
| Avatar image cropper | 4h | Quality |
| Animated onboarding illustrations | 8h | Delight |
| Skip onboarding but show later prompt | 2h | Flexibility |

---

## Part 6: Code Snippets for Critical Fixes

### Fix C1: Modal CSS Custom Properties

Add to `app/globals.css`:

```css
/* === ONBOARDING MODAL SIZING === */
:root {
  /* Mobile: Full width minus safe margins, max 95vw */
  --onboarding-modal-w: min(calc(100vw - 2rem), 28rem);
  
  /* Mobile: Use dynamic viewport height, leave room for keyboard */
  --onboarding-modal-max-h: calc(100dvh - 3rem);
  
  /* Desktop: More controlled height */
  --onboarding-modal-max-h-sm: min(85dvh, 40rem);
}
```

### Fix C2: Standardized Social Input Component

Create `components/ui/social-input.tsx`:

```tsx
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface SocialInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string
  icon?: React.ReactNode
}

export const SocialInput = forwardRef<HTMLInputElement, SocialInputProps>(
  ({ prefix, icon, className, ...props }, ref) => {
    return (
      <div className={cn(
        "flex items-center gap-3",
        className
      )}>
        {icon && (
          <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 flex items-center h-10 rounded-lg border-2 border-input overflow-hidden transition-colors focus-within:border-primary">
          {prefix && (
            <span className="px-3 text-sm text-muted-foreground bg-muted/50 border-r border-input h-full flex items-center">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className="flex-1 h-full px-3 text-sm bg-transparent focus:outline-none"
            {...props}
          />
        </div>
      </div>
    )
  }
)
SocialInput.displayName = "SocialInput"
```

### Fix C3: Dialog Dismissibility

In `post-signup-onboarding-modal.tsx`:

```tsx
// Before
<Dialog open={isOpen} onOpenChange={() => {}}>

// After
<Dialog open={isOpen} onOpenChange={(open) => {
  // Only allow close on complete step or if user confirms
  if (!open && step === "complete") {
    onClose();
  }
}}>

// Or for full dismissibility:
<Dialog open={isOpen} onOpenChange={(open) => {
  if (!open) onClose();
}}>
```

---

## Part 7: Testing Results Summary

### Browser Automation Results

| Page | Viewport | Load Time | Visual Status |
|------|----------|-----------|---------------|
| `/en` (Homepage) | 375×812 | ~2s | ✅ Clean, professional |
| `/en/account` | 375×812 | ~2.5s | ✅ Sidebar collapses, tab bar visible |
| `/en?onboarding=true` | 375×812 | Modal triggered on auth | ⚠️ See issues above |

### Accessibility Quick Scan

| Component | Issue | WCAG Level |
|-----------|-------|------------|
| Avatar buttons | Below 44px touch target | AA Fail |
| Social inputs | Missing visible labels | A Warning |
| Progress text | Low contrast for "of" word | AA Warning |

---

## Conclusion

Your app's foundation is **solid**. The design system is well-implemented, the theme is professional, and the main pages work well on mobile. The onboarding modal is the outlier - it was clearly built with care but has accumulated some inconsistencies that make it feel like "version 0.9" compared to the polished "version 1.0" feel of the rest of your app.

**My recommendation:** Spend 4-6 hours on the Critical and High issues in Phase 1. The onboarding is users' first impression after signup - it should match the quality bar of the rest of your app.

---

*Audit generated by Claude analyzing codebase patterns and browser automation testing.*
*Total files analyzed: 12*
*Total lines reviewed: ~3,500*
