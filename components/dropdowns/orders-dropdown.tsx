"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { Package, ArrowCounterClockwise, Truck, CaretRight } from "@phosphor-icons/react"

interface OrdersDropdownProps {
  user: User | null
}

export function OrdersDropdown({ user }: OrdersDropdownProps) {
  const t = useTranslations("ReturnsDropdown")
  const tNav = useTranslations("Navigation")

  // Don't show orders icon for non-authenticated users
  if (!user) {
    return null
  }

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link href="/account/orders" aria-label={tNav("ordersLabel")}>
          <Button
            variant="ghost"
            size="icon-xl"
            className="border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-brand hover:bg-header-hover relative [&_svg]:size-6"
          >
            <Package weight="regular" />
          </Button>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="end"
        sideOffset={8}
      >
        <div className="p-4 bg-muted border-b border-border">
          <h3 className="font-bold text-base text-foreground">{t("title")}</h3>
        </div>

        <div className="p-3">
          <div className="space-y-1">
            <Link href="/account/orders" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
              <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                <Package size={20} weight="duotone" className="text-brand" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("trackOrders")}</p>
                <p className="text-xs text-muted-foreground">{t("trackOrdersDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>

            <Link href="/returns" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
              <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
                <ArrowCounterClockwise size={20} weight="duotone" className="text-brand" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("startReturn")}</p>
                <p className="text-xs text-muted-foreground">{t("startReturnDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>

            <Link href="/customer-service" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Truck size={20} weight="duotone" className="text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t("deliveryHelp")}</p>
                <p className="text-xs text-muted-foreground">{t("deliveryHelpDesc")}</p>
              </div>
              <CaretRight size={16} weight="regular" className="text-muted-foreground" />
            </Link>
          </div>
        </div>

        <div className="p-3 bg-muted border-t border-border">
          <Link href="/account/orders">
            <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
              {t("viewAllOrders")}
            </Button>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
