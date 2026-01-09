# Treido UI/UX Refactor Plan — Amazong Marketplace

> **Reference Repo:** `inspiration/treido-mock` (latest clone)
> **Generated:** January 9, 2026
> **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (OKLCH), shadcn/ui

---

## Executive Summary

This document outlines a comprehensive UI/UX refactoring plan to align **Amazong** with the **"Invisible Utility"** design philosophy from Treido-mock. The goal is to create a mobile-first marketplace interface that feels **native**, **utilitarian**, and **instant**.

**Key Differences Identified:**
| Aspect | Current (Amazong) | Target (Treido) |
|--------|------------------|-----------------|
| Radius | Mixed (xs→2xl) | Tight (`rounded-md` = 6px max) |
| Shadows | Minimal but present | **NONE** (borders only) |
| Headers | Variable height | Fixed **48px rhythm** |
| Touch Feedback | `scale` transforms (disabled via CSS hack) | `active:opacity-70` (native feel) |
| Category Nav | Multi-layer tabs + circles | **Double Decker** focus mode |
| Spacing | `gap-3/4` typical | Dense `gap-2` (8px) default |
| Typography | 10-14px body | `text-[13px]` body, `text-[10px]` labels |
| Filter UI | Drawer/sheet | Full-screen sheet from bottom (`rounded-t-xl`) |

---

## Phase 0: Design Tokens Alignment

### 0.1 Update `app/globals.css` — Theme Tokens

**Files to modify:** `app/globals.css`

Treido uses a **Zinc-based OKLCH palette** with extremely tight radius. We need to update our `@theme` block:

```css
@theme {
  /* === TREIDO RADIUS (Technical/Tight) === */
  --radius-lg: 0.375rem;           /* 6px - The "Technical" Sweet Spot */
  --radius-md: 0.25rem;            /* 4px - Inner elements */
  --radius-sm: 0.125rem;           /* 2px - Micro badges */
  
  /* === TREIDO RHYTHM TOKENS === */
  --h-header: 3rem;                /* 48px - Strict header height */
  --h-bottom-nav: 3rem;            /* 48px - Fixed bottom nav */
  --h-button: 2.5rem;              /* 40px - Standard button height */
  --h-button-lg: 2.75rem;          /* 44px - Touch button height */
  --h-button-cta: 3rem;            /* 48px - Primary CTA height */
  
  /* === TREIDO SHADOWS (Flat - borders only) === */
  --shadow-none: none;
  --shadow-sm: none;
  --shadow-md: none;
  --shadow-lg: none;
  --shadow-xl: none;
  --shadow-2xl: none;
  --shadow-product: none;
  --shadow-product-hover: none;
  --shadow-dropdown: 0 2px 4px 0 hsl(0 0% 0% / 0.08);
  --shadow-modal: 0 4px 8px 0 hsl(0 0% 0% / 0.10);
}
```

**Key Changes:**
1. Replace all `--radius-*` with Treido's 6px/4px/2px scale
2. Add explicit rhythm tokens for 48px headers/navs
3. Zero out all shadow tokens except modal/dropdown

---

### 0.2 Add Treido Utilities

**Add to `@layer utilities` in `globals.css`:**

```css
@layer utilities {
  /* Treido: Native tap highlight removal */
  .tap-highlight-transparent {
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Treido: No scrollbar for horizontal strips */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Treido: Touch target minimum */
  .min-touch {
    min-height: 40px;
    min-width: 40px;
  }
}
```

---

## Phase 1: Shadcn Component Overrides

### 1.1 Button (`components/ui/button.tsx`)

**Current issues:**
- Uses ring-offset focus states (webby)
- Height varies (`h-9/10/11/12`)
- Focus ring too prominent

**Treido spec:**
- Remove `ring-offset`
- Use `active:opacity-90` (native iOS feel)
- Consistent height: `h-10` (40px) default, `h-11` (44px) for touch
- `rounded-md` only (6px)

