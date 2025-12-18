# /sell Form Desktop UI/UX Audit & Improvement Plan

**Date:** December 17, 2025  
**Status:** PLANNING PHASE  
**Priority:** HIGH

---

## 📋 Executive Summary

The `/sell` form is a critical revenue path for the platform. After thorough audit, it has good bones (App Router RSC/CC hybrid, proper caching, react-hook-form + zod) but suffers from **visual inconsistencies**, **hardcoded colors**, **incomplete shadcn integration**, and **UX friction points** that need to be addressed.

---

## 🔍 Part 1: Architecture Audit

### ✅ What's Working Well

| Aspect | Status | Details |
|--------|--------|---------|
| **App Router** | ✅ Good | Uses route groups `(sell)` correctly with dedicated layout |
| **RSC/Client Split** | ✅ Good | Server page fetches data, client handles interactivity |
| **Data Fetching** | ✅ Good | Uses `unstable_cache` with proper tags, parallel fetching |
| **Form Library** | ✅ Good | react-hook-form with zodResolver |
| **Validation** | ✅ Good | Zod schema v4 with comprehensive rules |
| **Auto-save** | ✅ Good | localStorage draft with debounce |
| **Responsive** | ✅ Good | Mobile stepper vs desktop full form |
| **i18n** | ✅ Good | EN/BG translations throughout |
| **Supabase Integration** | ✅ Good | Auth checks, profile fetching, product creation |

### 🟡 Needs Improvement

| Aspect | Status | Issues |
|--------|--------|--------|
| **Hardcoded Colors** | ⚠️ Bad | `bg-green-600`, `text-amber-600`, `bg-amber-50`, etc. everywhere |
| **Inconsistent Shadows** | ⚠️ Bad | Mix of custom shadows and no shadows |
| **Gradients** | ⚠️ Bad | `bg-linear-to-b from-amber-50/50 to-white` hardcoded |
| **Component Modularity** | ⚠️ Mixed | Good sections but inline sub-components |
| **shadcn Usage** | ⚠️ Incomplete | Basic components used but custom buttons/cards everywhere |
| **Form Errors** | ⚠️ Bad | Errors displayed but not using FormField pattern |
| **Progress UI** | ⚠️ Bad | Hardcoded green-600 for completion states |
| **Accessibility** | ⚠️ Needs Work | Some ARIA labels but incomplete coverage |

---

## 🎨 Part 2: Hardcoded Style Audit

### Critical Files & Hardcoded Values

#### 1. `sell-form.tsx` (607 lines)
```tsx
// HARDCODED COLORS - MUST FIX
Line 89:  "text-green-600" // progress complete
Line 125: "CloudCheck className="size-3.5 text-green-600"" // save status
Line 196: "bg-green-600 text-white" // checklist completed
Line 215: "text-green-600 shrink-0" // tip checkmarks
Line 538: "bg-green-600 hover:bg-green-700" // submit button complete
Line 549: "bg-green-600 hover:bg-green-700" // desktop submit
```

#### 2. `sections/photos-section.tsx` (655 lines)
```tsx
Line 178: "bg-amber-500 hover:bg-amber-500" // COVER badge
Line 206: "bg-black/60" // position badge
Line 224: "bg-white/95" // action buttons
Line 237: "bg-linear-to-t from-black/70" // overlay gradient
Line 296: "text-green-600" // upload success
```

#### 3. `sections/pricing-section.tsx` (449 lines)
```tsx
Line 91:  "text-green-600" // price below market
Line 92:  "text-amber-600" // price above market
Line 227: "bg-green-500/10" // section icon bg
Line 228: "text-green-600" // section icon
```

#### 4. `sections/shipping-section.tsx` (487 lines)
```tsx
// Relatively clean - uses semantic colors
```

#### 5. `sections/details-section.tsx` (560 lines)
```tsx
// Mostly clean but uses custom selects instead of shadcn Select
```

#### 6. `seller-onboarding-wizard.tsx` (487 lines)
```tsx
// Uses motion framer but clean color usage
```

#### 7. `client.tsx` (190 lines)
```tsx
Line 99:  "bg-linear-to-b from-background to-muted/30" // subtle gradient - OK
Line 120: "bg-linear-to-b from-amber-50/50 to-white" // HARDCODED AMBER GRADIENT
```

---

## 🔧 Part 3: Component Audit

