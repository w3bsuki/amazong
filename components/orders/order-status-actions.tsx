"use client"

import { useState } from "react"
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
import { updateOrderItemStatus } from "@/app/actions/orders"
import { 
  ORDER_STATUS_CONFIG, 
  SHIPPING_CARRIERS, 
  getNextStatusOptions,
  canSellerUpdateStatus,
  type OrderItemStatus, 
  type ShippingCarrier 
} from "@/lib/order-status"
import { toast } from "sonner"
import { Link, useRouter } from "@/i18n/routing"

interface OrderStatusActionsProps {
  orderItemId: string
  currentStatus: OrderItemStatus
  orderId: string
  sellerId: string
  isSeller?: boolean
  conversationId?: string | null
  locale?: string
}

export function OrderStatusActions({
  orderItemId,
  currentStatus,
  orderId: _orderId,
  sellerId: _sellerId,
  isSeller = true,
  conversationId,
  locale = 'en'
}: OrderStatusActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showShippingDialog, setShowShippingDialog] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shippingCarrier, setShippingCarrier] = useState<ShippingCarrier | ''>()

  const config = ORDER_STATUS_CONFIG[currentStatus]
  const _nextOptions = getNextStatusOptions(currentStatus)
  const canUpdate = isSeller && canSellerUpdateStatus(currentStatus)

  async function handleStatusUpdate(newStatus: OrderItemStatus) {
    // If shipping, show dialog for tracking info
    if (newStatus === 'shipped') {
      setShowShippingDialog(true)
      return
    }

    setIsLoading(true)
    try {
      const result = await updateOrderItemStatus(orderItemId, newStatus)
      if (result.success) {
        toast.success(`Order marked as ${ORDER_STATUS_CONFIG[newStatus].label}`)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to update status')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleShippingSubmit() {
    setIsLoading(true)
    try {
      const result = await updateOrderItemStatus(
        orderItemId, 
        'shipped',
        trackingNumber || undefined,
        shippingCarrier as ShippingCarrier || undefined
      )
      if (result.success) {
        toast.success('Order marked as shipped!')
        setShowShippingDialog(false)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to update status')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
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
          <Link href={`/chat?conversation=${conversationId}`}>
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Chat
          </Link>
        </Button>
      )}

      {/* Status Actions */}
      {canUpdate && config.nextStatus && (
        <Button
          size="sm"
          onClick={() => handleStatusUpdate(config.nextStatus!)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            getActionIcon(config.nextStatus)
          )}
          {isLoading ? 'Updating...' : config.nextActionLabel}
        </Button>
      )}

      {/* Cancel Option */}
      {canUpdate && currentStatus !== 'cancelled' && (
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => handleStatusUpdate('cancelled')}
          disabled={isLoading}
        >
          <XCircle className="h-4 w-4 mr-1.5" />
          Cancel
        </Button>
      )}

      {/* Shipping Dialog */}
      <Dialog open={showShippingDialog} onOpenChange={setShowShippingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ship Order</DialogTitle>
            <DialogDescription>
              Add tracking information for this shipment (optional but recommended).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Shipping Carrier</Label>
              <Select value={shippingCarrier} onValueChange={(v) => setShippingCarrier(v as ShippingCarrier)}>
                <SelectTrigger id="carrier">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  {SHIPPING_CARRIERS.map((carrier) => (
                    <SelectItem key={carrier.value} value={carrier.value}>
                      {carrier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowShippingDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleShippingSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Shipping...
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-1.5" />
                  Mark as Shipped
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
