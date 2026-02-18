# Treido Project Map

> Generated 2026-02-17. Next.js 16 · React 19 · TypeScript · Tailwind v4 · Supabase · Stripe · next-intl (en/bg).  
> Deployed at treido.eu.

---

## 1. `app/[locale]/` — Route Groups & Pages

### Root Locale Layout (`app/[locale]/layout.tsx`)
- HTML shell, Inter font (latin + cyrillic), `<body>` with `bg-background`
- Wraps children in `<LocaleProviders>` (theme, cart, wishlist, currency, auth state)
- Generates static params for `['en', 'bg']`
- SEO metadata: Open Graph, Twitter, alternates for en/bg

### Shared Locale-Level Files
| File | Purpose |
|------|---------|
| `locale-providers.tsx` | Composes all global client providers |
| `error.tsx` | Locale-scoped error boundary UI |
| `loading.tsx` | Locale-scoped loading skeleton |
| `not-found.tsx` | Locale-scoped 404 page |

### `_components/` (locale-level shared, private)
Large collection of shared components scoped to locale routes:

| File | Purpose |
|------|---------|
| `app-header.tsx` | Main app header orchestrator |
| `storefront-layout.tsx` | Full storefront layout shell (header + footer + drawers) |
| `storefront-shell.tsx` | Inner storefront shell wrapper |
| `page-shell.tsx` | Reusable page shell with variant support (`default`, `muted`) |
| `mobile-tab-bar.tsx` | Bottom navigation bar for mobile |
| `site-footer.tsx` | Global site footer |
| `skip-links.tsx` | Accessibility skip links |
| `cookie-consent.tsx` | Cookie consent banner |
| `geo-welcome-modal.tsx` | Geolocation-based welcome modal |
| `guest-sell-cta.tsx` | CTA prompting guests to sell |
| `empty-state-cta.tsx` | Empty state with call-to-action |
| `error-boundary-ui.tsx` | Reusable error boundary component |
| `global-drawers.tsx` | Orchestrator for all global drawers |
| `deferred-storefront-ui.tsx` | Lazy-loaded storefront UI elements |
| `address-form.tsx` | Reusable address form |
| `category-browse-drawer.tsx` | Category browsing drawer |
| `auth/` | Auth-related locale components |
| `charts/` | Chart components |
| `drawers/` | Drawer components |
| `nav/` | Navigation components |
| `navigation/` | Navigation helpers |
| `orders/` | Order-related components |
| `providers/` | Scoped providers |
| `search/` | Search components |
| `seller/` | Seller-related components |

### `_providers/` (locale-level)
| File | Purpose |
|------|---------|
| `commerce-providers.tsx` | Cart + wishlist + currency context providers |
| `intl-client-provider.tsx` | Client-side i18n provider |
| `route-intl-provider.tsx` | Route-scoped i18n with namespace filtering |
| `theme-provider.tsx` | next-themes provider (light/dark) |

---

### `(main)/` — Homepage, Search, Cart, Public Pages

**Layout:** Full e-commerce storefront — header, footer, mega menus, cookie consent.  
Wraps with `StorefrontLayout` + `OnboardingProvider` + `RouteIntlProvider`.

| Route | Page Purpose |
|-------|-------------|
| `/` (`page.tsx`) | **Homepage** — discovery feed, category rails, deals |
| `/search` | **Product search** — filters, sort, grid/list view |
| `/cart` | **Shopping cart** — items, totals, checkout CTA |
| `/categories` | **Category index** — all categories listing |
| `/categories/[slug]` | **Category page** — products in category with filters |
| `/categories/[slug]/[subslug]` | **Subcategory page** — deeper category drill-down |
| `/wishlist` | **Wishlist** — saved products |
| `/wishlist/shared/[token]` | **Shared wishlist** — public wishlist via share link |
| `/sellers` | **Sellers directory** — browse all sellers |
| `/seller/settings/payouts` | **Seller payout settings** |
| `/todays-deals` | **Today's deals** — time-sensitive promotions |
| `/gift-cards` | **Gift cards** page |
| `/members` | **Members** — membership/loyalty page |
| `/about` | **About Treido** |
| `/accessibility` | **Accessibility statement** |
| `/assistant` | **AI shopping assistant** |

**Legal pages** (`(legal)/`):
`/cookies`, `/privacy`, `/returns`, `/terms`

**Support pages** (`(support)/`):
`/contact`, `/customer-service` (has _components), `/faq`, `/feedback`, `/security`

**`_components/`** (main-route private):
- `responsive-home.tsx`, `desktop-home.tsx`, `mobile-home.tsx` — responsive homepage variants
- `category/` — category display components
- `desktop/`, `mobile/` — device-specific components
- `filters/` — filter UI components
- `layout/` — layout helpers
- `search-controls/` — search control bar

**`_lib/`**: `mobile-rail-class-recipes.ts`, `pagination.ts`  
**`_providers/`**: `onboarding-provider.tsx`

