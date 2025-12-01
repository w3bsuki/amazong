# UI Audit Plan
## Amazong E-Commerce Platform

> **Purpose**: Clean, production-ready UI using shadcn/ui + Tailwind CSS v4 + Next.js App Router.  
> **Reference**: eBay.com - Clean, functional, no-nonsense e-commerce UI.

---

## Core Principles

### 1. No Over-Engineering
- **NO** custom animations (remove framer-motion, tailwindcss-animate unless essential)
- **NO** fancy effects (gradients, shadows, blurs) unless they serve UX
- **NO** hover states that require complex CSS
- **NO** duplicate components doing the same thing
- **NO** hardcoded values - use CSS variables and Tailwind config

### 2. shadcn/ui Best Practices
- Use shadcn components as-is (Button, Card, Dialog, Sheet, etc.)
- Compose components from shadcn primitives
- Use `cn()` utility for conditional classes
- Follow shadcn naming conventions (`@/components/ui/*`)
- Use Radix UI primitives underneath (already included)

### 3. Tailwind CSS v4 Compliance
- Use CSS variables: `var(--color-*)`, `var(--spacing-*)`
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- No deprecated classes
- Mobile-first approach (default → `md:` → `lg:`)

### 4. Performance First
- Server Components by default
- `"use client"` only when needed (interactivity)
- Lazy load below-fold content
- Optimize images with `next/image`
- Prefetch critical routes

