import { MessageCircle, Minus, Plus, RotateCcw, ShieldCheck, ShoppingCart, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

type TranslateFn = (key: string, values?: Record<string, string | number>) => string

type DesktopBuyBoxCtaSectionProps = {
  locale: string
  currency: string
  price: number
  quantity: number
  setQuantity: (value: number) => void
  isRealEstate: boolean
  isAutomotive: boolean
  isOutOfStock: boolean
  showQuantity: boolean
  onAddToCart: () => void
  onBuyNow: () => void
  t: TranslateFn
}

function formatPrice(locale: string, currency: string, amount: number) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function DesktopBuyBoxCtaSection({
  locale,
  currency,
  price,
  quantity,
  setQuantity,
  isRealEstate,
  isAutomotive,
  isOutOfStock,
  showQuantity,
  onAddToCart,
  onBuyNow,
  t,
}: DesktopBuyBoxCtaSectionProps) {
  const primaryCtaLabel = isRealEstate ? t("contactAgent") : isAutomotive ? t("contactSeller") : t("addToCart")
  const secondaryCtaLabel = isRealEstate ? t("scheduleVisit") : isAutomotive ? t("testDrive") : t("buyNow")

  return (
    <>
      {showQuantity && !isOutOfStock && (
        <div className="flex items-center justify-between gap-3 py-2 border-y border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("qty")}</span>
            <div className="flex items-center border border-border rounded-xl">
              <IconButton
                type="button"
                size="icon-lg"
                variant="ghost"
                className="hover:bg-muted"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label={t("decreaseQuantity")}
              >
                <Minus className={cn(quantity <= 1 ? "text-muted-foreground opacity-40" : "text-foreground")} />
              </IconButton>
              <span className="px-3 py-1 text-sm font-medium min-w-touch text-center">{quantity}</span>
              <IconButton
                type="button"
                size="icon-lg"
                variant="ghost"
                className="hover:bg-muted"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                aria-label={t("increaseQuantity")}
              >
                <Plus className="text-foreground" />
              </IconButton>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">{t("total")}</span>
            <div className="text-lg font-bold text-foreground">{formatPrice(locale, currency, price * quantity)}</div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {isRealEstate || isAutomotive ? (
          <>
            <Button size="lg" className="flex-1 font-semibold" disabled={isOutOfStock}>
              <MessageCircle className="size-4" />
              {primaryCtaLabel}
            </Button>
            <Button variant="outline" size="lg" className="px-4">
              {secondaryCtaLabel}
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" className="flex-1 font-semibold" onClick={onAddToCart} disabled={isOutOfStock}>
              <ShoppingCart className="size-4" />
              {t("addToCart")}
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={onBuyNow}
              disabled={isOutOfStock}
              title={t("buyNow")}
              aria-label={t("buyNow")}
            >
              <Zap />
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck className="size-3 text-muted-foreground" />
          {t("buyerProtection")}
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="flex items-center gap-1">
          <RotateCcw className="size-3" />
          {isRealEstate ? t("verifiedListing") : t("easyReturns")}
        </span>
      </div>
    </>
  )
}
