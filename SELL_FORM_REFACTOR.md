# 🛒 Sell Form Category Selector - Complete UI/UX Refactor Plan

> **Document Status**: Implementation Blueprint ✅ VERIFIED  
> **Created**: December 9, 2025  
> **Verified**: December 9, 2025 (Context7 MCP + Playwright/Dribbble)  
> **Priority**: HIGH - Critical UX Improvement

### 🔬 Verification Status
| Source | Status | Findings |
|--------|--------|----------|
| **shadcn/ui Docs** | ✅ Verified | Dialog, Drawer, Command patterns confirmed |
| **Tailwind CSS v4** | ✅ Verified | Responsive grid patterns, dialog margin fix documented |
| **Dribbble Research** | ✅ Completed | 30+ category selector designs analyzed |

---

## 📱 Mobile Stepper Pattern (RECOMMENDED)

### Why a Stepper for the Full Sell Form?

On mobile, a **multi-step wizard for the entire listing flow** is the gold standard:

| Platform | Steps | Pattern |
|----------|-------|---------|
| **eBay** | 4 steps | Photos → Category → Details → Price |
| **Facebook Marketplace** | 3 steps | Photos → Details+Category → Price |
| **Vinted** | 4 steps | Photos → Details → Category+Brand → Price |
| **Depop** | 3 steps | Photos → All Details → Price+Shipping |

### Important Distinction ⚠️

| ❌ BAD Pattern | ✅ GOOD Pattern |
|----------------|-----------------|
| 4-step wizard just for **category selection** | Multi-step wizard for the **entire form** |
| Overkill, frustrating | Focused, manageable chunks |
| What we have now | What we should build |

### Proposed Mobile Stepper Flow

```
┌─────────────────────────────────────┐
│  Step 1 of 4                    ✕   │
│  ████░░░░░░░░ 25%                   │
├─────────────────────────────────────┤
│                                     │
│         📸 ADD PHOTOS               │
│                                     │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│   │  +  │ │ img │ │ img │ │ img │  │
│   │     │ │     │ │     │ │     │  │
│   └─────┘ └─────┘ └─────┘ └─────┘  │
│                                     │
│   Title                             │
│   ┌─────────────────────────────┐  │
│   │ iPhone 14 Pro Max 256GB     │  │
│   └─────────────────────────────┘  │
│                                     │
│   Description                       │
│   ┌─────────────────────────────┐  │
│   │ Great condition, includes   │  │
│   │ original box and charger... │  │
│   └─────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│              [Next →]               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ← Step 2 of 4                  ✕   │
│  ████████░░░░ 50%                   │
├─────────────────────────────────────┤
│                                     │
│         📂 CATEGORY                 │
│                                     │
│   Category *                        │
│   ┌─────────────────────────────┐  │
│   │ Electronics > Phones > ...  │▼ │ ← Opens modal
│   └─────────────────────────────┘  │
│                                     │
│   Condition *                       │
│   ○ New  ○ Like New  ● Used        │
│                                     │
│   Brand                             │
│   ┌─────────────────────────────┐  │
│   │ Apple                       │  │
│   └─────────────────────────────┘  │
│                                     │
│   [+ Add Attributes]                │
│                                     │
├─────────────────────────────────────┤
│    [← Back]         [Next →]        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ← Step 3 of 4                  ✕   │
│  ████████████░ 75%                  │
├─────────────────────────────────────┤
│                                     │
│         💰 PRICING                  │
│                                     │
│   Price *                           │
│   ┌─────────────────────────────┐  │
│   │ лв.  │ 899.00              │  │
│   └─────────────────────────────┘  │
│                                     │
│   ☐ Accept offers                   │
│   ☐ Free shipping included          │
│                                     │
│   Quantity                          │
│   ┌─────────────────────────────┐  │
│   │ 1                           │  │
│   └─────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│    [← Back]         [Next →]        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ← Step 4 of 4                  ✕   │
│  ████████████████ 100%              │
├─────────────────────────────────────┤
│                                     │
│         ✅ REVIEW & PUBLISH         │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  [img]  iPhone 14 Pro Max   │  │
│   │         лв. 899.00          │  │
│   │         Electronics > ...   │  │
│   └─────────────────────────────┘  │
│                                     │
│   ☐ I agree to the Terms of Sale   │
│                                     │
├─────────────────────────────────────┤
│    [← Back]    [📤 Publish Listing] │
└─────────────────────────────────────┘
```

### Stepper Component Structure

