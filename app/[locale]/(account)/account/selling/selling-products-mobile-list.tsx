import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BoostDialog } from "../../../_components/seller/boost-dialog"
import { Package, Pencil, Zap as Lightning } from "lucide-react"

import { cn } from "@/lib/utils"
import type { SellingProductsListCommonProps } from "./selling-products-list.types"
import { SellingProductDeleteDialog } from "./selling-product-delete-dialog"
import { SellingProductsListScaffold } from "./selling-products-list-scaffold"

type SellingProductsMobileListProps = SellingProductsListCommonProps

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
    <SellingProductsListScaffold
      wrapperClassName="space-y-3 md:hidden"
      products={products}
      t={t}
      isBoostActive={isBoostActive}
      isBoostExpired={isBoostExpired}
      getBoostTimeLeft={getBoostTimeLeft}
      isSaleActive={isSaleActive}
      getSalePercentForDisplay={getSalePercentForDisplay}
      renderItem={({ product, boosted, boostExpired, timeLeft, saleActive, salePercent, statusBadge }) => (
        <div
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

                    <SellingProductDeleteDialog
                      productId={product.id}
                      productTitle={product.title}
                      t={t}
                      onDelete={onDelete}
                      disabled={deletingId === product.id}
                      buttonSize="icon-default"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    />
  )
}

