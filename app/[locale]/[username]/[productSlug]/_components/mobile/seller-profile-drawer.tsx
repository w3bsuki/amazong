"use client"

import { MessageCircle, Users } from "lucide-react"
import { useTranslations } from "next-intl"

import { useRouter } from "@/i18n/routing"
import { DrawerBody, DrawerFooter } from "@/components/ui/drawer"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { Button } from "@/components/ui/button"
import { SellerBio, SellerHeader, SellerStats } from "./seller-profile-drawer-details"
import { SellerListings } from "./seller-profile-drawer-listings"
import type { SellerProfileData, SellerProduct } from "./seller-profile-drawer.types"

interface SellerProfileDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  seller: SellerProfileData | null
  products?: SellerProduct[]
  onChat?: () => void
  onFollow?: () => void
  isFollowing?: boolean
}

export type { SellerProfileData, SellerProduct } from "./seller-profile-drawer.types"

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
  const showFollowAction = typeof onFollow === "function"
  const showChatAction = typeof onChat === "function"
  const showFooterActions = showFollowAction || showChatAction

  const handleClose = () => onOpenChange(false)

  const handleChat = () => {
    if (!showChatAction) return
    onChat?.()
    handleClose()
  }

  const handleFollow = () => {
    if (!showFollowAction) return
    onFollow?.()
  }

  const handleViewFullProfile = () => {
    if (!seller?.username) return
    handleClose()
    router.push(`/${seller.username}`)
  }

  if (!seller) return null

  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title={t("sellerInfo")}
      closeLabel={t("close")}
      contentAriaLabel={seller.name}
      description={`${t("seller.viewProfile")} - ${seller.name}`}
      descriptionClassName="sr-only"
      headerClassName="border-border-subtle px-inset pb-2 pt-3"
      closeButtonSize="icon-default"
      closeButtonClassName="shrink-0 -mr-2 rounded-full text-foreground hover:bg-muted active:bg-active touch-manipulation"
      drawerContentProps={{ showHandle: true, overlayBlur: "none" }}
    >
      <DrawerBody className="space-y-4 py-4">
        <SellerHeader seller={seller} />
        <SellerStats seller={seller} />
        <SellerBio bio={seller.bio} />
        <SellerListings
          products={products}
          sellerUsername={seller.username}
          onClose={handleClose}
        />

        {seller.username ? (
          <Button
            variant="ghost"
            size="default"
            className="w-full justify-center text-sm text-primary"
            onClick={handleViewFullProfile}
          >
            {t("viewFullProfile")}
          </Button>
        ) : null}
      </DrawerBody>

      {showFooterActions ? (
        <DrawerFooter className="border-t border-border-subtle py-2.5">
          <div className="flex gap-2">
            {showFollowAction ? (
              <Button
                variant={isFollowing ? "secondary" : "outline"}
                size="default"
                className="flex-1 gap-1.5"
                onClick={handleFollow}
              >
                <Users className="size-4" />
                {isFollowing ? t("seller.following") : t("seller.follow")}
              </Button>
            ) : null}
            {showChatAction ? (
              <Button
                variant="default"
                size="default"
                className="flex-1 gap-1.5"
                onClick={handleChat}
              >
                <MessageCircle className="size-4" />
                {t("chat")}
              </Button>
            ) : null}
          </div>
        </DrawerFooter>
      ) : null}
    </DrawerShell>
  )
}
