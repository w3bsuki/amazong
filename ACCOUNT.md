# Account Pages Standardization Plan

> **Created:** December 12, 2025  
> **Status:** Planning Phase  
> **Goal:** Standardize all `/account/*` pages to production-ready UI/UX with shadcn + Tailwind CSS v4
> **Verified:** ✅ Context7 MCP (shadcn/ui + Tailwind CSS v4 docs)

---

## ✅ Tech Stack Verification (Context7)

### shadcn/ui v4 Best Practices
- ✅ **CSS Variables**: Using `cssVariables: true` in `components.json`
- ✅ **OKLCH Color Space**: All colors defined in `oklch()` format
- ✅ **@theme directive**: Using `@theme {}` block for design tokens
- ✅ **@custom-variant dark**: Correct dark mode variant syntax
- ✅ **new-york style**: Using modern shadcn style
- ✅ **Sidebar tokens**: Proper `--color-sidebar-*` variables defined

### Tailwind CSS v4 Compliance
- ✅ **Import syntax**: `@import "tailwindcss"` (not v3 directives)
- ✅ **Theme variables**: Using `--color-*`, `--radius-*`, `--shadow-*` namespaces
- ✅ **No tailwind.config.js**: Config is empty in `components.json` (v4 pattern)
- ✅ **CSS-first config**: All tokens in `app/globals.css` `@theme {}` block
- ⚠️ **Container queries**: Use `@container` with `@container/name` syntax

### Semantic Tokens Already Defined
Your `globals.css` has excellent semantic tokens:
- `--color-background`, `--color-foreground`, `--color-card`, `--color-muted`
- `--color-sidebar-*` (7 tokens for sidebar theming)
- `--color-cta-*` (trust-blue, primary, buy-now)
- `--color-success`, `--color-warning`, `--color-error`, `--color-info`
- Chart colors: `--color-chart-1` through `--color-chart-5`

---

## 📊 Current State Analysis

### ✅ COMPLETED (Reference Patterns)
| Page | Status | Notes |
|------|--------|-------|
| `/account` (Dashboard) | ✅ Done | Stats cards, charts, recent activity |
| `/account/orders` | ✅ Done | Stats, toolbar with tabs, order grid |

### 🔄 PAGES TO STANDARDIZE
| Page | Priority | Current State | Target |
|------|----------|---------------|--------|
| `/account/wishlist` | 🔴 HIGH | Client component, basic card | Server + stats + grid |
| `/account/messages` | 🟡 MEDIUM | Good structure, needs polish | Consistent header/layout |
| `/account/security` | 🟡 MEDIUM | Good, needs layout alignment | Consistent spacing |
| `/account/addresses` | 🟡 MEDIUM | Good dialogs, needs grid | Stats + address cards |
| `/account/payments` | 🟡 MEDIUM | Good Stripe integration | Stats + card grid |
| `/account/selling` | 🔴 HIGH | Custom layout, stats exist | Align with orders pattern |
| `/account/sales` | 🔴 HIGH | Has chart/table, different layout | Align with dashboard |
| `/account/plans` | 🟡 MEDIUM | Good pricing cards | Consistent layout |

---

## 🎨 Design System (Established Patterns)

### ⚠️ CRITICAL: Tailwind v4 + shadcn Best Practices

#### Color Usage (CORRECT ✅)
```tsx
// Use semantic tokens from your theme
<div className="bg-background text-foreground" />
<div className="bg-card text-card-foreground" />
<div className="bg-muted text-muted-foreground" />
<div className="text-destructive" />

// For status colors, use your semantic tokens
<Badge className="bg-success text-success-foreground" />  // ✅ If defined
<Badge className="text-emerald-600" />                     // ✅ Tailwind color
```

#### Color Usage (AVOID ❌)
```tsx
// Don't mix HSL/RGB with OKLCH
<div style={{ backgroundColor: 'hsl(...)' }} />  // ❌ Your theme uses OKLCH

// Don't hardcode colors when tokens exist
<div className="bg-[#243c5a]" />  // ❌ Use tokens
<div className="bg-blue-500/10" />  // ⚠️ OK for one-offs, prefer tokens
```

#### Container Queries (Tailwind v4)
```tsx
// Your pattern is correct - using @container
<div className="@container/main">
  <div className="@xl/main:grid-cols-4">...</div>
</div>

// Card-level containers
<Card className="@container/card">
  <CardTitle className="text-2xl @[250px]/card:text-3xl">
```

