# Account Page Styling Guide - Revolut-Style Patterns

This guide documents the design patterns established for the `/account` pages following a modern Revolut/banking app style.

---

## 🎨 Design Tokens (globals.css)

Located in `app/globals.css`, these tokens provide consistent theming:

```css
/* Account Dashboard Tokens - Light Mode */
--color-account-hero-gradient-from: oklch(0.55 0.18 250);  /* Trust blue */
--color-account-hero-gradient-to: oklch(0.45 0.20 260);
--color-account-stat-bg: oklch(0.99 0.005 250);
--color-account-stat-border: oklch(0.92 0.01 250);
--color-account-stat-value: oklch(0.25 0.02 250);
--color-account-stat-label: oklch(0.55 0.02 250);
--color-account-stat-icon: oklch(0.50 0.15 250);
--color-account-card-hover: oklch(0.97 0.01 250);
--color-account-accent: oklch(0.55 0.18 250);
--color-account-accent-soft: oklch(0.95 0.04 250);
--color-account-success: oklch(0.55 0.15 155);
--color-account-success-soft: oklch(0.95 0.04 155);
--color-account-warning: oklch(0.65 0.18 85);
--color-account-warning-soft: oklch(0.95 0.05 85);
```

---

## 📱 Mobile-First Component Patterns

### 1. Stats Pills (Inline Summary)

Used at the top of pages to show key metrics in compact pill format.

```tsx
{/* Mobile: Revolut-style stats pills */}
<div className="flex items-center gap-3 text-sm sm:hidden">
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-account-stat-bg border border-account-stat-border">
    <IconPackage className="size-4 text-account-accent" />
    <span className="font-semibold">{count}</span>
    <span className="text-muted-foreground">label</span>
  </div>
  {/* Active/pending indicator with pulse animation */}
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 dark:bg-orange-950/30 dark:border-orange-800">
    <span className="size-2 rounded-full bg-orange-500 animate-pulse" />
    <span className="font-semibold text-orange-600 dark:text-orange-400">{activeCount}</span>
    <span className="text-orange-600/70 dark:text-orange-400/70">active</span>
  </div>
</div>
```

**Color Variations:**
- Default: `bg-account-stat-bg border-account-stat-border`
- Pink (wishlist): `bg-pink-50 border-pink-200 dark:bg-pink-950/30 dark:border-pink-800`
- Green (success): `bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800`
- Orange (warning): `bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800`

---

### 2. Horizontal Scroll Cards (Mobile)

For lists of items (orders, products, wishlist), use horizontal scrolling cards on mobile.

```tsx
{/* Mobile: Horizontal scroll cards */}
<div className="md:hidden -mx-4 px-4 overflow-x-auto no-scrollbar">
  <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
    {items.map((item) => (
      <div className="flex flex-col w-[140px] rounded-2xl bg-account-stat-bg border border-account-stat-border p-3 transition-all active:scale-[0.98]">
        {/* Square image with gradient background */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10 mb-3">
          <Image src={item.image} alt="" fill className="object-cover" sizes="140px" />
          {/* Badge overlay (top-right) */}
          <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white">
            +{count}
          </div>
        </div>
        {/* Title */}
        <p className="text-sm font-semibold text-foreground mb-1 line-clamp-2 leading-tight">
          {item.title}
        </p>
        {/* Price */}
        <p className="text-sm font-bold text-account-success mt-auto">
          {formatCurrency(item.price)}
        </p>
      </div>
    ))}
  </div>
</div>
```

**Gradient Variations for Image Backgrounds:**
- Blue (orders): `from-blue-500/10 to-blue-600/10`
- Violet (products): `from-violet-500/10 to-purple-600/10`
- Pink (wishlist): `from-pink-500/10 to-rose-600/10`
- Emerald (sales): `from-emerald-500/10 to-green-600/10`

---

### 3. List Cards (Desktop & Alternative Mobile)

For tappable list items that open detail sheets.

```tsx
<button className="w-full text-left rounded-2xl bg-account-stat-bg border border-account-stat-border p-4 transition-all active:scale-[0.99]">
  {/* Header: Price + Date */}
  <div className="flex items-center justify-between mb-3">
    <p className="text-lg font-bold text-foreground tabular-nums">
      {formatCurrency(total)}
    </p>
    <span className="text-xs text-muted-foreground">
      {timeAgo}
    </span>
  </div>

  {/* Product Images Row */}
  <div className="flex items-center gap-2 mb-3">
    {images.map((img) => (
      <div className="relative size-14 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10 shrink-0">
        <Image src={img} alt="" fill className="object-cover" sizes="56px" />
      </div>
    ))}
    {remainingCount > 0 && (
      <div className="flex size-14 items-center justify-center rounded-xl bg-muted/50 text-sm font-medium text-muted-foreground">
        +{remainingCount}
      </div>
    )}
  </div>

  {/* Footer: Status + Link */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={statusColorClass}>
        {statusText}
      </Badge>
      <span className="text-xs text-muted-foreground">{itemCount} items</span>
    </div>
    <div className="flex items-center gap-1 text-xs font-medium text-account-accent">
      <span>View</span>
      <IconChevronRight className="size-3.5" />
    </div>
  </div>
</button>
```

