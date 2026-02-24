import type { Locale } from "date-fns"
import { Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SellerOrderCard } from "./seller-order-card"
import type {
  SellerOrderItem,
  SellerOrdersClientServerActions,
  SellerOrdersCopy,
  SellerOrdersStats,
  StatusFilter,
} from "./seller-orders.types"

type StatusLabels = {
  pending: string
  shipped: string
  delivered: string
  active: string
  all: string
}

type SellerOrdersListProps = {
  activeTab: StatusFilter
  activeTabLabel: string
  handleTabChange: (value: string) => void
  isLoading: boolean
  orders: SellerOrderItem[]
  stats: SellerOrdersStats
  copy: SellerOrdersCopy
  statusLabels: StatusLabels
  currentPage: number
  totalPages: number
  setCurrentPage: (updater: (page: number) => number) => void
  locale: string
  tCommon: (key: string) => string
  sellerUsername: string | null
  conversationMap: Map<string, string>
  dateLocale: Locale
  formatCurrency: (value: number) => string
  actions: SellerOrdersClientServerActions
}

export function SellerOrdersList({
  activeTab,
  activeTabLabel,
  handleTabChange,
  isLoading,
  orders,
  stats,
  copy,
  statusLabels,
  currentPage,
  totalPages,
  setCurrentPage,
  locale,
  tCommon,
  sellerUsername,
  conversationMap,
  dateLocale,
  formatCurrency,
  actions,
}: SellerOrdersListProps) {
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="all">
            {tCommon("all")} ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="active">
            {copy.tabs.active} ({stats.pending + stats.received + stats.processing + stats.shipped})
          </TabsTrigger>
          <TabsTrigger value="pending">{statusLabels.pending}</TabsTrigger>
          <TabsTrigger value="shipped">{statusLabels.shipped}</TabsTrigger>
          <TabsTrigger value="delivered">{statusLabels.delivered}</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value={activeTab} className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{copy.empty.title}</h3>
              <p className="text-muted-foreground">
                {activeTab === "all" ? copy.empty.allDescription : copy.empty.statusDescription(activeTabLabel)}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((item) => {
              const convKey = `${item.order_id}-${item.seller_id}`
              const conversationId = conversationMap.get(convKey) ?? null

              return (
                <SellerOrderCard
                  key={item.id}
                  item={item}
                  conversationId={conversationId}
                  sellerUsername={sellerUsername}
                  locale={locale}
                  copy={copy}
                  dateLocale={dateLocale}
                  formatCurrency={formatCurrency}
                  actions={actions}
                />
              )
            })}
          </div>
        )}

        {orders.length > 0 ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {locale === "bg" ? `Страница ${currentPage} от ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
            </p>

            <nav className="flex items-center gap-2" aria-label={tCommon("pagination")}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage <= 1 || isLoading}
              >
                {tCommon("previous")}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage >= totalPages || isLoading}
              >
                {tCommon("next")}
              </Button>
            </nav>
          </div>
        ) : null}
      </TabsContent>
    </Tabs>
  )
}
