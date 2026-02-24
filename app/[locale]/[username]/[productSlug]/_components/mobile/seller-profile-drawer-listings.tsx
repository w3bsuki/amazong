import { useEffect, useState } from "react"
import Image from "next/image"
import { Package } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { useRouter } from "@/i18n/routing"
import { formatCurrencyAmount } from "@/lib/price"
import { normalizeOptionalImageUrl } from "@/lib/normalize-image-url"
import type { SellerProduct } from "./seller-profile-drawer.types"

type SellerListingsProps = {
  products: SellerProduct[]
  sellerUsername: string | null
  onClose: () => void
}

function SellerProductCard({
  product,
  locale,
  onClick,
}: {
  product: SellerProduct
  locale: string
  onClick: () => void
}) {
  const [resolvedImageSrc, setResolvedImageSrc] = useState(() =>
    normalizeOptionalImageUrl(product.image)
  )
  const formattedPrice = formatCurrencyAmount(product.price, locale, "EUR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  useEffect(() => {
    setResolvedImageSrc(normalizeOptionalImageUrl(product.image))
  }, [product.image])

  return (
    <button
      onClick={onClick}
      className="shrink-0 w-28 rounded-lg border border-border-subtle bg-card overflow-hidden text-left transition-colors hover:bg-hover"
    >
      <div className="aspect-square relative bg-muted">
        {resolvedImageSrc ? (
          <Image
            src={resolvedImageSrc}
            alt={product.title}
            fill
            sizes="112px"
            className="object-cover"
            onError={() => setResolvedImageSrc(null)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="size-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-bold text-foreground">{formattedPrice}</p>
        <p className="text-2xs text-muted-foreground line-clamp-1 mt-0.5">{product.title}</p>
      </div>
    </button>
  )
}

export function SellerListings({ products, sellerUsername, onClose }: SellerListingsProps) {
  const t = useTranslations("Product")
  const locale = useLocale()
  const router = useRouter()

  if (!products || products.length === 0) return null

  const getProductHref = (product: SellerProduct) => {
    const resolvedSellerSlug = product.storeSlug || sellerUsername
    const resolvedProductSlug = product.slug || product.id
    return resolvedSellerSlug ? `/${resolvedSellerSlug}/${resolvedProductSlug}` : "#"
  }

  const handleProductClick = (href: string) => {
    onClose()
    router.push(href)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {t("moreFromSeller")}
      </h3>

      <div className="-mx-inset flex gap-2 overflow-x-auto px-inset pb-2 hide-scrollbar">
        {products.slice(0, 8).map((product) => (
          <SellerProductCard
            key={product.id}
            product={product}
            locale={locale}
            onClick={() => handleProductClick(getProductHref(product))}
          />
        ))}
      </div>
    </div>
  )
}
