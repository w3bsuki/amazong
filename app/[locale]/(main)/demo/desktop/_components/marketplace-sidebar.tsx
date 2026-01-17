"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon } from "@/lib/category-icons"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { User } from "@supabase/supabase-js"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  ShoppingCart,
  Bell,
  Camera,
  ChatCircle,
  User as UserIcon,
  SignOut,
  Gear,
  CaretRight,
  ArrowLeft,
  SquaresFour,
  CaretUpDown,
} from "@phosphor-icons/react"

// =============================================================================
// TYPES
// =============================================================================

export interface CategoryPath {
  slug: string
  name: string
}

interface MarketplaceSidebarProps {
  user: User | null
  categories: CategoryTreeNode[]
  selectedPath: CategoryPath[]
  onCategorySelect: (path: CategoryPath[], category: CategoryTreeNode | null) => void
  categoryCounts?: Record<string, number>
  // Notification counts
  wishlistCount?: number
  cartCount?: number
  notificationCount?: number
  messageCount?: number
}

// =============================================================================
// SIDEBAR HEADER - Logo + Account
// =============================================================================

function SidebarBrandHeader({ user }: { user: User | null }) {
  const locale = useLocale()
  const t = useTranslations("Navigation")
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const userInitials = React.useMemo(() => {
    if (!user?.email) return "U"
    return user.email.slice(0, 2).toUpperCase()
  }, [user])

  const displayName = React.useMemo(() => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.email) return user.email.split("@")[0]
    return locale === "bg" ? "Акаунт" : "Account"
  }, [user, locale])

  return (
    <SidebarHeader className="p-3">
      {/* Logo */}
      <Link
        href="/"
        className={cn(
          "flex items-center gap-2 transition-all",
          isCollapsed && "justify-center"
        )}
      >
        <div className="flex size-8 items-center justify-center rounded-lg bg-foreground">
          <span className="text-lg font-bold text-background">t</span>
        </div>
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight">treido.</span>
        )}
      </Link>

      {/* Account Section */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "mt-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                isCollapsed && "justify-center p-0"
              )}
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage
                  src={user.user_metadata?.avatar_url}
                  alt={displayName}
                />
                <AvatarFallback className="rounded-lg text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {locale === "bg" ? "Здравей" : "Welcome back"}
                    </span>
                  </div>
                  <CaretUpDown className="ml-auto size-4" weight="bold" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side="right"
            align="start"
            sideOffset={4}
          >
            <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
              <Avatar className="size-8 rounded-lg">
                <AvatarImage
                  src={user.user_metadata?.avatar_url}
                  alt={displayName}
                />
                <AvatarFallback className="rounded-lg text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account" className="flex items-center gap-2">
                <UserIcon size={16} />
                <span>{locale === "bg" ? "Моят профил" : "My Profile"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/settings" className="flex items-center gap-2">
                <Gear size={16} />
                <span>{locale === "bg" ? "Настройки" : "Settings"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/logout" className="flex items-center gap-2 text-destructive">
                <SignOut size={16} />
                <span>{locale === "bg" ? "Изход" : "Sign out"}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        !isCollapsed && (
          <div className="mt-2 flex flex-col gap-1.5">
            <Link
              href="/auth/login"
              className="flex h-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              {t("signIn")}
            </Link>
            <Link
              href="/auth/sign-up"
              className="flex h-9 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("register")}
            </Link>
          </div>
        )
      )}
    </SidebarHeader>
  )
}

// =============================================================================
// SIDEBAR CATEGORIES - Drill-down Navigation
// =============================================================================

