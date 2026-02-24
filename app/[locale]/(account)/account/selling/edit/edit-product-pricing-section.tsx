"use client"

import { useTranslations } from "next-intl"
import {
  CircleDollarSign as CurrencyCircleDollar,
  Percent,
  Tag,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

type EditProductPricingSectionProps = {
  isOnSale: boolean
  setIsOnSale: (value: boolean) => void
  price: string
  setPrice: (value: string) => void
  originalPrice: string
  setOriginalPrice: (value: string) => void
  saleEndDateLocal: string
  setSaleEndDateLocal: (value: string) => void
  discountPercent: number
}

export function EditProductPricingSection({
  isOnSale,
  setIsOnSale,
  price,
  setPrice,
  originalPrice,
  setOriginalPrice,
  saleEndDateLocal,
  setSaleEndDateLocal,
  discountPercent,
}: EditProductPricingSectionProps) {
  const t = useTranslations("SellerManagement")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CurrencyCircleDollar className="size-5" />
          {t("selling.edit.sections.pricingDiscount")}
        </CardTitle>
        <CardDescription>{t("selling.edit.sections.pricingDiscountDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="price">
            {isOnSale ? t("selling.edit.fields.price.saleLabel") : t("selling.edit.fields.price.label")} (EUR)
          </Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={isOnSale ? "border-success focus:ring-success" : ""}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-destructive-subtle flex items-center justify-center">
              <Percent className="size-5 text-deal" />
            </div>
            <div>
              <Label htmlFor="sale-toggle" className="text-base font-medium cursor-pointer">
                {t("selling.edit.sale.toggleLabel")}
              </Label>
              <p className="text-sm text-muted-foreground">{t("selling.edit.sale.toggleDescription")}</p>
            </div>
          </div>
          <Switch id="sale-toggle" checked={isOnSale} onCheckedChange={setIsOnSale} />
        </div>

        {isOnSale && (
          <div className="space-y-4 p-4 bg-destructive-subtle border border-destructive rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="originalPrice" className="text-deal font-medium">
                {t("selling.edit.fields.originalPrice.label")} (EUR)
              </Label>
              <Input
                id="originalPrice"
                type="number"
                min="0"
                step="0.01"
                value={originalPrice}
                onChange={(event) => setOriginalPrice(event.target.value)}
                placeholder={t("selling.edit.fields.originalPrice.placeholder")}
              />
            </div>

            {discountPercent > 0 && (
              <div className="flex items-center gap-2 p-3 bg-destructive-subtle rounded-md">
                <Tag className="size-4 text-deal" />
                <span className="text-sm font-medium text-deal">
                  {t("selling.edit.sale.discountPreview", { percent: discountPercent })}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="saleEndDate" className="text-deal font-medium">
                {t("selling.edit.fields.saleEndDate.label")}
              </Label>
              <Input
                id="saleEndDate"
                type="datetime-local"
                value={saleEndDateLocal}
                onChange={(event) => setSaleEndDateLocal(event.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