---

### 4. Section Headers

Minimal section headers with "See all" link.

```tsx
<div className="flex items-center justify-between px-1 mb-3">
  <span className="font-semibold text-base text-foreground">{title}</span>
  <Link 
    href={href} 
    className="text-xs font-medium text-account-accent hover:text-account-accent/80 transition-colors flex items-center gap-0.5"
  >
    See all
    <IconChevronRight className="size-3.5" />
  </Link>
</div>
```

---

### 5. Hero Card (Dashboard Only)

Gradient hero card with greeting and revenue display.

```tsx
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-account-hero-gradient-from to-account-hero-gradient-to p-5 text-white">
  {/* Decorative circles */}
  <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10" />
  <div className="absolute -bottom-20 -left-10 size-60 rounded-full bg-white/5" />
  
  <div className="relative z-10">
    {/* Greeting */}
    <div className="flex items-center gap-2 mb-3">
      <IconSun className="size-5 text-white/90" />
      <span className="text-white/90 font-medium">Good evening</span>
    </div>
    
    {/* Revenue */}
    <p className="text-white/70 text-sm">Total Revenue</p>
    <p className="text-3xl font-bold tracking-tight">{formatCurrency(revenue)}</p>
    
    {/* Stats row */}
    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20">
      <div>
        <p className="text-xl font-bold">{pendingCount}</p>
        <p className="text-xs text-white/70">Pending</p>
      </div>
      {/* ... more stats */}
    </div>
  </div>
</div>
```

---

### 6. Quick Action Buttons (Dashboard)

Circular action buttons on mobile, pill buttons on desktop.

```tsx
{/* Mobile: Grid of circular buttons */}
<div className="grid grid-cols-5 gap-3 md:hidden">
  <Link href="/account/orders" className="flex flex-col items-center gap-1.5">
    <div className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
      <IconPackage className="size-6 text-white" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-blue-600 shadow-sm">
          {count}
        </span>
      )}
    </div>
    <span className="text-xs font-medium text-foreground">Orders</span>
  </Link>
</div>

{/* Desktop: Horizontal pill buttons */}
<div className="hidden md:flex flex-wrap gap-2">
  <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-account-stat-bg border border-account-stat-border hover:bg-account-card-hover transition-colors">
    <IconPackage className="size-5 text-blue-500" />
    <span className="font-medium">Orders</span>
    {count > 0 && <span className="text-xs text-muted-foreground">{count}</span>}
    <IconChevronRight className="size-4 text-muted-foreground" />
  </Link>
</div>
```

---

## 🎯 Status Badge Colors

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-account-success-soft text-account-success border-transparent'
    case 'pending':
      return 'bg-account-warning-soft text-account-warning border-transparent'
    case 'processing':
      return 'bg-account-accent-soft text-account-accent border-transparent'
    case 'shipped':
      return 'bg-purple-50 text-purple-600 border-transparent dark:bg-purple-950/30 dark:text-purple-400'
    case 'delivered':
      return 'bg-account-success-soft text-account-success border-transparent'
    case 'cancelled':
      return 'bg-red-50 text-red-600 border-transparent dark:bg-red-950/30 dark:text-red-400'
    default:
      return 'bg-muted text-muted-foreground border-transparent'
  }
}
```

---

## 📐 Key Styling Rules

1. **Border Radius**: Use `rounded-2xl` for cards, `rounded-xl` for images, `rounded-full` for pills/buttons
2. **Spacing**: `gap-3` between cards, `p-3` or `p-4` for card padding, `mb-3` between sections
3. **Image Sizes**: `size-14` (56px) for thumbnails in lists, `aspect-square` for card images
4. **Typography**: 
   - Prices: `text-lg font-bold` or `text-sm font-bold`
   - Labels: `text-xs text-muted-foreground`
   - Titles: `text-sm font-semibold`
5. **Transitions**: `transition-all active:scale-[0.98]` for tappable cards
6. **Scrollbar**: Use `no-scrollbar` class for horizontal scroll containers

---

## 📄 Pages to Update

Apply these patterns to remaining account pages:

- [ ] `/account/selling` - Product listings (use horizontal cards + list view)
- [ ] `/account/sales` - Sales history (similar to orders)
- [ ] `/account/messages` - Chat list (list cards with avatars)
- [ ] `/account/addresses` - Address cards (list cards)
- [ ] `/account/payments` - Payment methods (list cards)
- [ ] `/account/billing` - Billing history (similar to orders)
- [ ] `/account/security` - Settings list (simple list items)
- [ ] `/account/plans` - Subscription plans (feature cards)

---

## 🔗 Reference Components

- `components/account-hero-card.tsx` - Hero gradient card
- `components/account-stats-cards.tsx` - Quick action buttons
- `components/account-recent-activity.tsx` - Horizontal scroll + list patterns
- `components/account-orders-grid.tsx` - Order cards with images
- `components/account-orders-stats.tsx` - Stats pills
- `components/account-wishlist-grid.tsx` - Wishlist cards
- `components/account-wishlist-stats.tsx` - Stats pills (pink variant)
