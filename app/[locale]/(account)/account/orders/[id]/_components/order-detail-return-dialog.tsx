import { LoaderCircle as SpinnerGap } from "lucide-react"

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
import { OrderListProductThumb } from "@/components/shared/order-list-item"

import type { OrderDetailItem } from "./order-detail-types"

export function OrderDetailReturnDialog({
  locale,
  open,
  onOpenChange,
  selectedItem,
  returnReason,
  onReturnReasonChange,
  onSubmit,
  isSubmitting,
  formatPrice,
}: {
  locale: string
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItem: OrderDetailItem | null
  returnReason: string
  onReturnReasonChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  formatPrice: (price: number) => string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{locale === "bg" ? "Заявка за връщане" : "Return Request"}</DialogTitle>
          <DialogDescription>
            {locale === "bg"
              ? "Опишете защо искате да върнете продукта"
              : "Describe why you want to return this item"}
          </DialogDescription>
        </DialogHeader>
        {selectedItem && (
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-surface-subtle">
            <OrderListProductThumb
              imageSrc={selectedItem.product?.images?.[0]}
              alt={selectedItem.product?.title || (locale === "bg" ? "Продукт" : "Product")}
              className="size-12 rounded bg-muted"
              sizes="48px"
              fallbackClassName="text-muted-foreground"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-1">{selectedItem.product?.title}</p>
              <p className="text-xs text-muted-foreground">
                {selectedItem.quantity} × {formatPrice(selectedItem.price_at_purchase)}
              </p>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="returnReason">{locale === "bg" ? "Причина" : "Reason"}</Label>
          <Textarea
            id="returnReason"
            value={returnReason}
            onChange={(e) => onReturnReasonChange(e.target.value)}
            placeholder={locale === "bg" ? "Опишете проблема..." : "Describe the issue..."}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {locale === "bg" ? "Отказ" : "Cancel"}
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting || !returnReason.trim()}>
            {isSubmitting ? <SpinnerGap className="size-4 mr-2 animate-spin" /> : null}
            {locale === "bg" ? "Изпрати заявка" : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