### shadcn Components Currently Used
- ✅ `Button` - Used correctly
- ✅ `Input` - Used correctly
- ✅ `Label` - Used correctly
- ✅ `Progress` - Used correctly
- ✅ `Badge` - Used but hardcoded colors
- ✅ `Avatar` - Used in header
- ✅ `AlertDialog` - Used for exit confirmation
- ✅ `DropdownMenu` - Used in header
- ✅ `Textarea` - Used (but custom wrapper exists)

### shadcn Components MISSING (Should Add)
- ❌ `Select` - Using custom `<select>` elements
- ❌ `Form` + `FormField` - Not using shadcn form pattern
- ❌ `Card` + `CardHeader` + `CardContent` - Custom sections instead
- ❌ `RadioGroup` - Using custom radio-like buttons
- ❌ `Checkbox` - Using custom checkbox-like buttons
- ❌ `Separator` - Using hardcoded borders
- ❌ `Switch` - Using custom toggles
- ❌ `Tooltip` - Missing helpful tooltips
- ❌ `Skeleton` - Custom skeleton instead of shadcn

---

## 📐 Part 4: UI/UX Issues (Desktop Focus)

### Layout Issues
1. **Header is too thin** - Only 56px (h-14), feels cramped
2. **Progress bar hidden on mobile in header** - But shown in footer
3. **Sidebar too narrow** - 288px (w-72) could be wider
4. **Form max-width constraint** - `lg:max-w-3xl` may be too narrow
5. **Section spacing inconsistent** - `space-y-6` but gaps vary

### Visual Issues
1. **Inconsistent border-radius** - Mix of `rounded-lg`, `rounded-xl`, `rounded-md`
2. **Shadow inconsistency** - Some cards have borders only, others shadows
3. **Icon sizing** - Mix of `size-4`, `size-5`, `h-5 w-5` patterns
4. **Color semantics** - Green used for success, completion, pricing, money icons
5. **Button variants** - Custom colors instead of using variants

### Form UX Issues
1. **No inline validation indicators** - Errors only shown after blur
2. **Missing helpful tooltips** - Fields lack explanatory help
3. **Category picker friction** - Modal-based, could be inline cascade
4. **Brand picker search** - Good but could auto-suggest popular
5. **Price input** - No live currency formatting
6. **Photo upload** - Good but no crop/edit functionality
7. **Shipping regions** - Good cards but overwhelming if many

### Accessibility Issues
1. **Focus states** - Inconsistent focus rings
2. **Contrast** - Some muted-foreground text may be low contrast
3. **Keyboard navigation** - Photo reorder not keyboard accessible
4. **Screen reader** - Missing some aria-describedby for errors
5. **Touch targets** - Some buttons below 44px minimum

---

## 🎯 Part 5: Improvement Plan

### Phase 1: Token & Color Cleanup (Priority: CRITICAL)

**Goal:** Remove ALL hardcoded colors, use EXISTING semantic tokens

#### 1.1 EXISTING Tokens in globals.css (USE THESE!)
```css
/* ✅ ALREADY DEFINED - just use them! */
--color-success: oklch(0.60 0.18 145);     /* Light mode */
--color-success: oklch(0.65 0.16 145);     /* Dark mode */
--color-warning: oklch(0.75 0.16 85);      /* Light mode */
--color-warning: oklch(0.70 0.14 85);      /* Dark mode */
--color-status-complete: oklch(0.55 0.18 145);
--color-progress-fill: oklch(0.48 0.22 260);

/* Form-specific tokens ALREADY EXIST */
--color-form-section-bg: oklch(1 0 0);
--color-form-section-border: oklch(0.92 0 0);
--color-form-input-bg: oklch(0.98 0 0);
--color-form-label: oklch(0.25 0 0);
--color-form-helper: oklch(0.55 0 0);
```

#### 1.2 ADD These Missing Tokens to globals.css @theme section:
```css
/* Sell form completion states */
--color-form-complete: var(--color-success);
--color-form-complete-bg: oklch(0.97 0.02 145);
--color-form-incomplete: var(--color-muted-foreground);

/* Warning/attention for pricing */
--color-price-competitive: var(--color-success);
--color-price-above-market: var(--color-warning);
--color-price-below-market: var(--color-success);

/* Cover badge */
--color-cover-badge: oklch(0.72 0.14 80);  /* Gold/amber semantic */
--color-cover-badge-foreground: oklch(0.15 0.02 80);
```

