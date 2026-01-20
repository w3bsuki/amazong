# 🚀 SELL FORM MASTERPIECE - Complete Redesign Plan

> **Goal**: Transform /sell into a premium, app-like experience with Framer Motion animations, intuitive category-aware UX, and bulletproof validation.

---

## 📊 Current State Analysis

### Problems with Current `/sell` Form

1. **No Framer Motion** - Uses CSS transitions only, feels static and web-like
2. **Category placement is wrong** - Currently Step 1 mixes Title + Category + Condition + Attributes
3. **Information overload** - Too many fields visible at once on mobile
4. **No direction-aware animations** - Forward/back feel identical
5. **Typography inconsistencies** - Mix of sizing patterns
6. **Complicated stepper** - 4 steps but content doesn't flow naturally:
   - Step 1: Basics (title, category, attributes, condition, brand) — TOO MUCH
   - Step 2: Photos  
   - Step 3: Price & Shipping
   - Step 4: Review + Description (why is description last?)

### What Demo Routes Do Right

| Feature | sell5 | sell6 | sell7 | **New /sell** |
|---------|-------|-------|-------|---------------|
| Framer Motion | ❌ | ❌ | ✅ | ✅ |
| Direction-aware transitions | ❌ | ❌ | ✅ | ✅ |
| Photo-first flow | ❌ | ❌ | ✅ | ✅ (hybrid) |
| Category drives attributes | ✅ | ✅ | ❌ | ✅ |
| i18n support | ❌ | ✅ | ❌ | ✅ |
| Success screen | ✅ | ❌ | ✅ | ✅ |
| iOS-style grouping | ❌ | ✅ | ✅ | ✅ |
| Completion indicators | ✅ | ✅ | ❌ | ✅ |

---

## 🎯 New UX Flow - "Title First, Category Smart"

The key insight: **Users know what they're selling before anything else.**

### Step Flow (5 Steps)

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: WHAT                                                    │
│ ─────────────────────                                           │
│ • Title (required, 5-80 chars)                                  │
│ • 1 Primary Photo (required, drag to reorder later)             │
│                                                                 │
│ Why: User names their item + shows us what it looks like.       │
│ Low friction entry point. ~10 seconds.                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: CATEGORY                                                │
│ ─────────────────────                                           │
│ • Full-screen category picker with search                       │
│ • Breadcrumb trail at top                                       │
│ • Auto-advance on leaf selection                                │
│                                                                 │
│ Why: Category determines ALL subsequent fields.                 │
│ User picks: Electronics → Mobile → iPhone → attributes load.    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: DETAILS                                                 │
│ ─────────────────────                                           │
│ • Condition selector (color-coded chips)                        │
│ • Category-specific attributes (Make/Model for cars, etc.)      │
│ • Description (expandable textarea)                             │
│ • Additional photos (up to 11 more)                             │
│                                                                 │
│ Why: Now we KNOW what category → show relevant fields only.     │
│ Vehicle? Show Make/Model/Year/Mileage. Phone? Show Storage/Color│
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: PRICE & SHIPPING                                        │
│ ─────────────────────                                           │
│ • Price input with currency toggle                              │
│ • Format toggle (Fixed/Auction) - future                        │
│ • Shipping options (grouped list)                               │
│ • City selector (for local pickup)                              │
│                                                                 │
│ Why: Pricing is a decision point - keep separate from details.  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: REVIEW & PUBLISH                                        │
│ ─────────────────────                                           │
│ • Preview card (like product page)                              │
│ • Quick edit buttons for each section                           │
│ • Validation summary (green checks / red warnings)              │
│ • Big "Publish" CTA                                             │
│                                                                 │
│ Why: Final check before going live. Build confidence.           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System Decisions

### Typography (from sell7 iOS style)
```tsx
// Headers
"text-2xl font-bold tracking-tight"        // Step titles
"text-[17px] font-semibold"                // Navigation/CTA text

// Labels  
"text-[13px] uppercase tracking-wider text-muted-foreground font-medium"

// Body
"text-[15px] text-muted-foreground"        // Descriptions
"text-[17px] text-foreground"              // Form values
```

### Touch Targets
```tsx
// Primary CTAs
"h-14 rounded-xl"                          // 56px - thumb-friendly

// List rows
"min-h-[56px] px-4"                        // iOS table cell height

// Icon buttons  
"size-10"                                  // 40px minimum
```

### Colors & Backgrounds
```tsx
// iOS grouped table view
"bg-[#F2F2F7] dark:bg-background"          // Page background
"bg-background"                            // Card background
"divide-y divide-border/60"                // Card row dividers
"border-border/50"                         // Subtle borders
```

### Framer Motion Variants
```tsx
const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

const pageTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};
```

---

## 🛠 Implementation Plan

### Phase 1: Core Stepper Rewrite (HIGH PRIORITY)
**Files to modify:**
- `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx` - Complete rewrite
- `app/[locale]/(sell)/_components/layouts/stepper-wrapper.tsx` - Add Framer Motion

