# Domain 5 Components Audit (Session 25)

- Files: 145
- Tiny (<50L): 32
- Oversized (>300L): 8
- "use client" files: 37
- Dead files (zero imports): none

## Subdomain File Map

### components/auth (5 files, 983 LOC)

| File | LOC | Purpose | Flags |
|---|---:|---|---|
| components/auth/login-form-body.tsx | 283 | Exports LoginFormBody | client |
| components/auth/sign-up-form-body.tsx | 223 | Exports SignUpFormBody | client |
| components/auth/sign-up-form-fields.tsx | 360 | Exports SignUpNameField, SignUpUsernameField, SignUpEmailField, SignUpPasswordField, ... | oversized |
| components/auth/sign-up-form-footer.tsx | 72 | Exports SignUpFormFooter | - |
| components/auth/submit-button.tsx | 45 | Exports SubmitButton | tiny, client |

### components/desktop (4 files, 545 LOC)

| File | LOC | Purpose | Flags |
|---|---:|---|---|
| components/desktop/category-attribute-dropdowns.tsx | 183 | Exports CategoryFilterDef, CategoryAttributeDropdowns, CategoryAttributeDropdownsProps | - |
| components/desktop/feed-toolbar-pill.ts | 21 | Exports pillBase, pillInactive, pillActive | tiny |
| components/desktop/feed-toolbar.tsx | 243 | Exports FeedTab, QuickFilter, FilterState, CategoryAttribute, ... | - |
| components/desktop/quick-filter-pills.tsx | 98 | Exports QuickFilterPills, QuickFilterPillsProps | - |

### components/dropdowns (4 files, 445 LOC)

| File | LOC | Purpose | Flags |
|---|---:|---|---|
| components/dropdowns/account-dropdown.tsx | 187 | Exports AccountDropdown | client |
| components/dropdowns/index.ts | 5 | Exports AccountDropdown, MessagesDropdown, WishlistDropdown | tiny |
| components/dropdowns/messages-dropdown.tsx | 139 | Exports MessagesDropdown | client |
| components/dropdowns/wishlist-dropdown.tsx | 114 | Exports WishlistDropdown | client |

### components/grid (2 files, 241 LOC)

| File | LOC | Purpose | Flags |
|---|---:|---|---|
| components/grid/index.ts | 10 | Exports ProductGrid, ProductGridSkeleton, ProductGridProps, ProductGridProduct, ... | tiny |
| components/grid/product-grid.tsx | 231 | Exports ViewMode, ProductGridPreset, ProductGridProduct, ProductGridProps, ... | - |

### components/layout (23 files, 2542 LOC)

| File | LOC | Purpose | Flags |
|---|---:|---|---|
| components/layout/header/cart/cart-dropdown.tsx | 210 | Exports CartDropdown | client |
| components/layout/header/cart/mobile-cart-dropdown.tsx | 50 | Exports MobileCartDropdown | client |
| components/layout/header/desktop/desktop-search-helpers.ts | 15 | Exports buildSearchHref, buildProductUrl | tiny |
| components/layout/header/desktop/desktop-search-popover-panel.tsx | 300 | Exports DesktopSearchPopoverPanel | client |
| components/layout/header/desktop/desktop-search.tsx | 212 | Exports DesktopSearch | client |
| components/layout/header/desktop/index.ts | 4 | Exports DesktopStandardHeader, DesktopMinimalHeader | tiny |
| components/layout/header/desktop/minimal-header.tsx | 23 | Exports DesktopMinimalHeader | tiny |
| components/layout/header/desktop/standard-header.tsx | 93 | Exports DesktopStandardHeader | client |
| components/layout/header/mobile/contextual-header.tsx | 83 | Exports MobileContextualHeader | client |
| components/layout/header/mobile/homepage-header.tsx | 65 | Exports MobileHomepageHeader | client |
| components/layout/header/mobile/index.ts | 7 | Exports MobileHomepageHeader, MobileProductHeader, MobileContextualHeader, MobileProfileHeader, ... | tiny |
| components/layout/header/mobile/minimal-header.tsx | 23 | Exports MobileMinimalHeader | tiny |
| components/layout/header/mobile/product-header.tsx | 172 | Exports MobileProductHeader | client |
| components/layout/header/mobile/profile-header.tsx | 130 | Exports MobileProfileHeader | client |
| components/layout/header/types.ts | 88 | Exports HeaderVariant, BaseHeaderProps, HomepageHeaderProps, ProductHeaderProps, ... | - |
| components/layout/sidebar/sidebar-context.tsx | 259 | Exports SidebarContextProps, useSidebar, SidebarProvider, Sidebar, ... | client |
| components/layout/sidebar/sidebar-menu-body.tsx | 178 | Exports SidebarMenuBody | - |
| components/layout/sidebar/sidebar-menu-button.tsx | 83 | Exports SidebarMenuButton | - |
| components/layout/sidebar/sidebar-menu-header.tsx | 165 | Exports SidebarMenuHeader | - |
| components/layout/sidebar/sidebar-menu-nav-link.tsx | 36 | Exports SidebarMenuNavLink | tiny |
| components/layout/sidebar/sidebar-menu.tsx | 199 | Exports UserListingStats, SidebarMenuProps, SidebarMenu | client |
| components/layout/sidebar/sidebar-structure.tsx | 120 | Exports SidebarInset, SidebarHeader, SidebarFooter, SidebarContent, ... | - |
| components/layout/sidebar/sidebar.tsx | 27 | Exports Sidebar, SidebarProvider, SidebarTrigger, useSidebar, ... | tiny |

