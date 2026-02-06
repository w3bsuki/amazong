# APP-FEEL-GUIDE.md — Treido Native App Transformation

> **How to transform Treido from "website" to "web app" feel.** Based on TradeSphere patterns + iOS native principles.

| Scope | UI/UX transformation guide |
|-------|---------------------------|
| Audience | Humans + AI agents |
| Type | Implementation Guide |
| Stack | Next.js 16 + shadcn/ui + Tailwind v4 |
| Reference | `temp-tradesphere-audit/` |

---

## Executive Summary

**Goal:** Transform Treido into a premium, native-app-feeling marketplace while respecting existing Tailwind v4 token rails.

**Key Insight from TradeSphere:** "Native app feel" isn't about copying iOS visuals—it's about:
1. **Instant feedback** on every interaction
2. **Consistent spacing** (4px grid)
3. **Content density** without clutter
4. **Bottom navigation** for primary actions
5. **Sheet/drawer patterns** that preserve context
6. **Clean solid surfaces** (white bg, subtle borders)

---

## Table of Contents

1. [Design Philosophy Gap Analysis](#1-design-philosophy-gap-analysis)
2. [Interaction Patterns](#2-interaction-patterns)
3. [Layout Patterns](#3-layout-patterns)
4. [Component Patterns](#4-component-patterns)
5. [Navigation Patterns](#5-navigation-patterns)
6. [Form Patterns](#6-form-patterns)
7. [Implementation Priority](#7-implementation-priority)
8. [Token Alignment](#8-token-alignment)

---

## 1. Design Philosophy Gap Analysis

### TradeSphere Principles (to adopt)

```
┌─────────────────────────────────────────────────────────────┐
│  NATIVE FIRST: Design for mobile, enhance for desktop       │
│  SIMPLICITY: Every element must earn its place              │
│  SPEED: Performance over polish, function over flair        │
│  CLARITY: Information hierarchy through size, not color     │
└─────────────────────────────────────────────────────────────┘
```

### What Makes iOS Feel "Native"

| Principle | TradeSphere | Treido Current | Gap |
|-----------|-------------|----------------|-----|
| Consistent 4px grid | ✅ Strict adherence | ⚠️ Mixed | Audit spacing |
| Subtle depth | ✅ Light shadows, no harsh borders | ⚠️ Some heavy borders | Soften borders |
| Responsive touch | ✅ `tap-highlight` everywhere | ❌ Missing | Add utility |
| Content density | ✅ Compact but readable | ⚠️ Sometimes cramped | Balance |
| Clean surfaces | Solid white/black, no blur | ✅ Good base | Maintain |
| System fonts | ✅ Inter with optical sizing | ✅ Good | Maintain |

---

## 2. Interaction Patterns

### 2.1 Tap Highlight (CRITICAL for app feel)

**TradeSphere Pattern:**
```css
.tap-highlight {
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.1s ease-in-out;
}
.tap-highlight:active {
  opacity: 0.7;
}
```

**Treido Implementation:**
Add to `app/utilities.css`:
```css
@layer utilities {
  .tap-highlight {
    -webkit-tap-highlight-color: transparent;
  }
  .tap-highlight:active {
    @apply opacity-70 transition-opacity duration-100;
  }
}
```

**Usage Rule:** Add `tap-highlight` to ALL interactive elements:
- Buttons
- Cards (clickable)
- Links
- Nav items
- Dropdown triggers

### 2.2 Focus States (Accessibility)

Keep existing Treido pattern but ensure consistency:
```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### 2.3 Loading States

**Prefer skeleton loading over spinners:**
```tsx
// Skeleton (preferred)
<div className="animate-pulse rounded-md bg-muted" />

// Spinner (only for actions)
<div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
```

---

## 3. Layout Patterns

### 3.1 Page Structure

**Clean E-commerce Standard:**
```tsx
<div className="min-h-screen bg-background pb-20">
  <header className="sticky top-0 z-40 bg-background border-b border-border safe-top">
    {/* Header content */}
  </header>
  
  <main className="px-4 py-4 space-y-6">
    {/* Page content */}
  </main>
  
  <BottomNav />
</div>
```

**Key Elements:**
- `pb-20` reserves space for bottom nav + safe area
- `safe-top`/`safe-bottom` utilities for iOS notch
- Sticky header with solid `bg-background` (no blur)

### 3.2 Section Spacing

| Context | Spacing | Class |
|---------|---------|-------|
| Page padding | 16px | `px-4 py-4` |
| Between sections | 24px | `space-y-6` |
| Within sections | 12px | `space-y-3` |
| Card grids | 12px | `gap-3` |
| Inline elements | 8px | `gap-2` |

### 3.3 Card Hierarchy

```
┌─────────────────────────────────────┐
│  bg-card + border-border            │  ← Standard card
│  Subtle border, white background    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  bg-card + shadow-card              │  ← Elevated card  
│  Drop shadow, no border             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  bg-muted                           │  ← Recessed card
│  Gray background, no border         │
└─────────────────────────────────────┘
```

**Rule:** Border OR shadow, never both.

---

## 4. Component Patterns

### 4.1 Button System

**TradeSphere Touch-Safe Buttons:**
```tsx
// Primary CTA
<button className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold tap-highlight">
  Continue
</button>

// Icon button (circular)
<button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center tap-highlight">
  <Icon className="w-5 h-5 text-foreground" />
</button>

// Pill/Chip selection
<button className={`px-3 py-1.5 rounded-full text-sm font-medium tap-highlight ${
  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
}`}>
  Filter
</button>
```

**Treido Alignment:**
- Use existing `h-touch` (40px), `h-touch-lg` (48px) tokens
- Add `tap-highlight` to all Button variants
- Consider adding `rounded-xl` variant for CTAs

### 4.2 Card Components

**ListingCard Pattern (TradeSphere):**
```tsx
<article className="relative bg-card rounded-xl overflow-hidden shadow-card cursor-pointer tap-highlight">
  {/* Image container with aspect ratio */}
  <div className="relative aspect-square">
    <img className="w-full h-full object-cover" loading="lazy" />
    
    {/* Floating save button */}
    <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card shadow-sm flex items-center justify-center tap-highlight">
      <Heart className="w-4 h-4" />
    </button>
    
    {/* Badge overlay */}
    <Badge className="absolute top-2 left-2">Promoted</Badge>
  </div>
  
  {/* Content with tight hierarchy */}
  <div className="p-3">
    <p className="font-bold text-lg">€{price}</p>
    <h3 className="text-sm line-clamp-1 mt-0.5">{title}</h3>
    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
      <MapPin className="w-3 h-3" />
      <span>{location}</span>
    </div>
  </div>
</article>
```

**Key Patterns:**
- `aspect-square` for consistent image ratios
- Floating buttons with solid `bg-background` or `bg-card`
- Tight content hierarchy: Price → Title → Location
- `line-clamp-1` for truncation

### 4.3 Badge System

**TradeSphere badges are smaller and bolder:**
```tsx
// Promoted badge
<Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5">
  Promoted
</Badge>

// Cover indicator
<span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-medium">
  Cover
</span>
```

**Treido has `text-2xs` (10px) - use it consistently for badges.**

---

## 5. Navigation Patterns

### 5.1 Bottom Navigation (Mobile)

**Clean E-commerce Pattern:**
```tsx
<nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border safe-bottom">
  <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
    {navItems.map(item => (
      <button className="flex flex-col items-center gap-0.5 py-2 px-4 tap-highlight">
        <Icon className={isActive ? "text-primary" : "text-muted-foreground"} />
        <span className="text-[10px] font-medium">
          {label}
        </span>
      </button>
    ))}
  </div>
</nav>
```

**Key Features:**
- `h-16` (64px) for comfortable touch targets
- `text-[10px]` (use `text-2xs`) for labels
- Solid white background with border
- Active state via `text-primary` (Twitter blue)
- Floating action button for "Sell" (-mt-4 elevation)

### 5.2 Sticky Header

**Clean E-commerce Pattern:**
```tsx
<header className="sticky top-0 z-40 bg-background border-b border-border safe-top">
  <div className="flex items-center justify-between px-4 h-14">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <Logo />
      <span className="font-semibold text-lg">Treido</span>
    </div>
    
    {/* Actions */}
    <div className="flex items-center gap-1">
      <button className="p-2.5 rounded-full tap-highlight hover:bg-accent">
        <Search className="w-5 h-5" />
      </button>
      {/* ... */}
    </div>
  </div>
</header>
```

### 5.3 Back Button Pattern

```tsx
// Standard back button
<button onClick={() => router.back()} className="tap-highlight">
  <ArrowLeft className="w-6 h-6 text-foreground" />
</button>

// Floating variant (over images)
<button className="w-9 h-9 rounded-full bg-card shadow-sm flex items-center justify-center tap-highlight">
  <ArrowLeft className="w-5 h-5 text-foreground" />
</button>
```

---

## 6. Form Patterns

### 6.1 Input Styling

**TradeSphere (borderless, recessed):**
```tsx
<Input 
  className="bg-muted border-0 rounded-xl h-12 px-4"
  placeholder="Search..."
/>
```

**Treido (current):** Bordered inputs

**Recommendation:** Create a variant for "app-style" inputs:
- No border (`border-0`)
- Muted background (`bg-muted`)
- Larger radius (`rounded-xl`)
- 48px height (`h-12`)

### 6.2 Selection States

**Toggle card pattern:**
```tsx
<button className={`w-full flex items-center justify-between p-4 rounded-xl border tap-highlight ${
  isSelected
    ? "bg-selected border-selected-border"
    : "bg-card border-border"
}`}>
  <div className="flex items-center gap-3">
    <Icon className={isSelected ? "text-primary" : "text-muted-foreground"} />
    <div className="text-left">
      <p className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
        {label}
      </p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
  
  {/* Custom toggle */}
  <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
    isSelected ? "bg-primary" : "bg-muted"
  }`}>
    <div className={`w-5 h-5 rounded-full bg-background shadow transition-transform ${
      isSelected ? "translate-x-5" : "translate-x-0"
    }`} />
  </div>
</button>
```

### 6.3 Multi-Step Wizard (Sell Form)

**TradeSphere SellDrawer Structure:**
```tsx
<Sheet>
  <SheetContent side="bottom" className="h-[95vh] rounded-t-3xl p-0 flex flex-col">
    {/* Header - Back/Close + Title + Step indicator */}
    <div className="flex items-center justify-between p-4 border-b border-border">
      <button className="tap-highlight">
        {step === 0 ? <X /> : <ChevronLeft />}
      </button>
      <div className="text-center">
        <h2 className="font-semibold">{stepTitle}</h2>
        <p className="text-xs text-muted-foreground">
          Step {step + 1} of {totalSteps}
        </p>
      </div>
      <div className="w-9" /> {/* Spacer */}
    </div>

    {/* Progress bar */}
    <div className="h-1 bg-muted">
      <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
    </div>

    {/* Scrollable content */}
    <div className="flex-1 overflow-y-auto">
      {stepContent}
    </div>

    {/* Sticky footer CTA */}
    <div className="p-4 border-t border-border safe-bottom">
      <Button className="w-full h-12" disabled={!canProceed}>
        {isLastStep ? "Publish" : "Continue"}
      </Button>
    </div>
  </SheetContent>
</Sheet>
```

**Key Differences from Treido:**
- Uses Sheet (drawer) instead of full page
- Header has back/close, centered title, step indicator
- Thin progress bar under header
- Sticky footer with single CTA
- Content scrolls independently

---

## 7. Implementation Priority

### Phase 1: Foundation (1-2 days)
1. Add `tap-highlight` utility to CSS
2. Add `safe-top`/`safe-bottom` utilities (if not present)
3. Verify shadow tokens exist
4. Audit and fix inconsistent spacing

### Phase 2: Core Components (3-5 days)
1. Update Button with `tap-highlight`
2. Create/update ProductCard with TradeSphere patterns
3. Update Badge sizes for app feel
4. Add floating button patterns

### Phase 3: Navigation (2-3 days)
1. Refine mobile BottomNav (solid bg + border)
2. Update sticky headers (solid bg + border)
3. Add floating FAB for sell action

### Phase 4: Forms (3-5 days)
1. Create app-style input variant
2. Update sell form wizard structure
3. Add selection card patterns
4. Improve form validation UX

### Phase 5: Polish (ongoing)
1. Animation consistency
2. Loading states
3. Empty states
4. Error states

---

## 8. Token Alignment

### Tokens to Verify (globals.css)

```css
:root {
  /* Card shadow (light, subtle) */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08);
  
  /* Elevated shadow (for floating elements like FAB) */
  --shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

**Note:** No glass/blur tokens needed. Use solid `bg-background` everywhere.

### Utility Classes to Add (utilities.css)

```css
@layer utilities {
  /* Tap feedback */
  .tap-highlight {
    -webkit-tap-highlight-color: transparent;
  }
  .tap-highlight:active {
    @apply opacity-70 transition-opacity duration-100;
  }
  
  /* Safe areas */
  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  /* Hide scrollbar */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## Quick Reference

### Before/After Patterns

| Pattern | Before (Website) | After (App) |
|---------|------------------|-------------|
| Button press | No feedback | `tap-highlight` opacity |
| Sticky header | Inconsistent | Solid `bg-background` + `border-b` |
| Card shadow | Heavy | `shadow-card` (light) |
| Form inputs | Bordered | `bg-muted border-0 rounded-xl` |
| Navigation | Top nav only | Bottom nav + sticky header |
| Multi-step form | Full page | Sheet/drawer |
| Badges | Standard | `text-2xs` smaller |
| Touch targets | Mixed | 44px minimum |

### Component Checklist

- [ ] All buttons have `tap-highlight`
- [ ] All clickable cards have `tap-highlight`
- [ ] Headers have solid `bg-background` + `border-b`
- [ ] Bottom nav has solid `bg-background` + `border-t`
- [ ] Form inputs have larger radius
- [ ] Badges use `text-2xs`
- [ ] Touch targets are 44px+
- [ ] Safe areas handled

---

## Related Documents

- [DESIGN.md](./DESIGN.md) — Token SSOT
- [14-UI-UX-PLAN.md](./14-UI-UX-PLAN.md) — UX Roadmap
- [APP-FEEL-COMPONENTS.md](./APP-FEEL-COMPONENTS.md) — Component specs
- [APP-FEEL-CHECKLIST.md](./APP-FEEL-CHECKLIST.md) — Implementation checklist

---

*Last updated: 2026-02-03*

