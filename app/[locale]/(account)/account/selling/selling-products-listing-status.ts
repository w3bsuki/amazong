import type { SellingProduct, TranslateFn } from "./selling-products-list.types"

export type ListingStatus = "active" | "draft" | "sold"

export function getListingStatus(product: SellingProduct): ListingStatus {
  if (product.status === "draft" || product.status === "archived") return "draft"
  if (product.status === "out_of_stock" || product.stock === 0) return "sold"
  return "active"
}

export function getStatusBadgeProps(status: ListingStatus, t: TranslateFn) {
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
