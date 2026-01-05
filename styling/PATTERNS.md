# Approved Styling Patterns

> Copy-paste these patterns. Don't invent new ones.

These examples are from well-styled components in the codebase.
When building new features, find the closest pattern and adapt it.

---

## 1. Product Card (Hero Pattern)

**Source**: `components/shared/product/product-card.tsx`

```tsx
// Container - flat, border on hover (desktop only)
<article
  className={cn(
    "tap-transparent group relative block h-full min-w-0 cursor-pointer overflow-hidden",
    "bg-transparent",
    "focus-within:ring-2 focus-within:ring-ring/40",
    "lg:rounded-md lg:border lg:border-transparent lg:bg-card",
    "lg:transition-[border-color,box-shadow] lg:duration-100",
    "lg:hover:border-border lg:hover:shadow-sm"
  )}
>
  {/* Image with aspect ratio */}
  <AspectRatio ratio={3/4} className="relative overflow-hidden bg-muted">
    <Image
      src={image}
      alt={title}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
    />
  </AspectRatio>

  {/* Content stack */}
  <div className="flex flex-col gap-1 p-0 pt-2 lg:p-2">
    <h3 className="text-sm font-medium line-clamp-2 text-foreground">
      {title}
    </h3>
    <p className="text-base font-semibold text-foreground">
      ${price}
    </p>
    <p className="text-xs text-muted-foreground line-clamp-1">
      {seller}
    </p>
  </div>
</article>
```

---

## 2. Product Grid

**Source**: `components/sections/tabbed-product-feed.tsx`

```tsx
// Responsive grid: 2 cols mobile → 6 cols wide desktop
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8">
  {products.map((product, index) => (
    <ProductCard key={product.id} {...product} index={index} />
  ))}
</div>
```

---

## 3. Section Header

```tsx
// Section with title and "See all" link
<div className="flex items-center justify-between mb-4">
  <h2 className="text-lg font-semibold text-foreground">
    {title}
  </h2>
  <Link 
    href={href}
    className="text-sm font-medium text-primary hover:underline"
  >
    See all
  </Link>
</div>
```

---

## 4. Trust Bar

**Source**: `components/shared/trust-bar.tsx`

```tsx
<section className="w-full bg-muted/30 border border-border/50 rounded-md">
  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-3">
    {items.map((item) => (
      <div
        key={item.text}
        className="shrink-0 flex items-center gap-2 min-h-9 px-2 rounded-sm bg-background/60"
      >
        <Icon size={16} weight="bold" className="text-foreground/80" />
        <span className="text-xs font-medium text-foreground/90 whitespace-nowrap">
          {item.text}
        </span>
      </div>
    ))}
  </div>
</section>
```

---

## 5. Hero Banner (CTA Section)

**Source**: `components/desktop/marketplace-hero.tsx`

```tsx
<div className="w-full overflow-hidden rounded-md bg-cta-trust-blue shadow-sm">
  <div className="px-6 py-5 lg:px-8 lg:py-6">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
      
      {/* Content side */}
      <div className="text-center lg:text-left max-w-2xl">
        {/* Badge pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white mb-3 border border-white/20">
          <Icon className="size-3.5" />
          <span>10,000+ users</span>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-2">
          Headline Text
        </h1>

        <p className="text-sm lg:text-base text-white/90 font-normal">
          Supporting description text.
        </p>
      </div>

      {/* Buttons side */}
      <div className="flex flex-wrap justify-center gap-3 shrink-0">
        <Button size="lg" className="bg-white text-cta-trust-blue hover:bg-white/90">
          Primary CTA
        </Button>
        <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/15">
          Secondary CTA
        </Button>
      </div>

    </div>
  </div>
</div>
```

---

## 6. Tabs Navigation