#### CSS Variable Reference (v4 Syntax)
```tsx
// New v4 syntax uses parentheses, not brackets
<div className="bg-(--my-custom-color)" />  // ✅ v4
<div className="bg-[--my-custom-color]" />  // ❌ v3 (deprecated)

// But for theme colors, just use the utility
<div className="bg-primary" />  // ✅ Uses --color-primary automatically
```

### Page Structure Template
```tsx
// Server Component Pattern (page.tsx)
export default async function PageName({ params }: Props) {
  await connection()
  const { locale } = await params
  const supabase = await createClient()
  
  // Auth check
  if (!supabase) redirect("/auth/login")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  
  // Fetch data with parallel queries
  const [result1, result2] = await Promise.all([
    supabase.from('table').select('*').eq('user_id', user.id),
    // ... more queries
  ])
  
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="sr-only">{title}</h1>
      <StatsCards data={data} locale={locale} />
      <ToolbarWithTabs ... />
      <ContentGrid ... />
    </div>
  )
}
```

### Component Patterns

#### 1. Stats Cards (`*-stats.tsx`)
```tsx
// Mobile: Simple inline stats
<div className="flex items-center gap-4 text-sm sm:hidden">
  <div className="flex items-center gap-1.5">
    <Icon className="size-4 text-muted-foreground" />
    <span className="font-medium">{count}</span>
    <span className="text-muted-foreground">{label}</span>
  </div>
</div>

// Desktop: Full cards grid
<div className="hidden sm:grid grid-cols-2 gap-3 @xl/main:grid-cols-4">
  <Card className="@container/card">
    <CardHeader>
      <CardDescription className="flex items-center gap-1.5">
        <Icon className="size-4 shrink-0" />
        <span className="truncate">{label}</span>
      </CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        {value}
      </CardTitle>
      <CardAction>
        <Badge variant="outline" className="...">
          {badge}
        </Badge>
      </CardAction>
    </CardHeader>
  </Card>
</div>
```

#### 2. Toolbar with Tabs (`*-toolbar.tsx`)
```tsx
<div className="flex flex-col gap-3">
  <Tabs value={status} onValueChange={...}>
    <TabsList className="h-auto w-full sm:w-fit rounded-full border border-border bg-muted p-1 overflow-x-auto no-scrollbar whitespace-nowrap justify-start">
      <TabsTrigger value="all" className="rounded-full text-xs flex-none">
        {label}
        <span className="ml-1 tabular-nums text-muted-foreground">{count}</span>
      </TabsTrigger>
      {/* ... more tabs */}
    </TabsList>
  </Tabs>

  <div className="relative">
    <MagnifyingGlass className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input placeholder={...} className="pl-9" />
  </div>
</div>
```

#### 3. Content Grid (`*-grid.tsx`)
```tsx
// Mobile: Stacked cards with Sheet details
<div className="space-y-3 md:hidden">
  {items.map((item) => (
    <Sheet key={item.id}>
      <SheetTrigger asChild>
        <button className="w-full text-left rounded-lg border bg-card p-3 transition-colors active:bg-muted/50">
          {/* Compact card content */}
        </button>
      </SheetTrigger>
      <SheetContent>
        {/* Full details */}
      </SheetContent>
    </Sheet>
  ))}
</div>

// Desktop: Card or Table layout
<Card className="hidden md:block">
  <CardContent className="p-0">
    {/* Table or detailed cards */}
  </CardContent>
</Card>
```

#### 4. Empty States
```tsx
<Card>
  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
    <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
      <Icon className="size-8 text-muted-foreground" />
    </div>
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-muted-foreground text-sm mt-1 max-w-sm">{description}</p>
    <Button asChild className="mt-6">
      <Link href="...">{action}</Link>
    </Button>
  </CardContent>
</Card>
```

---

## 📋 Standardization Tasks by Page

### 1. Wishlist Page (`/account/wishlist`)

**Current Issues:**
- Client-side only (no server data)
- Missing stats cards
- Different empty state pattern
- No search/filter

**Changes Required:**

```
📁 app/[locale]/(account)/account/wishlist/
├── page.tsx              # Server component (NEW)
├── wishlist-content.tsx  # Client component (REFACTOR from current page.tsx)
└── wishlist-grid.tsx     # Grid component (NEW)

📁 components/
├── account-wishlist-stats.tsx  # Stats cards (NEW)
└── account-wishlist-grid.tsx   # Responsive grid (NEW)
```

