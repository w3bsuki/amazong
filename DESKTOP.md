# Desktop UI/UX Audit Report - AMZN E-Commerce Platform

**Audit Date:** November 27, 2025  
**Last Updated:** January 2025
**Viewport:** 1920x1080 (Desktop Full HD)  
**Reference Benchmark:** Alibaba.com B2B Platform

---

## 🎉 Recent Updates (January 2025)

### ✅ Completed Improvements

#### 1. Brands System Implemented
- Created `brands` table in Supabase with logo support
- Added 24 popular brands: Apple, Samsung, Sony, Microsoft, Google, Nike, Adidas, LG, HP, Dell, Lenovo, Canon, Bose, IKEA, Philips, Dyson, ASUS, Razer, JBL, Under Armour, Puma, Reebok, New Balance, Skechers
- Brand logos sourced from **SVGL (svgl.app)** - MIT licensed SVGs
- Supports light/dark mode logos via `logo_url` and `logo_dark_url` columns
- `is_verified` flag for verified brand partnerships

#### 2. Icon System Overhaul (Emojis → Lucide React)
- **Replaced all emoji category icons** with clean Lucide React icons
- Updated components:
  - `components/category-circles.tsx` - Category navigation circles
  - `app/[locale]/categories/page.tsx` - Full categories page
  - `app/[locale]/todays-deals/page.tsx` - Deal category filters
- Icon mapping:
  - Electronics → `Smartphone`
  - Computers → `Monitor`
  - Gaming → `Gamepad2`
  - Smart Home → `Home`
  - Home & Kitchen → `ChefHat`
  - Fashion → `Shirt`
  - Beauty → `Sparkles`
  - Toys → `Puzzle`
  - Sports → `Dumbbell`
  - Books → `BookOpen`
  - Automotive → `Car`
  - Garden → `Flower2`
  - Health → `HeartPulse`
  - Baby → `Baby`
  - Pets → `Dog`
  - Office → `Printer`
  - All Deals → `Flame`
- Categories in Supabase now have `icon` column with Lucide icon names

#### 3. Test Products Seeded (65+ Products)
- Seeded 5-10 products per category across all 11 main categories
- Products include:
  - Realistic titles and descriptions
  - Multiple product images (3-5 per product)
  - Brand associations where applicable
  - Proper pricing ($50-$1500 range)
  - Ratings and review counts
  - Tags for searchability
- All products associated with verified seller: **Tech Haven**

#### 4. Supabase Client Resilience
- Made client-side Supabase client more resilient
- Falls back gracefully when env vars missing
- Prevents crashes on sell page during development

#### 5. Translation Cleanup
- Removed emoji from translation files (en.json, bg.json)
- "🔥 Daily Deals" → "Daily Deals"

### ⛔ Design Decisions

#### No Image Zoom
- **Decision**: Product images will NOT have zoom/magnify functionality
- **Rationale**: Clean, fast UX similar to mobile-first design
- **Alternative**: High-resolution images that load quickly
- Multi-image gallery with thumbnails (coming soon)

#### SVGL for Brand Logos
- Using SVGL (svgl.app) for tech/brand logos
- MIT licensed, high quality SVGs
- Consistent styling across light/dark modes

---

## Executive Summary

This audit evaluates the desktop experience of the AMZN e-commerce platform with focus on:
- UI/UX design patterns and visual hierarchy
- Accessibility (a11y) compliance
- Typography and readability
- Icon library usage
- Comparison with Alibaba.com design patterns
- Brand identity and visual consistency

### Overall Rating: **6.5/10** (Needs Improvement)

The platform has a solid foundation with proper semantic HTML, internationalization support, and responsive components. However, significant improvements are needed in visual density, information architecture, icon system, and Alibaba-style B2B features.

---

## 🔍 Page-by-Page Audit Results

### 1. Homepage (`/`)

#### ✅ What Works Well
- **Skip Links**: Proper "Skip to main content" and "Skip to footer" accessibility links
- **Semantic HTML**: Good use of `banner`, `main`, `navigation`, `contentinfo` roles
- **Hero Carousel**: Functional with slides for deals, promotions
- **Category Circles**: Horizontal scrollable category navigation
- **Tabbed Product Sections**: "Избрани" (Featured), "Техника" (Electronics), tabs work correctly
- **Footer**: Comprehensive with newsletter signup, social links, legal links

#### ❌ Issues Identified

