"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"
import { format } from "date-fns"
import { ArrowLeft as IconArrowLeft, Check as IconCheck, ChevronDown as IconChevronDown, Clock as IconClock, Mail as IconMail, MapPin as IconMapPin, MessageCircle as IconMessage, Package as IconPackage, Phone as IconPhone, Printer as IconPrinter, RefreshCw as IconRefresh, Truck as IconTruck, X as IconX } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { OrderListStatusBadge } from "@/components/shared/order-list-item"
import { OrderHeader } from "@/components/shared/order-detail/order-header"
import { OrderPriceSummaryRows } from "@/components/shared/order-detail/order-price-summary"
import { OrderDetailItemShell, OrderItemsList } from "@/components/shared/order-detail/order-items-list"
import { OrderDetailSideCard } from "@/components/shared/order-detail/order-side-card"

// Type definitions - aligned with actual database schema
interface OrderProduct {
  id: string
  title: string
  images: string[] | null
  sku: string | null
  price: number
}

interface OrderItem {
  id: string
  quantity: number
  price_at_time: number // Maps to price_at_purchase in DB
  status?: string | null
  tracking_number?: string | null
  shipping_carrier?: string | null
  product: OrderProduct | OrderProduct[] | null
}

interface OrderCustomer {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
}

interface Order {
  id: string
  status: string | null
  created_at: string
  total_amount?: number
  shipping_address: Record<string, unknown> | null
  user: OrderCustomer | OrderCustomer[] | null
}

interface OrderDetailViewProps {
  order: Order
  items: OrderItem[]
  subtotal: number
  sellerId: string
}

const STATUS_CONFIG = {
  pending: {
    label: "Unfulfilled",
    color: "bg-muted text-foreground border-border",
    icon: IconPackage,
    nextStatus: "processing",
  },
  paid: {
    label: "Paid",
    color: "bg-success/10 text-success border-success/20",
    icon: IconCheck,
    nextStatus: "processing",
  },
  processing: {
    label: "Processing",
    color: "bg-selected text-primary border-selected-border",
    icon: IconRefresh,
    nextStatus: "shipped",
  },
  shipped: {
    label: "Shipped",
    color: "bg-muted text-foreground border-border",
    icon: IconTruck,
    nextStatus: "delivered",
  },
  delivered: {
    label: "Delivered",
    color: "bg-success/10 text-success border-success/20",
    icon: IconCheck,
    nextStatus: undefined,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-destructive-subtle text-destructive border-destructive/20",
    icon: IconX,
    nextStatus: undefined,
  },
} as const

type StatusKey = keyof typeof STATUS_CONFIG

function getStatusConfig(status: string): (typeof STATUS_CONFIG)[StatusKey] {
  if (status in STATUS_CONFIG) return STATUS_CONFIG[status as StatusKey]
  return STATUS_CONFIG.pending
}