function SidebarCategories({
  categories,
  selectedPath,
  onCategorySelect,
  categoryCounts = {},
}: {
  categories: CategoryTreeNode[]
  selectedPath: CategoryPath[]
  onCategorySelect: (path: CategoryPath[], category: CategoryTreeNode | null) => void
  categoryCounts?: Record<string, number>
}) {
  const locale = useLocale()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  // Current view level: 0 = L0 list, 1 = L1 list, 2 = L2 list
  const [viewLevel, setViewLevel] = React.useState(0)
  const [currentL0, setCurrentL0] = React.useState<CategoryTreeNode | null>(null)
  const [currentL1, setCurrentL1] = React.useState<CategoryTreeNode | null>(null)

  // Sync view state with selected path
  React.useEffect(() => {
    if (selectedPath.length === 0) {
      setViewLevel(0)
      setCurrentL0(null)
      setCurrentL1(null)
    } else if (selectedPath.length === 1) {
      const l0 = categories.find((c) => c.slug === selectedPath[0]?.slug)
      if (l0) {
        setCurrentL0(l0)
        setViewLevel(1)
        setCurrentL1(null)
      }
    } else if (selectedPath.length >= 2) {
      const l0 = categories.find((c) => c.slug === selectedPath[0]?.slug)
      if (l0) {
        setCurrentL0(l0)
        const l1 = l0.children?.find((c) => c.slug === selectedPath[1]?.slug)
        if (l1) {
          setCurrentL1(l1)
          setViewLevel(2)
        } else {
          setViewLevel(1)
        }
      }
    }
  }, [selectedPath, categories])

  // Get total count
  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  // Current items to display based on view level
  const currentItems = React.useMemo(() => {
    if (viewLevel === 0) {
      return categories.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    }
    if (viewLevel === 1 && currentL0?.children) {
      return currentL0.children.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    }
    if (viewLevel === 2 && currentL1?.children) {
      return currentL1.children.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    }
    return []
  }, [viewLevel, currentL0, currentL1, categories])

  // Header category
  const headerCategory = viewLevel === 2 ? currentL1 : viewLevel === 1 ? currentL0 : null

  // Back label
  const backLabel = React.useMemo(() => {
    if (viewLevel === 2 && currentL0) {
      return getCategoryName(currentL0, locale)
    }
    if (viewLevel === 1) {
      return locale === "bg" ? "Всички" : "All"
    }
    return null
  }, [viewLevel, currentL0, locale])

  // Handle back navigation
  const handleBack = () => {
    if (viewLevel === 2) {
      setViewLevel(1)
      setCurrentL1(null)
      if (currentL0) {
        const path: CategoryPath[] = [{ slug: currentL0.slug, name: getCategoryName(currentL0, locale) }]
        onCategorySelect(path, currentL0)
      }
    } else if (viewLevel === 1) {
      setViewLevel(0)
      setCurrentL0(null)
      setCurrentL1(null)
      onCategorySelect([], null)
    }
  }

  // Handle "All" click
  const handleClearAll = () => {
    setViewLevel(0)
    setCurrentL0(null)
    setCurrentL1(null)
    onCategorySelect([], null)
  }

  // Handle item click
  const handleItemClick = (item: CategoryTreeNode) => {
    const hasChildren = item.children && item.children.length > 0

    if (viewLevel === 0) {
      setCurrentL0(item)
      const path: CategoryPath[] = [{ slug: item.slug, name: getCategoryName(item, locale) }]
      if (hasChildren) {
        setViewLevel(1)
        onCategorySelect(path, item)
      } else {
        onCategorySelect(path, item)
      }
    } else if (viewLevel === 1 && currentL0) {
      setCurrentL1(item)
      const path: CategoryPath[] = [
        { slug: currentL0.slug, name: getCategoryName(currentL0, locale) },
        { slug: item.slug, name: getCategoryName(item, locale) },
      ]
      if (hasChildren) {
        setViewLevel(2)
        onCategorySelect(path, item)
      } else {
        onCategorySelect(path, item)
      }
    } else if (viewLevel === 2 && currentL0 && currentL1) {
      const path: CategoryPath[] = [
        { slug: currentL0.slug, name: getCategoryName(currentL0, locale) },
        { slug: currentL1.slug, name: getCategoryName(currentL1, locale) },
        { slug: item.slug, name: getCategoryName(item, locale) },
      ]
      onCategorySelect(path, item)
    }
  }

  // Check if item is selected
  const isSelected = (slug: string) => {
    if (selectedPath.length === 0) return false
    return selectedPath[selectedPath.length - 1]?.slug === slug
  }

  if (isCollapsed) {
    // Collapsed view - show icons only for L0 categories
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleClearAll}
                isActive={selectedPath.length === 0}
                tooltip={locale === "bg" ? "Всички" : "All"}
              >
                <SquaresFour size={20} weight={selectedPath.length === 0 ? "fill" : "regular"} />
              </SidebarMenuButton>
            </SidebarMenuItem>
            {categories.slice(0, 10).map((cat) => (
              <SidebarMenuItem key={cat.slug}>
                <SidebarMenuButton
                  onClick={() => handleItemClick(cat)}
                  isActive={selectedPath[0]?.slug === cat.slug}
                  tooltip={getCategoryName(cat, locale)}
                >
                  {getCategoryIcon(cat.slug, { size: 20, weight: selectedPath[0]?.slug === cat.slug ? "fill" : "regular" })}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* Back Button */}
          {viewLevel > 0 && backLabel && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleBack}>
                <ArrowLeft size={18} weight="bold" />
                <span>{backLabel}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* "All" at L0, or "All in X" at L1/L2 */}
          {viewLevel === 0 ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleClearAll}
                isActive={selectedPath.length === 0}
              >
                <SquaresFour size={20} weight={selectedPath.length === 0 ? "fill" : "regular"} />
                <span>{locale === "bg" ? "Всички" : "All"}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {totalCount || "—"}
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : headerCategory ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  if (viewLevel === 1 && currentL0) {
                    const path: CategoryPath[] = [{ slug: currentL0.slug, name: getCategoryName(currentL0, locale) }]
                    onCategorySelect(path, currentL0)
                  } else if (viewLevel === 2 && currentL0 && currentL1) {
                    const path: CategoryPath[] = [
                      { slug: currentL0.slug, name: getCategoryName(currentL0, locale) },
                      { slug: currentL1.slug, name: getCategoryName(currentL1, locale) },
                    ]
                    onCategorySelect(path, currentL1)
                  }
                }}
                isActive
              >
                <SquaresFour size={18} weight="fill" />
                <span className="truncate">
                  {locale === "bg" ? "Всички в " : "All in "}
                  {getCategoryName(headerCategory, locale)}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : null}

          {/* Category Items */}
          {currentItems.map((item) => {
            const name = getCategoryName(item, locale)
            const count = categoryCounts[item.slug]
            const hasChildren = item.children && item.children.length > 0
            const selected = isSelected(item.slug)

            return (
              <SidebarMenuItem key={item.slug}>
                <SidebarMenuButton
                  onClick={() => handleItemClick(item)}
                  isActive={selected}
                >
                  {viewLevel === 0 && (
                    <span className={selected ? "text-sidebar-accent-foreground" : "text-muted-foreground"}>
                      {getCategoryIcon(item.slug, { size: 20, weight: selected ? "fill" : "regular" })}
                    </span>
                  )}
                  <span className="flex-1 truncate">{name}</span>
                  {typeof count === "number" && (
                    <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
                  )}
                  {hasChildren && (
                    <CaretRight
                      size={14}
                      weight="bold"
                      className="text-muted-foreground/60"
                    />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

// =============================================================================
// SIDEBAR FOOTER - Action Icons Grid
// =============================================================================

function SidebarActions({
  user,
  wishlistCount = 0,
  cartCount = 0,
  notificationCount = 0,
  messageCount = 0,
}: {
  user: User | null
  wishlistCount?: number
  cartCount?: number
  notificationCount?: number
  messageCount?: number
}) {
  const locale = useLocale()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const actions = [
    {
      icon: Heart,
      label: locale === "bg" ? "Любими" : "Wishlist",
      href: "/wishlist",
      count: wishlistCount,
      requiresAuth: true,
    },
    {
      icon: ShoppingCart,
      label: locale === "bg" ? "Количка" : "Cart",
      href: "/cart",
      count: cartCount,
      requiresAuth: false,
    },
    {
      icon: Bell,
      label: locale === "bg" ? "Известия" : "Notifications",
      href: "/notifications",
      count: notificationCount,
      requiresAuth: true,
    },
    {
      icon: ChatCircle,
      label: locale === "bg" ? "Съобщения" : "Messages",
      href: "/messages",
      count: messageCount,
      requiresAuth: true,
    },
    {
      icon: Camera,
      label: locale === "bg" ? "Продай" : "Sell",
      href: "/sell",
      count: 0,
      requiresAuth: false,
      highlight: true,
    },
  ]

  const visibleActions = actions.filter((a) => !a.requiresAuth || user)

  if (isCollapsed) {
    return (
      <SidebarFooter className="p-2">
        <SidebarMenu>
          {visibleActions.map((action) => (
            <SidebarMenuItem key={action.href}>
              <SidebarMenuButton asChild tooltip={action.label}>
                <Link href={action.href} className="relative">
                  <action.icon
                    size={20}
                    weight={action.highlight ? "fill" : "regular"}
                    className={action.highlight ? "text-primary" : undefined}
                  />
                  {action.count > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                      {action.count > 9 ? "9+" : action.count}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    )
  }

  return (
    <SidebarFooter className="p-3">
      {/* Action grid - 2 columns */}
      <div className="grid grid-cols-5 gap-1">
        {visibleActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 rounded-md p-2 text-center transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              action.highlight && "text-primary"
            )}
          >
            <div className="relative">
              <action.icon size={22} weight={action.highlight ? "fill" : "regular"} />
              {action.count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {action.count > 9 ? "9+" : action.count}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium leading-none">{action.label}</span>
          </Link>
        ))}
      </div>
    </SidebarFooter>
  )
}

// =============================================================================
// MAIN EXPORT - Marketplace Sidebar
// =============================================================================

export function MarketplaceSidebar({
  user,
  categories,
  selectedPath,
  onCategorySelect,
  categoryCounts = {},
  wishlistCount = 0,
  cartCount = 0,
  notificationCount = 0,
  messageCount = 0,
}: MarketplaceSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarBrandHeader user={user} />
      <SidebarSeparator />
      <SidebarContent>
        <SidebarCategories
          categories={categories}
          selectedPath={selectedPath}
          onCategorySelect={onCategorySelect}
          categoryCounts={categoryCounts}
        />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarActions
        user={user}
        wishlistCount={wishlistCount}
        cartCount={cartCount}
        notificationCount={notificationCount}
        messageCount={messageCount}
      />
    </Sidebar>
  )
}

export type { MarketplaceSidebarProps }
