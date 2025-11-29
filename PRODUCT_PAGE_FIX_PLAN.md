# Product Page UI/UX Audit & Fix Plan

## Executive Summary
This document outlines the comprehensive audit findings and fix plan for the product page. The current page has significant UI/UX issues including poor token usage, missing Bulgarian translations, hardcoded USD pricing (should be EUR for Bulgaria), inconsistent mobile experience, and missing semantic structure.

---

## 🔍 AUDIT FINDINGS

### 1. **Currency & Pricing Issues (CRITICAL)**
| Issue | Current State | Expected State |
|-------|--------------|----------------|
| Currency Symbol | Hardcoded `$` | EUR (€) for Bulgarian locale |
| Price Format | `$299.99` with split dollars/cents | `299,99 €` (European format) |
| Buy Box Price | Hardcoded `$` in JSX | Locale-aware currency |
| "FREE delivery" text | Hardcoded English in Buy Box | Translated "БЕЗПЛАТНА доставка" |

**Evidence from code:**
```tsx
// product/[id]/page.tsx line 133
<span className="text-sm align-top font-medium text-foreground relative top-1.5">$</span>
<span className="text-2xl sm:text-[28px] font-medium text-foreground">{Math.floor(product.price)}</span>
<span className="text-sm align-top font-medium text-foreground relative top-1.5">{(product.price % 1).toFixed(2).substring(1)}</span>
```

### 2. **Translation Issues**
| Element | Current | Should Be (Bulgarian) |
|---------|---------|----------------------|
| Product Title | English only | Localized from DB |
| Product Description | English only | Localized from DB |
| "Monday, August 14" | Hardcoded English | "Понеделник, Август 14" |
| "Amazon.com" seller | Hardcoded | "AMZN.bg" or localized |
| "One-Day" | Hardcoded | "Един ден" |
| "Save for Later" button | Hardcoded English | "Запази за по-късно" |

### 3. **Design Token Issues**
| Element | Current Implementation | Should Use Token |
|---------|----------------------|------------------|
| Price color | `text-foreground` | `text-price-regular` |
| Sale price | Not implemented | `text-price-sale` |
| Stock status | `text-brand-success` | `text-stock-available` |
| Rating stars | `text-rating` | ✅ Correct |
| Buy button | `bg-cta-add-cart` | ✅ Correct |
| Prime badge | `text-brand` | `text-shipping-prime` |

### 4. **Mobile UX Issues**
- **Image Gallery**: Thumbnails scroll horizontally but hard to tap (too small)
- **Buy Box**: Takes up too much vertical space on mobile
- **Related Products**: 2-column grid is cramped
- **Reviews Section**: Takes too much scroll depth
- **No Sticky Add to Cart**: User loses context when scrolling

### 5. **Accessibility Issues**
- Star ratings lack proper ARIA labels
- Images missing descriptive alt text (using generic "Thumbnail")
- Price structure not announced correctly by screen readers
- Review progress bars lack accessible labels

### 6. **Missing Features**
- No product variant selector (color, size)
- No quantity selector
- No delivery date picker
- No product zoom on image click
- No breadcrumb for category hierarchy (only shows product title)
- No "Customers also bought" section
- No share buttons

---

## 🛠️ FIX PLAN

### Phase 1: Critical Fixes (Currency & i18n)

#### 1.1 Create Currency Utility
```typescript
// lib/currency.ts
export function formatPrice(amount: number, locale: string): string {
  const currencyMap: Record<string, string> = {
    'en': 'USD',
    'bg': 'EUR'
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyMap[locale] || 'EUR'
  }).format(amount)
}

export function getCurrencySymbol(locale: string): string {
  return locale === 'en' ? '$' : '€'
}
```

#### 1.2 Update Product Page Price Display
- Replace hardcoded `$` with `getCurrencySymbol(locale)`
- Use `formatPrice()` for all price displays
- Add translation keys for delivery dates