```
components/sell/
├── sell-form-stepper.tsx        # Main stepper orchestration
├── steps/
│   ├── step-photos.tsx          # Step 1: Images + Title + Description
│   ├── step-category.tsx        # Step 2: Category + Condition + Attributes
│   ├── step-pricing.tsx         # Step 3: Price + Shipping + Quantity
│   └── step-review.tsx          # Step 4: Preview + Publish
├── ui/
│   ├── stepper-header.tsx       # Progress bar + step indicator
│   ├── stepper-navigation.tsx   # Back/Next buttons
│   └── category-modal/          # Category selector modal (opens from step 2)
│       ├── index.tsx
│       ├── category-modal-mobile.tsx
│       └── ...
```

### Stepper State Management

```typescript
interface SellFormState {
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: Set<number>;
  formData: {
    // Step 1
    images: File[];
    title: string;
    description: string;
    // Step 2
    categoryId: string;
    categoryPath: Category[];
    condition: 'new' | 'like_new' | 'used' | 'for_parts';
    brand?: string;
    attributes: Record<string, string>;
    // Step 3
    price: number;
    currency: 'BGN' | 'EUR';
    acceptOffers: boolean;
    freeShipping: boolean;
    quantity: number;
    // Step 4 - just review, no new data
  };
  validation: {
    step1Valid: boolean;
    step2Valid: boolean;
    step3Valid: boolean;
  };
}
```

### Mobile vs Desktop Behavior

| Aspect | Mobile | Desktop |
|--------|--------|---------|
| **Layout** | Full-screen stepper | Single-page form with sections |
| **Navigation** | Next/Back buttons | Scroll + section anchors |
| **Category Selection** | Opens Drawer modal | Opens Dialog modal |
| **Progress** | Progress bar at top | Sidebar progress indicator |
| **Validation** | Per-step validation | Real-time validation |

### Desktop: Keep Single Page with Sections

On desktop, the screen real estate allows showing everything at once:

```
┌─────────────────────────────────────────────────────────────────┐
│  Create Listing                                                 │
├──────────────────┬──────────────────────────────────────────────┤
│                  │                                              │
│  📍 Progress     │  📸 Photos & Details                         │
│  ────────────    │  ─────────────────────────────────────────   │
│  ✓ Photos        │  [+] Add photos (drag & drop)                │
│  ● Category      │                                              │
│  ○ Pricing       │  Title: [________________________]           │
│  ○ Review        │  Description: [___________________]          │
│                  │                                              │
│                  │  📂 Category                                 │
│                  │  ─────────────────────────────────────────   │
│                  │  [Select Category ▼] ← Opens modal           │
│                  │  Condition: ○ New ● Like New ○ Used          │
│                  │                                              │
│                  │  💰 Pricing                                  │
│                  │  ─────────────────────────────────────────   │
│                  │  Price: [лв. ____] ☐ Accept offers           │
│                  │                                              │
│                  │  [📤 Publish Listing]                        │
│                  │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## 📋 Executive Summary

The current category selector in `/sell` form is a UX disaster:
- **50% of UI real estate** wasted on "suggestions," search bars, "latest," and redundant quick pills
- Desktop accordion is embarrassingly narrow and doesn't match the trigger width
- Mobile wizard has too many steps and irrelevant content
- Popover approach on desktop is fundamentally wrong for this use case
- Too many competing elements fighting for attention

### 🎯 Goal
Create a **clean, focused modal-based category selector** with:
1. Clear visual hierarchy
2. Minimal cognitive load
3. Fast navigation with optional search
4. Consistent experience across desktop/mobile
5. Proper responsive behavior

---

## 🔴 Current Problems Analysis

### Desktop Issues
| Problem | Severity | Impact |
|---------|----------|--------|
| Popover width (400px) doesn't match trigger button | HIGH | Disjointed UI |
| Accordion inside popover is awkward | HIGH | Poor navigation |
| "Recent" + "Popular" + search = visual overload | HIGH | Cognitive overload |
| "Select this category" button always visible | MEDIUM | Confusing UX |
| No clear visual distinction between levels | MEDIUM | Lost navigation |
| 350px max height is cramped | MEDIUM | Limited visibility |

### Mobile Issues
| Problem | Severity | Impact |
|---------|----------|--------|
| Step indicator (4 steps) for simple category selection | HIGH | Over-engineering |
| "Recent" and "Popular" pills take too much space | HIGH | Wasted space |
| Search bar always visible at top | MEDIUM | Unnecessary prominence |
| 90vh dialog is too aggressive | MEDIUM | Blocks context |
| "Select this category" CTA placement is confusing | MEDIUM | Decision paralysis |

### Code Issues
| Problem | Severity | Impact |
|---------|----------|--------|
| 700+ lines in single component | HIGH | Unmaintainable |
| Duplicate content for mobile/desktop | HIGH | Code duplication |
| Complex state management | MEDIUM | Bug-prone |
| Hard-coded popular category slugs | LOW | Not scalable |

---

## 🎨 Design Inspiration & Best Practices

### Reference: eBay Category Selector
- **Full-screen modal on mobile**
- **Side-by-side panel navigation on desktop**
- **Search bar at top** (but not dominant)
- **Clear breadcrumb trail**
- **One action at a time**

### Reference: Facebook Marketplace
- **Modal-based selection**
- **Icon-rich category buttons**
- **Simple two-level hierarchy**
- **No distracting "suggestions"**

### Reference: Etsy
- **Clean dropdown with categories as large buttons**
- **Visual category icons**
- **Clear hover states**

### UX Best Practices
1. **Progressive Disclosure**: Show only what's needed
2. **Clear Visual Hierarchy**: Primary categories > Subcategories
3. **Minimal Clicks**: 2-3 max to select
4. **Search as Enhancement**: Optional, not primary
5. **Persistent Context**: User always knows where they are
6. **Mobile-First Design**: Touch targets, swipe gestures

---

## ✅ Verified Best Practices (Context7 + Dribbble Research)

### shadcn/ui Component Patterns (Verified Dec 2024)

#### Dialog (Desktop)
```tsx
// Use DialogContent with proper styling
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Select Category</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-3xl max-h-[80vh] p-0 gap-0">
    <DialogHeader className="px-6 py-4 border-b">
      <DialogTitle>Select Category</DialogTitle>
    </DialogHeader>
    {/* Two-panel layout */}
  </DialogContent>