| Priority | Issue | Location | Description |
|----------|-------|----------|-------------|
| HIGH | Missing Logo/Brand Identity | Header | Only text "AMZN" - no proper logo SVG |
| HIGH | Sparse Product Density | Homepage | Only ~4 products visible in featured section (Alibaba shows 20+) |
| HIGH | No Mega Menu Previews | Categories button | "Зареждане..." loading state shown, no visual preview |
| MEDIUM | Currency Inconsistency | Products | Mix of `$` and `лв.` (BGN) - should be consistent |
| MEDIUM | Carousel Controls Disabled | Hero | Prev/Next buttons show as disabled |
| MEDIUM | No Trust Badges | Homepage | Missing "Verified Seller", "Secure Payment", "Free Returns" badges |
| LOW | Promo Cards Lack Urgency | Deals section | No countdown timers or scarcity indicators |

#### 🎯 Alibaba Comparison
- **Alibaba has**: 40+ category icons visible, supplier verification badges, RFQ (Request for Quote) prominently displayed, B2B-specific features like MOQ display, factory images
- **AMZN lacks**: Supplier showcase, factory/warehouse images, bulk pricing indicators, trade assurance badges

---

### 2. Category/Search Page (`/search?category=electronics`)

#### ✅ What Works Well
- **Breadcrumb Navigation**: Proper breadcrumb with home icon and hierarchy
- **Sidebar Filters**: Department, Rating, Price, Deals filters present
- **Subcategory Tabs**: Horizontal tabs for Audio, Cameras, Phones, etc.
- **Sort Dropdown**: "Препоръчани" (Recommended) sorting available
- **Pagination**: Page navigation buttons present

#### ❌ Issues Identified

| Priority | Issue | Location | Description |
|----------|-------|----------|-------------|
| HIGH | Low Product Card Density | Product Grid | Only 5 products per row, massive whitespace |
| HIGH | Missing Product Thumbnails | Grid View | Single image per card, no multi-image hover |
| HIGH | No Filter Chips Active State | Active Filters | No visual indication of applied filters |
| MEDIUM | Price Range Custom Input | Price Filter | `$` symbol for BGN currency |
| MEDIUM | Missing "Items per page" Control | Pagination | No option to show 24/48/96 products |
| MEDIUM | No Quick View Modal | Product Cards | Must navigate to PDP for details |
| LOW | "Add to wishlist" English Text | Product Cards | Should be in Bulgarian |

#### 🎯 Alibaba Comparison
- **Alibaba has**: Dense grid (6-8 products), image gallery hover, MOQ badges, supplier country flags, video previews, sample availability
- **AMZN lacks**: Gallery hover, supplier info, bulk pricing display, RFQ button per product

---

### 3. Product Detail Page (`/product/[id]`)

#### ✅ What Works Well
- **Price Display**: Clear price with currency
- **Prime Badge**: "prime One-Day" badge present
- **Trust Icons**: Free returns, Free delivery, Secure transaction icons
- **Reviews Section**: Star rating breakdown with progress bars
- **Related Products**: Carousel of similar items
- **Buy Actions**: "Добави в количката", "Купи сега", "Save for Later" buttons

#### ❌ Issues Identified

| Priority | Issue | Location | Description |
|----------|-------|----------|-------------|
| HIGH | Single Product Image | Gallery | Only 1 thumbnail, no zoom, no multi-angle |
| HIGH | Missing Variant Selector | Product Options | No color/size/style selection UI |
| HIGH | No Seller Information | Buy Box | Should show seller name, rating, location |
| MEDIUM | Generic Description | About section | Placeholder text, no bullet points or specs |
| MEDIUM | Empty Review Progress | Ratings | All bars show 0% despite "120 оценки" |
| MEDIUM | No Q&A Section | Product page | Customer questions feature missing |
| LOW | English "Save for Later" | Button | Inconsistent with Bulgarian UI |
| LOW | Static Delivery Date | Shipping | "Monday, August 14" - incorrect/static date |

#### 🎯 Alibaba Comparison
- **Alibaba has**: 360° product views, video, supplier factory images, detailed specifications table, price tiers, sample orders, chat with supplier
- **AMZN lacks**: Multi-image gallery, zoom, video, specifications table, supplier chat

---

### 4. Today's Deals Page (`/todays-deals`)

#### ✅ What Works Well
- **Hero Banner**: "Днешни оферти" with "Спести до 70%" messaging
- **Category Filters**: Emoji-based category chips (🔥 Всички, 📱 Електроника, etc.)
- **Deal Status Tabs**: "Всички оферти", "Налични", "Предстоящи", "Списък за гледане"
- **Countdown Timers**: "Приключва след X:XX:XX" per deal
- **Discount Badges**: "-50%", "-35%" clearly displayed

