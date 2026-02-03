"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Package, Truck, CheckCircle, XCircle, MessageSquare } from "lucide-react"
import {
  canSellerUpdateStatus,
  SHIPPING_CARRIER_VALUES,
  type OrderItemStatus, 
  type ShippingCarrier 
} from "@/lib/order-status"
import { ORDER_STATUS_CONFIG } from "@/components/orders/order-status-config"
import { toast } from "sonner"
import { Link, useRouter } from "@/i18n/routing"

export type OrderStatusActionsServerActions = {
  updateOrderItemStatus: (
    orderItemId: string,
    newStatus: OrderItemStatus,
    trackingNumber?: string,
    shippingCarrier?: ShippingCarrier
  ) => Promise<{ success: boolean; error?: string }>
}

interface OrderStatusActionsProps {
  orderItemId: string
  currentStatus: OrderItemStatus
  orderId: string
  sellerId: string
  isSeller?: boolean
  conversationId?: string | null
  actions: OrderStatusActionsServerActions
}

export function OrderStatusActions({
  orderItemId,
  currentStatus,
  orderId: _orderId,
  sellerId: _sellerId,
  isSeller = true,
  conversationId,
  actions,
}: OrderStatusActionsProps) {
  const tOrders = useTranslations("Orders")
  const tCommon = useTranslations("Common")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showShippingDialog, setShowShippingDialog] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shippingCarrier, setShippingCarrier] = useState<ShippingCarrier | ''>()

  const config = ORDER_STATUS_CONFIG[currentStatus]
  const canUpdate = isSeller && canSellerUpdateStatus(currentStatus)

  async function handleStatusUpdate(newStatus: OrderItemStatus) {
    // If shipping, show dialog for tracking info
    if (newStatus === 'shipped') {
      setShowShippingDialog(true)
      return
    }

    startTransition(async () => {
      try {
        const result = await actions.updateOrderItemStatus(orderItemId, newStatus)
        if (result.success) {
          const statusLabel = tOrders(ORDER_STATUS_CONFIG[newStatus].labelKey)
          toast.success(tOrders("toasts.orderMarkedAs", { status: statusLabel }))
          router.refresh()
        } else {
          toast.error(result.error || tOrders("errors.failedToUpdateStatus"))
        }
      } catch {
        toast.error(tOrders("errors.unexpectedError"))
      }
    })
  }

  async function handleShippingSubmit() {
    startTransition(async () => {
      try {
        const result = await actions.updateOrderItemStatus(
          orderItemId, 
          'shipped',
          trackingNumber || undefined,
          shippingCarrier as ShippingCarrier || undefined
        )
        if (result.success) {
          toast.success(tOrders("toasts.orderMarkedAsShipped"))
          setShowShippingDialog(false)
          router.refresh()
        } else {
          toast.error(result.error || tOrders("errors.failedToUpdateStatus"))
        }
      } catch {
        toast.error(tOrders("errors.unexpectedError"))
      }
    })
  }

  const getActionIcon = (status: OrderItemStatus) => {
    switch (status) {
      case 'received': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Chat Link */}
      {conversationId && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/chat/${conversationId}`}>
            <MessageSquare className="h-4 w-4 mr-1.5" />
            {tOrders("actions.chat")}
          </Link>
        </Button>
      )}

      {/* Status Actions */}
      {canUpdate && config.nextStatus && (
        <Button
          size="sm"
          onClick={() => handleStatusUpdate(config.nextStatus!)}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            getActionIcon(config.nextStatus)
          )}
          {isPending ? tOrders("actions.updating") : config.nextActionKey ? tOrders(config.nextActionKey) : null}
        </Button>
      )}

      {/* Cancel Option */}
      {canUpdate && currentStatus !== 'cancelled' && (
        <Button
          variant="ghost"
          size="sm"
          className="text-status-error hover:bg-status-error/10"
          onClick={() => handleStatusUpdate('cancelled')}
          disabled={isPending}
        >
          <XCircle className="h-4 w-4 mr-1.5" />
          {tCommon("cancel")}
        </Button>
      )}

      {/* Shipping Dialog */}
      <Dialog open={showShippingDialog} onOpenChange={setShowShippingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tOrders("actions.shipOrder")}</DialogTitle>
            <DialogDescription>
              {tOrders("shipping.dialogDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">{tOrders("shipping.carrierLabel")}</Label>
              <Select value={shippingCarrier} onValueChange={(v) => setShippingCarrier(v as ShippingCarrier)}>
                <SelectTrigger id="carrier">
                  <SelectValue placeholder={tOrders("shipping.carrierPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {SHIPPING_CARRIER_VALUES.map((carrier) => (
                    <SelectItem key={carrier} value={carrier}>
                      {tOrders(`shippingCarriers.${carrier}` as never)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tracking">{tOrders("shipping.trackingNumberLabel")}</Label>
              <Input
                id="tracking"
                placeholder={tOrders("shipping.trackingNumberPlaceholder")}
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowShippingDialog(false)}
              disabled={isPending}
            >
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleShippingSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  {tOrders("actions.shipping")}
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-1.5" />
                  {tOrders("actions.markAsShipped")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