```tsx
// Target button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:opacity-90 tap-highlight-transparent",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 border border-zinc-900",
        outline: "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900",
        secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        ghost: "hover:bg-zinc-100 text-zinc-900",
        link: "text-zinc-900 underline-offset-4 hover:underline",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-6",
        xl: "h-12 px-8 text-[15px] font-bold", // Primary CTA
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

---

### 1.2 Input (`components/ui/input.tsx`)

**Treido spec:**
- Background: `bg-zinc-50` (distinct from white surface)
- Height: `h-11` or `h-12` (44-48px touch targets)
- Font: `text-[16px]` (prevents iOS zoom)
- Border: `border-zinc-200` → focus `border-zinc-900`
- Radius: `rounded-md` (6px)
- Remove focus ring, use border color change

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-[16px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors tap-highlight-transparent",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

---

### 1.3 Card (`components/ui/card.tsx`)

**Treido spec:**
- `shadow-none` (NEVER shadows)
- `border border-zinc-200`
- `rounded-md` (6px)
- Remove default padding (apply via utility classes)

```tsx
const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border border-zinc-200 bg-white text-zinc-900 shadow-none",
      className
    )}
    {...props}
  />
))
```

---

### 1.4 Sheet/Drawer (`components/ui/sheet.tsx`)

**Treido spec:**
- Mobile: Slide from bottom with `rounded-t-xl`
- Overlay: `bg-black/40 backdrop-blur-sm`
- Use `vaul` library for drawer behavior (optional)

---

## Phase 2: Layout & Navigation Patterns

### 2.1 The "48px Rhythm" Standard

All major vertical anchors must align:

| Element | Height | Class |
|---------|--------|-------|
| Site Header | 48px | `h-[48px]` or `h-12` |
| Category Header | 48px | `h-[48px]` |
| Bottom Nav | 48px | `h-[48px]` |
| Primary CTA Button | 48px | `h-[48px]` or `h-12` |
| Standard Button | 40-44px | `h-10` or `h-11` |

**Files to update:**
- `components/layout/mobile-header.tsx`
- `components/layout/mobile-bottom-nav.tsx`
- `components/mobile/category-nav/contextual-category-header.tsx`

---

### 2.2 The "Double Decker" Navigation (Focus Mode)

This is the **core innovation** from Treido that we're missing.

**Current Amazong behavior:**
- Stacked tabs + circles + pills all visible
- Cramped horizontal space
- Active category pill eats screen width

**Treido "Double Decker" pattern:**
When drilling into categories (L2+), split the navigation into **TWO dedicated rows**:

1. **Row 1: CONTEXT STACK** ("Where Am I")
   - Shows the path back up
   - `[Back Button]` + `[Active Category Pill (removable)]`
   - Background: `bg-zinc-50`

2. **Row 2: OPTIONS DECK** ("Where To Go")
   - Full-width scrollable list of next choices
   - 100% of screen width dedicated to options
   - Background: `bg-white`

**When to activate:**
- User is at L2 or deeper in hierarchy
- Gender/Department is already selected
- The "focus" is on a specific subcategory

**Implementation plan:**

**New file:** `components/mobile/category-nav/double-decker-nav.tsx`

```tsx
interface DoubleDeckNavProps {
  locale: string
  // Context Row
  contextItems: Array<{
    label: string
    icon?: React.ComponentType
    onClick: () => void
    isCurrent: boolean
  }>
  // Options Row
  options: Array<{
    id: string
    label: string
    isActive: boolean
    onClick: () => void
  }>
  showAllOption?: boolean
  onAllClick?: () => void
}