export function OrderDetailView({
  order,
  items,
  subtotal,
}: OrderDetailViewProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  // Helper to get nested data
  const getProduct = (item: OrderItem): OrderProduct | null => {
    if (!item.product) return null
    return Array.isArray(item.product) ? (item.product.at(0) ?? null) : item.product
  }

  const getCustomer = (): OrderCustomer | null => {
    if (!order.user) return null
    return Array.isArray(order.user) ? (order.user.at(0) ?? null) : order.user
  }

  const customer = getCustomer()
  const status = order.status || "pending"
  const statusConfig = getStatusConfig(status)
  const StatusIcon = statusConfig.icon
  const nextStatus = statusConfig.nextStatus

  const shippingCost = 0 // Shipping cost not stored in orders table yet
  const total = order.total_amount || (subtotal + shippingCost)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(value)
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setIsLoading(true)
    // Stub: Use updateOrderItemStatus action when order_item_id is available in this component
    // Currently the order-status-actions component handles this for individual items
    toast.success(`Order marked as ${newStatus}`)
    setIsLoading(false)
    router.refresh()
  }

  const handleContactCustomer = () => {
    if (customer) {
      router.push(`/chat?seller=${customer.id}`)
    }
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id)
    toast.success("Order ID copied")
  }

  const formatAddress = (address: Record<string, unknown> | null) => {
    if (!address) return null
    const parts = [
      address.street as string,
      address.city as string,
      address.state as string,
      address.postal_code as string,
      address.country as string,
    ].filter(Boolean)
    return parts.join(", ")
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      {/* Header */}
      <OrderHeader
        onBack={() => router.push("/dashboard/orders")}
        backButton={<IconArrowLeft className="size-4" />}
        backAriaLabel="Back"
        backButtonClassName="shrink-0 -ml-2"
        title="Order"
        orderId={order.id}
        subtitle={format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
        copyAriaLabel="Copy order ID"
        onCopy={copyOrderId}
        inlineMeta={
          <OrderListStatusBadge
            status={status}
            label={statusConfig.label}
            className="gap-1"
            icon={<StatusIcon className="size-3" />}
          />
        }
        rightContent={
          <div className="flex items-center gap-2 flex-wrap">
            {nextStatus && (
              <Button
                onClick={() => handleStatusUpdate(nextStatus)}
                disabled={isLoading}
                size="sm"
              >
                {nextStatus === "processing" && "Start Processing"}
                {nextStatus === "shipped" && "Mark as Shipped"}
                {nextStatus === "delivered" && "Mark as Delivered"}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  More actions
                  <IconChevronDown className="size-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleContactCustomer}>
                  <IconMessage className="size-4 mr-2" />
                  Contact Customer
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPrinter className="size-4 mr-2" />
                  Print Packing Slip
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("cancelled")}
                  className="text-destructive focus:bg-destructive-subtle focus:text-destructive"
                  disabled={status === "cancelled" || status === "delivered"}
                >
                  <IconX className="size-4 mr-2" />
                  Cancel Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {/* Main Content - Two Column Layout */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Items Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Items</CardTitle>
                <Badge variant="secondary">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <OrderItemsList divided>
                {items.map((item) => {
                  const product = getProduct(item)
                  return (
                    <OrderDetailItemShell
                      key={item.id}
                      imageSrc={product?.images?.[0]}
                      imageAlt={product?.title || "Product"}
                      imageClassName="size-14 rounded-lg bg-muted shrink-0"
                      imageSizes="56px"
                      itemClassName="items-center rounded-none border-0 bg-transparent p-4"
                      content={
                        <>
                          <Link
                            href={`/products/${product?.id}`}
                            className="font-medium text-sm hover:underline"
                          >
                            {product?.title || "Unknown Product"}
                          </Link>
                          {product?.sku && (
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                              SKU: {product.sku}
                            </p>
                          )}
                        </>
                      }
                      trailing={
                        <>
                          <div className="text-right">
                            <p className="text-sm font-medium tabular-nums">
                              {formatCurrency(item.price_at_time)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right w-24">
                            <p className="font-medium tabular-nums">
                              {formatCurrency(item.price_at_time * item.quantity)}
                            </p>
                          </div>
                        </>
                      }
                    />
                  )
                })}
              </OrderItemsList>

              {/* Order Summary */}
              <div className="border-t p-4 space-y-2">
                <OrderPriceSummaryRows
                  subtotalLabel="Subtotal"
                  subtotalValue={formatCurrency(subtotal)}
                  shippingLabel="Shipping"
                  shippingValue={shippingCost > 0 ? formatCurrency(shippingCost) : "Free"}
                  totalLabel="Total"
                  totalValue={formatCurrency(total)}
                  subtotalSlot={<span className="tabular-nums">{formatCurrency(subtotal)}</span>}
                  shippingSlot={
                    <span className="tabular-nums">
                      {shippingCost > 0 ? formatCurrency(shippingCost) : "Free"}
                    </span>
                  }
                  totalSlot={<span className="tabular-nums">{formatCurrency(total)}</span>}
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <OrderDetailSideCard title="Timeline">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "flex size-8 items-center justify-center rounded-full",
                    statusConfig.color
                  )}>
                    <StatusIcon className="size-4" />
                  </div>
                  <div className="w-px h-full bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium text-sm">{statusConfig.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                    <IconClock className="size-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm">Order placed</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </OrderDetailSideCard>
        </div>

        {/* Right Column - Customer & Shipping Info */}
        <div className="space-y-4">
          {/* Customer Card */}
          <OrderDetailSideCard
            title="Customer"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={handleContactCustomer}
              >
                <IconMessage className="size-4 mr-1" />
                Contact
              </Button>
            }
            actionRowClassName="flex items-center justify-between"
            contentClassName="space-y-3"
          >
            <div>
              <p className="font-medium">{customer?.full_name || "Guest Customer"}</p>
            </div>
            {customer?.email && (
              <div className="flex items-center gap-2 text-sm">
                <IconMail className="size-4 text-muted-foreground" />
                <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                  {customer.email}
                </a>
              </div>
            )}
            {customer?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <IconPhone className="size-4 text-muted-foreground" />
                <a href={`tel:${customer.phone}`} className="hover:underline">
                  {customer.phone}
                </a>
              </div>
            )}
          </OrderDetailSideCard>

          {/* Shipping Address Card */}
          <OrderDetailSideCard title="Shipping Address">
            {order.shipping_address ? (
              <div className="flex gap-2 text-sm">
                <IconMapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  {formatAddress(order.shipping_address)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No shipping address provided</p>
            )}
          </OrderDetailSideCard>
        </div>
      </div>
    </div>
  )
}
