import Image from "next/image"
import { Link } from "@/i18n/routing"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BoostDialog } from "../../../_components/seller/boost-dialog"
import { Package, Pause, Pencil, Play, Star, Tag, Trash, Zap as Lightning } from "lucide-react"
import type { BoostTimeLeft, SellingProduct, TranslateFn } from "./selling-products-list.types"

interface SellingProductsMobileListProps {
  products: SellingProduct[]
  sellerUsername: string
  locale: string
  formatCurrency: (value: number) => string
  t: TranslateFn
  tBoost: TranslateFn
  isBoostActive: (product: SellingProduct) => boolean
  isBoostExpired: (product: SellingProduct) => boolean
  getBoostTimeLeft: (product: SellingProduct) => BoostTimeLeft | null
  isSaleActive: (product: SellingProduct) => boolean
  getSalePercentForDisplay: (product: SellingProduct) => number
  openDiscountDialog: (product: SellingProduct) => void
  onToggleStatus: (productId: string, currentStatus?: string) => void
  onDelete: (productId: string) => void
  togglingId: string | null
  deletingId: string | null
}

export function SellingProductsMobileList({
  products,
  sellerUsername,
  locale,
  formatCurrency,
  t,
  tBoost,
  isBoostActive,
  isBoostExpired,
  getBoostTimeLeft,
  isSaleActive,
  getSalePercentForDisplay,
  openDiscountDialog,
  onToggleStatus,
  onDelete,
  togglingId,
  deletingId,
}: SellingProductsMobileListProps) {
  return (
    <div className="space-y-3 md:hidden">
      {products.map((product) => {
        const boosted = isBoostActive(product)
        const boostExpired = isBoostExpired(product)
        const timeLeft = getBoostTimeLeft(product)
        const saleActive = isSaleActive(product)
        const salePercent = getSalePercentForDisplay(product)

        return (
          <div
            key={product.id}
            className={`flex items-start gap-3 p-3 rounded-md bg-card border border-border ${boosted ? "ring-2 ring-selected-border border-selected-border" : ""}`}
          >
            <div className="relative size-20 rounded-md overflow-hidden bg-card border border-border shrink-0">
              {product.images?.[0] && product.images[0].startsWith("http") ? (
                <Image src={product.images[0]} alt={product.title} fill className="object-cover" sizes="80px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="size-8 text-muted-foreground" />
                </div>
              )}
              {boosted && (
                <div className="absolute top-1.5 left-1.5">
                  <Badge className="bg-primary text-primary-foreground text-2xs px-1.5 py-0.5 gap-0.5 shadow-sm">
                    <Lightning className="size-2.5" />
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/${sellerUsername}/${product.slug || product.id}`}
                    className="font-medium text-foreground hover:text-primary line-clamp-1 text-sm"
                  >
                    {product.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm font-semibold ${saleActive ? "text-deal" : "text-foreground"}`}>
                      {formatCurrency(Number(product.price))}
                    </span>
                    {saleActive && salePercent > 0 && (
                      <Badge variant="secondary" className="bg-destructive-subtle text-deal border-0 text-2xs px-1.5 py-0">
                        <Tag className="size-2.5 mr-0.5" />-{salePercent}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                    <span
                      className={
                        product.stock < 5 && product.stock > 0
                          ? "text-warning font-medium"
                          : product.stock === 0
                            ? "text-destructive font-medium"
                            : ""
                      }
                    >
                      {product.stock === 0 ? t("outOfStock") : t("inStock", { count: product.stock })}
                    </span>
                    {boosted && timeLeft && (
                      <Badge variant="secondary" className="bg-selected text-primary border-0 text-2xs px-1.5 py-0">
                        <Lightning className="size-2.5 mr-0.5" />
                        {tBoost("timeLeft", { days: timeLeft.days, hours: timeLeft.hours })}
                      </Badge>
                    )}
                    {boostExpired && (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-2xs px-1.5 py-0">
                        {tBoost("boostExpired")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className="flex text-rating">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} size={10} className="text-rating" />
                      ))}
                    </div>
                    <span className="text-2xs text-muted-foreground">({product.review_count || 0})</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openDiscountDialog(product)}
                    title={t("discountTooltip")}
                  >
                    <Tag className="size-4" />
                  </Button>

                  {!boosted && (
                    <BoostDialog
                      product={product}
                      locale={locale}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className={`${boostExpired ? "text-muted-foreground hover:text-primary" : "text-primary"} hover:bg-hover`}
                          title={boostExpired ? tBoost("reboost") : tBoost("trigger")}
                        >
                          <Lightning className="size-4" />
                        </Button>
                      }
                    />
                  )}

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onToggleStatus(product.id, product.status)}
                    disabled={togglingId === product.id}
                  >
                    {product.status === "draft" ? (
                      <Play className="size-4 text-success" />
                    ) : (
                      <Pause className="size-4 text-warning" />
                    )}
                  </Button>

                  <Button asChild variant="ghost" size="icon-sm">
                    <Link href={`/account/selling/${product.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive-subtle"
                        disabled={deletingId === product.id}
                      >
                        <Trash className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("deleteDialogTitle")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("deleteDialogDesc", { title: product.title })}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancelButton")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(product.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive"
                        >
                          {t("deleteButton")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
