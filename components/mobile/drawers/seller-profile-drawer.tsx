"use client"

// =============================================================================
// SELLER PROFILE DRAWER
// =============================================================================
// Mobile drawer showing seller profile info without leaving the current page.
// Opens when user taps "View Profile" on seller preview card.
// Contains: header, stats, bio, listings, and action buttons.
// =============================================================================

import * as React from "react"
import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import {
  Star,
  CheckCircle2,
  Calendar,
  Package,
  Users,
  MessageCircle,
  ChevronRight,
  Sparkles,
  X,
  ExternalLink,
} from "lucide-react"
import { Link, useRouter } from "@/i18n/routing"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface SellerProfileData {
  id: string
  name: string
  username: string | null
  avatarUrl: string | null
  verified: boolean
  rating: number | null
  reviewCount: number | null
  positivePercent?: number | null
  totalSales: number | null
  responseTimeHours: number | null
  followers?: number | null
  listingsCount?: number | null
  joinedAt: string | null
  joinedYear?: string | null
  bio?: string | null
}

export interface SellerProduct {
  id: string
  title: string
  price: number
  originalPrice?: number | null
  image?: string | null
  slug?: string | null
  storeSlug?: string | null
}

interface SellerProfileDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  seller: SellerProfileData | null
  /** Products from this seller to show in drawer */
  products?: SellerProduct[]
  /** Callback for chat action */
  onChat?: () => void
  /** Callback for follow action */
  onFollow?: () => void
  /** Whether user is following this seller */
  isFollowing?: boolean
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

/** Check if seller is "new" (no sales or feedback) */
function isNewSeller(seller: SellerProfileData): boolean {
  return (seller.totalSales ?? 0) === 0 || (seller.positivePercent ?? 0) === 0
}

/** Seller Profile Header */
function SellerHeader({ seller }: { seller: SellerProfileData }) {
  const t = useTranslations("Product")
  const tVerif = useTranslations("SellerVerification")

  const showNewSellerBadge = isNewSeller(seller)

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="relative shrink-0">
        <UserAvatar
          name={seller.name}
          avatarUrl={seller.avatarUrl}
          size="xl"
          className="size-16"
        />
        {seller.verified && (
          <span className="absolute -bottom-1 -right-1 size-5 bg-primary rounded-full ring-2 ring-background flex items-center justify-center">
            <CheckCircle2 className="size-3 text-primary-foreground" fill="currentColor" />
          </span>
        )}
      </div>

      {/* Name & Meta */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h2 className="text-base font-bold text-foreground truncate">{seller.name}</h2>
          {seller.verified && (
            <Badge variant="verified" className="shrink-0 text-2xs px-1.5 py-0">
              {t("verified")}
            </Badge>
          )}
          {showNewSellerBadge && (
            <Badge variant="secondary" className="shrink-0 text-2xs px-1.5 py-0 gap-1">
              <Sparkles className="size-2.5" />
              {tVerif("newSeller")}
            </Badge>
          )}
        </div>
        {seller.username && (
          <p className="text-sm text-muted-foreground">@{seller.username}</p>
        )}
        {/* Rating */}
        {seller.rating != null && seller.rating > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="size-3.5 fill-warning text-warning" />
            <span className="text-sm font-semibold text-foreground">
              {seller.rating.toFixed(1)}
            </span>
            {seller.reviewCount != null && seller.reviewCount > 0 && (
              <span className="text-xs text-muted-foreground">
                ({seller.reviewCount})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/** Stats Row */
function SellerStats({ seller }: { seller: SellerProfileData }) {
  const t = useTranslations("Seller")
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const joinedText = mounted && seller.joinedAt
    ? formatDistanceToNow(new Date(seller.joinedAt), {
        addSuffix: false,
        locale: locale === "bg" ? bg : enUS,
      })
    : seller.joinedYear ?? null

  const isNew = isNewSeller(seller)

  return (
    <div className="rounded-xl bg-muted px-3 py-2.5 space-y-1.5">
      {/* Stats Grid */}
      <div className="flex items-center gap-4 text-sm">
        {seller.listingsCount != null && seller.listingsCount > 0 && (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.listingsCount}</p>
            <p className="text-xs text-muted-foreground">{t("listings")}</p>
          </div>
        )}
        {seller.totalSales != null && seller.totalSales > 0 && (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.totalSales}</p>
            <p className="text-xs text-muted-foreground">{t("itemsSold")}</p>
          </div>
        )}
        {!isNew && seller.positivePercent != null && (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.positivePercent}%</p>
            <p className="text-xs text-muted-foreground">{t("positive")}</p>
          </div>
        )}
        {seller.responseTimeHours != null && seller.responseTimeHours > 0 && (
          <div className="text-center">
            <p className="font-semibold text-foreground">
              {seller.responseTimeHours <= 1 ? "<1h" : `${Math.round(seller.responseTimeHours)}h`}
            </p>
            <p className="text-xs text-muted-foreground">{t("response")}</p>
          </div>
        )}
      </div>

      {/* Joined Date */}
      {joinedText && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50">
          <Calendar className="size-3" strokeWidth={1.5} />
          <span>{t("memberSince", { date: joinedText })}</span>
        </div>
      )}
    </div>
  )
}

/** Seller Bio */
function SellerBio({ bio }: { bio: string | null | undefined }) {
  const t = useTranslations("Seller")

  if (!bio) return null

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {t("aboutThisSeller")}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
    </div>
  )
}

