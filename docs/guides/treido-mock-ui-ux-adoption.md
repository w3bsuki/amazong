# Treido Mock → Amazong UI/UX Adoption Guide (Next.js 16 + shadcn + Tailwind v4)

**Goal**: Apply the proven mobile UI/UX patterns from `w3bsuki/treido-mock` to this repo while respecting our design rails.

**Source repo**: https://github.com/w3bsuki/treido-mock.git (React 19 + Vite + Tailwind CDN)

**Live Demo**: https://treido-mock.vercel.app

---

## 📁 Reference Files

> **Canonical design system**: `docs/DESIGN.md`
> 
> Historical treido-mock guides have been archived to `docs/archive/important/`.

---

**Original Treido-mock Docs (in the source repo)**:
- `docs/AGENT_GUIDE_DESIGN_PHILOSOPHY.md` - "Invisible Utility" design principles
- `docs/AGENT_GUIDE_TAILWIND_V4_SHADCN.md` - Technical guide for Next.js + Tailwind v4 + shadcn
- `docs/AGENT_GUIDE_LAYOUT_PATTERNS.md` - Common layout patterns
- `guide/01_THEME_AND_TOKENS.md` - OKLCH color palette
- `guide/02_SHADCN_OVERRIDES.md` - Shadcn component overrides
- `guide/03_LAYOUT_PATTERNS.md` - High-density layout patterns
- `guide/PROMPT_FOR_AGENT.md` - Master agent prompt

---

## Quick Reference: treido-mock Design Principles

### "Invisible Utility" Philosophy
The design should feel **native, utilitarian, and instant** - like eBay Mobile, Vinted, or iOS Settings.

### Core Rules

#### A. The "No Scale" Rule
```tsx
// ❌ FORBIDDEN
className="active:scale-95"

// ✅ REQUIRED
className="active:opacity-70"  // or active:bg-muted
```

#### B. The "Border Over Shadow" Rule
```tsx
// ❌ FORBIDDEN
className="shadow-xl shadow-2xl"

// ✅ REQUIRED
className="border border-border"  // 1px borders, flat design
```

#### C. Typography & Density
```tsx
// Labels (metadata): text-[11px] font-bold uppercase tracking-wide
// Body (inputs): text-[16px] (prevents iOS zoom)
// Prices/Headlines: text-[22px] font-bold
// Spacing: gap-2 or gap-3 (tight), avoid gap-6+
```

### Color Palette (Zinc/Slate → shadcn tokens)
| treido-mock | shadcn Token | Usage |
|-------------|--------------|-------|
| `bg-white` | `bg-background` | Cards, Headers, Modals |
| `bg-gray-50` | `bg-muted` | App Background, Inputs |
| `text-gray-900` | `text-foreground` | Headings, Prices |
| `text-gray-500` | `text-muted-foreground` | Metadata, Subtitles |
| `border-gray-200` | `border-border` | Dividers, Inputs |
| `bg-gray-900` | `bg-foreground` | Primary Buttons (Black) |

### Mobile Ergonomics
- Touch targets: minimum `h-[42px]` for buttons
- Safe areas: `pb-safe` for fixed footers
- Sticky elements: headers and action footers should be `sticky` or `fixed`

---

## Pattern Implementations (treido-mock → shadcn/Tailwind v4)

### 1. Product Page Info Block
**treido-mock** (`ProductPage.tsx` lines 80-100):
```tsx
<div className="px-4 py-4 border-b border-gray-100">
  <div className="flex items-start justify-between gap-4">
    <h1 className="text-[16px] leading-snug font-normal text-gray-900 line-clamp-2">{product.title}</h1>
    <button className="text-gray-400 active:text-red-500 pt-0.5">
      <Heart className="w-6 h-6 stroke-[1.5]" />
    </button>
  </div>
  
  <div className="mt-2 flex items-baseline gap-1">
    <span className="text-[22px] font-bold text-gray-900">{product.price}</span>
    <span className="text-[15px] font-medium text-gray-900">{product.currency}</span>
  </div>
  
  <div className="mt-2 flex items-center gap-2 text-[12px] text-gray-500">
    <span className="flex items-center gap-1">
      <MapPin className="w-3.5 h-3.5 stroke-[1.5]" /> {product.location}
    </span>
    <span className="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
    <span>{product.postedAt}</span>
  </div>
</div>
```

**Our implementation** (`mobile-price-location-block.tsx`):
```tsx
<div className="space-y-1.5">
  <div className="flex items-baseline gap-1">
    <span className="text-[22px] font-bold text-foreground">{formatPrice(price)}</span>
  </div>
  <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
    <span className="flex items-center gap-1">
      <MapPin className="size-3.5 shrink-0" strokeWidth={1.5} />
      {location}
    </span>
    <span className="size-0.5 bg-muted-foreground/50 rounded-full" />
    <span>{timeAgo}</span>
  </div>
</div>
```

### 2. Buyer Protection Badge
**treido-mock** (`ProductPage.tsx` lines 104-114):
```tsx
<div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
  <div className="flex items-start gap-3">
    <ShieldCheck className="w-5 h-5 text-gray-900 mt-0.5 stroke-[1.5]" />
    <div>
      <h3 className="text-[13px] font-bold text-gray-900">Защита на купувача</h3>
      <p className="text-[12px] text-gray-500 leading-snug mt-0.5">
        Преглед и тест преди плащане. Сигурна доставка.
      </p>
    </div>
  </div>
</div>
```

**Our implementation** (`mobile-buyer-protection-badge.tsx`):
```tsx
<div className="px-4 py-3 border-y border-border bg-muted/30">
  <div className="flex items-start gap-3">
    <ShieldCheck className="size-5 text-foreground mt-0.5" strokeWidth={1.5} />
    <div>
      <h3 className="text-[13px] font-bold text-foreground">{t("title")}</h3>
      <p className="text-xs text-muted-foreground leading-snug mt-0.5">{t("subtitle")}</p>
    </div>
  </div>
</div>
```

### 3. Seller Row
**treido-mock** (`ProductPage.tsx` lines 116-138):
```tsx
<div className="px-4 py-4 border-b border-gray-100">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
      <img src="..." alt="Seller" className="w-full h-full object-cover" />
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <h4 className="text-[14px] font-bold text-gray-900 truncate">Иван Петров</h4>
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-white" />
      </div>
      <div className="flex items-center gap-1 text-[12px] text-gray-500">
        <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
        <span className="font-medium text-gray-900">4.9</span>
        <span>(24)</span>
      </div>
    </div>
    
    <button className="text-[12px] font-medium text-gray-900 border border-gray-200 px-3 py-1.5 rounded bg-white active:bg-gray-50">
      Виж профила
    </button>
  </div>
</div>
```

