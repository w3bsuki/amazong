
import { useState, type TransitionStartFunction } from "react"
import { toast } from "sonner"
import { XCircle, Loader2 } from "lucide-react"
import { useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { BuyerOrderActionsCopy } from "../buyer-order-actions.copy"
import type { BuyerOrderActionsServerActions } from "../buyer-order-actions.types"

type CancelActionProps = {
  canRender: boolean
  isSubmitting: boolean
  orderItemId: string
  requestOrderCancellation: BuyerOrderActionsServerActions["requestOrderCancellation"]
  startTransition: TransitionStartFunction
  copy: BuyerOrderActionsCopy
}

export function CancelAction({
  canRender,
  isSubmitting,
  orderItemId,
  requestOrderCancellation,
  startTransition,
  copy,
}: CancelActionProps) {
  const router = useRouter()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  if (!canRender) return null

  const handleCancelOrder = () => {
    startTransition(async () => {
      try {
        const result = await requestOrderCancellation(orderItemId, cancelReason || undefined)
        if (result.success) {
          toast.success(copy.toasts.orderCancelled)
          setShowCancelDialog(false)
          setCancelReason("")
          router.refresh()
        } else {
          toast.error(copy.errors.failedToCancelOrder)
        }
      } catch {
        toast.error(copy.errors.unexpected)
      }
    })
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowCancelDialog(true)}
        disabled={isSubmitting}
        className="text-status-error hover:bg-status-error/10"
      >
        <XCircle className="h-4 w-4 mr-1.5" />
        {copy.cancelOrder}
      </Button>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-status-error">
              <XCircle className="h-5 w-5" />
              {copy.cancelTitle}
            </DialogTitle>
            <DialogDescription>{copy.cancelDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">{copy.cancelReasonLabel}</Label>
              <Textarea
                id="cancelReason"
                placeholder={copy.cancelReasonPlaceholder}
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)} disabled={isSubmitting}>
              {copy.cancel}
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  {copy.submitting}
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-1.5" />
                  {copy.confirmCancel}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
