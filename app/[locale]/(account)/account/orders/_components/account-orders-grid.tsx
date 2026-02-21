"use client"

import { useEffect, useState } from "react"
import { bg, enUS } from "date-fns/locale"
import type { AccountOrdersGridProps } from "./account-orders-grid.types"
export type { AccountOrdersGridServerActions } from "./account-orders-grid.types"
import {
  formatOrderCurrency,
} from "./account-orders-grid.utils"
import { AccountOrdersGridMobile } from "./account-orders-grid-mobile"
import { AccountOrdersGridDesktop } from "./account-orders-grid-desktop"
import { AccountOrdersEmptyState } from "./account-orders-empty-state"

export function AccountOrdersGrid({ orders, locale, actions }: AccountOrdersGridProps) {
  const dateLocale = locale === "bg" ? bg : enUS
  const [conversationMap, setConversationMap] = useState<Map<string, string>>(new Map())
  const [openMobileOrderId, setOpenMobileOrderId] = useState<string | null>(null)
  const formatCurrency = (value: number) => formatOrderCurrency(value, locale)

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
    return <AccountOrdersEmptyState />
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
      />
      <AccountOrdersGridDesktop
        orders={orders}
        locale={locale}
        dateLocale={dateLocale}
        actions={actions}
        conversationMap={conversationMap}
        formatCurrency={formatCurrency}
      />
    </>
  )
}
