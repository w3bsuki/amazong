"use client"

import { ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link, useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { safeAvatarSrc } from "@/lib/utils"

interface MobileProductHeaderProps {
  /** Product title for display in header */
  title?: string | null | undefined
  /** Seller display name */
  sellerName?: string | null | undefined
  /** Seller username for profile link */
  sellerUsername?: string | null | undefined
  /** Seller avatar URL */
  sellerAvatarUrl?: string | null | undefined
  /** Listing date for context (ISO string) */
  createdAt?: string | null | undefined
}

/**
 * MobileProductHeader - Contextual header for product pages
 * 
 * Reference: Modern marketplace apps (Vinted, OLX, Depop)
 * - Left: Back button
 * - Center: Seller avatar + Product title (truncated)  
 * - Right: Share button
 * 
 * Shows key context (seller + title) in compact header for easy access
 */
export function MobileProductHeader({
  title,
  sellerName,
  sellerUsername,
  sellerAvatarUrl,
}: MobileProductHeaderProps) {
  const t = useTranslations("Product")
  const router = useRouter()

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        })
      } catch {
        // User cancelled or error
      }
    }
  }

  const sellerInitials = (sellerName || sellerUsername || "?").slice(0, 2).toUpperCase()
  const profileHref = sellerUsername ? `/${sellerUsername}` : "#"

  return (
    <header className="sticky top-0 z-40 w-full min-h-12 bg-background/90 backdrop-blur-md border-b border-border/50 lg:hidden pt-safe-top">
      <div className="h-12 flex items-center gap-2 px-2">
        {/* Back Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full shrink-0"
          aria-label={t("back")}
          title={t("back")}
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Button>

        {/* Center: Seller Avatar + Product Title */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <Link href={profileHref} className="shrink-0">
            <Avatar className="size-7 border border-border">
              <AvatarImage src={safeAvatarSrc(sellerAvatarUrl)} alt={sellerName || t("seller")} />
              <AvatarFallback className="text-2xs font-medium bg-muted">
                {sellerInitials}
              </AvatarFallback>
            </Avatar>
          </Link>
          {title && (
            <span className="text-sm font-medium text-foreground truncate">
              {title}
            </span>
          )}
        </div>

        {/* Share Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full shrink-0"
          aria-label={t("share")}
          title={t("share")}
          onClick={handleShare}
        >
          <Share2 className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </header>
  )
}