**Our implementation** (`mobile-seller-card.tsx`):
```tsx
<div className="px-4 py-4 border-b border-border">
  <div className="flex items-center gap-3">
    <Avatar className="size-10 border border-border">
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback>{name.slice(0,2)}</AvatarFallback>
    </Avatar>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <Link className="text-sm font-bold text-foreground truncate">{name}</Link>
        {isVerified && <CheckCircle2 className="size-3.5 text-blue-600 fill-white" />}
      </div>
      {hasRating && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-foreground text-foreground" />
          <span className="font-medium text-foreground">{rating}</span>
          <span>({reviewCount})</span>
        </div>
      )}
    </div>
    
    <Link className="text-xs font-medium text-foreground border border-border px-3 py-1.5 rounded bg-background active:bg-muted">
      {t("viewProfile")}
    </Link>
  </div>
</div>
```

### 4. Details Section
**treido-mock** (`ProductPage.tsx` lines 140-153):
```tsx
<div className="px-4 py-4 border-b border-gray-100">
  <h3 className="text-[14px] font-bold text-gray-900 mb-3">Детайли</h3>
  <div className="space-y-2">
    {Object.entries(specs).map(([key, value]) => (
      <div key={key} className="flex justify-between text-[13px]">
        <span className="text-gray-500">{key}</span>
        <span className="text-gray-900 font-medium">{value}</span>
      </div>
    ))}
  </div>
</div>
```

### 5. Description Section
**treido-mock** (`ProductPage.tsx` lines 155-170):
```tsx
<div className="px-4 py-4 border-b border-gray-100">
  <h3 className="text-[14px] font-bold text-gray-900 mb-2">Описание</h3>
  <div className="relative">
    <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line">
      {displayedText}
    </p>
    {shouldTruncate && (
      <button className="text-[13px] font-bold text-gray-900 mt-2 underline decoration-gray-300 underline-offset-4 active:text-gray-600">
        {isExpanded ? 'Скрий' : 'Още'}
      </button>
    )}
  </div>
</div>
```

### 6. More from Seller
**treido-mock** (`ProductPage.tsx` lines 172-191):
```tsx
<div className="py-4 bg-gray-50/50">
  <div className="flex items-center justify-between px-4 mb-3">
    <h3 className="text-[14px] font-bold text-gray-900">Още от Иван</h3>
    <button className="text-[12px] font-medium text-gray-500">Виж всички</button>
  </div>
  
  <div className="flex overflow-x-auto no-scrollbar px-4 gap-2.5">
    {moreFromSeller.map((item, idx) => (
      <div key={idx} className="w-[130px] flex-shrink-0 bg-white rounded border border-gray-200 overflow-hidden">
        <div className="aspect-square bg-gray-100 relative">
          <img src={item.imageUrl} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="p-2">
          <p className="font-bold text-gray-900 text-[13px]">{item.price} {item.currency}</p>
          <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.title}</p>
        </div>
      </div>
    ))}
  </div>
</div>
```

### 7. Bottom Action Bar
**treido-mock** (`ProductPage.tsx` lines 193-207):
```tsx
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
  <div className="flex items-center gap-2 px-4 py-2">
    <button className="flex-1 h-[42px] flex items-center justify-center gap-2 rounded border border-gray-300 bg-white text-gray-900 font-bold text-[14px] active:bg-gray-50">
      <MessageCircle className="w-4.5 h-4.5 stroke-[1.5]" />
      Чат
    </button>
    <button className="flex-1 h-[42px] flex items-center justify-center rounded bg-gray-900 text-white font-bold text-[14px] active:opacity-90">
      Купи сега
    </button>
  </div>
</div>
```

**Our implementation** (`mobile-bottom-bar.tsx`):
```tsx
<div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background">
  <div className="flex items-center gap-2 px-4 py-2 pb-safe-max-xs">
    <button className="flex-1 h-[42px] flex items-center justify-center gap-2 rounded border border-input bg-background text-foreground font-bold text-sm active:bg-muted">
      <MessageCircle className="size-4" strokeWidth={1.5} />
      {chatText}
    </button>
    <button className="flex-1 h-[42px] flex items-center justify-center rounded bg-foreground text-background font-bold text-sm active:opacity-90">
      {buyNowText}
    </button>
  </div>
</div>
```

---

## Token Mapping Quick Reference

| treido-mock (Tailwind CDN) | shadcn/Tailwind v4 |
|---------------------------|-------------------|
| `text-gray-900` | `text-foreground` |
| `text-gray-500` | `text-muted-foreground` |
| `text-gray-400` | `text-muted-foreground/70` |
| `bg-white` | `bg-background` |
| `bg-gray-50` | `bg-muted` |
| `bg-gray-50/50` | `bg-muted/30` |
| `bg-gray-900` | `bg-foreground` |
| `border-gray-100` | `border-border` |
| `border-gray-200` | `border-border` |
| `border-gray-300` | `border-input` |
| `active:bg-gray-50` | `active:bg-muted` |
| `active:bg-gray-100` | `active:bg-accent` |

---
- Active state: text contrast + 2px underline bar.
- Gap: `gap-6` (24px) between items.

**What we want in Amazong**:
- Use our existing Tabs pattern where appropriate (`components/ui/tabs`), or keep a simple button strip.
- Typography: `text-xs` or `text-sm font-medium` (avoid `text-[13px]`).
- Underline: `h-0.5` (2px) with `bg-foreground`.

### 1.4 Filter chips ("pills") with inverted active state
**Source**: `components/FilterStrip.tsx`
```tsx
<div className="w-full overflow-x-auto no-scrollbar pl-4">
  <div className="flex items-center gap-2 pr-4">
    <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-full text-[13px] font-semibold">
      <SlidersHorizontal className="w-3.5 h-3.5" />
      <span>Филтри</span>
    </button>
    {FILTERS.map((filter) => (
      <button
        className={`flex-shrink-0 px-3.5 py-2 rounded-full text-[13px] font-medium border
          ${isActive 
            ? 'bg-gray-900 text-white border-gray-900 shadow-md shadow-gray-200' 
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
      >
        {filter.label}
      </button>
    ))}
  </div>
</div>
```
- `rounded-full` for pill shape.
- `px-3.5 py-2` padding.
- Active state: dark background + white text (inverted).
- Inactive: outlined with hover state.

**What we want in Amazong**:
- Use the canonical chip styling from `docs/DESIGN.md`:
  - Active: `bg-foreground text-background border-foreground`
  - Inactive: `bg-background text-muted-foreground border-border/60 hover:bg-muted/40 hover:text-foreground`
- Height: `h-touch-sm` (28px).
- No `shadow-md` on active (keep flat per repo rails).

### 1.5 Dense product grid + product card
**Source**: `App.tsx`, `components/ProductCard.tsx`
```tsx
// Grid in App.tsx:
<div className="grid grid-cols-2 gap-x-4 gap-y-8">
  {PRODUCTS.map((product) => <ProductCard key={product.id} product={product} />)}
