# Sell Form UX/UI Audit: TradeSphere vs Treido

**Date:** 2026-02-02  
**Auditor:** AI Agent  
**Scope:** Mobile sell form comparison and improvement plan

---

## Executive Summary

The TradeSphere prototype (temp-tradesphere-audit) has a sell form with superior visual design and UX patterns despite using an older tech stack (Vite + React Router). This audit identifies the key design advantages and proposes improvements to Treido's current Next.js App Router implementation.

---

## Audit Findings

### 1. Form Presentation & Container

| Aspect | TradeSphere | Treido | Winner |
|--------|-------------|--------|--------|
| Entry point | Bottom sheet (95vh) | Full page | **TradeSphere** |
| Container style | `rounded-t-3xl` with rounded corners | Full page, no drawer | **TradeSphere** |
| Opening animation | Slide-in from bottom | Instant page navigation | **TradeSphere** |
| Close action | X button → Confirmation | Back nav to home | **TradeSphere** |

**TradeSphere Code:**
```tsx
<SheetContent side="bottom" className="h-[95vh] rounded-t-3xl p-0 flex flex-col">
```

**Issue:** Treido uses a full-page approach which feels less app-like. The bottom sheet pattern is more native-feeling on mobile.

---

### 2. Header & Progress

| Aspect | TradeSphere | Treido | Winner |
|--------|-------------|--------|--------|
| Header layout | `X/Back | Step Title | Spacer` | `Back | Dots | Close` | **Both good** |
| Step indicator | "Step X of Y" text | Animated dots | **Treido** |
| Progress bar | Solid linear bar below header | Thin animated bar | **TradeSphere** (more visible) |

**TradeSphere Advantage:** Large, clear step title in center with "Step X of Y" subtext is more informative.

**Treido Advantage:** Animated dot progress is more premium.

**Recommendation:** Combine both - keep Treido's animated dots but add step title text.

---

### 3. Photo Upload Step

| Aspect | TradeSphere | Treido | Winner |
|--------|-------------|--------|--------|
| Grid layout | 3 columns | 4 columns | **TradeSphere** (larger thumbnails) |
| Add button | First position, dashed border, icon + text | First position, minimal | **TradeSphere** |
| Cover indicator | Badge on first image | Text badge | **Both equal** |
| Photo tips | Box with bullet tips | None | **TradeSphere** |
| Empty state | Large illustration + helper text | Minimal | **TradeSphere** |

**TradeSphere PhotoStep Features:**
```tsx
// Nice add button with visual affordance
<button className="aspect-square rounded-xl border-2 border-dashed border-border bg-secondary/50 flex flex-col items-center justify-center gap-2">
  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
    <Plus className="w-5 h-5 text-primary" />
  </div>
  <span className="text-xs text-muted-foreground font-medium">Add Photo</span>
</button>

// Photo tips section
<div className="mt-6 p-3 rounded-xl bg-secondary/50">
  <h4 className="font-medium text-sm text-foreground mb-2">Photo tips</h4>
  <ul className="text-xs text-muted-foreground space-y-1">
    <li>• Use good lighting and a clean background</li>
    <li>• Show the item from multiple angles</li>
    <li>• Include close-ups of any defects or details</li>
  </ul>
</div>
```

---

### 4. Category Selection

| Aspect | TradeSphere | Treido | Winner |
|--------|-------------|--------|--------|
| Category cards | Icon + Label + Chevron | Text hierarchy list | **TradeSphere** |
| Visual icons | Lucide icons for each category | No icons | **TradeSphere** |
| Subcategory | Same page with back button | CategorySelector modal | **TradeSphere** |
| Selection feedback | Primary bg + checkmark | Text highlight | **TradeSphere** |

**TradeSphere Category Card:**
```tsx
<button className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border tap-highlight hover:bg-accent">
  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
    <Icon className="w-5 h-5 text-primary" />
  </div>
  <span className="flex-1 text-left font-medium text-foreground">{category.label}</span>
  <ChevronRight className="w-5 h-5 text-muted-foreground" />
</button>
```

---

