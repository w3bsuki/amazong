# Components Audit

Generated: 2026-02-09T11:45:38.421Z

## Snapshot

- Total directories in `components/`: 38
- Total files in `components/`: 148
- Code files in `components/`: 148
- Used files: 148
- Unused files: 0
- Status rule: `used` means static inbound import/export/require count >= 1.
- `used` != `well-structured`; architecture findings are listed below.

## Top-Level Summary

| Folder | Dirs | Files | Used | Unused |
| --- | ---: | ---: | ---: | ---: |
| `(root)` | 1 | 0 | 0 | 0 |
| `auth` | 1 | 4 | 4 | 0 |
| `desktop` | 1 | 4 | 4 | 0 |
| `dropdowns` | 1 | 4 | 4 | 0 |
| `grid` | 1 | 2 | 2 | 0 |
| `layout` | 6 | 15 | 15 | 0 |
| `mobile` | 3 | 10 | 10 | 0 |
| `providers` | 3 | 12 | 12 | 0 |
| `shared` | 20 | 61 | 61 | 0 |
| `ui` | 1 | 36 | 36 | 0 |

## Architecture Findings

### 1) Large Single-Use Components

| LOC | File | Single Importer |
| ---: | --- | --- |
| 443 | `components/layout/header/desktop/desktop-search.tsx` | `components/layout/header/desktop/standard-header.tsx` |
| 415 | `components/mobile/drawers/account-drawer.tsx` | `components/mobile/drawers/index.ts` |
| 316 | `components/shared/product/card/list.tsx` | `components/grid/product-grid.tsx` |
| 259 | `components/shared/product/quick-view/quick-view-image-gallery.tsx` | `components/shared/product/quick-view/product-quick-view-content.tsx` |
| 239 | `components/mobile/drawers/messages-drawer.tsx` | `components/mobile/drawers/index.ts` |
| 232 | `components/mobile/category-nav/category-circles-simple.tsx` | `components/mobile/category-nav/index.ts` |
| 230 | `components/mobile/drawers/auth-drawer.tsx` | `components/mobile/drawers/index.ts` |
| 214 | `components/providers/messages/use-messages-actions.ts` | `components/providers/message-context.tsx` |
| 208 | `components/mobile/drawers/cart-drawer.tsx` | `components/mobile/drawers/index.ts` |
| 206 | `components/shared/category/category-circle.tsx` | `components/layout/header/mobile/contextual-header.tsx` |
| 203 | `components/layout/header/cart/cart-dropdown.tsx` | `components/layout/header/desktop/standard-header.tsx` |
| 198 | `components/providers/messages/use-messages-realtime.ts` | `components/providers/message-context.tsx` |
| 193 | `components/dropdowns/account-dropdown.tsx` | `components/dropdowns/index.ts` |
| 189 | `components/shared/wishlist/wishlist-drawer.tsx` | `components/shared/wishlist/mobile-wishlist-button.tsx` |
| 186 | `components/desktop/category-attribute-dropdowns.tsx` | `components/desktop/feed-toolbar.tsx` |
| 173 | `components/layout/header/mobile/product-header.tsx` | `components/layout/header/mobile/index.ts` |
| 164 | `components/shared/filters/controls/price-slider.tsx` | `components/shared/filters/filter-hub.tsx` |
| 160 | `components/shared/profile/profile-settings-panel.tsx` | `components/shared/profile/index.ts` |
| 155 | `components/dropdowns/messages-dropdown.tsx` | `components/dropdowns/index.ts` |
| 150 | `components/mobile/drawers/product-quick-view-drawer.tsx` | `components/mobile/drawers/index.ts` |
| 146 | `components/shared/filters/state/use-pending-filters.ts` | `components/shared/filters/filter-hub.tsx` |
| 144 | `components/shared/filters/controls/color-swatches.tsx` | `components/shared/filters/sections/filter-attribute-section-content.tsx` |
| 142 | `components/providers/_lib/analytics-drawer.ts` | `components/providers/drawer-context.tsx` |
| 140 | `components/ui/pagination.tsx` | `app/[locale]/(main)/_components/search-controls/search-pagination.tsx` |
| 135 | `components/layout/header/mobile/profile-header.tsx` | `components/layout/header/mobile/index.ts` |
| 132 | `components/shared/filters/sort-modal.tsx` | `components/mobile/category-nav/filter-sort-bar.tsx` |
| 130 | `components/dropdowns/wishlist-dropdown.tsx` | `components/dropdowns/index.ts` |
| 127 | `components/shared/filters/sections/filter-attribute-section-content.tsx` | `components/shared/filters/filter-hub.tsx` |
| 126 | `components/shared/product/product-price.tsx` | `__tests__/product-price.test.tsx` |
| 123 | `components/layout/header/mobile/contextual-header.tsx` | `components/layout/header/mobile/index.ts` |
| 122 | `components/shared/filters/controls/filter-list.tsx` | `components/shared/filters/sections/filter-attribute-section-content.tsx` |
| 121 | `components/shared/profile/profile-shell.tsx` | `components/shared/profile/index.ts` |
| 112 | `components/ui/breadcrumb.tsx` | `components/shared/navigation/app-breadcrumb.tsx` |
| 98 | `components/desktop/quick-filter-pills.tsx` | `components/desktop/feed-toolbar.tsx` |
| 93 | `components/layout/header/desktop/standard-header.tsx` | `components/layout/header/desktop/index.ts` |
| 92 | `components/shared/product/quick-view/quick-view-seller-card.tsx` | `components/shared/product/quick-view/product-quick-view-content.tsx` |
| 92 | `components/shared/profile/profile-tabs.tsx` | `components/shared/profile/index.ts` |
| 75 | `components/shared/dropdown-product-item.tsx` | `components/dropdowns/wishlist-dropdown.tsx` |
| 75 | `components/shared/filters/sections/filter-category-section.tsx` | `components/shared/filters/filter-hub.tsx` |
| 74 | `components/shared/product/card/social-proof.tsx` | `components/shared/product/card/desktop.tsx` |
| 66 | `components/ui/toast.tsx` | `hooks/use-toast.ts` |
| 65 | `components/shared/filters/controls/size-tiles.tsx` | `components/shared/filters/sections/filter-attribute-section-content.tsx` |
| 62 | `components/shared/profile/profile-header-sync.tsx` | `components/shared/profile/index.ts` |
| 60 | `components/layout/header/mobile/homepage-header.tsx` | `components/layout/header/mobile/index.ts` |
| 57 | `components/shared/locale-switcher.tsx` | `app/[locale]/(admin)/_components/dashboard-header.tsx` |
| 54 | `components/shared/filters/sections/filter-rating-section.tsx` | `components/shared/filters/filter-hub.tsx` |
| 52 | `components/shared/profile/profile-stats.tsx` | `components/shared/profile/index.ts` |
| 38 | `components/shared/modal.tsx` | `app/[locale]/(account)/@modal/(.)account/plans/upgrade/page.tsx` |
| 30 | `components/shared/filters/sections/filter-availability-section.tsx` | `components/shared/filters/filter-hub.tsx` |
| 28 | `components/ui/toggle.tsx` | `components/ui/toggle-group.tsx` |