</Dialog>
```

#### Drawer (Mobile)
```tsx
// Use Drawer from vaul (shadcn's drawer)
<Drawer>
  <DrawerTrigger asChild>
    <Button>Select Category</Button>
  </DrawerTrigger>
  <DrawerContent className="max-h-[85vh]">
    <DrawerHeader>
      <DrawerTitle>Select Category</DrawerTitle>
    </DrawerHeader>
    {/* Content */}
  </DrawerContent>
</Drawer>
```

### Tailwind v4 Patterns (Verified Dec 2024)

#### Responsive Grid for Categories
```tsx
// Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
  {categories.map((cat) => (
    <CategoryItem key={cat.id} {...cat} />
  ))}
</div>
```

#### Dialog Margin Fix (Tailwind v4 Specific)
```css
/* In globals.css - fixes dialog centering in Tailwind v4 */
@layer base {
  dialog {
    margin: auto;
  }
}
```

#### Container Queries for Responsive Panels
```css
@container (min-width: 640px) {
  .category-panel {
    display: grid;
    grid-template-columns: 250px 1fr;
  }
}
```

### Dribbble UI/UX Research Findings

#### "SalesSync - Add Product" Pattern
- **Two-panel modal**: Category tree on left, details on right
- **Clean form with category dropdown**: Not popover, full modal
- **Card-based category selection**: Large touch targets with icons
- **Minimal clutter**: No "recent", "popular" unless highly relevant

#### "UpLabs Category Selector" Pattern (14 likes, 6.2k views)
- **Material design modal**: Full-screen with search bar
- **Category icons prominent**: Icon + text for each category
- **Hierarchical navigation**: Breadcrumbs show path
- **Clean white background**: Categories as distinct clickable cards

#### "Clean Category Selection UI" Pattern
- **Tag/pill based selection**: For multi-select scenarios
- **Minimalist design**: Focus on the selection task
- **Clear visual states**: Selected, hover, default
- **Grid layout**: 3-4 columns for quick scanning

#### "Category Carousel - Modal Popover" Pattern
- **Horizontal scroll for subcategories**: Like a carousel
- **Icon + text buttons**: Clear visual hierarchy
- **Modal overlay**: Dims background to focus attention
- **Single selection highlight**: Active category clearly marked

#### "New Category Icons & Modal" (Kontist - 128 likes, 30.2k views)
- **Beautiful category icons**: Monochrome, consistent style
- **Modal with close button**: Standard dialog pattern
- **Search field at top**: For large category lists
- **Scrollable content area**: Fixed header, scrollable body

### Key Implementation Takeaways

1. **Modal over Popover**: All high-quality designs use full modals, not popovers
2. **Two-Panel Layout (Desktop)**: Category tree + content area is the gold standard
3. **Grid of Cards (Mobile)**: 2-column grid with icons is most common
4. **Search is Secondary**: Always available but never dominant
5. **Breadcrumbs for Context**: Show "All > Electronics > Phones" path
6. **Icon + Text**: Every category should have an icon
7. **Remove Clutter**: No "Recent", "Popular" unless data-driven and useful
8. **Consistent Visual States**: Selected (primary color), Hover (muted), Default (border)

---

## 🏗️ New Architecture

### Component Structure
```
components/sell/ui/category-modal/
├── index.tsx                    # Main export + orchestration
├── category-modal.tsx           # Modal wrapper (responsive)
├── category-trigger.tsx         # Trigger button component
├── category-grid.tsx            # Desktop: Grid of categories
├── category-list-mobile.tsx     # Mobile: Vertical scrollable list
├── category-search.tsx          # Search input (shared)
├── category-breadcrumb.tsx      # Navigation breadcrumb
├── category-item.tsx            # Single category item (with icon)
└── hooks/
    ├── use-category-navigation.ts
    └── use-category-search.ts