</div>

// ProductCard.tsx:
<div className="flex flex-col gap-2.5">
  <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100 border border-black/[0.03]">
    <img src={product.imageUrl} className="w-full h-full object-cover" loading="lazy" />
    
    {/* Overlay Badges */}
    <div className="absolute bottom-2 left-2 flex gap-1">
      <span className="bg-white/95 backdrop-blur-md text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
        {product.tag}
      </span>
    </div>
    
    {/* Favorite Button */}
    <button className="absolute top-2 right-2 p-2 bg-white/60 backdrop-blur-md rounded-full border border-white/40">
      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} strokeWidth={2} />
    </button>
  </div>
  
  <div className="space-y-1">
    <p className="text-[15px] font-bold text-gray-900">{price}</p>
    <h3 className="text-[13px] font-medium text-gray-800 truncate">{title}</h3>
    <p className="text-[11px] text-gray-400">{location} • {postedAt}</p>
  </div>
</div>
```
- 2-column grid on mobile with `gap-x-4 gap-y-8`.
- Card: square image (`aspect-square`), overlay badges, favorite button, meta row.
- Favorite button: `bg-white/60 backdrop-blur-md rounded-full border border-white/40`.

**What we want in Amazong**:
- Reuse approved patterns from `docs/styling/PATTERNS.md`:
  - Product card: "Product Card (Hero Pattern)".
  - Grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8`
- Typography: `text-base font-semibold` for price, `text-sm` for title, `text-xs text-muted-foreground` for meta.