### components/mobile (11 files, 1827 LOC)

| File | LOC | Purpose | Flags |
|---|---:|---|---|
| components/mobile/category-nav/category-drawer-context.tsx | 229 | Exports DrawerSnap, CategoryDrawerState, CategoryDrawerActions, CategoryDrawerContextValue, ... | client |
| components/mobile/category-nav/category-drilldown-rail.tsx | 137 | Exports SectionPathSegment, CategoryOptionItem, CategoryOptionRail, CategoryOptionRailProps | client |
| components/mobile/category-nav/category-pill-rail.tsx | 144 | Exports CategoryPillRailItem, CategoryPillRail, CategoryPillRailProps | client |
| components/mobile/category-nav/index.ts | 10 | Exports CategoryPillRail, CategoryPillRailProps, CategoryPillRailItem, CategoryOptionRail, ... | tiny |
| components/mobile/chrome/mobile-control-recipes.ts | 52 | Exports MOBILE_ACTION_CHIP_CLASS, MOBILE_SEGMENTED_CONTAINER_CLASS, getMobilePrimaryTabClass, getMobileQuickPillClass, ... | - |
| components/mobile/drawers/account-drawer.tsx | 357 | Exports AccountDrawer | oversized, client |
| components/mobile/drawers/auth-drawer.tsx | 235 | Exports AuthDrawer | client |
| components/mobile/drawers/cart-drawer.tsx | 232 | Exports CartDrawer | client |
| components/mobile/drawers/index.ts | 6 | Exports ProductQuickViewDrawer, CartDrawer, MessagesDrawer, AccountDrawer, ... | tiny |
| components/mobile/drawers/messages-drawer.tsx | 230 | Exports MessagesDrawer | client |
| components/mobile/drawers/product-quick-view-drawer.tsx | 195 | Exports ProductQuickViewDrawer | client |

### components/providers (13 files, 2618 LOC)

| File | LOC | Purpose | Flags |
|---|---:|---|---|
| components/providers/_lib/analytics-drawer.ts | 149 | Exports DrawerType, DrawerCloseMethod, trackDrawerOpen, trackDrawerClose | - |
| components/providers/auth-state-manager.tsx | 272 | Exports AuthStateManager, useAuth, useAuthOptional | - |
| components/providers/cart-context-server.ts | 156 | Exports fetchServerCart, syncLocalCartToServerStorage, addServerCartItem, setServerCartQuantity, ... | - |
| components/providers/cart-context-types.ts | 17 | Exports CartItem | tiny |
| components/providers/cart-context-utils.ts | 117 | Exports MAX_CART_QUANTITY, toRecord, asString, asNumber, ... | - |
| components/providers/cart-context.tsx | 297 | Exports CartProvider, useCart, CartItem | - |
| components/providers/drawer-context.tsx | 237 | Exports QuickViewProduct, AuthDrawerMode, AuthDrawerEntrypoint, DrawerName, ... | - |
| components/providers/header-context.tsx | 83 | Exports HomepageHeaderState, ContextualHeaderState, ProductHeaderState, ProfileHeaderState, ... | client |
| components/providers/message-context.tsx | 242 | Exports Conversation, Message, MessageContextValue, ConversationBuyerProfile, ... | - |
| components/providers/messages/use-messages-actions.ts | 214 | Exports useMessagesActions | - |
| components/providers/messages/use-messages-realtime.ts | 187 | Exports useMessagesRealtime, useTypingIndicator | - |
| components/providers/messages/use-messages-state.ts | 310 | Exports MessagesState, MessagesStateActions, UseMessagesStateReturn, useMessagesState, ... | oversized |
| components/providers/wishlist-context.tsx | 337 | Exports WishlistItem, WishlistProvider, useWishlist | oversized |