export function DoubleDeckNav({...}: DoubleDeckNavProps) {
  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ROW 1: CONTEXT STACK */}
      <div className="px-3 py-2 border-b border-zinc-100 flex items-center gap-2 overflow-x-auto no-scrollbar bg-zinc-50/50">
        {contextItems.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="w-3 h-3 text-zinc-300 flex-shrink-0" />}
            <button
              onClick={item.onClick}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[12px] font-medium transition-colors border",
                item.isCurrent
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                  : "bg-white text-zinc-600 border-zinc-200 active:bg-zinc-100"
              )}
            >
              {item.icon && <item.icon className="w-3.5 h-3.5" />}
              <span>{item.label}</span>
              {item.isCurrent && <X className="w-3 h-3 ml-1 opacity-60" />}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* ROW 2: OPTIONS DECK */}
      <div className="px-3 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar bg-white border-b border-zinc-100">
        {showAllOption && (
          <button
            onClick={onAllClick}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border flex-shrink-0 bg-zinc-900 text-white border-zinc-900 shadow-sm"
          >
            Всички
          </button>
        )}
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={opt.onClick}
            className={cn(
              "whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border flex-shrink-0",
              opt.isActive
                ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

---

### 2.3 Category Page Header (Treido Style)

**Current:** Variable height, mixed styles
**Target:** Fixed 48px header with:
- Back button (9×9 touch area, `active:bg-zinc-100`)
- Dynamic title (truncated, `max-w-[200px]`)
- Search + Cart icons (stroke 1.5)

**File:** `components/mobile/category-nav/contextual-category-header.tsx`

```tsx
<div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-zinc-200">
  <div className="pt-safe-top">
    <div className="flex items-center justify-between px-3 h-[48px]">
      <div className="flex items-center">
        <Link href={backHref} className="w-9 h-9 flex items-center justify-center rounded-full active:bg-zinc-100 -ml-1">
          <ArrowLeft className="w-[22px] h-[22px] stroke-[2] text-zinc-900" />
        </Link>
        <h1 className="text-[16px] font-bold text-zinc-900 ml-1 truncate max-w-[200px]">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-1">
        <button className="w-9 h-9 flex items-center justify-center rounded-full active:bg-zinc-100">
          <Search className="w-[22px] h-[22px] stroke-[1.5] text-zinc-900" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full active:bg-zinc-100 relative">
          <ShoppingBag className="w-[22px] h-[22px] stroke-[1.5] text-zinc-900" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />
        </button>
      </div>
    </div>
  </div>
</div>
```

---

### 2.4 Filter Bar (Treido Style)

**Current:** Separate filter drawer
**Target:** Dense inline filter bar + full-screen sheet on tap

**File:** Create `components/shared/filters/inline-filter-bar.tsx`

```tsx
<div className="flex items-center border-t border-zinc-200 h-[40px] px-3 bg-zinc-50/50 gap-3 overflow-x-auto no-scrollbar">
  <button 
    onClick={openFilterSheet}
    className="flex-shrink-0 flex items-center gap-1.5 text-[12px] font-bold text-zinc-900 active:opacity-60 bg-white px-2.5 py-1 rounded-md border border-zinc-200 shadow-sm"
  >
    <SlidersHorizontal className="w-3 h-3 stroke-[2.5]" />
    <span>Филтри</span>
  </button>
  
  <div className="h-3 w-[1px] bg-zinc-200 flex-shrink-0" />
  
  {quickFilters.map(filter => (
    <button key={filter.id} className="flex items-center gap-1 text-[12px] font-medium text-zinc-600">
      {filter.label} <ChevronDown className="w-3 h-3 stroke-[2] text-zinc-300" />
    </button>
  ))}
  
  <div className="flex-1" />
  
  <button className="flex-shrink-0 flex items-center gap-1.5 text-[12px] font-medium text-zinc-600">
    <ArrowUpDown className="w-3 h-3 stroke-[2]" />
    <span className="hidden sm:inline">Сортирай</span>
  </button>
</div>
```

---

## Phase 3: Product Card Refinement

### 3.1 ProductCard Component Update

**File:** `components/shared/product/product-card.tsx`

**Current issues:**
- Uses `rounded-lg/xl` (too rounded)
- Has hover scale transforms
- Price styling inconsistent

**Treido spec:**
- `rounded-md` (6px) outer, `rounded-sm` (4px) inner image
- `active:border-zinc-300` (not scale)
- Price: `text-[15px] font-bold` + currency `text-[11px] font-bold text-zinc-500`
- Tags: `text-[9px] uppercase font-bold bg-zinc-900/90 text-white px-1.5 py-0.5 rounded-sm`
- Meta: `text-[10px] text-zinc-400 font-medium`

```tsx
<div className="group cursor-pointer tap-highlight-transparent flex flex-col gap-2 p-2 bg-white rounded-md border border-zinc-200 active:border-zinc-300 transition-colors">
  {/* Image Container */}
  <div className="relative aspect-square overflow-hidden rounded-sm bg-zinc-100">
    <img ... className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity" />
    
    {/* Tags */}
    {tag && (
      <span className="absolute top-1.5 left-1.5 bg-zinc-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
        {tag}
      </span>
    )}
    
    {/* Favorite */}
    <button className="absolute top-1.5 right-1.5 p-1.5 bg-white/60 backdrop-blur-md rounded-sm border border-white/20 active:bg-white">
      <Heart className="w-3.5 h-3.5" strokeWidth={2} />
    </button>
  </div>

  {/* Content - Dense */}
  <div className="space-y-1">
    <h3 className="text-[13px] font-medium text-zinc-900 leading-tight line-clamp-2">{title}</h3>
    
    <div className="flex items-baseline gap-0.5">
      <span className="text-[15px] font-bold text-zinc-900 tracking-tight">{price}</span>
      <span className="text-[11px] font-bold text-zinc-500">лв.</span>
    </div>
    
    <div className="flex items-center gap-1.5 pt-0.5">
      <p className="text-[10px] text-zinc-400 font-medium truncate max-w-[60px]">{location}</p>
      <span className="w-0.5 h-0.5 rounded-full bg-zinc-300" />
      <p className="text-[10px] text-zinc-400 font-medium">{postedAt}</p>
    </div>
  </div>
</div>
```

---

### 3.2 Product Grid Update

**Current:** `gap-3` or variable
**Target:** Dense `gap-2` (8px)

```tsx
<div className="grid grid-cols-2 gap-2 px-3">
  {products.map(...)}
</div>
```

---

## Phase 4: Filter Modal (Full-Screen Sheet)

**File:** Create `components/shared/filters/filter-sheet-treido.tsx`

**Treido spec:**
- Slides from bottom (`animate-in slide-in-from-bottom`)
- `rounded-t-xl` corners
- `h-[92vh]` height
- `bg-black/40 backdrop-blur-sm` overlay
- Sticky header (56px) with X + title + "Clear"
- Sticky footer with primary CTA (48px)

```tsx
export function FilterSheetTreido({ isOpen, onClose, onApply, resultCount }: Props) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="relative w-full max-w-[430px] bg-white h-[92vh] rounded-t-xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-[56px] border-b border-zinc-100 flex-shrink-0">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full active:bg-zinc-100">
            <X className="w-5 h-5 stroke-[2] text-zinc-900" />
          </button>
          <h2 className="text-[16px] font-bold text-zinc-900">Филтри</h2>
          <button className="text-[14px] font-medium text-zinc-500 active:text-zinc-900 px-2">
            Изчисти
          </button>
        </div>
        
        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Sort Section */}
          <FilterSection title="Сортиране">...</FilterSection>
          {/* Price Section */}
          <FilterSection title="Цена (лв.)">...</FilterSection>
          {/* Condition Section */}
          <FilterSection title="Състояние">...</FilterSection>
        </div>
        
        {/* Footer - Sticky */}
        <div className="border-t border-zinc-100 p-4 pb-safe bg-white flex-shrink-0">
          <button 
            onClick={onApply}
            className="w-full h-[48px] bg-zinc-900 text-white font-bold text-[15px] rounded-lg active:opacity-90"
          >
            Покажи {resultCount} резултата
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## Phase 5: Bottom Navigation

**File:** `components/layout/mobile-bottom-nav.tsx`

**Treido spec:**
- Fixed 48px height
- 5-column grid
- Center "Sell" button: 34×34px black square with rounded-md
- Icons: 20×20px, stroke-[1.5] inactive, stroke-[2.5] active
- Labels: `text-[9px] font-medium`

```tsx
<nav className="fixed bottom-0 z-50 w-full max-w-[430px] mx-auto bg-white border-t border-zinc-200 pb-safe">
  <div className="grid grid-cols-5 h-[48px] items-center">
    <NavItem icon={Home} label="Начало" isActive={current === 'home'} />
    <NavItem icon={Search} label="Търси" isActive={current === 'search'} />
    
    {/* Center Sell Button */}
    <div className="flex items-center justify-center">
      <button className="flex items-center justify-center w-[34px] h-[34px] bg-zinc-900 rounded-md text-white active:bg-zinc-800">
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
    
    <NavItem icon={MessageCircle} label="Чат" isActive={current === 'chat'} />
    <NavItem icon={User} label="Профил" isActive={current === 'profile'} />
  </div>
</nav>

function NavItem({ icon: Icon, label, isActive }: Props) {
  return (
    <button className="flex flex-col items-center justify-center gap-[2px] w-full h-full active:opacity-50">
      <Icon className={cn(
        "w-5 h-5 transition-all",
        isActive ? "stroke-[2.5] text-zinc-900" : "stroke-[1.5] text-zinc-400"
      )} />
      <span className={cn(
        "text-[9px] font-medium leading-none",
        isActive ? "text-zinc-900 font-bold" : "text-zinc-400"
      )}>
        {label}
      </span>
    </button>
  )
}
```

---

## Phase 6: Homepage Category Section

### 6.1 Gender Tabs (L0)

**Treido spec:**
- Horizontal scroll tabs with underline indicator
- `h-[44px]`
- `text-[13px]` active bold, inactive medium
- Underline: `h-[2px] bg-zinc-900 rounded-t-full`

### 6.2 Department Circles (L1)

**Treido spec:**
- Circle: `w-[52px] h-[52px] rounded-full bg-zinc-50 border border-zinc-200`
- Icon: `w-5 h-5 text-zinc-900 stroke-[1.5]`
- Label: `text-[10px] font-medium text-zinc-700`
- Tap feedback: `group-active:scale-95 group-active:bg-zinc-100`

---

## Phase 7: Implementation Order (Prioritized)

### Week 1: Foundation
1. **Day 1-2:** Update `globals.css` with Treido tokens (Phase 0)
2. **Day 3-4:** Update shadcn components (Button, Input, Card) (Phase 1)
3. **Day 5:** Add `DoubleDeckNav` component (Phase 2.2)

### Week 2: Category Navigation
1. **Day 1-2:** Refactor `contextual-category-header.tsx` to 48px standard (Phase 2.3)
2. **Day 3-4:** Add inline filter bar (Phase 2.4)
3. **Day 5:** Create Treido-style filter sheet (Phase 4)

### Week 3: Product Display
1. **Day 1-2:** Refactor `ProductCard` to Treido spec (Phase 3)
2. **Day 3-4:** Update product grids to `gap-2`
3. **Day 5:** Test & polish transitions

### Week 4: Navigation & Polish
1. **Day 1-2:** Refactor `mobile-bottom-nav.tsx` (Phase 5)
2. **Day 3-4:** Update homepage category section (Phase 6)
3. **Day 5:** Full E2E testing, fix regressions

---

## Files to Create

| File | Purpose |
|------|---------|
| `components/mobile/category-nav/double-decker-nav.tsx` | Treido-style dual-row category navigation |
| `components/shared/filters/inline-filter-bar.tsx` | Dense horizontal filter strip |
| `components/shared/filters/filter-sheet-treido.tsx` | Full-screen filter modal (bottom sheet) |

---

## Files to Modify (Major Changes)

| File | Changes |
|------|---------|
| `app/globals.css` | Add Treido tokens (radius, rhythm, shadows) |
| `components/ui/button.tsx` | Remove ring-offset, add active:opacity-90, h-10 default |
| `components/ui/input.tsx` | bg-zinc-50, h-11, text-[16px], border focus |
| `components/ui/card.tsx` | shadow-none, border-zinc-200, rounded-md |
| `components/shared/product/product-card.tsx` | Dense Treido card spec |
| `components/mobile/mobile-home-tabs.tsx` | Integrate DoubleDeckNav |
| `components/mobile/category-nav/contextual-category-header.tsx` | 48px height, Treido styling |
| `components/layout/mobile-bottom-nav.tsx` | 48px, 5-grid, center sell button |

---

## Testing Checklist

- [ ] All headers render at exactly 48px
- [ ] No shadows on cards (except modals)
- [ ] Radius max 6px (check buttons, cards, inputs)
- [ ] Touch feedback uses `active:opacity-70` not `scale`
- [ ] Double Decker nav activates at L2+ depth
- [ ] Filter sheet slides from bottom with `rounded-t-xl`
- [ ] Product cards use dense `gap-2` grid
- [ ] Typography follows Treido scale (13px body, 10px labels)
- [ ] Bottom nav has center Sell button as 34px black square
- [ ] E2E smoke tests pass

---

## Verification Gates

After each phase, run:

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## References

- `inspiration/treido-mock/docs/AGENT_GUIDE_DESIGN_PHILOSOPHY.md`
- `inspiration/treido-mock/docs/AGENT_GUIDE_LAYOUT_PATTERNS.md`
- `inspiration/treido-mock/docs/AGENT_GUIDE_TAILWIND_V4_SHADCN.md`
- `inspiration/treido-mock/guide/01_THEME_AND_TOKENS.md`
- `inspiration/treido-mock/guide/02_SHADCN_OVERRIDES.md`
- `inspiration/treido-mock/guide/03_LAYOUT_PATTERNS.md`
- `inspiration/treido-mock/guide/PROMPT_FOR_AGENT.md`

---

**Document Version:** 1.0
**Author:** GitHub Copilot (Claude Opus 4.5)
**Status:** Ready for Implementation
