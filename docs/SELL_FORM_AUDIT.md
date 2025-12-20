# SELL FORM CODEBASE AUDIT & REFACTOR PLAN

**Last Updated:** December 20, 2025  
**Status:** 🔴 CRITICAL REFACTOR NEEDED  
**URL:** `/sell`  
**Purpose:** Complete audit + actionable refactor plan for the /sell listing form

---

## ⚠️ EXECUTIVE SUMMARY

The sell form has **~8,500+ lines of code** spread across **50+ files** with:
- **4 DIFFERENT IMPLEMENTATIONS** (production /sell, /sell-v2, demo/sellform1, demo/sellform2)
- **3 DUPLICATE SCHEMAS** (lib/sell-form-schema-v4.ts, sell-v2/_lib/schema.ts, components/sell/schemas.ts)
- **MASSIVE DUPLICATION** in step components vs section components
- **DEAD CODE** throughout
- **1,080-LINE MONSTER** in step-category.tsx

---

## 🎯 REFACTOR GOALS

1. **DELETE** all duplicate/demo implementations (sellform1, sellform2, sell-v2)
2. **CONSOLIDATE** to single schema in `lib/sell-form-schema.ts`
3. **EXTRACT** shared utilities (image compression, validation helpers)
4. **SPLIT** oversized components (step-category.tsx)
5. **UNIFY** desktop sections + mobile steps into shared components
6. **FIX** all TypeScript errors and lint warnings

---

## TABLE OF CONTENTS