### 5. Details/Condition Step

| Aspect | TradeSphere | Treido | Winner |
|--------|-------------|--------|--------|
| Title input | Full width with char counter | SelectionRow style | **TradeSphere** (clearer) |
| Description | Full textarea with counter | Same | **Equal** |
| Condition options | Radio cards with descriptions | SelectionRow drawer | **TradeSphere** (inline) |

**TradeSphere Condition Cards:**
```tsx
<button className={`w-full flex items-start gap-3 p-3 rounded-xl border tap-highlight text-left ${
  isSelected ? "bg-primary/10 border-primary" : "bg-card border-border"
}`}>
  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
    isSelected ? "border-primary bg-primary" : "border-muted-foreground"
  }`}>
    {isSelected && <span className="text-primary-foreground text-xs">✓</span>}
  </div>
  <div>
    <p className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
      {condition.label}
    </p>
    <p className="text-xs text-muted-foreground">{condition.description}</p>
  </div>
</button>
```

**Key Difference:** TradeSphere shows all conditions inline with descriptions. Treido uses a drawer which adds an extra tap.

---

### 6. Pricing Step

| Aspect | TradeSphere | Treido | Winner |
|--------|-------------|--------|--------|
| Price input | Large with currency dropdown | Large with currency drawer | **TradeSphere** (fewer taps) |
| Currency selection | Inline `<select>` | Full drawer | **TradeSphere** |
| Toggle options | Card-style with icons | Switch style | **TradeSphere** (clearer affordance) |
| Location | Input + popular location chips | Missing in pricing | **TradeSphere** |

**TradeSphere Toggle Cards:**
```tsx
<button
  onClick={() => updateFormData({ negotiable: !formData.negotiable })}
  className={`w-full flex items-center justify-between p-4 rounded-xl border tap-highlight ${
    formData.negotiable ? "bg-primary/10 border-primary" : "bg-card border-border"
  }`}
>
  <div className="flex items-center gap-3">
    <MessageCircle className={`w-5 h-5 ${formData.negotiable ? "text-primary" : "text-muted-foreground"}`} />
    <div className="text-left">
      <p className={`font-medium ${formData.negotiable ? "text-primary" : "text-foreground"}`}>
        Price negotiable
      </p>
      <p className="text-xs text-muted-foreground">Allow buyers to make offers</p>
    </div>
  </div>
  {/* iOS-style toggle */}
  <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
    formData.negotiable ? "bg-primary" : "bg-secondary"
  }`}>
    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
      formData.negotiable ? "translate-x-5" : "translate-x-0"
    }`} />
  </div>
</button>
```

**Advantage:** TradeSphere's toggle cards are more visually clear and provide better context.

---

### 7. Review Step

| Aspect | TradeSphere | Treido | Winner |
|--------|-------------|--------|--------|
| Preview card | Full product card mockup | Summary grid | **TradeSphere** |
| Image display | 4:3 aspect ratio with photo count | Thumbnail grid | **TradeSphere** |
| Summary | Grid with key-value pairs | Similar | **Equal** |
| Visual hierarchy | Price prominent + title + badges | Summary rows | **TradeSphere** |

**TradeSphere Review Preview:**
```tsx
<div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
  {/* Main Image with photo count */}
  <div className="relative aspect-[4/3]">
    <img src={formData.photos[0]} className="w-full h-full object-cover" />
    {formData.photos.length > 1 && (
      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium">
        +{formData.photos.length - 1} photos
      </div>
    )}
  </div>
  
  <div className="p-4 space-y-3">
    {/* Large price */}
    <div className="flex items-center justify-between">
      <p className="text-2xl font-bold text-foreground">
        {formData.currency}{Number(formData.price).toLocaleString()}
      </p>
      {formData.negotiable && (
        <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
          Negotiable
        </span>
      )}
    </div>
    
    {/* Title */}
    <h2 className="font-semibold text-foreground text-lg leading-tight">
      {formData.title}
    </h2>
    
    {/* Badges */}
    <div className="flex flex-wrap gap-2">
      <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium">
        {formData.subcategory}
      </span>
      <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium">
        {conditionLabel}
      </span>
    </div>
  </div>