```

### State Management
```typescript
interface CategoryModalState {
  isOpen: boolean;
  navigationPath: Category[];      // Breadcrumb trail
  searchQuery: string;
  searchResults: Category[];
  selectedCategory: Category | null;
}
```

---

## 📱 Phase 1: Mobile Implementation (Priority)

### 1.1 New Mobile Modal Design

```
┌─────────────────────────────────────┐
│ ✕  Select Category                  │ ← Clean header
├─────────────────────────────────────┤
│ 🔍 Search categories... (optional)  │ ← Collapsed by default
├─────────────────────────────────────┤
│ ← Back to: All Categories           │ ← Only when navigated
├─────────────────────────────────────┤
│                                     │
│  ┌───────────┐  ┌───────────┐      │
│  │   👕      │  │   👗      │      │
│  │ Clothing  │  │ Women's   │      │
│  └───────────┘  └───────────┘      │
│                                     │
│  ┌───────────┐  ┌───────────┐      │
│  │   📱      │  │   🎮      │      │
│  │ Electronics│ │ Gaming    │      │
│  └───────────┘  └───────────┘      │
│                                     │
│  ┌───────────┐  ┌───────────┐      │
│  │   🏠      │  │   ⚽      │      │
│  │ Home      │  │ Sports    │      │
│  └───────────┘  └───────────┘      │
│                                     │
│  ... (scrollable grid)              │
│                                     │
└─────────────────────────────────────┘
```

### 1.2 Mobile Implementation Checklist

#### Drawer/Sheet Component (using shadcn Drawer)
- [ ] Full-screen drawer from bottom (not 90vh - let content determine height)
- [ ] Use `vaul` drawer with proper iOS-style behavior
- [ ] Drag handle for dismissal
- [ ] Haptic feedback on selection (via navigator.vibrate)

#### Header
- [ ] Simple title: "Select Category" / "Избери категория"
- [ ] Close button (X) top-right
- [ ] NO step indicators - remove wizard pattern

#### Search (Optional Enhancement)
- [ ] Collapsed by default - just a small search icon
- [ ] Expands on tap
- [ ] Clear button when active
- [ ] Debounced search (300ms)
- [ ] Results appear inline, replacing grid

#### Category Grid (2 columns)
- [ ] Large touch targets (min 88px height)
- [ ] Category icon + name
- [ ] Chevron indicator for subcategories
- [ ] Checkmark for leaf categories
- [ ] Subtle animation on tap

#### Navigation
- [ ] Breadcrumb: "All > Electronics > Phones"
- [ ] Back button (only when not at root)
- [ ] Animate transitions between levels
- [ ] Auto-scroll to top on level change

#### Selection
- [ ] Tap leaf category = select + close modal
- [ ] Tap parent category = drill down
- [ ] Visual feedback (scale + background)
- [ ] Toast/feedback after selection

### 1.3 Mobile Code Changes

```tsx
// components/sell/ui/category-modal/category-modal-mobile.tsx
"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CategoryGrid } from "./category-grid";
import { CategoryBreadcrumb } from "./category-breadcrumb";
import { useCategoryNavigation } from "./hooks/use-category-navigation";