### 5. Accessibility
- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<button>`)
- ARIA labels where needed
- Keyboard navigation
- Focus states (visible)
- Minimum 44px touch targets on mobile

---

## Component Architecture

### Required shadcn/ui Components
These should be the ONLY UI primitives used:

| Component | Use Case |
|-----------|----------|
| `Button` | All clickable actions |
| `Card` | Product cards, info cards |
| `Dialog` | Modals, confirmations |
| `Sheet` | Mobile menus, filters |
| `Select` | Dropdowns (sort, filters) |
| `Input` | Form inputs |
| `Checkbox` | Multi-select filters |
| `RadioGroup` | Single-select options |
| `Tabs` | Tabbed content |
| `Skeleton` | Loading states |
| `Badge` | Labels, tags, status |
| `Separator` | Dividers |
| `ScrollArea` | Custom scrollbars |
| `Avatar` | User avatars |
| `DropdownMenu` | Account, cart popover |
| `Popover` | Tooltips, hover cards |
| `Toast/Sonner` | Notifications |
| `Breadcrumb` | Navigation path |
| `Pagination` | List pagination |

### Remove These (Over-Engineering)
- Custom carousel (use native CSS scroll-snap)
- Custom toast (use Sonner)
- Custom dropdown (use DropdownMenu)
- Magic UI, Aceternity, Origin UI extras
- Animation libraries

---

## Route Audit Checklist

### Phase 1: Global Layout

| Component | File | Priority | Status |
|-----------|------|----------|--------|
| Root Layout | `app/[locale]/layout.tsx` | Critical | ⬜ |
| Site Header | `components/site-header.tsx` | Critical | ⬜ |
| Site Footer | `components/site-footer.tsx` | Critical | ⬜ |
| Mobile Tab Bar | `components/mobile-tab-bar.tsx` | High | ⬜ |

**Header Requirements:**
- Desktop: Logo, Search (centered), Account, Cart
- Mobile: Logo, Search icon, Menu icon, Cart
- Use `Sheet` for mobile menu
- Use `DropdownMenu` for account/cart popovers
- Sticky with `position: sticky` (not fixed)

**Footer Requirements:**
- Link columns (collapse to accordion on mobile using `Collapsible`)
- Simple copyright text
- No newsletter (move to dedicated page if needed)

### Phase 2: Home Page

| Section | Component | Notes |
|---------|-----------|-------|
| Hero | CSS scroll-snap carousel | No JS carousel library |
| Categories | Simple grid of links | 4 cols desktop, 2 cols mobile |
| Products | Product grid | 4 cols → 2 cols → 1 col |
| Deals | Badge + price display | Simple, no countdown timers |

**Remove:**
- Welcome toast
- Complex promo cards
- Bento grids
- Animated banners

### Phase 3: Search & Browse

| Page | Requirements |
|------|--------------|
| `/search` | Filter sidebar (Sheet on mobile), Product grid, Sort select |
| `/categories` | Category grid, no hero banner |
| `/categories/[slug]` | Filters, Products, Pagination |

**Filter Component:**
- Desktop: Sidebar with `Checkbox` groups
- Mobile: `Sheet` with same content
- Use `Badge` for active filter chips
- Clear all button

### Phase 4: Product Page

| Section | shadcn Components |
|---------|-------------------|
| Images | CSS grid (no gallery library) |
| Info | Card with Title, Price, Badge |
| Actions | Button (Add to Cart), Button (Buy Now) |
| Reviews | Card list, Pagination |

**Remove:**
- Sticky add-to-cart bar
- Complex variant selectors
- Trust badges (simplify to text)
- Related products carousel

### Phase 5: Cart & Checkout

| Page | Components |
|------|------------|
| `/cart` | Card per item, quantity Input, Button remove |
| `/checkout` | Form fields, RadioGroup for shipping, Button submit |

**Keep simple:**
- No sidebar order summary on checkout
- Single column form
- Clear progress indicator using native HTML `<progress>` or shadcn `Progress`

### Phase 6: Auth Pages

| Page | Layout |
|------|--------|
| `/auth/login` | Centered Card with form |
| `/auth/sign-up` | Centered Card with form |

**Standard auth pattern:**
- Email + Password
- Link to other auth page
- Error messages inline
- No social login buttons (unless implemented)

---

### Phase 7: Account Pages

| Page | Layout |
|------|--------|
| `/account` | Grid of Card links (Orders, Messages, Settings) |
| `/account/orders` | Card list with order info |
| `/account/messages` | Simple message list (no complex chat UI) |
| `/account/wishlist` | Product grid (reuse ProductCard) |

### Phase 8: Deals & Sellers

| Page | Simplification |
|------|----------------|
| `/todays-deals` | Product grid with Badge for discount % - no countdown |
| `/sellers` | Simple seller Card list |
| `/sell` | Form using shadcn Form components |

### Phase 9: Information Pages

| Page | Layout |
|------|--------|
| `/about` | Simple prose content |
| `/contact` | Contact form |
| `/customer-service` | FAQ accordion using Collapsible |
| `/privacy`, `/terms` | Legal text pages |

### Phase 10: Error Pages

| Page | Component |
|------|-----------|
| `not-found.tsx` | Empty state with Button to home |
| `error.tsx` | Error message with retry Button |
| `loading.tsx` | Skeleton grid matching page content |

---

## Tech Debt Removal

### Files to Consolidate or Remove

```
REMOVE/CONSOLIDATE:
├── components/mobile-search-overlay.tsx → Merge into SearchBar
├── components/mobile-search-v2.tsx → Delete
├── components/mobile-search.tsx → Delete  
├── components/mobile-navigation.tsx → Delete (use mobile-tab-bar)
├── components/welcome-toast.tsx → Delete
├── components/daily-deals-banner.tsx → Simplify to Badge
├── components/promo-card.tsx → Use Card directly
├── components/brand-circles.tsx → Delete
├── components/category-circles.tsx → Use simple grid
├── components/tabbed-product-section.tsx → Use Tabs + ProductGrid
├── components/trending-products-section.tsx → Rename to ProductSection
```

### Component Consolidation

| Before | After |
|--------|-------|
| 3 search components | Single `SearchBar` with responsive behavior |
| `product-card.tsx` + `product-row.tsx` | Single `ProductCard` with `variant` prop |
| `mega-menu.tsx` + `category-subheader.tsx` + `sidebar-menu.tsx` | Single `Navigation` with responsive behavior |

### Remove External Registries

Update `components.json` - remove `@magicui`, `@tweakcn`, `@aceternity`, `@originui`.

---

## Responsive Breakpoints

| Breakpoint | Width | Use Case |
|------------|-------|----------|
| (default) | < 640px | Mobile |
| `sm:` | ≥ 640px | Large mobile |
| `md:` | ≥ 768px | Tablet |
| `lg:` | ≥ 1024px | Desktop |
| `xl:` | ≥ 1280px | Large desktop |

### Grid Guidelines

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Products | 2 cols | 3 cols | 4 cols |
| Categories | 2 cols | 3 cols | 4 cols |
| Forms | 1 col | 1 col | 2 cols |

---

## CSS Variables

```css
/* Semantic tokens in globals.css */
--background / --foreground
--card / --card-foreground
--primary / --primary-foreground
--muted / --muted-foreground
--border / --input / --ring
```

---

## Best Practices Summary

### DO
- Use shadcn/ui components
- Use CSS variables for colors
- Use Tailwind responsive prefixes
- Server Components by default
- `next/image` for all images
- Semantic HTML elements
- 44px minimum touch targets

### DON'T
- Custom animation libraries
- Hardcoded colors/spacing
- Complex hover effects
- Multiple components for same purpose
- Client components unless needed
- External UI registries

---

## Implementation Priority

**Week 1**: Foundation
- Consolidate search
- Simplify header
- Clean up globals.css

**Week 2**: Core Pages
- Home page cleanup
- Search/Browse
- Product page

**Week 3**: User Flows
- Cart & Checkout
- Auth pages
- Account pages

**Week 4**: Polish
- Error pages
- Loading states
- Accessibility audit

---

## Quality Checklist

For each component:
- [ ] Uses shadcn/ui primitives
- [ ] No hardcoded values
- [ ] Responsive (mobile-first)
- [ ] Accessible
- [ ] Server Component unless interactive
- [ ] TypeScript types defined
- [ ] i18n ready (useTranslations)
