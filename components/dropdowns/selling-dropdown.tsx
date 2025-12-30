"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { Storefront, Plus, Truck, TrendUp, CaretRight, Receipt } from "@phosphor-icons/react"

interface SellingDropdownProps {
  user: User | null
}

export function SellingDropdown({ user }: SellingDropdownProps) {
  const t = useTranslations("SellingDropdown")
  const tNav = useTranslations("Navigation")

  // Don't show selling icon for non-authenticated users
  if (!user) {
    return null
  }

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link href="/sell" aria-label={tNav("sell")}>
          <Button
            variant="ghost"
            size="icon-lg"
            className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover relative [&_svg]:size-6"
          >
            <Storefront weight="regular" />
          </Button>
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

            <Link href="/account/sales" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Receipt size={20} weight="duotone" className="text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("sales")}</p>
                <p className="text-xs text-muted-foreground">{t("salesDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>

            <Link href="/sell" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <TrendUp size={20} weight="duotone" className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("dashboard")}</p>
                <p className="text-xs text-muted-foreground">{t("dashboardDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>
          </div>
        </div>

        <div className="p-3 bg-muted border-t border-border">
          <Link href="/sell">
            <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
              {t("viewAllListings")}
            </Button>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