### components/shared (48 files, 5870 LOC)

| File | LOC | Purpose | Flags |
|---|---:|---|---|
| components/shared/account-menu-items.tsx | 112 | Exports AccountDropdownMenu, AccountDrawerMenuItem, AccountDrawerQuickLinks | - |
| components/shared/activity-feed.tsx | 163 | Exports ActivitySectionHeader, ActivityThumbnail, ActivityRow, ActivityCardShell, ... | - |
| components/shared/count-badge.tsx | 31 | Exports CountBadge | tiny |
| components/shared/dashboard-header-shell.tsx | 40 | Exports DashboardHeaderShell | tiny, client |
| components/shared/dashboard-sidebar.tsx | 37 | Exports DashboardSidebar | tiny |
| components/shared/drawer-shell.tsx | 88 | Exports DrawerShell | - |
| components/shared/dropdown-product-item.tsx | 76 | Exports DropdownProductItem | - |
| components/shared/field.tsx | 147 | Exports Field, FieldLabel, FieldDescription, FieldError, ... | - |
| components/shared/filters/controls/color-swatches.tsx | 143 | Exports ColorSwatches | - |
| components/shared/filters/controls/filter-checkbox-item.tsx | 123 | Exports FilterCheckboxItem, FilterCheckboxList | client |
| components/shared/filters/sections/filter-rating-section.tsx | 63 | Exports FilterRatingSection | - |
| components/shared/header-dropdown-shell.tsx | 48 | Exports HeaderDropdownTitleRow, HeaderDropdownFooter | tiny |
| components/shared/header-dropdown.tsx | 72 | Exports HeaderDropdown | client |
| components/shared/header-icon-trigger.tsx | 42 | Exports HeaderIconTrigger | tiny |
| components/shared/order-detail/order-header.tsx | 87 | Exports OrderHeader | - |
| components/shared/order-detail/order-items-list.tsx | 61 | Exports OrderItemsList, OrderDetailItemShell | - |
| components/shared/order-detail/order-price-summary.tsx | 51 | Exports OrderPriceSummaryRows | - |
| components/shared/order-detail/order-side-card.tsx | 62 | Exports OrderDetailSideCard | - |
| components/shared/order-list-item.tsx | 126 | Exports OrderListStatusBadge, OrderListProductThumb | - |
| components/shared/order-summary-line.tsx | 112 | Exports OrderSummaryLine | - |
| components/shared/product/_lib/condition.ts | 76 | Exports getConditionBadgeVariant, getConditionKey | - |
| components/shared/product/card/actions.tsx | 161 | Exports ProductCardActions | - |
| components/shared/product/card/desktop.tsx | 312 | Exports DesktopProductCard | oversized, client |
| components/shared/product/card/image.tsx | 88 | Exports ProductCardImage | - |
| components/shared/product/card/list.tsx | 348 | Exports ProductCardList | oversized, client |
| components/shared/product/card/metadata.ts | 123 | Exports getProductUrl, getDiscountPercent, getRootCategoryLabel, getOverlayBadgeVariants, ... | - |
| components/shared/product/card/mini.tsx | 119 | Exports ProductMiniCard | client |
| components/shared/product/card/mobile.tsx | 295 | Exports MobileProductCard | client |
| components/shared/product/card/price.tsx | 194 | Exports ProductCardPrice | - |
| components/shared/product/card/social-proof.tsx | 73 | Exports ProductCardSocialProof | - |
| components/shared/product/card/types.ts | 52 | Exports ProductCardData, ProductCardBaseProps, MobileProductCardLayout | - |
| components/shared/product/freshness-indicator.tsx | 127 | Exports FreshnessIndicator | client |
| components/shared/product/pdp/category-badge.tsx | 74 | Exports CategoryBadge | - |
| components/shared/product/product-price.tsx | 113 | Exports ProductPrice | - |
| components/shared/product/quick-view/product-quick-view-content.tsx | 200 | Exports ProductQuickViewViewProps, ProductQuickViewContent | - |
| components/shared/product/quick-view/product-quick-view-desktop-content.tsx | 200 | Exports ProductQuickViewDesktopContent | - |
| components/shared/product/quick-view/product-quick-view-mobile-content.tsx | 211 | Exports ProductQuickViewMobileContent | - |
| components/shared/product/quick-view/quick-view-chrome.tsx | 206 | Exports QuickViewActionButtons, QuickViewSellerSkeletonCard, QuickViewProtectionCard, QuickViewFooterActions, ... | - |
| components/shared/product/quick-view/quick-view-image-gallery.tsx | 247 | Exports QuickViewImageGallery | client |
| components/shared/product/quick-view/quick-view-seller-card.tsx | 92 | Exports QuickViewSellerCard | - |
| components/shared/product/quick-view/quick-view-skeleton.tsx | 59 | Exports QuickViewSkeleton | - |
| components/shared/product/verified-seller-badge.tsx | 47 | Exports VerifiedSellerBadge | tiny |
| components/shared/search/ai/search-ai-chat.tsx | 337 | Exports SearchAiChat | oversized |
| components/shared/search/overlay/search-context.ts | 32 | Exports SearchLaunchContext, buildSearchHref | tiny |
| components/shared/stat-card.tsx | 54 | Exports StatCardGrid, StatCard | - |
| components/shared/user-avatar.tsx | 114 | Exports UserAvatar | - |
| components/shared/wishlist/mobile-wishlist-button.tsx | 58 | Exports MobileWishlistButton | - |
| components/shared/wishlist/wishlist-drawer.tsx | 174 | Exports WishlistDrawer | - |

