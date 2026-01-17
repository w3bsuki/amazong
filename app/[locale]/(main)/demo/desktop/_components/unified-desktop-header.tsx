"use client"

/**
 * Unified Desktop Header V2
 * 
 * MASSIVELY revamped header that integrates with the page:
 * 
 * Design philosophy:
 * 1. Header is a "shell" - logo + user actions in a slim bar
 * 2. Search + categories become part of a UNIFIED hero section
 * 3. The whole top area is one visual unit with shared background
 * 4. Removes the visual break between header and content
 * 
 * Key differences from current:
 * - No heavy separation between header and content
 * - Search is bigger, more prominent, centered
 * - Category pills live inline with search for quick access
 * - User actions are compact but accessible
 * - Glass/blur effects tie everything together
 */

import * as React from "react"
import { useState } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Heart,
  ChatCircle,
  Bell,
  Camera,
  ShoppingCart,
  MagnifyingGlass,
  CaretDown,
  User,
  List,
  SignOut,
  Gear,
  Package,
  Receipt,
  Storefront,
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

// =============================================================================
// TYPES
// =============================================================================

interface UnifiedHeaderProps {
  locale: string
  user?: { 
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  } | null
  /** Notification count */
  notificationCount?: number
  /** Cart item count */
  cartCount?: number
  /** Message count */
  messageCount?: number
  /** Category pills to show in header (quick access) */
  quickCategories?: { slug: string; name: string }[]
  /** Callback when search is submitted */
  onSearch?: (query: string) => void
  /** Additional classname for the header container */
  className?: string
}

// =============================================================================
// UNIFIED HEADER - Integrated shell
// =============================================================================