interface CategoryModalMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  value: string;
  onChange: (categoryId: string, path: Category[]) => void;
  locale?: string;
}

export function CategoryModalMobile({
  open,
  onOpenChange,
  categories,
  value,
  onChange,
  locale = "en",
}: CategoryModalMobileProps) {
  const {
    navigationPath,
    currentCategories,
    navigate,
    goBack,
    goToRoot,
    handleSelect,
  } = useCategoryNavigation({ categories, value, onChange, onClose: () => onOpenChange(false) });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-lg font-semibold">
            {locale === "bg" ? "Избери категория" : "Select Category"}
          </DrawerTitle>
        </DrawerHeader>
        
        {/* Breadcrumb - only show when navigated */}
        {navigationPath.length > 0 && (
          <CategoryBreadcrumb
            path={navigationPath}
            onNavigate={goToRoot}
            onBack={goBack}
            locale={locale}
          />
        )}
        
        {/* Category Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <CategoryGrid
            categories={currentCategories}
            selectedId={value}
            onSelect={navigate}
            onSelectLeaf={handleSelect}
            locale={locale}
            columns={2}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
```

---

## 🖥️ Phase 2: Desktop Implementation

### 2.1 New Desktop Modal Design

**Option A: Full Modal with Side Panel Navigation (Recommended)**

```
┌──────────────────────────────────────────────────────────────────┐
│                        Select Category                        ✕  │
├────────────────────────┬─────────────────────────────────────────┤
│                        │                                         │
│  ALL CATEGORIES        │  🔍 Search categories...                │
│  ──────────────────    │  ─────────────────────────────────────  │
│                        │                                         │
│  > Clothing & Fashion  │  ┌─────────────┐ ┌─────────────┐       │
│    Electronics         │  │ Men's       │ │ Women's     │       │
│    Home & Garden       │  │ Clothing    │ │ Clothing    │       │
│    Sports & Outdoors   │  │     →       │ │     →       │       │
│    Toys & Games        │  └─────────────┘ └─────────────┘       │
│    Vehicles            │                                         │
│    ...                 │  ┌─────────────┐ ┌─────────────┐       │
│                        │  │ Shoes       │ │ Accessories │       │
│                        │  │     →       │ │     →       │       │
│                        │  └─────────────┘ └─────────────┘       │
│                        │                                         │
│                        │  ┌─────────────┐ ┌─────────────┐       │
│                        │  │ Jewelry     │ │ Bags        │       │
│                        │  │     ✓       │ │     ✓       │       │
│                        │  └─────────────┘ └─────────────┘       │
│                        │                                         │
└────────────────────────┴─────────────────────────────────────────┘
```

**Option B: Three-Column Cascading Menu**

```
┌────────────────────────────────────────────────────────────────────────┐
│  Select Category                                             🔍    ✕  │
├──────────────────┬──────────────────┬──────────────────┬───────────────┤
│  Category        │  Subcategory     │  Type            │               │
├──────────────────┼──────────────────┼──────────────────┤               │
│  > Clothing      │  > Men's         │  ○ T-Shirts      │   Selected:   │
│    Electronics   │    Women's       │  ○ Shirts        │   Clothing    │
│    Home          │    Kids          │  ● Jackets       │   > Men's     │
│    Sports        │    Unisex        │  ○ Pants         │   > Jackets   │
│    Toys          │                  │  ○ Suits         │               │
│    ...           │                  │  ...             │   [Confirm]   │
│                  │                  │                  │               │
└──────────────────┴──────────────────┴──────────────────┴───────────────┘
```

### 2.2 Desktop Implementation Checklist

#### Dialog Component (using shadcn Dialog)
- [ ] Centered modal (max-width: 800px, max-height: 600px)
- [ ] Proper backdrop dimming
- [ ] Escape key to close
- [ ] Click outside to close (with unsaved warning if navigated)

#### Layout (Two-Panel)
- [ ] Left panel: Category tree (250px width)
- [ ] Right panel: Subcategories grid (flex-1)
- [ ] Optional: Third panel for deep hierarchies

#### Search
- [ ] Prominent search input at top of right panel
- [ ] Keyboard shortcut (Cmd/Ctrl + K) when modal open
- [ ] Search across ALL categories (flattened)
- [ ] Highlight matching text
- [ ] Show full path in results

#### Navigation
- [ ] Left panel shows all L1 categories
- [ ] Clicking L1 shows L2+ in right panel
- [ ] Visual indicator for current selection
- [ ] Keyboard navigation (arrow keys)

#### Selection
- [ ] Click leaf category = select + close
- [ ] "Confirm" button for explicit selection
- [ ] Double-click shortcut

### 2.3 Desktop Code Changes

```tsx
// components/sell/ui/category-modal/category-modal-desktop.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { CategoryList } from "./category-list";
import { CategoryGrid } from "./category-grid";
import { useCategoryNavigation } from "./hooks/use-category-navigation";
import { useCategorySearch } from "./hooks/use-category-search";

interface CategoryModalDesktopProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  value: string;
  onChange: (categoryId: string, path: Category[]) => void;
  locale?: string;
}

export function CategoryModalDesktop({
  open,
  onOpenChange,
  categories,
  value,
  onChange,
  locale = "en",
}: CategoryModalDesktopProps) {
  const {
    navigationPath,
    activeL1,
    currentCategories,
    setActiveL1,
    handleSelect,
  } = useCategoryNavigation({ categories, value, onChange, onClose: () => onOpenChange(false) });

  const { searchQuery, setSearchQuery, searchResults, isSearching } = 
    useCategorySearch(categories, locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {locale === "bg" ? "Избери категория" : "Select Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[500px]">
          {/* Left Panel - L1 Categories */}
          <div className="w-60 border-r bg-muted/30">
            <ScrollArea className="h-full">
              <CategoryList
                categories={categories}
                activeId={activeL1?.id}
                onSelect={setActiveL1}
                locale={locale}
              />
            </ScrollArea>
          </div>

          {/* Right Panel - Subcategories */}
          <div className="flex-1 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === "bg" ? "Търси категории..." : "Search categories..."}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-4">
              {isSearching ? (
                <SearchResults
                  results={searchResults}
                  query={searchQuery}
                  onSelect={handleSelect}
                  locale={locale}
                />
              ) : (
                <CategoryGrid
                  categories={currentCategories}
                  selectedId={value}
                  onSelect={(cat) => cat.children?.length ? setActiveL1(cat) : handleSelect(cat)}
                  locale={locale}
                  columns={3}
                />
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎨 Phase 3: Shared Components & Styling

### 3.1 Category Item Component

```tsx
// components/sell/ui/category-modal/category-item.tsx
"use client";

import { CaretRight, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/category-icons";

interface CategoryItemProps {
  category: Category;
  isSelected?: boolean;
  hasChildren?: boolean;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  onClick: () => void;
  locale?: string;
}

export function CategoryItem({
  category,
  isSelected,
  hasChildren,
  size = "md",
  showIcon = true,
  onClick,
  locale = "en",
}: CategoryItemProps) {
  const name = locale === "bg" && category.name_bg ? category.name_bg : category.name;
  const Icon = showIcon ? getCategoryIcon(category.slug) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 w-full rounded-xl border-2 transition-all",
        "hover:border-primary/50 hover:bg-muted/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "active:scale-[0.98]",
        isSelected && "border-primary bg-primary/5",
        !isSelected && "border-border",
        {
          "p-3 min-h-[72px]": size === "sm",
          "p-4 min-h-[88px]": size === "md",
          "p-5 min-h-[100px]": size === "lg",
        }
      )}
    >
      {/* Icon */}
      {Icon && (
        <div className={cn(
          "flex-shrink-0 rounded-lg bg-muted flex items-center justify-center",
          {
            "w-10 h-10": size === "sm",
            "w-12 h-12": size === "md",
            "w-14 h-14": size === "lg",
          }
        )}>
          <Icon className={cn(
            "text-muted-foreground",
            {
              "w-5 h-5": size === "sm",
              "w-6 h-6": size === "md",
              "w-7 h-7": size === "lg",
            }
          )} />
        </div>
      )}

      {/* Name */}
      <span className={cn(
        "flex-1 text-left font-medium truncate",
        {
          "text-sm": size === "sm",
          "text-base": size === "md",
          "text-lg": size === "lg",
        }
      )}>
        {name}
      </span>

      {/* Indicator */}
      {hasChildren ? (
        <CaretRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      ) : isSelected ? (
        <Check className="w-5 h-5 text-primary flex-shrink-0" weight="bold" />
      ) : null}
    </button>
  );
}
```

### 3.2 Breadcrumb Navigation

```tsx
// components/sell/ui/category-modal/category-breadcrumb.tsx
"use client";

import { CaretLeft, House } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryBreadcrumbProps {
  path: Category[];
  onNavigate: (index: number) => void;
  onBack: () => void;
  locale?: string;
}

export function CategoryBreadcrumb({
  path,
  onNavigate,
  onBack,
  locale = "en",
}: CategoryBreadcrumbProps) {
  const getName = (cat: Category) =>
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name;

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="h-8 w-8"
      >
        <CaretLeft className="h-4 w-4" />
      </Button>

      <button
        type="button"
        onClick={() => onNavigate(-1)}
        className="text-sm text-primary hover:underline flex items-center gap-1"
      >
        <House className="h-3.5 w-3.5" />
        {locale === "bg" ? "Всички" : "All"}
      </button>

      {path.map((cat, idx) => (
        <div key={cat.id} className="flex items-center gap-2">
          <span className="text-muted-foreground">/</span>
          <button
            type="button"
            onClick={() => onNavigate(idx)}
            className={cn(
              "text-sm truncate max-w-[120px]",
              idx === path.length - 1
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {getName(cat)}
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 3.3 Custom Hook for Navigation

```tsx
// components/sell/ui/category-modal/hooks/use-category-navigation.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import type { Category } from "@/components/sell/types";

interface UseCategoryNavigationProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string, path: Category[]) => void;
  onClose: () => void;
}

export function useCategoryNavigation({
  categories,
  value,
  onChange,
  onClose,
}: UseCategoryNavigationProps) {
  const [navigationPath, setNavigationPath] = useState<Category[]>([]);
  const [activeL1, setActiveL1] = useState<Category | null>(
    categories[0] || null
  );

  // Current categories to display based on navigation
  const currentCategories = useMemo(() => {
    if (navigationPath.length === 0) {
      return activeL1?.children || categories;
    }
    const last = navigationPath[navigationPath.length - 1];
    return last.children || [];
  }, [categories, navigationPath, activeL1]);

  // Navigate into a category
  const navigate = useCallback((category: Category) => {
    if (category.children?.length) {
      setNavigationPath((prev) => [...prev, category]);
    } else {
      // Leaf category - select it
      const fullPath = [...navigationPath, category];
      onChange(category.id, fullPath);
      onClose();
    }
  }, [navigationPath, onChange, onClose]);

  // Go back one level
  const goBack = useCallback(() => {
    setNavigationPath((prev) => prev.slice(0, -1));
  }, []);

  // Go to root
  const goToRoot = useCallback(() => {
    setNavigationPath([]);
  }, []);

  // Navigate to specific index in path
  const goToIndex = useCallback((index: number) => {
    if (index < 0) {
      setNavigationPath([]);
    } else {
      setNavigationPath((prev) => prev.slice(0, index + 1));
    }
  }, []);

  // Handle final selection
  const handleSelect = useCallback((category: Category) => {
    const fullPath = [...navigationPath, category];
    onChange(category.id, fullPath);
    onClose();
  }, [navigationPath, onChange, onClose]);

  return {
    navigationPath,
    activeL1,
    currentCategories,
    setActiveL1,
    navigate,
    goBack,
    goToRoot,
    goToIndex,
    handleSelect,
  };
}
```

---

## 🔧 Phase 4: Integration & Migration

### 4.1 Update Trigger Component

```tsx
// components/sell/ui/category-modal/category-trigger.tsx
"use client";

import { useState } from "react";
import { CaretRight, Check, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { CategoryModalMobile } from "./category-modal-mobile";
import { CategoryModalDesktop } from "./category-modal-desktop";
import type { Category } from "@/components/sell/types";

interface CategorySelectorProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string, path: Category[]) => void;
  locale?: string;
  className?: string;
}