### 1.6 Glassy bottom navigation + safe area
**Source**: `components/BottomNav.tsx`, `index.html`
```tsx
// BottomNav.tsx:
<nav className="fixed bottom-0 z-50 w-full max-w-[430px] mx-auto bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe">
  <div className="grid grid-cols-5 items-center px-1 h-[50px]">
    <NavItem icon={<Home />} label="Начало" isActive />
    <NavItem icon={<Search />} label="Търси" />
    <button className="flex flex-col items-center justify-center gap-0.5 text-gray-900">
      <PlusSquare className="w-[20px] h-[20px] stroke-[1.5]" />
      <span className="text-[9px] font-semibold">Продай</span>
    </button>
    <NavItem icon={<MessageCircle />} label="Чат" />
    <NavItem icon={<User />} label="Профил" />
  </div>
</nav>

// NavItem component:
const NavItem = ({ icon, label, isActive }) => (
  <button className={`flex flex-col items-center gap-0.5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
    {React.cloneElement(icon, {
      className: `w-[20px] h-[20px] ${isActive ? 'stroke-[2]' : 'stroke-[1.5]'}`
    })}
    <span className={`text-[9px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
  </button>
);

// index.html CSS:
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
.pt-safe-top { padding-top: env(safe-area-inset-top); }
```
- `pb-safe` padding for notch devices.
- 5-column grid layout.
- Active state: `text-gray-900` + `stroke-[2]`, inactive: `text-gray-400` + `stroke-[1.5]`.
- Label: `text-[9px] font-semibold`.

**What we want in Amazong** (already implemented in `components/mobile/mobile-tab-bar.tsx`):
- `bg-card/95 backdrop-blur-xl border-t border-border/60 pb-safe`
- Height: `h-12` (48px).
- Icon size: `size-5` (20px) with `strokeWidth={1.5}`.
- Label: `text-2xs font-medium`.

---

## 2) Mapping: Treido-mock utilities → Amazong tokens/utilities

Treido-mock hard-codes colors/sizes. In this repo, translate them into **tokens and approved utilities**:

### 2.1 Color mapping

| Mock (hard-coded) | Replace with | Why |
|---|---|---|
| `bg-white` | `bg-background` or `bg-card` | Theme-correct surface |
| `bg-white/95` | `bg-card/95` | Glassy surface |
| `text-gray-900` | `text-foreground` | Primary text |
| `text-gray-800` | `text-foreground` | Primary text |
| `text-gray-600` | `text-muted-foreground` | Secondary text |
| `text-gray-500` | `text-muted-foreground` | Secondary text |
| `text-gray-400` | `text-muted-foreground` | Muted/meta text |
| `border-gray-100` | `border-border/50` | Soft separator |
| `border-gray-200` | `border-border` | Standard border |
| `bg-gray-100` | `bg-muted` | Muted background |
| `bg-gray-900 text-white` (active chips) | `bg-foreground text-background border-foreground` | Canonical "active pill" |
| `bg-[#F2F4F7]` (page background) | `bg-background` or `bg-muted/20` | Use existing tokens |
| `fill-red-500 text-red-500` (favorite) | Keep as-is (allowed exception) | Hearts/dots use literal red |

### 2.2 Spacing + typography mapping

| Mock | Replace with | Notes |
|---|---|---|
| `text-[9px]` | `text-2xs` (10px) | Closest token |
| `text-[10px]` | `text-2xs` | We have this token |
| `text-[11px]` | `text-xs` (12px) | Round up to token |
| `text-[13px]` | `text-xs` or `text-sm` | Pick based on role |
| `text-[14px]` | `text-sm` (14px) | Exact match |
| `text-[15px]` | `text-base` (16px) | Round up for prices |
| `text-[16px]` | `text-base` | Exact match |
| `text-[18px]` | `text-lg` | Section headings |
| `text-[20px]` | `text-xl` | Logo/page title |
| `h-[50px]` | `h-12` (48px) or `h-14` (56px) | Use standard heights |
| `h-[44px]` | `h-11` (44px) | Exact match |
| `w-[20px] h-[20px]` | `size-5` (20px) | Use size utility |
| `h-[2px]` | `h-0.5` (2px) | Exact match |
| `gap-0.5` | `gap-0.5` | Keep (valid token) |
| `gap-2` | `gap-2` | Keep (mobile default) |
| `gap-6` | `gap-6` | Keep for tab spacing |
| `px-3.5 py-2` | `px-3 py-2` or `h-touch-sm px-3` | Standardize pill sizing |

### 2.3 Interaction mapping

| Mock | Replace with | Notes |
|---|---|---|
| `active:scale-[0.98]` | Remove entirely | Repo disallows scale animations |
| `active:scale-90` | Remove entirely | Repo disallows scale animations |
| `active:scale-95` | Remove entirely | Repo disallows scale animations |
| `hover:bg-gray-50` | `hover:bg-muted/40` | Use token-based hover |
| `active:bg-gray-50` | `active:bg-muted/60` | Subtle press feedback |
| `shadow-md shadow-gray-200` | Remove | Keep flat per repo rails |

### 2.4 Safe-area mapping

Treido-mock defines `pb-safe`/`pt-safe-top` in `index.html` CSS. Amazong already has safe-area utilities:

```css
/* app/globals.css - already defined */
--safe-area-pb-sm: max(0.75rem, env(safe-area-inset-bottom));
```

Use:
- `pb-safe` for bottom bars (class defined in project)
- `pt-safe` for sticky headers (if needed)

---

## 3) Where this work should land (repo boundaries)

Use existing boundaries to avoid "UI sprawl":

| Layer | Path | Contents |
|-------|------|----------|
| Primitives | `components/ui/**` | shadcn-style primitives only |
| Layout shells | `components/layout/**` | Headers, navs, sidebars |
| Mobile composites | `components/mobile/**` | Tab bar, category nav, mobile product components |
| Shared composites | `components/shared/**` | Product cards, filters, badges |
| Route-owned | `app/[locale]/(group)/**/_components/**` | Route-specific UI |

**Rules**:
- Don't move files across boundaries just for neatness.
- Prefer editing existing components over creating new ones.
- Don't import route-owned components across route groups.

---

## 4) Preflight (do this before parallel work)

### 4.1 Establish baseline

1. **Typecheck**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
```

2. **E2E smoke** (with dev server running):
```bash
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

3. **Capture screenshots** of target pages (mobile viewport):
   - Home feed
   - Category browsing
   - Product page
   - Cart

### 4.2 PR Review Checklist

Every PR should verify:

- [ ] Used semantic tokens instead of hard-coded colors?
- [ ] Avoided arbitrary sizes unless absolutely required?
- [ ] Reused an approved pattern from `docs/styling/PATTERNS.md`?
- [ ] Kept spacing dense (mobile `gap-2` baseline)?
- [ ] No scale animations on hover/active?
- [ ] No new gradients introduced?
- [ ] Ran typecheck + E2E smoke?

---

## 5) Phased Implementation Plan

### Phase 1: Sticky Surfaces + Safe Area (Agent 1)

**Objective**: Make sticky headers and bottom bars consistent with the repo's canonical "glass" recipes, and ensure safe-area padding is correct.

**Duration**: 1-2 days

**Files to audit/modify**:
- `components/mobile/mobile-tab-bar.tsx` ✅ (already matches recipe)
- `components/mobile/product/mobile-product-header.tsx`
- `components/mobile/category-nav/sticky-category-tabs.tsx`
- `components/layout/header.tsx` (if mobile sticky variant exists)
- Any other `sticky top-0` components

**Tasks**:

1. **Standardize sticky header wrapper class**:
```tsx
// Canonical recipe:
className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50"
```

2. **Ensure safe-area top padding** uses project utility:
```tsx
// Use:
className="pt-safe"
// Not:
className="pt-[env(safe-area-inset-top)]"
```

3. **Ensure bottom bars use canonical recipe**:
```tsx
// Already correct in mobile-tab-bar.tsx:
className="fixed bottom-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/60 pb-safe"
```

4. **Unify header + category tabs** in one sticky wrapper where possible (Treido pattern):
```tsx
// Before (potential gap between elements):
<header className="sticky top-0 ...">...</header>
<nav className="sticky top-[52px] ...">...</nav>

// After (unified, no gap):
<div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50">
  <header>...</header>
  <nav>...</nav>
</div>
```

**Acceptance criteria**:
- No hard-coded `bg-white` / `border-gray-*` in sticky surfaces.
- Visual seams removed between header and tabs.
- Safe-area padding works on iOS Safari (test with simulator or device).

**Verification**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

### Phase 2: Chips/Pills/Tabs + Horizontal Strips (Agent 2)

**Objective**: Port the Treido feel: scrollable strips with no-scrollbar + consistent chip states + clear active indicator.

**Duration**: 1-2 days

**Files to audit/modify**:
- `components/mobile/category-nav/category-tabs.tsx`
- `components/mobile/category-nav/subcategory-pills.tsx`
- `components/mobile/category-nav/category-quick-pills.tsx`
- `components/mobile/category-nav/quick-filter-row.tsx`
- `components/mobile/category-nav/inline-filter-bar.tsx`
- `components/mobile/category-nav/all-tab-filters.tsx`
- Any filter rows in mobile listing pages

**Tasks**:

1. **Unify chip styling** to canonical recipe:
```tsx
// Active pill:
className="h-touch-sm rounded-full px-3 bg-foreground text-background border border-foreground"

// Inactive pill:
className="h-touch-sm rounded-full px-3 bg-background text-muted-foreground border border-border/60 hover:bg-muted/40 hover:text-foreground"
```

2. **Ensure all horizontal strips use**:
```tsx
className="overflow-x-auto no-scrollbar"
// With tight spacing:
className="flex items-center gap-2"  // or gap-3 max
```

3. **For underline-tabs style** (Treido category strip), use approved pattern from `docs/styling/PATTERNS.md`:
```tsx
<TabsTrigger
  className={cn(
    "relative h-touch-sm flex-none rounded-none border-none bg-transparent px-1 py-2",
    "text-sm font-medium text-muted-foreground hover:text-foreground",
    "data-[state=active]:text-foreground",
    // Underline indicator
    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full",
    "after:bg-foreground after:scale-x-0 after:transition-transform",
    "data-[state=active]:after:scale-x-100"
  )}
>
```

4. **Remove arbitrary typography** where possible:
```tsx
// Before:
className="text-[13px] font-medium"
// After:
className="text-xs font-medium"  // or text-sm
```

**Acceptance criteria**:
- Chips look and behave identically across category browsing and filters.
- No arbitrary `text-[13px]`, `h-[2px]`, etc. unless there's no token alternative.
- All horizontal strips scroll smoothly without visible scrollbar.

**Verification**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

### Phase 3: Product Cards + Grids + Feed Sections (Agent 3)

**Objective**: Make product lists feel dense and consistent with Treido mock: clean card, clear price/title/meta hierarchy, consistent grid spacing.

**Duration**: 2-3 days

**Files to audit/modify**:
- `components/shared/product/product-card.tsx`
- `components/shared/product/product-card-hero.tsx`
- `components/sections/tabbed-product-feed.tsx`
- `components/mobile/product/*` (related items grids)
- Any product grid implementations

**Tasks**:

1. **Align card structure** with `docs/styling/PATTERNS.md` "Product Card (Hero Pattern)":
```tsx
<article className="tap-transparent group relative block h-full min-w-0 cursor-pointer overflow-hidden bg-transparent">
  <AspectRatio ratio={3/4} className="relative overflow-hidden bg-muted rounded-md border border-border">
    <Image src={image} alt={title} fill className="object-cover" />
    
    {/* Favorite button - glassy */}
    <Button
      variant="outline"
      size="icon-sm"
      className="absolute right-2 top-2 bg-background/95 backdrop-blur border-border/60"
    >
      <Heart strokeWidth={1.5} />
    </Button>
  </AspectRatio>
  
  <div className="flex flex-col gap-1 pt-2">
    <p className="text-base font-semibold text-foreground">{price}</p>
    <h3 className="text-sm font-medium line-clamp-2 text-foreground">{title}</h3>
    <p className="text-xs text-muted-foreground line-clamp-1">{location} • {time}</p>
  </div>
</article>
```

2. **Ensure grid matches approved pattern**:
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8">
  {products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ))}