---

### `(account)/` — User Account Dashboard

**Layout:** Auth-gated sidebar dashboard. Checks `getUser()`, redirects to login if unauthenticated. Uses `SidebarProvider` pattern with collapsible sidebar. Supports `@modal` parallel route for overlays.

| Route | Page Purpose |
|-------|-------------|
| `/account` | **Account home** — overview dashboard with stats, activity |
| `/account/orders` | **Order history** — list of orders |
| `/account/orders/[id]` | **Order detail** — single order view |
| `/account/addresses` | **Saved addresses** — manage shipping addresses |
| `/account/billing` | **Billing** — invoices and billing history |
| `/account/following` | **Following** — followed sellers |
| `/account/payments` | **Payment methods** — saved cards |
| `/account/plans` | **Subscription plans** — current plan |
| `/account/plans/upgrade` | **Plan upgrade** page |
| `/account/profile` | **Profile edit** — name, avatar, public profile |
| `/account/sales` | **Sales** — seller's completed sales (has _components) |
| `/account/security` | **Security settings** — password, 2FA |
| `/account/selling` | **My listings** — products currently selling |
| `/account/selling/edit` | **Edit listing** |
| `/account/selling/[id]` | **Single listing detail** |
| `/account/settings` | **General settings** |
| `/account/(settings)/notifications` | **Notification preferences** |
| `/account/wishlist` | **Account wishlist** (has _components) |

**`@modal/`**: Parallel route for modal overlays — `(.)account/` intercepting route + `default.tsx`  
**`_components/`**: 15 account UI components (sidebar, stats cards, hero card, badges, charts, plan cards, etc.)

---

### `(auth)/` — Authentication

**Layout:** Minimal `PageShell` — no header/footer, centered content.

| Route | Page Purpose |
|-------|-------------|
| `/auth/login` | **Login form** |
| `/auth/sign-up` | **Registration form** |
| `/auth/sign-up-success` | **Registration success** confirmation |
| `/auth/forgot-password` | **Password reset request** |
| `/auth/reset-password` | **Password reset form** |
| `/auth/welcome` | **Welcome page** post-registration |
| `/auth/error` | **Auth error** page |

**`_actions/`**: `auth.ts` — auth server actions  
**`_components/`**: `auth-card.tsx`, `login-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`, `welcome-client.tsx`

---

### `(sell)/` — Sell / Create Listing

**Layout:** Distraction-free (no header/footer). Performance measure guard for Stripe. `PageShell variant="muted"`.

| Route | Page Purpose |
|-------|-------------|
| `/sell` | **Create listing** — multi-step sell form |
| `/sell/orders` | **Seller orders** — manage incoming orders |

**`_actions/`**: `sell.ts` — sell form server actions  
**`_lib/`**: `types.ts` — sell form types

**`_components/`** (extensive sell form system):
- `sell-form-provider.tsx` — form state provider
- `sell-form-unified.tsx` — unified form component
- `sign-in-prompt.tsx` — auth gate for selling
- **`steps/`**: `step-what.tsx`, `step-category.tsx`, `step-details.tsx`, `step-pricing.tsx`, `step-layout.tsx`, `step-review.tsx`
- **`fields/`**: `title-field.tsx`, `description-field.tsx`, `category-field.tsx`, `photos-field.tsx`, `pricing-field.tsx`, `condition-field.tsx`, `brand-field.tsx`, `attributes-field.tsx`, `shipping-field.tsx`, `review-field.tsx`
- **`layouts/`**: `desktop-layout.tsx`, `mobile-layout.tsx`, `stepper-wrapper.tsx`
- **`ui/`**: `category-selector.tsx`, `upload-zone.tsx`, `brand-combobox.tsx`, `checklist-sidebar.tsx`, `image-preview-modal.tsx`, `payout-required-modal.tsx`, `photo-thumbnail.tsx`, `progress-header.tsx`, `select-drawer.tsx`, `sell-error-boundary.tsx`, `sell-section-skeleton.tsx`
- **`ai/`**: `ai-listing-assistant.tsx`
- **`layout/`**: `page-container.tsx`

---

### `(checkout)/` — Payment Flow

**Layout:** Minimal checkout layout — simplified header (logo + progress), no navigation, focused footer. Wraps with `CommerceProviders`.

| Route | Page Purpose |
|-------|-------------|
| `/checkout` | **Checkout page** — address, shipping, payment |
| `/checkout/success` | **Order confirmation** page |

**`_actions/`**: `checkout.ts` — checkout server actions  
**`_components/`**: `checkout-page-client.tsx`, `checkout-success-page-client.tsx`, `checkout-header.tsx`, `checkout-footer.tsx`, `address-section.tsx`, `shipping-method-section.tsx`, `order-items-section.tsx`, `checkout-types.ts`

---

### `(business)/` — Business Seller Dashboard