### components/ui (35 files, 3139 LOC)

| File | LOC | Purpose | Flags |
|---|---:|---|---|
| components/ui/accordion.tsx | 68 | Exports Accordion, AccordionItem, AccordionTrigger, AccordionContent | - |
| components/ui/alert-dialog.tsx | 164 | Exports AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, ... | - |
| components/ui/alert.tsx | 67 | Exports Alert, AlertTitle, AlertDescription | - |
| components/ui/aspect-ratio.tsx | 11 | Exports AspectRatio | tiny |
| components/ui/avatar.tsx | 53 | Exports Avatar, AvatarImage, AvatarFallback | - |
| components/ui/badge.tsx | 112 | Exports Badge, badgeVariants | - |
| components/ui/breadcrumb.tsx | 91 | Exports Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, ... | - |
| components/ui/button.tsx | 82 | Exports ButtonProps, Button, buttonVariants | - |
| components/ui/card.tsx | 91 | Exports Card, CardHeader, CardFooter, CardTitle, ... | - |
| components/ui/checkbox.tsx | 37 | Exports Checkbox | tiny |
| components/ui/command.tsx | 191 | Exports Command, CommandDialog, CommandInput, CommandList, ... | - |
| components/ui/dialog.tsx | 211 | Exports Dialog, DialogClose, DialogContent, DialogDescription, ... | - |
| components/ui/drawer.tsx | 343 | Exports Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, ... | oversized, client |
| components/ui/dropdown-menu.tsx | 191 | Exports DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, ... | - |
| components/ui/hover-card.tsx | 52 | Exports HoverCard, HoverCardTrigger, HoverCardContent | - |
| components/ui/icon-button.tsx | 39 | Exports IconButtonProps, IconButton | tiny |
| components/ui/input.tsx | 23 | Exports Input | tiny |
| components/ui/label.tsx | 24 | Exports Label | tiny |
| components/ui/mobile-bottom-nav.tsx | 147 | Exports MobileBottomNavRoot, MobileBottomNavDock, MobileBottomNavList, MobileBottomNavItem, ... | - |
| components/ui/pagination.tsx | 140 | Exports Pagination, PaginationContent, PaginationLink, PaginationItem, ... | - |
| components/ui/popover.tsx | 58 | Exports Popover, PopoverTrigger, PopoverContent, PopoverAnchor | - |
| components/ui/progress.tsx | 36 | Exports Progress | tiny |
| components/ui/radio-group.tsx | 46 | Exports RadioGroup, RadioGroupItem | tiny |
| components/ui/scroll-area.tsx | 58 | Exports ScrollArea, ScrollBar | - |
| components/ui/select.tsx | 184 | Exports Select, SelectContent, SelectItem, SelectScrollDownButton, ... | - |
| components/ui/separator.tsx | 28 | Exports Separator | tiny |
| components/ui/sheet.tsx | 143 | Exports Sheet, SheetTrigger, SheetPortal, SheetOverlay, ... | - |
| components/ui/skeleton.tsx | 14 | Exports Skeleton | tiny |
| components/ui/slider.tsx | 63 | Exports Slider | - |
| components/ui/switch.tsx | 31 | Exports Switch | tiny |
| components/ui/table.tsx | 87 | Exports Table, TableHeader, TableBody, TableHead, ... | - |
| components/ui/tabs.tsx | 78 | Exports Tabs, TabsList, TabsTrigger, TabsContent | - |
| components/ui/textarea.tsx | 20 | Exports Textarea | tiny |
| components/ui/toggle-group.tsx | 95 | Exports ToggleGroup, ToggleGroupItem | client |
| components/ui/tooltip.tsx | 61 | Exports Tooltip, TooltipTrigger, TooltipContent, TooltipProvider | - |