/** Seller Listings Grid */
function SellerListings({
  products,
  sellerUsername,
  onClose,
}: {
  products: SellerProduct[]
  sellerUsername: string | null
  onClose: () => void
}) {
  const t = useTranslations("Product")
  const router = useRouter()

  if (!products || products.length === 0) return null

  const getProductHref = (product: SellerProduct) => {
    const resolvedSellerSlug = product.storeSlug || sellerUsername
    const resolvedProductSlug = product.slug || product.id
    return resolvedSellerSlug ? `/${resolvedSellerSlug}/${resolvedProductSlug}` : "#"
  }

  const handleProductClick = (href: string) => {
    onClose()
    router.push(href)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {t("moreFromSeller")}
      </h3>

      {/* Horizontal scroll of products */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
        {products.slice(0, 8).map((product) => (
          <button
            key={product.id}
            onClick={() => handleProductClick(getProductHref(product))}
            className="shrink-0 w-28 rounded-lg border border-border/50 bg-card overflow-hidden active:scale-[0.98] transition-transform text-left"
          >
            {/* Image */}
            <div className="aspect-square relative bg-muted">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="size-6 text-muted-foreground" />
                </div>
              )}
            </div>
            {/* Info */}
            <div className="p-2">
              <p className="text-xs font-bold text-foreground">
                €{product.price.toLocaleString()}
              </p>
              <p className="text-2xs text-muted-foreground line-clamp-1 mt-0.5">
                {product.title}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function SellerProfileDrawer({
  open,
  onOpenChange,
  seller,
  products = [],
  onChat,
  onFollow,
  isFollowing = false,
}: SellerProfileDrawerProps) {
  const t = useTranslations("Product")
  const router = useRouter()

  const handleClose = () => onOpenChange(false)

  const handleChat = () => {
    onChat?.()
    handleClose()
  }

  const handleFollow = () => {
    onFollow?.()
    // Don't close - user may want to continue browsing
  }

  const handleViewFullProfile = () => {
    if (seller?.username) {
      handleClose()
      router.push(`/${seller.username}`)
    }
  }

  if (!seller) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        aria-label={seller.name}
        showHandle
        overlayBlur="sm"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-border/30">
          <DrawerTitle className="text-sm font-semibold text-foreground">
            {t("sellerInfo")}
          </DrawerTitle>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 -mr-2 rounded-full hover:bg-muted touch-manipulation"
            >
              <X className="size-4" />
              <span className="sr-only">{t("close")}</span>
            </Button>
          </DrawerClose>
        </div>
        <DrawerDescription className="sr-only">
          {t("seller.viewProfile")} - {seller.name}
        </DrawerDescription>

        {/* Scrollable body */}
        <DrawerBody className="space-y-4 py-4">
          {/* Profile Header */}
          <SellerHeader seller={seller} />

          {/* Stats */}
          <SellerStats seller={seller} />

          {/* Bio */}
          <SellerBio bio={seller.bio} />

          {/* Listings */}
          <SellerListings
            products={products}
            sellerUsername={seller.username}
            onClose={handleClose}
          />
        </DrawerBody>

        {/* Footer with actions */}
        <DrawerFooter className="border-t border-border/30">
          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant={isFollowing ? "secondary" : "outline"}
              className="flex-1 h-11 gap-1.5"
              onClick={handleFollow}
            >
              <Users className="size-4" />
              {isFollowing ? t("seller.following") : t("seller.follow")}
            </Button>
            <Button
              variant="default"
              className="flex-1 h-11 gap-1.5"
              onClick={handleChat}
            >
              <MessageCircle className="size-4" />
              {t("chat")}
            </Button>
          </div>

          {/* View full profile link */}
          {seller.username && (
            <Button
              variant="ghost"
              className="w-full h-9 text-sm text-primary"
              onClick={handleViewFullProfile}
            >
              {t("viewFullProfile")}
              <ExternalLink className="size-3.5 ml-1" />
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
