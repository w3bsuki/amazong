# Desktop Design System — Dense C2C/B2B Marketplace

> **Last Updated:** 2025-12-29  
> **Tech Stack:** shadcn/ui + Tailwind CSS v4 + OKLCH  
> **Target:** eBay/Temu-Style Dense Marketplace  
> **WCAG Level:** AA

---

## Table of Contents

1. [Philosophy & Vision](#1-philosophy--vision)
2. [Layout Grid System](#2-layout-grid-system)
3. [Typography](#3-typography)
4. [Spacing Strategy](#4-spacing-strategy)
5. [Color System (OKLCH)](#5-color-system-oklch)
6. [Component Library](#6-component-library)
7. [Navigation & Header](#7-navigation--header)
8. [Product Grids & Cards](#8-product-grids--cards)
9. [Forms & Inputs](#9-forms--inputs)
10. [Tables & Data](#10-tables--data)
11. [Keyboard & Focus](#11-keyboard--focus)
12. [Responsive Breakpoints](#12-responsive-breakpoints)

---

## 1. Philosophy & Vision

### Design DNA

```
┌────────────────────────────────────────────────────────────────────┐
│  DESKTOP MARKETPLACE PHILOSOPHY                                    │
│                                                                    │
│  "Every pixel earns its place."                                    │
│                                                                    │
│  • DENSE: Maximum information per viewport (eBay/Temu density)     │
│  • PROFESSIONAL: Clean, trustworthy, B2B-appropriate               │
│  • FLAT: Minimal shadows, no gradients, sharp corners              │
│  • SCANNABLE: Clear hierarchy, price-forward                       │
│  • EFFICIENT: Keyboard-navigable, batch actions                    │
└────────────────────────────────────────────────────────────────────┘
```

### Reference Analysis

| Platform | Density | Style | Grid | We Adopt |
|----------|---------|-------|------|----------|
| **eBay** | High | Flat, minimal shadows | 4-5 col | Grid density, header style |
| **Temu** | Ultra-high | Colorful, deal-focused | 5-6 col | Product card density |
| **Amazon** | Medium | Clean, white space | 4 col | Trust signals, reviews |
| **Alibaba** | High | Professional B2B | 4 col | Seller info, bulk UI |

### Key Metrics

- **Viewport utilization:** 85%+ (minimize white space)
- **Products visible:** 12-20 per viewport on 1920px
- **Interaction distance:** < 300px mouse travel for common actions
- **Load time:** < 200ms perceived for interactions

---

## 2. Layout Grid System

### Container Widths

```css
/* In globals.css @theme */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1440px;
--container-3xl: 1600px;
--container-full: 1920px;

/* Content max-width */
--container-content: 1440px;  /* Main content area */
--container-header: 100%;     /* Header spans full width */
```

### Grid Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│  HEADER (full width, h-14)                                               │
├─────────────────┬────────────────────────────────────────────────────────┤
│                 │                                                        │
│  SIDEBAR        │  MAIN CONTENT AREA                                     │
│  w-60 (240px)   │  flex-1 (fluid)                                        │
│  or w-64 (256px)│                                                        │
│                 │  ┌──────┬──────┬──────┬──────┬──────┐                  │
│  - Categories   │  │      │      │      │      │      │                  │
│  - Filters      │  │ Card │ Card │ Card │ Card │ Card │  5-column grid   │
│  - Quick links  │  │      │      │      │      │      │                  │
│                 │  └──────┴──────┴──────┴──────┴──────┘                  │
│                 │                                                        │
└─────────────────┴────────────────────────────────────────────────────────┘
```

### Product Grid Columns

| Viewport | Columns | Card Width | Gap |
|----------|---------|------------|-----|
| 1024px | 4 | ~220px | 12px |
| 1280px | 5 | ~220px | 16px |
| 1440px | 5 | ~250px | 16px |
| 1920px | 6 | ~280px | 16px |

```tsx
// Responsive product grid
<div className="grid grid-cols-4 gap-3 lg:grid-cols-5 xl:gap-4 2xl:grid-cols-6">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

---

## 3. Typography

### Type Scale (Desktop-Optimized)

```css
/* Desktop prioritizes scannability */
--font-size-2xs: 0.625rem;     /* 10px - Badges, meta */
--font-size-xs: 0.75rem;       /* 12px - Secondary info */
--font-size-sm: 0.875rem;      /* 14px - Body text, standard */
--font-size-base: 1rem;        /* 16px - Emphasis, prices */
--font-size-lg: 1.125rem;      /* 18px - Card titles */
--font-size-xl: 1.25rem;       /* 20px - Section headers */
--font-size-2xl: 1.5rem;       /* 24px - Page titles */
--font-size-3xl: 1.875rem;     /* 30px - Hero text */
```

### Line Heights (Tight for Density)

| Size | Line Height | Usage |
|------|-------------|-------|
| 10px | 14px (1.4) | Badges |
| 12px | 16px (1.33) | Meta text |
| 14px | 18px (1.29) | Dense body |
| 16px | 22px (1.375) | Standard body |
| 18px+ | 1.25-1.3 | Headings |

### Font Weight Strategy

```tsx
// Product card typography
<article className="space-y-1">
  <h3 className="text-sm font-normal leading-tight line-clamp-2">
    {product.name}
  </h3>
  <p className="text-base font-semibold text-price-sale">
    ${product.price}
  </p>
  <p className="text-xs text-muted-foreground">
    {product.seller} • {product.sales} sold
  </p>
</article>
```

---

## 4. Spacing Strategy

### The 4px Baseline

All spacing is multiples of 4px:

```css
/* Spacing tokens */
--spacing-px: 1px;       /* Borders */
--spacing-0.5: 2px;      /* Micro */
--spacing-1: 4px;        /* Tight */
--spacing-1.5: 6px;      /* Dense */
--spacing-2: 8px;        /* Standard tight */
--spacing-3: 12px;       /* Standard */
--spacing-4: 16px;       /* Default gap */
--spacing-5: 20px;       /* Section */
--spacing-6: 24px;       /* Large section */
--spacing-8: 32px;       /* Page section */
```

### Component Spacing

```
┌────────────────────────────────────────────────────────────┐
│  PRODUCT CARD ANATOMY (Dense)                              │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  IMAGE (aspect-[4/5] or aspect-square)               │  │
│  │                                                      │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  │← p-2 (8px) padding                                      │
│  │                                                         │
│  │  Product Title Line 1                   ← text-sm       │
│  │  Product Title Line 2                   ← line-clamp-2  │
│  │  ↕ space-y-1 (4px)                                      │
│  │  $29.99  $49.99                         ← prices        │
│  │  ↕ space-y-0.5 (2px)                                    │
│  │  ★★★★☆ (234)                            ← rating        │
│  │                                                         │
│  └─────────────────────────────────────────────────────────┘
│
│  Grid gap: gap-3 (12px) or gap-4 (16px)
└────────────────────────────────────────────────────────────┘
```

### Dense vs. Comfortable Modes

```tsx
// Density toggle (user preference)
const densityClasses = {
  compact: {
    grid: "grid-cols-6 gap-2",
    card: "p-1.5",
    text: "text-xs",
  },
  default: {
    grid: "grid-cols-5 gap-3",
    card: "p-2",
    text: "text-sm",
  },
  comfortable: {
    grid: "grid-cols-4 gap-4",
    card: "p-3",
    text: "text-sm",
  },
};
```

---

## 5. Color System (OKLCH)

### Brand Colors

```css
/* Primary brand */
--color-brand: oklch(0.48 0.22 260);           /* Trust blue */
--color-brand-light: oklch(0.58 0.18 260);     /* Hover states */
--color-brand-dark: oklch(0.40 0.24 260);      /* Active states */
--color-brand-muted: oklch(0.96 0.04 260);     /* Backgrounds */
```

### Semantic Colors

```css
/* Prices - High contrast for scanning */
--color-price-regular: oklch(0.15 0.01 250);   /* Near black */
--color-price-sale: oklch(0.50 0.22 27);       /* Warm red */
--color-price-original: oklch(0.55 0.01 250);  /* Gray strikethrough */
--color-price-savings: oklch(0.50 0.18 145);   /* Green */

/* Trust signals */
--color-verified: oklch(0.55 0.18 250);        /* Blue checkmark */
--color-top-rated: oklch(0.75 0.18 65);        /* Gold/amber */
--color-rating: oklch(0.78 0.18 90);           /* Yellow stars */

/* Stock status */
--color-stock-available: oklch(0.60 0.18 145);
--color-stock-low: oklch(0.70 0.18 65);
--color-stock-out: oklch(0.50 0.20 27);

/* Deals & Promotions */
--color-deal: oklch(0.55 0.25 27);
--color-deal-light: oklch(0.96 0.03 27);
```

### Surface Hierarchy

```css
/* Background layers (subtle differentiation) */
--color-background: oklch(0.985 0 0);          /* Page bg */
--color-surface-card: oklch(1 0 0);            /* Cards */
--color-surface-elevated: oklch(1 0 0);        /* Dropdowns, modals */
--color-surface-muted: oklch(0.97 0 0);        /* Alternate rows */

/* Borders */
--color-border: oklch(0.90 0 0);               /* Standard */
--color-border-subtle: oklch(0.94 0 0);        /* Subtle dividers */
--color-border-strong: oklch(0.80 0 0);        /* Emphasis */
```

### Contrast Guidelines

| Element | Requirement | Our Implementation |
|---------|-------------|-------------------|
| Body text | 4.5:1 | 12:1 (oklch 0.12 on white) |
| Secondary text | 4.5:1 | 5:1 (oklch 0.45 on white) |
| Prices | 4.5:1 | 8:1 (sale red on white) |
| Icons | 3:1 | 5:1+ |
| Focus ring | 3:1 | 4:1 |

---

## 6. Component Library

### Buttons

```tsx
// Button size system (desktop)
const buttonSizes = {
  xs: "h-7 px-2 text-xs",        // 28px - Inline actions
  sm: "h-8 px-3 text-xs",        // 32px - Secondary
  default: "h-9 px-4 text-sm",   // 36px - Standard
  lg: "h-10 px-5 text-sm",       // 40px - Primary CTA
};

// Usage
<Button size="sm" variant="outline">Add to Cart</Button>
<Button size="default">Buy Now</Button>
<Button size="lg" className="w-full">Checkout</Button>
```

### Badges

```tsx
// Compact badges for dense UIs
const Badge = ({ variant, children }) => (
  <span className={cn(
    "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium",
    variants[variant]
  )}>
    {children}
  </span>
);

// Variants
const variants = {
  deal: "bg-deal text-white",
  shipping: "bg-shipping-free/10 text-shipping-free",
  verified: "bg-brand-muted text-brand",
  stock: "bg-stock-low/10 text-stock-low",
};
```

### Dropdowns & Menus

```tsx
// Dense dropdown menu
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      Sort by <ChevronDown className="ml-1 size-3" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-48">
    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
      Sort Options
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    {sortOptions.map(option => (
      <DropdownMenuItem 
        key={option.value}
        className="text-sm py-1.5" // Tight padding
      >
        {option.label}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
```

### Tooltips

```tsx
// Information tooltips
<TooltipProvider delayDuration={200}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" className="size-6">
        <Info className="size-3.5" />
      </Button>
    </TooltipTrigger>
    <TooltipContent className="max-w-xs text-xs">
      Free shipping on orders over $50
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 7. Navigation & Header

### Header Structure

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Logo   │  Search [________________________] [🔍]  │  Cart │ Sign In │ ☰  │
├─────────┴────────────────────────────────────────────────────────────────┬─┤
│  All Categories ▾ │ Deals │ Electronics │ Fashion │ Home │ Sports │ ...  │ │
└──────────────────────────────────────────────────────────────────────────┴─┘
```

```tsx
// Header component
<header className="sticky top-0 z-50 border-b bg-brand">
  {/* Top bar - h-14 */}
  <div className="h-14 px-4">
    <div className="mx-auto flex h-full max-w-[1920px] items-center gap-4">
      {/* Logo */}
      <Link href="/" className="shrink-0">
        <Logo className="h-8" />
      </Link>
      
      {/* Search - flex-1 */}
      <div className="flex-1 max-w-2xl">
        <SearchBar />
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        <CartButton />
        <UserMenu />
      </div>
    </div>
  </div>
  
  {/* Category nav - h-10 */}
  <nav className="h-10 bg-brand-dark">
    <div className="mx-auto flex h-full max-w-[1920px] items-center gap-6 px-4">
      <CategoryDropdown />
      {navLinks.map(link => (
        <Link 
          key={link.href}
          href={link.href}
          className="text-sm text-white/90 hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </div>
  </nav>
</header>
```

### Mega Menu

```tsx
// eBay-style mega menu
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger className="h-8 text-sm">
        All Categories
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[800px] grid-cols-4 gap-4 p-4">
          {categories.map(category => (
            <div key={category.id}>
              <h3 className="mb-2 text-sm font-semibold">
                {category.name}
              </h3>
              <ul className="space-y-1">
                {category.subcategories.map(sub => (
                  <li key={sub.id}>
                    <Link 
                      href={sub.href}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Sidebar Filters

```tsx
// Collapsible filter sidebar
<aside className="w-60 shrink-0 border-r bg-background">
  <div className="sticky top-14 h-[calc(100vh-56px)] overflow-y-auto p-4">
    {/* Category tree */}
    <Accordion type="multiple" defaultValue={["category", "price"]}>
      <AccordionItem value="category">
        <AccordionTrigger className="text-sm font-medium">
          Category
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1 pt-1">
            {categories.map(cat => (
              <label 
                key={cat.id}
                className="flex cursor-pointer items-center gap-2 py-1"
              >
                <Checkbox id={cat.id} />
                <span className="text-sm">{cat.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  ({cat.count})
                </span>
              </label>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="price">
        <AccordionTrigger className="text-sm font-medium">
          Price
        </AccordionTrigger>
        <AccordionContent>
          <PriceRangeSlider />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</aside>
```

---

## 8. Product Grids & Cards

### Standard Product Card

```tsx
// Dense product card (eBay-style)
<article className="group relative rounded border border-border bg-card transition-shadow hover:shadow-md">
  {/* Image container */}
  <div className="relative aspect-square overflow-hidden rounded-t">
    <Image
      src={product.image}
      alt={product.name}
      fill
      className="object-cover transition-transform group-hover:scale-105"
    />
    
    {/* Badges */}
    <div className="absolute left-1.5 top-1.5 flex flex-col gap-1">
      {product.discount && (
        <Badge variant="deal">-{product.discount}%</Badge>
      )}
      {product.freeShipping && (
        <Badge variant="shipping">Free Ship</Badge>
      )}
    </div>
    
    {/* Quick actions (show on hover) */}
    <div className="absolute right-1.5 top-1.5 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      <Button size="icon" variant="secondary" className="size-8">
        <Heart className="size-4" />
      </Button>
      <Button size="icon" variant="secondary" className="size-8">
        <Eye className="size-4" />
      </Button>
    </div>
  </div>
  
  {/* Content */}
  <div className="p-2 space-y-1">
    {/* Title */}
    <h3 className="text-sm leading-tight line-clamp-2 group-hover:text-brand">
      {product.name}
    </h3>
    
    {/* Price */}
    <div className="flex items-baseline gap-1.5">
      <span className="text-base font-semibold text-price-sale">
        ${product.salePrice}
      </span>
      {product.originalPrice && (
        <span className="text-xs text-price-original line-through">
          ${product.originalPrice}
        </span>
      )}
    </div>
    
    {/* Meta */}
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Star className="size-3 fill-rating text-rating" />
        <span>{product.rating}</span>
        <span>({product.reviews})</span>
      </div>
      <span>{product.sales} sold</span>
    </div>
    
    {/* Seller (optional) */}
    {product.seller && (
      <div className="flex items-center gap-1 pt-1 border-t">
        <span className="text-xs text-muted-foreground truncate">
          {product.seller}
        </span>
        {product.topRated && (
          <Badge variant="verified" className="shrink-0">Top</Badge>
        )}
      </div>
    )}
  </div>
</article>
```

### List View Card

```tsx
// Horizontal list view for comparison
<article className="flex gap-4 rounded border p-3 hover:shadow-sm">
  {/* Image */}
  <div className="relative size-32 shrink-0 overflow-hidden rounded">
    <Image src={product.image} alt={product.name} fill />
  </div>
  
  {/* Content */}
  <div className="flex-1 min-w-0">
    <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
      {product.description}
    </p>
    <div className="flex items-center gap-2 mt-2">
      <Star className="size-3 fill-rating text-rating" />
      <span className="text-xs">{product.rating} ({product.reviews})</span>
    </div>
  </div>
  
  {/* Price & Actions */}
  <div className="shrink-0 text-right space-y-2">
    <div>
      <p className="text-lg font-semibold text-price-sale">
        ${product.salePrice}
      </p>
      <p className="text-xs text-price-original line-through">
        ${product.originalPrice}
      </p>
    </div>
    <Button size="sm">Add to Cart</Button>
  </div>
</article>
```

### Grid Controls

```tsx
// View mode & sort controls
<div className="flex items-center justify-between border-b pb-3">
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">
      {totalResults.toLocaleString()} results
    </span>
  </div>
  
  <div className="flex items-center gap-2">
    {/* View toggle */}
    <div className="flex rounded border">
      <Button 
        variant={view === 'grid' ? 'secondary' : 'ghost'} 
        size="icon"
        className="size-8 rounded-r-none"
        onClick={() => setView('grid')}
      >
        <Grid className="size-4" />
      </Button>
      <Button 
        variant={view === 'list' ? 'secondary' : 'ghost'} 
        size="icon"
        className="size-8 rounded-l-none border-l"
        onClick={() => setView('list')}
      >
        <List className="size-4" />
      </Button>
    </div>
    
    {/* Sort dropdown */}
    <Select value={sort} onValueChange={setSort}>
      <SelectTrigger className="h-8 w-40 text-sm">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relevance">Best Match</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="rating">Top Rated</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
```

---

## 9. Forms & Inputs

### Input Sizes

```tsx
// Desktop input sizes
const inputSizes = {
  sm: "h-8 text-sm px-2",    // 32px - Filters, search refinements
  default: "h-9 text-sm px-3", // 36px - Standard forms
  lg: "h-10 text-base px-4",  // 40px - Important inputs
};

// Form field
<div className="space-y-1.5">
  <Label htmlFor="email" className="text-sm font-medium">
    Email
  </Label>
  <Input
    id="email"
    type="email"
    autoComplete="email"
    className="h-9"
    placeholder="you@example.com"
  />
  <p className="text-xs text-muted-foreground">
    We'll never share your email.
  </p>
</div>
```

### Checkbox & Radio (Dense)

```tsx
// Compact checkbox group
<div className="space-y-2">
  <Label className="text-sm font-medium">Condition</Label>
  <div className="space-y-1">
    {conditions.map(condition => (
      <label 
        key={condition.id}
        className="flex cursor-pointer items-center gap-2"
      >
        <Checkbox id={condition.id} className="size-4" />
        <span className="text-sm">{condition.label}</span>
      </label>
    ))}
  </div>
</div>
```

### Search Input

```tsx
// Header search with category dropdown
<div className="flex h-10 overflow-hidden rounded border bg-white">
  {/* Category selector */}
  <Select>
    <SelectTrigger className="h-full w-32 rounded-none border-0 border-r bg-muted/50">
      <SelectValue placeholder="All" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Categories</SelectItem>
      {categories.map(cat => (
        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  
  {/* Search input */}
  <Input
    type="search"
    placeholder="Search for anything..."
    className="h-full flex-1 rounded-none border-0 focus-visible:ring-0"
  />
  
  {/* Search button */}
  <Button className="h-full rounded-none px-6">
    <Search className="size-5" />
  </Button>
</div>
```

---

## 10. Tables & Data

### Dense Data Table

```tsx
// Order history table (dense)
<Table>
  <TableHeader>
    <TableRow className="hover:bg-transparent">
      <TableHead className="h-9 text-xs">Order ID</TableHead>
      <TableHead className="h-9 text-xs">Date</TableHead>
      <TableHead className="h-9 text-xs">Items</TableHead>
      <TableHead className="h-9 text-xs text-right">Total</TableHead>
      <TableHead className="h-9 text-xs">Status</TableHead>
      <TableHead className="h-9 text-xs w-20"></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {orders.map(order => (
      <TableRow key={order.id} className="text-sm">
        <TableCell className="py-2 font-mono text-xs">
          #{order.id}
        </TableCell>
        <TableCell className="py-2 text-muted-foreground">
          {formatDate(order.date)}
        </TableCell>
        <TableCell className="py-2">{order.items} items</TableCell>
        <TableCell className="py-2 text-right font-medium">
          ${order.total}
        </TableCell>
        <TableCell className="py-2">
          <Badge variant={statusVariant[order.status]}>
            {order.status}
          </Badge>
        </TableCell>
        <TableCell className="py-2">
          <Button variant="ghost" size="sm" className="h-7">
            View
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Pagination

```tsx
// Compact pagination
<div className="flex items-center justify-between">
  <p className="text-sm text-muted-foreground">
    Showing {start}-{end} of {total} results
  </p>
  <div className="flex items-center gap-1">
    <Button variant="outline" size="icon" className="size-8" disabled={page === 1}>
      <ChevronLeft className="size-4" />
    </Button>
    {pageNumbers.map(num => (
      <Button
        key={num}
        variant={page === num ? "default" : "outline"}
        size="icon"
        className="size-8"
      >
        {num}
      </Button>
    ))}
    <Button variant="outline" size="icon" className="size-8" disabled={page === totalPages}>
      <ChevronRight className="size-4" />
    </Button>
  </div>
</div>
```

---

## 11. Keyboard & Focus

### Focus Management

```css
/* High-visibility focus ring */
:focus-visible {
  outline: none;
  box-shadow: 
    0 0 0 2px var(--color-background),
    0 0 0 4px var(--color-ring);
}

/* Skip links */
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 100;
  padding: 0.5rem 1rem;
  background: var(--color-brand);
  color: white;
}

.skip-link:focus {
  left: 0.5rem;
  top: 0.5rem;
}
```

### Keyboard Shortcuts

```tsx
// Global keyboard shortcuts
useHotkeys('/', () => focusSearch(), { preventDefault: true });
useHotkeys('?', () => openShortcutsModal());
useHotkeys('g h', () => router.push('/'));
useHotkeys('g c', () => router.push('/cart'));
useHotkeys('g o', () => router.push('/orders'));
```

### ARIA Patterns

```tsx
// Live region for dynamic updates
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {notification}
</div>

// Roving tabindex for toolbar
<div role="toolbar" aria-label="Sorting options">
  {options.map((option, i) => (
    <button
      key={option.id}
      tabIndex={activeIndex === i ? 0 : -1}
      aria-pressed={selected === option.id}
    >
      {option.label}
    </button>
  ))}
</div>
```

---

## 12. Responsive Breakpoints

### Breakpoint System

```css
/* Tailwind v4 breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1440px;
--breakpoint-3xl: 1600px;
--breakpoint-4xl: 1920px;
```

### Component Adaptations

| Component | < 1024px | 1024-1280px | 1280-1440px | > 1440px |
|-----------|----------|-------------|-------------|----------|
| Grid cols | 2-3 | 4 | 5 | 5-6 |
| Sidebar | Hidden (sheet) | 200px | 240px | 256px |
| Card padding | p-2 | p-2 | p-2.5 | p-3 |
| Header height | 48px | 56px | 56px | 56px |

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────────┐
│  DESKTOP DESIGN SYSTEM — QUICK REFERENCE                            │
├─────────────────────────────────────────────────────────────────────┤
│  LAYOUT                                                             │
│  • Max content width: 1440px                                        │
│  • Sidebar width: 240px (w-60)                                      │
│  • Header height: 56px (h-14)                                       │
│  • Grid gap: 12-16px (gap-3 to gap-4)                               │
├─────────────────────────────────────────────────────────────────────┤
│  TYPOGRAPHY                                                         │
│  • Body: 14px (text-sm)                                             │
│  • Price: 16px semibold (text-base font-semibold)                   │
│  • Card title: 14px (text-sm line-clamp-2)                          │
│  • Meta: 12px (text-xs text-muted-foreground)                       │
├─────────────────────────────────────────────────────────────────────┤
│  BUTTONS                                                            │
│  • Primary: h-9 (36px)                                              │
│  • Secondary: h-8 (32px)                                            │
│  • Icon: size-8 (32px)                                              │
├─────────────────────────────────────────────────────────────────────┤
│  INPUTS                                                             │
│  • Standard: h-9 (36px)                                             │
│  • Large (checkout): h-10 (40px)                                    │
│  • Filter inputs: h-8 (32px)                                        │
├─────────────────────────────────────────────────────────────────────┤
│  PRODUCT GRID                                                       │
│  • 1024px: 4 columns                                                │
│  • 1280px: 5 columns                                                │
│  • 1440px+: 5-6 columns                                             │
│  • Card: p-2, space-y-1, rounded border                             │
├─────────────────────────────────────────────────────────────────────┤
│  COLORS (oklch)                                                     │
│  • Brand: oklch(0.48 0.22 260)                                      │
│  • Sale price: oklch(0.50 0.22 27)                                  │
│  • Border: oklch(0.90 0 0)                                          │
│  • Muted text: oklch(0.45 0 0)                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

*This document governs all desktop UI decisions. For mobile, see MOBILE_DESIGN_SYSTEM.md.*
