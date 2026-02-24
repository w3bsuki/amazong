"use client"

import * as React from "react"
import Image from "next/image"
import { Package } from "lucide-react"

import { Link } from "@/i18n/routing"
import { Card, CardContent } from "@/components/ui/card"
import { MarketplaceBadge } from "@/components/shared/marketplace-badge"
import { cn } from "@/lib/utils"
import { formatCurrencyAmount } from "@/lib/price"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

interface ProductMiniCardProps {
  id: string
  title: string
  price: number
  image?: string | null | undefined
  href?: string | null
  className?: string
  locale?: string
  badge?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

function MiniCardBody({
  title,
  price,
  image,
  locale,
  badge,
  className,
}: {
  title: string
  price: number
  image?: string | null | undefined
  locale: string
  badge?: React.ReactNode
  className?: string | undefined
}) {
  const imageSrc = React.useMemo(() => {
    if (!image) return null
    return normalizeImageUrl(image)
  }, [image])
  const [resolvedImageSrc, setResolvedImageSrc] = React.useState<string | null>(imageSrc)

  React.useEffect(() => {
    setResolvedImageSrc(imageSrc)
  }, [imageSrc])

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-xl border-border-subtle shadow-none",
        className
      )}
    >
      <div className="relative aspect-square bg-surface-subtle">
        {resolvedImageSrc ? (
          <Image
            src={resolvedImageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 128px, 160px"
            className="object-cover"
            onError={() => {
              if (resolvedImageSrc !== PLACEHOLDER_IMAGE_PATH) {
                setResolvedImageSrc(PLACEHOLDER_IMAGE_PATH)
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Package className="size-8" aria-hidden="true" />
          </div>
        )}
        {badge && <div className="absolute left-1.5 top-1.5 z-10">{badge}</div>}
      </div>

      <CardContent className="space-y-1.5 p-2">
        <p className="line-clamp-2 text-xs font-medium leading-tight text-foreground">{title}</p>
        <MarketplaceBadge variant="price" size="default" className="min-h-5 px-2 text-sm leading-none">
          {formatCurrencyAmount(price, locale, "BGN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </MarketplaceBadge>
      </CardContent>
    </Card>
  )
}

export function ProductMiniCard({
  title,
  price,
  image,
  href,
  className,
  locale = "en",
  badge,
  onClick,
}: ProductMiniCardProps) {
  const body = (
    <MiniCardBody
      title={title}
      price={price}
      image={image}
      locale={locale}
      badge={badge}
      className={className}
    />
  )

  if (!href) return body

  return (
    <Link href={href} prefetch={false} className="block tap-transparent" onClick={onClick}>
      {body}
    </Link>
  )
}
