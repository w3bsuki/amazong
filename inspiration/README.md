# Treido Mock Design Inspiration

This folder contains design documentation and mobile screenshots from the [treido-mock](https://github.com/w3bsuki/treido-mock) reference implementation.

> **IMPORTANT**: Treido-mock uses hardcoded Tailwind classes (`bg-gray-900`, etc.).
> See **[TOKEN_MAPPING.md](./TOKEN_MAPPING.md)** for translations to our semantic token system.

## 🎯 Start Here

| File | Description |
|------|-------------|
| **[TREIDO_IMPLEMENTATION_GUIDE.md](./TREIDO_IMPLEMENTATION_GUIDE.md)** | **MASTER GUIDE** - Full implementation plan with gap analysis, phases, code examples |

## Documentation Files

| File | Description |
|------|-------------|
| [DESIGN_PHILOSOPHY.md](./DESIGN_PHILOSOPHY.md) | Core design principles: "No Scale" rule, border over shadow, typography & density |
| [TAILWIND_V4_SHADCN.md](./TAILWIND_V4_SHADCN.md) | Technical guide for Tailwind CSS v4 config + Shadcn component overrides |
| [LAYOUT_PATTERNS.md](./LAYOUT_PATTERNS.md) | Reusable layout patterns: sticky headers, fixed footers, grids, carousels |
| [TOKEN_MAPPING.md](./TOKEN_MAPPING.md) | **Translation guide**: treido → amazong semantic tokens |

## Treido-Mock Guides (Copied from GitHub)

| File | Description |
|------|-------------|
| [guides/01_THEME_AND_TOKENS.md](./guides/01_THEME_AND_TOKENS.md) | OKLCH color system + Tailwind v4 configuration |
| [guides/02_SHADCN_OVERRIDES.md](./guides/02_SHADCN_OVERRIDES.md) | Button, Input, Card, Badge shadcn modifications |
| [guides/03_LAYOUT_PATTERNS.md](./guides/03_LAYOUT_PATTERNS.md) | Data grid, control bar, property list patterns |
| [guides/04_PROMPT_FOR_AGENT.md](./guides/04_PROMPT_FOR_AGENT.md) | Master prompt for AI agents |

## Screenshots (Mobile 430×932)

### Updated Screenshots (January 2026)
| Screenshot | Description |
|------------|-------------|
| [01-home-page-2026.png](./screenshots/01-home-page-2026.png) | Home page with header, category strip, promo banner, product grid |
| [02-product-page-2026.png](./screenshots/02-product-page-2026.png) | Product detail page with gallery, seller info, specs, description |
| [03-category-page-2026.png](./screenshots/03-category-page-2026.png) | Category listing with subcategory tabs, filters, 2-col product grid |
| [04-filter-modal-2026.png](./screenshots/04-filter-modal-2026.png) | Bottom sheet filter modal with sort, price, condition, location |
| [05-sell-page-2026.png](./screenshots/05-sell-page-2026.png) | Sell/Create listing page with photo upload, form inputs |
| [06-profile-page-2026.png](./screenshots/06-profile-page-2026.png) | User profile with stats, balance, menu items |
| [07-search-page-2026.png](./screenshots/07-search-page-2026.png) | Search page with recent, popular, and browse categories |

### Original Screenshots
| Screenshot | Description |
|------------|-------------|
| [01-home-page.png](./screenshots/01-home-page.png) | Home page with header, category strip, promo banner, product grid |
| [02-product-page.png](./screenshots/02-product-page.png) | Product detail page with gallery, seller info, specs, description |
| [03-category-page.png](./screenshots/03-category-page.png) | Category listing with subcategory tabs, filters, 2-col product grid |
| [04-filter-modal.png](./screenshots/04-filter-modal.png) | Bottom sheet filter modal with sort, price, condition, location |
| [05-sell-page.png](./screenshots/05-sell-page.png) | Sell/Create listing page with photo upload, form inputs |

## Key Design Tokens

```
Colors (Gray/Zinc only):
- Background: bg-white
- Canvas/Inputs: bg-gray-50
- Text Primary: text-gray-900
- Text Secondary: text-gray-500  
- Borders: border-gray-100, border-gray-200
- Brand/CTA: bg-gray-900 (black buttons)

Typography:
- Labels: text-[11px] uppercase font-bold
- Body: text-[16px] (prevents iOS zoom)
- Prices: text-[22px]+ font-bold

Spacing:
- Dense: gap-2, gap-3
- Avoid: gap-6, gap-8 (too loose)

Touch:
- Min button height: 42px (h-10, h-11, h-12)
- Feedback: active:opacity-90 (NO scale animations)
- Safe areas: pb-safe, pt-safe-top
```

## Usage

Reference these docs when implementing mobile UI components to ensure visual consistency with the treido-mock design system.