#### ❌ Issues Identified

| Priority | Issue | Location | Description |
|----------|-------|----------|-------------|
| HIGH | Static Data | Deal cards | Same demo products, not real inventory |
| MEDIUM | No Progress Bars | Deal urgency | Should show "80% claimed" like Amazon |
| MEDIUM | Emoji Icons | Category filters | Should use proper SVG icons |
| LOW | No "Watch this deal" | Deal cards | Missing add to watchlist inline action |

---

### 5. Shopping Cart (`/cart`)

#### ✅ What Works Well
- **Empty State**: Clear message with link to continue shopping
- **Breadcrumb**: "Amazong > Shopping Cart" path shown

#### ❌ Issues Identified

| Priority | Issue | Location | Description |
|----------|-------|----------|-------------|
| HIGH | No Cart Features | Empty cart | Missing recommended products, "Recently viewed" |
| HIGH | English Title | Page | "Your Amazon Cart is empty" should be Bulgarian |
| MEDIUM | No Saved for Later | Cart page | Missing "Save for later" section |
| MEDIUM | No Checkout Preview | Cart | No subtotal or checkout CTA visible |

---

### 6. Authentication Pages (`/auth/login`)

#### ✅ What Works Well
- **Clean Design**: Centered card layout
- **Form Fields**: Email/phone and password inputs
- **Legal Links**: Terms of Use, Privacy Policy links
- **Sign Up CTA**: "Създай Amazon акаунт" button

#### ❌ Issues Identified

| Priority | Issue | Location | Description |
|----------|-------|----------|-------------|
| HIGH | Autocomplete Warning | Password | Console shows autocomplete attribute missing |
| MEDIUM | "amazon" Branding | Logo area | Shows lowercase "amazon" text, not AMZN brand |
| MEDIUM | Hash Links | Legal links | `#` placeholder URLs for terms/privacy |
| LOW | No Social Login | Login form | Missing Google, Facebook, Apple sign-in options |

---

### 7. Customer Service (`/customer-service`)

#### ✅ What Works Well
- **Help Categories**: 9 icon-based help topics with hover states
- **Search Bar**: Help library search functionality
- **Contact CTA**: "Започни чат" button for support
- **Accordion Topics**: Expandable FAQ sections

#### ❌ Issues Identified

| Priority | Issue | Location | Description |
|----------|-------|----------|-------------|
| MEDIUM | Icons Rendered as Images | Help topics | Using img tags instead of SVG icons |
| LOW | Limited Topics | FAQ | Only 2 expandable items visible |

---

### 8. Account Page (`/account`) - ERROR

#### ❌ Critical Issue
```
ReferenceError: User is not defined
Application error: a server-side exception has occurred
```
**Action Required**: Fix the account page component - `User` type is being referenced before import.

---

### 9. Sell Page (`/sell`) - BROKEN

#### ❌ Critical Issue
- Page renders with only footer visible
- Header completely missing
- No seller onboarding content

---

## 📊 Accessibility (a11y) Audit

### Compliance Level: Partial WCAG 2.1 AA

#### ✅ Passing
- Skip navigation links present
- Semantic HTML landmarks (banner, main, contentinfo)
- Focus visible states on interactive elements
- Alt text on most images
- Proper heading hierarchy (h1 → h2 → h3)
- Touch targets meet 44px minimum on buttons
- Color contrast appears acceptable (needs testing)

#### ❌ Failing

| Priority | Issue | WCAG | Recommendation |
|----------|-------|------|----------------|
| HIGH | Missing form labels | 1.3.1 | Add `<label>` elements or `aria-label` |
| HIGH | Autocomplete attributes | 1.3.5 | Add `autocomplete="current-password"` etc. |
| MEDIUM | Non-descriptive link text | 2.4.4 | "Виж повече" needs context |
| MEDIUM | Image alt texts generic | 1.1.1 | Improve descriptive alt text |
| MEDIUM | Missing aria-expanded | 4.1.2 | Add to collapsible sections |
| LOW | Language switching | 3.1.2 | `lang` attribute on language-specific content |

---

## 🎨 Typography & Readability

### Current Font Stack
```css
--font-sans: Inter, sans-serif;
--font-serif: Source Serif 4, serif;
--font-mono: JetBrains Mono, monospace;
```