</div>
```

---

## Key UX Patterns to Adopt

### ✅ Adopt from TradeSphere

1. **Bottom Sheet Container** - More native mobile feel
2. **3-Column Photo Grid** - Larger thumbnails, easier to tap
3. **Photo Tips Box** - Guides users to better listings
4. **Icon-based Category Cards** - Visual hierarchy
5. **Inline Condition Selection** - Show all options with descriptions
6. **Toggle Card Pattern** - Icon + title + description + toggle
7. **Quick Location Chips** - Reduce typing
8. **Product Preview Card** - Show how listing will look

### ✅ Keep from Treido

1. **React Hook Form** - Superior form state management
2. **Framer Motion Animations** - Premium step transitions
3. **Animated Dot Progress** - Modern progress indicator
4. **i18n Support** - Full localization
5. **Dynamic Attribute Loading** - Category-specific fields
6. **Validation Architecture** - Robust schema validation

---

## Implementation Plan

### Phase 1: Container & Navigation (Priority: High)

**Goal:** Make the sell form feel more app-like with bottom sheet presentation.

**Tasks:**

1. **Create SellSheet Component**
   - [ ] Use `Drawer` from vaul with `h-[95vh]` and `rounded-t-3xl`
   - [ ] Entry point from FAB or nav should open sheet, not navigate
   - [ ] Add close confirmation for unsaved changes

2. **Update Header**
   - [ ] Add step title in center: "Photos", "Category", "Details", "Pricing", "Review"
   - [ ] Add "Step X of Y" subtext below title
   - [ ] Keep animated dots but make them smaller

**Files to modify:**
- `app/[locale]/(sell)/sell/client.tsx`
- `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx`
- `app/[locale]/(sell)/_components/layouts/stepper-wrapper.tsx`

---

### Phase 2: Photo Upload (Priority: High)

**Goal:** Better visual guidance for photo uploads.

**Tasks:**

1. **Update Grid Layout**
   - [ ] Change from 4 columns to 3 columns: `grid-cols-3`
   - [ ] Make add button more prominent with icon + text

2. **Add Photo Tips**
   - [ ] Add tip box below photo grid
   - [ ] Localize for en/bg

3. **Improve Empty State**
   - [ ] Add large camera icon
   - [ ] Add instructional text

**Files to modify:**
- `app/[locale]/(sell)/_components/fields/photos-field.tsx`

---

### Phase 3: Category Selection (Priority: Medium)

**Goal:** More visual, scannable category selection.

**Tasks:**

1. **Add Category Icons**
   - [ ] Map icons to category IDs
   - [ ] Create icon card components

2. **Update CategorySelector**
   - [ ] Full-width cards with icon + label + chevron
   - [ ] Better subcategory selection feedback

**Files to modify:**
- `app/[locale]/(sell)/_components/ui/category-modal/index.tsx`

---

### Phase 4: Condition Selection (Priority: Medium)

**Goal:** Show all conditions inline with descriptions.

**Tasks:**

1. **Replace Drawer with Inline Cards**
   - [ ] Show all condition options on step-details page
   - [ ] Radio-card pattern with description text
   - [ ] Clear selected state with checkmark

**Files to modify:**
- `app/[locale]/(sell)/_components/steps/step-details.tsx`

---

### Phase 5: Pricing Step (Priority: Medium)

**Goal:** Better toggle patterns and location chips.

**Tasks:**

1. **Toggle Card Pattern**
   - [ ] Replace Switch with full card toggle
   - [ ] Add icon + title + description for each toggle

2. **Add Location Chips**
   - [ ] Popular Bulgarian cities as quick-select chips
   - [ ] Can be added to Details or Pricing step

**Files to modify:**
- `app/[locale]/(sell)/_components/steps/step-pricing.tsx`

---

### Phase 6: Review Step (Priority: High)

**Goal:** Show realistic product preview.

**Tasks:**

1. **Create Preview Card**
   - [ ] Full product card mockup
   - [ ] 4:3 image with photo count badge
   - [ ] Large price, title, category/condition badges

2. **Keep Summary Grid**
   - [ ] Existing summary below preview card

**Files to modify:**
- `app/[locale]/(sell)/_components/fields/review-field.tsx`
- `app/[locale]/(sell)/_components/steps/step-review.tsx`

---

## Visual Mockup Reference

### Proposed Header Structure
```
┌───────────────────────────────────────────┐
│  ←  │      Photos       │  ✕             │
│     │   Step 1 of 5     │                │
├───────────────────────────────────────────┤
│ ●━━━━━━━━━━━━━●─────────●─────────●────●  │
└───────────────────────────────────────────┘
```

### Proposed Photo Grid
```
┌─────────────────────────────────────┐
│  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │ + ○ │  │ 📷 1│  │ 📷 2│        │
│  │Add  │  │Cover│  │     │        │
│  └─────┘  └─────┘  └─────┘        │
│                                    │
│  ┌─────────────────────────────┐   │
│  │ 💡 Photo tips               │   │
│  │ • Good lighting             │   │
│  │ • Multiple angles           │   │
│  │ • Show defects              │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Proposed Condition Cards
```
┌─────────────────────────────────────┐
│  ○ New                              │
│    Brand new, unused item           │
├─────────────────────────────────────┤
│  ● Like New                   ✓     │
│    Perfect condition, barely used   │
├─────────────────────────────────────┤
│  ○ Good                             │
│    Minor signs of use               │
└─────────────────────────────────────┘
```