**Layout:** Auth-gated for business sellers. Checks `requireBusinessSeller()`, subscription status. Sidebar dashboard with `SidebarProvider`.

| Route | Page Purpose |
|-------|-------------|
| `/dashboard` | **Business dashboard home** — stats, quick actions |
| `/dashboard/orders` | **Manage orders** |
| `/dashboard/orders/[orderId]` | **Order detail** |
| `/dashboard/products` | **Product management** |
| `/dashboard/products/[productId]` | **Product detail/edit** |
| `/dashboard/analytics` | **Sales analytics** |
| `/dashboard/accounting` | **Accounting** |
| `/dashboard/customers` | **Customer management** |
| `/dashboard/discounts` | **Discount codes** |
| `/dashboard/inventory` | **Inventory management** |
| `/dashboard/marketing` | **Marketing tools** (has _components, _lib) |
| `/dashboard/settings` | **Business settings** |
| `/dashboard/upgrade` | **Upgrade subscription** |

**`_components/`**: 17 business dashboard components (sidebar, header, stats cards, quick actions, setup guide, activity feed, performance score, orders table, products table, product form modal, etc.)  
**`_lib/`**: Business dashboard utilities

---

### `(chat)/` — Messaging

**Layout:** Full-screen chat interface — fixed inset, no header/footer. Wraps with `CommerceProviders`.

| Route | Page Purpose |
|-------|-------------|
| `/chat` | **Messages list** — all conversations |
| `/chat/[conversationId]` | **Chat conversation** — real-time messaging |

**`_actions/`**: `report-conversation.ts`  
**`_components/`**: `messages-page-client.tsx`, `conversation-list.tsx`, `conversation-page-client.tsx`, `chat-interface.tsx`, `chat-skeleton.tsx`

---

### `(admin)/` — Admin Panel

**Layout:** Auth-gated for admins via `requireAdmin()`. Full sidebar dashboard with `SidebarProvider`.

| Route | Page Purpose |
|-------|-------------|
| `/admin` | **Admin dashboard home** — overview stats |
| `/admin/users` | **User management** |
| `/admin/products` | **Product moderation** |
| `/admin/orders` | **Order oversight** |
| `/admin/sellers` | **Seller management** |
| `/admin/docs` | **Admin documentation** (has _components) |
| `/admin/notes` | **Admin notes** (has _components) |
| `/admin/tasks` | **Admin tasks** (has _components) |

**`_components/`**: `admin-sidebar.tsx`, `admin-stats-cards.tsx`, `admin-recent-activity.tsx`, `dashboard-header.tsx`, `locale-switcher.tsx`

---

### `(plans)/` — Subscription Plans

**Layout:** Minimal — just `FullRouteIntlProvider`, no additional chrome.

| Route | Page Purpose |
|-------|-------------|
| `/plans` | **Pricing page** — subscription plan comparison |

**`_components/`**: `plans-page-client.tsx`, `pricing-card.tsx`, `minimal-header.tsx`

---

### `(onboarding)/` — Post-Signup Onboarding

**Layout:** Auth-gated, centered muted page. Forces `connection()` (dynamic). Redirects to login if unauthenticated.

| Route | Page Purpose |
|-------|-------------|
| `/onboarding` | **Onboarding start** |
| `/onboarding/account-type` | **Choose account type** (buyer/seller/business) |
| `/onboarding/profile` | **Set up profile** |
| `/onboarding/business-profile` | **Business profile setup** |
| `/onboarding/interests` | **Select interests** |
| `/onboarding/complete` | **Onboarding complete** |

**`_components/`**: `account-type-card.tsx`, `interest-chip.tsx`, `onboarding-shell.tsx`

---

### `[username]/` — Public Seller Profiles & Products

**Layout:** Full storefront layout (header + footer). Scoped i18n with `USERNAME_ROUTE_INTL_NAMESPACES`.

| Route | Page Purpose |
|-------|-------------|
| `/[username]` | **Seller storefront** — public profile, product grid |
| `/[username]/[productSlug]` | **Product detail page (PDP)** — images, description, reviews, add to cart |

**`_components/`**: `follow-seller-button.tsx`, `seller-verification-badge.tsx`, `profile/` subdirectory  
**`[productSlug]/_components/`**: PDP-specific components

---

### `app/[locale]/api/onboarding/` — Locale-scoped API
Contains onboarding API logic.

---

## 2. `app/actions/` — Server Actions

| File | Purpose |
|------|---------|
| `blocked-users.ts` | Block/unblock users |
| `boosts.ts` | Product listing boost actions |
| `buyer-feedback.ts` | Submit buyer feedback |
| `onboarding.ts` | Onboarding flow actions |
| `orders.ts` | Order management (update status, return requests) |
| `payments.ts` | Payment method management |
| `products.ts` | Product CRUD, publish/unpublish |
| `profile.ts` | Profile update actions |
| `reviews.ts` | Product review submission |
| `seller-feedback.ts` | Seller feedback actions |
| `seller-follows.ts` | Follow/unfollow sellers |
| `subscriptions.ts` | Subscription checkout session creation |
| `username.ts` | Username availability check/update |