#### 1.2 Replace hardcoded colors
| Current | Replace With |
|---------|--------------|
| `bg-green-600` | `bg-success` |
| `text-green-600` | `text-success` |
| `bg-green-500/10` | `bg-success/10` |
| `text-amber-600` | `text-warning` |
| `bg-amber-50` | `bg-warning-muted` |
| `from-amber-50/50 to-white` | `from-muted/50 to-background` |

#### 1.3 Remove hardcoded gradients
- Replace `bg-linear-to-b from-amber-50/50 to-white` with `bg-muted/30` or theme token
- Remove photo overlay gradients or use opacity-based tokens

### Phase 2: shadcn Component Migration (Priority: HIGH)

#### 2.1 Add missing shadcn components
```bash
npx shadcn@latest add select
npx shadcn@latest add radio-group
npx shadcn@latest add checkbox
npx shadcn@latest add separator
npx shadcn@latest add switch
npx shadcn@latest add tooltip
npx shadcn@latest add card
```

#### 2.2 Migrate to shadcn Form pattern
```tsx
// BEFORE (current)
<Input
  value={title}
  onChange={(e) => form.setValue("title", e.target.value)}
  className={cn(titleError && "border-destructive")}
/>
{titleError && <span className="text-destructive">{titleError}</span>}

// AFTER (shadcn Form pattern)
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
      <FormControl>
        <Input placeholder="..." {...field} />
      </FormControl>
      <FormDescription>80 characters max</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### 2.3 Replace custom selects with shadcn Select
```tsx
// BEFORE (custom)
<select className="block w-full appearance-none rounded-lg...">