export function CategorySelector({
  categories,
  value,
  onChange,
  locale = "en",
  className,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  // Find selected category for display
  const selectedCategory = useMemo(() => {
    if (!value) return null;
    // Flatten and find
    const flatten = (cats: Category[], path: Category[] = []): { cat: Category; path: Category[] } | null => {
      for (const cat of cats) {
        const currentPath = [...path, cat];
        if (cat.id === value) return { cat, path: currentPath };
        if (cat.children) {
          const found = flatten(cat.children, currentPath);
          if (found) return found;
        }
      }
      return null;
    };
    return flatten(categories);
  }, [categories, value]);

  const getName = (cat: Category) =>
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", []);
  };

  const Modal = isMobile ? CategoryModalMobile : CategoryModalDesktop;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left",
          "bg-background border border-border rounded-xl",
          "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "transition-colors cursor-pointer min-h-[52px]",
          className
        )}
      >
        {selectedCategory ? (
          <>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">
                {getName(selectedCategory.cat)}
              </div>
              {selectedCategory.path.length > 1 && (
                <div className="text-xs text-muted-foreground truncate mt-0.5">
                  {selectedCategory.path.slice(0, -1).map((c) => getName(c)).join(" › ")}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Check className="size-4 text-green-600" weight="bold" />
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleClear(e as any);
                }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="size-4 text-muted-foreground" />
              </span>
            </div>
          </>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">
              {locale === "bg" ? "Избери категория..." : "Select a category..."}
            </span>
            <CaretRight className="size-4 text-muted-foreground" />
          </>
        )}
      </button>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        categories={categories}
        value={value}
        onChange={onChange}
        locale={locale}
      />
    </>
  );
}
```

### 4.2 Migration from Old Component

```tsx
// OLD (in details-section.tsx):
import { SmartCategoryPicker } from "@/components/sell/ui/smart-category-picker";
<SmartCategoryPicker
  categories={categories}
  value={categoryId}
  onChange={handleCategoryChange}
  locale={locale}
