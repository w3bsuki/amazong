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
import type { LucideIcon } from "lucide-react"

import { DrawerBody } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useAuth } from "@/components/providers/auth-state-manager"
import { useMessages } from "@/components/providers/message-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { useDrawer } from "@/components/providers/drawer-context"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { createClient } from "@/lib/supabase/client"
import { UserAvatar } from "@/components/shared/user-avatar"
import { cn } from "@/lib/utils"

// =============================================================================
// Types
// =============================================================================

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

interface AccountStats {
  pendingOrders: number
  activeListings: number
}

type MenuBadgeTone = "destructive" | "warning" | "muted"

interface MenuItem {
  href: string
  icon: LucideIcon
  label: string
  badge?: string | null
  badgeTone?: MenuBadgeTone
}

// =============================================================================
// Subcomponents
// =============================================================================

/** Icon circle — clean monochromatic brand style (accent bg + primary icon) */
function MenuIconCircle({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
      aria-hidden="true"
    >
      <Icon size={20} />
    </span>
  )
}

/** Single menu row — horizontal card with icon circle, label, badge, chevron */
function MenuRow({
  item,
  onClick,
}: {
  item: MenuItem
  onClick?: () => void
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      data-testid="account-drawer-quick-link"
      className={cn(
        "flex min-h-(--spacing-touch-md) w-full items-center gap-3 rounded-xl border border-border-subtle bg-background px-3 text-left",
        "tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)",
        "hover:border-border hover:bg-hover active:bg-active",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
      )}
    >
      <MenuIconCircle icon={item.icon} />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
        {item.label}
      </span>
      <div className="flex shrink-0 items-center gap-2">
        {item.badge ? (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-2xs font-medium",
              item.badgeTone === "destructive" && "bg-destructive-subtle text-destructive",
              item.badgeTone === "warning" && "bg-primary-subtle text-primary",
              item.badgeTone === "muted" && "bg-surface-subtle text-muted-foreground",
            )}
          >
            {item.badge}
          </span>
        ) : null}
        <CaretRight size={16} className="text-muted-foreground" aria-hidden="true" />
      </div>
    </Link>
  )
}

/** Section header for menu groups */
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-1 pb-1.5 pt-3 text-2xs font-semibold uppercase tracking-wider text-muted-foreground first:pt-0">
      {children}
    </h3>
  )
}

/** Skeleton for loading state — matches actual layout shape */
function AccountDrawerSkeleton() {
  return (
    <DrawerBody className="px-inset py-3 pb-4">
      {/* Profile skeleton */}
      <div className="rounded-2xl border border-border-subtle bg-background p-3.5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-14 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
      {/* Stats skeleton */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl border border-border-subtle bg-background p-3">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
      {/* Menu skeletons */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="mt-2 flex items-center gap-3 rounded-xl border border-border-subtle bg-background p-3">
          <Skeleton className="size-10 shrink-0 rounded-xl" />
          <Skeleton className="h-3.5 w-24 flex-1" />
        </div>
      ))}
    </DrawerBody>
  )
}

// =============================================================================
// Component
// =============================================================================

/**
 * AccountDrawer — Quick access to account actions.
 *
 * Sections: Profile header, seller stats (if applicable), Account links,
 * Selling links, Settings, Sign out.
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
        console.error("Failed to fetch account drawer data:", error)
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
        <DrawerBody className="px-inset py-3 pb-4">
          <div className="rounded-2xl border border-border-subtle bg-background px-4 py-5">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-2 flex size-(--control-default) items-center justify-center rounded-xl bg-accent text-primary">
                <User size={22} />
              </div>
              <p className="text-sm font-semibold text-foreground">{t("signInPrompt")}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t("signInDescription")}</p>
            </div>
            <div className="mt-4 flex w-full flex-col gap-2">
              <Button
                size="primary"
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
          </div>
        </DrawerBody>
      ) : isLoadingData ? (
        /* ── Loading skeleton ── */
        <AccountDrawerSkeleton />
      ) : (
        /* ── Authenticated state ── */
        <DrawerBody className="px-inset py-3 pb-4">
          {/* ── Profile header ── */}
          <div className="rounded-2xl border border-border-subtle bg-background p-3.5">
            <div className="flex items-center gap-3">
              <UserAvatar
                name={displayName}
                avatarUrl={avatarUrl ?? null}
                size="xl"
                className="border border-border-subtle bg-surface-subtle"
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
            </div>
          </div>

          {/* ── Seller stats row ── */}
          {isSeller && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-0.5 rounded-xl border border-border-subtle bg-background py-2.5">
                <span className="text-base font-semibold text-foreground">{stats.activeListings}</span>
                <span className="text-2xs text-muted-foreground">{t("statsListings")}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 rounded-xl border border-border-subtle bg-background py-2.5">
                <span className="inline-flex items-center gap-0.5 text-base font-semibold text-foreground">
                  {rating > 0 ? (
                    <>
                      <Star size={14} className="text-rating" />
                      {rating.toFixed(1)}
                    </>
                  ) : (
                    "—"
                  )}
                </span>
                <span className="text-2xs text-muted-foreground">{t("statsRating")}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 rounded-xl border border-border-subtle bg-background py-2.5">
                <span className="text-base font-semibold text-foreground">{totalSales}</span>
                <span className="text-2xs text-muted-foreground">{t("statsSales")}</span>
              </div>
            </div>
          )}

          {/* ── Account section ── */}
          <SectionHeader>{t("sectionAccount")}</SectionHeader>
          <div className="space-y-1.5">
            {accountItems.map((item) => (
              <MenuRow key={item.href} item={item} onClick={handleClose} />
            ))}
          </div>

          {/* ── Selling section ── */}
          <SectionHeader>{t("sectionSelling")}</SectionHeader>
          <div className="space-y-1.5">
            {sellingItems.map((item) => (
              <MenuRow key={item.href} item={item} onClick={handleClose} />
            ))}
          </div>

          {/* ── Settings section ── */}
          <SectionHeader>{t("sectionSettings")}</SectionHeader>
          <div className="space-y-1.5">
            {settingsItems.map((item) => (
              <MenuRow key={item.href} item={item} onClick={handleClose} />
            ))}
          </div>

          {/* ── View profile + Sign out ── */}
          <div className="mt-4 space-y-2 border-t border-border-subtle pt-4">
            <Button variant="outline" size="default" className="w-full" asChild>
              <Link href="/account" onClick={handleClose}>
                {t("viewProfile")}
              </Link>
            </Button>
            <form
              action="/api/auth/sign-out"
              method="post"
              onSubmit={() => setIsSigningOut(true)}
            >
              <Button
                type="submit"
                variant="ghost"
                size="default"
                className="w-full text-muted-foreground hover:text-destructive"
                disabled={isSigningOut}
              >
                <LogOutIcon size={16} />
                {t("signOut")}
              </Button>
            </form>
          </div>
        </DrawerBody>
      )}
    </DrawerShell>
  )
}
