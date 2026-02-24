"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ChevronRight as CaretRight,
  Heart,
  LogOut as LogOutIcon,
  MessageCircle as ChatCircle,
  Package,
  Plus,
  Settings as Gear,
  ShieldCheck,
  Star,
  Store as Storefront,
  User,
} from "lucide-react"

import { DrawerBody } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useAuth } from "@/components/providers/auth-state-manager"
import { useMessages } from "@/components/providers/message-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useDrawer } from "@/components/providers/drawer-context"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { createClient } from "@/lib/supabase/client"
import { logger } from "@/lib/logger"
import { UserAvatar } from "@/components/shared/user-avatar"
import { cn } from "@/lib/utils"

import { AccountDrawerSkeleton } from "./account-drawer/account-drawer-skeleton"
import { MENU_GROUP_CLASS, MENU_ROW_CLASS } from "./account-drawer/account-drawer.styles"
import { MenuSection } from "./account-drawer/account-drawer-menu-section"
import type {
  AccountDrawerProps,
  AccountStats,
  MenuItem,
  SellerStats,
  UserProfile,
} from "./account-drawer/account-drawer.types"

// =============================================================================

/**
 * AccountDrawer — Quick access to account actions.
 *
 * Grouped card layout (iOS Settings pattern): tappable profile header, seller stats,
 * Account / Selling / Settings sections, inline sign-out.
 * Opened from mobile bottom nav profile tab or header avatar.
 */
