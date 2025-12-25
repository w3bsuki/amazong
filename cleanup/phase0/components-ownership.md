# Phase 0 — Components Ownership Map

Generated: 2025-12-23T12:59:47.852Z

## Summary (by bucket)
- components/common (shared composite): 133
- components/layout: 24
- components/providers: 18
- components/ui (primitive): 49
- should move to route-owned _components: 17

## Full Classification

| File | Bucket | Usage Groups | Refs | Reason |
| --- | --- | --- | ---: | --- |
| components/ai-elements/artifact.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/canvas.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/chain-of-thought.tsx | components/providers | (none found) | 0 | Provider/context heuristics |
| components/ai-elements/checkpoint.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/code-block.tsx | components/providers | (none found) | 0 | Provider/context heuristics |
| components/ai-elements/confirmation.tsx | components/providers | (none found) | 0 | Provider/context heuristics |
| components/ai-elements/connection.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/context.tsx | components/providers | (none found) | 0 | Provider/context heuristics |
| components/ai-elements/controls.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/conversation.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/ai-elements/edge.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/image.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/inline-citation.tsx | components/providers | (none found) | 0 | Provider/context heuristics |
| components/ai-elements/listing-preview-card.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/ai-elements/loader.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/ai-elements/message.tsx | components/providers | unknown | 2 | Provider/context heuristics |
| components/ai-elements/model-selector.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/node.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/open-in-chat.tsx | components/providers | (none found) | 0 | Provider/context heuristics |
| components/ai-elements/panel.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/plan.tsx | components/providers | (none found) | 0 | Provider/context heuristics |
| components/ai-elements/prompt-input.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/ai-elements/queue.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/reasoning.tsx | components/providers | unknown | 2 | Provider/context heuristics |
| components/ai-elements/shimmer.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/sources.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/suggestion.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/ai-elements/task.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/tool.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/toolbar.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/web-preview.tsx | components/providers | (none found) | 0 | Provider/context heuristics |
| components/ai/ai-chatbot.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/ai/ai-sell-assistant.tsx | should move to route-owned _components | sell | 1 | Referenced only from app group: sell |
| components/auth/sign-out-button.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/badges/badge-progress.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/badges/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/badges/seller-badge.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/badges/trust-score.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/buyer/buyer-order-actions.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/category/category-browse-card.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/category/category-circles.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/category/subcategory-circles.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/category/subcategory-tabs.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/charts/chart-area-interactive.tsx | components/common (shared composite) | admin, business | 3 | Default bucket (shared component under components/ root) |
| components/common/ai-assistant-interface.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/button-group.tsx | components/common (shared composite) | unknown | 1 | Located under components/common/ |
| components/common/chat-container.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/code-block.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/data-table.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/error-boundary.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/field.tsx | components/common (shared composite) | sell | 10 | Located under components/common/ |
| components/common/filters/desktop-filters.tsx | components/common (shared composite) | main | 2 | Located under components/common/ |
| components/common/filters/filter-chips.tsx | components/common (shared composite) | main | 2 | Located under components/common/ |
| components/common/filters/mobile-filters.tsx | components/common (shared composite) | main | 2 | Located under components/common/ |
| components/common/geo-welcome-modal.tsx | components/common (shared composite) | root | 1 | Located under components/common/ |
| components/common/image-upload.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/index.ts | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/input-group.tsx | components/common (shared composite) | unknown | 1 | Located under components/common/ |
| components/common/markdown.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/message.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/modal.tsx | components/common (shared composite) | account | 1 | Located under components/common/ |
| components/common/page-container.tsx | components/common (shared composite) | sell | 2 | Located under components/common/ |
| components/common/pricing-card.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/product-card.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/product-card/product-card-featured.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/product-card/product-card.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/prompt-input.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/scroll-button.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/wishlist/mobile-wishlist-button.tsx | components/common (shared composite) | unknown | 1 | Located under components/common/ |
| components/common/wishlist/wishlist-button.tsx | components/common (shared composite) | unknown | 3 | Located under components/common/ |
| components/common/wishlist/wishlist-drawer.tsx | components/common (shared composite) | unknown | 1 | Located under components/common/ |
| components/desktop/desktop-filter-modal.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/desktop/desktop-hero-cta.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/desktop/desktop-search.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/dropdowns/account-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/location-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/messages-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/notifications-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/orders-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/search-category-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/search-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/selling-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/icons/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/layout/cookie-consent.tsx | components/layout | main, root | 2 | Located under components/layout/ |
| components/layout/footer/index.ts | components/layout | (none found) | 0 | Located under components/layout/ |
| components/layout/footer/site-footer.tsx | components/layout | main, root | 2 | Located under components/layout/ |
| components/layout/header/cart/cart-dropdown.tsx | components/layout | unknown | 1 | Located under components/layout/ |
| components/layout/header/cart/mobile-cart-dropdown.tsx | components/layout | unknown | 1 | Located under components/layout/ |
| components/layout/header/dashboard-header.tsx | components/layout | admin | 1 | Located under components/layout/ |
| components/layout/header/index.ts | components/layout | (none found) | 0 | Located under components/layout/ |
| components/layout/header/minimal-header.tsx | components/layout | plans | 1 | Located under components/layout/ |
| components/layout/header/site-header.tsx | components/layout | main, root | 2 | Located under components/layout/ |
| components/layout/index.ts | components/layout | (none found) | 0 | Located under components/layout/ |
| components/layout/nav-main.tsx | components/layout | admin, unknown | 2 | Located under components/layout/ |
| components/layout/nav-secondary.tsx | components/layout | admin, unknown | 2 | Located under components/layout/ |
| components/layout/nav-user.tsx | components/layout | admin, business, unknown | 3 | Located under components/layout/ |
| components/layout/sidebar/app-sidebar.tsx | components/layout | (none found) | 0 | Located under components/layout/ |
| components/layout/sidebar/index.ts | components/layout | (none found) | 0 | Located under components/layout/ |
| components/layout/sidebar/sidebar-menu.tsx | components/layout | unknown | 1 | Located under components/layout/ |
| components/layout/sidebar/sidebar.tsx | components/layout | account, admin, business, unknown | 15 | Located under components/layout/ |
| components/mobile/mobile-category-rail.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/mobile/mobile-menu-sheet.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/mobile/mobile-search-bar.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/mobile/mobile-tab-bar.tsx | components/common (shared composite) | main, root | 2 | Default bucket (shared component under components/ root) |
| components/navigation/app-breadcrumb.tsx | components/layout | account, main, unknown | 15 | Layout/navigation naming heuristics |
| components/navigation/category-subheader.tsx | components/layout | unknown | 1 | Layout/navigation naming heuristics |
| components/navigation/index.ts | components/layout | (none found) | 0 | Layout/navigation naming heuristics |
| components/navigation/language-switcher.tsx | components/layout | (none found) | 0 | Layout/navigation naming heuristics |
| components/navigation/mega-menu.tsx | components/layout | (none found) | 0 | Layout/navigation naming heuristics |
| components/navigation/nav-documents.tsx | components/layout | unknown | 1 | Layout/navigation naming heuristics |
| components/orders/order-status-actions.tsx | should move to route-owned _components | sell | 1 | Referenced only from app group: sell |
| components/orders/order-status-badge.tsx | components/common (shared composite) | account, sell | 2 | Default bucket (shared component under components/ root) |
| components/pricing/plan-card.tsx | components/common (shared composite) | account, unknown | 2 | Default bucket (shared component under components/ root) |
| components/pricing/plans-modal.tsx | components/common (shared composite) | account, unknown | 2 | Default bucket (shared component under components/ root) |
| components/pricing/pricing-card.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/pricing/upgrade-banner.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/pricing/upgrade-to-business-modal.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product-detail6.tsx | should move to route-owned _components | root | 1 | Referenced only from app group: root |
| components/product/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-actions.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-buy-box.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-card-menu.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/product/product-card.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/product/product-form-enhanced.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-form.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-gallery.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-quick-view-dialog.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-row.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-specs.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-variant-selector.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/rating-scroll-link.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/reviews/review-form.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/reviews/reviews-section-client.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/reviews/reviews-section-server.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/product/reviews/reviews-section.tsx | components/common (shared composite) | main, root | 2 | Default bucket (shared component under components/ root) |
| components/product/seller-info-card.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/shipping-info.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/promo/promo-banner-strip.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/promo/promo-card.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/providers/analytics.tsx | components/providers | (none found) | 0 | Located under components/providers/ |
| components/providers/auth-state-listener.tsx | components/providers | root | 1 | Located under components/providers/ |
| components/providers/cart-context.tsx | components/providers | account, checkout, main, root, unknown | 17 | Located under components/providers/ |
| components/providers/message-context.tsx | components/providers | chat, unknown | 4 | Located under components/providers/ |
| components/providers/prompt-input-context.tsx | components/providers | unknown | 4 | Located under components/providers/ |
| components/providers/sonner.tsx | components/providers | root | 1 | Located under components/providers/ |
| components/providers/theme-provider.tsx | components/providers | (none found) | 0 | Located under components/providers/ |
| components/providers/wishlist-context.tsx | components/providers | main, root, unknown | 8 | Located under components/providers/ |
| components/sections/category-carousel-client.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/category-carousel.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/deals-carousel.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/deals-section.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/sections/deals-wrapper.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/featured-products-section.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/sections/featured-section.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/hero-carousel.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/newest-carousel.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/newest-listings-section.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/newest-listings.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/promoted-carousel.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/section-cards.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/sign-in-cta.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/start-selling-banner.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/sections/tabbed-product-feed.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/sections/tabbed-product-section.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/trending-products-section.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/sections/trending-section.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/seller/contact-seller-button.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/seller/follow-seller-button.tsx | components/common (shared composite) | root, unknown | 2 | Default bucket (shared component under components/ root) |
| components/seller/seller-card.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/seller/seller-rate-buyer-actions.tsx | should move to route-owned _components | sell | 1 | Referenced only from app group: sell |
| components/shared/cart/add-to-cart.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/shared/product/product-breadcrumb.tsx | components/layout | main, root | 5 | Layout/navigation naming heuristics |
| components/shared/product/product-card.tsx | components/common (shared composite) | main, root, unknown | 13 | Default bucket (shared component under components/ root) |
| components/shared/product/product-carousel-section.tsx | components/common (shared composite) | unknown | 5 | Default bucket (shared component under components/ root) |
| components/shared/product/product-page-content-blocks-inspired.tsx | should move to route-owned _components | root | 2 | Referenced only from app group: root |
| components/shared/product/product-page-content-new.tsx | components/common (shared composite) | main, root | 2 | Default bucket (shared component under components/ root) |
| components/shared/product/product-page-hybrid.tsx | should move to route-owned _components | root | 1 | Referenced only from app group: root |
| components/shared/product/product-price.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/shared/product/recently-viewed-tracker.tsx | components/common (shared composite) | main, root | 2 | Default bucket (shared component under components/ root) |
| components/shared/product/reviews/review-form.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/shared/search/ai-search-dialog.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/shared/search/mobile-search-overlay.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/shared/search/search-filters.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/shared/search/search-pagination.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/shared/search/sort-select.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/skeletons/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/skeletons/product-carousel-skeleton.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/skeletons/product-grid-skeleton.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sticky/sticky-add-to-cart.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sticky/sticky-checkout-button.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ui/accordion.tsx | components/ui (primitive) | main, plans, unknown | 7 | Located under components/ui/ |
| components/ui/alert-dialog.tsx | components/ui (primitive) | account, sell | 7 | Located under components/ui/ |
| components/ui/alert.tsx | components/ui (primitive) | account, sell, unknown | 9 | Located under components/ui/ |
| components/ui/aspect-ratio.tsx | components/ui (primitive) | unknown | 7 | Located under components/ui/ |
| components/ui/avatar.tsx | components/ui (primitive) | account, admin, business, main, root, sell, unknown | 20 | Located under components/ui/ |
| components/ui/badge.tsx | components/ui (primitive) | account, admin, business, checkout, main, root, sell, unknown | 73 | Located under components/ui/ |
| components/ui/breadcrumb.tsx | components/ui (primitive) | unknown | 1 | Located under components/ui/ |
| components/ui/button.tsx | components/ui (primitive) | account, admin, auth, business, checkout, main, plans, root, sell, unknown | 173 | Located under components/ui/ |
| components/ui/calendar.tsx | components/ui (primitive) | business | 1 | Located under components/ui/ |
| components/ui/card.tsx | components/ui (primitive) | account, admin, business, checkout, main, root, sell, unknown | 100 | Located under components/ui/ |
| components/ui/carousel.tsx | components/ui (primitive) | unknown | 3 | Located under components/ui/ |
| components/ui/chart.tsx | components/ui (primitive) | account, unknown | 4 | Located under components/ui/ |
| components/ui/checkbox.tsx | components/ui (primitive) | business, main, sell, unknown | 9 | Located under components/ui/ |
| components/ui/collapsible.tsx | components/ui (primitive) | main, unknown | 9 | Located under components/ui/ |
| components/ui/command.tsx | components/ui (primitive) | business, sell, unknown | 4 | Located under components/ui/ |
| components/ui/context-menu.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/dialog.tsx | components/ui (primitive) | account, business, sell, unknown | 25 | Located under components/ui/ |
| components/ui/drawer.tsx | components/ui (primitive) | sell, unknown | 16 | Located under components/ui/ |
| components/ui/dropdown-menu.tsx | components/ui (primitive) | account, business, chat, sell, unknown | 16 | Located under components/ui/ |
| components/ui/empty.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/form.tsx | components/ui (primitive) | auth, unknown | 2 | Located under components/ui/ |
| components/ui/hover-card.tsx | components/ui (primitive) | unknown | 12 | Located under components/ui/ |
| components/ui/input-otp.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/input.tsx | components/ui (primitive) | account, auth, business, chat, checkout, main, sell, unknown | 49 | Located under components/ui/ |
| components/ui/item.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/kbd.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/label.tsx | components/ui (primitive) | account, business, checkout, main, sell, unknown | 27 | Located under components/ui/ |
| components/ui/menubar.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/navigation-menu.tsx | components/ui (primitive) | unknown | 1 | Located under components/ui/ |
| components/ui/pagination.tsx | components/ui (primitive) | unknown | 1 | Located under components/ui/ |
| components/ui/popover.tsx | components/ui (primitive) | business, sell, unknown | 6 | Located under components/ui/ |
| components/ui/progress.tsx | components/ui (primitive) | business, sell, unknown | 11 | Located under components/ui/ |
| components/ui/radio-group.tsx | components/ui (primitive) | checkout, main, unknown | 3 | Located under components/ui/ |
| components/ui/resizable.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/scroll-area.tsx | components/ui (primitive) | account, admin, business, main, sell, unknown | 16 | Located under components/ui/ |
| components/ui/select.tsx | components/ui (primitive) | account, business, main, sell, unknown | 22 | Located under components/ui/ |
| components/ui/separator.tsx | components/ui (primitive) | account, business, checkout, main, root, unknown | 26 | Located under components/ui/ |
| components/ui/sheet.tsx | components/ui (primitive) | account, unknown | 4 | Located under components/ui/ |
| components/ui/skeleton.tsx | components/ui (primitive) | account, admin, auth, business, chat, checkout, main, plans, root, sell, unknown | 76 | Located under components/ui/ |
| components/ui/slider.tsx | components/ui (primitive) | main, unknown | 2 | Located under components/ui/ |
| components/ui/spinner.tsx | components/ui (primitive) | unknown | 3 | Located under components/ui/ |
| components/ui/switch.tsx | components/ui (primitive) | account, business, main, plans, sell, unknown | 7 | Located under components/ui/ |
| components/ui/table.tsx | components/ui (primitive) | account, admin, business, plans, unknown | 14 | Located under components/ui/ |
| components/ui/tabs.tsx | components/ui (primitive) | account, business, root, sell, unknown | 12 | Located under components/ui/ |
| components/ui/textarea.tsx | components/ui (primitive) | account, auth, business, main, sell, unknown | 16 | Located under components/ui/ |
| components/ui/toast.tsx | components/ui (primitive) | unknown | 1 | Located under components/ui/ |
| components/ui/toggle-group.tsx | components/ui (primitive) | account, main, unknown | 3 | Located under components/ui/ |
| components/ui/toggle.tsx | components/ui (primitive) | account, main, unknown | 4 | Located under components/ui/ |
| components/ui/tooltip.tsx | components/ui (primitive) | account, business, unknown | 13 | Located under components/ui/ |

## Notes
- “Referenced only from app group X” is a heuristic; Phase 3 will confirm before moving anything.
- Missing refs can mean: dynamic import paths, barrel exports, or component used only by tests/stories.