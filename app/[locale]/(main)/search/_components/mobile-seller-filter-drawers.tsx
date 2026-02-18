import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { FilterCheckboxItem } from "@/components/shared/filters/controls/filter-checkbox-item"
import { FilterRadioGroup, FilterRadioItem } from "../../_components/filters/shared/controls/filter-radio-group"
import type { SellerSortKey } from "../_lib/types"

type Translate = (key: string, values?: Record<string, string | number | Date>) => string

export function MobileSellerSortDrawer({
  open,
  onOpenChange,
  currentSort,
  applySort,
  t,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentSort: SellerSortKey
  applySort: (sort: SellerSortKey) => void
  t: Translate
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent aria-label={t("sellerSort")}>
        <DrawerHeader className="border-b border-border-subtle px-inset py-3">
          <DrawerTitle className="text-base font-semibold">{t("sellerSort")}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="px-0">
          <FilterRadioGroup value={currentSort} onValueChange={(value) => applySort(value as SellerSortKey)}>
            <FilterRadioItem value="products" fullBleed>
              {t("sortSellerProducts")}
            </FilterRadioItem>
            <FilterRadioItem value="rating" fullBleed>
              {t("sortSellerRating")}
            </FilterRadioItem>
            <FilterRadioItem value="newest" fullBleed>
              {t("sortSellerNewest")}
            </FilterRadioItem>
          </FilterRadioGroup>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export function MobileSellerFilterDrawer({
  open,
  onOpenChange,
  pendingVerified,
  setPendingVerified,
  pendingRating,
  setPendingRating,
  pendingListings,
  setPendingListings,
  clearFilters,
  applyFilters,
  applyLabel,
  t,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingVerified: boolean
  setPendingVerified: (value: boolean) => void
  pendingRating: number
  setPendingRating: (value: number) => void
  pendingListings: number
  setPendingListings: (value: number) => void
  clearFilters: () => void
  applyFilters: () => void
  applyLabel: string
  t: Translate
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent aria-label={t("sellerFilters")}>
        <DrawerHeader className="border-b border-border-subtle px-inset py-3">
          <DrawerTitle className="text-base font-semibold">{t("sellerFilters")}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="px-0 pb-safe-max">
          <div className="-mx-inset">
            <FilterCheckboxItem
              checked={pendingVerified}
              onCheckedChange={(checked) => setPendingVerified(Boolean(checked))}
              fullBleed
            >
              {t("verifiedSellers")}
            </FilterCheckboxItem>

            <div className="border-t border-border-subtle px-inset py-2">
              <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("minSellerRating")}
              </p>
              <FilterRadioGroup
                value={String(pendingRating)}
                onValueChange={(value) => setPendingRating(Number(value))}
                className="rounded-xl border border-border-subtle"
              >
                <FilterRadioItem value="0">{t("anyRating")}</FilterRadioItem>
                <FilterRadioItem value="4">{t("rating4Plus")}</FilterRadioItem>
                <FilterRadioItem value="4.5">{t("rating45Plus")}</FilterRadioItem>
              </FilterRadioGroup>
            </div>

            <div className="border-t border-border-subtle px-inset py-2">
              <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("minSellerListings")}
              </p>
              <FilterRadioGroup
                value={String(pendingListings)}
                onValueChange={(value) => setPendingListings(Number(value))}
                className="rounded-xl border border-border-subtle"
              >
                <FilterRadioItem value="0">{t("anyListings")}</FilterRadioItem>
                <FilterRadioItem value="5">{t("listings5Plus")}</FilterRadioItem>
                <FilterRadioItem value="10">{t("listings10Plus")}</FilterRadioItem>
                <FilterRadioItem value="20">{t("listings20Plus")}</FilterRadioItem>
              </FilterRadioGroup>
            </div>
          </div>
        </DrawerBody>
        <DrawerFooter className="border-t border-border-subtle px-inset py-2">
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={clearFilters}>
              {t("clear")}
            </Button>
            <Button type="button" onClick={applyFilters}>
              {applyLabel}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