### 2) App-Only Components Under Global `components/`

| Refs | LOC | File |
| ---: | ---: | --- |
| 12 | 750 | `components/layout/sidebar/sidebar.tsx` |
| 2 | 192 | `components/ui/command.tsx` |
| 19 | 185 | `components/ui/select.tsx` |
| 5 | 165 | `components/shared/empty-state-cta.tsx` |
| 1 | 140 | `components/ui/pagination.tsx` |
| 19 | 126 | `components/shared/navigation/app-breadcrumb.tsx` |
| 13 | 121 | `components/shared/error-boundary-ui.tsx` |
| 14 | 97 | `components/ui/table.tsx` |
| 55 | 74 | `components/shared/page-shell.tsx` |
| 4 | 70 | `components/shared/auth/auth-gate-card.tsx` |
| 10 | 69 | `components/ui/accordion.tsx` |
| 2 | 67 | `components/ui/alert.tsx` |
| 2 | 66 | `components/shared/orders/order-status-badge.tsx` |
| 11 | 59 | `components/ui/scroll-area.tsx` |
| 1 | 57 | `components/shared/locale-switcher.tsx` |
| 2 | 49 | `components/shared/page-container.tsx` |
| 4 | 47 | `components/auth/auth-card.tsx` |
| 1 | 38 | `components/shared/modal.tsx` |
| 7 | 37 | `components/ui/progress.tsx` |
| 1 | 22 | `components/shared/spinner.tsx` |
| 16 | 20 | `components/ui/textarea.tsx` |
| 4 | 15 | `components/mobile/category-nav/index.ts` |
| 1 | 12 | `components/providers/theme-provider.tsx` |
| 4 | 10 | `components/grid/index.ts` |
| 1 | 7 | `components/layout/header/mobile/index.ts` |
| 1 | 6 | `components/mobile/drawers/index.ts` |
| 1 | 6 | `components/shared/profile/index.ts` |
| 1 | 4 | `components/layout/header/desktop/index.ts` |

## Full Component Map

