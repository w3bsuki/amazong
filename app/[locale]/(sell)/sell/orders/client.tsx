"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package, Loader2, RefreshCw, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { OrderStatusActions } from "@/components/order-status-actions"
import { SellerRateBuyerActions } from "@/components/seller-rate-buyer-actions"
import { getSellerOrders, getSellerOrderStats, getOrderConversation, type OrderItem } from "@/app/actions/orders"
import { type OrderItemStatus } from "@/lib/order-status"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface SellerOrdersClientProps {
  locale: string
}

type StatusFilter = OrderItemStatus | 'all' | 'active'

export function SellerOrdersClient({ locale }: SellerOrdersClientProps) {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<StatusFilter>('all')
  const [stats, setStats] = useState({
    pending: 0,
    received: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    total: 0
  })
  const [conversationMap, setConversationMap] = useState<Map<string, string>>(new Map())

  // Load orders and stats
  async function loadData() {
    try {
      const [ordersResult, statsResult] = await Promise.all([
        getSellerOrders(),
        getSellerOrderStats()
      ])
      
      if (ordersResult.orders) {
        setOrders(ordersResult.orders)
        
        // Load conversation IDs for each order
        const convPromises = ordersResult.orders.map(async (item) => {
          const result = await getOrderConversation(item.order_id, item.seller_id)
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
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleRefresh() {
    setIsRefreshing(true)
    loadData()
  }

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return ['pending', 'received', 'processing', 'shipped'].includes(order.status)
    return order.status === activeTab
  })

  // Stats cards
  const statCards = [
    { key: 'pending' as const, label: 'Pending', icon: '⏳', color: 'bg-yellow-500' },
    { key: 'processing' as const, label: 'Processing', icon: '📦', color: 'bg-indigo-500' },
    { key: 'shipped' as const, label: 'Shipped', icon: '🚚', color: 'bg-purple-500' },
    { key: 'delivered' as const, label: 'Delivered', icon: '🎉', color: 'bg-green-500' },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${locale}/sell`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Your Orders</h1>
            <p className="text-sm text-muted-foreground">Manage incoming orders and shipments</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card 
              key={stat.key} 
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                activeTab === stat.key && "ring-2 ring-primary"
              )}
              onClick={() => setActiveTab(stat.key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", stat.color)}>
                    <span className="text-lg">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats[stat.key]}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as StatusFilter)}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({stats.pending + stats.received + stats.processing + stats.shipped})
              </TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
          </div>

          {/* Orders List */}
          <TabsContent value={activeTab} className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'all' 
                      ? "When customers purchase your products, their orders will appear here."
                      : `You have no ${activeTab} orders.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((item) => {
                  const convKey = `${item.order_id}-${item.seller_id}`
                  const conversationId = conversationMap.get(convKey)
                  
                  return (
                    <Card key={item.id}>
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Product Image */}
                          <div className="relative w-full md:w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                            {item.product?.images?.[0] ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product?.title || 'Product'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Order Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="font-semibold line-clamp-1">
                                  {item.product?.title || 'Unknown Product'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity} × ${item.price_at_purchase.toFixed(2)}
                                </p>
                              </div>
                              <OrderStatusBadge status={item.status} />
                            </div>

                            {/* Buyer Info */}
                            {item.buyer && (
                              <div className="flex items-center gap-2 mb-3 text-sm">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={item.buyer.avatar_url || undefined} />
                                  <AvatarFallback>
                                    {item.buyer.full_name?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-muted-foreground">
                                  {item.buyer.full_name || item.buyer.email}
                                </span>
                              </div>
                            )}

                            {/* Shipping Address - Full details for seller to ship */}
                            {item.order?.shipping_address && (
                              <div className="text-sm bg-muted/50 rounded-lg p-3 mb-3 space-y-1">
                                <div className="flex items-center gap-1.5 font-medium text-foreground">
                                  📍 Ship To:
                                </div>
                                {item.order.shipping_address.name && (
                                  <div>{item.order.shipping_address.name}</div>
                                )}
                                {item.order.shipping_address.address?.line1 && (
                                  <div className="text-muted-foreground">{item.order.shipping_address.address.line1}</div>
                                )}
                                {item.order.shipping_address.address?.line2 && (
                                  <div className="text-muted-foreground">{item.order.shipping_address.address.line2}</div>
                                )}
                                {item.order.shipping_address.address && (
                                  <div className="text-muted-foreground">
                                    {[
                                      item.order.shipping_address.address.city,
                                      item.order.shipping_address.address.state,
                                      item.order.shipping_address.address.postal_code,
                                    ].filter(Boolean).join(', ')}
                                  </div>
                                )}
                                {item.order.shipping_address.address?.country && (
                                  <div className="text-muted-foreground font-medium">{item.order.shipping_address.address.country}</div>
                                )}
                                {item.order.shipping_address.email && (
                                  <div className="text-xs text-muted-foreground mt-1">✉️ {item.order.shipping_address.email}</div>
                                )}
                              </div>
                            )}

                            {/* Tracking Info */}
                            {item.tracking_number && (
                              <div className="text-sm mb-3">
                                <span className="text-muted-foreground">Tracking: </span>
                                <span className="font-mono">{item.tracking_number}</span>
                                {item.shipping_carrier && (
                                  <span className="text-muted-foreground"> ({item.shipping_carrier})</span>
                                )}
                              </div>
                            )}

                            {/* Time */}
                            <p className="text-xs text-muted-foreground">
                              Ordered {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex md:flex-col gap-2 justify-end">
                            <OrderStatusActions
                              orderItemId={item.id}
                              currentStatus={item.status}
                              orderId={item.order_id}
                              sellerId={item.seller_id}
                              isSeller={true}
                              conversationId={conversationId}
                              locale={locale}
                            />
                            
                            {/* Rate Buyer - only shown for delivered orders */}
                            <SellerRateBuyerActions
                              orderItemId={item.id}
                              currentStatus={item.status}
                              locale={locale}
                            />
                            
                            {item.product?.slug && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/${locale}/product/${item.product.slug}`} target="_blank">
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