---

## Success Metrics

After implementation, measure:

1. **Time to complete listing** - Target: < 90 seconds
2. **Drop-off rate per step** - Target: < 15% per step  
3. **Photo upload rate** - Target: 3+ photos average
4. **Form completion rate** - Target: > 70%

---

## Technical Considerations

### Dependencies to Add
- None required (existing Drawer/Sheet components sufficient)

### Breaking Changes
- None expected (incremental improvements)

### Testing Required
- [ ] Mobile viewport testing (375px, 390px, 414px)
- [ ] Touch target verification (44px minimum)
- [ ] Animation performance (60fps)
- [ ] E2E smoke tests for sell flow

---

## Screenshot Request

For more accurate visual comparison, screenshots would help for:

1. TradeSphere photo step with images
2. TradeSphere category selection
3. TradeSphere condition selection
4. TradeSphere pricing step with toggles
5. TradeSphere review step preview

Would you like to provide screenshots for more detailed analysis?

---

## Files Reference

### TradeSphere (temp-tradesphere-audit/)
- [SellDrawer.tsx](temp-tradesphere-audit/src/components/sell/SellDrawer.tsx) - Main drawer container
- [PhotoStep.tsx](temp-tradesphere-audit/src/components/sell/steps/PhotoStep.tsx) - Photo upload
- [CategoryStep.tsx](temp-tradesphere-audit/src/components/sell/steps/CategoryStep.tsx) - Category picker
- [DetailsStep.tsx](temp-tradesphere-audit/src/components/sell/steps/DetailsStep.tsx) - Title/description/condition
- [PricingStep.tsx](temp-tradesphere-audit/src/components/sell/steps/PricingStep.tsx) - Price/shipping
- [ReviewStep.tsx](temp-tradesphere-audit/src/components/sell/steps/ReviewStep.tsx) - Preview card

### Treido (current)
- [sell-form-unified.tsx](app/[locale]/(sell)/_components/sell-form-unified.tsx) - Main form
- [mobile-layout.tsx](app/[locale]/(sell)/_components/layouts/mobile-layout.tsx) - Mobile wizard
- [stepper-wrapper.tsx](app/[locale]/(sell)/_components/layouts/stepper-wrapper.tsx) - Step navigation
- [step-what.tsx](app/[locale]/(sell)/_components/steps/step-what.tsx) - Title + photo
- [step-category.tsx](app/[locale]/(sell)/_components/steps/step-category.tsx) - Category selection
- [step-details.tsx](app/[locale]/(sell)/_components/steps/step-details.tsx) - Condition + attributes
- [step-pricing.tsx](app/[locale]/(sell)/_components/steps/step-pricing.tsx) - Price + shipping
- [step-review.tsx](app/[locale]/(sell)/_components/steps/step-review.tsx) - Final review

