# Product Quick View Modal & Drawer Audit

**Date:** January 27, 2026  
**Scope:** Desktop Modal + Mobile Drawer for Product Quick View  
**Priority:** HIGH — Core UX component for browsing experience

---

## Executive Summary

The product quick view system consists of:
1. **Desktop Modal** — Uses Next.js intercepting routes + `Dialog` from shadcn/ui
2. **Mobile Drawer** — Uses Vaul-based `Drawer` component from shadcn/ui

**Current State: BROKEN UX 🚨**

Both implementations have significant styling, accessibility, and UX issues that need immediate attention.

---

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [Issues Identified](#issues-identified)
3. [Desktop Modal Audit](#desktop-modal-audit)
4. [Mobile Drawer Audit](#mobile-drawer-audit)
5. [Improvement Plan](#improvement-plan)
6. [Implementation Checklist](#implementation-checklist)
7. [Design Specifications](#design-specifications)

---

## Current Architecture

### File Structure

```
Desktop Modal (Intercepting Route):
├── app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx  ← Modal page
├── app/[locale]/(main)/search/_components/product-route-modal.tsx           ← Modal wrapper
└── components/ui/dialog.tsx                                                   ← shadcn Dialog

Mobile Drawer (Client-side):
├── components/mobile/drawers/product-quick-view-drawer.tsx   ← Mobile drawer wrapper
├── components/shared/product/quick-view/                     ← Shared content
│   ├── product-quick-view-content.tsx                        ← Main content component
│   ├── quick-view-image-gallery.tsx                          ← Image carousel
│   ├── quick-view-seller-card.tsx                            ← Seller info
│   └── quick-view-skeleton.tsx                               ← Loading state
└── components/ui/drawer.tsx                                  ← shadcn Drawer (Vaul)
```

### Current Flow

```
Desktop:
  ProductCard click → router.push(intercepting route) → ProductRouteModal → Dialog

Mobile:  
  ProductCard click → DrawerContext.openProductQuickView() → ProductQuickViewDrawer → Drawer
```

---

## Issues Identified

### 🚨 Critical Issues

| ID | Component | Issue | Impact |
|----|-----------|-------|--------|
| C1 | Desktop Modal | **No visible close button** — X button is minuscule, top-right, barely visible | Users can't easily close, trapped feeling |
| C2 | Desktop Modal | **Max width too small** (`sm:max-w-4xl` = 896px) — doesn't feel like full product page | Cramped layout, poor image display |
| C3 | Desktop Modal | **Missing backdrop blur** — stark black overlay feels harsh | Poor visual hierarchy |
| C4 | Mobile Drawer | **Image takes 100% viewport width, aspect-square** — massive on modern phones | User must scroll 500px+ just to see price |
| C5 | Mobile Drawer | **No easy close affordance at top** — only drag handle + swipe | Ergonomically difficult one-handed |
| C6 | Both | **Content doesn't match real product page** — missing trust badges, full specs | Inconsistent experience |

### ⚠️ Major Issues

| ID | Component | Issue | Impact |
|----|-----------|-------|--------|
| M1 | Desktop Modal | **No transition animations** — Dialog pops in/out abruptly | Jarring UX |
| M2 | Desktop Modal | **Title is sr-only** — no visible product name in header | Poor context |
| M3 | Mobile Drawer | **No sticky header with close button** — header scrolls away | Lost navigation |
| M4 | Mobile Drawer | **Skeleton doesn't match content layout** — visible layout shift | Poor loading UX |
| M5 | Both | **No keyboard shortcuts** — Escape works but no clear indication | WCAG compliance |
| M6 | Both | **Price/title font sizes inconsistent with product page** | Visual disconnect |

### 💡 Enhancement Opportunities

| ID | Component | Enhancement |
|----|-----------|-------------|
| E1 | Desktop Modal | Add "View Full Page" CTA that's more prominent |
| E2 | Desktop Modal | Add image lightbox/zoom capability (PhotoSwipe like product page) |
| E3 | Mobile Drawer | Add snap points for half-screen/full-screen states |
| E4 | Mobile Drawer | Compact image gallery (horizontal thumbnails, smaller hero) |
| E5 | Both | Add recent purchases/views social proof |
| E6 | Both | Skeleton screen that matches actual layout perfectly |

---

## Desktop Modal Audit

### Current Implementation

**File:** `app/[locale]/(main)/search/_components/product-route-modal.tsx`

```tsx
// CURRENT CODE — Problems annotated
<Dialog open={open} onOpenChange={...}>
  <DialogContent className="sm:max-w-4xl">  // ❌ Too narrow for product modal
    <DialogTitle className="sr-only">{title}</DialogTitle>  // ❌ Hidden title
    {children}  // ❌ No structured header/footer
  </DialogContent>
</Dialog>
```

**File:** `components/ui/dialog.tsx`

```tsx
// DialogContent close button
<DialogPrimitive.Close
  className="... absolute top-3 right-3 rounded-xs opacity-70 ..."  // ❌ Low opacity, tiny
>
  <X />  // ❌ No size class, default too small
</DialogPrimitive.Close>
```

### Problems Analysis

1. **Close Button Visibility**
   - `opacity-70` makes it nearly invisible on light backgrounds
   - No background/ring to make it stand out
   - `rounded-xs` doesn't match design system (should be `rounded-full`)
   - Icon is 16px (default), should be 20-24px for touch target

2. **Modal Size & Responsiveness**
   - `sm:max-w-4xl` (896px) is too narrow for a product page experience
   - Should be `max-w-6xl` (1152px) or `max-w-7xl` (1280px)
   - No height constraint leads to scroll issues on small screens
   - Missing `max-h-[90dvh]` for scroll containment

3. **Overlay/Backdrop**
   - Current: `bg-overlay-dark` (50% opacity black/70% dark mode)
   - Missing `backdrop-blur-md` for modern frosted glass effect
   - Missing entrance/exit animations

4. **Content Structure**
   - No proper header with visible title + close button
   - No footer with CTA buttons
   - Content bleeds edge-to-edge without proper spacing

---

## Mobile Drawer Audit

### Current Implementation

**File:** `components/mobile/drawers/product-quick-view-drawer.tsx`

```tsx
<Drawer open={open} onOpenChange={onOpenChange}>
  <DrawerContent aria-label={t("quickView")} showHandle>
    <DrawerTitle className="sr-only">{title}</DrawerTitle>  // ❌ Hidden
    <DrawerDescription className="sr-only">{description}</DrawerDescription>
    <DrawerBody className="px-0">  // ❌ No padding, content bleeds
      <ProductQuickViewContent ... />
    </DrawerBody>
  </DrawerContent>
</Drawer>
```

**File:** `components/shared/product/quick-view/product-quick-view-content.tsx`

```tsx
<div className="md:grid md:grid-cols-[1.1fr_0.9fr] md:min-h-full">
  {/* Desktop grid - but this is used in mobile drawer too! */}
  <QuickViewImageGallery ... />  // ❌ aspect-square = HUGE on mobile
  
  <div className="flex flex-col">
    {/* Content */}
    <div className="px-4 py-4 space-y-4">  // ✅ Has padding
      {/* ... */}
    </div>
    
    {/* Actions */}
    <div className="border-t px-4 py-4 mt-auto bg-muted/30">  // ✅ Sticky-ish
      {/* Buttons */}
    </div>
  </div>
</div>
```

### Problems Analysis

1. **Image Gallery Size**
   - Uses `aspect-square` = 100% viewport width × equal height
   - On iPhone 14 Pro (393px width), image is 393×393px = 770px total before content
   - User must scroll ~400px just to see the price!
   - Should be smaller hero with horizontal thumbnails (like desktop V2)

2. **No Sticky Close Header**
   - Only affordance is the drag handle at top
   - Swipe-down is ergonomically challenging one-handed
   - Need a sticky header with X button like iOS native sheets

3. **Scroll Behavior**
   - `DrawerBody` uses `overflow-y-auto overscroll-contain`
   - But entire drawer scrolls, including the massive image
   - Should have fixed header + scrollable content area

4. **Missing Features vs Product Page**
   - No trust badges
   - No freshness indicator
   - No category breadcrumb styling
   - No social proof (views, favorites)
   - Limited specs display

5. **Close Affordances**
   - Drag handle (hard to reach on large phones)
   - Backdrop tap (works but not obvious)
   - Swipe down (ergonomically difficult)
   - **Missing:** Visible X button at top

---

## Improvement Plan

### Phase 1: Desktop Modal Overhaul

**Goal:** Make desktop modal feel like a proper product page overlay

#### 1.1 Update DialogContent Defaults

```tsx
// components/ui/dialog.tsx

function DialogContent({
  className,
  children,
  showCloseButton = true,
  closeLabel,
  variant = "default",  // NEW: "default" | "fullWidth"
  ...props
}: ... & { variant?: "default" | "fullWidth" }) {
  return (
    <DialogPortal>
      <DialogOverlay className="backdrop-blur-sm" />  // ✅ ADD blur
      <DialogPrimitive.Content
        className={cn(
          "bg-background fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
          "max-h-[90dvh] overflow-hidden rounded-xl border shadow-modal",  // ✅ Height constraint + shadow
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",  // ✅ Animations
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          variant === "fullWidth" ? "max-w-[calc(100%-3rem)] lg:max-w-6xl" : "max-w-dialog sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className={cn(
              "absolute top-4 right-4 z-10",
              "flex size-10 items-center justify-center rounded-full",
              "bg-muted/80 backdrop-blur-sm",  // ✅ Visible background
              "text-foreground hover:bg-muted",
              "transition-colors duration-150",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            aria-label={closeLabel ?? "Close"}
          >
            <X className="size-5" />  // ✅ Larger icon
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}
```

#### 1.2 Create Dedicated QuickViewDialog Component

```tsx
// components/shared/product/quick-view/quick-view-dialog.tsx

export function QuickViewDialog({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant="fullWidth"
        className="p-0 gap-0 overflow-y-auto"
        aria-label={title}
      >
        {/* Sticky header with title + close moved here for visibility */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 backdrop-blur-sm px-6 py-4">
          <DialogTitle className="text-lg font-semibold truncate pr-4">
            {title}
          </DialogTitle>
          {/* Close is handled by DialogContent's built-in button */}
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

#### 1.3 Update ProductRouteModal

```tsx
// app/[locale]/(main)/search/_components/product-route-modal.tsx

import { QuickViewDialog } from "@/components/shared/product/quick-view/quick-view-dialog"

export function ProductRouteModal({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  return (
    <QuickViewDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setOpen(false)
          router.back()
        }
      }}
      title={title}
    >
      {children}
    </QuickViewDialog>
  )
}
```

---

### Phase 2: Mobile Drawer Overhaul

**Goal:** Compact, thumb-friendly quick view with easy close

#### 2.1 Create Compact Image Gallery

```tsx
// components/shared/product/quick-view/quick-view-gallery-compact.tsx

export function QuickViewGalleryCompact({
  images,
  title,
  discountPercent,
  onNavigateToProduct,
}: QuickViewImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasMultiple = images.length > 1
  
  return (
    <div className="relative">
      {/* Compact hero - NOT square, more like 4:3 or 16:10 */}
      <div className="relative aspect-[4/3] bg-surface-gallery">
        <button
          type="button"
          onClick={onNavigateToProduct}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={normalizeImageUrl(images[currentIndex]) ?? PLACEHOLDER_IMAGE_PATH}
            alt={title}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </button>
        
        {/* Discount badge */}
        {discountPercent && discountPercent > 0 && (
          <Badge variant="discount" className="absolute top-3 left-3">
            -{discountPercent}%
          </Badge>
        )}
        
        {/* Image counter (bottom center) */}
        {hasMultiple && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/70 backdrop-blur-sm">
            <span className="text-xs font-medium text-background tabular-nums">
              {currentIndex + 1}/{images.length}
            </span>
          </div>
        )}
      </div>
      
      {/* Horizontal thumbnail strip */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "relative size-14 shrink-0 rounded-md overflow-hidden",
                i === currentIndex
                  ? "ring-2 ring-foreground ring-offset-1"
                  : "border border-border opacity-70"
              )}
            >
              <Image
                src={normalizeImageUrl(img) ?? PLACEHOLDER_IMAGE_PATH}
                alt=""
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

#### 2.2 Update ProductQuickViewDrawer with Sticky Header

```tsx
// components/mobile/drawers/product-quick-view-drawer.tsx

export function ProductQuickViewDrawer({
  open,
  onOpenChange,
  product,
  isLoading = false,
}: ProductQuickViewDrawerProps) {
  const t = useTranslations("Drawers")
  // ...existing hooks...

  if (!isMobile) return null

  const showSkeleton = isLoading || (open && !resolvedProduct)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        aria-label={t("quickView")}
        showHandle  // Keep handle for swipe affordance
        className="max-h-[92dvh]"  // Slightly taller for more content
      >
        {/* ✅ NEW: Sticky header with close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-3">
          <DrawerTitle className="text-sm font-semibold text-foreground truncate pr-2">
            {resolvedProduct?.title || t("quickView")}
          </DrawerTitle>
          
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 rounded-full"
            >
              <X className="size-5" />
              <span className="sr-only">{t("close")}</span>
            </Button>
          </DrawerClose>
        </div>
        
        <DrawerDescription className="sr-only">
          {resolvedProduct?.description || resolvedProduct?.title || t("quickView")}
        </DrawerDescription>
        
        <DrawerBody className="px-0">
          {showSkeleton ? (
            <QuickViewSkeletonCompact />  // ✅ Compact skeleton
          ) : resolvedProduct ? (
            <ProductQuickViewContentCompact  // ✅ Compact content
              product={resolvedProduct}
              productPath={productPath}
              onRequestClose={() => onOpenChange(false)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onNavigateToProduct={handleNavigateToProduct}
            />
          ) : null}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
```

#### 2.3 Create Compact Content Layout

```tsx
// components/shared/product/quick-view/product-quick-view-content-compact.tsx

export function ProductQuickViewContentCompact({
  product,
  productPath,
  onRequestClose,
  onAddToCart,
  onBuyNow,
  onNavigateToProduct,
}: ProductQuickViewContentProps) {
  // ...existing hooks and logic...
  
  return (
    <div className="flex flex-col">
      {/* Compact gallery (4:3 aspect ratio + horizontal thumbnails) */}
      <QuickViewGalleryCompact
        images={allImages}
        title={title}
        discountPercent={showDiscount ? discountPercent : undefined}
        onNavigateToProduct={onNavigateToProduct}
      />
      
      {/* Compact content grid */}
      <div className="px-4 py-3 space-y-3">
        {/* Price row - prominent */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className={cn(
            "text-xl font-bold tabular-nums",  // Smaller than before
            showDiscount ? "text-price-sale" : "text-price-regular"
          )}>
            {formatPrice(price, { locale })}
          </span>
          {showDiscount && originalPrice && (
            <span className="text-sm text-price-original line-through tabular-nums">
              {formatPrice(originalPrice, { locale })}
            </span>
          )}
          {showDiscount && (
            <Badge variant="discount" size="sm" className="ml-1">
              -{discountPercent}%
            </Badge>
          )}
        </div>
        
        {/* Title - 2 lines max */}
        <h2 className="text-base font-medium leading-snug text-foreground line-clamp-2">
          {title}
        </h2>
        
        {/* Quick info row - rating + condition + shipping */}
        <div className="flex flex-wrap items-center gap-2">
          {hasRating && (
            <div className="flex items-center gap-1">
              <Star size={14} weight="fill" className="fill-rating text-rating" />
              <span className="text-sm font-medium tabular-nums">{rating.toFixed(1)}</span>
              {typeof reviews === "number" && reviews > 0 && (
                <span className="text-xs text-muted-foreground">({reviews})</span>
              )}
            </div>
          )}
          {condition && (
            <Badge variant={getConditionBadgeVariant(condition)} size="sm">
              {condition}
            </Badge>
          )}
          {freeShipping && (
            <Badge variant="shipping" size="sm">
              <Truck size={10} />
              Free
            </Badge>
          )}
        </div>
        
        {/* View full page CTA */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={onNavigateToProduct}
        >
          {tModal("viewFullPage")}
          <ArrowSquareOut size={16} weight="bold" />
        </Button>
        
        {/* Compact seller card */}
        <QuickViewSellerCard
          sellerName={sellerName}
          sellerAvatarUrl={sellerAvatarUrl}
          sellerVerified={sellerVerified}
          onNavigateToProduct={onNavigateToProduct}
          compact  // ✅ New prop for smaller variant
        />
      </div>
      
      {/* Sticky footer with actions */}
      <div className="sticky bottom-0 border-t bg-background px-4 py-3 mt-auto pb-safe-max">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="black"
            size="lg"
            className="gap-2"
            onClick={onAddToCart}
            disabled={!inStock}
          >
            <ShoppingCart size={18} weight="bold" />
            {tDrawers("addToCart")}
          </Button>
          <Button
            variant="cta"
            size="lg"
            onClick={onBuyNow}
            disabled={!inStock}
          >
            {tProduct("buyNow")}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

### Phase 3: Shared Improvements

#### 3.1 Add Loading Skeleton That Matches Layout

```tsx
// components/shared/product/quick-view/quick-view-skeleton-compact.tsx

export function QuickViewSkeletonCompact() {
  return (
    <div className="flex flex-col">
      {/* Image skeleton - 4:3 aspect */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      
      {/* Thumbnail strip skeleton */}
      <div className="flex gap-2 px-4 py-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="size-14 rounded-md shrink-0" />
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="px-4 py-3 space-y-3">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
        
        {/* Title */}
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        
        {/* Badges row */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
        
        {/* View full page button */}
        <Skeleton className="h-9 w-full rounded-md" />
        
        {/* Seller card */}
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
      
      {/* Action footer */}
      <div className="px-4 py-3 mt-auto border-t">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-12 rounded-md" />
          <Skeleton className="h-12 rounded-md" />
        </div>
      </div>
    </div>
  )
}
```

#### 3.2 Design Token Usage

Ensure all components use design system tokens consistently:

| Element | Token | Usage |
|---------|-------|-------|
| Modal overlay | `bg-overlay-dark backdrop-blur-sm` | Frosted backdrop |
| Close button bg | `bg-muted/80 backdrop-blur-sm` | Visible against all backgrounds |
| Close button icon | `text-foreground size-5` | Clear visibility |
| Price sale | `text-price-sale` | Consistent red |
| Price regular | `text-price-regular` | `text-foreground` |
| Rating star | `fill-rating text-rating` | Golden yellow |
| Shipping badge | `variant="shipping"` | Green tint |
| Condition badge | `variant={getConditionBadgeVariant()}` | Per-condition colors |
| Shadow | `shadow-modal` | `--shadow-modal` from globals |
| Border radius | `rounded-xl` (modal), `rounded-t-2xl` (drawer) | Consistent with system |

---

## Implementation Checklist

### Desktop Modal
- [ ] Update `DialogContent` with fullWidth variant
- [ ] Add `backdrop-blur-sm` to `DialogOverlay`
- [ ] Increase close button size to 40×40px with visible background
- [ ] Add entrance/exit animations (zoom + fade)
- [ ] Create `QuickViewDialog` wrapper component
- [ ] Update `ProductRouteModal` to use new component
- [ ] Test on all breakpoints (1024px, 1280px, 1440px, 1920px)
- [ ] Test keyboard navigation (Tab, Escape)
- [ ] Test screen reader announcements

### Mobile Drawer
- [ ] Create `QuickViewGalleryCompact` with 4:3 aspect ratio
- [ ] Add sticky header with close button to drawer
- [ ] Create `ProductQuickViewContentCompact` layout
- [ ] Create `QuickViewSkeletonCompact` matching new layout
- [ ] Add `compact` prop to `QuickViewSellerCard`
- [ ] Update `ProductQuickViewDrawer` with new components
- [ ] Test on iPhone SE (375px), iPhone 14 Pro (393px), iPhone 14 Pro Max (430px)
- [ ] Test swipe-to-close still works
- [ ] Test one-handed reachability of close button
- [ ] Test with VoiceOver

### Shared
- [ ] Ensure all prices use `text-price-*` tokens
- [ ] Ensure all badges use proper variants
- [ ] Add loading states matching final layout
- [ ] Add error state for failed product fetch
- [ ] Update translations if needed (`Drawers`, `ProductModal`)

---

## Design Specifications

### Desktop Modal

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Product Title Here                                              [×]    │ │ ← Sticky header
│ └────────────────────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┬───────────────────────────────┐ │
│ │                                        │ €59.99  €79.99  -25%          │ │
│ │                                        │                               │ │
│ │            [GALLERY IMAGE]             │ Product Title                 │ │
│ │                                        │ ★ 4.8 (127 reviews)           │ │
│ │              4:3 aspect                │                               │ │
│ │                                        │ [New] [Free Shipping]         │ │
│ │                                        │                               │ │
│ │          [1] [2] [3] [4]              │ [View Full Page →]            │ │
│ │                                        │                               │ │
│ │                                        │ ┌─ Seller Card ─────────────┐ │ │
│ │                                        │ │ [Avatar] SellerName  [→] │ │ │
│ │                                        │ │ ⚡ Verified               │ │ │
│ │                                        │ └───────────────────────────┘ │ │
│ └────────────────────────────────────────┴───────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │   [ 🛒 Add to Cart ]                    [ ⚡ Buy Now ]                  │ │ ← Sticky footer
│ └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
    ↑                                                                     ↑
    Max width: 6xl (1152px)                                     Close: 40×40px
    Max height: 90dvh                                           visible bg
    Border radius: xl (12px)
    Shadow: shadow-modal
    Overlay: bg-overlay-dark backdrop-blur-sm
```

### Mobile Drawer

```
┌───────────────────────────────────┐
│           [═══════]               │ ← Drag handle
├───────────────────────────────────┤
│ Product Title              [×]    │ ← Sticky header
├───────────────────────────────────┤
│                                   │
│        [GALLERY IMAGE]            │
│          4:3 aspect               │
│                                   │
│      [●] [○] [○] [○] ← thumbs    │
├───────────────────────────────────┤
│ €59.99  €79.99  -25%              │
│                                   │
│ Product Title Here                │
│ ★ 4.8 (127)  [New]  [Free Ship]  │
│                                   │
│       [View Full Page →]          │
│                                   │
│ ┌─ Seller Card (compact) ───────┐ │
│ │ [Av] SellerName  Verified [→] │ │
│ └───────────────────────────────┘ │
├───────────────────────────────────┤
│ [🛒 Add to Cart] [⚡ Buy Now]     │ ← Sticky footer + safe area
└───────────────────────────────────┘
    ↑
    Max height: 92dvh
    Rounded top: 2xl (16px)
    Close button: top-right, 36×36px
    Image: 4:3 (not square!)
```

### Color Tokens Reference

```css
/* Overlay */
--overlay-dark: oklch(0 0 0 / 50%);  /* light mode */
--overlay-dark: oklch(0 0 0 / 70%);  /* dark mode */

/* Close button */
--muted: oklch(0.96 0 0);  /* light background */
--foreground: oklch(0.15 0.01 250);  /* icon color */

/* Prices */
--price-sale: oklch(0.48 0.18 27);  /* red */
--price-regular: var(--foreground);
--price-original: var(--muted-foreground);

/* Shadows */
--shadow-modal: 0 12px 40px -8px oklch(0 0 0 / 15%);
```

---

## Testing Checklist

### Accessibility (WCAG 2.1 AA)
- [ ] Color contrast: Close button visible (4.5:1)
- [ ] Focus trap: Tab cycles through modal/drawer only
- [ ] Escape key: Closes modal/drawer
- [ ] Screen reader: Title announced on open
- [ ] Touch target: All buttons ≥44×44px or have sufficient spacing

### Performance
- [ ] Image LCP: Priority loading for hero image
- [ ] Layout shift: Skeleton matches final layout (CLS 0)
- [ ] Animation: 60fps entrance/exit

### Responsiveness
- [ ] Desktop 1024px: 2-column grid fits
- [ ] Desktop 1920px: Comfortable max-width
- [ ] Mobile 375px (SE): Content readable
- [ ] Mobile 430px (14 Pro Max): No horizontal overflow

---

## Notes

### Why Not Full Sheet/Drawer on Desktop?

Desktop users expect modal dialogs, not full-screen takeovers. A well-styled modal:
- Keeps browsing context visible (dimmed backdrop shows search results)
- Has clear close affordance (visible X button, click outside)
- Feels faster (no full page transition)

### Why Compact on Mobile?

Mobile users scroll with thumb. A quick view should:
- Show price + title immediately (above fold)
- Have easy close (X button in reach, not just swipe)
- Encourage "View Full Page" if they want more detail

### Snap Points (Future Enhancement)

Consider adding Vaul snap points:
- 50% height: Shows image + price (peek mode)
- 92% height: Full quick view (current)

This allows users to "peek" at a product without fully committing.

---

## Related Files

- [Dialog Component](../components/ui/dialog.tsx)
- [Drawer Component](../components/ui/drawer.tsx)
- [Quick View Content](../components/shared/product/quick-view/product-quick-view-content.tsx)
- [Quick View Drawer](../components/mobile/drawers/product-quick-view-drawer.tsx)
- [Product Route Modal](../app/[locale]/(main)/search/_components/product-route-modal.tsx)
- [Design Tokens](../app/globals.css)
