
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import {
  Save as FloppyDisk,
  Zap as Lightning,
  Package,
} from "lucide-react"
import { BoostDialog } from "../../../../_components/seller/boost-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EditableProduct } from "./edit-product.types"

type EditProductSidebarSectionProps = {
  product: EditableProduct | null
  title: string
  isOnSale: boolean
  discountPercent: number
  price: string
  originalPrice: string
  locale: string
  productId: string
  sellerUsername: string | null
  isSaving: boolean
  onSave: () => void
  formatCurrency: (value: number) => string
}

export function EditProductSidebarSection({
  product,
  title,
  isOnSale,
  discountPercent,
  price,
  originalPrice,
  locale,
  productId,
  sellerUsername,
  isSaving,
  onSave,
  formatCurrency,
}: EditProductSidebarSectionProps) {
  const t = useTranslations("SellerManagement")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("selling.edit.sidebar.previewTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-4">
            {product?.images?.[0] ? (
              <Image src={product.images[0]} alt={title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="size-12 text-muted-foreground" />
              </div>
            )}
            {isOnSale && discountPercent > 0 && (
              <div className="absolute top-2 left-2 bg-deal text-deal-foreground text-xs font-bold px-2 py-1 rounded">
                -{discountPercent}%
              </div>
            )}
          </div>
          <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
          <div className="mt-2">
            {isOnSale && originalPrice ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-deal">{formatCurrency(Number.parseFloat(price || "0"))}</span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(Number.parseFloat(originalPrice))}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold">{formatCurrency(Number.parseFloat(price || "0"))}</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightning className="size-5 text-primary" />
            {t("selling.edit.sidebar.boostTitle")}
          </CardTitle>
          <CardDescription>{t("selling.edit.sidebar.boostDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {product ? (
            <BoostDialog
              product={{
                id: product.id,
                title: product.title,
                ...(product.is_boosted != null ? { is_boosted: product.is_boosted } : {}),
                boost_expires_at: product.boost_expires_at,
              }}
              locale={locale}
            />
          ) : null}
        </CardContent>
      </Card>

      <Button onClick={onSave} disabled={isSaving} className="w-full gap-2" size="lg">
        <FloppyDisk className="size-5" />
        {isSaving ? t("selling.edit.actions.saving") : t("selling.edit.actions.save")}
      </Button>

      <Button variant="outline" className="w-full" asChild>
        <Link href={sellerUsername ? `/${sellerUsername}/${product?.slug || productId}` : "/account/selling"}>
          {t("selling.edit.actions.viewProduct")}
        </Link>
      </Button>
    </div>
  )
}