---

## Live Browser Audit (2026-02-02)

I audited the live TradeSphere demo at `https://trendr-buddy.lovable.app/` using Playwright in mobile viewport (390x844).

### Step-by-Step Flow Observed

#### Step 1: Photos
```
┌────────────────────────────────────────────┐
│  ✕ │       Photos        │    ✕           │
│     │     Step 1 of 5     │                │
├────────────────────────────────────────────┤
│ ════════════════════════(20%)══════════    │
├────────────────────────────────────────────┤
│                                            │
│  Add photos                                │
│  Add up to 10 photos. First = cover.       │
│                                            │
│  ┌─────────┐                               │
│  │   ＋    │                               │
│  │Add Photo│  ← Large, clear affordance    │
│  └─────────┘                               │
│                                            │
│       🖼️                                   │
│  Tap "Add Photo" to upload                 │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │ Photo tips                         │   │
│  │ • Good lighting, clean background  │   │
│  │ • Multiple angles                  │   │
│  │ • Close-ups of defects            │   │
│  └────────────────────────────────────┘   │
│                                            │
│  [        Continue (disabled)         ]    │
└────────────────────────────────────────────┘
```

**Key UX elements:**
- Bottom sheet drawer (95vh height, rounded-t-3xl)
- Step title + "Step X of Y" subtext in header
- Prominent add button with icon + text label
- Photo tips box with bullet list
- Continue disabled until photo added

#### Step 2: Category
```
┌────────────────────────────────────────────┐
│  ← │      Category       │    ✕           │
│     │     Step 2 of 5     │                │
├────────────────────────────────────────────┤
│ ════════════════════════════════(40%)══    │
├────────────────────────────────────────────┤
│                                            │
│  Select a category                         │
│  Choose what best describes your item      │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 🚗 │ Vehicles              │    >    │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ 📱 │ Electronics           │    >    │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ 🏠 │ Property              │    >    │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ 👜 │ Fashion               │    >    │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ 🏃 │ Sports & Outdoor      │    >    │ │
│  └──────────────────────────────────────┘ │
│  ...                                       │
│                                            │
│  [        Continue (disabled)         ]    │
└────────────────────────────────────────────┘
```

**After selecting Electronics → Subcategories:**
```
│  ← Change category                         │
│  Electronics                               │
│  Select a subcategory                      │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Phones                               │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ Computers                            │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ Phones ✓                             │ │  ← Selected with checkmark
│  └──────────────────────────────────────┘ │
```

**Key UX elements:**
- Icon-based category cards (icon + label + chevron)
- Same-page subcategory drill-down
- "← Change category" to go back
- Checkmark on selected subcategory

#### Step 3: Details
```
┌────────────────────────────────────────────┐
│  ← │       Details        │    ✕           │
│     │     Step 3 of 5     │                │
├────────────────────────────────────────────┤
│ ════════════════════════════════════(60%)  │
├────────────────────────────────────────────┤
│                                            │
│  Title *                                   │
│  ┌──────────────────────────────────────┐ │
│  │ e.g., iPhone 15 Pro Max 256GB        │ │
│  └──────────────────────────────────────┘ │
│                                     0/80   │
│                                            │
│  Description                               │
│  ┌──────────────────────────────────────┐ │
│  │ Describe your item in detail...      │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
│                                   0/2000   │
│                                            │
│  Condition *                               │
│  ┌──────────────────────────────────────┐ │
│  │ ○ New                                │ │
│  │   Brand new, unused item             │ │
│  ├──────────────────────────────────────┤ │
│  │ ● Like New ✓                         │ │  ← Selected
│  │   Used once or twice, perfect        │ │
│  ├──────────────────────────────────────┤ │
│  │ ○ Good                               │ │
│  │   Minor signs of use                 │ │
│  ├──────────────────────────────────────┤ │
│  │ ○ Fair                               │ │
│  │   Visible wear, works well           │ │
│  ├──────────────────────────────────────┤ │
│  │ ○ For Parts                          │ │
│  │   May need repairs                   │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [           Continue               ]      │
└────────────────────────────────────────────┘
```

