"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { Storefront, Plus, Package, Truck, TrendUp, CaretRight } from "@phosphor-icons/react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface SellingDropdownProps {
  user: User | null
}

export function SellingDropdown({ user }: SellingDropdownProps) {
  const t = useTranslations("SellingDropdown")
  const tNav = useTranslations("Navigation")

  return (
    <HoverCard openDelay={50} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href="/sell">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xl"
                className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-brand hover:bg-header-hover relative [&_svg]:size-6"
              >
                <Storefront weight="regular" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              <p>{tNav("sell")}</p>
            </TooltipContent>
          </Tooltip>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="end"
        sideOffset={8}
      >
        <div className="p-4 bg-muted border-b border-border">
          <h3 className="font-semibold text-base text-foreground">{t("title")}</h3>
        </div>

        <div className="p-3">
          <div className="space-y-1">
            <Link href="/sell" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
              <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                <Plus size={20} weight="duotone" className="text-brand" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("createListing")}</p>
                <p className="text-xs text-muted-foreground">{t("createListingDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>

            <Link href="/sell/listings" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
              <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
                <Package size={20} weight="duotone" className="text-brand" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("myListings")}</p>
                <p className="text-xs text-muted-foreground">{t("myListingsDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>

            <Link href="/sell/orders" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Truck size={20} weight="duotone" className="text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("sellerOrders")}</p>
                <p className="text-xs text-muted-foreground">{t("sellerOrdersDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>

            <Link href="/sell/dashboard" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <TrendUp size={20} weight="duotone" className="text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("dashboard")}</p>
                <p className="text-xs text-muted-foreground">{t("dashboardDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>
          </div>
        </div>

        {user && (
          <div className="p-3 bg-muted border-t border-border">
            <Link href="/sell/listings">
              <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                {t("viewAllListings")}
              </Button>
            </Link>
          </div>
        )}

        {!user && (
          <div className="p-4 bg-muted border-t border-border">
            <Link href="/auth/login">
              <Button className="w-full h-10 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                {t("signInToSell")}
              </Button>
            </Link>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