| Path | Type | Status | Inbound Refs | Importers (sample) | Notes |
| --- | --- | --- | ---: | --- | --- |
| `components` | dir | used | - | - | 148 used / 0 unused files |
| `components/auth` | dir | used | - | - | 4 used / 0 unused files |
| `components/auth/auth-card.tsx` | file | used | 4 | `app/[locale]/(auth)/_components/forgot-password-form.tsx, app/[locale]/(auth)/_components/login-form.tsx, app/[locale]/(auth)/_components/sign-up-form.tsx` | loc=47 |
| `components/auth/login-form-body.tsx` | file | used | 2 | `app/[locale]/(auth)/_components/login-form.tsx, components/mobile/drawers/auth-drawer.tsx` | loc=257 |
| `components/auth/sign-up-form-body.tsx` | file | used | 2 | `app/[locale]/(auth)/_components/sign-up-form.tsx, components/mobile/drawers/auth-drawer.tsx` | loc=394 |
| `components/auth/submit-button.tsx` | file | used | 3 | `app/[locale]/(auth)/_components/forgot-password-form.tsx, components/auth/login-form-body.tsx, components/auth/sign-up-form-body.tsx` | loc=40 |
| `components/desktop` | dir | used | - | - | 4 used / 0 unused files |
| `components/desktop/category-attribute-dropdowns.tsx` | file | used | 1 | `components/desktop/feed-toolbar.tsx` | loc=186 |
| `components/desktop/feed-toolbar-pill.ts` | file | used | 3 | `components/desktop/category-attribute-dropdowns.tsx, components/desktop/feed-toolbar.tsx, components/desktop/quick-filter-pills.tsx` | loc=20 |
| `components/desktop/feed-toolbar.tsx` | file | used | 4 | `app/[locale]/(main)/_components/desktop-home.tsx, app/[locale]/(main)/_components/desktop/filters-sidebar.tsx, components/desktop/category-attribute-dropdowns.tsx` | loc=252 |
| `components/desktop/quick-filter-pills.tsx` | file | used | 1 | `components/desktop/feed-toolbar.tsx` | loc=98 |
| `components/dropdowns` | dir | used | - | - | 4 used / 0 unused files |
| `components/dropdowns/account-dropdown.tsx` | file | used | 1 | `components/dropdowns/index.ts` | loc=193 |
| `components/dropdowns/index.ts` | file | used | 1 | `components/layout/header/desktop/standard-header.tsx` | loc=5 |
| `components/dropdowns/messages-dropdown.tsx` | file | used | 1 | `components/dropdowns/index.ts` | loc=155 |
| `components/dropdowns/wishlist-dropdown.tsx` | file | used | 1 | `components/dropdowns/index.ts` | loc=130 |
| `components/grid` | dir | used | - | - | 2 used / 0 unused files |
| `components/grid/index.ts` | file | used | 4 | `app/[locale]/(main)/_components/desktop-home.tsx, app/[locale]/(main)/categories/[slug]/_components/mobile/product-feed.tsx, app/[locale]/(main)/categories/[slug]/page.tsx` | loc=10 |
| `components/grid/product-grid.tsx` | file | used | 2 | `__tests__/product-grid-preset.test.tsx, components/grid/index.ts` | loc=231 |
| `components/layout` | dir | used | - | - | 15 used / 0 unused files |
| `components/layout/header` | dir | used | - | - | 13 used / 0 unused files |
| `components/layout/header/cart` | dir | used | - | - | 2 used / 0 unused files |
| `components/layout/header/cart/cart-dropdown.tsx` | file | used | 1 | `components/layout/header/desktop/standard-header.tsx` | loc=203 |
| `components/layout/header/cart/mobile-cart-dropdown.tsx` | file | used | 2 | `components/layout/header/mobile/contextual-header.tsx, components/layout/header/mobile/homepage-header.tsx` | loc=66 |
| `components/layout/header/desktop` | dir | used | - | - | 4 used / 0 unused files |
| `components/layout/header/desktop/desktop-search.tsx` | file | used | 1 | `components/layout/header/desktop/standard-header.tsx` | loc=443 |
| `components/layout/header/desktop/index.ts` | file | used | 1 | `app/[locale]/_components/app-header.tsx` | loc=4 |
| `components/layout/header/desktop/minimal-header.tsx` | file | used | 1 | `components/layout/header/desktop/index.ts` | loc=24 |
| `components/layout/header/desktop/standard-header.tsx` | file | used | 1 | `components/layout/header/desktop/index.ts` | loc=93 |
| `components/layout/header/mobile` | dir | used | - | - | 6 used / 0 unused files |
| `components/layout/header/mobile/contextual-header.tsx` | file | used | 1 | `components/layout/header/mobile/index.ts` | loc=123 |
| `components/layout/header/mobile/homepage-header.tsx` | file | used | 1 | `components/layout/header/mobile/index.ts` | loc=60 |
| `components/layout/header/mobile/index.ts` | file | used | 1 | `app/[locale]/_components/app-header.tsx` | loc=7 |
| `components/layout/header/mobile/minimal-header.tsx` | file | used | 1 | `components/layout/header/mobile/index.ts` | loc=24 |
| `components/layout/header/mobile/product-header.tsx` | file | used | 1 | `components/layout/header/mobile/index.ts` | loc=173 |
| `components/layout/header/mobile/profile-header.tsx` | file | used | 1 | `components/layout/header/mobile/index.ts` | loc=135 |
| `components/layout/header/types.ts` | file | used | 8 | `app/[locale]/_components/app-header.tsx, components/layout/header/desktop/minimal-header.tsx, components/layout/header/desktop/standard-header.tsx` | loc=88 |
| `components/layout/sidebar` | dir | used | - | - | 2 used / 0 unused files |
| `components/layout/sidebar/sidebar-menu.tsx` | file | used | 3 | `app/[locale]/_components/app-header.tsx, components/layout/header/mobile/homepage-header.tsx, components/layout/header/types.ts` | loc=537 |
| `components/layout/sidebar/sidebar.tsx` | file | used | 12 | `app/[locale]/_components/nav/nav-main.tsx, app/[locale]/_components/nav/nav-secondary.tsx, app/[locale]/_components/nav/nav-user.tsx` | loc=750 |
| `components/mobile` | dir | used | - | - | 10 used / 0 unused files |
| `components/mobile/category-nav` | dir | used | - | - | 4 used / 0 unused files |
| `components/mobile/category-nav/category-circles-simple.tsx` | file | used | 1 | `components/mobile/category-nav/index.ts` | loc=232 |
| `components/mobile/category-nav/category-drawer-context.tsx` | file | used | 3 | `app/[locale]/_components/category-browse-drawer.tsx, components/mobile/category-nav/category-circles-simple.tsx, components/mobile/category-nav/index.ts` | loc=229 |
| `components/mobile/category-nav/filter-sort-bar.tsx` | file | used | 2 | `app/[locale]/(main)/_components/filters/mobile-filter-controls.tsx, components/mobile/category-nav/index.ts` | loc=195 |
| `components/mobile/category-nav/index.ts` | file | used | 4 | `app/[locale]/_components/mobile-tab-bar.tsx, app/[locale]/_components/storefront-shell.tsx, app/[locale]/(main)/_components/mobile-home.tsx` | loc=15 |
| `components/mobile/drawers` | dir | used | - | - | 6 used / 0 unused files |
| `components/mobile/drawers/account-drawer.tsx` | file | used | 1 | `components/mobile/drawers/index.ts` | loc=415 |
| `components/mobile/drawers/auth-drawer.tsx` | file | used | 1 | `components/mobile/drawers/index.ts` | loc=230 |
| `components/mobile/drawers/cart-drawer.tsx` | file | used | 1 | `components/mobile/drawers/index.ts` | loc=208 |
| `components/mobile/drawers/index.ts` | file | used | 1 | `app/[locale]/_components/global-drawers.tsx` | loc=6 |
| `components/mobile/drawers/messages-drawer.tsx` | file | used | 1 | `components/mobile/drawers/index.ts` | loc=239 |
| `components/mobile/drawers/product-quick-view-drawer.tsx` | file | used | 1 | `components/mobile/drawers/index.ts` | loc=150 |
| `components/providers` | dir | used | - | - | 12 used / 0 unused files |
| `components/providers/_lib` | dir | used | - | - | 1 used / 0 unused files |
| `components/providers/_lib/analytics-drawer.ts` | file | used | 1 | `components/providers/drawer-context.tsx` | loc=142 |
| `components/providers/auth-state-manager.tsx` | file | used | 11 | `app/[locale]/_components/app-header.tsx, app/[locale]/_components/guest-sell-cta.tsx, app/[locale]/_components/mobile-tab-bar.tsx` | loc=197 |
| `components/providers/cart-context.tsx` | file | used | 17 | `app/[locale]/_components/drawers/product-quick-view-dialog.tsx, app/[locale]/_providers/commerce-providers.tsx, app/[locale]/(account)/account/wishlist/_components/account-wishlist-grid.tsx` | loc=491 |
| `components/providers/currency-context.tsx` | file | used | 2 | `app/[locale]/_providers/commerce-providers.tsx, components/shared/product/card/price.tsx` | loc=101 |
| `components/providers/drawer-context.tsx` | file | used | 12 | `app/[locale]/_components/drawers/product-quick-view-dialog.tsx, app/[locale]/_components/global-drawers.tsx, app/[locale]/_components/mobile-tab-bar.tsx` | loc=344 |
| `components/providers/header-context.tsx` | file | used | 8 | `app/[locale]/_components/app-header.tsx, app/[locale]/_components/storefront-shell.tsx, app/[locale]/(main)/_components/mobile-home.tsx` | loc=128 |
| `components/providers/message-context.tsx` | file | used | 8 | `app/[locale]/_components/mobile-tab-bar.tsx, app/[locale]/_providers/commerce-providers.tsx, app/[locale]/(chat)/_components/chat-interface.tsx` | loc=237 |
| `components/providers/messages` | dir | used | - | - | 3 used / 0 unused files |
| `components/providers/messages/use-messages-actions.ts` | file | used | 1 | `components/providers/message-context.tsx` | loc=214 |
| `components/providers/messages/use-messages-realtime.ts` | file | used | 1 | `components/providers/message-context.tsx` | loc=198 |
| `components/providers/messages/use-messages-state.ts` | file | used | 3 | `components/providers/message-context.tsx, components/providers/messages/use-messages-actions.ts, components/providers/messages/use-messages-realtime.ts` | loc=292 |
| `components/providers/theme-provider.tsx` | file | used | 1 | `app/[locale]/locale-providers.tsx` | loc=12 |
| `components/providers/wishlist-context.tsx` | file | used | 11 | `app/[locale]/_providers/commerce-providers.tsx, app/[locale]/(main)/wishlist/_components/wishlist-page-client.tsx, app/[locale]/[username]/[productSlug]/_components/desktop/desktop-buy-box.tsx` | loc=338 |
| `components/shared` | dir | used | - | - | 61 used / 0 unused files |
| `components/shared/auth` | dir | used | - | - | 1 used / 0 unused files |
| `components/shared/auth/auth-gate-card.tsx` | file | used | 4 | `app/[locale]/(chat)/chat/[conversationId]/page.tsx, app/[locale]/(chat)/chat/page.tsx, app/[locale]/(main)/(support)/customer-service/_components/support-chat-widget.tsx` | loc=70 |
| `components/shared/category` | dir | used | - | - | 3 used / 0 unused files |
| `components/shared/category/category-circle-visual.tsx` | file | used | 4 | `app/[locale]/(main)/_components/category/subcategory-circles.tsx, app/[locale]/(main)/_components/category/subcategory-tabs.tsx, app/[locale]/(main)/categories/page.tsx` | loc=114 |
| `components/shared/category/category-circle.tsx` | file | used | 1 | `components/layout/header/mobile/contextual-header.tsx` | loc=206 |
| `components/shared/category/category-icons.tsx` | file | used | 6 | `__tests__/category-tone.test.ts, app/[locale]/(main)/_components/desktop/category-sidebar.tsx, app/[locale]/(main)/_components/mobile/home-sticky-category-pills.tsx` | loc=424 |
| `components/shared/count-badge.tsx` | file | used | 7 | `app/[locale]/_components/mobile-tab-bar.tsx, components/dropdowns/account-dropdown.tsx, components/dropdowns/messages-dropdown.tsx` | loc=31 |
| `components/shared/dropdown-product-item.tsx` | file | used | 1 | `components/dropdowns/wishlist-dropdown.tsx` | loc=75 |
| `components/shared/empty-state-cta.tsx` | file | used | 5 | `app/[locale]/(main)/_components/desktop-home.tsx, app/[locale]/(main)/categories/[slug]/_components/mobile/product-feed.tsx, app/[locale]/(main)/categories/[slug]/page.tsx` | loc=165 |
| `components/shared/error-boundary-ui.tsx` | file | used | 13 | `app/[locale]/(account)/account/error.tsx, app/[locale]/(checkout)/checkout/error.tsx, app/[locale]/(main)/cart/error.tsx` | loc=121 |
| `components/shared/field.tsx` | file | used | 20 | `app/[locale]/_components/search/mobile-search-overlay.tsx, app/[locale]/(account)/account/profile/profile-content.tsx, app/[locale]/(auth)/_components/forgot-password-form.tsx` | loc=149 |
| `components/shared/filters` | dir | used | - | - | 14 used / 0 unused files |
| `components/shared/filters/config` | dir | used | - | - | 1 used / 0 unused files |
| `components/shared/filters/config/filter-attribute-config.ts` | file | used | 2 | `components/shared/filters/filter-hub.tsx, components/shared/filters/sections/filter-attribute-section-content.tsx` | loc=26 |
| `components/shared/filters/controls` | dir | used | - | - | 6 used / 0 unused files |
| `components/shared/filters/controls/color-swatches.tsx` | file | used | 1 | `components/shared/filters/sections/filter-attribute-section-content.tsx` | loc=144 |
| `components/shared/filters/controls/filter-checkbox-item.tsx` | file | used | 3 | `components/shared/filters/filter-hub.tsx, components/shared/filters/sections/filter-attribute-section-content.tsx, components/shared/filters/sections/filter-availability-section.tsx` | loc=106 |
| `components/shared/filters/controls/filter-list.tsx` | file | used | 1 | `components/shared/filters/sections/filter-attribute-section-content.tsx` | loc=122 |
| `components/shared/filters/controls/filter-radio-group.tsx` | file | used | 3 | `components/shared/filters/filter-hub.tsx, components/shared/filters/sections/filter-category-section.tsx, components/shared/filters/sort-modal.tsx` | loc=110 |
| `components/shared/filters/controls/price-slider.tsx` | file | used | 1 | `components/shared/filters/filter-hub.tsx` | loc=164 |
| `components/shared/filters/controls/size-tiles.tsx` | file | used | 1 | `components/shared/filters/sections/filter-attribute-section-content.tsx` | loc=65 |
| `components/shared/filters/filter-hub.tsx` | file | used | 2 | `app/[locale]/(main)/_components/filters/mobile-filter-controls.tsx, components/shared/filters/sections/filter-category-section.tsx` | loc=640 |
| `components/shared/filters/sections` | dir | used | - | - | 4 used / 0 unused files |
| `components/shared/filters/sections/filter-attribute-section-content.tsx` | file | used | 1 | `components/shared/filters/filter-hub.tsx` | loc=127 |
| `components/shared/filters/sections/filter-availability-section.tsx` | file | used | 1 | `components/shared/filters/filter-hub.tsx` | loc=30 |
| `components/shared/filters/sections/filter-category-section.tsx` | file | used | 1 | `components/shared/filters/filter-hub.tsx` | loc=75 |
| `components/shared/filters/sections/filter-rating-section.tsx` | file | used | 1 | `components/shared/filters/filter-hub.tsx` | loc=54 |
| `components/shared/filters/sort-modal.tsx` | file | used | 1 | `components/mobile/category-nav/filter-sort-bar.tsx` | loc=132 |
| `components/shared/filters/state` | dir | used | - | - | 1 used / 0 unused files |
| `components/shared/filters/state/use-pending-filters.ts` | file | used | 1 | `components/shared/filters/filter-hub.tsx` | loc=146 |
| `components/shared/locale-switcher.tsx` | file | used | 1 | `app/[locale]/(admin)/_components/dashboard-header.tsx` | loc=57 |
| `components/shared/modal.tsx` | file | used | 1 | `app/[locale]/(account)/@modal/(.)account/plans/upgrade/page.tsx` | loc=38 |
| `components/shared/navigation` | dir | used | - | - | 1 used / 0 unused files |
| `components/shared/navigation/app-breadcrumb.tsx` | file | used | 19 | `app/[locale]/(account)/account/sales/page.tsx, app/[locale]/(account)/account/selling/edit/edit-product-client.tsx, app/[locale]/(main)/(legal)/_components/legal-page-layout.tsx` | loc=126 |
| `components/shared/orders` | dir | used | - | - | 2 used / 0 unused files |
| `components/shared/orders/order-status-badge.tsx` | file | used | 2 | `app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx, app/[locale]/(sell)/sell/orders/client.tsx` | loc=66 |
| `components/shared/orders/order-status-config.ts` | file | used | 2 | `app/[locale]/(sell)/sell/orders/_components/order-status-actions.tsx, components/shared/orders/order-status-badge.tsx` | loc=73 |
| `components/shared/page-container.tsx` | file | used | 2 | `app/[locale]/(sell)/_components/layouts/desktop-layout.tsx, app/[locale]/(sell)/_components/ui/progress-header.tsx` | loc=49 |
| `components/shared/page-shell.tsx` | file | used | 55 | `app/[locale]/_components/storefront-shell.tsx, app/[locale]/(account)/account/sales/page.tsx, app/[locale]/(auth)/layout.tsx` | loc=74 |
| `components/shared/product` | dir | used | - | - | 19 used / 0 unused files |
| `components/shared/product/_lib` | dir | used | - | - | 2 used / 0 unused files |
| `components/shared/product/_lib/condition-badges.ts` | file | used | 5 | `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-gallery.tsx, app/[locale]/[username]/[productSlug]/_components/pdp/product-header.tsx, app/[locale]/[username]/[productSlug]/_components/product-page-layout.tsx` | loc=35 |
| `components/shared/product/_lib/condition.ts` | file | used | 4 | `app/[locale]/[username]/[productSlug]/_components/pdp/product-header.tsx, app/[locale]/[username]/[productSlug]/_components/product-page-layout.tsx, components/shared/product/card/desktop.tsx` | loc=39 |
| `components/shared/product/card` | dir | used | - | - | 9 used / 0 unused files |
| `components/shared/product/card/actions.tsx` | file | used | 3 | `components/shared/product/card/desktop.tsx, components/shared/product/card/list.tsx, components/shared/product/card/mobile.tsx` | loc=162 |
| `components/shared/product/card/desktop.tsx` | file | used | 3 | `__tests__/product-card-desktop.test.tsx, app/[locale]/(main)/_components/desktop/promoted-section.tsx, components/grid/product-grid.tsx` | loc=310 |
| `components/shared/product/card/image.tsx` | file | used | 2 | `components/shared/product/card/desktop.tsx, components/shared/product/card/mobile.tsx` | loc=89 |
| `components/shared/product/card/list.tsx` | file | used | 1 | `components/grid/product-grid.tsx` | loc=316 |
| `components/shared/product/card/mini.tsx` | file | used | 6 | `__tests__/product-card-mini.test.tsx, app/[locale]/(main)/assistant/_components/assistant-playground.tsx, app/[locale]/(main)/cart/_components/cart-page-client.tsx` | loc=110 |
| `components/shared/product/card/mobile.tsx` | file | used | 6 | `__tests__/product-card-mobile.test.tsx, app/[locale]/(main)/_components/mobile-home.tsx, app/[locale]/(main)/_components/mobile/promoted-listings-strip.tsx` | loc=275 |
| `components/shared/product/card/price.tsx` | file | used | 4 | `__tests__/product-card-price.test.tsx, components/shared/product/card/desktop.tsx, components/shared/product/card/list.tsx` | loc=219 |
| `components/shared/product/card/social-proof.tsx` | file | used | 1 | `components/shared/product/card/desktop.tsx` | loc=74 |
| `components/shared/product/card/types.ts` | file | used | 3 | `components/providers/drawer-context.tsx, components/shared/product/card/desktop.tsx, components/shared/product/card/mobile.tsx` | loc=50 |
| `components/shared/product/freshness-indicator.tsx` | file | used | 4 | `app/[locale]/[username]/[productSlug]/_components/product-page-layout.tsx, components/shared/product/card/desktop.tsx, components/shared/product/card/list.tsx` | loc=126 |
| `components/shared/product/pdp` | dir | used | - | - | 1 used / 0 unused files |
| `components/shared/product/pdp/category-badge.tsx` | file | used | 2 | `__tests__/category-badge.test.tsx, app/[locale]/[username]/[productSlug]/_components/product-page-layout.tsx` | loc=74 |
| `components/shared/product/product-price.tsx` | file | used | 1 | `__tests__/product-price.test.tsx` | loc=126 |
| `components/shared/product/quick-view` | dir | used | - | - | 4 used / 0 unused files |
| `components/shared/product/quick-view/product-quick-view-content.tsx` | file | used | 2 | `app/[locale]/_components/drawers/product-quick-view-dialog.tsx, components/mobile/drawers/product-quick-view-drawer.tsx` | loc=336 |
| `components/shared/product/quick-view/quick-view-image-gallery.tsx` | file | used | 1 | `components/shared/product/quick-view/product-quick-view-content.tsx` | loc=259 |
| `components/shared/product/quick-view/quick-view-seller-card.tsx` | file | used | 1 | `components/shared/product/quick-view/product-quick-view-content.tsx` | loc=92 |
| `components/shared/product/quick-view/quick-view-skeleton.tsx` | file | used | 2 | `app/[locale]/_components/drawers/product-quick-view-dialog.tsx, components/mobile/drawers/product-quick-view-drawer.tsx` | loc=60 |
| `components/shared/product/verified-seller-badge.tsx` | file | used | 2 | `components/shared/product/card/desktop.tsx, components/shared/product/card/list.tsx` | loc=49 |
| `components/shared/profile` | dir | used | - | - | 6 used / 0 unused files |
| `components/shared/profile/index.ts` | file | used | 1 | `app/[locale]/[username]/profile-client.tsx` | loc=6 |
| `components/shared/profile/profile-header-sync.tsx` | file | used | 1 | `components/shared/profile/index.ts` | loc=62 |
| `components/shared/profile/profile-settings-panel.tsx` | file | used | 1 | `components/shared/profile/index.ts` | loc=160 |
| `components/shared/profile/profile-shell.tsx` | file | used | 1 | `components/shared/profile/index.ts` | loc=121 |
| `components/shared/profile/profile-stats.tsx` | file | used | 1 | `components/shared/profile/index.ts` | loc=52 |
| `components/shared/profile/profile-tabs.tsx` | file | used | 1 | `components/shared/profile/index.ts` | loc=92 |
| `components/shared/search` | dir | used | - | - | 2 used / 0 unused files |
| `components/shared/search/ai` | dir | used | - | - | 1 used / 0 unused files |
| `components/shared/search/ai/search-ai-chat.tsx` | file | used | 2 | `app/[locale]/_components/search/mobile-search-overlay.tsx, components/layout/header/desktop/desktop-search.tsx` | loc=318 |
| `components/shared/search/overlay` | dir | used | - | - | 1 used / 0 unused files |
| `components/shared/search/overlay/search-context.ts` | file | used | 2 | `app/[locale]/_components/search/mobile-search-overlay.tsx, components/layout/header/mobile/contextual-header.tsx` | loc=32 |
| `components/shared/spinner.tsx` | file | used | 1 | `app/[locale]/(main)/(support)/customer-service/_components/support-chat-widget.tsx` | loc=22 |
| `components/shared/user-avatar.tsx` | file | used | 20 | `app/[locale]/_components/nav/nav-user.tsx, app/[locale]/(account)/account/_components/account-sidebar.tsx, app/[locale]/(account)/account/following/following-content.tsx` | loc=99 |
| `components/shared/wishlist` | dir | used | - | - | 2 used / 0 unused files |
| `components/shared/wishlist/mobile-wishlist-button.tsx` | file | used | 2 | `components/layout/header/mobile/contextual-header.tsx, components/layout/header/mobile/homepage-header.tsx` | loc=55 |
| `components/shared/wishlist/wishlist-drawer.tsx` | file | used | 1 | `components/shared/wishlist/mobile-wishlist-button.tsx` | loc=189 |
| `components/ui` | dir | used | - | - | 36 used / 0 unused files |
| `components/ui/accordion.tsx` | file | used | 10 | `app/[locale]/_components/site-footer.tsx, app/[locale]/(main)/(legal)/_components/legal-page-layout.tsx, app/[locale]/(main)/(legal)/returns/page.tsx` | loc=69 |
| `components/ui/alert-dialog.tsx` | file | used | 5 | `app/[locale]/(account)/account/addresses/addresses-content.tsx, app/[locale]/(account)/account/payments/payments-content.tsx, app/[locale]/(account)/account/plans/plans-content.tsx` | loc=165 |
| `components/ui/alert.tsx` | file | used | 2 | `app/[locale]/(account)/account/profile/public-profile-editor.tsx, app/[locale]/(account)/account/settings/page.tsx` | loc=67 |
| `components/ui/aspect-ratio.tsx` | file | used | 3 | `components/grid/product-grid.tsx, components/shared/product/card/image.tsx, components/shared/product/quick-view/quick-view-image-gallery.tsx` | loc=12 |
| `components/ui/avatar.tsx` | file | used | 8 | `app/[locale]/(admin)/_components/admin-recent-activity.tsx, app/[locale]/(admin)/admin/users/page.tsx, app/[locale]/(business)/_components/business-activity-feed.tsx` | loc=54 |
| `components/ui/badge.tsx` | file | used | 78 | `app/[locale]/_components/seller/boost-dialog.tsx, app/[locale]/(account)/account/_components/account-addresses-grid.tsx, app/[locale]/(account)/account/_components/account-addresses-stats.tsx` | loc=111 |
| `components/ui/breadcrumb.tsx` | file | used | 1 | `components/shared/navigation/app-breadcrumb.tsx` | loc=112 |
| `components/ui/button.tsx` | file | used | 155 | `app/[locale]/_components/cookie-consent.tsx, app/[locale]/_components/geo-welcome-modal.tsx, app/[locale]/_components/guest-sell-cta.tsx` | loc=82 |
| `components/ui/card.tsx` | file | used | 108 | `app/[locale]/_components/charts/chart-area-interactive.tsx, app/[locale]/_components/guest-sell-cta.tsx, app/[locale]/(account)/account/_components/account-addresses-grid.tsx` | loc=91 |
| `components/ui/checkbox.tsx` | file | used | 11 | `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx, app/[locale]/(business)/_components/orders-table.tsx, app/[locale]/(business)/_components/products-table.tsx` | loc=38 |
| `components/ui/command.tsx` | file | used | 2 | `app/[locale]/(business)/_components/business-command-palette.tsx, app/[locale]/(sell)/_components/ui/brand-combobox.tsx` | loc=192 |
| `components/ui/dialog.tsx` | file | used | 23 | `app/[locale]/_components/drawers/product-quick-view-dialog.tsx, app/[locale]/_components/orders/star-rating-dialog.tsx, app/[locale]/_components/seller/boost-dialog.tsx` | loc=212 |
| `components/ui/drawer.tsx` | file | used | 17 | `app/[locale]/_components/category-browse-drawer.tsx, app/[locale]/(sell)/_components/fields/condition-field.tsx, app/[locale]/(sell)/_components/steps/step-details.tsx` | loc=342 |
| `components/ui/dropdown-menu.tsx` | file | used | 15 | `app/[locale]/_components/nav/nav-user.tsx, app/[locale]/(account)/account/_components/account-sidebar.tsx, app/[locale]/(account)/account/wishlist/_components/account-wishlist-toolbar.tsx` | loc=187 |
| `components/ui/hover-card.tsx` | file | used | 4 | `components/dropdowns/account-dropdown.tsx, components/dropdowns/messages-dropdown.tsx, components/dropdowns/wishlist-dropdown.tsx` | loc=45 |
| `components/ui/icon-button.tsx` | file | used | 18 | `app/[locale]/_components/category-browse-drawer.tsx, app/[locale]/(main)/cart/_components/cart-page-client.tsx, app/[locale]/[username]/[productSlug]/_components/desktop/desktop-buy-box.tsx` | loc=39 |
| `components/ui/input.tsx` | file | used | 50 | `app/[locale]/_components/address-form.tsx, app/[locale]/_components/category-browse-drawer.tsx, app/[locale]/_components/search/mobile-search-overlay.tsx` | loc=23 |
| `components/ui/label.tsx` | file | used | 23 | `app/[locale]/_components/address-form.tsx, app/[locale]/_components/orders/star-rating-dialog.tsx, app/[locale]/(account)/account/addresses/addresses-content.tsx` | loc=25 |
| `components/ui/pagination.tsx` | file | used | 1 | `app/[locale]/(main)/_components/search-controls/search-pagination.tsx` | loc=140 |
| `components/ui/popover.tsx` | file | used | 3 | `app/[locale]/(business)/_components/business-notifications.tsx, app/[locale]/(sell)/_components/ui/brand-combobox.tsx, components/layout/header/desktop/desktop-search.tsx` | loc=49 |
| `components/ui/progress.tsx` | file | used | 7 | `app/[locale]/(account)/account/_components/subscription-benefits-card.tsx, app/[locale]/(business)/_components/business-performance-score.tsx, app/[locale]/(business)/_components/business-setup-guide.tsx` | loc=37 |
| `components/ui/radio-group.tsx` | file | used | 4 | `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx, app/[locale]/(checkout)/_components/address-section.tsx, app/[locale]/(checkout)/_components/shipping-method-section.tsx` | loc=47 |
| `components/ui/scroll-area.tsx` | file | used | 11 | `app/[locale]/(account)/account/_components/account-addresses-grid.tsx, app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx, app/[locale]/(admin)/_components/admin-recent-activity.tsx` | loc=59 |
| `components/ui/select.tsx` | file | used | 19 | `app/[locale]/_components/charts/chart-area-interactive.tsx, app/[locale]/_components/geo-welcome-modal.tsx, app/[locale]/(account)/account/_components/account-chart.tsx` | loc=185 |
| `components/ui/separator.tsx` | file | used | 15 | `app/[locale]/(account)/account/_components/account-addresses-grid.tsx, app/[locale]/(account)/account/_components/account-header.tsx, app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx` | loc=29 |
| `components/ui/sheet.tsx` | file | used | 6 | `app/[locale]/(account)/account/_components/account-addresses-grid.tsx, app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx, app/[locale]/(account)/account/wishlist/_components/account-wishlist-grid.tsx` | loc=154 |
| `components/ui/skeleton.tsx` | file | used | 74 | `app/[locale]/_components/category-browse-drawer.tsx, app/[locale]/(account)/account/_components/account-page-header-skeleton.tsx, app/[locale]/(account)/account/addresses/loading.tsx` | loc=14 |
| `components/ui/slider.tsx` | file | used | 2 | `app/[locale]/(main)/_components/desktop/desktop-filter-modal.tsx, components/shared/filters/controls/price-slider.tsx` | loc=68 |
| `components/ui/switch.tsx` | file | used | 11 | `app/[locale]/_components/search/mobile-search-overlay.tsx, app/[locale]/(account)/account/(settings)/notifications/notifications-content.tsx, app/[locale]/(account)/account/selling/edit/edit-product-client.tsx` | loc=32 |
| `components/ui/table.tsx` | file | used | 14 | `app/[locale]/(account)/account/billing/billing-content.tsx, app/[locale]/(account)/account/sales/_components/sales-table.tsx, app/[locale]/(admin)/admin/docs/_components/docs-content.tsx` | loc=97 |
| `components/ui/tabs.tsx` | file | used | 6 | `app/[locale]/(account)/account/billing/billing-content.tsx, app/[locale]/(account)/account/orders/_components/account-orders-toolbar.tsx, app/[locale]/(account)/account/profile/profile-content.tsx` | loc=79 |
| `components/ui/textarea.tsx` | file | used | 16 | `app/[locale]/_components/orders/star-rating-dialog.tsx, app/[locale]/(account)/account/orders/_components/buyer-order-actions.tsx, app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx` | loc=20 |
| `components/ui/toast.tsx` | file | used | 1 | `hooks/use-toast.ts` | loc=66 |
| `components/ui/toggle-group.tsx` | file | used | 5 | `app/[locale]/_components/charts/chart-area-interactive.tsx, app/[locale]/(account)/account/_components/account-chart.tsx, app/[locale]/(main)/categories/[slug]/_components/desktop-filter-toolbar.tsx` | loc=74 |
| `components/ui/toggle.tsx` | file | used | 1 | `components/ui/toggle-group.tsx` | loc=28 |
| `components/ui/tooltip.tsx` | file | used | 5 | `app/[locale]/(account)/account/_components/account-badges.tsx, app/[locale]/(account)/account/_components/subscription-benefits-card.tsx, app/[locale]/(business)/_components/business-performance-score.tsx` | loc=62 |

## Iteration Plan

### Immediate Cleanup Candidates

- [ ] No unused component files found by static graph. Validate runtime-only references before removing anything.

### Structural Follow-Ups

- [ ] Continue converting flat feature folders into submodules (next highest-impact candidates: `components/shared/search`, `components/layout/header`).
- [ ] Move app-only components from global `components/` into route-local `app/**/_components` when cross-route reuse is not required.
- [ ] Keep shadcn primitives in `components/ui/*` only; keep feature composition in `components/shared/*`, `components/mobile/*`, `components/desktop/*`.

## Method and Limits

- Static import graph only; dynamic runtime resolution is not counted.
- Import samples list up to 3 callers per file for readability.