---

## 3. `app/api/` — API Routes

### Products
| Route | Purpose |
|-------|---------|
| `products/feed/route.ts` | Product feed (paginated, algorithmic) |
| `products/search/route.ts` | Product search endpoint |
| `products/newest/route.ts` | Newest products |
| `products/count/route.ts` | Product count for filters |
| `products/quick-view/route.ts` | Quick view data for product cards |
| `products/category/[slug]/route.ts` | Products by category |
| `products/[id]/view/` | Product view tracking |

### Categories
| Route | Purpose |
|-------|---------|
| `categories/route.ts` | Category list |
| `categories/attributes/` | Category attribute definitions |
| `categories/counts/` | Product counts per category |
| `categories/products/` | Products within categories |
| `categories/sell-tree/` | Category tree for sell form |
| `categories/[slug]/` | Single category data |

### Auth & Payments
| Route | Purpose |
|-------|---------|
| `auth/sign-out/` | Sign out endpoint |
| `auth/callback/`, `auth/confirm/` | OAuth callback/email confirm (at `app/auth/`) |
| `checkout/webhook/route.ts` | Stripe checkout webhook |
| `payments/webhook/route.ts` | Stripe payments webhook |
| `payments/setup/route.ts` | Setup payment method |
| `payments/delete/route.ts` | Delete payment method |
| `payments/set-default/route.ts` | Set default payment method |
| `connect/dashboard/route.ts` | Stripe Connect dashboard link |
| `connect/onboarding/route.ts` | Stripe Connect onboarding |
| `connect/webhook/route.ts` | Stripe Connect webhook |

### Subscriptions
| Route | Purpose |
|-------|---------|
| `subscriptions/checkout/route.ts` | Create subscription checkout session |
| `subscriptions/portal/route.ts` | Customer portal link |
| `subscriptions/webhook/route.ts` | Subscription webhook handler |

### Other
| Route | Purpose |
|-------|---------|
| `badges/route.ts` | User badges list |
| `badges/evaluate/` | Badge evaluation logic |
| `badges/feature/` | Feature badges |
| `badges/[userId]/` | Badges for a specific user |
| `billing/invoices/` | Billing invoices |
| `boost/checkout/` | Boost checkout session |
| `health/env/`, `health/ready/` | Health check endpoints |
| `orders/[id]/` | Order detail API |
| `plans/route.ts` | Plans list |
| `revalidate/route.ts` | Cache revalidation trigger |
| `sales/export/` | Sales export |
| `seller/limits/` | Seller listing limits |
| `admin/docs/` | Admin-only documentation API |
| `assistant/chat/` | AI chat endpoint |
| `assistant/find-similar/` | AI find similar products |
| `assistant/sell-autofill/` | AI autofill for sell form |
| `upload-image/route.ts` | Image upload to Supabase Storage |
| `upload-chat-image/route.ts` | Chat image upload |
| `wishlist/[token]/` | Shared wishlist by token |

---

## 4. `components/` — Reusable Components

### `ui/` — shadcn/ui Primitives (36 files)
No domain logic. Pure presentation components.

