# Feature: Product Cards

## What it does
Display product listings across the marketplace. Multiple card variants for different contexts:
mobile grid, desktop grid, mini (compact), list view, and dropdown preview.

## Key files
- `components/shared/product/card/mobile.tsx` — Mobile product card
- `components/shared/product/card/desktop.tsx` — Desktop product card
- `components/shared/product/card/mini.tsx` — Compact mini card
- `components/shared/product/card/list.tsx` — List view card
- `components/shared/product/card/price.tsx` — Price display sub-component
- `components/shared/product/card/image.tsx` — Product image with loading states
- `components/shared/product/card/actions.tsx` — Card action buttons (wishlist, quick view)
- `components/shared/product/card/social-proof.tsx` — Social proof indicators
- `components/shared/product/card/types.ts` — Shared TypeScript types
- `components/shared/product/product-price.tsx` — Standalone price component
- `components/shared/product/_lib/` — Card-specific utilities

## How it works
- Cards are Server Components by default (data passed as props)
- Each variant has its own file but shares types from `types.ts`
- Price formatting uses `lib/price.ts`
- Images use `normalize-image-url.ts` for Supabase Storage URLs
- Quick view trigger opens drawer (mobile) or dialog (desktop)

## Conventions
- Semantic tokens only: `bg-card`, `text-card-foreground`, `border-border`
- Price: destructive color for discounts (`text-destructive`)
- Responsive: mobile cards in 2-col grid, desktop 4-5 col
- Touch targets: entire card is tappable on mobile
- Image aspect ratio maintained via container constraints

## Dependencies
- `components/shared/product/quick-view/` for quick view integration
- Wishlist functionality from `app/actions/` + hooks
- Price formatting from `lib/price.ts`

## Last modified
- 2026-02-16: Documented during docs system creation
