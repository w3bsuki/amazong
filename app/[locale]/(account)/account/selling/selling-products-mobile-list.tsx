import Image from "next/image"
import { Link } from "@/i18n/routing"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BoostDialog } from "../../../_components/seller/boost-dialog"
import { Package, Pencil, Trash, Zap as Lightning } from "lucide-react"

import { cn } from "@/lib/utils"
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
  onDelete: (productId: string) => void
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
  onDelete,
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
        const status = getListingStatus(product)
        const statusBadge = getStatusBadgeProps(status, t)

        return (
          <div
            key={product.id}
            className={cn(
              "flex items-start gap-3 rounded-2xl border border-border-subtle bg-card p-4",
              boosted && "ring-2 ring-selected-border border-selected-border",
            )}
          >
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-background">
              {product.images?.[0] && product.images[0].startsWith("http") ? (
                <Image src={product.images[0]} alt={product.title} fill className="object-cover" sizes="80px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="size-8 text-muted-foreground" />
                </div>
              )}
              {boosted && (
                <div className="absolute top-1.5 left-1.5">
                  <Badge size="compact" className="bg-primary text-primary-foreground shadow-sm">
                    <Lightning className="size-2.5" aria-hidden="true" />
                  </Badge>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/${sellerUsername}/${product.slug || product.id}`}
                      className="min-w-0 flex-1 font-semibold text-foreground hover:text-primary line-clamp-1 text-sm"
                    >
                      {product.title}
                    </Link>
                    <Badge variant={statusBadge.variant} size="compact" className="shrink-0">
                      {statusBadge.label}
                    </Badge>
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span className={cn("text-sm font-semibold", saleActive ? "text-deal" : "text-foreground")}>
                      {formatCurrency(Number(product.price))}
                    </span>
                    {saleActive && salePercent > 0 && (
                      <Badge variant="critical-subtle" size="compact">
                        -{salePercent}%
                      </Badge>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {product.stock === 0 ? t("outOfStock") : t("inStock", { count: product.stock })}
                    </span>
                    {boosted && timeLeft && (
                      <Badge variant="info-subtle" size="compact">
                        <Lightning className="size-2.5" aria-hidden="true" />
                        {tBoost("timeLeft", { days: timeLeft.days, hours: timeLeft.hours })}
                      </Badge>
                    )}
                    {boostExpired && (
                      <Badge variant="neutral-subtle" size="compact">
                        {tBoost("boostExpired")}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-1.5">
                    {!boosted && (
                      <BoostDialog
                        product={product}
                        locale={locale}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-default"
                            className={cn(
                              boostExpired ? "text-muted-foreground hover:text-primary" : "text-primary",
                              "hover:bg-hover",
                            )}
                            aria-label={boostExpired ? tBoost("reboost") : tBoost("trigger")}
                            title={boostExpired ? tBoost("reboost") : tBoost("trigger")}
                          >
                            <Lightning className="size-4" aria-hidden="true" />
                          </Button>
                        }
                      />
                    )}

                    <Button asChild variant="ghost" size="icon-default" aria-label={t("editSrOnly")}>
                      <Link href={`/account/selling/${product.id}/edit`}>
                        <Pencil className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-default"
                          className="text-destructive hover:bg-destructive-subtle"
                          disabled={deletingId === product.id}
                          aria-label={t("deleteSrOnly")}
                        >
                          <Trash className="size-4" aria-hidden="true" />
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
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