#### 1.3 Add Missing Translation Keys
```json
// messages/bg.json additions
{
  "Product": {
    "currency": "€",
    "freeDeliveryDate": "Безплатна доставка {date}",
    "deliveryBy": "Доставка до",
    "saveForLater": "Запази за по-късно",
    "amazonStore": "AMZN.bg",
    "primeOneDay": "Един ден"
  }
}
```

### Phase 2: Design Token Migration

#### 2.1 Update Price Styling
```tsx
// Before
<span className="text-foreground">{price}</span>

// After
<span className="text-price-regular">{price}</span>
```

#### 2.2 Update Stock Status Styling
```tsx
// Before
<div className="text-brand-success">In Stock</div>

// After
<div className="text-stock-available">In Stock</div>
```

#### 2.3 Create Semantic Price Component
```tsx
// components/product-price.tsx
interface ProductPriceProps {
  price: number
  originalPrice?: number
  locale: string
  size?: 'sm' | 'md' | 'lg'
}

export function ProductPrice({ price, originalPrice, locale, size = 'md' }: ProductPriceProps) {
  const hasDiscount = originalPrice && originalPrice > price
  
  return (
    <div className="flex items-baseline gap-2">
      <span className={cn(
        hasDiscount ? "text-price-sale" : "text-price-regular",
        sizeClasses[size]
      )}>
        {formatPrice(price, locale)}
      </span>
      {hasDiscount && (
        <span className="text-price-original line-through text-sm">
          {formatPrice(originalPrice, locale)}
        </span>
      )}
    </div>
  )
}
```

### Phase 3: Mobile UX Improvements

#### 3.1 Sticky Add to Cart (Mobile)
```tsx
// components/sticky-add-to-cart.tsx
export function StickyAddToCart({ product, isVisible }: StickyAddToCartProps) {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 z-40",
      "lg:hidden transform transition-transform duration-200",
      isVisible ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="flex items-center gap-3">
        <ProductPrice price={product.price} locale={locale} size="sm" />
        <Button className="flex-1 bg-cta-add-cart h-11">
          {t('addToCart')}
        </Button>
      </div>
    </div>
  )
}
```

#### 3.2 Improved Image Gallery
- Larger thumbnails on mobile (min 60x60)
- Swipe gesture support for main image
- Zoom modal on tap
- Image counter indicator (1/6)

#### 3.3 Collapsible Sections
- Collapse description after 3 lines on mobile
- Collapse reviews with "Show more" button
- Accordion for product details

### Phase 4: Layout Restructuring

#### 4.1 Desktop Layout (3-column)
```
┌────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Electronics > Headphones > ...  │
├─────────────┬────────────────────┬─────────────────┤
│             │                    │                 │
│  Thumbnails │   Main Image       │   Buy Box       │
│  (vertical) │   (zoomable)       │   (sticky)      │
│             │                    │                 │
│             ├────────────────────┤                 │
│             │  Product Title     │                 │
│             │  Rating & Reviews  │                 │
│             │  Price             │                 │
│             │  Prime Badge       │                 │
│             │  Description       │                 │
│             │  Variant Selector  │                 │
├─────────────┴────────────────────┴─────────────────┤
│  Related Products (horizontal scroll)              │
├────────────────────────────────────────────────────┤
│  Reviews Section (2-column layout)                 │
└────────────────────────────────────────────────────┘
```

#### 4.2 Mobile Layout (Single column)
```
┌────────────────────────────┐
│ Breadcrumb (truncated)     │
├────────────────────────────┤
│ Main Image (full width)    │
│ Thumbnail dots/swipe       │
├────────────────────────────┤
│ Title                      │
│ Rating | Reviews           │
│ Price  | Prime             │
├────────────────────────────┤
│ Add to Cart (full width)   │
│ Buy Now                    │
├────────────────────────────┤
│ Description (collapsible)  │
├────────────────────────────┤
│ Delivery Info              │
├────────────────────────────┤
│ Related Products           │
├────────────────────────────┤
│ Reviews (collapsed)        │
└────────────────────────────┘
│ Sticky Add to Cart (fixed) │
└────────────────────────────┘
```