### Issues

| Issue | Current | Recommendation |
|-------|---------|----------------|
| Font Size Scale | Limited | Implement 8-step type scale (12, 14, 16, 18, 20, 24, 32, 48px) |
| Line Height | Not set | Add `line-height: 1.5` for body, `1.2` for headings |
| Max Line Length | Unrestricted | Cap at 75ch for readability |
| Cyrillic Support | Partial | Ensure Inter includes Bulgarian glyphs |
| Weight Variety | Limited | Use 400/500/600/700 weights more intentionally |

---

## 🖼️ Icon Library Assessment

### Current State: Lucide React

```json
{
  "iconLibrary": "lucide"
}
```

### Issues with Lucide for E-commerce

1. **Generic Icons**: Lucide is designed for general UI, not e-commerce specific
2. **Missing E-commerce Icons**:
   - Shopping/Cart variants (cart-add, cart-remove, cart-full)
   - Payment methods (Visa, Mastercard, PayPal, Apple Pay, Google Pay)
   - Shipping (truck-fast, package-delivered, returns)
   - E-commerce badges (verified-seller, best-seller, top-rated)
   - Categories (electronics-specific, fashion-specific, etc.)

### Recommended Icon Solutions

#### Option 1: Phosphor Icons (Recommended)
- **URL**: https://phosphoricons.com/
- **React Package**: `@phosphor-icons/react`
- **Benefits**: 
  - 9000+ icons
  - 6 weights (thin, light, regular, bold, fill, duotone)
  - E-commerce friendly
  - MIT License
  - Tree-shakeable

#### Option 2: Tabler Icons
- **URL**: https://tabler.io/icons
- **React Package**: `@tabler/icons-react`
- **Benefits**:
  - 4500+ icons
  - Consistent 24x24 grid
  - SVG stroke-based
  - MIT License

#### Option 3: Iconify (Universal)
- **URL**: https://iconify.design/
- **React Package**: `@iconify/react`
- **Benefits**:
  - 200,000+ icons from 150+ sets
  - Single API for multiple icon sets
  - On-demand loading
  - Can mix Lucide + other sets

### Brand SVG Requirements

| Category | Icons Needed |
|----------|--------------|
| Payment | Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay, Stripe, Klarna |
| Shipping | DHL, FedEx, UPS, USPS, DPD, Speedy (Bulgaria) |
| Trust | SSL Secure, Money Back Guarantee, 24/7 Support, Verified |
| Social | Facebook, Instagram, Twitter/X, TikTok, YouTube, Pinterest |
| Platforms | iOS App Store, Google Play Store |

### SVG Icon Resources

1. **SVGL** - https://svgl.app/
   - Open source SVG logo library
   - Brand logos (tech companies, social media)
   - MIT License

2. **Simple Icons** - https://simpleicons.org/
   - 3000+ brand icons
   - CDN available
   - CC0 License

3. **Payment Icons** - https://github.com/aaronfagan/svg-credit-card-payment-icons
   - Credit card brand SVGs
   - Payment method icons

4. **Country Flags** - https://flagicons.lipis.dev/
   - ISO 3166-1-alpha-2 flags
   - SVG format

---

## 📋 Improvement Tasklist

### Phase 1: Critical Fixes (Week 1)

- [ ] **Fix Account Page Error** - Import `User` type correctly in `/account/page.tsx`
- [ ] **Fix Sell Page** - Add missing content and header to `/sell/page.tsx`
- [ ] **Brand Logo** - Create AMZN logo as SVG, add to header
- [ ] **Currency Consistency** - Ensure BGN (лв.) throughout when locale is Bulgarian
- [ ] **English Text Cleanup** - Translate remaining English strings to Bulgarian

### Phase 2: Icon System Upgrade (Week 2)

- [ ] **Install Phosphor Icons** - `pnpm add @phosphor-icons/react`
- [ ] **Create Icon Component Wrapper** - Centralized icon component with size variants
- [ ] **Replace Lucide Icons** - Gradual migration to Phosphor
- [ ] **Add Payment Icons** - Visa, Mastercard, PayPal, Apple Pay SVGs
- [ ] **Add Shipping Icons** - Carrier logos for Bulgaria (Speedy, Econt, etc.)
- [ ] **Create Brand Icon Set** - Custom SVG collection in `/public/icons/`

### Phase 3: Alibaba-Style Features (Weeks 3-4)

