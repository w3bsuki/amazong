# Anti-Patterns — What NOT to Do

> Common mistakes that break our styling consistency.
> Each anti-pattern includes the fix.

---

## 1. ❌ Arbitrary Values

**Problem**: Using arbitrary Tailwind values like `[42px]` creates inconsistent sizing.

```tsx
// ❌ BAD
className="h-[42px] text-[13px] w-[180px] gap-[10px]"

// ✅ GOOD - Use the scale
className="h-10 text-sm w-44 gap-2.5"
// Or closest: h-11 (44px), text-sm (14px), w-48 (192px), gap-3 (12px)
```

**Exceptions**: Container max-widths defined in globals.css are fine.

---

## 2. ❌ Heavy Shadows

**Problem**: Shadows heavier than `shadow-sm` look dated and break the flat design.

```tsx
// ❌ BAD
className="shadow-lg"
className="shadow-xl"
className="shadow-2xl"

// ✅ GOOD
className="shadow-none"                    // Default for cards
className="shadow-sm"                      // Hover states only
className="lg:hover:shadow-sm"             // Desktop hover
className="shadow-md"                      // Modals/popovers ONLY
```

---

## 3. ❌ Large Border Radius

**Problem**: Rounded corners over 6px look playful, not professional.

```tsx
// ❌ BAD - on cards/containers
className="rounded-xl"
className="rounded-2xl"
className="rounded-3xl"

// ✅ GOOD
className="rounded-sm"                     // 2px - badges
className="rounded-md"                     // 4px - cards (MAX)
className="rounded-lg"                     // 6px - modals only
className="rounded-full"                   // Pills, avatars
```

---

## 4. ❌ Gradients

**Problem**: Gradients look dated and don't match the flat marketplace aesthetic.

```tsx
// ❌ BAD
className="bg-gradient-to-r from-blue-500 to-purple-500"
className="bg-gradient-to-b from-white to-gray-100"

// ✅ GOOD - Solid colors only
className="bg-cta-trust-blue"
className="bg-primary"
className="bg-card"
```

---

## 5. ❌ Hardcoded Colors

**Problem**: Hardcoded colors break dark mode and create inconsistency.

```tsx
// ❌ BAD
className="bg-[#1a1a1a]"
className="text-blue-600"
className="border-gray-200"
className="bg-white"

// ✅ GOOD - Semantic tokens
className="bg-background"
className="text-primary"
className="border-border"
className="bg-card"
```

---

## 6. ❌ Inconsistent Text Sizes

**Problem**: Mixing different text sizes for the same content type.

```tsx
// ❌ BAD - body text at different sizes
<p className="text-base">Product description</p>
<p className="text-sm">Another description</p>
<p className="text-xs">A third description</p>

// ✅ GOOD - consistent sizing by content type
<p className="text-sm">Product description</p>      // Body text = text-sm
<p className="text-xs text-muted-foreground">Meta</p> // Meta = text-xs
<p className="text-base font-semibold">$99.99</p>   // Price = text-base
```

---

## 7. ❌ Missing Mobile Optimization

**Problem**: Desktop-first thinking that breaks on mobile.

```tsx
// ❌ BAD - fixed widths break mobile
className="w-96"
className="grid-cols-4"

// ✅ GOOD - mobile-first
className="w-full max-w-96"
className="grid grid-cols-2 lg:grid-cols-4"
```

---

## 8. ❌ Animation Overuse

**Problem**: Animations slow down the UI and feel unprofessional.

```tsx
// ❌ BAD
className="transition-all duration-300"
className="animate-bounce"
className="hover:scale-105"

// ✅ GOOD - minimal or none
className=""                                        // No animation (preferred)
className="transition-colors duration-100"          // Fast color change only
className="transition-opacity duration-100"         // Fast fade only
```

---

## 9. ❌ Inconsistent Spacing

**Problem**: Using different gaps/padding for similar layouts.

```tsx
// ❌ BAD - inconsistent gaps
<div className="gap-2">{/* Product grid 1 */}</div>
<div className="gap-4">{/* Product grid 2 */}</div>
<div className="gap-6">{/* Product grid 3 */}</div>

// ✅ GOOD - consistent by context
<div className="gap-4">{/* All product grids */}</div>
<div className="gap-2">{/* All inline elements */}</div>
<div className="gap-3">{/* All card contents */}</div>
```