**Server Component:**
```tsx
// Fetch wishlist from Supabase
const { data: wishlistItems, count } = await supabase
  .from('wishlist_items')
  .select(`
    *,
    product:products(id, title, price, images, stock)
  `, { count: 'exact' })
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })

// Stats
const stats = {
  total: count || 0,
  inStock: items.filter(i => i.product?.stock > 0).length,
  outOfStock: items.filter(i => !i.product?.stock).length,
  totalValue: items.reduce((sum, i) => sum + (i.product?.price || 0), 0)
}
```

**Stats to show:**
- Total items ❤️
- In stock (ready to buy) ✅
- Out of stock ⚠️
- Total value 💰

---

### 2. Messages Page (`/account/messages`)

**Current State:** Good structure with `MessageProvider`, split view

**Minor Improvements:**
- Consistent page header styling
- Add unread count badge
- Mobile: full-screen chat view

**No major refactor needed** - just alignment tweaks.

---

### 3. Security Page (`/account/security`)

**Current State:** Good card-based sections

**Changes:**
- Remove wrapper `<div className="p-4 lg:p-6">` (layout handles this)
- Consistent max-width with other pages
- Add mobile-first improvements

**Security sections:**
1. Email Address (verified badge)
2. Password (change button)
3. Two-Factor Authentication (enable/disable)
4. Active Sessions (list with logout)
5. Account Actions (export data, delete account)

---

### 4. Addresses Page (`/account/addresses`)

**Current State:** Good dialog-based CRUD

**Changes:**
- Add address stats (total, default indicator)
- Grid layout for desktop (2 cols)
- Consistent empty state

**Stats to show:**
- Total addresses 📍
- Default shipping 🚚
- Default billing 💳

---

### 5. Payments Page (`/account/payments`)

**Current State:** Good Stripe integration

**Changes:**
- Add payment stats
- Consistent card grid layout

**Stats to show:**
- Total cards 💳
- Default payment method
- Last used

---

### 6. Selling Page (`/account/selling`)