### Phase 5: Accessibility Fixes

#### 5.1 Star Rating ARIA
```tsx
<div 
  role="img" 
  aria-label={t('rating', { rating: product.rating, max: 5 })}
  className="flex text-rating"
>
  {[...Array(5)].map((_, i) => (
    <Star
      key={i}
      aria-hidden="true"
      className={cn(
        "h-4 w-4",
        i < Math.floor(rating) ? "fill-current" : "text-rating-empty"
      )}
    />
  ))}
</div>
```

#### 5.2 Price Accessibility
```tsx
<div aria-label={`Price: ${formatPrice(price, locale)}`}>
  <span aria-hidden="true">{getCurrencySymbol(locale)}</span>
  <span aria-hidden="true">{formatPriceParts(price).dollars}</span>
  <span aria-hidden="true">{formatPriceParts(price).cents}</span>
</div>
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Immediate (Phase 1 - Day 1)
- [ ] Create `lib/currency.ts` utility
- [ ] Update `messages/bg.json` with missing translations
- [ ] Update `messages/en.json` with matching keys
- [ ] Replace hardcoded `$` with locale-aware currency
- [ ] Translate "Save for Later" button
- [ ] Translate delivery date format

### Short-term (Phase 2 - Day 2-3)
- [ ] Create `components/product-price.tsx`
- [ ] Migrate all price displays to use tokens
- [ ] Update stock status to use `text-stock-available`
- [ ] Add proper ARIA labels to ratings
- [ ] Fix image alt texts

### Medium-term (Phase 3 - Day 4-5)
- [ ] Create `components/sticky-add-to-cart.tsx`
- [ ] Implement image zoom modal
- [ ] Add swipe gesture for mobile images
- [ ] Create collapsible description component
- [ ] Add quantity selector

### Long-term (Phase 4-5 - Week 2)
- [ ] Implement variant selector (color/size)
- [ ] Add "Customers also bought" section
- [ ] Redesign reviews section layout
- [ ] Add share buttons
- [ ] Full accessibility audit and fixes

---

## 🎯 SUCCESS METRICS

| Metric | Current | Target |
|--------|---------|--------|
| Translation coverage (BG) | ~70% | 100% |
| Token usage | ~40% | 100% |
| Mobile CLS | Unknown | < 0.1 |
| Accessibility score | Unknown | > 90 |
| Time to interactive | Unknown | < 3s |

---

## 📁 FILES TO MODIFY

1. `app/[locale]/product/[id]/page.tsx` - Main product page
2. `components/add-to-cart.tsx` - Add to cart component
3. `components/reviews-section.tsx` - Reviews section
4. `messages/bg.json` - Bulgarian translations
5. `messages/en.json` - English translations
6. `lib/currency.ts` - NEW: Currency utilities
7. `components/product-price.tsx` - NEW: Price component
8. `components/sticky-add-to-cart.tsx` - NEW: Mobile sticky CTA
9. `components/image-gallery.tsx` - NEW: Image gallery with zoom

---

## 🇧🇬 BULGARIAN LOCALE REQUIREMENTS

### Currency Display
- Symbol: € (Euro)
- Format: `299,99 €` (comma for decimals, space before symbol)
- Position: After amount

### Date Format
- Format: `15 ноември 2025`
- Days: Понеделник, Вторник, Сряда, Четвъртък, Петък, Събота, Неделя
- Months: Януари, Февруари, Март, Април, Май, Юни, Юли, Август, Септември, Октомври, Ноември, Декември

### Number Format
- Thousands: space separator (1 000)
- Decimals: comma (99,99)

---

*Generated by Playwright MCP Audit - November 28, 2025*