**Tasks:**
1. Add Framer Motion `AnimatePresence` + `motion.div` wrappers
2. Implement direction-aware page transitions
3. Restructure steps to match new flow (5 steps)
4. Update progress indicators (thin bar + dots)

### Phase 2: Step Content Components
**New/Modified files:**
- `_components/steps/step-what.tsx` - Title + 1 Photo
- `_components/steps/step-category.tsx` - Full-screen category picker
- `_components/steps/step-details.tsx` - Condition + Attributes + Description + Photos
- `_components/steps/step-pricing.tsx` - Price + Shipping
- `_components/steps/step-review.tsx` - Preview + Publish

### Phase 3: iOS-Style UI Components
**Shared components:**
- `ListCard` - White card with rounded corners
- `ListRow` - Tappable row with label/value/chevron
- `SegmentControl` - For Fixed/Auction toggle
- `ChipSelector` - For condition options

### Phase 4: Category-Smart Attributes
**Leverage existing:**
- Keep `useCategoryAttributes` hook
- Keep DB-driven attribute fetching
- Improve rendering with iOS-style grouped lists

---

## 📁 File Structure (After Refactor)

```
app/[locale]/(sell)/_components/
├── sell-form-provider.tsx       # Keep (form state)
├── sell-form-unified.tsx        # Simplify (just renders mobile/desktop)
├── sell-header.tsx              # Keep
├── layouts/
│   ├── desktop-layout.tsx       # Keep for lg+
│   ├── mobile-layout.tsx        # REWRITE - new stepper with Framer Motion
│   └── index.ts
├── steps/                       # NEW - Step content components
│   ├── step-what.tsx
│   ├── step-category.tsx
│   ├── step-details.tsx
│   ├── step-pricing.tsx
│   ├── step-review.tsx
│   └── index.ts
├── ui/                          # Existing + new iOS-style components
│   ├── list-card.tsx            # NEW
│   ├── list-row.tsx             # NEW
│   ├── chip-selector.tsx        # NEW or existing
│   ├── category-modal.tsx       # Keep, maybe enhance
│   └── ...
└── fields/                      # Keep existing, use in step components
```

---

## 🔄 Migration Strategy

### Step 1: Create New Mobile Layout (Non-Breaking)
Create `mobile-layout-v2.tsx` alongside existing, test in parallel.

### Step 2: Feature Flag
```tsx
// In sell-form-unified.tsx
const useNewMobileLayout = true; // Toggle during development

{useNewMobileLayout ? <MobileLayoutV2 /> : <MobileLayout />}
```

### Step 3: Gradual Field Migration
Reuse existing field components where possible, wrap in iOS-style cards.

### Step 4: Switch & Cleanup
Once stable, replace old mobile layout and remove feature flag.

---

## ✅ Success Criteria

1. **App-like feel**: Smooth 60fps page transitions with Framer Motion
2. **5-step flow**: What → Category → Details → Pricing → Review
3. **Category-driven**: Attributes load dynamically after category selection
4. **iOS visual language**: Grouped lists, correct typography, proper spacing
5. **i18n ready**: All strings through next-intl
6. **No regressions**: Desktop layout unchanged, all validations work
7. **Touch-friendly**: 44-56px touch targets throughout

---

## 📋 Implementation Checklist

### Core Stepper (Phase 1)
- [ ] Add Framer Motion to stepper-wrapper
- [ ] Implement direction state tracking
- [ ] Create animated step container
- [ ] Update progress bar animation
- [ ] Add step dots with scale animation

### Step Components (Phase 2)
- [ ] Step 1: What (Title + 1 Photo)
- [ ] Step 2: Category (Full-screen picker)
- [ ] Step 3: Details (Condition + Attributes + Description + Photos)
- [ ] Step 4: Pricing (Price + Shipping)
- [ ] Step 5: Review (Preview + Publish)

### UI Components (Phase 3)
- [ ] ListCard component
- [ ] ListRow component  
- [ ] SegmentControl component
- [ ] ChipSelector refinement

### Polish (Phase 4)
- [ ] Haptic feedback (if available)
- [ ] Loading states
- [ ] Error animations
- [ ] Success celebration

---

## 🚨 Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Desktop regression | Keep desktop layout unchanged, only modify mobile |
| Form state loss during refactor | Keep existing provider, only change UI layer |
| Performance on low-end devices | Use `will-change`, test on real devices |
| Translation gaps | Audit all new strings for en.json + bg.json |

---

## 📅 Estimated Timeline

- **Phase 1 (Core Stepper)**: 2-3 hours
- **Phase 2 (Step Components)**: 3-4 hours  
- **Phase 3 (UI Components)**: 1-2 hours
- **Phase 4 (Polish)**: 1-2 hours

**Total**: 7-11 hours of focused work

---

## 🎬 Next Steps

1. Read this plan
2. Confirm the 5-step flow is acceptable
3. Start with Phase 1: Stepper + Framer Motion
4. Iterate on each step component
5. Test on mobile devices
6. Ship it! 🚀