## Shared Export Usage Matrix

| File | Export | Direct Consumers | Route Groups |
|---|---|---:|---|
| components/shared/account-menu-items.tsx | AccountDropdownMenu | 1 | main |
| components/shared/account-menu-items.tsx | AccountDrawerMenuItem | 1 | account, chat, checkout, main |
| components/shared/account-menu-items.tsx | AccountDrawerQuickLinks | 1 | account, chat, checkout, main |
| components/shared/activity-feed.tsx | ActivitySectionHeader | 1 | account |
| components/shared/activity-feed.tsx | ActivityThumbnail | 1 | business |
| components/shared/activity-feed.tsx | ActivityRow | 1 | business |
| components/shared/activity-feed.tsx | ActivityCardShell | 2 | admin, business |
| components/shared/activity-feed.tsx | ActivityScrollList | 2 | admin, business |
| components/shared/activity-feed.tsx | ActivityEmptyState | 2 | admin, business |
| components/shared/activity-feed.tsx | ActivityListShell | 1 | account |
| components/shared/count-badge.tsx | CountBadge | 7 | main |
| components/shared/dashboard-header-shell.tsx | DashboardHeaderShell | 3 | account, admin, business |
| components/shared/dashboard-sidebar.tsx | DashboardSidebar | 3 | account, admin, business |
| components/shared/drawer-shell.tsx | DrawerShell | 5 | account, chat, checkout, main |
| components/shared/dropdown-product-item.tsx | DropdownProductItem | 1 | main |
| components/shared/field.tsx | Field | 18 | account, auth, chat, checkout, main, sell |
| components/shared/field.tsx | FieldLabel | 22 | account, auth, chat, checkout, main, sell |
| components/shared/field.tsx | FieldDescription | 11 | main, sell |
| components/shared/field.tsx | FieldError | 13 | account, auth, chat, checkout, main, sell |
| components/shared/field.tsx | FieldContent | 18 | account, auth, chat, checkout, main, sell |
| components/shared/filters/controls/color-swatches.tsx | ColorSwatches | 1 | main |
| components/shared/filters/controls/filter-checkbox-item.tsx | FilterCheckboxItem | 4 | main |
| components/shared/filters/controls/filter-checkbox-item.tsx | FilterCheckboxList | 1 | main |
| components/shared/filters/sections/filter-rating-section.tsx | FilterRatingSection | 2 | main |
| components/shared/header-dropdown-shell.tsx | HeaderDropdownTitleRow | 1 | main |
| components/shared/header-dropdown-shell.tsx | HeaderDropdownFooter | 2 | main |
| components/shared/header-dropdown.tsx | HeaderDropdown | 3 | main |
| components/shared/header-icon-trigger.tsx | HeaderIconTrigger | 3 | main |
| components/shared/order-detail/order-header.tsx | OrderHeader | 2 | account, business |
| components/shared/order-detail/order-items-list.tsx | OrderItemsList | 2 | account, business |
| components/shared/order-detail/order-items-list.tsx | OrderDetailItemShell | 2 | account, business |
| components/shared/order-detail/order-price-summary.tsx | OrderPriceSummaryRows | 2 | account, business |
| components/shared/order-detail/order-side-card.tsx | OrderDetailSideCard | 3 | account, business |
| components/shared/order-list-item.tsx | OrderListStatusBadge | 5 | account, business |
| components/shared/order-list-item.tsx | OrderListProductThumb | 5 | account, business |
| components/shared/order-summary-line.tsx | OrderSummaryLine | 3 | account, business |
| components/shared/product/_lib/condition.ts | getConditionBadgeVariant | 6 | account, chat, checkout, main |
| components/shared/product/_lib/condition.ts | getConditionKey | 5 | account, chat, checkout, main |
| components/shared/product/card/actions.tsx | ProductCardActions | 3 | main |
| components/shared/product/card/desktop.tsx | DesktopProductCard | 3 | main |
| components/shared/product/card/image.tsx | ProductCardImage | 2 | main |
| components/shared/product/card/list.tsx | ProductCardList | 1 | main |
| components/shared/product/card/metadata.ts | getProductUrl | 2 | main |
| components/shared/product/card/metadata.ts | getDiscountPercent | 2 | main |
| components/shared/product/card/metadata.ts | getRootCategoryLabel | 2 | main |
| components/shared/product/card/metadata.ts | getOverlayBadgeVariants | 2 | main |
| components/shared/product/card/metadata.ts | buildQuickViewProduct | 2 | main |
| components/shared/product/card/mini.tsx | ProductMiniCard | 6 | main |
| components/shared/product/card/mobile.tsx | MobileProductCard | 5 | main |
| components/shared/product/card/price.tsx | ProductCardPrice | 4 | main |
| components/shared/product/card/social-proof.tsx | ProductCardSocialProof | 1 | main |
| components/shared/product/card/types.ts | ProductCardData | 2 | account, chat, checkout, main |
| components/shared/product/card/types.ts | ProductCardBaseProps | 2 | main |
| components/shared/product/card/types.ts | MobileProductCardLayout | 1 | main |
| components/shared/product/freshness-indicator.tsx | FreshnessIndicator | 4 | main |
| components/shared/product/pdp/category-badge.tsx | CategoryBadge | 2 | - |
| components/shared/product/product-price.tsx | ProductPrice | 1 | - |
| components/shared/product/quick-view/product-quick-view-content.tsx | ProductQuickViewViewProps | 2 | account, chat, checkout, main |
| components/shared/product/quick-view/product-quick-view-content.tsx | ProductQuickViewContent | 2 | account, chat, checkout, main |
| components/shared/product/quick-view/product-quick-view-desktop-content.tsx | ProductQuickViewDesktopContent | 1 | account, chat, checkout, main |
| components/shared/product/quick-view/product-quick-view-mobile-content.tsx | ProductQuickViewMobileContent | 1 | account, chat, checkout, main |
| components/shared/product/quick-view/quick-view-chrome.tsx | QuickViewActionButtons | 2 | account, chat, checkout, main |
| components/shared/product/quick-view/quick-view-chrome.tsx | QuickViewSellerSkeletonCard | 2 | account, chat, checkout, main |
| components/shared/product/quick-view/quick-view-chrome.tsx | QuickViewProtectionCard | 2 | account, chat, checkout, main |
| components/shared/product/quick-view/quick-view-chrome.tsx | QuickViewFooterActions | 2 | account, chat, checkout, main |
| components/shared/product/quick-view/quick-view-chrome.tsx | QuickViewShippingBadge | 1 | account, chat, checkout, main |
| components/shared/product/quick-view/quick-view-image-gallery.tsx | QuickViewImageGallery | 2 | account, chat, checkout, main |
| components/shared/product/quick-view/quick-view-seller-card.tsx | QuickViewSellerCard | 2 | account, chat, checkout, main |
| components/shared/product/quick-view/quick-view-skeleton.tsx | QuickViewSkeleton | 2 | account, chat, checkout, main |
| components/shared/product/verified-seller-badge.tsx | VerifiedSellerBadge | 2 | main |
| components/shared/search/ai/search-ai-chat.tsx | SearchAiChat | 2 | main |
| components/shared/search/overlay/search-context.ts | SearchLaunchContext | 1 | main |
| components/shared/search/overlay/search-context.ts | buildSearchHref | 2 | main |
| components/shared/stat-card.tsx | StatCardGrid | 5 | account, admin, business |
| components/shared/stat-card.tsx | StatCard | 5 | account, admin, business |
| components/shared/user-avatar.tsx | UserAvatar | 23 | account, admin, business, chat, checkout, main, sell |
| components/shared/wishlist/mobile-wishlist-button.tsx | MobileWishlistButton | 2 | main |
| components/shared/wishlist/wishlist-drawer.tsx | WishlistDrawer | 1 | account, chat, checkout, main |

## Dead Code Findings

- No dead component files (zero importers) detected after grep + graph scan.
- No dead shared exports remain after cleanup.