</div>
```

3. **Ensure meta text uses proper tokens**:
```tsx
// Price:
className="text-base font-semibold text-foreground"

// Title:
className="text-sm font-medium text-foreground line-clamp-2"

// Meta (location, time):
className="text-xs text-muted-foreground line-clamp-1"
```

4. **Replace hard-coded grays**:
```tsx
// Before:
className="text-gray-400 text-[11px]"
// After:
className="text-muted-foreground text-xs"
```

5. **Overlay badges** (tag, condition):
```tsx
<div className="absolute bottom-2 left-2 flex gap-1">
  <Badge variant="condition" className="bg-background/95 backdrop-blur-sm">
    {tag}
  </Badge>
</div>
```

**Acceptance criteria**:
- Product card typography uses repo scale (`text-sm`, `text-base`, `text-xs`, `text-2xs`).
- No heavy shadows; border-first separation.
- Grid spacing is consistent (`gap-x-4 gap-y-8`).
- Favorite button uses glassy recipe with blur.

**Verification**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

---

### Phase 4: Mobile Product Page Polish (Based on Reference Screenshots)

**Objective**: Make the mobile product page match the reference screenshots exactly — clean OLX/Treido style with proper section ordering, typography, and bottom bar.

**Duration**: 1-2 days

**Reference Screenshots Analysis**:

From the provided screenshots, the correct layout is:
```
┌─────────────────────────────────────────┐
│ [←]                        [⊕] [⋯]     │  ← Minimal header: back, share, more
├─────────────────────────────────────────┤
│                                         │
│         [Full-width Gallery]            │  ← Edge-to-edge, dot indicators
│              • • •                      │
├─────────────────────────────────────────┤
│ Apple iPhone 13 Pro Max - 256GB...   ♡  │  ← Title + wishlist heart
│                                         │
│ 1250 лв.                                │  ← Bold price, large
│                                         │
│ ⊙ София  ·  преди 2ч                   │  ← Location + time (small, muted)
├─────────────────────────────────────────┤
│ ☑ Защита на купувача                   │  ← Buyer protection card
│   Преглед и тест преди плащане...      │
├─────────────────────────────────────────┤
│ [👤] Иван Петров ✓           [Виж...]  │  ← Seller card with rating
│      ★ 4.9 (24)                         │
├─────────────────────────────────────────┤
│ Детайли                                 │  ← Details section header
│ ─────────────────────────────────────── │
│ Състояние              Използвано      │
│ Марка                       Apple      │
│ Цвят                     Graphite      │
│ Памет                       256GB      │
│ Доставка              Еконт / Спиди    │
├─────────────────────────────────────────┤
│ Описание                                │  ← Description section
│ Продавам телефона, защото си взех...   │
├─────────────────────────────────────────┤
│ Още от Иван              Виж всички    │  ← Related products
│ [img] [img] [img]                       │
├─────────────────────────────────────────┤
│ ▼ Доставка и връщане                   │  ← Collapsible accordion
├─────────────────────────────────────────┤
│  [○ Чат]      [████ Купи сега ████]    │  ← Sticky bottom bar
└─────────────────────────────────────────┘
```

**Files to modify**:
- `components/mobile/product/mobile-product-page.tsx`
- `components/mobile/product/mobile-product-header.tsx`
- `components/mobile/product/mobile-bottom-bar.tsx`
- `components/mobile/product/mobile-price-location-block.tsx`
- `components/mobile/product/mobile-seller-card.tsx`
- `components/mobile/product/mobile-details-section.tsx`
- `components/mobile/product/mobile-buyer-protection-badge.tsx`

**Tasks**:

#### 4.1 Header — Minimal (back + share + more)

The reference shows a minimal header: just back arrow, share icon, and menu (⋯).
Your current `MobileProductHeader` may have too many icons.

```tsx
// Target: Clean 3-icon header
<header className="fixed inset-x-0 top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50 h-12">
  <div className="flex items-center justify-between h-full px-2">
    <Button variant="ghost" size="icon" onClick={goBack}>
      <ArrowLeft className="size-5" strokeWidth={1.5} />
    </Button>
    
    <div className="flex items-center gap-0.5">
      <Button variant="ghost" size="icon">
        <Share className="size-5" strokeWidth={1.5} />
      </Button>
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="size-5" strokeWidth={1.5} />
      </Button>
    </div>
  </div>
