"use client"

import { useCallback, useEffect, useState } from "react"
import {
  User,
  Package,
  ChatCircle,
  Storefront,
  Heart,
  Gear,
  Star,
  CaretRight,
  X,
} from "@phosphor-icons/react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
  DrawerBody,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useAuth } from "@/components/providers/auth-state-manager"
import { useMessages } from "@/components/providers/message-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useDrawer } from "@/components/providers/drawer-context"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
import { UserAvatar } from "@/components/shared/user-avatar"

interface AccountDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface UserProfile {
  display_name: string | null
  avatar_url: string | null
  business_name: string | null
  username: string | null
}

interface SellerStats {
  average_rating: number | null
  total_sales: number | null
}

interface RecentListing {
  id: string
  title: string
  price: number
  images: string[] | null
  slug: string | null
}

interface AccountStats {
  pendingOrders: number
  activeListings: number
}

/**
 * AccountDrawer - Quick access to account actions
 * 
 * Shows profile summary, quick links with badges,
 * and recent listings (6 max).
 */
export function AccountDrawer({ open, onOpenChange }: AccountDrawerProps) {
  const { user, isLoading: authLoading } = useAuth()
  const { totalUnreadCount } = useMessages()
  const { totalItems: wishlistCount } = useWishlist()
  const { openAuth } = useDrawer()
  const t = useTranslations("Drawers")
  const tAccount = useTranslations("AccountDrawer")
  const tAuth = useTranslations("Auth")
  const locale = useLocale()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [sellerStats, setSellerStats] = useState<SellerStats | null>(null)
  const [stats, setStats] = useState<AccountStats>({ pendingOrders: 0, activeListings: 0 })
  const [recentListings, setRecentListings] = useState<RecentListing[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange])

  // Fetch user data when drawer opens
  useEffect(() => {
    if (!open || !user?.id) {
      setProfile(null)
      setSellerStats(null)
      setStats({ pendingOrders: 0, activeListings: 0 })
      setRecentListings([])
      return
    }

    let mounted = true
    const fetchData = async () => {
      setIsLoadingData(true)
      const supabase = createClient()

      try {
        // Fetch profile, seller stats, orders, and listings in parallel
        const [profileResult, sellerStatsResult, ordersResult, productsResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("display_name, avatar_url, business_name, username")
            .eq("id", user.id)
            .single(),
          supabase
            .from("seller_stats")
            .select("average_rating, total_sales")
            .eq("seller_id", user.id)
            .maybeSingle(),
          supabase
            .from("orders")
            .select("id", { count: "exact" })
            .eq("user_id", user.id)
            .in("status", ["pending", "processing"]),
          supabase
            .from("products")
            .select("id, title, price, images, slug", { count: "exact" })
            .eq("seller_id", user.id)
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(6),
        ])

        if (!mounted) return

        if (profileResult.data) {
          setProfile(profileResult.data as UserProfile)
        }

        if (sellerStatsResult.data) {
          setSellerStats(sellerStatsResult.data as SellerStats)
        }

        setStats({
          pendingOrders: ordersResult.count ?? 0,
          activeListings: productsResult.count ?? 0,
        })

        if (productsResult.data) {
          setRecentListings(productsResult.data as RecentListing[])
        }
      } catch (error) {
        console.error("Failed to fetch account drawer data:", error)
      } finally {
        if (mounted) {
          setIsLoadingData(false)
        }
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [open, user?.id])

  const displayName = profile?.business_name || profile?.display_name || user?.email?.split("@")[0] || "User"
  const avatarUrl = profile?.avatar_url
  const rating = sellerStats?.average_rating ?? 0
  const totalSales = sellerStats?.total_sales ?? 0
  const username = profile?.username

  const formatPrice = useCallback(
    (price: number) =>
      new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price),
    [locale]
  )

  // Quick links with badges
  const quickLinks = [
    {
      href: "/account/orders",
      icon: Package,
      label: tAccount("orders"),
      badge: stats.pendingOrders > 0 ? tAccount("pending", { count: stats.pendingOrders }) : null,
      badgeType: "warning" as const,
    },
    {
      href: "/chat",
      icon: ChatCircle,
      label: tAccount("messagesLink"),
      badge: totalUnreadCount > 0 ? tAccount("unread", { count: totalUnreadCount }) : null,
      badgeType: "destructive" as const,
    },
    {
      href: "/account/selling",
      icon: Storefront,
      label: tAccount("myListings"),
      badge: stats.activeListings > 0 ? tAccount("active", { count: stats.activeListings }) : null,
      badgeType: "muted" as const,
    },
    {
      href: "/account/wishlist",
      icon: Heart,
      label: tAccount("wishlist"),
      badge: wishlistCount > 0 ? tAccount("items", { count: wishlistCount }) : null,
      badgeType: "muted" as const,
    },
    {
      href: "/account/settings",
      icon: Gear,
      label: tAccount("settings"),
      badge: null,
      badgeType: "muted" as const,
    },
  ]

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-dialog rounded-t-2xl" data-testid="mobile-account-drawer">
        <DrawerHeader className="border-b border-border-subtle px-inset py-2.5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <User size={16} weight="regular" className="text-muted-foreground" />
              <DrawerTitle className="text-sm font-semibold">{tAccount("title")}</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <IconButton
                aria-label={tAccount("close")}
                variant="ghost"
                size="icon-compact"
                className="text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <X size={16} weight="bold" />
              </IconButton>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">{tAccount("description")}</DrawerDescription>
        </DrawerHeader>

        {!user || authLoading ? (
          <DrawerBody className="px-inset py-3 pb-4">
            <div className="rounded-2xl border border-border-subtle bg-background px-4 py-5">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-2 flex size-(--control-default) items-center justify-center rounded-xl bg-surface-subtle">
                  <User size={22} weight="regular" className="text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">{tAccount("signInPrompt")}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{tAccount("signInDescription")}</p>
              </div>
              <div className="mt-4 flex w-full flex-col gap-2">
                <Button
                  size="default"
                  className="w-full"
                  onClick={() => {
                    handleClose()
                    openAuth({ mode: "login", entrypoint: "account_drawer" })
                  }}
                >
                  {tAccount("signIn")}
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="w-full"
                  onClick={() => {
                    handleClose()
                    openAuth({ mode: "signup", entrypoint: "account_drawer" })
                  }}
                >
                  {tAuth("createAccount")}
                </Button>
              </div>
            </div>
          </DrawerBody>
        ) : isLoadingData ? (
          <div className="flex items-center justify-center py-8">
            <div className="size-6 border-2 border-border-subtle border-t-foreground rounded-full animate-spin" />
          </div>
        ) : (
          <DrawerBody className="px-inset py-3 pb-4">
            {/* Profile summary */}
            <div className="rounded-2xl border border-border-subtle bg-background px-3.5 py-3.5">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={displayName}
                  avatarUrl={avatarUrl ?? null}
                  size="xl"
                  className="border border-border-subtle bg-surface-subtle"
                  fallbackClassName="text-lg"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {rating > 0 && (
                      <span className="inline-flex items-center gap-0.5">
                        <Star size={14} weight="fill" className="text-rating" />
                        {rating.toFixed(1)}
                      </span>
                    )}
                    {totalSales > 0 && (
                      <span>
                        · {totalSales} {tAccount("sales")}
                      </span>
                    )}
                  </div>
                  {user.email && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-3 space-y-2" data-testid="account-drawer-quick-links">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleClose}
                  data-testid="account-drawer-quick-link"
                  className={cn(
                    "flex min-h-(--spacing-touch-md) w-full items-center justify-between gap-3 rounded-xl border border-border-subtle bg-background px-3.5 text-left",
                    "tap-transparent transition-colors",
                    "hover:border-border hover:bg-hover active:bg-active",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <link.icon size={20} weight="regular" className="shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm font-medium text-foreground">{link.label}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {link.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-2xs font-medium",
                          link.badgeType === "destructive" && "text-destructive bg-destructive-subtle",
                          link.badgeType === "warning" && "text-primary bg-primary-subtle",
                          link.badgeType === "muted" && "text-muted-foreground bg-surface-subtle"
                        )}
                      >
                        {link.badge}
                      </span>
                    )}
                    <CaretRight size={16} className="text-muted-foreground" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent listings */}
            {recentListings.length > 0 && (
              <div className="mt-3 rounded-2xl border border-border-subtle bg-background px-3.5 py-3.5">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {tAccount("recentListings")}
                </h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {recentListings.map((listing) => {
                    const imageUrl = listing.images?.[0]
                      ? normalizeImageUrl(listing.images[0])
                      : PLACEHOLDER_IMAGE_PATH
                    // Use the user's profile username for the URL
                    const href = username && listing.slug
                      ? `/${username}/${listing.slug}`
                      : username
                        ? `/${username}/${listing.id}`
                        : `/account/selling`

                    return (
                      <Link
                        key={listing.id}
                        href={href}
                        onClick={handleClose}
                        className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-xl border border-border-subtle bg-surface-subtle">
                          <Image
                            src={imageUrl ?? PLACEHOLDER_IMAGE_PATH}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 640px) 33vw, 100px"
                          />
                        </div>
                        <p className="mt-1 text-center text-xs font-semibold text-foreground">
                          {formatPrice(listing.price)}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </DrawerBody>
        )}

        <DrawerFooter className="border-t border-border-subtle px-inset py-3 pb-safe-max">
          <Link href="/account" onClick={handleClose} className="w-full">
            <Button variant="outline" size="default" className="w-full">
              {t("viewFullProfile")}
            </Button>
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
