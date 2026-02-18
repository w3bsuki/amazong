"use client"

import { useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
import { bg, enUS } from "date-fns/locale"
import { ShoppingBag as IconShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import type { AccountOrdersGridProps } from "./account-orders-grid.types"
export type { AccountOrdersGridServerActions } from "./account-orders-grid.types"
import {
  formatOrderCurrency,
  getOrderGridText,
} from "./account-orders-grid.utils"
import { AccountOrdersGridMobile } from "./account-orders-grid-mobile"
import { AccountOrdersGridDesktop } from "./account-orders-grid-desktop"

export function AccountOrdersGrid({ orders, locale, actions }: AccountOrdersGridProps) {
  const dateLocale = locale === "bg" ? bg : enUS
  const [conversationMap, setConversationMap] = useState<Map<string, string>>(new Map())
  const [openMobileOrderId, setOpenMobileOrderId] = useState<string | null>(null)
  const formatCurrency = (value: number) => formatOrderCurrency(value, locale)
  const t = getOrderGridText(locale)

  useEffect(() => {
    async function fetchConversations() {
      const map = new Map<string, string>()
      for (const order of orders) {
        try {
          const result = await actions.getOrderConversation(order.id, "")
          if (result.conversationId) {
            map.set(order.id, result.conversationId)
          }
        } catch {
          // Ignore errors
        }
      }
      setConversationMap(map)
    }

    if (orders.length > 0) {
      fetchConversations()
    }
  }, [actions, orders])

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
            <IconShoppingBag className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">{t.noOrders}</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            {t.noOrdersDesc}
          </p>
          <Button asChild className="mt-6">
            <Link href="/">{t.startShopping}</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <AccountOrdersGridMobile
        orders={orders}
        locale={locale}
        dateLocale={dateLocale}
        actions={actions}
        conversationMap={conversationMap}
        openMobileOrderId={openMobileOrderId}
        setOpenMobileOrderId={setOpenMobileOrderId}
        formatCurrency={formatCurrency}
        t={t}
      />
      <AccountOrdersGridDesktop
        orders={orders}
        locale={locale}
        dateLocale={dateLocale}
        actions={actions}
        conversationMap={conversationMap}
        formatCurrency={formatCurrency}
        t={t}
      />
    </>
  )
}
