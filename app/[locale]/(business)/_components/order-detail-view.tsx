"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  ArrowLeft as IconArrowLeft,
  ChevronDown as IconChevronDown,
  Mail as IconMail,
  MapPin as IconMapPin,
  MessageCircle as IconMessage,
  Phone as IconPhone,
  Printer as IconPrinter,
  X as IconX,
} from "lucide-react"
import { toast } from "sonner"

import { Link, useRouter } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OrderHeader } from "@/components/shared/order-detail/order-header"
import { OrderDetailItemShell, OrderItemsList } from "@/components/shared/order-detail/order-items-list"
import { OrderPriceSummaryRows } from "@/components/shared/order-detail/order-price-summary"
import { OrderDetailSideCard } from "@/components/shared/order-detail/order-side-card"
import { OrderListStatusBadge } from "@/components/shared/order-list-item"

import {
  formatAddress,
  formatCurrency,
  getCustomer,
  getProduct,
  getStatusConfig,
  type OrderDetailViewProps,
} from "./order-detail-view.helpers"
import { OrderDetailViewTimelineCard } from "./order-detail-view-timeline-card"

export function OrderDetailView({
  order,
  items,
  subtotal,
}: OrderDetailViewProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const customer = getCustomer(order)
  const status = order.status || "pending"
  const statusConfig = getStatusConfig(status)
  const StatusIcon = statusConfig.icon
  const nextStatus = statusConfig.nextStatus

  const shippingCost = 0
  const total = order.total_amount || (subtotal + shippingCost)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsLoading(true)
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

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
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

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
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

          <OrderDetailViewTimelineCard createdAt={order.created_at} statusConfig={statusConfig} />
        </div>

        <div className="space-y-4">
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

          <OrderDetailSideCard title="Shipping Address">
            {order.shipping_address ? (
              <div className="flex gap-2 text-sm">
                <IconMapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{formatAddress(order.shipping_address)}</p>
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
