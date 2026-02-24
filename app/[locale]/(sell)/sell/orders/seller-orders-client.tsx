"use client"

import { useCallback, useEffect, useState } from "react"
import { bg, enUS } from "date-fns/locale"
import { useTranslations } from "next-intl"
import { getSellerOrdersCopy } from "./_components/seller-orders.copy"
import { SellerOrdersHeader } from "./_components/seller-orders-header"
import { SellerOrdersList } from "./_components/seller-orders-list"
import { SellerOrdersStatsCards } from "./_components/seller-orders-stats-cards"
import {
  SELLER_ORDERS_PAGE_SIZE,
  type SellerOrderItem,
  type SellerOrdersClientProps,
  type SellerOrdersStats,
  type StatusFilter,
} from "./_components/seller-orders.types"

const initialStats: SellerOrdersStats = {
  pending: 0,
  received: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
  total: 0,
}

export function SellerOrdersClient({ locale, sellerUsername, actions }: SellerOrdersClientProps) {
  const tCommon = useTranslations("Common")
  const tOrders = useTranslations("Orders")
  const copy = getSellerOrdersCopy(locale)
  const dateLocale = locale === "bg" ? bg : enUS

  const [orders, setOrders] = useState<SellerOrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<StatusFilter>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState<SellerOrdersStats>(initialStats)
  const [conversationMap, setConversationMap] = useState<Map<string, string>>(new Map())

  const formatCurrency = useCallback(
    (value: number) =>
      new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
        style: "currency",
        currency: locale === "bg" ? "BGN" : "EUR",
        maximumFractionDigits: 2,
      }).format(value),
    [locale],
  )

  const statusLabels = {
    pending: tOrders("status.pending.label"),
    processing: tOrders("status.processing.label"),
    shipped: tOrders("status.shipped.label"),
    delivered: tOrders("status.delivered.label"),
    active: copy.tabs.active,
    all: tCommon("all"),
  }

  const loadData = useCallback(async () => {
    setIsLoading(true)

    try {
      const [ordersResult, statsResult] = await Promise.all([
        actions.getSellerOrders(activeTab, currentPage, SELLER_ORDERS_PAGE_SIZE),
        actions.getSellerOrderStats(),
      ])

      if (ordersResult.orders) {
        setOrders(ordersResult.orders)
        setCurrentPage(ordersResult.currentPage)
        setTotalPages(ordersResult.totalPages)

        const convPromises = ordersResult.orders.map(async (item) => {
          const result = await actions.getOrderConversation(item.order_id, item.seller_id)
          return { key: `${item.order_id}-${item.seller_id}`, conversationId: result.conversationId }
        })

        const conversations = await Promise.all(convPromises)
        const map = new Map<string, string>()
        conversations.forEach(({ key, conversationId }) => {
          if (conversationId) map.set(key, conversationId)
        })
        setConversationMap(map)
      }

      setStats(statsResult)
    } catch {
      // Keep UI functional even if refresh fails; existing state remains visible.
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [actions, activeTab, currentPage])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRefresh = () => {
    setIsRefreshing(true)
    loadData()
  }

  const handleTabChange = (value: string) => {
    const nextTab = value as StatusFilter
    setActiveTab(nextTab)
    setCurrentPage(1)
  }

  const activeTabLabel =
    activeTab === "pending"
      ? statusLabels.pending
      : activeTab === "shipped"
        ? statusLabels.shipped
        : activeTab === "delivered"
          ? statusLabels.delivered
          : activeTab === "active"
            ? statusLabels.active
            : statusLabels.all

  return (
    <div className="flex flex-1 flex-col">
      <SellerOrdersHeader
        copy={copy}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        backLabel={tCommon("back")}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <SellerOrdersStatsCards
          stats={stats}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          labels={{
            pending: statusLabels.pending,
            processing: statusLabels.processing,
            shipped: statusLabels.shipped,
            delivered: statusLabels.delivered,
          }}
        />

        <SellerOrdersList
          activeTab={activeTab}
          activeTabLabel={activeTabLabel}
          handleTabChange={handleTabChange}
          isLoading={isLoading}
          orders={orders}
          stats={stats}
          copy={copy}
          statusLabels={statusLabels}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          locale={locale}
          tCommon={tCommon}
          sellerUsername={sellerUsername}
          conversationMap={conversationMap}
          dateLocale={dateLocale}
          formatCurrency={formatCurrency}
          actions={actions}
        />
      </div>
    </div>
  )
}