`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `card`, `checkbox`, `command`, `dialog`, `drawer`, `dropdown-menu`, `hover-card`, `icon-button`, `input`, `label`, `mobile-bottom-nav`, `pagination`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `slider`, `switch`, `table`, `tabs`, `textarea`, `toggle-group`, `toggle`, `tooltip`

### `shared/` — Cross-Route Composites
| Path | Contents |
|------|----------|
| `count-badge.tsx` | Numeric badge component |
| `dropdown-product-item.tsx` | Product item in dropdown menus |
| `field.tsx` | Reusable form field wrapper |
| `user-avatar.tsx` | User avatar with fallback |
| **`filters/`** | Complete filter system |
| ├ `filter-hub.tsx` | Filter orchestrator |
| ├ `sort-modal.tsx` | Sort options modal |
| ├ `config/filter-attribute-config.ts` | Filter attribute configuration |
| ├ `controls/` | `color-swatches`, `filter-checkbox-item`, `filter-list`, `filter-radio-group`, `price-slider`, `size-tiles` |
| ├ `sections/` | `filter-attribute-section-content`, `filter-availability-section`, `filter-category-section`, `filter-rating-section` |
| └ `state/use-pending-filters.ts` | Filter state hook |
| **`product/`** | Product display components |
| ├ `product-price.tsx` | Price display |
| ├ `freshness-indicator.tsx` | New/trending indicator |
| ├ `verified-seller-badge.tsx` | Verified seller badge |
| ├ `_lib/` | Product component utilities |
| ├ `card/` | `desktop.tsx`, `mobile.tsx`, `mini.tsx`, `list.tsx`, `image.tsx`, `price.tsx`, `actions.tsx`, `social-proof.tsx`, `types.ts` |
| ├ `pdp/category-badge.tsx` | Product detail category badge |
| └ `quick-view/` | `product-quick-view-content.tsx`, desktop/mobile content, image gallery, seller card, skeleton |
| **`search/`** | Search components |
| ├ `ai/` | AI-powered search |
| └ `overlay/` | Search overlay |
| **`wishlist/`** | `mobile-wishlist-button.tsx`, `wishlist-drawer.tsx` |

### `layout/` — Layout Components
| Path | Contents |
|------|----------|
| **`header/`** | Header system |
| ├ `types.ts` | Header type definitions |
| ├ `cart/` | `cart-dropdown.tsx`, `mobile-cart-dropdown.tsx` |
| ├ `desktop/` | `standard-header.tsx`, `minimal-header.tsx`, `desktop-search.tsx` |
| └ `mobile/` | `homepage-header.tsx`, `contextual-header.tsx`, `minimal-header.tsx`, `product-header.tsx`, `profile-header.tsx` |
| **`sidebar/`** | `sidebar.tsx`, `sidebar-menu.tsx` |

### `mobile/` — Mobile-Specific Components
| Path | Contents |
|------|----------|
| `category-nav/` | `category-pill-rail.tsx`, `category-drawer-context.tsx`, `filter-sort-bar.tsx` |
| `chrome/` | `mobile-control-recipes.ts` |
| `drawers/` | `account-drawer.tsx`, `auth-drawer.tsx`, `cart-drawer.tsx`, `messages-drawer.tsx`, `product-quick-view-drawer.tsx` |

### `desktop/` — Desktop-Specific Components
| File | Purpose |
|------|---------|
| `category-attribute-dropdowns.tsx` | Category attribute filter dropdowns |
| `feed-toolbar.tsx` | Desktop feed toolbar |
| `feed-toolbar-pill.ts` | Feed toolbar pill styling |
| `quick-filter-pills.tsx` | Quick filter pill chips |

### `grid/` — Grid Components
| File | Purpose |
|------|---------|
| `product-grid.tsx` | Responsive product grid |
| `index.ts` | Barrel export |

### `dropdowns/` — Dropdown Menus
| File | Purpose |
|------|---------|
| `account-dropdown.tsx` | Account menu dropdown |
| `messages-dropdown.tsx` | Messages dropdown |
| `wishlist-dropdown.tsx` | Wishlist dropdown |

### `providers/` — Context Providers
| File | Purpose |
|------|---------|
| `auth-state-manager.tsx` | Auth state management |
| `cart-context.tsx` | Shopping cart context |
| `currency-context.tsx` | Currency selection context |
| `drawer-context.tsx` | Drawer open/close state |
| `header-context.tsx` | Header state context |
| `message-context.tsx` | Messaging context |
| `wishlist-context.tsx` | Wishlist context |
| `messages/` | `use-messages-actions.ts`, `use-messages-realtime.ts`, `use-messages-state.ts` |
| `_lib/analytics-drawer.ts` | Drawer analytics helper |

### `auth/` — Auth Form Bodies
| File | Purpose |
|------|---------|
| `login-form-body.tsx` | Login form body content |
| `sign-up-form-body.tsx` | Sign-up form body content |
| `submit-button.tsx` | Auth submit button with loading |

---

## 5. `lib/` — Utilities & Core Logic

### Supabase (`lib/supabase/`)
| File | Purpose |
|------|---------|
| `client.ts` | Browser Supabase client |
| `server.ts` | Server-side Supabase client |
| `shared.ts` | Shared Supabase utilities |
| `middleware.ts` | Supabase session middleware |
| `database.types.ts` | Auto-generated DB types |
| `messages.ts` | Supabase messaging helpers |
| `selects/` | `billing.ts`, `categories.ts`, `products.ts` — typed select projections |

### Auth (`lib/auth/`)
| File | Purpose |
|------|---------|
| `require-auth.ts` | `requireAuth()` — server action auth gate |
| `server-actions.ts` | Auth helpers for server actions |
| `admin.ts` | `requireAdmin()` — admin role check |
| `business.ts` | `requireBusinessSeller()`, subscription checks |

### Data Fetching (`lib/data/`) — Server-only, cached
| File | Purpose |
|------|---------|
| `categories.ts` | Category data fetching |
| `category-attributes.ts` | Category attribute data |
| `plans.ts` | Subscription plans data |
| `product-page.ts` | PDP data fetching |
| `product-reviews.ts` | Product reviews data |
| `products.ts` | Products list data |
| `profile-page.ts` | Profile page data |

### Validation (`lib/validation/`)
| File | Purpose |
|------|---------|
| `auth.ts` | Auth form validation schemas (Zod) |
| `orders.ts` | Order validation schemas |
| `password-strength.ts` | Password strength checker |

### Types (`lib/types/`)
| File | Purpose |
|------|---------|
| `badges.ts` | Badge type definitions |
| `categories.ts` | Category types |
| `messages.ts` | Message/chat types |
| `products.ts` | Product types |

### AI (`lib/ai/`)
| File | Purpose |
|------|---------|
| `env.ts` | AI environment config |
| `models.ts` | AI model definitions |
| `safe-url.ts` | Safe URL validation for AI |
| `schemas/` | `find-similar.ts`, `listings.ts`, `sell-autofill.ts` — AI schema definitions |
| `tools/` | `assistant-tools.ts`, `get-listing.ts`, `search-listings.ts` — AI tool implementations |

### Filters (`lib/filters/`)
| File | Purpose |
|------|---------|
| `active-filter-count.ts` | Count active filters |
| `category-attribute.ts` | Category attribute filter logic |
| `pending-attributes.ts` | Pending attribute filter state |

### API (`lib/api/`)
| File | Purpose |
|------|---------|
| `envelope.ts` | Standardized API response envelope |
| `response-helpers.ts` | API response utilities |

### Cache (`lib/cache/`)
| File | Purpose |
|------|---------|
| `revalidate-profile-tags.ts` | Profile cache tag revalidation |

### Other Modules
| File | Purpose |
|------|---------|
| `stripe.ts` | Stripe client initialization |
| `stripe-connect.ts` | Stripe Connect utilities |
| `stripe-locale.ts` | Stripe locale mapping |
| `currency.ts` | Currency formatting |
| `format-price.ts` | Price formatting utilities |
| `price-formatting.ts` | Additional price formatting |
| `env.ts` | Environment variable getters |
| `feature-flags.ts` | Feature flags |
| `geolocation.ts` | Geolocation detection |
| `shipping.ts` | Shipping region/rate logic |
| `logger.ts` | Structured logger |
| `structured-log.ts` | Structured logging helpers |
| `safe-json.ts` | Safe JSON parse/stringify |
| `utils.ts` | General utilities (cn, etc.) |
| `url-utils.ts` | URL manipulation |
| `image-utils.ts` | Image URL utilities |
| `image-compression.ts` | Client-side image compression |
| `normalize-image-url.ts` | Normalize image URLs |
| `category-tree.ts` | Category tree builder |
| `category-display.ts` | Category display names |
| `order-status.ts` | Order status labels/colors |
| `order-conversations.ts` | Order-related conversations |
| `home-pools.ts` | Homepage pool configuration |
| `home-browse-href.ts` | Homepage browse link builder |
| `guest-sell-cta.ts` | Guest sell CTA logic |
| `public-docs.ts` | Public documentation helpers |
| `avatar-palettes.ts` | Avatar color palettes |
| `bulgarian-cities.ts` | Bulgarian city list |
| `navigation/mobile-tab-bar.ts` | Mobile tab bar config |
| `next/is-next-prerender-interrupted.ts` | Next.js prerender detection |
| `i18n/scoped-messages.ts` | Scoped i18n namespace lists |
| `ui/badge-intent.ts` | Badge intent/variant mapping |
| `badges/category-badge-specs.ts` | Category badge specifications |
| `boost/boost-status.ts` | Boost status logic |
| `sell/schema.ts` | Sell form Zod schema |
| `upload/image-upload.ts` | Image upload utilities |
| `utils/category-type.ts` | Category type helpers |
| `view-models/product-page.ts` | PDP view model |
| `attributes/normalize-attribute-key.ts` | Attribute key normalization |

---

## 6. `hooks/` — Shared React Hooks

| File | Purpose |
|------|---------|
| `use-badges.ts` | Fetch/cache user badges |
| `use-category-attributes.ts` | Category attributes for filters |
| `use-category-counts.ts` | Product counts per category |
| `use-filter-count.ts` | Active filter count |
| `use-geo-welcome.ts` | Geolocation welcome modal logic |
| `use-home-discovery-feed.ts` | Homepage discovery feed data |
| `use-instant-category-browse.ts` | Instant category browsing |
| `use-is-mobile.ts` | Mobile viewport detection |
| `use-notification-count.ts` | Unread notification count |
| `use-product-quick-view-details.ts` | Quick view product data |
| `use-product-search.ts` | Product search with debounce |
| `use-recently-viewed.ts` | Recently viewed products |
| `use-toast.ts` | Toast notification hook (Sonner) |
| `use-view-mode.ts` | Grid/list view mode toggle |

---

## 7. `i18n/` — Internationalization Config

| File | Purpose |
|------|---------|
| `routing.ts` | Locale routing config (en/bg, always prefix, locale cookie). Exports `Link`, `redirect`, `usePathname`, `useRouter`. |
| `request.ts` | Request-scoped i18n config — message loading, timezone (Europe/Sofia), formats (currency EUR, dates, numbers), error handling for missing translations. |

---

## 8. `messages/` — Translation Files

| File | Purpose |
|------|---------|
| `en.json` | English translations |
| `bg.json` | Bulgarian translations |

---

## 9. `refactor/` — Orchestration System

| File | Purpose |
|------|---------|
| `AGENTS.md` | Refactor-scoped agent instructions |
| `CURRENT.md` | Session continuity file (updated every session) |
| `shared-rules.md` | Mandatory rules for all refactor agents |
| `log.md` | Append-only session history |
| `tasks.md` | Progress tracker with metrics |
| `phase1/` | Phase 1 (Discovery Audit) — `agent1.md`, `agent2.md`, `agent3.md`, `README.md` |
| `phase2/` | Phase 2 (Client Boundary & Bundle) — same structure |
| `phase3/` | Phase 3 (Data & Performance) — same structure |
| `phase4/` | Phase 4 (Polish & Completeness) — same structure |

---

## 10. `docs/` — Documentation

| File | Purpose |
|------|---------|
| `DECISIONS.md` | Decision log (append-only, DEC-NNN format) |
| `DESIGN.md` | UI/styling guide — Tailwind v4, semantic tokens, design system |
| `DOMAINS.md` | Domain documentation — auth, DB, payments, i18n, API |
| **`features/`** | Feature-specific documentation |
| ├ `auth.md` | Auth feature doc |
| ├ `bottom-nav.md` | Bottom navigation doc |
| ├ `checkout-payments.md` | Checkout & payments doc |
| ├ `header.md` | Header feature doc |
| ├ `product-cards.md` | Product cards doc |
| ├ `search-filters.md` | Search & filters doc |
| ├ `sell-flow.md` | Sell flow doc |
| └ `TEMPLATE.md` | Feature doc template |
| **`generated/`** | `db-schema.md` — auto-generated DB schema doc |
| **`public/`** | Public-facing docs |
| ├ `00-INDEX.md` | Documentation index |
| ├ `help/` | Help docs |
| ├ `legal/` | Legal documents |
| └ `policies/` | Policy documents |

---

## 11. `scripts/` — Build & Quality Scripts

| File | Purpose |
|------|---------|
| `next-build.mjs` | Custom Next.js build script |
| `run-playwright.mjs` | Playwright test runner wrapper |
| `playwright-web-server.mjs` | Playwright web server setup |
| `generate-db-schema.mjs` | Generate DB schema documentation |
| `architecture-scan.mjs` | Architecture boundary scanner (client boundary, oversized, routes, duplicates) |
| `architecture-gate.baseline.json` | Architecture scan baseline |
| `ts-safety-gate.mjs` | TypeScript safety gate (counts `any`, `!`, unsafe patterns) |
| `ts-safety-gate.baseline.json` | TS safety baseline |
| `scan-tailwind-palette.mjs` | Scan for forbidden palette/raw color classes |
| `scan-tailwind-arbitrary.mjs` | Scan for arbitrary Tailwind values |
| `scan-tailwind-semantic-tokens.mjs` | Validate semantic token usage |
| `scan-tailwind-token-alpha.mjs` | Scan for alpha opacity token issues |
| `scan-mobile-chrome-consistency.mjs` | Mobile chrome consistency check |
| `scan-control-overrides.mjs` | Scan for control override patterns |
| `clean-artifacts.mjs` | Clean build artifacts |
| `clear-next-dev-lock.mjs` | Clear Next.js dev server lock file |

---

## 12. `supabase/` — Database & Edge Functions

### Migrations (`supabase/migrations/`) — 70+ migration files
Key milestones (chronological):
- `20240101000000` — Initial schema
- `20251124000000` — Production-ready schema
- `20251127000000` — Product variants, SEO, messaging, wishlists
- `20251201000000` — Seller tiers, subscriptions, addresses, payments
- `20251203000000` — Product attributes, category restructure
- `20251211000000` — Seller feedback, store followers
- `20251213000000` — Chat optimization, enhanced subscription plans
- `20251214000000` — Notifications, blocked users, fee structure, reviews
- `20251215000000` — Avatars storage, security fixes, unified profiles
- `20251217-19` — Security/performance audit fixes
- `20251224-27` — Notification preferences, cart/wishlist hardening
- `20260101-03` — Function search path fixes, stock triggers, variants
- `20260106` — Subscription plan Stripe price IDs
- `20260110` — Seller setup, shipping, return requests
- `20260112` — Category stats view
- `20260114` — Listing boosts, idempotency, currency
- `20260120-25` — Buyer protection, admin ops, boost prices, RLS hardening
- `20260129-31` — Security definer RPCs, webhook idempotency
- `20260202` — Products negotiable field
- `20260204` — Category attributes (inherit, scope, sync)

### Schema Files
- `schema.sql` — Full schema dump
- `seed.sql` — Development seed data
- `seed_categories.sql` — Category seed data

### Edge Functions (`supabase/functions/`)
- `ai-shopping-assistant/index.ts` — AI shopping assistant (Deno-based edge function)
- `.temp/` — Temporary function build artifacts

---

## 13. Root Config Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js 16 config — cacheComponents, cacheLife profiles (categories/products/deals/user/max), image optimization, typed routes, bundle analyzer, SEO redirects |
| `tsconfig.json` | TypeScript — strict mode, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `@/*` path alias |
| `eslint.config.mjs` | ESLint v9 flat config — next/core-web-vitals + typescript + sonarjs + unicorn. Route boundary enforcement, component layer rules |
| `vitest.config.ts` | Vitest (jsdom) — UI component tests (`.tsx`), coverage thresholds (80/70/60/80) |
| `vitest.hooks.config.ts` | Vitest (jsdom) — Hook tests only (`__tests__/hooks/`) |
| `vitest.node.config.ts` | Vitest (node) — Pure logic tests (`.ts`), same coverage thresholds |
| `playwright.config.ts` | Playwright E2E config |
| `postcss.config.mjs` | PostCSS with `@tailwindcss/postcss` (Tailwind v4) |
| `components.json` | shadcn/ui config — new-york style, RSC, lucide icons, aliases |
| `knip.json` | Knip unused code detection config |
| `proxy.ts` | **Next.js 16 middleware (proxy)** — i18n routing, geo-detection, session management |
| `package.json` | Dependencies: Next 16.1.4, React 19.2.3, Stripe 20.2.0, ai 6.0.49, Supabase SSR 0.8.0, Tailwind 4.1.18, Zod 4.3.5 |
| `AGENTS.md` | Agent instructions — project identity, conventions, constraints |
| `ARCHITECTURE.md` | Architecture documentation — modules, caching, client selection |
| `TASKS.md` | Active non-refactor work tracker |
| `REFACTOR.md` | Refactor overview |
| `REQUIREMENTS.md` | Product requirements |

---

## 14. `__tests__/` — Unit Tests

### Root-level tests (42 files)
Architecture, auth, badges, cart, categories, checkout, currency, env parsing, filters, formatting, geolocation, home pools, i18n parity, image utils, mobile tab bar, normalization, orders, product cards (desktop/mobile/mini), product grid, product price, proxy, safe-json, shipping, Stripe Connect, URL utils, validations.

### `__tests__/api/` — API route tests
- `products-newest-route.test.ts`

### `__tests__/hooks/` — Hook tests (7 files)
`use-badges`, `use-geo-welcome`, `use-home-discovery-feed`, `use-is-mobile`, `use-product-search`, `use-recently-viewed`, `use-toast`

---

## 15. `e2e/` — End-to-End Tests (Playwright)

| File | Purpose |
|------|---------|
| `smoke.spec.ts` | Core smoke tests |
| `home.spec.ts` | Homepage tests |
| `auth.spec.ts` | Auth flow tests |
| `account.spec.ts` | Account page tests |
| `profile.spec.ts` | Profile tests |
| `orders.spec.ts` | Order flow tests |
| `reviews.spec.ts` | Review tests |
| `seller-routes.spec.ts` | Seller route tests |
| `seller-create-listing.spec.ts` | Create listing flow |
| `boost-checkout.spec.ts` | Boost checkout tests |
| `header-drawers.spec.ts` | Header drawer interactions |
| `drawer-header-sticky.spec.ts` | Sticky header in drawers |
| `mobile-browse-filters.spec.ts` | Mobile filter tests |
| `mobile-browse-mode.spec.ts` | Mobile browse mode |
| `mobile-home-feed-controls.spec.ts` | Mobile home feed |
| `mobile-responsiveness.spec.ts` | Mobile responsive tests |
| `modal-routing.spec.ts` | Modal routing tests |
| `accessibility.spec.ts` | Accessibility audit |
| `global-setup.ts` | Global E2E setup |
| `fixtures/` | Test fixtures |
| `assets/` | Test assets |

---

## 16. `test/` — Test Infrastructure

| File | Purpose |
|------|---------|
| `setup.ts` | Vitest global setup |
| `shims/` | Module shims (`server-only`, `client-only`) for test env |

---

## Summary Statistics

- **Route groups:** 10 (`main`, `account`, `auth`, `sell`, `checkout`, `business`, `chat`, `admin`, `plans`, `onboarding`) + `[username]` dynamic
- **Pages:** ~65+ distinct page.tsx files
- **Server actions:** 13 files
- **API routes:** ~40+ endpoints
- **Components:** ~36 ui primitives, ~30 shared, ~10 layout, ~15 mobile, ~5 desktop, ~8 providers
- **Hooks:** 14 shared hooks
- **Lib modules:** ~50+ files across 15+ subdirectories
- **DB migrations:** 70+ migration files
- **Tests:** ~42 unit tests, 7 hook tests, 1 API test, 18 E2E specs
- **Scripts:** 16 quality/build scripts
- **i18n:** 2 locales (en, bg), scoped namespaces