</header>
```

#### 4.2 Price Block with Heart — Reference Layout

The reference shows:
- Title on one line (truncate if needed) with ♡ heart icon on the right
- Price bold and large below
- Location + time in muted small text

```tsx
// Title row with heart
<div className="flex items-start justify-between gap-2 px-3 pt-2">
  <h1 className="text-base font-medium text-foreground line-clamp-2 flex-1">
    {title}
  </h1>
  <Button variant="ghost" size="icon-sm" onClick={onWishlistToggle}>
    <Heart 
      className={cn("size-5", isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground")}
      strokeWidth={1.5}
    />
  </Button>
</div>

// Price - bold and prominent
<div className="px-3 pt-1">
  <p className="text-xl font-bold text-foreground tracking-tight">
    {formattedPrice}
  </p>
</div>

// Location + time - small and muted
<div className="flex items-center gap-2 px-3 pt-1 text-xs text-muted-foreground">
  <span className="flex items-center gap-1">
    <MapPin className="size-3" />
    {location}
  </span>
  <span>·</span>
  <span>{timeAgo}</span>
</div>
```

#### 4.3 Buyer Protection Card — Match Reference

The reference shows a card with checkmark icon (not shield) in a subtle circle:

```tsx
<Card className="border-border rounded-md mx-3 mt-3">
  <CardContent className="p-3 flex items-start gap-3">
    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
      <CheckCircle className="size-5 text-primary" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-foreground">{t("buyerProtection")}</p>
      <p className="text-xs text-muted-foreground">{t("buyerProtectionDesc")}</p>
    </div>
  </CardContent>
</Card>
```

#### 4.4 Seller Card — Match Reference

The reference shows:
- Avatar (larger, ~48px)
- Name with verified badge
- Star rating with count in parentheses
- "Виж профила" / "Профил" button on right

Your current `MobileSellerCard` is close but verify:
- Avatar: `size-12` (48px) ✅
- Rating format: `★ 4.9 (24)` ✅
- Button: outline, small ✅

#### 4.5 Details Section — Key-Value List

The reference shows a clean key-value table with:
- Section header "Детайли"
- Each row: label (left, muted) | value (right, bold)
- Dividers between rows

Your current `MobileDetailsSection` looks correct. Ensure:
```tsx
// Row styling
<div className="flex items-center justify-between px-3 py-2.5">
  <span className="text-sm text-muted-foreground">{label}</span>
  <span className="text-sm font-medium text-foreground text-right">{value}</span>
</div>
```

#### 4.6 Bottom Bar — Two Buttons Only

The reference shows exactly two buttons:
- Left: "Чат" (outline, with chat icon)
- Right: "Купи сега" (solid amber/gold)

Your current `MobileBottomBar` is correct! But ensure:
- Height: `h-11` (44px)
- Rounded: `rounded-lg` (not `rounded-full`)
- Buy Now color: `bg-cta-buy-now` (amber/gold, not purple primary)

```tsx
// Current implementation looks good:
<div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background">
  <div className="flex items-center gap-2 px-3 py-2 pb-safe">
    <Button variant="outline" className="flex-1 h-11 rounded-lg">
      <MessageCircle className="size-5" />
      <span>Чат</span>
    </Button>
    <Button className="flex-1 h-11 rounded-lg bg-cta-buy-now font-semibold">
      Купи сега
    </Button>
  </div>
</div>
```

#### 4.7 Section Ordering

The correct order from the reference:
1. Header (fixed)
2. Gallery (edge-to-edge)
3. Title + Heart
4. Price (bold)
5. Location + Time
6. Buyer Protection Card
7. Seller Card
8. Details Section
9. Description Section
10. Related Products ("Още от...")
11. Shipping & Returns Accordion
12. Bottom Bar (fixed)

Your current `MobileProductPage` ordering looks mostly correct. Verify the order matches.

**Acceptance criteria**:
- Product page matches reference screenshots visually
- Bottom bar has exactly two buttons (Chat + Buy Now)
- Price is bold and prominent
- Details section is clean key-value list
- No extra clutter between gallery and price

**Verification**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## 6) Integration Phase (after parallel work)

### 6.1 Merge Order

Recommended merge order (minimize conflicts):
1. **Phase 1** (sticky surfaces) — affects wrappers and layout shells
2. **Phase 2** (chips/strips) — mostly component-level class changes
3. **Phase 3** (cards/grids) — mostly shared component patterns
4. **Phase 4** (product page polish) — mobile product page specific

### 6.2 Final Consistency Pass

After merging all phases, do one final pass:

- [ ] Sticky surface recipe consistent everywhere
- [ ] Chip recipe consistent everywhere
- [ ] Product card + grid consistent everywhere
- [ ] No regressions in desktop layout
- [ ] i18n strings all work (Bulgarian + English)

Run full verification:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
pnpm test:unit  # Optional but recommended
```

---

## 7) Code Examples (Copy-Paste Ready)

### 7.1 Sticky Header with Category Tabs (Treido-style unified)

```tsx
// components/mobile/unified-sticky-header.tsx
import { cn } from "@/lib/utils"

interface UnifiedStickyHeaderProps {
  children: React.ReactNode
  className?: string
}

export function UnifiedStickyHeader({ children, className }: UnifiedStickyHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-40",
        "bg-background/90 backdrop-blur-md",
        "border-b border-border/50",
        "pt-safe",
        className
      )}
    >
      {children}
    </div>
  )
}
```

### 7.2 Filter Chip Component

```tsx
// components/shared/filter-chip.tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FilterChipProps {
  label: string
  isActive?: boolean
  onClick?: () => void
  icon?: React.ReactNode
}

export function FilterChip({ label, isActive, onClick, icon }: FilterChipProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-touch-sm rounded-full px-3 shrink-0",
        isActive
          ? "bg-foreground text-background border-foreground hover:bg-foreground/90"
          : "bg-background text-muted-foreground border-border/60 hover:bg-muted/40 hover:text-foreground"
      )}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </Button>
  )
}
```

### 7.3 Horizontal Scrollable Strip

```tsx
// components/shared/horizontal-strip.tsx
import { cn } from "@/lib/utils"

interface HorizontalStripProps {
  children: React.ReactNode
  className?: string
}

export function HorizontalStrip({ children, className }: HorizontalStripProps) {
  return (
    <div className={cn("overflow-x-auto no-scrollbar -mx-4 px-4", className)}>
      <div className="flex items-center gap-2 w-max">
        {children}
      </div>
    </div>
  )
}
```

### 7.4 Category Tab with Underline

```tsx
// components/mobile/category-nav/category-tab-button.tsx
import { cn } from "@/lib/utils"

interface CategoryTabButtonProps {
  label: string
  isActive?: boolean
  onClick?: () => void
}

export function CategoryTabButton({ label, isActive, onClick }: CategoryTabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative shrink-0 pb-2.5 text-sm font-medium transition-colors tap-transparent",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-foreground" />
      )}
    </button>
  )
}
```

---

## 8) Notes Specific to This Repo (Important Gotchas)

### 8.1 i18n

Treido-mock hard-codes Bulgarian strings. In Amazong:
- Add strings via `next-intl` message files (`messages/bg.json`, `messages/en.json`).
- Use `useTranslations()` in client components.
- Use `getTranslations()` in server components.

```tsx
// Client component:
const t = useTranslations("Filters")
<FilterChip label={t("newest")} />

// Server component:
const t = await getTranslations("Filters")
```

### 8.2 Don't Re-introduce Banned Patterns

Treido-mock uses these **banned** patterns that we must NOT port:
- Gradients (`bg-gradient-*`, `bg-white/5 rounded-full blur-3xl`)
- Scale-on-tap (`active:scale-[0.98]`, `active:scale-90`)
- Lots of arbitrary pixel sizes (`text-[13px]`, `h-[50px]`)
- Heavy shadows (`shadow-md shadow-gray-200`)

When porting, keep the *layout and hierarchy*, but translate styling into our tokens/utilities.

### 8.3 Existing Mobile Components

This repo already has mobile product polishing building blocks aligned with Treido patterns:
- `components/mobile/mobile-tab-bar.tsx` ✅
- `components/mobile/product/mobile-product-header.tsx`
- `components/mobile/product/mobile-price-block.tsx`
- `components/mobile/product/mobile-gallery-olx.tsx`
- `components/mobile/product/mobile-seller-card.tsx`
- `components/mobile/product/mobile-bottom-bar.tsx`

**Before creating new components, check if one of these can be reused or slightly adapted.**

### 8.4 Desktop Considerations

The Treido patterns are **mobile-first**. When applying:
- Use responsive prefixes (`md:`, `lg:`) to adjust for desktop.
- Desktop can have slightly more spacing (`gap-3` instead of `gap-2`).
- Desktop headers may have different layout (full nav instead of bottom bar).

---

## 9) Quick Reference: "Treido Feel" Checklist

✅ **Sticky surfaces**: glass recipe, one wrapper (no seams)
```
bg-background/90 backdrop-blur-md border-b border-border/50
```

✅ **Bottom bars**: glass + safe area
```
bg-card/95 backdrop-blur-xl border-t border-border/60 pb-safe
```

✅ **Horizontal strips**: hidden scrollbar, tight spacing
```
overflow-x-auto no-scrollbar gap-2
```

✅ **Chips (inactive)**: outlined, muted text
```
bg-background text-muted-foreground border-border/60 hover:bg-muted/40
```

✅ **Chips (active)**: inverted colors
```
bg-foreground text-background border-foreground
```

✅ **Product cards**: flat, border-first, clean hierarchy
```
rounded-md border border-border bg-card
```

✅ **Icons**: consistent size and weight
```
size-5 strokeWidth={1.5}
```

✅ **Typography scale**:
- Price: `text-base font-semibold`
- Title: `text-sm font-medium`
- Meta: `text-xs text-muted-foreground`
- Tiny: `text-2xs` (labels, badges)

---

## 10) Verification Commands

```bash
# Typecheck (required)
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E smoke (required, with dev server running)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

# Unit tests (recommended)
pnpm test:unit

# Full E2E (optional, takes longer)
pnpm test:e2e

# Scan for arbitrary Tailwind values (optional audit)
pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs

# Scan for palette/gradient violations (optional audit)
pnpm -s exec node scripts/scan-tailwind-palette.mjs
```

---

## 11) Summary

| Pattern | Treido-mock / Reference | Amazong Translation |
|---------|-------------------------|---------------------|
| Sticky header | `bg-white/95 backdrop-blur-xl` | `bg-background/90 backdrop-blur-md border-b border-border/50` |
| Bottom nav | `bg-white/95 backdrop-blur-xl pb-safe` | `bg-card/95 backdrop-blur-xl border-t border-border/60 pb-safe` |
| Active chip | `bg-gray-900 text-white` | `bg-foreground text-background border-foreground` |
| Inactive chip | `bg-white border-gray-200` | `bg-background border-border/60 text-muted-foreground` |
| Card | `rounded-md border border-black/[0.03]` | `rounded-md border border-border bg-card` |
| Grid | `grid-cols-2 gap-x-4 gap-y-8` | Same (keep) |
| Icon size | `w-[20px] h-[20px]` | `size-5` |
| Tab underline | `h-[2px] bg-gray-900` | `h-0.5 bg-foreground` |
| Typography | `text-[13px]`, `text-[11px]` | `text-xs`, `text-sm`, `text-2xs` |
| **Product page bottom bar** | 2 buttons: Chat (outline) + Buy Now (amber) | `h-11 rounded-lg`, Chat outline + `bg-cta-buy-now` |
| **Product price** | Bold, large, prominent | `text-xl font-bold text-foreground tracking-tight` |
| **Details section** | Key-value list, muted labels | `text-sm text-muted-foreground` / `text-sm font-medium` |
| **Seller card** | Avatar + name + rating + button | `size-12` avatar, outline button |

**Total estimated effort**: 4-6 days for 3 parallel agents, plus 1 day integration.

---

## 12) Current State Assessment (Your Mobile Product Page)

Based on code review, your current implementation is **~85% there**. Key findings:

### ✅ Already Correct
- `MobileBottomBar` — two-button layout (Chat + Buy Now) ✅
- `MobileSellerCard` — avatar + name + rating + button ✅
- `MobileDetailsSection` — key-value list ✅
- `MobileBuyerProtectionBadge` — card with icon ✅
- `MobileGalleryOlx` — edge-to-edge gallery ✅
- Section ordering — mostly correct ✅

### ⚠️ Minor Tweaks Needed
1. **Bottom bar button styling**:
   - Current: `bg-cta-buy-now` (amber) — this is correct
   - Verify: button height `h-11`, `rounded-lg` (not rounded-full)

2. **Price typography**:
   - Should be: `text-xl font-bold tracking-tight`
   - Check `MobilePriceLocationBlock` or wherever price is rendered

3. **Title + Heart layout**:
   - Reference shows heart icon inline with title
   - Verify the layout matches

4. **Header icons**:
   - Reference shows minimal: back + share + more
   - Your `MobileProductHeader` may have extra icons (search, wishlist, cart)

### 🔧 Code to Check/Fix

```tsx
// In mobile-price-location-block.tsx or mobile-product-page.tsx
// Price should be:
<p className="text-xl font-bold text-foreground tracking-tight">
  {formattedPrice}
</p>

// In mobile-bottom-bar.tsx
// Buttons should be:
<Button variant="outline" className="flex-1 h-11 rounded-lg ...">
<Button className="flex-1 h-11 rounded-lg bg-cta-buy-now ...">
```

---

---

## 13) ⭐ CRITICAL: Category "Visual Drill-Down" Navigation Pattern

**This is treido-mock's KILLER UX FEATURE — must implement!**

The treido-mock category navigation solves "Vertical Fatigue" (too many stacked navigation rows) with a **state-based transformation** pattern.

### The Problem
Most marketplace apps show:
```
[L0 Tabs: All | Fashion | Tech | Home...]
[L1 Circles: 🎀 Clothes | 👟 Shoes | 👜 Bags...]
[L2 Pills: All | Dresses | Shirts | Pants...]
```

This creates 3+ horizontal strips that eat screen real estate and confuse users.

### Treido-mock's Solution: Visual Drill-Down

**State A: Top Level (The "Showroom")**
```
[L0 Tabs: All | Fashion | Tech | Home...]   ← Text tabs
[L1 Circles: 🎀 Clothes | 👟 Shoes | 👜 Bags...] ← Large visual circles with icons
```
- L1 = Visual circles (52-64px diameter with icons)
- L2 = HIDDEN

**State B: Drilled Down (The "Shelf")**
When user clicks a circle (e.g., "Clothes"):
```
[L0 Tabs: All | Fashion | Tech | Home...]   ← Same tabs
[🎀 Clothes ✕] | [All] [Dresses] [Shirts] [Pants...]  ← Morphed back + pills
```
- The clicked circle **morphs** into a dark "Back Pill" with icon + X
- L2 subcategories appear as text pills next to it
- The other circles **disappear** (not dimmed — completely hidden!)

### Implementation Details

#### The "Morphed Back Button" Component
```tsx
// When a category is selected, render this instead of circles
<button 
  onClick={() => setActiveDept(null)}
  className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-zinc-900 text-white rounded-full text-[12px] font-medium"
>
  {/* Mini icon inside white circle */}
  <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
    <Icon className="w-2.5 h-2.5 stroke-[2]" />
  </div>
  <span>{categoryName}</span>
  <X className="w-3 h-3 ml-1 opacity-60" />
</button>
```

#### The State Machine
```tsx
// State
const [activeGender, setActiveGender] = useState('women')      // L0
const [activeDept, setActiveDept] = useState<string | null>(null) // L1/L2 selection
const [activeCategory, setActiveCategory] = useState('all')    // L3 pill

// Key Logic: When Department changes, reset category
useEffect(() => {
  setActiveCategory('all')
}, [activeDept])

// View Logic: Never show circles AND pills at the same time
const showCircles = !activeDept  // Show circles only when nothing selected
const showPills = !!activeDept   // Show pills only when a circle was clicked
```

#### Circle Component (L1/L2)
```tsx
<button
  onClick={() => setActiveDept(dept.id)}
  className="flex flex-col items-center gap-2 w-[64px]"
>
  <div className="w-[52px] h-[52px] rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center group-active:scale-95 group-active:bg-zinc-100 transition-all shadow-sm">
    <Icon className="w-5 h-5 text-zinc-900 stroke-[1.5]" />
  </div>
  <span className="text-[10px] font-medium text-zinc-700 text-center">
    {dept.name}
  </span>
</button>
```

#### Pill Component (L3)
```tsx
<button
  onClick={() => setActiveCategory(item.id)}
  className={cn(
    "whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border",
    isActive 
      ? "bg-zinc-900 text-white border-zinc-900 shadow-sm" 
      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
  )}
>
  {item.name}
</button>
```

### Files to Modify

1. **`hooks/use-category-navigation.ts`** — Add `showCircles`/`showPills` logic
2. **`components/mobile/category-nav/category-circles.tsx`** — Add morphing back button
3. **`components/mobile/category-nav/category-l3-pills.tsx`** — Style consistency
4. **`components/mobile/mobile-home-tabs.tsx`** — Wire up state machine

### Current vs Target Comparison

| Aspect | Current (Amazong) | Target (Treido-mock) |
|--------|-------------------|---------------------|
| Circle display | Always visible | Hidden when drilled down |
| Back navigation | Separate back button | Morphed pill with icon |
| Pills visibility | Shown alongside circles | Only shown after drill-down |
| State indicator | Active circle highlighted | Active becomes dark pill |

### Visual Reference (ASCII)

**Before clicking (Circles visible):**
```
┌─────────────────────────────────────────┐
│ [All] [Fashion] [Tech] [Home] [Auto]    │ ← L0 tabs
├─────────────────────────────────────────┤
│  (🎀)    (👟)    (👜)    (⌚)           │ ← L1 circles
│ Clothes  Shoes   Bags   Access.         │
├─────────────────────────────────────────┤
│ [Filters] | [Promo] [Near Me] [Newest]  │ ← Filter strip
└─────────────────────────────────────────┘
```

**After clicking "Clothes" (Pills visible):**
```
┌─────────────────────────────────────────┐
│ [All] [Fashion] [Tech] [Home] [Auto]    │ ← L0 tabs (unchanged)
├─────────────────────────────────────────┤
│ [🎀 Clothes ✕] │ [All][Dresses][Shirts] │ ← Back pill + L2 pills
├─────────────────────────────────────────┤
│ [Filters] | [Promo] [Near Me] [Newest]  │ ← Filter strip (unchanged)
└─────────────────────────────────────────┘
```

---

## 14) Profile Page Structure (Reference)

From treido-mock `ProfilePage.tsx`:

### Layout Sections
1. **Header** (48px) — "Профил" + Settings icon
2. **Identity Card** — Avatar + Name + Verification + Rating + Location
3. **Stats Grid** — 3-column (Active | Sold | Following)
4. **Balance Card** — Icon + Amount + "Withdraw" button
5. **Menu Groups** — Grouped menu items with section headers

### Key Styling Patterns

```tsx
// Stats grid item
<div className="flex flex-col items-center justify-center p-2 bg-zinc-50 rounded-lg border border-zinc-100">
  <span className="text-[16px] font-bold text-zinc-900">12</span>
  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Активни</span>
</div>

// Menu section header
<div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50/50">
  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Моите покупки</span>
</div>

// Menu item with badge
<div className="flex items-center justify-between px-4 py-3 active:bg-zinc-50">
  <div className="flex items-center gap-3.5">
    <ShoppingBag className="w-[18px] h-[18px] text-zinc-400 stroke-[1.5]" />
    <span className="text-[14px] font-medium text-zinc-900">Поръчки</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">2</span>
    <ChevronRight className="w-4 h-4 text-zinc-300" />
  </div>
</div>
```

---

## 15) Landing Page Structure (Reference)

From treido-mock `App.tsx`:

### Layout Sections
1. **Sticky Header Block**
   - Logo ("treido.") + action icons (Bell, Heart, Cart)
   - Search input below
2. **Category Strip** — Horizontal scrolling text tabs
3. **Promo Banner** — "Sell in minutes" CTA with gradient/image
4. **Filter Strip** — [Filters] + quick filter pills
5. **Section Header** — "Fresh Listings" + "View all" link
6. **Product Grid** — 2-column, gap-2

### Promo Banner Component
```tsx
<div className="mx-3 rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/50">
  <div className="flex items-center p-4">
    <div className="flex-1">
      <h2 className="text-[15px] font-bold text-zinc-900">Продай за минути</h2>
      <p className="text-[12px] text-zinc-600 mt-0.5">Освободи място и спечели.</p>
    </div>
    <img src="..." className="w-16 h-16 object-contain" />
  </div>
</div>
```

**Note:** We can adapt this without gradients per repo rules — use `bg-amber-50 border border-amber-200` instead.

---

## 16) Updated Implementation Phases

### Phase 1: Foundation (Day 1)
- [ ] Audit `globals.css` against treido-mock tokens
- [ ] Update Card component — remove shadows, set `rounded-md`
- [ ] Update Button component — `active:opacity-90` feedback
- [ ] Add safe area utilities if missing

### Phase 2: Category Drill-Down UX (Days 2-3) ⭐ CRITICAL
- [ ] Implement morphing back button in `category-circles.tsx`
- [ ] Add `showCircles`/`showPills` state to hook
- [ ] Hide circles when drilled down (not just dim)
- [ ] Test the full drill-down flow

### Phase 3: Product Card Refresh (Day 4)
- [ ] Match treido-mock card structure
- [ ] Inner image `rounded-sm`
- [ ] Tags: uppercase, micro size
- [ ] Metadata with dot separator

### Phase 4: Page Polish (Days 5-6)
- [ ] Landing page sections
- [ ] Category page breadcrumbs
- [ ] Product page (already mostly done)
- [ ] Profile page structure

### Phase 5: Testing (Day 7)
- [ ] E2E smoke tests
- [ ] Mobile device testing
- [ ] Cross-browser verification

---

*Last updated: January 9, 2026*
*Source: https://github.com/w3bsuki/treido-mock.git (cloned to `inspiration/treido-mock-repo/`)*
*Reference: Playwright audit of https://treido-mock.vercel.app/ on mobile viewport*