1. [Current State Analysis](#current-state-analysis)
2. [Files to DELETE](#files-to-delete)
3. [Files to KEEP](#files-to-keep)
4. [Refactor Tasks](#refactor-tasks)
5. [Architecture Overview](#architecture-overview)
6. [File Inventory](#file-inventory)
7. [Route Files](#route-files)
8. [Main Components](#main-components)
9. [Step Components (Mobile Stepper)](#step-components-mobile-stepper)
10. [Section Components (Desktop Form)](#section-components-desktop-form)
11. [UI Components](#ui-components)
12. [Schemas & Types](#schemas--types)
13. [Support Files](#support-files)
14. [Data Flow](#data-flow)
15. [Known Issues & Technical Debt](#known-issues--technical-debt)

---

## 🔥 CURRENT STATE ANALYSIS

### Duplicate Implementations Found:

| Location | Lines | Status | Action |
|----------|-------|--------|--------|
| `app/[locale]/(sell)/sell/` | ~750 | ✅ PRODUCTION | KEEP |
| `app/[locale]/(sell)/sell-v2/` | ~800 | ❌ UNUSED | DELETE |
| `app/[locale]/demo/sellform1/` | ~800 | ❌ DEMO | DELETE |
| `app/[locale]/demo/sellform2/` | ~820 | ❌ DEMO | DELETE |
| `app/[locale]/(main)/demo/sellform/` | ~1400 | ❌ DEMO | DELETE |

### Schema Duplication:

| File | Lines | Status |
|------|-------|--------|
| `lib/sell-form-schema-v4.ts` | 293 | ✅ PRIMARY - KEEP |
| `app/[locale]/(sell)/sell-v2/_lib/schema.ts` | 136 | ❌ DELETE |
| `components/sell/schemas.ts` | 83 | ❌ DELETE (legacy store schema) |
| `components/sell/schemas/*.ts` | ~100 | ❌ DELETE |

### Component Duplication:

| Mobile Step | Desktop Section | Lines Each | Shared Logic |
|-------------|-----------------|------------|--------------|
| `step-photos.tsx` | `photos-section.tsx` | 508 / 655 | ~70% same |
| `step-category.tsx` | `details-section.tsx` | 1080 / 568 | ~50% same |
| `step-pricing.tsx` | `pricing-section.tsx` | 257 / 444 | ~60% same |
| `step-review.tsx` | N/A (desktop has inline) | 354 | N/A |

---

## 🗑️ FILES TO DELETE

### Phase 1: Delete Demo/Unused Routes (Safe)

```powershell
# Demo forms - UNUSED
Remove-Item -Recurse -Force "app/[locale]/demo/sellform1"
Remove-Item -Recurse -Force "app/[locale]/demo/sellform2"
Remove-Item -Recurse -Force "app/[locale]/(main)/demo/sellform"

# sell-v2 - UNUSED alternate implementation
Remove-Item -Recurse -Force "app/[locale]/(sell)/sell-v2"
```

### Phase 2: Delete Duplicate Schemas

```powershell
# After consolidating to lib/sell-form-schema.ts
Remove-Item -Force "components/sell/schemas.ts"
Remove-Item -Recurse -Force "components/sell/schemas"
```

### Phase 3: Delete Dead Components

```powershell
# After verifying not imported
Remove-Item -Force "components/sell/category-stepper.tsx"  # Legacy
Remove-Item -Force "components/sell/create-store-form.tsx"  # Replaced by wizard
Remove-Item -Recurse -Force "components/sell/ai"  # Empty folder
```

---

## ✅ FILES TO KEEP (Core Production)

### Route Files:
- `app/[locale]/(sell)/layout.tsx`
- `app/[locale]/(sell)/sell/page.tsx`
- `app/[locale]/(sell)/sell/client.tsx`
- `app/[locale]/(sell)/sell/loading.tsx`
- `app/[locale]/(sell)/_components/*` (shared components)

### Main Components:
- `components/sell/sell-form.tsx` - Desktop form
- `components/sell/sell-form-stepper.tsx` - Mobile stepper
- `components/sell/sell-header-v3.tsx` - Header
- `components/sell/seller-onboarding-wizard.tsx`
- `components/sell/sign-in-prompt.tsx`

### UI Components:
- `components/sell/ui/category-modal/`
- `components/sell/ui/category-picker/`
- `components/sell/ui/brand-picker.tsx`
- `components/sell/ui/stepper-header.tsx`
- `components/sell/ui/stepper-navigation.tsx`
- `components/sell/ui/sell-section-skeleton.tsx`
- `components/sell/ui/sell-error-boundary.tsx`

### Types & Schema:
- `lib/sell-form-schema-v4.ts` → rename to `lib/sell-form-schema.ts`
- `components/sell/types.ts`

---

## 📋 REFACTOR TASKS

### Task 1: Delete Demo/Unused Code [SAFE - DO FIRST]
```
Effort: 5 min | Risk: LOW
```

Delete all demo and unused implementations.

### Task 2: Consolidate Schema [MEDIUM RISK]
```
Effort: 30 min | Risk: MEDIUM
```

1. Rename `lib/sell-form-schema-v4.ts` → `lib/sell-form-schema.ts`
2. Update all imports
3. Delete duplicate schemas
4. Remove "V4" from type names

### Task 3: Extract Image Utilities [LOW RISK]
```
Effort: 15 min | Risk: LOW
```

Create `lib/image-utils.ts` with shared `compressImage()` function.

### Task 4: Split step-category.tsx [HIGH EFFORT]
```
Effort: 2-3 hours | Risk: HIGH
```

Split 1,080-line file into:
- `category-selector-section.tsx` (~200 lines)
- `condition-selector.tsx` (~100 lines)
- `brand-input.tsx` (~100 lines)
- `item-specifics-section.tsx` (~400 lines)
- `automotive-utils.ts` (~200 lines)

### Task 5: Unify Mobile/Desktop Components [HIGH EFFORT]
```
Effort: 4-6 hours | Risk: HIGH
```

Create shared base components with mobile/desktop variants.

### Task 6: Fix TypeScript & Lint Errors [LOW RISK]
```
Effort: 30 min | Risk: LOW
```

Fix warnings in:
- `stepper-header.tsx` - Tailwind class suggestions
- `ai-listing-assistant.tsx` - break-words class
- `shipping-section.tsx` - unused import

---

## ARCHITECTURE OVERVIEW

The `/sell` page uses a **dual-mode architecture**:

1. **AI Assistant Mode** (default): Uses `AiSellAssistant` chatbot for guided listing creation
2. **Traditional Form Mode**: 
   - **Mobile**: 4-step stepper flow (`SellFormStepper`)
   - **Desktop**: Single-page scrollable form (`SellForm`)

### Component Hierarchy

```
app/[locale]/(sell)/layout.tsx
└── app/[locale]/(sell)/sell/page.tsx (Server Component)
    └── client.tsx (Client Component - Main orchestrator)
        ├── SignInPrompt (if not logged in)
        ├── SellerOnboardingWizard (if needs onboarding)
        ├── AiSellAssistant (AI mode - default)
        └── SellErrorBoundary
            ├── SellFormStepper (mobile)
            │   ├── StepperHeader
            │   ├── StepPhotos (step 1)
            │   ├── StepCategory (step 2)
            │   ├── StepPricing (step 3)
            │   ├── StepReview (step 4)
            │   └── StepperNavigation
            └── SellForm (desktop)
                ├── ProgressHeader
                ├── PhotosSection
                ├── DetailsSection
                ├── PricingSection
                ├── ShippingSection
                └── ChecklistSidebar
```

---

## FILE INVENTORY

### Total Files: 42

| Category | Count | Files |
|----------|-------|-------|
| Route files | 4 | layout.tsx, page.tsx, client.tsx, loading.tsx |
| Main components | 7 | sell-form.tsx, sell-form-stepper.tsx, sell-header-v3.tsx, etc. |
| Steps (mobile) | 5 | step-photos.tsx, step-category.tsx, step-pricing.tsx, step-review.tsx, index.ts |
| Sections (desktop) | 4 | photos-section.tsx, details-section.tsx, pricing-section.tsx, shipping-section.tsx |
| UI components | 12 | stepper-header.tsx, category-modal/, category-picker/, etc. |
| Schemas/Types | 6 | types.ts, schemas.ts, schemas/*.ts, lib/sell-form-schema-v4.ts |
| Support | 4 | seller-onboarding-wizard.tsx, sign-in-prompt.tsx, sell-specifics-policy.ts |

---

## ROUTE FILES

### 1. `app/[locale]/(sell)/layout.tsx`
**Lines:** 39  
**Purpose:** Standalone minimal layout for seller flows (no site header/footer)

```typescript
// Key functionality:
- NextIntlClientProvider for i18n
- setRequestLocale for static rendering
- generateStaticParams for all locales
- Minimal wrapper: min-h-svh bg-background flex flex-col
```

**Dependencies:** next-intl, @/i18n/routing

---

### 2. `app/[locale]/(sell)/sell/page.tsx`
**Lines:** 236  
**Purpose:** Server component - fetches categories, auth, seller data

```typescript
// Key functionality:
- generateStaticParams for locales
- getCategoriesCached with unstable_cache (1hr TTL)
- buildCategoryTree - converts flat categories to nested tree
- getSellerData - checks profiles table for is_seller flag
- Auth redirect to login if not authenticated
- Passes initialUser, initialSeller, categories to client

// Data fetching:
- Categories: 3-level fetch (L0, L1, L2) with batching
- Auth: supabase.auth.getUser()
- Seller: profiles table query
```

**Types:**
```typescript
interface CategoryNode {
  id: string;
  name: string;
  name_bg: string | null;
  slug: string;
  parent_id: string | null;
  display_order: number | null;
  children: CategoryNode[];
}
```

---

### 3. `app/[locale]/(sell)/sell/client.tsx`
**Lines:** 270  
**Purpose:** Main client orchestrator - handles auth state, mode switching, renders appropriate UI

```typescript
// State:
- user, seller (from initial props + auth listener)
- isAuthChecking (loading state)
- needsOnboarding (has username but !is_seller)
- useAiAssistant (toggle between AI/form modes)

// Render conditions:
1. isAuthChecking → SellFormSkeleton
2. !user → SignInPrompt
3. needsOnboarding → SellerOnboardingWizard
4. !seller → "Set Up Username" prompt
5. useAiAssistant → AI mode with header + AiSellAssistant
6. !useAiAssistant:
   - isMobile → SellFormStepper
   - desktop → SellForm
```

**Props:**
```typescript
interface SellPageClientProps {
  initialUser: { id: string; email?: string } | null;
  initialSeller: Seller | null;
  initialNeedsOnboarding?: boolean;
  initialUsername?: string | null;
  categories: Category[];
}
```

---

### 4. `app/[locale]/(sell)/sell/loading.tsx`
**Lines:** 12  
**Purpose:** Instant loading state

```typescript
export default function SellPageLoading() {
  return <SellFormSkeleton />;
}
```

---

## MAIN COMPONENTS

### 5. `components/sell/sell-form-stepper.tsx`
**Lines:** 479  
**Purpose:** Mobile 4-step stepper flow for listing creation

```typescript
// Steps:
const STEPS = [
  { id: 1, title: { en: "Photos & Details", bg: "Снимки" } },
  { id: 2, title: { en: "Category", bg: "Категория" } },
  { id: 3, title: { en: "Pricing", bg: "Цена" } },
  { id: 4, title: { en: "Review", bg: "Преглед" } },
];

// Features:
- Draft auto-save to localStorage (3s debounce)
- Draft restore on mount (24hr expiry)
- Step validity tracking per step
- Success screen after publish
- Share functionality (navigator.share)

// Form:
- useForm with zodResolver(sellFormSchemaV4)
- mode: "onChange" for real-time validation

// Submission:
- POST to /api/products/create
- Clears draft on success
- Shows success screen with view/share/new listing options
```

**Props:**
```typescript
interface SellFormStepperProps {
  locale?: string;
  existingProduct?: SellFormDataV4 & { id: string };
  sellerId: string;
  categories: Category[];
  onClose?: () => void;
}
```

---

### 6. `components/sell/sell-form.tsx`
**Lines:** 630  
**Purpose:** Desktop single-page scrollable form

```typescript
// Layout:
- Sticky ProgressHeader with progress bar
- Main form with 4 sections in sequence
- Sidebar with ChecklistSidebar + Tips

// Features:
- Form progress calculation (calculateFormProgress)
- Auto-save with visual indicator (CloudCheck icon)
- Manual save button
- Category fetch from API if not provided
- Draft restore (same as stepper)

// Sections rendered:
1. PhotosSection
2. DetailsSection (with categories prop)
3. PricingSection
4. ShippingSection

// Submission:
- Same as stepper: POST /api/products/create
- Redirects to /products/{id} on success
```

**Sub-components:**
- `ProgressHeader` - sticky header with progress bar, save status
- `ChecklistSidebar` - progress checklist items
- `MobileFooter` - sticky bottom CTA for mobile

---

### 7. `components/sell/sell-header-v3.tsx`
**Lines:** 221  
**Purpose:** Header for sell pages with user menu

```typescript
// Features:
- Logo + store name
- Save Draft button (desktop)
- Exit/Cancel button with unsaved changes dialog
- User dropdown menu with sign out
- Exit confirmation AlertDialog

// Props:
interface SellHeaderV3Props {
  user?: { email?: string } | null;
  storeName?: string | null;
  storeSlug?: string | null;
  onSaveDraft?: () => void;
  hasUnsavedChanges?: boolean;
  progress?: number;
}
```

---

### 8. `components/sell/seller-onboarding-wizard.tsx`
**Lines:** 483  
**Purpose:** First-time seller onboarding (Personal/Business account setup)

```typescript
// 3 Steps:
1. Account type selection (Personal vs Business)
2. Profile customization (display name, bio)
3. Success confirmation

// Features:
- Framer Motion animations
- i18n translations (en/bg)
- Updates profiles table: account_type, display_name, bio, is_seller=true
- Creates seller_stats entry

// Props:
interface SellerOnboardingWizardProps {
  userId: string;
  username: string;
  displayName?: string | null;
  onComplete: () => void;
}
```

---

### 9. `components/sell/sign-in-prompt.tsx`
**Lines:** 121  
**Purpose:** Landing page for non-authenticated users

```typescript
// Features:
- Hero content with stats
- Feature card with benefits list
- CTA buttons: Start Selling, Create Free Account
- Trust stats: $2M+ paid, 50K+ products, 4.9★ rating
- Testimonial quote
```

---

### 10. `components/sell/index.ts`
**Lines:** 49  
**Purpose:** Barrel export for all sell components

```typescript
// Exports:
- Authentication: SignInPrompt, CreateStoreForm, CreateStoreWizard, SellerOnboardingWizard
- Main Form: SellForm, SellFormStepper, SellHeaderV3
- Sidebar: SellPreview, SellTips
- UI: SmartCategoryPicker, BrandPicker, CategoryPicker
- Sections: PhotosSection, DetailsSection, PricingSection, ShippingSection
- Steps: StepPhotos, StepCategory, StepPricing, StepReview
- Loading/Error: SellSectionSkeleton, SellFormSkeleton, SellErrorBoundary
- Legacy: CategoryStepper, Category type
- Types & Schemas: * from ./types, * from ./schemas
```

---

## STEP COMPONENTS (MOBILE STEPPER)

### 11. `components/sell/steps/step-photos.tsx`
**Lines:** 508  
**Purpose:** Step 1 - Photos upload + Title + Description

```typescript
// Features:
- Client-side image compression (WebP, max 1920px, 85% quality)
- Dropzone with drag-and-drop
- Upload progress tracking with status indicators
- Cover photo selection (first image = cover)
- Remove/reorder photos
- Title input (required, min 3 chars)
- Description textarea (optional)

// Validity: images.length >= 1 && title.length >= 3

// Components:
- PhotoThumbnail: image preview with cover badge, actions
- UploadPreview: during-upload preview with progress
- compressImage: client-side compression utility

// Props:
interface StepPhotosProps {
  form: UseFormReturn<SellFormDataV4>;
  locale?: string;
  onValidityChange?: (isValid: boolean) => void;
}
```

---

### 12. `components/sell/steps/step-category.tsx`
**Lines:** 1080 (LARGEST FILE)  
**Purpose:** Step 2 - Category + Condition + Brand + Item Specifics

```typescript
// Features:
- CategorySelector modal for category selection
- ConditionSelector chips
- Brand input with recent brands (localStorage)
- Category-specific attributes fetched from API
- Automotive domain special handling:
  - Minimum required fields (make, model, year, fuel, etc.)
  - Attribute deduplication/sanitization
- Required/Recommended/Optional specifics tiers
- Custom attributes (add your own)

// Validity:
!!categoryId && !!condition && !isLoadingAttributes && requiredAttributesFilled

// Sub-components:
- SelectAttributePicker: single-select drawer
- MultiSelectAttributePicker: multi-select drawer
- ConditionSelector: chip buttons
- AttributeInput: renders appropriate input by type

// Key functions:
- sanitizeCategoryAttributes: dedupes, removes redundant
- applyAutomotiveMinimums: marks key car fields as required
- splitSpecificsByTier: separates required/recommended/optional

// Props:
interface StepCategoryProps {
  form: UseFormReturn<SellFormDataV4>;
  categories: Category[];
  sellerId?: string;
  locale?: string;
  onValidityChange?: (isValid: boolean) => void;
}
```

---

### 13. `components/sell/steps/step-pricing.tsx`
**Lines:** 257  
**Purpose:** Step 3 - Price + Currency + Quantity + Shipping basics

```typescript
// Features:
- Currency selector chips (BGN/EUR/USD)
- Price input with currency symbol
- Accept offers toggle (Switch)
- Quantity stepper (+/-)
- Shipping price input
- Ships to checkboxes (Bulgaria, Europe, Pickup only)

// Validity: price > 0

// Props:
interface StepPricingProps {
  form: UseFormReturn<SellFormDataV4>;
  locale?: string;
  onValidityChange?: (isValid: boolean) => void;
}
```

---

### 14. `components/sell/steps/step-review.tsx`
**Lines:** 354  
**Purpose:** Step 4 - Final review before publish

```typescript
// Features:
- Validation warnings for missing required fields
- Photo preview strip
- Category & condition summary
- Price & shipping summary
- Edit buttons to jump back to specific steps
- Terms agreement text

// Validity:
hasPhotos && hasTitle && hasCategory && hasCondition && hasPrice

// Sub-components:
- ReviewSection: collapsible section with edit button

// Props:
interface StepReviewProps {
  form: UseFormReturn<SellFormDataV4>;
  locale?: string;
  onValidityChange?: (isValid: boolean) => void;
  onEditStep?: (step: number) => void;
}
```

---

### 15. `components/sell/steps/index.ts`
**Lines:** 5  
**Purpose:** Barrel export for steps

```typescript
export { StepPhotos } from "./step-photos";
export { StepCategory } from "./step-category";
export { StepPricing } from "./step-pricing";
export { StepReview } from "./step-review";
```

---

## SECTION COMPONENTS (DESKTOP FORM)

### 16. `components/sell/sections/photos-section.tsx`
**Lines:** 655  
**Purpose:** Desktop photo upload section (similar to StepPhotos but with drag-to-reorder)

```typescript
// Additional features vs StepPhotos:
- Drag-and-drop reordering
- Full-screen image preview modal
- Larger thumbnails for desktop

// Components:
- ImagePreviewModal: full-screen preview
- PhotoThumbnail: with drag handlers
- UploadPreview: upload progress
```

---

### 17. `components/sell/sections/details-section.tsx`
**Lines:** 568  
**Purpose:** Desktop details section (title, category, brand, description, attributes)

```typescript
// Features:
- RichTextarea with formatting toolbar (Bold, Italic, List)
- CategorySelector integration
- BrandPicker integration
- ItemSpecificsSection for category attributes
- Custom attribute adding

// Components:
- RichTextarea: textarea with char count, formatting buttons
- ItemSpecificsSection: fetches & renders category attributes
```

---

### 18. `components/sell/sections/pricing-section.tsx`
**Lines:** 444  
**Purpose:** Desktop pricing section with price suggestions

```typescript
// Features:
- Format selection (Fixed Price vs Auction)
- Price suggestion API integration
- Visual price position indicator (below/above market)
- Compare-at price (was price)
- Quantity stepper
- Accept offers toggle

// Components:
- PriceSuggestionCard: shows low/median/high prices
- QuantityStepper: +/- buttons with input
```

---

### 19. `components/sell/sections/shipping-section.tsx`
**Lines:** 482  
**Purpose:** Desktop shipping configuration

```typescript
// Regions:
- Bulgaria, UK, Europe, USA, Worldwide, Local Pickup

// Features:
- Region cards with carrier info
- Shipping price input
- Free shipping toggle
- Dimensions input (L×W×H cm, weight kg)
- Processing time selector

// Components:
- ShippingRegionCard: checkbox card with icon, carriers
- DimensionsInput: 4 metric inputs
```

---

## UI COMPONENTS

### 20. `components/sell/ui/stepper-header.tsx`
**Lines:** 89  
**Purpose:** Mobile stepper header with progress

```typescript
// Features:
- Step X of Y indicator
- Current step title
- Progress bar percentage
- Home link, AI assistant button, Close button
```

---

### 21. `components/sell/ui/stepper-navigation.tsx`
**Lines:** 83  
**Purpose:** Mobile stepper footer navigation

```typescript
// Features:
- Back button (hidden on first step)
- Next button (disabled if step invalid)
- Publish button (on last step, with loading state)
```

---

### 22. `components/sell/ui/category-modal/index.tsx`
**Lines:** 638  
**Purpose:** Full-featured category selection modal

```typescript
// Features:
- Flattens categories for search
- Desktop: Dialog with 3-column layout
- Mobile: Drawer with drill-down navigation
- Search with fuzzy matching
- Breadcrumb navigation
- Recently selected categories

// Export:
export function CategorySelector({ categories, value, onChange, locale, className })
```

---

### 23. `components/sell/ui/category-picker/`
**Directory with 4 files:**
- `index.tsx` - main CategoryPicker component
- `category-search.tsx` - search input
- `category-option.tsx` - option row
- `category-breadcrumb.tsx` - breadcrumb display

---

### 24. `components/sell/ui/brand-picker.tsx`
**Purpose:** Brand selection with search/create

---

### 25. `components/sell/ui/smart-category-picker.tsx`
**Purpose:** AI-enhanced category selection (alternative)

---

### 26. `components/sell/ui/sell-section-skeleton.tsx`
**Lines:** 268  
**Purpose:** Loading skeletons for each section type

```typescript
// Variants: photos, details, pricing, shipping, default
// Also exports: SellFormSkeleton (full page skeleton)
```

---

### 27. `components/sell/ui/sell-error-boundary.tsx`
**Lines:** 137  
**Purpose:** Error boundary with draft recovery

```typescript
// Features:
- Checks localStorage for saved draft
- Shows "Draft available" notice
- Retry, Go Home buttons
```

---

## SCHEMAS & TYPES

### 28. `components/sell/types.ts`
**Lines:** 84  
**Purpose:** Single source of truth for sell page types

```typescript
export interface Category {
  id: string;
  name: string;
  name_bg?: string | null;
  slug: string;
  parent_id: string | null;
  display_order?: number | null;
  children?: Category[];
}

export interface Seller {
  id: string;
  store_name: string | null;
  store_slug?: string;
}

export interface CategoryAttribute {
  id: string;
  category_id: string;
  name: string;
  name_bg: string | null;
  attribute_type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date';
  is_required: boolean;
  options: string[];
  options_bg: string[];
  placeholder: string | null;
  placeholder_bg: string | null;
  sort_order: number;
}

export interface CustomAttribute {
  name: string;
  value: string;
}

export interface ProductImage {
  url: string;
  thumbnailUrl?: string;
  position: number;
}

export const TAG_OPTIONS = [
  { value: "new", label: "New", labelBg: "Ново", ... },
  // ... 8 tag options
];
```

---

### 29. `components/sell/schemas.ts`
**Lines:** 83  
**Purpose:** Zod schemas for store and product (legacy?)

```typescript
export const storeSchema = z.object({
  storeName: z.string().min(3).max(50),
  accountType: z.enum(["personal", "business"]),
  description: z.string().max(500).optional(),
  businessName: z.string().max(100).optional(),
  // ... social URLs
});

export const productSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  categoryId: z.string().min(1),
  price: z.string().refine(...),
  // ... etc
});
```

---

### 30. `components/sell/schemas/`
**Directory with 3 files:**
- `index.ts` - barrel export
- `listing.schema.ts` - listing-specific schema
- `store.schema.ts` - store creation schema

---

### 31. `lib/sell-form-schema-v4.ts` (MAIN SCHEMA)
**Lines:** 300  
**Purpose:** Primary form schema with validation + progress calculation

```typescript
// Condition options (6)
export const conditionOptions = [
  { value: "new-with-tags", label: "New with tags", labelBg: "..." },
  // ...
];

// Image schema
export const imageSchema = z.object({
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  isPrimary: z.boolean().optional().default(false),
});

// Attribute schema
export const attributeSchema = z.object({
  attributeId: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  value: z.string().min(1),
  isCustom: z.boolean().default(false),
});

// Main form schema
export const sellFormSchemaV4 = z.object({
  // PHOTOS (Required)
  images: z.array(imageSchema).min(1).max(12),
  
  // BASIC INFO
  title: z.string().min(5).max(80),
  categoryId: z.string().min(1),
  categoryPath: z.array(z.object({...})).optional(),
  brandId: z.string().uuid().nullable().optional(),
  brandName: z.string().optional(),
  condition: z.enum([...]),
  
  // DESCRIPTION
  description: z.string().max(2000).optional().default(""),
  
  // ITEM SPECIFICS
  attributes: z.array(attributeSchema).optional().default([]),
  
  // PRICING
  format: z.enum(["fixed", "auction"]).default("fixed"),
  price: z.string().min(1).refine(...),
  currency: z.enum(["BGN", "EUR", "USD"]).default("BGN"),
  quantity: z.coerce.number().int().min(1).max(9999).default(1),
  acceptOffers: z.boolean().default(false),
  
  // SHIPPING
  shipsToBulgaria: z.boolean().default(true),
  shipsToUK: z.boolean().default(false),
  shipsToEurope: z.boolean().default(false),
  shipsToUSA: z.boolean().default(false),
  shipsToWorldwide: z.boolean().default(false),
  pickupOnly: z.boolean().default(false),
  shippingPrice: z.string().optional(),
  freeShipping: z.boolean().default(false),
  dimensions: dimensionsSchema.optional(),
  processingDays: z.coerce.number().min(1).max(30).default(3),
  
  // TAGS
  tags: z.array(z.string()).max(10).default([]),
});

// Default values
export const defaultSellFormValuesV4: SellFormDataV4 = { ... };

// Progress calculation
export function calculateFormProgress(data): {
  percentage: number;
  items: ProgressItem[];
  nextStep: ProgressItem | null;
}
```

---

### 32. `lib/sell-specifics-policy.ts`
**Lines:** 224  
**Purpose:** Logic for categorizing attributes into required/recommended/optional tiers

```typescript
// Domain detection (automotive, electronics, fashion, generic)
// Attribute scoring for recommendation
// Keyword matching for universal/domain-specific attributes

export function splitSpecificsByTier({
  l0Slug,
  attributes,
  maxRecommended,
}): {
  required: CategorySpecificAttribute[];
  recommended: CategorySpecificAttribute[];
  optional: CategorySpecificAttribute[];
}
```

---

## DATA FLOW

### Form Submission Flow

```
User fills form
    ↓
form.handleSubmit(onSubmit)
    ↓
POST /api/products/create
{
  ...formData,
  sellerId
}
    ↓
API creates product in database
    ↓
Returns { product: { id } }
    ↓
Clear localStorage draft
    ↓
Show success / redirect
```

### Category Flow

```
page.tsx (server)
    ↓
getCategoriesCached()
    ↓
Supabase query: categories table (L0 → L1 → L2)
    ↓
buildCategoryTree()
    ↓
Pass to client as prop
    ↓
CategorySelector modal
    ↓
User selects leaf category
    ↓
form.setValue("categoryId", id)
form.setValue("categoryPath", path)
    ↓
Fetch /api/categories/attributes?categoryId=X
    ↓
Render attribute inputs
```

### Draft Auto-Save Flow

```
form.watch() subscription
    ↓
Debounce 3 seconds
    ↓
localStorage.setItem(`sell-draft-${sellerId}`, {
  data: formData,
  savedAt: ISO timestamp
})
    ↓
On page load:
    ↓
Check localStorage
    ↓
If exists && < 24hrs old:
    ↓
form.reset(savedData)
toast("Draft restored")
```

---

## KNOWN ISSUES & TECHNICAL DEBT

### 1. Schema Duplication
- `components/sell/schemas.ts` vs `lib/sell-form-schema-v4.ts`
- Multiple schema files in `components/sell/schemas/`
- **ACTION:** Consolidate to single source of truth

### 2. `step-category.tsx` is 1080 lines
- Too many responsibilities
- Automotive-specific logic embedded
- **ACTION:** Extract sub-components, create automotive adapter

### 3. Duplicate Image Compression Code
- `step-photos.tsx` and `photos-section.tsx` both have `compressImage()`
- **ACTION:** Extract to `lib/image-utils.ts`

### 4. Inconsistent Validation
- Desktop form has different validation timing than mobile stepper
- Some fields validate onChange, some onBlur
- **ACTION:** Standardize validation strategy

### 5. Draft Key Collision Risk
- Draft key is `sell-draft-${sellerId}`
- If user has multiple tabs/windows, drafts can conflict
- **ACTION:** Add session ID to draft key

### 6. Missing Error Boundaries
- Only top-level SellErrorBoundary
- Individual sections could fail independently
- **ACTION:** Add section-level error boundaries

### 7. Category API N+1 Queries
- Fetches L0, then L1, then L2 in sequence
- **ACTION:** Use recursive CTE in single query

### 8. Hardcoded Strings
- Many UI strings not in translation files
- **ACTION:** Move to messages/en.json and messages/bg.json

### 9. Type Exports
- `Category` type exported from multiple places
- **ACTION:** Single export from `types.ts`

### 10. Legacy Exports
- `CategoryStepper` marked as legacy in index.ts
- **ACTION:** Remove if unused

---

## API ENDPOINTS USED

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products/create` | POST | Create new listing |
| `/api/upload-image` | POST | Upload product image |
| `/api/categories` | GET | Fetch categories (with children) |
| `/api/categories/attributes` | GET | Fetch category-specific attributes |
| `/api/products/price-suggestion` | GET | Get price suggestions for category |

---

## COMPONENT PROP DRILLING

Most components receive these common props:
- `form: UseFormReturn<SellFormDataV4>` - react-hook-form instance
- `locale?: string` - "en" or "bg"
- `categories: Category[]` - nested category tree
- `sellerId: string` - current user's seller ID
- `onValidityChange?: (isValid: boolean) => void` - step validity callback

---

## LOCALIZATION

- Bulgarian (bg) and English (en) supported
- Most labels have `label` and `labelBg` properties
- Some hardcoded strings still need extraction
- Uses `const isBg = locale === "bg"` pattern throughout

---

## END OF AUDIT

**Total Lines of Code:** ~8,500+  
**Primary Dependencies:** react-hook-form, zod, @phosphor-icons/react, framer-motion, next-intl, sonner (toasts)
