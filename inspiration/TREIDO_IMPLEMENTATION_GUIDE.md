# TREIDO-MOCK UI Implementation Guide

**Objective:** Transform our current Amazong marketplace UI to match the clean, native-feeling, high-density design of [treido-mock](https://treido-mock.vercel.app).

> **Screenshots updated:** January 2026 - See `/inspiration/screenshots/` for latest reference images.

---

## 📊 Gap Analysis: Current State vs. Treido-Mock

### What Treido-Mock Does Right (Our Target)

| Aspect | Treido-Mock Approach | Why It Works |
|--------|---------------------|--------------|
| **Touch Feedback** | `active:opacity-90`, `active:bg-gray-50` | Feels native/instant |
| **Shadows** | NONE - only borders | Flat, scannable, mobile-first |
| **Borders** | `border-gray-100`, `border-gray-200` | Clean separation |
| **Radius** | `rounded-md` (6px), `rounded-lg` (8px max) | Tight, technical |
| **Typography** | `text-[11px]` labels, `text-[16px]` body, `text-[22px]` prices | Hierarchy |
| **Spacing** | `gap-2`, `gap-3`, `p-3`, `p-4` | Dense but readable |
| **Colors** | Gray/Zinc monochrome + black CTAs | Professional |
| **Headers** | `bg-white/80 backdrop-blur-xl` | Native iOS feel |
| **Safe Areas** | `pb-safe`, `pt-safe-top` | iPhone-ready |

### What We Currently Have (Problems)

| Issue | Current State | Required Change |
|-------|---------------|-----------------|
| **Shadows** | Some components use shadows | Remove ALL shadows from cards/buttons |
| **Radius** | Mixed (some `rounded-xl`) | Standardize to `rounded-md` / `rounded-lg` |
| **Spacing** | Often too loose (`gap-4`, `gap-6`) | Tighten to `gap-2`, `gap-3` |
| **Touch States** | May use `scale` animations | Switch to `opacity`/`bg` changes |
| **Typography** | Not using the 11/16/22 scale consistently | Adopt treido type scale |
| **CTA Buttons** | Brand purple | Should be `bg-gray-900` black |
| **Cards** | May have padding `p-6` | Reduce to `p-3`, `p-4` |

---

## 🎯 Implementation Plan (Phases)

### Phase 1: Foundation Tokens (globals.css)
**Files:** `app/globals.css`

1. Add treido-compatible CSS utilities:
```css
@layer utilities {
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .tap-transparent { -webkit-tap-highlight-color: transparent; }
  .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
  .pt-safe-top { padding-top: env(safe-area-inset-top); }
}
```

2. Review radius tokens (we have good ones, ensure consistency):
   - `--radius-md: 0.25rem` (4px)
   - `--radius-lg: 0.375rem` (6px)

3. Add treido typography scale:
   - `--text-label: 0.6875rem` (11px)
   - `--text-body: 1rem` (16px - iOS safe)
   - `--text-price: 1.375rem` (22px)

### Phase 2: Shadcn Component Overrides
**Files:** `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/input.tsx`

#### Button Changes:
```tsx
// ADD: active:opacity-90
// REMOVE: ring-offset, complex focus rings
// ENSURE: h-10, h-11, h-12 heights

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:opacity-90",
  // ...
)
```

#### Card Changes:
- Remove ALL shadow variants
- Add `border border-border`
- Reduce padding defaults to `p-3`/`p-4`

#### Input Changes:
- Background: `bg-gray-50` (not white)
- Font size: `text-[16px]` (prevents iOS zoom)
- Height: `h-12`

### Phase 3: Layout Components
**Files:** `components/layout/`, `components/mobile/`

#### Mobile Header Pattern:
```tsx
<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
  <div className="pt-safe-top">
    <div className="h-12 flex items-center justify-between px-2">
      {/* Logo */}
      <span className="text-[20px] font-extrabold tracking-tighter text-gray-900">
        treido.
      </span>
      {/* Actions */}
      <div className="flex items-center gap-0.5">
        <button className="p-2.5 text-gray-600 active:opacity-50">
          <Bell className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>
    </div>
  </div>
</header>
```

#### Fixed Footer Pattern:
```tsx
<footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
  <div className="flex items-center gap-2 px-4 py-2">
    <button className="flex-1 h-[42px] flex items-center justify-center gap-2 rounded border border-gray-300 bg-white text-gray-900 font-bold text-[14px] active:bg-gray-50">
      <MessageCircle className="w-4.5 h-4.5 stroke-[1.5]" />
      Chat
    </button>
    <button className="flex-1 h-[42px] flex items-center justify-center rounded bg-gray-900 text-white font-bold text-[14px] active:opacity-90">
      Buy Now
    </button>
  </div>
</footer>
```

#### Bottom Navigation Pattern:
```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-50">
  <div className="flex items-center justify-around h-14">
    {navItems.map(item => (
      <button 
        key={item.id}
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 flex-1 h-full active:bg-gray-50",
          item.active ? "text-gray-900" : "text-gray-400"
        )}
      >
        <item.icon className="w-5 h-5 stroke-[1.5]" />
        <span className="text-[10px] font-medium">{item.label}</span>
      </button>
    ))}
  </div>
</nav>
```

### Phase 4: Product Card Component
**File:** `components/shared/ProductCard.tsx` or equivalent

```tsx
<div className="group relative cursor-pointer" onClick={() => onSelect(product)}>
  {/* Image Container */}
  <div className="aspect-square bg-gray-100 rounded-md overflow-hidden border border-gray-100 relative">
    <img 
      src={product.imageUrl} 
      alt={product.title}
      className="w-full h-full object-cover"
      loading="lazy"
    />
    
    {/* Badge (Top) */}
    {product.badge && (
      <div className="absolute top-2 left-2">
        <span className="px-1.5 py-0.5 bg-gray-900 text-white text-[10px] font-bold uppercase rounded-sm">
          {product.badge}
        </span>
      </div>
    )}
    
    {/* Favorite Button */}
    <button 
      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-500 active:text-red-500"
      onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
    >
      <Heart className={cn("w-4 h-4 stroke-[1.5]", isFavorite && "fill-red-500 text-red-500")} />
    </button>
  </div>
  
  {/* Content */}
  <div className="mt-2 space-y-1">
    <p className="text-[13px] text-gray-900 line-clamp-2 leading-tight">{product.title}</p>
    <p className="text-[16px] font-extrabold text-gray-900 tracking-tight">
      {product.price}
      <span className="text-[14px] font-bold ml-0.5">{product.currency}</span>
    </p>
    <p className="text-[11px] text-gray-400 truncate">
      {product.location} • {product.postedAt}
    </p>
  </div>
</div>
```

### Phase 5: Filter Modal / Bottom Sheet
**File:** `components/mobile/FilterSheet.tsx` or equivalent

```tsx
<div className="fixed inset-0 z-[100] flex justify-center items-end">
  {/* Backdrop */}
  <div 
    className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
    onClick={onClose} 
  />

  {/* Sheet Container */}
  <div className="relative w-full max-w-[430px] bg-white h-[92vh] rounded-t-xl flex flex-col">
    
    {/* Header */}
    <div className="flex items-center justify-between px-4 h-[56px] border-b border-gray-100 flex-shrink-0">
      <button className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100">
        <X className="w-5 h-5 stroke-[2]" />
      </button>
      <h2 className="text-[16px] font-bold text-gray-900">Filters</h2>
      <button className="text-[14px] font-medium text-gray-500">Clear</button>
    </div>

    {/* Scrollable Body */}
    <div className="flex-1 overflow-y-auto">
      {/* Sort Section */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-[14px] font-bold text-gray-900 mb-3">Sort By</h3>
        <div className="space-y-2">
          {sortOptions.map(opt => (
            <div 
              key={opt.id}
              className={cn(
                "flex items-center justify-between py-2.5 cursor-pointer active:bg-gray-50 rounded px-2 -mx-2",
                selectedSort === opt.id && "text-gray-900"
              )}
              onClick={() => setSelectedSort(opt.id)}
            >
              <span className="text-[14px] text-gray-700">{opt.label}</span>
              {selectedSort === opt.id && <Check className="w-5 h-5 text-gray-900" />}
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range Section */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-[14px] font-bold text-gray-900 mb-3">Price (BGN)</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-[11px] text-gray-500 uppercase font-bold mb-1 block">From</label>
            <input 
              type="number" 
              className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-[14px]"
              placeholder="Min"
            />
          </div>
          <div className="flex-1">
            <label className="text-[11px] text-gray-500 uppercase font-bold mb-1 block">To</label>
            <input 
              type="number" 
              className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-[14px]"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
      
      {/* Condition Section */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-[14px] font-bold text-gray-900 mb-3">Condition</h3>
        <div className="flex flex-wrap gap-2">
          {conditions.map(cond => (
            <button 
              key={cond}
              className={cn(
                "px-4 py-2 rounded-lg border text-[13px] font-medium transition-colors",
                selectedConditions.includes(cond) 
                  ? "border-gray-900 bg-gray-900 text-white" 
                  : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
              )}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="border-t border-gray-100 p-4 pb-safe bg-white flex-shrink-0">
      <button className="w-full h-[48px] bg-gray-900 text-white font-bold rounded-lg text-[15px] active:opacity-90">
        Show {resultsCount} Results
      </button>
    </div>
  </div>
</div>
```

### Phase 6: Category Strip
**File:** `components/mobile/CategoryStrip.tsx` or equivalent

```tsx
<div className="overflow-x-auto no-scrollbar border-b border-gray-100">
  <div className="flex items-center gap-4 px-4">
    {categories.map(cat => {
      const isActive = activeCategory === cat.id;
      return (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={cn(
            "flex-shrink-0 relative text-[13px] font-medium pb-2.5 transition-colors whitespace-nowrap",
            isActive ? "text-gray-900" : "text-gray-500 active:text-gray-900"
          )}
        >
          {cat.name}
          {isActive && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full" />
          )}
        </button>
      );
    })}
  </div>
</div>
```

### Phase 7: Promo Banner
```tsx
<div className="px-4 pt-4">
  <div className="group relative overflow-hidden bg-gray-900 rounded-md p-5 cursor-pointer active:opacity-95 transition-opacity">
    <div className="flex items-center justify-between relative z-10">
      <div className="space-y-1.5">
        <h2 className="text-[16px] font-bold text-white tracking-tight leading-none">
          Sell in Minutes
        </h2>
        <p className="text-[13px] text-gray-400 font-medium leading-tight">
          Free up space and earn cash.
        </p>
      </div>
      <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white">
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </div>
    </div>
  </div>
</div>
```

---

## 📋 Priority Task List

### Immediate (This Sprint)
1. [ ] Update `globals.css` with treido utility classes (`.no-scrollbar`, `.pb-safe`, etc.)
2. [ ] Override `button.tsx` - add `active:opacity-90`, ensure heights
3. [ ] Override `card.tsx` - remove shadows, add borders
4. [ ] Override `input.tsx` - `bg-gray-50`, `text-[16px]`, `h-12`
5. [ ] Create/update mobile header component

### Short Term (Next 2 Sprints)
6. [ ] Update ProductCard to match treido pattern
7. [ ] Update FilterSheet/FilterModal
8. [ ] Update BottomNav component
9. [ ] Update CategoryStrip component
10. [ ] Audit all `rounded-xl` → `rounded-md`/`rounded-lg`

### Medium Term
11. [ ] Audit all `gap-4`/`gap-6` → `gap-2`/`gap-3`
12. [ ] Audit all `p-6`/`p-8` → `p-3`/`p-4`
13. [ ] Update ProductPage layout
14. [ ] Update SellPage layout
15. [ ] Update ProfilePage layout

---

## 🔍 Audit Checklist

Run these grep searches to find violations:

```bash
# Find scale animations (should be opacity instead)
grep -r "scale-95\|scale-105" --include="*.tsx"

# Find large shadows
grep -r "shadow-xl\|shadow-2xl" --include="*.tsx"

# Find large radius
grep -r "rounded-2xl\|rounded-3xl" --include="*.tsx"

# Find loose spacing
grep -r "gap-6\|gap-8\|p-6\|p-8" --include="*.tsx"

# Find non-semantic colors (should use tokens)
grep -r "bg-\[#\|text-\[#" --include="*.tsx"
```

---

## 📸 Reference Screenshots

See `/inspiration/screenshots/` for updated 2026 screenshots:

| File | Description |
|------|-------------|
| `01-home-page-2026.png` | Home with header, categories, promo, product grid |
| `02-product-page-2026.png` | Product detail with gallery, specs, seller |
| `03-category-page-2026.png` | Category with filters and product grid |
| `04-filter-modal-2026.png` | Bottom sheet filter modal |
| `05-sell-page-2026.png` | Create listing form |
| `06-profile-page-2026.png` | User profile with stats and menu |
| `07-search-page-2026.png` | Search with recent, popular, categories |

---

## 🎨 Token Mapping (Treido → Amazong)

| Treido Class | Amazong Semantic Token |
|--------------|----------------------|
| `bg-gray-900` | `bg-foreground` or `bg-primary` |
| `bg-gray-50` | `bg-muted` or `bg-secondary` |
| `text-gray-900` | `text-foreground` |
| `text-gray-500` | `text-muted-foreground` |
| `border-gray-100` | `border-border` |
| `border-gray-200` | `border-border` |

**Important:** Treido uses hardcoded Tailwind gray classes. We should use our semantic tokens but match the visual output.

---

## 🚀 Quick Wins

1. **Add `active:opacity-90` to all buttons** - Instant native feel
2. **Remove all shadows from cards** - Cleaner look
3. **Add borders to all cards** - Better definition
4. **Add `.no-scrollbar` utility** - Cleaner carousels
5. **Use `h-12` for inputs** - Better touch targets

---

**Last Updated:** January 9, 2026
**Reference Site:** https://treido-mock.vercel.app
**GitHub:** https://github.com/w3bsuki/treido-mock