**Source**: `components/sections/tabbed-product-feed.tsx`

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList className="h-auto w-max min-w-full justify-start gap-4 rounded-none border-0 border-b border-border/50 bg-transparent p-0 pb-1">
    {tabs.map((tab) => (
      <TabsTrigger
        key={tab.id}
        value={tab.id}
        className={cn(
          "relative h-touch-sm flex-none rounded-none border-none bg-transparent px-1 py-2",
          "text-sm md:text-base font-semibold",
          "text-muted-foreground hover:text-foreground",
          "data-[state=active]:bg-transparent data-[state=active]:text-foreground",
          // Underline indicator
          "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full",
          "after:bg-primary after:scale-x-0 after:transition-transform after:duration-100",
          "data-[state=active]:after:scale-x-100"
        )}
      >
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>

  <TabsContent value={activeTab} className="mt-0">
    {content}
  </TabsContent>
</Tabs>
```

---

## 7. Form Section

```tsx
<div className="space-y-4">
  {/* Section header */}
  <div className="border-b pb-3">
    <h3 className="text-sm font-semibold text-foreground">
      Section Title
    </h3>
    <p className="text-xs text-muted-foreground mt-1">
      Section description
    </p>
  </div>

  {/* Form fields */}
  <div className="space-y-3">
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">Label</Label>
      <Input placeholder="Placeholder" />
      <p className="text-xs text-muted-foreground">Helper text</p>
    </div>
  </div>
</div>
```

---

## 8. Badge Usage

**Source**: `components/ui/badge.tsx`

```tsx
// Condition badge (high contrast)
<Badge variant="condition">NEW</Badge>

// Deal badge (attention)
<Badge variant="deal">-25%</Badge>

// Shipping badge (subtle)
<Badge variant="shipping">Free Shipping</Badge>

// Stock status
<Badge variant="stock-low">Only 3 left</Badge>

// Info/category (neutral)
<Badge variant="info">Electronics</Badge>
```

---

## 9. Empty State

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
    <Icon className="size-6 text-muted-foreground" />
  </div>
  <h3 className="text-sm font-semibold text-foreground mb-1">
    No items found
  </h3>
  <p className="text-xs text-muted-foreground max-w-xs">
    Description text explaining what to do next.
  </p>
  <Button size="sm" className="mt-4">
    Action
  </Button>
</div>
```

---

## 10. Loading Skeleton

```tsx
// Card skeleton
<div className="space-y-3">
  <Skeleton className="aspect-square w-full rounded-md" />
  <div className="space-y-1.5">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
</div>

// Grid of skeletons
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {Array.from({ length: 8 }).map((_, i) => (
    <div key={i} className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-md" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  ))}
</div>
```

---

## 11. Icon Button

```tsx
// Standard icon button
<button
  className="size-8 flex items-center justify-center rounded-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
  aria-label="Add to wishlist"
>
  <Heart className="size-4" />
</button>

// Using Button component
<Button variant="ghost" size="icon-sm" aria-label="Settings">
  <Gear className="size-4" />
</Button>
```

---

## 12. Price Display

```tsx
// Regular price
<span className="text-base font-semibold text-foreground">
  ${price.toFixed(2)}
</span>

// Sale price with original
<div className="flex items-baseline gap-2">
  <span className="text-base font-semibold text-price-sale">
    ${salePrice.toFixed(2)}
  </span>
  <span className="text-xs text-muted-foreground line-through">
    ${originalPrice.toFixed(2)}
  </span>
</div>

// Discount percentage
<Badge variant="deal" className="text-2xs">
  -{discountPercent}%
</Badge>
```

---

## 13. Avatar with Seller Info

```tsx
<div className="flex items-center gap-2">
  <Avatar className="size-6">
    <AvatarImage src={avatarUrl} alt={sellerName} />
    <AvatarFallback className="text-2xs">
      {sellerName.charAt(0)}
    </AvatarFallback>
  </Avatar>
  <span className="text-xs text-muted-foreground">
    {sellerName}
  </span>
  {verified && (
    <SealCheck weight="fill" className="size-3.5 text-verified" />
  )}
</div>
```

---

## 14. Mobile vs Desktop Layout

```tsx
<main className="min-h-screen bg-background">
  {/* Mobile layout */}
  <div className="md:hidden">
    <MobileComponent />
  </div>

  {/* Desktop layout */}
  <div className="hidden md:block">
    <div className="container py-6">
      <DesktopComponent />
    </div>
  </div>
</main>
```

---

## 15. Scrollable Horizontal List

```tsx
<div className="overflow-x-auto no-scrollbar -mx-4 px-4">
  <div className="flex items-center gap-2 w-max">
    {items.map((item) => (
      <button
        key={item.id}
        className="shrink-0 px-3 py-1.5 rounded-full bg-secondary text-sm text-secondary-foreground hover:bg-secondary/80"
      >
        {item.label}
      </button>
    ))}
  </div>
</div>
```
