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
  const t = useTranslations("Drawers")
  const tAccount = useTranslations("AccountDrawer")
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
      <DrawerContent className="max-h-dialog">
        <DrawerHeader className="pb-1.5 pt-0 text-left">
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
                className="text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted"
              >
                <X size={20} weight="light" />
              </IconButton>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">{tAccount("description")}</DrawerDescription>
        </DrawerHeader>

        {!user || authLoading ? (
          <div className="flex flex-col items-center justify-center px-inset py-5">
            <div className="mb-2 flex size-(--control-default) items-center justify-center rounded-xl bg-muted">
              <User size={22} weight="regular" className="text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground font-medium">
              {tAccount("signInPrompt")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 text-center">
              {tAccount("signInDescription")}
            </p>
            <Link href="/auth/login" onClick={handleClose} className="mt-3">
              <Button size="default">{tAccount("signIn")}</Button>
            </Link>
          </div>
        ) : isLoadingData ? (
          <div className="flex items-center justify-center py-8">
            <div className="size-6 border-2 border-border-subtle border-t-foreground rounded-full animate-spin" />
          </div>
        ) : (
          <DrawerBody className="px-0">
            {/* Profile summary */}
            <div className="flex items-center gap-3 px-inset py-4 border-b border-border">
              <UserAvatar
                name={displayName}
                avatarUrl={avatarUrl ?? null}
                size="xl"
                className="border border-border bg-muted"
                fallbackClassName="text-lg"
              />
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold truncate">{displayName}</p>
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
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="border-b border-border">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleClose}
                  className={cn(
                    "flex items-center justify-between px-inset py-3",
                    "hover:bg-hover active:bg-active transition-colors",
                    "touch-manipulation tap-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <link.icon size={20} weight="regular" className="text-muted-foreground" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {link.badge && (
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded",
                          link.badgeType === "destructive" && "text-destructive bg-destructive-subtle",
                          link.badgeType === "warning" && "text-status-warning bg-primary-subtle",
                          link.badgeType === "muted" && "text-muted-foreground bg-muted"
                        )}
                      >
                        {link.badge}
                      </span>
                    )}
                    <CaretRight size={16} className="text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent listings */}
            {recentListings.length > 0 && (
              <div className="px-inset py-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  {tAccount("recentListings")}
                </h3>
                <div className="grid grid-cols-3 gap-2">
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
                        className="group"
                      >
                        <div className="relative aspect-square bg-muted rounded-xl overflow-hidden border border-border">
                          <Image
                            src={imageUrl ?? PLACEHOLDER_IMAGE_PATH}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 640px) 33vw, 100px"
                          />
                        </div>
                        <p className="text-xs font-semibold mt-1 text-center">
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

        <DrawerFooter className="border-t border-border">
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