/>

// NEW:
import { CategorySelector } from "@/components/sell/ui/category-modal";
<CategorySelector
  categories={categories}
  value={categoryId}
  onChange={handleCategoryChange}
  locale={locale}
/>
```

---

## 📊 Phase 5: Testing & QA

### 5.1 Test Cases

#### Functional Tests
- [ ] Select L1 category (leaf)
- [ ] Select L2 category (with L1 parent)
- [ ] Select L3 category (deep hierarchy)
- [ ] Search and select from results
- [ ] Clear selection
- [ ] Navigate back through breadcrumb
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader compatibility

#### Visual Tests
- [ ] Mobile: portrait and landscape
- [ ] Desktop: various viewport sizes
- [ ] Dark mode compatibility
- [ ] RTL language support (future)
- [ ] Category icons display correctly

#### Performance Tests
- [ ] Initial load time < 100ms
- [ ] Search response < 200ms
- [ ] Animation smoothness (60fps)
- [ ] No layout shifts

### 5.2 Accessibility Checklist
- [ ] Focus management when modal opens/closes
- [ ] ARIA labels on interactive elements
- [ ] Role="dialog" with proper labeling
- [ ] Keyboard trap within modal
- [ ] Visible focus indicators
- [ ] Screen reader announcements

---

## 📅 Implementation Timeline

| Phase | Task | Est. Hours | Priority |
|-------|------|------------|----------|
| **1** | Mobile Drawer Implementation | 4h | HIGH |
| **1** | Category Grid Component | 2h | HIGH |
| **1** | Breadcrumb Component | 1h | HIGH |
| **2** | Desktop Modal Implementation | 4h | HIGH |
| **2** | Two-Panel Layout | 2h | HIGH |
| **2** | Search Integration | 2h | MEDIUM |
| **3** | Category Item Component | 1h | MEDIUM |
| **3** | Navigation Hook | 1h | MEDIUM |
| **4** | Integration & Migration | 2h | HIGH |
| **4** | Remove Old Component | 0.5h | LOW |
| **5** | Testing & QA | 3h | HIGH |
| | **TOTAL** | **~22h** | |

---

## 🗑️ Files to Delete After Migration

```
components/sell/ui/smart-category-picker.tsx (700 lines of chaos)
components/sell/ui/category-picker/index.tsx
components/sell/ui/category-picker/category-search.tsx
components/sell/ui/category-picker/category-breadcrumb.tsx
components/sell/ui/category-picker/category-option.tsx
```

---

## 🎯 Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Lines of Code | 700+ | <400 |
| Time to Select Category | ~8 clicks | 2-3 clicks |
| Component Complexity | High | Low |
| Mobile UX Score | Poor | Excellent |
| Desktop UX Score | Below Average | Excellent |
| Accessibility Score | Unknown | WCAG 2.1 AA |

---

## 📝 Notes & Considerations

1. **Keep Recent Categories** - But make them subtle, not a major UI element
2. **Remove Popular Categories** - Hard-coded suggestions are not scalable
3. **Category Icons** - Leverage existing `lib/category-icons.tsx`
4. **Animations** - Use `framer-motion` for smooth transitions
5. **Localization** - Support both EN and BG from day one
6. **Future**: Consider AI-suggested categories based on title/description

---

**End of Document**