---

## 10. ❌ Touch Target Too Small

**Problem**: Interactive elements under 24px are hard to tap.

```tsx
// ❌ BAD
<button className="size-4">{/* Too small! */}</button>
<button className="p-1">{/* Padding not enough */}</button>

// ✅ GOOD - minimum 24px
<button className="size-6 flex items-center justify-center">
  <Icon className="size-4" />
</button>

// Or with Button component
<Button size="xs" className="h-6">{/* 24px height */}</Button>
```

---

## 11. ❌ Blue-on-Blue Badges

**Problem**: Low contrast text on similar background color.

```tsx
// ❌ BAD
className="bg-blue-100 text-blue-600"              // Hard to read
className="bg-primary/10 text-primary"             // Low contrast

// ✅ GOOD - high contrast combinations
className="bg-foreground/90 text-background"       // Dark bg, light text
className="bg-muted text-foreground"               // Light bg, dark text
className="bg-category-badge-bg text-category-badge-text" // Semantic token
```

---

## 12. ❌ Excessive Nesting

**Problem**: Too many wrapper divs for simple layouts.

```tsx
// ❌ BAD
<div className="flex">
  <div className="flex-1">
    <div className="p-4">
      <div className="space-y-2">
        <span>Text</span>
      </div>
    </div>
  </div>
</div>

// ✅ GOOD
<div className="flex-1 p-4 space-y-2">
  <span>Text</span>
</div>
```

---

## 13. ❌ Inline Style Mixing

**Problem**: Using inline styles alongside Tailwind.

```tsx
// ❌ BAD
<div className="flex" style={{ marginTop: '20px', backgroundColor: '#f0f0f0' }}>

// ✅ GOOD
<div className="flex mt-5 bg-muted">
```

---

## 14. ❌ Ignoring Design Tokens

**Problem**: Recreating colors that exist in globals.css.

```tsx
// ❌ BAD - recreating what exists
className="bg-red-500 text-white"                  // Deals
className="text-green-600"                         // Success
className="bg-yellow-100 text-yellow-800"          // Warning

// ✅ GOOD - use tokens
className="bg-deal text-white"
className="text-success"
className="bg-warning/10 text-warning"
```

---

## 15. ❌ Missing Dark Mode Support

**Problem**: Using light-only colors that break in dark mode.

```tsx
// ❌ BAD
className="bg-white text-black"
className="border-gray-200"

// ✅ GOOD
className="bg-card text-card-foreground"
className="border-border"
```

---

## 16. ❌ Shimmer/Skeleton Animations

**Problem**: Animated loading skeletons are distracting.

```tsx
// ❌ BAD
<div className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200">

// ✅ GOOD - static skeleton
<Skeleton className="h-4 w-full" />
```

---

## 17. ❌ Custom Button Styles

**Problem**: Creating one-off button styles instead of using variants.

```tsx
// ❌ BAD
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">

// ✅ GOOD
<Button variant="default">Click me</Button>
<Button variant="cta">Buy Now</Button>
```

---

## 18. ❌ Inconsistent Icon Sizes

**Problem**: Different icon sizes in similar contexts.

```tsx
// ❌ BAD
<Heart className="size-3" />    // In card 1
<Heart className="size-5" />    // In card 2
<Heart className="size-4" />    // In card 3

// ✅ GOOD - consistent by context
// Inside buttons/cards: size-4
// Standalone: size-5 or size-6
// Inside badges: size-3 or size-3.5
```

---

## Quick Fix Checklist

Before committing, verify:

- [ ] No arbitrary values (`[42px]`, `[#ff0000]`)
- [ ] No shadows heavier than `shadow-sm` (except modals)
- [ ] No radius over `rounded-md` for cards
- [ ] No gradients
- [ ] No hardcoded colors
- [ ] Touch targets ≥ 24px
- [ ] Uses semantic color tokens
- [ ] Works in dark mode
- [ ] Mobile-first responsive
- [ ] Uses existing Button/Badge/Card components
