import Image from "next/image"
import { Link } from "@/i18n/routing"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BoostDialog } from "../../../_components/seller/boost-dialog"
import { Eye, Package, Pause, Pencil, Play, Star, Tag, Trash, Zap as Lightning } from "lucide-react"
import type { BoostTimeLeft, SellingProduct, TranslateFn } from "./selling-products-list.types"

interface SellingProductsDesktopListProps {
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
  formatBoostExpiry: (dateStr: string) => string
  openDiscountDialog: (product: SellingProduct) => void
  onToggleStatus: (productId: string, currentStatus?: string) => void
  onDelete: (productId: string) => void
  togglingId: string | null
  deletingId: string | null
}

type ListingStatus = "active" | "draft" | "sold"

function getListingStatus(product: SellingProduct): ListingStatus {
  if (product.status === "draft" || product.status === "archived") return "draft"
  if (product.status === "out_of_stock" || product.stock === 0) return "sold"
  return "active"
}

function getStatusBadgeProps(status: ListingStatus, t: TranslateFn) {
  switch (status) {
    case "sold":
      return { variant: "warning-subtle" as const, label: t("status.sold") }
    case "draft":
      return { variant: "neutral-subtle" as const, label: t("status.draft") }
    case "active":
    default:
      return { variant: "success-subtle" as const, label: t("status.active") }
  }
}

export function SellingProductsDesktopList({
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
  formatBoostExpiry,
  openDiscountDialog,
  onToggleStatus,
  onDelete,
  togglingId,
  deletingId,
}: SellingProductsDesktopListProps) {
  return (
    <div className="hidden md:block divide-y divide-border">
      {products.map((product) => {
        const boosted = isBoostActive(product)
        const boostExpired = isBoostExpired(product)
        const timeLeft = getBoostTimeLeft(product)
        const saleActive = isSaleActive(product)
        const salePercent = getSalePercentForDisplay(product)
        const status = getListingStatus(product)
        const statusBadge = getStatusBadgeProps(status, t)

        return (
          <div
            key={product.id}
            className={`flex items-center gap-4 p-4 hover:bg-hover transition-colors ${boosted ? "bg-selected" : ""}`}
          >
            <div className="relative size-16 rounded-md overflow-hidden bg-card border border-border shrink-0">
              {product.images?.[0] && product.images[0].startsWith("http") ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="size-6 text-muted-foreground" />
                </div>
              )}
              {boosted && (
                <div className="absolute top-1 left-1">
                  <Badge className="bg-primary text-primary-foreground text-2xs px-1 py-0 gap-0.5">
                    <Lightning className="size-2.5" />
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/${sellerUsername}/${product.slug || product.id}`}
                  className="font-medium text-foreground hover:text-primary line-clamp-1"
                >
                  {product.title}
                </Link>
                <Badge variant={statusBadge.variant} size="compact" className="shrink-0">
                  {statusBadge.label}
                </Badge>
                {saleActive && salePercent > 0 && (
                  <Badge variant="secondary" className="bg-destructive-subtle text-deal border-0 text-xs shrink-0">
                    <Tag className="size-3 mr-0.5" />
                    -{salePercent}%
                  </Badge>
                )}
                {boosted && timeLeft && (
                  <Badge
                    variant="secondary"
                    className="bg-selected text-primary border-0 text-xs shrink-0"
                    title={
                      product.boost_expires_at
                        ? tBoost("boostActiveUntil", { date: formatBoostExpiry(product.boost_expires_at) })
                        : undefined
                    }
                  >
                    <Lightning className="size-3 mr-0.5" />
                    {tBoost("timeLeft", { days: timeLeft.days, hours: timeLeft.hours })}
                  </Badge>
                )}
                {boostExpired && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-xs shrink-0">
                    {tBoost("boostExpired")}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-semibold ${saleActive ? "text-deal" : "text-foreground"}`}>
                    {formatCurrency(Number(product.price))}
                  </span>
                  {product.list_price && product.list_price > product.price && (
                    <span className="text-muted-foreground line-through text-xs">
                      {formatCurrency(Number(product.list_price))}
                    </span>
                  )}
                </div>
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
                {product.category && <span className="text-muted-foreground">{product.category.name}</span>}
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <div className="flex text-rating">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} size={12} className="text-rating" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.review_count || 0})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!boosted && (
                <BoostDialog
                  product={product}
                  locale={locale}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className={`gap-1.5 ${boostExpired ? "text-muted-foreground border-border hover:text-primary hover:border-selected-border" : "text-primary border-selected-border"} hover:bg-hover px-3 rounded-full`}
                    >
                      <Lightning className="size-4" />
                      {boostExpired ? tBoost("reboost") : tBoost("trigger")}
                    </Button>
                  }
                />
              )}

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => openDiscountDialog(product)}
                title={t("discountTooltip")}
                aria-label={t("discountTooltip")}
              >
                <Tag className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onToggleStatus(product.id, product.status)}
                disabled={togglingId === product.id}
                title={product.status === "draft" ? t("activateTooltip") : t("pauseTooltip")}
                aria-label={product.status === "draft" ? t("activateTooltip") : t("pauseTooltip")}
              >
                {product.status === "draft" ? (
                  <Play className="size-4 text-success" />
                ) : (
                  <Pause className="size-4 text-warning" />
                )}
              </Button>

              <Button asChild variant="ghost" size="icon-sm">
                <Link href={`/${sellerUsername}/${product.slug || product.id}`}>
                  <Eye className="size-4" />
                  <span className="sr-only">{t("viewSrOnly")}</span>
                </Link>
              </Button>

              <Button asChild variant="ghost" size="icon-sm">
                <Link href={`/account/selling/${product.id}/edit`}>
                  <Pencil className="size-4" />
                  <span className="sr-only">{t("editSrOnly")}</span>
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
                    <span className="sr-only">{t("deleteSrOnly")}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("deleteDialogTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("deleteDialogDesc", { title: product.title })}
                    </AlertDialogDescription>
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
        )
      })}
    </div>
  )
}
