import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SellingProduct, TranslateFn } from "./selling-products-list.types"

interface SellingProductsDiscountDialogProps {
  open: boolean
  locale: string
  t: TranslateFn
  activeDiscountProduct: SellingProduct | null
  discountPrice: string
  onDiscountPriceChange: (value: string) => void
  discountingId: string | null
  formatCurrency: (value: number) => string
  onClose: () => void
  onOpenChange: (open: boolean) => void
  onApply: () => void
  onClear: () => void
}

export function SellingProductsDiscountDialog({
  open,
  t,
  activeDiscountProduct,
  discountPrice,
  onDiscountPriceChange,
  discountingId,
  formatCurrency,
  onClose,
  onOpenChange,
  onApply,
  onClear,
}: SellingProductsDiscountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("setDiscountTitle")}</DialogTitle>
          <DialogDescription>
            {activeDiscountProduct
              ? t("setDiscountDesc", { title: activeDiscountProduct.title })
              : t("setDiscountDescGeneric")}
          </DialogDescription>
        </DialogHeader>

        {activeDiscountProduct && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t("currentPriceLabel")}</span>{" "}
              {formatCurrency(Number(activeDiscountProduct.price))}
              {activeDiscountProduct.list_price &&
              Number(activeDiscountProduct.list_price) > Number(activeDiscountProduct.price) ? (
                <>
                  {" "}·{" "}
                  <span className="line-through">
                    {formatCurrency(Number(activeDiscountProduct.list_price))}
                  </span>
                </>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount-price">{t("newPriceLabel")}</Label>
              <Input
                id="discount-price"
                inputMode="decimal"
                value={discountPrice}
                onChange={(event) => onDiscountPriceChange(event.target.value)}
                placeholder={t("newPricePlaceholder")}
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {activeDiscountProduct?.list_price &&
          Number(activeDiscountProduct.list_price) > Number(activeDiscountProduct.price) ? (
            <Button
              type="button"
              variant="outline"
              onClick={onClear}
              disabled={discountingId === activeDiscountProduct.id}
            >
              {t("removeDiscountButton")}
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={onClose}>
            {t("cancelButton")}
          </Button>
          <Button
            type="button"
            onClick={onApply}
            disabled={!!activeDiscountProduct && discountingId === activeDiscountProduct.id}
          >
            {t("saveButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
