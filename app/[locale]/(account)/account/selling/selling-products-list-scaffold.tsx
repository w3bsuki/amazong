import { Fragment, type ReactNode } from "react"

import type { BoostTimeLeft, SellingProduct, TranslateFn } from "./selling-products-list.types"
import { getListingStatus, getStatusBadgeProps, type ListingStatus } from "./selling-products-listing-status"

type StatusBadge = ReturnType<typeof getStatusBadgeProps>

export interface SellingProductListItemContext {
  product: SellingProduct
  boosted: boolean
  boostExpired: boolean
  timeLeft: BoostTimeLeft | null
  saleActive: boolean
  salePercent: number
  status: ListingStatus
  statusBadge: StatusBadge
}

interface SellingProductsListScaffoldProps {
  wrapperClassName: string
  products: SellingProduct[]
  t: TranslateFn
  isBoostActive: (product: SellingProduct) => boolean
  isBoostExpired: (product: SellingProduct) => boolean
  getBoostTimeLeft: (product: SellingProduct) => BoostTimeLeft | null
  isSaleActive: (product: SellingProduct) => boolean
  getSalePercentForDisplay: (product: SellingProduct) => number
  renderItem: (context: SellingProductListItemContext) => ReactNode
}

export function SellingProductsListScaffold({
  wrapperClassName,
  products,
  t,
  isBoostActive,
  isBoostExpired,
  getBoostTimeLeft,
  isSaleActive,
  getSalePercentForDisplay,
  renderItem,
}: SellingProductsListScaffoldProps) {
  return (
    <div className={wrapperClassName}>
      {products.map((product) => {
        const boosted = isBoostActive(product)
        const boostExpired = isBoostExpired(product)
        const timeLeft = getBoostTimeLeft(product)
        const saleActive = isSaleActive(product)
        const salePercent = getSalePercentForDisplay(product)
        const status = getListingStatus(product)
        const statusBadge = getStatusBadgeProps(status, t)

        return (
          <Fragment key={product.id}>
            {renderItem({
              product,
              boosted,
              boostExpired,
              timeLeft,
              saleActive,
              salePercent,
              status,
              statusBadge,
            })}
          </Fragment>
        )
      })}
    </div>
  )
}