- [ ] **Product Grid Density** - Increase to 6+ products per row on desktop
- [ ] **Multi-Image Gallery** - Product image carousel with zoom
- [ ] **Quick View Modal** - Preview product without leaving search page
- [ ] **Supplier Badges** - Verified seller, years on platform indicators
- [ ] **Bulk Pricing Display** - Show tiered pricing (1-10 units, 11-50, 50+)
- [ ] **Request Quote (RFQ)** - Add "Contact Supplier" / "Request Quote" CTAs
- [ ] **Trust Badges Section** - "Secure Payment", "Buyer Protection", "Quality Assured"

### Phase 4: Desktop-Specific UX (Weeks 5-6)

- [ ] **Mega Menu Redesign** - Visual preview with images, not just text
- [ ] **Sticky Filters** - Keep filter sidebar visible on scroll
- [ ] **Compare Products** - Side-by-side comparison feature
- [ ] **Recently Viewed Bar** - Persistent footer widget
- [ ] **Keyboard Navigation** - Arrow key support in carousels
- [ ] **Search Autocomplete** - Visual dropdown with product images

### Phase 5: Accessibility Compliance (Ongoing)

- [ ] **Form Labels Audit** - Add missing `<label>` or `aria-label`
- [ ] **Autocomplete Attributes** - Add to all form inputs
- [ ] **Focus Indicators** - Ensure visible focus on all interactive elements
- [ ] **Screen Reader Testing** - Test with NVDA/JAWS
- [ ] **Color Contrast Verification** - Use axe DevTools to verify
- [ ] **Reduced Motion Support** - `prefers-reduced-motion` media query

### Phase 6: Performance & SEO (Future)

- [ ] **Page Titles** - Add unique `<title>` tags (currently empty)
- [ ] **Meta Descriptions** - Add to all pages
- [ ] **Structured Data** - Product schema for rich snippets
- [ ] **Image Optimization** - WebP format, responsive sizes
- [ ] **Core Web Vitals** - LCP, FID, CLS optimization

---

## 🔗 Icon Library Resources

### Recommended Open Source Icon Libraries

| Library | URL | License | Icons | Notes |
|---------|-----|---------|-------|-------|
| **Phosphor** | phosphoricons.com | MIT | 9000+ | Best for e-commerce |
| **Tabler** | tabler.io/icons | MIT | 4500+ | Clean stroke style |
| **Heroicons** | heroicons.com | MIT | 450+ | Tailwind team |
| **Feather** | feathericons.com | MIT | 287 | Simple & minimal |
| **Radix Icons** | icons.radix-ui.com | MIT | 300+ | Pairs with Radix UI |

### Brand/Logo SVG Resources

| Resource | URL | License | Content |
|----------|-----|---------|---------|
| **SVGL** | svgl.app | MIT | Tech & brand logos |
| **Simple Icons** | simpleicons.org | CC0 | Brand icons (3000+) |
| **Super Tiny Icons** | github.com/edent/SuperTinyIcons | MIT | Optimized brand SVGs |
| **Payment Icons** | github.com/aaronfagan/svg-credit-card-payment-icons | MIT | Payment method logos |
| **Flag Icons** | flagicons.lipis.dev | MIT | Country flags |

### E-commerce Specific Icon Packs

| Pack | Notes |
|------|-------|
| **Flaticon E-commerce** | flaticon.com/packs/e-commerce-91 (Freemium) |
| **Noun Project** | thenounproject.com (Attribution required) |
| **Streamline** | streamlinehq.com (Freemium, e-commerce sets) |
| **Iconscout** | iconscout.com (Freemium, large library) |

---

## 📝 Technical Debt Notes

1. **Middleware Deprecation Warning**: `"middleware" file convention is deprecated. Please use "proxy" instead`
2. **Build Warning**: Check server logs for hydration mismatches
3. **Console Warnings**: Input autocomplete attributes needed
4. **Test Products**: "Script Test Product" appearing in search - clean up seed data

---

## Conclusion

The AMZN platform has a solid technical foundation but needs significant UI/UX improvements to match modern B2B e-commerce standards like Alibaba.com. The priority should be:

1. **Fix broken pages** (Account, Sell)
2. **Upgrade icon system** (Phosphor + brand SVGs)
3. **Increase content density** (more products visible)
4. **Add trust signals** (badges, seller verification)
5. **Improve product experience** (gallery, variants, specs)

Estimated effort: **4-6 weeks** for full implementation with a small team.

---

*Audit performed with Playwright MCP browser automation on Windows desktop.*