export function UnifiedDesktopHeader({
  locale,
  user,
  notificationCount = 0,
  cartCount = 0,
  messageCount = 0,
  quickCategories = [],
  onSearch,
  className,
}: UnifiedHeaderProps) {
  const [searchValue, setSearchValue] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim())
    }
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full",
        // Seamless background - extends into content
        "bg-background",
        className
      )}
    >
      {/* Primary bar - Logo + Search + Actions */}
      <div className="border-b border-border/50">
        <div className="container">
          <div className="h-16 flex items-center gap-4">
            {/* Logo + Account cluster */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold tracking-tight text-foreground">treido.</span>
              </Link>

              {/* Account dropdown (logged in) */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className={cn(
                        "hidden lg:flex items-center gap-2 px-3 py-2 rounded-md",
                        "text-sm hover:bg-muted/50 transition-colors",
                      )}
                    >
                      {user.user_metadata?.avatar_url ? (
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="" 
                          className="size-7 rounded-full object-cover ring-1 ring-border"
                        />
                      ) : (
                        <div className="size-7 rounded-full bg-muted flex items-center justify-center">
                          <User size={16} weight="regular" className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="text-left">
                        <span className="text-muted-foreground text-xs">
                          {locale === "bg" ? "Здравей," : "Hello,"}
                        </span>
                        <span className="block font-medium text-foreground -mt-0.5">{displayName}</span>
                      </div>
                      <CaretDown size={12} weight="bold" className="text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <User size={16} className="mr-2" />
                        {locale === "bg" ? "Профил" : "Profile"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders" className="cursor-pointer">
                        <Receipt size={16} className="mr-2" />
                        {locale === "bg" ? "Поръчки" : "Orders"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/listings" className="cursor-pointer">
                        <Package size={16} className="mr-2" />
                        {locale === "bg" ? "Моите обяви" : "My Listings"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/store" className="cursor-pointer">
                        <Storefront size={16} className="mr-2" />
                        {locale === "bg" ? "Моят магазин" : "My Store"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account/settings" className="cursor-pointer">
                        <Gear size={16} className="mr-2" />
                        {locale === "bg" ? "Настройки" : "Settings"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/auth/logout" className="cursor-pointer text-destructive focus:text-destructive">
                        <SignOut size={16} className="mr-2" />
                        {locale === "bg" ? "Изход" : "Log out"}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Search bar - Hero search */}
            <form 
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-2xl mx-auto"
            >
              <div 
                className={cn(
                  "relative flex items-center h-11 rounded-full transition-all duration-200",
                  "bg-muted/50 border",
                  isSearchFocused 
                    ? "border-primary ring-2 ring-primary/20 bg-background" 
                    : "border-border/60 hover:bg-muted/70"
                )}
              >
                <MagnifyingGlass
                  size={18}
                  weight="regular"
                  className="absolute left-4 text-muted-foreground pointer-events-none"
                />
                <Input
                  type="search"
                  placeholder={locale === "bg" ? "Търсене в продукти, марки и още..." : "Search products, brands and more..."}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="h-full w-full rounded-full border-0 bg-transparent pl-11 pr-12 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  variant="default"
                  size="icon"
                  className="absolute right-1 size-9 rounded-full"
                >
                  <MagnifyingGlass size={16} weight="bold" />
                </Button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-0.5 shrink-0">
              {/* Wishlist */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-10 text-muted-foreground hover:text-foreground hover:bg-muted/50" 
                asChild
              >
                <Link href="/wishlist" aria-label={locale === "bg" ? "Любими" : "Wishlist"}>
                  <Heart size={22} weight="regular" />
                </Link>
              </Button>

              {user && (
                <>
                  {/* Messages */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 relative" 
                    asChild
                  >
                    <Link href="/messages" aria-label={locale === "bg" ? "Съобщения" : "Messages"}>
                      <ChatCircle size={22} weight="regular" />
                      {messageCount > 0 && (
                        <span className="absolute top-1 right-1 size-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                          {messageCount > 9 ? "9+" : messageCount}
                        </span>
                      )}
                    </Link>
                  </Button>

                  {/* Notifications */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 relative"
                  >
                    <Bell size={22} weight="regular" />
                    {notificationCount > 0 && (
                      <span className="absolute top-1 right-1 size-4 bg-notification text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                  </Button>
                </>
              )}

              {/* Sell */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-10 text-muted-foreground hover:text-foreground hover:bg-muted/50" 
                asChild
              >
                <Link href="/sell" aria-label={locale === "bg" ? "Продай" : "Sell"}>
                  <Camera size={22} weight="regular" />
                </Link>
              </Button>

              {/* Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 relative" 
                asChild
              >
                <Link href="/cart" aria-label={locale === "bg" ? "Количка" : "Cart"}>
                  <ShoppingCart size={22} weight="regular" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-cart-badge text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Auth buttons (logged out) */}
              {!user && (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border/50">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-foreground hover:text-foreground/80 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    {locale === "bg" ? "Вход" : "Sign In"}
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="text-sm font-medium bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-md transition-colors"
                  >
                    {locale === "bg" ? "Регистрация" : "Register"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary bar - Quick category pills (optional) */}
      {quickCategories.length > 0 && (
        <div className="border-b border-border/30 bg-muted/20">
          <div className="container">
            <div className="h-10 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs text-muted-foreground shrink-0">
                {locale === "bg" ? "Популярни:" : "Popular:"}
              </span>
              {quickCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className={cn(
                    "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap",
                    "bg-background border border-border/60 text-muted-foreground",
                    "hover:bg-muted/50 hover:text-foreground hover:border-border transition-colors"
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// =============================================================================
// COMPACT HEADER VARIANT - For pages where content is primary
// =============================================================================

export function CompactDesktopHeader({
  locale,
  user,
  cartCount = 0,
  className,
}: Pick<UnifiedHeaderProps, "locale" | "user" | "cartCount" | "className">) {
  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border/50",
        className
      )}
    >
      <div className="container">
        <div className="h-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-lg font-bold tracking-tight text-foreground">treido.</span>
          </Link>

          {/* Compact search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative flex items-center h-9 rounded-md bg-muted/50 border border-border/60">
              <MagnifyingGlass size={16} className="absolute left-3 text-muted-foreground" />
              <Input
                type="search"
                placeholder={locale === "bg" ? "Търсене..." : "Search..."}
                className="h-full w-full border-0 bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Minimal actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-9" asChild>
              <Link href="/wishlist">
                <Heart size={20} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="size-9 relative" asChild>
              <Link href="/cart">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 size-4 bg-cart-badge text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
            {user ? (
              <Button variant="ghost" size="icon" className="size-9" asChild>
                <Link href="/account">
                  <User size={20} />
                </Link>
              </Button>
            ) : (
              <Button variant="default" size="sm" className="h-8 text-xs" asChild>
                <Link href="/auth/login">
                  {locale === "bg" ? "Вход" : "Sign In"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export type { UnifiedHeaderProps }