**Current Issues:**
- Uses `AppBreadcrumb` (others don't need it)
- Different header pattern
- Custom stats grid (not using shared component)

**Changes:**
```
📁 app/[locale]/(account)/account/selling/
├── page.tsx                 # Server component
├── selling-stats.tsx        # Stats (REFACTOR)
├── selling-toolbar.tsx      # Tabs + search (NEW)
└── selling-grid.tsx         # Products grid (NEW)

📁 components/
└── account-selling-stats.tsx    # Shared stats (NEW)
```

**Stats to show:**
- Total products 📦
- Active listings ✅
- Low stock ⚠️
- Inventory value 💰

**Tabs:**
- All | Active | Low Stock | Out of Stock

---

### 7. Sales Page (`/account/sales`)

**Current State:** Good chart + table structure

**Changes:**
- Align stats cards with dashboard pattern
- Consistent period selector
- Use shared toolbar pattern

**Stats to show:**
- Total revenue 💰
- Sales count 📊
- Average order value
- Commission rate %

---

### 8. Plans Page (`/account/plans`)

**Current State:** Good pricing card layout

**Changes:**
- Remove wrapper padding
- Add current plan highlight
- Mobile: stacked cards (already working)

---

## 🗃️ Supabase Schema Alignment

### Tables Used:
| Table | Pages | RLS |
|-------|-------|-----|
| `wishlist_items` | Wishlist | ✅ user_id |
| `messages` | Messages | ✅ sender/receiver |
| `user_addresses` | Addresses | ✅ user_id |
| `user_payment_methods` | Payments | ✅ user_id |
| `products` | Selling | ✅ seller_id |
| `order_items` | Sales | ✅ seller_id |
| `sellers` | Selling, Sales, Plans | ✅ id |
| `subscription_plans` | Plans | Public |
| `subscriptions` | Plans | ✅ seller_id |

### Required Queries Pattern:
```tsx
// Always use parallel queries
const [wishlist, products, sales] = await Promise.all([
  supabase.from('wishlist_items').select('*', { count: 'exact' }).eq('user_id', user.id),
  supabase.from('products').select('*').eq('seller_id', user.id),
  supabase.from('order_items').select('*').eq('seller_id', user.id)
])
```

---

## 🎯 Implementation Order

### Phase 1: High Priority (User-Facing)
1. **Wishlist** - Convert to server component, add stats
2. **Selling** - Align with orders pattern
3. **Sales** - Consistent dashboard pattern

### Phase 2: Settings Pages
4. **Addresses** - Add stats, consistent layout
5. **Payments** - Add stats, consistent layout
6. **Security** - Layout alignment only

### Phase 3: Polish
7. **Messages** - Minor tweaks
8. **Plans** - Minor tweaks

---

## ✅ Checklist per Page

For each page, ensure:

- [ ] Server component fetches data from Supabase
- [ ] Parallel queries with `Promise.all()`
- [ ] Stats component with mobile/desktop variants
- [ ] Toolbar with tabs (if applicable)
- [ ] Grid/list with Sheet details on mobile
- [ ] Consistent empty state pattern
- [ ] No mocks/demo data - all from Supabase
- [ ] Proper i18n with `locale` prop or `useTranslations`
- [ ] `@container` queries for responsive cards
- [ ] Tailwind v4 tokens (`bg-card`, `text-muted-foreground`, etc.)
- [ ] shadcn components (Card, Badge, Button, Sheet, etc.)
- [ ] No `<div className="p-4 lg:p-6">` wrapper (layout handles it)
- [ ] `sr-only` h1 for accessibility

---

## 🎨 Color Palette (per Section) - Using Tailwind Colors

> **Note**: Use Tailwind's built-in color scale utilities. These are already defined in Tailwind v4's `@theme` and work perfectly with dark mode.

| Section | Light Mode | Dark Mode | Usage |
|---------|------------|-----------|-------|
| Orders | `text-blue-600` `bg-blue-50` | `dark:text-blue-400 dark:bg-blue-950/50` | Status badges |
| Wishlist | `text-pink-600` `bg-pink-50` | `dark:text-pink-400 dark:bg-pink-950/50` | Heart icons |
| Messages | `text-green-600` `bg-green-50` | `dark:text-green-400 dark:bg-green-950/50` | Unread count |
| Addresses | `text-orange-600` `bg-orange-50` | `dark:text-orange-400 dark:bg-orange-950/50` | Location |
| Payments | `text-purple-600` `bg-purple-50` | `dark:text-purple-400 dark:bg-purple-950/50` | Cards |
| Security | `text-slate-600` `bg-slate-50` | `dark:text-slate-400 dark:bg-slate-950/50` | Settings |
| Selling | `text-teal-600` `bg-teal-50` | `dark:text-teal-400 dark:bg-teal-950/50` | Store |
| Sales | `text-emerald-600` `bg-emerald-50` | `dark:text-emerald-400 dark:bg-emerald-950/50` | Revenue |
| Plans | `text-amber-600` `bg-amber-50` | `dark:text-amber-400 dark:bg-amber-950/50` | Premium |

### Badge Pattern (with dark mode)
```tsx
// Correct pattern with dark mode support
<Badge 
  variant="outline" 
  className="text-orange-600 border-orange-200 bg-orange-50 
             dark:bg-orange-950/50 dark:border-orange-800 dark:text-orange-400"
>
  {label}
</Badge>
```

---

## 📱 Mobile-First Principles

1. **Touch targets:** Minimum 44px height
2. **Spacing:** `gap-3` on mobile, `gap-4 md:gap-6` on desktop
3. **Stats:** Inline on mobile, cards on desktop
4. **Lists:** Tappable cards that open Sheet for details
5. **Search:** Full-width input below tabs on mobile
6. **Actions:** Bottom-aligned or in Sheet footer

---

## 🔌 Shared Components to Create

```
📁 components/
├── account-page-header.tsx      # Consistent h1 + description
├── account-empty-state.tsx      # Reusable empty state
├── account-item-sheet.tsx       # Base sheet for mobile details
└── account-action-button.tsx    # Primary action button pattern
```

---

## 📝 Notes

### Do NOT:
- Use mock data or demo content
- Add unnecessary animations
- Over-engineer with complex state management
- Create unnecessary abstraction layers
- Use inline styles (use Tailwind utilities)
- Use `bg-[#hexcode]` when semantic tokens exist
- Mix HSL colors with your OKLCH theme
- Use deprecated `bg-[--var]` syntax (use `bg-(--var)` in v4)

### DO:
- Fetch real data from Supabase
- Use server components where possible
- Keep client components minimal
- Use shadcn components as-is (don't over-customize)
- Follow established patterns from Dashboard/Orders
- Test on mobile first
- Use semantic color tokens (`bg-background`, `text-foreground`, `bg-card`)
- Use Tailwind color scale for section accents (`blue-600`, `pink-50`, etc.)
- Include dark mode classes (`dark:bg-*`, `dark:text-*`)
- Use `@container` queries for responsive cards

### shadcn Components to Use:
- **Card** with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardAction`
- **Badge** with `variant="outline"` for status indicators
- **Button** (default, outline, ghost variants)
- **Tabs** with `TabsList`, `TabsTrigger` (rounded-full style)
- **Sheet** for mobile detail views
- **Dialog** for modals (addresses, payments)
- **Input** with icon prefix pattern
- **Separator** for visual breaks
- **ScrollArea** for scrollable lists
- **Skeleton** for loading states

### Tailwind v4 Utilities to Prefer:
- `size-*` instead of `w-* h-*` for square elements
- `gap-*` instead of margin for spacing
- `@container` queries for responsive
- `tabular-nums` for numbers
- `truncate` for text overflow
- `shrink-0` for flex items
- `min-w-0` for flex overflow

---

## ⚠️ Technical Debt Found (Fix Before Standardizing)

During verification, found hardcoded hex colors that should use theme tokens:

### Files with Hardcoded Colors:
1. **conversation-list.tsx** - Uses `bg-[#F7F8F8]`, `bg-[#067D68]`, `bg-[#FEF9E7]`
2. **chat-interface.tsx** - Uses `bg-[#f4f4f4]`, `bg-[#067D68]`
3. **product-page-content-new.tsx** - Uses `bg-[#f7f7f7]`

### Recommended Replacements:
```tsx
// Before ❌
className="bg-[#f7f7f7]"
className="bg-[#067D68]"  // Teal/green
className="bg-[#FEF9E7]"  // Yellow highlight

// After ✅
className="bg-muted"
className="bg-teal-600 dark:bg-teal-500"  // Or --color-success if semantic
className="bg-amber-50 dark:bg-amber-950/30"
```

### Why This Matters:
- Hardcoded colors break dark mode
- OKLCH theme colors look different than hex
- No consistency across the app
- Harder to maintain

---

## 🚀 Ready to Implement

This plan provides a clear roadmap to standardize all account pages. Each page transformation follows the same pattern:

1. Convert to server component (if not already)
2. Add stats cards with mobile/desktop variants
3. Add toolbar with tabs (if applicable)
4. Implement responsive grid with Sheet details
5. Ensure consistent empty states
6. Remove demo data, use Supabase

Start with **Wishlist** as it's the most visible and straightforward transformation.

---

## 🔧 Appendix: Your Theme Tokens Reference

### Semantic Colors (from globals.css)
```css
/* Core */
--color-background     /* Page background */
--color-foreground     /* Main text */
--color-card           /* Card backgrounds */
--color-muted          /* Muted backgrounds */
--color-muted-foreground /* Secondary text */
--color-border         /* Borders */
--color-ring           /* Focus rings */

/* Interactive */
--color-primary        /* Primary actions */
--color-secondary      /* Secondary actions */
--color-destructive    /* Danger actions */

/* Semantic */
--color-success        /* Green - success states */
--color-warning        /* Yellow - warnings */
--color-error          /* Red - errors */
--color-info           /* Blue - info */

/* Sidebar */
--color-sidebar
--color-sidebar-foreground
--color-sidebar-primary
--color-sidebar-accent
--color-sidebar-border

/* Charts */
--color-chart-1 through --color-chart-5
```

### Spacing Tokens
```css
--spacing-touch: 2.75rem;      /* 44px - WCAG minimum */
--spacing-touch-lg: 3rem;      /* 48px */
--spacing-form: 1rem;          /* Form gaps */
--spacing-section: 1.5rem;     /* Section padding */
```

### Radius Tokens
```css
--radius-sm: 0.125rem;  /* Subtle */
--radius-md: 0.25rem;   /* Default */
--radius-lg: 0.375rem;  /* Cards */
--radius-xl: 0.5rem;    /* Modals */
--radius-full: 9999px;  /* Pills/badges */
```

### Shadow Tokens
```css
--shadow-sm   /* Cards */
--shadow-md   /* Elevated cards */
--shadow-dropdown /* Dropdowns */
--shadow-modal    /* Modals */
```
