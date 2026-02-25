"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Heart,
  MessageCircle as ChatCircle,
  Package,
  Plus,
  Settings as Gear,
  Store as Storefront,
} from "lucide-react"

import { useTranslations, useLocale } from "next-intl"
import { useAuth } from "@/components/providers/auth-state-manager"
import { useMessages } from "@/components/providers/message-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useDrawer } from "@/components/providers/drawer-context"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { createClient } from "@/lib/supabase/client"

import { AccountDrawerAuthenticatedContent } from "./account-drawer/account-drawer-authenticated-content"
import { AccountDrawerGuestContent } from "./account-drawer/account-drawer-guest-content"
import { AccountDrawerSkeleton } from "./account-drawer/account-drawer-skeleton"
import type {
  AccountDrawerProps,
  AccountStats,
  MenuItem,
  SellerStats,
  UserProfile,
} from "./account-drawer/account-drawer.types"

import { logger } from "@/lib/logger"
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
        <AccountDrawerGuestContent
          signInPrompt={t("signInPrompt")}
          signInDescription={t("signInDescription")}
          signInLabel={t("signIn")}
          createAccountLabel={tAuth("createAccount")}
          onSignIn={() => {
            handleClose()
            openDrawer("auth", { mode: "login", entrypoint: "account_drawer" })
          }}
          onSignUp={() => {
            handleClose()
            openDrawer("auth", { mode: "signup", entrypoint: "account_drawer" })
          }}
        />
      ) : isLoadingData ? (
        <AccountDrawerSkeleton />
      ) : (
        <AccountDrawerAuthenticatedContent
          onClose={handleClose}
          displayName={displayName}
          avatarUrl={avatarUrl}
          isEmailVerified={isEmailVerified}
          memberSinceLabel={memberSinceLabel}
          email={user.email}
          isSeller={isSeller}
          activeListings={stats.activeListings}
          rating={rating}
          totalSales={totalSales}
          verifiedLabel={t("verified")}
          statsListingsLabel={t("statsListings")}
          statsRatingLabel={t("statsRating")}
          statsSalesLabel={t("statsSales")}
          accountSectionLabel={t("sectionAccount")}
          sellingSectionLabel={t("sectionSelling")}
          settingsSectionLabel={t("sectionSettings")}
          accountItems={accountItems}
          sellingItems={sellingItems}
          settingsItems={settingsItems}
          signOutLabel={t("signOut")}
          isSigningOut={isSigningOut}
          onSignOutSubmit={() => setIsSigningOut(true)}
        />
      )}
    </DrawerShell>
  )
}