// AFTER (shadcn)
<Select value={value} onValueChange={onChange}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    {options.map(opt => (
      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### 2.4 Use Card for sections
```tsx
// BEFORE
<section className="rounded-lg border border-border bg-card">
  <div className="p-5 pb-3">

// AFTER
<Card>
  <CardHeader>
    <CardTitle>Item Details</CardTitle>
    <CardDescription>Help buyers find your item</CardDescription>
  </CardHeader>
  <CardContent>
```

### Phase 3: Layout & Spacing (Priority: MEDIUM)

#### 3.1 Standardize border-radius
- Use `rounded-lg` (--radius-lg: 0.375rem) consistently
- Exception: Buttons use `rounded-md`

#### 3.2 Fix section spacing
```tsx
// Use consistent gaps
<div className="space-y-section"> // Use custom token --spacing-section
```

#### 3.3 Improve desktop layout
```tsx
// Increase form max-width
<div className="flex-1 min-w-0 lg:max-w-4xl"> // Was 3xl

// Increase sidebar width
<aside className="hidden lg:block w-80 shrink-0"> // Was w-72
```

### Phase 4: UX Enhancements (Priority: MEDIUM)

#### 4.1 Add helpful tooltips
```tsx
<FormLabel>
  Price
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="size-4 ml-1 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        Set a competitive price to sell faster
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</FormLabel>
```

#### 4.2 Improve validation feedback
- Add real-time character counters with color transitions
- Show inline success states when fields are valid
- Animate error appearance/disappearance

#### 4.3 Enhance progress indicator
```tsx
// Add step indicators alongside percentage
<div className="flex items-center gap-2">
  {sections.map((section, i) => (
    <div 
      key={i}
      className={cn(
        "size-2 rounded-full transition-colors",
        section.complete ? "bg-success" : "bg-muted"
      )}
    />
  ))}
</div>
```

### Phase 5: Accessibility (Priority: HIGH)

#### 5.1 Focus management
```tsx
// Consistent focus-visible states
className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

#### 5.2 ARIA improvements
```tsx
<FormField
  aria-describedby={error ? `${name}-error` : undefined}
  aria-invalid={!!error}
/>
<span id={`${name}-error`} role="alert">{error}</span>
```

#### 5.3 Keyboard accessibility
- Add keyboard drag-and-drop for photos
- Ensure all interactive elements are focusable
- Add skip links for form sections

---

## 📁 Part 6: File-by-File Changes

### Files to Modify

| File | Priority | Changes Required |
|------|----------|------------------|
| `app/globals.css` | P1 | Add semantic color tokens |
| `sell-form.tsx` | P1 | Replace hardcoded colors, migrate to Card |
| `sections/photos-section.tsx` | P1 | Replace hardcoded colors, improve upload UI |
| `sections/details-section.tsx` | P2 | Migrate to shadcn Select, FormField pattern |
| `sections/pricing-section.tsx` | P1 | Replace hardcoded colors, add tooltips |
| `sections/shipping-section.tsx` | P2 | Minor token cleanup |
| `client.tsx` | P1 | Remove amber gradient |
| `sign-in-prompt.tsx` | P3 | Minor cleanup |
| `seller-onboarding-wizard.tsx` | P3 | Minor cleanup |
| `ui/stepper-header.tsx` | P2 | Token cleanup |
| `steps/step-review.tsx` | P2 | Token cleanup |

### New Files to Create

| File | Purpose |
|------|---------|
| `components/sell/ui/form-section.tsx` | Standardized section wrapper using Card |
| `components/sell/ui/price-input.tsx` | Enhanced price input with formatting |
| `components/sell/ui/condition-picker.tsx` | shadcn RadioGroup-based picker |
| `components/sell/ui/shipping-picker.tsx` | shadcn Checkbox-based picker |

---

## 🚀 Part 7: Implementation Order

### Sprint 1: Foundation (Days 1-2)
1. [ ] Add semantic color tokens to globals.css
2. [ ] Create utility classes for success/warning/info states
3. [ ] Install missing shadcn components

### Sprint 2: Core Form Migration (Days 3-5)
4. [ ] Migrate sell-form.tsx to semantic colors
5. [ ] Migrate photos-section.tsx to semantic colors
6. [ ] Migrate pricing-section.tsx to semantic colors
7. [ ] Remove all hardcoded gradients from client.tsx

### Sprint 3: Component Enhancement (Days 6-8)
8. [ ] Migrate details-section.tsx to shadcn Select
9. [ ] Create form-section wrapper component
10. [ ] Implement shadcn FormField pattern throughout

### Sprint 4: UX Polish (Days 9-10)
11. [ ] Add tooltips to all form fields
12. [ ] Improve progress indicator
13. [ ] Add animation/transitions for errors
14. [ ] Accessibility audit and fixes

---

## ✅ Success Criteria

1. **Zero hardcoded colors** - All colors use theme tokens
2. **Consistent visual language** - Same border-radius, shadows, spacing
3. **Full shadcn integration** - Form, Select, Card, RadioGroup used
4. **Accessible** - WCAG 2.1 AA compliant
5. **Performant** - No layout shifts, smooth animations
6. **Maintainable** - Single source of truth for styling

---

## 📊 Current vs Target State

| Metric | Current | Target |
|--------|---------|--------|
| Hardcoded colors | 30+ instances | 0 |
| shadcn components | 10 | 18+ |
| Custom selects | 5 | 0 |
| Accessibility score | ~70% | 95%+ |
| Visual consistency | 60% | 100% |
| Dark mode support | Partial | Full |

---

## 🔗 Related Files

- [globals.css](../../app/globals.css) - Theme tokens
- [components.json](../../components.json) - shadcn config
- [sell-form-schema-v4.ts](../../lib/sell-form-schema-v4.ts) - Validation schema
- [PageContainer](../../components/ui/page-container.tsx) - Layout component

---

## 🔨 Part 8: Detailed Implementation Checklist

### IMMEDIATE FIXES (Can Do Now)

#### A. Color Token Replacements (sell-form.tsx)

```tsx
// Line 89 - Progress complete text
// FROM:
"text-green-600"
// TO:
"text-status-complete" // or "text-success"

// Line 125 - CloudCheck icon
// FROM:
"text-green-600"
// TO:
"text-status-complete"

// Line 196 - Checklist completed circle
// FROM:
"bg-green-600 text-white"
// TO:
"bg-status-complete text-white"

// Lines 538, 549 - Submit buttons complete state
// FROM:
"bg-green-600 hover:bg-green-700"
// TO:
"bg-success hover:bg-success/90" // or use primary when 100%
```

#### B. Color Token Replacements (photos-section.tsx)

```tsx
// Line 178 - COVER badge
// FROM:
"bg-amber-500 hover:bg-amber-500 text-white"
// TO:
"bg-[oklch(var(--color-cover-badge))] text-[oklch(var(--color-cover-badge-foreground))]"
// OR simpler: "bg-amber-500/90 text-amber-950" using semantic

// Line 206 - Position badge
// FROM:
"bg-black/60 text-white"
// TO:
"bg-foreground/70 text-background" // More semantic

// Line 296 - Upload success
// FROM:
"text-green-600"
// TO:
"text-success"
```

#### C. Color Token Replacements (pricing-section.tsx)

```tsx
// Line 91-92 - Price position indicators
// FROM:
"text-green-600" // below market
"text-amber-600" // above market
// TO:
"text-success" // below market
"text-warning" // above market

// Line 227-228 - Section icon
// FROM:
"bg-green-500/10"
"text-green-600"
// TO:
"bg-success/10"
"text-success"
```

#### D. Gradient Removal (client.tsx)

```tsx
// Line 120 - Onboarding wizard background
// FROM:
"bg-linear-to-b from-amber-50/50 to-white"
// TO:
"bg-muted/30" // Clean, no gradient
// OR: "bg-gradient-to-b from-background to-muted/20" // Subtle neutral
```

### COMPONENT MIGRATIONS

#### E. Details Section - Replace Custom Select

```tsx
// CURRENT (lines ~275-285):
<div className="relative">
  <select
    value={currentValue}
    onChange={(e) => handleAttributeChange(attr, e.target.value)}
    className="block w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none"
  >
    <option value="">Select {getName(attr)}</option>
    {attr.options.map((opt, i) => (
      <option key={opt} value={opt}>...</option>
    ))}
  </select>
  <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2..." />
</div>

// REPLACE WITH (shadcn Select):
<Select value={currentValue} onValueChange={(v) => handleAttributeChange(attr, v)}>
  <SelectTrigger className="h-10">
    <SelectValue placeholder={`Select ${getName(attr)}`} />
  </SelectTrigger>
  <SelectContent>
    {attr.options.map((opt, i) => (
      <SelectItem key={opt} value={opt}>
        {locale === "bg" && attr.options_bg?.[i] ? attr.options_bg[i] : opt}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### F. Form Sections - Use Card Component

```tsx
// CURRENT pattern across sections:
<section className="rounded-lg border border-border bg-card">
  <div className="p-5 pb-3">
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>
      <div>
        <h3 className="text-base font-semibold">Title</h3>
        <p className="text-sm text-muted-foreground">Description</p>
      </div>
    </div>
  </div>
  <div className="space-y-6 px-5 pb-6">
    {/* content */}
  </div>
</section>

// REPLACE WITH (shadcn Card + custom FormSectionHeader):
<Card>
  <CardHeader className="pb-3">
    <FormSectionHeader icon={Icon}>
      <CardTitle className="text-base">Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </FormSectionHeader>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* content */}
  </CardContent>
</Card>
```

### SHADCN COMPONENTS TO INSTALL

```bash
# Run these commands:
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add radio-group
pnpm dlx shadcn@latest add switch
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add separator
```

### CSS TOKEN ADDITIONS

Add to `globals.css` in the `@theme` section (around line 165):

```css
/* === SELL FORM SPECIFIC TOKENS === */
--color-cover-badge: oklch(0.78 0.14 65);  /* Warm gold */
--color-cover-badge-foreground: oklch(0.20 0.05 65);

/* Form completion states */
--color-form-complete: var(--color-success);
--color-form-complete-muted: oklch(0.97 0.02 145);
```

And in dark mode section (around line 340):

```css
/* Dark mode sell form tokens */
--color-cover-badge: oklch(0.72 0.12 65);
--color-cover-badge-foreground: oklch(0.98 0 0);
--color-form-complete-muted: oklch(0.25 0.04 145);
```

---

## 📋 Implementation Prioritization

### P0 - Critical (Do First)
1. [ ] Add missing CSS tokens to globals.css
2. [ ] Replace `bg-green-600/text-green-600` → `bg-success/text-success` in sell-form.tsx
3. [ ] Replace gradient in client.tsx
4. [ ] Fix pricing-section.tsx colors

### P1 - High (Do Second)
5. [ ] Install shadcn Select component
6. [ ] Migrate custom selects in details-section.tsx
7. [ ] Replace hardcoded colors in photos-section.tsx
8. [ ] Add tooltips to form fields

### P2 - Medium (Polish)
9. [ ] Install shadcn Card and migrate section wrappers
10. [ ] Standardize border-radius usage
11. [ ] Add better keyboard navigation
12. [ ] Improve progress indicator UX

### P3 - Nice to Have
13. [ ] Add inline validation animations
14. [ ] Photo crop/edit functionality
15. [ ] Price auto-formatting

---

**Next Steps:** Begin P0 implementation - add CSS tokens and replace hardcoded green colors.
