# 05 — Homepage Layout (promoted first, then vertical grid feed)

Your homepage should act like a marketplace “feed”:

1) **Promoted / Featured** (horizontal carousel, first thing users see)
2) **Vertical grid** of products (infinite scroll / pagination)
3) Optional: categories, “New”, “Top rated”, etc (but don’t overload above the fold)

---

## Homepage sections (recommended order)

### Above the fold (conversion-first)
- Header (search)
- Category chips row (fast browsing)
- Promoted carousel (“Deals”, “Featured”, “Sponsored”)
- The first row of the grid (so users see inventory immediately)

### Below the fold
- “New”
- “Popular in X”
- “Recently viewed”
- “Based on your browsing” (if personalization exists)

---

## Section header component (reusable)

Build one consistent header:

- left: title
- right: “See all →”

Snippet:

```tsx
import Link from "next/link"

export function SectionHeader({
  title,
  href,
}: {
  title: string
  href?: string
}) {
  return (
    <div className="flex items-end justify-between px-4">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          See all →
        </Link>
      ) : null}
    </div>
  )
}
```

---

## Promoted carousel (use shadcn Carousel)

Why: swipe gestures + momentum scrolling feels “native”.

### Layout targets
- Card width: ~75–85% of screen
- Gap: 12–16px
- Rounded corners + shadow-card
- Promo badge + wishlist action

### Snippet: PromotedCarousel

```tsx
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ProductCard } from "@/components/product/product-card"
import { SectionHeader } from "@/components/home/section-header"

export function PromotedCarousel({ items }: { items: any[] }) {
  return (
    <section className="mt-3">
      <SectionHeader title="Promoted" href="/promoted" />
      <div className="mt-3">
        <Carousel opts={{ align: "start" }}>
          <CarouselContent className="-ml-4">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-4 basis-[82%] sm:basis-[60%] lg:basis-[40%]"
              >
                <ProductCard product={item} variant="promoted" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
```

Note:
- Negative margin + `pl-*` spacing matches shadcn carousel docs.
- Use `basis-*` to control visible width.

---

## Category chips row (fast browse)

Rules:
- Horizontal scroll (native)
- Single line
- Chips have clear active state
- Don’t show 20 chips at once; show top 8–12 + “More…”

Snippet:

```tsx
export function CategoryChips({ items }: { items: { id: string; label: string }[] }) {
  return (
    <div className="mt-3 px-4">
      <div className="flex gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
        {items.map((c) => (
          <button
            key={c.id}
            className="shrink-0 rounded-full border border-border/70 bg-background px-3 py-2 text-sm font-medium shadow-sm active:scale-[0.98]"
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

(You can swap to `ScrollArea` + `ScrollBar` if you want the shadcn primitive.)

---

## Vertical product grid feed

This is where conversion happens.

### Mobile grid baseline
- `grid-cols-2`
- `gap-3`
- card radius matches tokens
- show:
  - image
  - title (2 lines)
  - price + old price if discounted
  - rating + count
  - shipping/location meta (if relevant)

### Snippet: ProductGrid

```tsx
import { ProductCard } from "@/components/product/product-card"

export function ProductGrid({ items }: { items: any[] }) {
  return (
    <section className="mt-6">
      <div className="px-4">
        <h2 className="text-base font-semibold tracking-tight">New</h2>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  )
}
```

---

## Loading: skeletons (don’t show spinners everywhere)

- Promoted carousel: 2–3 skeleton cards
- Grid: 6–12 skeleton tiles

Use shadcn `Skeleton` component.

---

## Empty states (must be designed)

If no products:
- show a friendly illustration/icon
- show 2–3 helpful actions:
  - change category
  - clear filters
  - start selling

Use shadcn `Empty` + `Button`.