export function AccountDrawer({ open, onOpenChange }: AccountDrawerProps) {
  const { user, isLoading: authLoading } = useAuth()
  const { totalUnreadCount } = useMessages()
  const { totalItems: wishlistCount } = useWishlist()
  const { openDrawer } = useDrawer()
  const t = useTranslations("AccountDrawer")
  const tAuth = useTranslations("Auth")
  const locale = useLocale()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [sellerStats, setSellerStats] = useState<SellerStats | null>(null)
  const [stats, setStats] = useState<AccountStats>({ pendingOrders: 0, activeListings: 0 })
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange])

  // Fetch user data when drawer opens
  useEffect(() => {
    if (!open || !user?.id) {
      setProfile(null)
      setSellerStats(null)
      setStats({ pendingOrders: 0, activeListings: 0 })
      return
    }

    let mounted = true
    const fetchData = async () => {
      setIsLoadingData(true)
      const supabase = createClient()

      try {
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
            .select("id", { count: "exact" })
            .eq("seller_id", user.id)
            .eq("status", "active"),
        ])

        if (!mounted) return

        if (profileResult.data) setProfile(profileResult.data as UserProfile)
        if (sellerStatsResult.data) setSellerStats(sellerStatsResult.data as SellerStats)
        setStats({
          pendingOrders: ordersResult.count ?? 0,
          activeListings: productsResult.count ?? 0,
        })
      } catch (error) {
        logger.error("[account-drawer] fetch_data_failed", error, { userId: user.id })
      } finally {
        if (mounted) setIsLoadingData(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [open, user?.id])

  const displayName = profile?.business_name || profile?.display_name || user?.email?.split("@")[0] || ""
  const avatarUrl = profile?.avatar_url
  const rating = sellerStats?.average_rating ?? 0
  const totalSales = sellerStats?.total_sales ?? 0
  const isSeller = stats.activeListings > 0 || totalSales > 0
  const isEmailVerified = !!user?.email_confirmed_at

  const memberSinceLabel = useMemo(() => {
    if (!user?.created_at) return null
    try {
      const date = new Date(user.created_at)
      const formatted = date.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-GB", {
        month: "short",
        year: "numeric",
      })
      return t("memberSince", { date: formatted })
    } catch {
      return null
    }
  }, [user?.created_at, locale, t])

  // ── Menu sections ──

  const accountItems: MenuItem[] = [
    {
      href: "/account/orders",
      icon: Package,
      label: t("orders"),
      badge: stats.pendingOrders > 0 ? t("pending", { count: stats.pendingOrders }) : null,
      badgeTone: "warning",
    },
    {
      href: "/chat",
      icon: ChatCircle,
      label: t("messagesLink"),
      badge: totalUnreadCount > 0 ? t("unread", { count: totalUnreadCount }) : null,
      badgeTone: "destructive",
    },
    {
      href: "/account/wishlist",
      icon: Heart,
      label: t("wishlist"),
      badge: wishlistCount > 0 ? t("items", { count: wishlistCount }) : null,
      badgeTone: "muted",
    },
  ]

  const sellingItems: MenuItem[] = [
    {
      href: "/account/selling",
      icon: Storefront,
      label: t("myListings"),
      badge: stats.activeListings > 0 ? t("active", { count: stats.activeListings }) : null,
      badgeTone: "muted",
    },
    {
      href: "/sell",
      icon: Plus,
      label: t("createListing"),
    },
  ]

  const settingsItems: MenuItem[] = [
    {
      href: "/account/settings",
      icon: Gear,
      label: t("settings"),
    },
  ]

  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
      headerLayout="centered"
      closeLabel={t("close")}
      description={t("description")}
      contentClassName="max-h-dialog rounded-t-2xl"
      headerClassName="border-border-subtle px-inset pt-4 pb-3"
      titleClassName="text-base font-semibold tracking-tight"
      closeButtonClassName="text-muted-foreground hover:text-foreground hover:bg-hover active:bg-active"
      closeIconSize={18}
      dataTestId="mobile-account-drawer"
    >
      {!user || authLoading ? (
        /* ── Guest state ── */
        <>
          <DrawerBody className="px-inset py-4 pb-safe-max">
            <div className={MENU_GROUP_CLASS}>
              <div className="flex flex-col items-center px-5 py-6 text-center">
                <div className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <User size={24} />
                </div>
                <p className="text-sm font-semibold text-foreground">{t("signInPrompt")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("signInDescription")}</p>
              </div>
            </div>

            {/* Auth actions — inline */}
            <div className="mt-3 space-y-2">
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  handleClose()
                  openDrawer("auth", { mode: "login", entrypoint: "account_drawer" })
                }}
              >
                {t("signIn")}
              </Button>
              <Button
                variant="outline"
                size="default"
                className="w-full"
                onClick={() => {
                  handleClose()
                  openDrawer("auth", { mode: "signup", entrypoint: "account_drawer" })
                }}
              >
                {tAuth("createAccount")}
              </Button>
            </div>
          </DrawerBody>
        </>
      ) : isLoadingData ? (
        /* ── Loading skeleton ── */
        <AccountDrawerSkeleton />
      ) : (
        /* ── Authenticated state ── */
        <>
          <DrawerBody className="space-y-3 px-inset pt-4 pb-safe-max">
            {/* ── Profile header (tap → profile page) ── */}
            <div className={MENU_GROUP_CLASS}>
              <Link
                href="/account"
                onClick={handleClose}
                className={cn(MENU_ROW_CLASS, "gap-3.5 py-3.5")}
              >
                <UserAvatar
                  name={displayName}
                  avatarUrl={avatarUrl ?? null}
                  size="xl"
                  className="shrink-0 ring-2 ring-border-subtle"
                  fallbackClassName="text-lg"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
                    {isEmailVerified && (
                      <Badge variant="success-subtle" size="compact" className="shrink-0">
                        <ShieldCheck size={10} />
                        {t("verified")}
                      </Badge>
                    )}
                  </div>
                  {memberSinceLabel && (
                    <p className="mt-0.5 text-2xs text-muted-foreground">{memberSinceLabel}</p>
                  )}
                  {user.email && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
                  )}
                </div>
                <CaretRight size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>

              {/* ── Seller stats — inline inside profile card ── */}
              {isSeller && (
                <>
                  <Separator />
                  <div className="grid grid-cols-3">
                    <div className="flex flex-col items-center gap-0.5 py-2.5">
                      <span className="text-sm font-semibold text-foreground">{stats.activeListings}</span>
                      <span className="text-2xs text-muted-foreground">{t("statsListings")}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 border-x border-border-subtle py-2.5">
                      <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-foreground">
                        {rating > 0 ? (
                          <>
                            <Star size={12} className="text-rating" />
                            {rating.toFixed(1)}
                          </>
                        ) : (
                          "—"
                        )}
                      </span>
                      <span className="text-2xs text-muted-foreground">{t("statsRating")}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 py-2.5">
                      <span className="text-sm font-semibold text-foreground">{totalSales}</span>
                      <span className="text-2xs text-muted-foreground">{t("statsSales")}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── Account section ── */}
            <MenuSection label={t("sectionAccount")} items={accountItems} onItemClick={handleClose} />

            {/* ── Selling section ── */}
            <MenuSection label={t("sectionSelling")} items={sellingItems} onItemClick={handleClose} />

            {/* ── Settings section ── */}
            <MenuSection label={t("sectionSettings")} items={settingsItems} onItemClick={handleClose} />

            {/* ── Sign out ── */}
            <div className={MENU_GROUP_CLASS}>
              <form
                action="/api/auth/sign-out"
                method="post"
                onSubmit={() => setIsSigningOut(true)}
              >
                <button
                  type="submit"
                  disabled={isSigningOut}
                  className={cn(
                    MENU_ROW_CLASS,
                    "text-destructive",
                    isSigningOut && "pointer-events-none opacity-50",
                  )}
                >
                  <LogOutIcon size={20} className="shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {t("signOut")}
                  </span>
                </button>
              </form>
            </div>
          </DrawerBody>
        </>
      )}
    </DrawerShell>
  )
}