**Key UX elements:**
- Title input with placeholder + char counter
- Description textarea with char counter
- **INLINE condition cards** - all options visible with descriptions
- No drawer/modal needed for condition selection
- Radio-style selection with checkmark feedback

#### Step 4: Pricing
```
┌────────────────────────────────────────────┐
│  ← │       Pricing        │    ✕           │
│     │     Step 4 of 5     │                │
├────────────────────────────────────────────┤
│ ════════════════════════════════════════(80%)
├────────────────────────────────────────────┤
│                                            │
│  Price *                                   │
│  ┌────────┬────────────────────────────┐  │
│  │ € ▼    │            1,150           │  │  ← Inline currency dropdown
│  └────────┴────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 💬 │ Price negotiable        │ ○──   │ │  ← Toggle card
│  │     │ Allow buyers to offer   │      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 📦 │ Shipping available      │ ○──   │ │  ← Toggle card
│  │     │ Ship to buyers          │      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  📍 Location *                             │
│  ┌──────────────────────────────────────┐ │
│  │ Bucharest, RO                        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [Bucharest] [Cluj-Napoca] [Timișoara]    │  ← Quick-select chips!
│  [Iași] [Constanța] [Brașov]              │
│                                            │
│  [           Continue               ]      │
└────────────────────────────────────────────┘
```

**Key UX elements:**
- Inline currency dropdown (€, $, £, RON) - not a separate drawer
- Toggle card pattern: icon + title + description + toggle switch
- Location input with quick-select city chips
- Clicking chip fills the input automatically

#### Step 5: Review
```
┌────────────────────────────────────────────┐
│  ← │        Review        │    ✕           │
│     │     Step 5 of 5     │                │
├────────────────────────────────────────────┤
│ ═════════════════════════════════════(100%)│
├────────────────────────────────────────────┤
│                                            │
│  Review your listing                       │
│  Make sure everything looks good           │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  ┌──────────┐                        │ │
│  │  │   📷     │  €1,150                │ │
│  │  │          │                        │ │
│  │  └──────────┘  iPhone 15 Pro Max     │ │
│  │                                      │ │
│  │  [📱 Phones] [✓ Like New]            │ │
│  │                                      │ │
│  │  📍 Bucharest, RO                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Listing Summary                      │ │
│  │ Category      │ Phones               │ │
│  │ Condition     │ Like New             │ │
│  │ Photos        │ 1 uploaded           │ │
│  │ Price         │ €1,150               │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  By publishing, you agree to our Terms...  │
│                                            │
│  [        Publish Listing           ]      │
└────────────────────────────────────────────┘
```

**Key UX elements:**
- Product preview card showing how listing will appear
- Image + Price + Title prominently displayed
- Category and condition as badges with icons
- Location with icon
- Summary grid with key details
- "Publish Listing" as final CTA

---

## Summary of Key Patterns to Adopt

| Pattern | TradeSphere | Current Treido | Priority |
|---------|-------------|----------------|----------|
| **Container** | Bottom sheet (95vh) | Full page | 🔴 High |
| **Header** | Step title + "Step X of Y" | Dot progress only | 🟡 Medium |
| **Photo tips** | Inline tips box | None | 🔴 High |
| **Category icons** | Icon + label + chevron | Text-only list | 🟡 Medium |
| **Condition selection** | Inline cards with descriptions | Drawer picker | 🔴 High |
| **Toggle pattern** | Card with icon + desc + toggle | Switch only | 🟡 Medium |
| **Location chips** | Quick-select city buttons | None | 🟡 Medium |
| **Review preview** | Full product card mockup | Summary rows | 🔴 High |

---

*Next steps: Prioritize Phase 2 (Photo tips), Phase 4 (Inline conditions), and Phase 6 (Review preview) as highest-impact improvements.*
