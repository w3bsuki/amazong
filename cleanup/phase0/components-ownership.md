# Phase 0 — Components Ownership Map

Generated: 2025-12-21T14:44:27.977Z

## Summary (by bucket)
- components/common (shared composite): 122
- components/layout: 35
- components/providers: 12
- components/ui (primitive): 62
- should move to route-owned _components: 65

## Full Classification

| File | Bucket | Usage Groups | Refs | Reason |
| --- | --- | --- | ---: | --- |
| components/account-addresses-grid.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-addresses-stats.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-badges.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-chart.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-header.tsx | components/layout | account | 1 | Layout/navigation naming heuristics |
| components/account-hero-card.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-orders-grid.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-orders-stats.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-orders-toolbar.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-recent-activity.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-sidebar.tsx | components/layout | account | 1 | Layout/navigation naming heuristics |
| components/account-stats-cards.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-tab-bar.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-wishlist-grid.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-wishlist-stats.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/account-wishlist-toolbar.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/add-to-cart.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/admin-recent-activity.tsx | should move to route-owned _components | admin | 1 | Referenced only from app group: admin |
| components/admin-sidebar.tsx | components/layout | admin | 1 | Layout/navigation naming heuristics |
| components/admin-stats-cards.tsx | should move to route-owned _components | admin | 1 | Referenced only from app group: admin |
| components/ai-chatbot.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
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
| components/ai-elements/prompt-input.tsx | components/providers | unknown | 2 | Provider/context heuristics |
| components/ai-elements/queue.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/reasoning.tsx | components/providers | unknown | 2 | Provider/context heuristics |
| components/ai-elements/shimmer.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/sources.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/suggestion.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/ai-elements/task.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/tool.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/toolbar.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/ai-elements/web-preview.tsx | components/providers | (none found) | 0 | Provider/context heuristics |
| components/ai-search-dialog.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/ai-sell-assistant.tsx | should move to route-owned _components | sell | 1 | Referenced only from app group: sell |
| components/analytics.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/app-breadcrumb.tsx | components/layout | account, main, unknown | 15 | Layout/navigation naming heuristics |
| components/app-sidebar.tsx | components/layout | (none found) | 0 | Layout/navigation naming heuristics |
| components/attribute-filters.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/auth-state-listener.tsx | should move to route-owned _components | root | 1 | Referenced only from app group: root |
| components/badges/badge-progress.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/badges/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/badges/seller-badge.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/badges/trust-score.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/boost-dialog.tsx | should move to route-owned _components | account | 1 | Referenced only from app group: account |
| components/business/business-activity-feed.tsx | should move to route-owned _components | business | 1 | Referenced only from app group: business |
| components/business/business-command-palette.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/business/business-date-range-picker.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/business/business-empty-state.tsx | should move to route-owned _components | business | 2 | Referenced only from app group: business |
| components/business/business-header.tsx | components/layout | business | 1 | Layout/navigation naming heuristics |
| components/business/business-live-activity.tsx | should move to route-owned _components | business | 1 | Referenced only from app group: business |
| components/business/business-notifications.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/business/business-page-header.tsx | components/layout | (none found) | 0 | Layout/navigation naming heuristics |
| components/business/business-performance-score.tsx | should move to route-owned _components | business | 1 | Referenced only from app group: business |
| components/business/business-quick-actions.tsx | should move to route-owned _components | business | 1 | Referenced only from app group: business |
| components/business/business-recent-activity.tsx | should move to route-owned _components | business | 1 | Referenced only from app group: business |
| components/business/business-setup-guide.tsx | should move to route-owned _components | business | 1 | Referenced only from app group: business |
| components/business/business-sidebar.tsx | components/layout | business | 1 | Layout/navigation naming heuristics |
| components/business/business-stats-cards.tsx | should move to route-owned _components | business | 1 | Referenced only from app group: business |
| components/business/business-task-cards.tsx | should move to route-owned _components | business | 1 | Referenced only from app group: business |
| components/business/order-detail-view.tsx | should move to route-owned _components | business | 1 | Referenced only from app group: business |
| components/business/orders-table.tsx | should move to route-owned _components | business | 1 | Referenced only from app group: business |
| components/business/product-form-modal.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/business/products-table.tsx | should move to route-owned _components | business | 1 | Referenced only from app group: business |
| components/buyer-order-actions.tsx | components/common (shared composite) | account, unknown | 2 | Default bucket (shared component under components/ root) |
| components/category-browse-card.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/category-circles.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/category-page-breadcrumb.tsx | components/layout | (none found) | 0 | Layout/navigation naming heuristics |
| components/category-sidebar.tsx | components/layout | (none found) | 0 | Layout/navigation naming heuristics |
| components/chart-area-interactive.tsx | components/common (shared composite) | admin, business | 3 | Default bucket (shared component under components/ root) |
| components/chat-interface.tsx | should move to route-owned _components | chat | 1 | Referenced only from app group: chat |
| components/checkout-footer.tsx | components/layout | checkout | 1 | Layout/navigation naming heuristics |
| components/checkout-header.tsx | components/layout | checkout | 1 | Layout/navigation naming heuristics |
| components/common/chat-container.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/code-block.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/index.ts | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/markdown.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/message.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/modal.tsx | components/common (shared composite) | unknown | 1 | Located under components/common/ |
| components/common/page-container.tsx | components/common (shared composite) | sell, unknown | 3 | Located under components/common/ |
| components/common/pricing-card.tsx | components/common (shared composite) | unknown | 1 | Located under components/common/ |
| components/common/product-card/product-card-featured.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/common/product-card/product-card.tsx | components/common (shared composite) | (none found) | 0 | Located under components/common/ |
| components/contact-seller-button.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/conversation-list.tsx | should move to route-owned _components | chat | 1 | Referenced only from app group: chat |
| components/cookie-consent.tsx | components/common (shared composite) | main, root | 2 | Default bucket (shared component under components/ root) |
| components/dashboard-header.tsx | components/layout | admin | 1 | Layout/navigation naming heuristics |
| components/data-table.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/deals-section.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/demo/best-product-cards-showcase.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/demo/category-variants.tsx | components/common (shared composite) | main, unknown | 5 | Default bucket (shared component under components/ root) |
| components/demo/gemini-perfected.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/demo/gemini-refined.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/demo/gemini-ultimate.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/demo/gemini-variants.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/demo/gpt-category-variants.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/demo/marketplace-card.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/demo/mobile-category-cards.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/desktop-filter-modal.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/desktop-filters.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/desktop-hero-cta.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/desktop-search.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/dropdowns/account-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/cart-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/location-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/messages-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/notifications-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/orders-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/search-category-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/search-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/dropdowns/selling-dropdown.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/error-boundary.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/featured-products-section.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/filter-chips.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/follow-seller-button.tsx | components/common (shared composite) | root, unknown | 2 | Default bucket (shared component under components/ root) |
| components/geo-welcome-modal.tsx | should move to route-owned _components | root | 1 | Referenced only from app group: root |
| components/header-dropdowns.tsx | components/layout | (none found) | 0 | Layout/navigation naming heuristics |
| components/hero-carousel.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/icons/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/image-upload.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/language-switcher.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/layout/footer/index.ts | components/layout | (none found) | 0 | Located under components/layout/ |
| components/layout/footer/site-footer.tsx | components/layout | (none found) | 0 | Located under components/layout/ |
| components/layout/header/index.ts | components/layout | (none found) | 0 | Located under components/layout/ |
| components/layout/header/site-header.tsx | components/layout | (none found) | 0 | Located under components/layout/ |
| components/layout/index.ts | components/layout | (none found) | 0 | Located under components/layout/ |
| components/layout/sidebar/app-sidebar.tsx | components/layout | (none found) | 0 | Located under components/layout/ |
| components/layout/sidebar/index.ts | components/layout | (none found) | 0 | Located under components/layout/ |
| components/main-nav.tsx | components/layout | (none found) | 0 | Layout/navigation naming heuristics |
| components/minimal-header.tsx | components/layout | plans | 1 | Layout/navigation naming heuristics |
| components/mobile-cart-dropdown.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/mobile-category-rail.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/mobile-filters.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/mobile-menu-sheet.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/mobile-search-bar.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/mobile-search-overlay.tsx | components/common (shared composite) | unknown | 3 | Default bucket (shared component under components/ root) |
| components/mobile-tab-bar.tsx | components/common (shared composite) | main, root | 2 | Default bucket (shared component under components/ root) |
| components/mobile-wishlist-button.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/nav-documents.tsx | components/layout | unknown | 2 | Layout/navigation naming heuristics |
| components/nav-main.tsx | components/layout | admin, unknown | 4 | Layout/navigation naming heuristics |
| components/nav-secondary.tsx | components/layout | admin, unknown | 4 | Layout/navigation naming heuristics |
| components/nav-user.tsx | components/layout | admin, business, unknown | 6 | Layout/navigation naming heuristics |
| components/navigation/category-subheader.tsx | components/layout | unknown | 2 | Layout/navigation naming heuristics |
| components/navigation/index.ts | components/layout | (none found) | 0 | Layout/navigation naming heuristics |
| components/navigation/mega-menu.tsx | components/layout | (none found) | 0 | Layout/navigation naming heuristics |
| components/order-status-actions.tsx | should move to route-owned _components | sell | 1 | Referenced only from app group: sell |
| components/order-status-badge.tsx | components/common (shared composite) | account, sell, unknown | 3 | Default bucket (shared component under components/ root) |
| components/plan-card.tsx | components/common (shared composite) | account, main, unknown | 3 | Default bucket (shared component under components/ root) |
| components/plans-modal.tsx | components/common (shared composite) | account, unknown | 4 | Default bucket (shared component under components/ root) |
| components/pricing-card.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product-actions.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product-breadcrumb.tsx | components/layout | main, root | 2 | Layout/navigation naming heuristics |
| components/product-card-menu.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/product-card.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/product-carousel-section.tsx | components/common (shared composite) | unknown | 4 | Default bucket (shared component under components/ root) |
| components/product-form-enhanced.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product-form.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product-page-content-new.tsx | components/common (shared composite) | main, root | 2 | Default bucket (shared component under components/ root) |
| components/product-price.tsx | components/common (shared composite) | main, unknown | 2 | Default bucket (shared component under components/ root) |
| components/product-quick-view-dialog.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product-row.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product-variant-selector.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-buy-box.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-gallery.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/product-specs.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/seller-info-card.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/product/shipping-info.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/promo-banner-strip.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/promo-card.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/rating-scroll-link.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/recently-viewed-tracker.tsx | components/common (shared composite) | main, root | 2 | Default bucket (shared component under components/ root) |
| components/review-form.tsx | components/common (shared composite) | unknown | 2 | Default bucket (shared component under components/ root) |
| components/reviews-section-client.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/reviews-section-server.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/reviews-section.tsx | components/common (shared composite) | main, root | 2 | Default bucket (shared component under components/ root) |
| components/search-filters.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/search-header.tsx | components/layout | main | 1 | Layout/navigation naming heuristics |
| components/search-pagination.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/section-cards.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/sections/category-carousel.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/deals-carousel.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/deals-wrapper.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/featured-section.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/newest-carousel.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/newest-listings-section.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/newest-listings.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/promoted-carousel.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/sign-in-cta.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sections/trending-section.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/seller-card.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/seller-rate-buyer-actions.tsx | should move to route-owned _components | sell | 1 | Referenced only from app group: sell |
| components/sidebar-menu.tsx | components/layout | unknown | 3 | Layout/navigation naming heuristics |
| components/sign-out-button.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/site-footer.tsx | components/layout | main, root | 2 | Layout/navigation naming heuristics |
| components/site-header.tsx | components/layout | main, root | 2 | Layout/navigation naming heuristics |
| components/skeletons/index.ts | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/skeletons/product-carousel-skeleton.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/skeletons/product-grid-skeleton.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sort-select.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/start-selling-banner.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/sticky-add-to-cart.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/sticky-checkout-button.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/subcategory-circles.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/subcategory-tabs.tsx | should move to route-owned _components | main | 2 | Referenced only from app group: main |
| components/tabbed-product-feed.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/tabbed-product-section.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/theme-provider.tsx | components/providers | (none found) | 0 | Provider/context heuristics |
| components/trending-products-section.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |
| components/ui/accordion.tsx | components/ui (primitive) | main, plans, unknown | 7 | Located under components/ui/ |
| components/ui/ai-assistant-interface.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/alert-dialog.tsx | components/ui (primitive) | account, sell | 6 | Located under components/ui/ |
| components/ui/alert.tsx | components/ui (primitive) | account, sell, unknown | 8 | Located under components/ui/ |
| components/ui/aspect-ratio.tsx | components/ui (primitive) | main, unknown | 8 | Located under components/ui/ |
| components/ui/avatar.tsx | components/ui (primitive) | account, admin, business, main, root, sell, unknown | 25 | Located under components/ui/ |
| components/ui/badge.tsx | components/ui (primitive) | account, admin, business, checkout, main, root, sell, unknown | 92 | Located under components/ui/ |
| components/ui/breadcrumb.tsx | components/ui (primitive) | main, unknown | 2 | Located under components/ui/ |
| components/ui/button-group.tsx | components/ui (primitive) | unknown | 1 | Located under components/ui/ |
| components/ui/button.tsx | components/ui (primitive) | account, admin, auth, business, checkout, main, plans, root, sell, unknown | 190 | Located under components/ui/ |
| components/ui/calendar.tsx | components/ui (primitive) | business, main, unknown | 3 | Located under components/ui/ |
| components/ui/card.tsx | components/ui (primitive) | account, admin, business, checkout, main, root, sell, unknown | 116 | Located under components/ui/ |
| components/ui/carousel.tsx | components/ui (primitive) | main, unknown | 2 | Located under components/ui/ |
| components/ui/chart.tsx | components/ui (primitive) | account, unknown | 5 | Located under components/ui/ |
| components/ui/checkbox.tsx | components/ui (primitive) | business, sell, unknown | 11 | Located under components/ui/ |
| components/ui/collapsible.tsx | components/ui (primitive) | main, unknown | 10 | Located under components/ui/ |
| components/ui/command.tsx | components/ui (primitive) | business, sell, unknown | 5 | Located under components/ui/ |
| components/ui/context-menu.tsx | components/ui (primitive) | main | 1 | Located under components/ui/ |
| components/ui/dialog.tsx | components/ui (primitive) | account, business, sell, unknown | 24 | Located under components/ui/ |
| components/ui/drawer.tsx | components/ui (primitive) | sell, unknown | 14 | Located under components/ui/ |
| components/ui/dropdown-menu.tsx | components/ui (primitive) | account, business, main, sell, unknown | 23 | Located under components/ui/ |
| components/ui/empty.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/field.tsx | components/ui (primitive) | sell | 10 | Located under components/ui/ |
| components/ui/form.tsx | components/ui (primitive) | auth | 4 | Located under components/ui/ |
| components/ui/hover-card.tsx | components/ui (primitive) | unknown | 14 | Located under components/ui/ |
| components/ui/input-group.tsx | components/ui (primitive) | unknown | 1 | Located under components/ui/ |
| components/ui/input-otp.tsx | components/ui (primitive) | main | 1 | Located under components/ui/ |
| components/ui/input.tsx | components/ui (primitive) | account, auth, business, chat, checkout, main, sell, unknown | 56 | Located under components/ui/ |
| components/ui/item.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/kbd.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/label.tsx | components/ui (primitive) | account, business, checkout, main, sell, unknown | 26 | Located under components/ui/ |
| components/ui/menubar.tsx | components/ui (primitive) | main | 1 | Located under components/ui/ |
| components/ui/modal.tsx | components/ui (primitive) | account | 1 | Located under components/ui/ |
| components/ui/navigation-menu.tsx | components/ui (primitive) | unknown | 1 | Located under components/ui/ |
| components/ui/page-container.tsx | components/ui (primitive) | unknown | 1 | Located under components/ui/ |
| components/ui/pagination.tsx | components/ui (primitive) | unknown | 1 | Located under components/ui/ |
| components/ui/popover.tsx | components/ui (primitive) | business, sell, unknown | 8 | Located under components/ui/ |
| components/ui/pricing-card.tsx | components/ui (primitive) | plans | 1 | Located under components/ui/ |
| components/ui/product-card.tsx | components/ui (primitive) | main, root, unknown | 21 | Located under components/ui/ |
| components/ui/progress.tsx | components/ui (primitive) | business, sell, unknown | 13 | Located under components/ui/ |
| components/ui/prompt-input.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/radio-group.tsx | components/ui (primitive) | checkout, unknown | 2 | Located under components/ui/ |
| components/ui/resizable.tsx | components/ui (primitive) | main | 1 | Located under components/ui/ |
| components/ui/scroll-area.tsx | components/ui (primitive) | account, admin, business, sell, unknown | 22 | Located under components/ui/ |
| components/ui/scroll-button.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/select.tsx | components/ui (primitive) | account, business, main, sell, unknown | 23 | Located under components/ui/ |
| components/ui/separator.tsx | components/ui (primitive) | account, business, checkout, main, root, unknown | 31 | Located under components/ui/ |
| components/ui/sheet.tsx | components/ui (primitive) | account, unknown | 7 | Located under components/ui/ |
| components/ui/sidebar.tsx | components/ui (primitive) | account, admin, business, unknown | 20 | Located under components/ui/ |
| components/ui/skeleton.tsx | components/ui (primitive) | account, admin, auth, business, chat, checkout, main, plans, root, sell, unknown | 74 | Located under components/ui/ |
| components/ui/slider.tsx | components/ui (primitive) | unknown | 2 | Located under components/ui/ |
| components/ui/sonner.tsx | components/ui (primitive) | root | 1 | Located under components/ui/ |
| components/ui/spinner.tsx | components/ui (primitive) | main, unknown | 3 | Located under components/ui/ |
| components/ui/switch.tsx | components/ui (primitive) | account, business, main, plans, sell, unknown | 9 | Located under components/ui/ |
| components/ui/table.tsx | components/ui (primitive) | account, admin, business, main, plans, unknown | 17 | Located under components/ui/ |
| components/ui/tabs.tsx | components/ui (primitive) | account, business, main, root, sell, unknown | 14 | Located under components/ui/ |
| components/ui/textarea.tsx | components/ui (primitive) | account, auth, business, main, sell, unknown | 16 | Located under components/ui/ |
| components/ui/toast.tsx | components/ui (primitive) | unknown | 2 | Located under components/ui/ |
| components/ui/toaster.tsx | components/ui (primitive) | (none found) | 0 | Located under components/ui/ |
| components/ui/toggle-group.tsx | components/ui (primitive) | account, main, unknown | 4 | Located under components/ui/ |
| components/ui/toggle.tsx | components/ui (primitive) | account, main, unknown | 5 | Located under components/ui/ |
| components/ui/tooltip.tsx | components/ui (primitive) | account, business, unknown | 15 | Located under components/ui/ |
| components/upgrade-banner.tsx | should move to route-owned _components | main | 1 | Referenced only from app group: main |
| components/upgrade-to-business-modal.tsx | components/common (shared composite) | (none found) | 0 | Default bucket (shared component under components/ root) |
| components/wishlist-button.tsx | components/common (shared composite) | unknown | 4 | Default bucket (shared component under components/ root) |
| components/wishlist-drawer.tsx | components/common (shared composite) | unknown | 1 | Default bucket (shared component under components/ root) |

## Notes
- “Referenced only from app group X” is a heuristic; Phase 3 will confirm before moving anything.
- Missing refs can mean: dynamic import paths, barrel exports, or component used only by tests/stories.