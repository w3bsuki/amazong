"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useLocale, useTranslations } from "next-intl"

export type SellersGridSeller = {
  id: string
  username: string | null
  store_name: string
  description: string | null
  verified: boolean
  created_at: string
  product_count: number
  total_rating: number | null
  avatar_url: string | null
}

export default function SellersGrid({
  sellers,
}: {
  sellers: SellersGridSeller[]
}) {
  const tSeller = useTranslations("Seller")
  const tDirectory = useTranslations("SellersDirectory")
  const locale = useLocale()

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {sellers.map((seller) => {
        const href = seller.username ? `/${seller.username}` : `/search?seller=${seller.id}`

        return (
          <Link href={href} key={seller.id}>
            <Card className="h-full cursor-pointer border-border rounded-lg overflow-hidden group">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <UserAvatar
                    name={seller.store_name}
                    avatarUrl={seller.avatar_url ?? null}
                    className="size-14 shrink-0"
                    fallbackClassName="font-semibold"
                  />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {seller.store_name}
                    </h3>
                    {seller.verified && (
                      <Badge
                        variant="success-subtle"
                        className="shrink-0"
                      >
                        {tSeller("verified")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tSeller("memberSince", {
                      date: new Intl.DateTimeFormat(locale, { year: "numeric", month: "short" }).format(
                        new Date(seller.created_at)
                      ),
                    })}
                  </p>
                </div>
              </div>

              {seller.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {seller.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span className="font-medium text-foreground">
                    {tDirectory("productsCount", { count: seller.product_count })}
                  </span>
                </div>
                {seller.total_rating && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <svg className="size-4 text-rating fill-current" viewBox="0 0 256 256">
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34L128,200.26,76.93,229.68a16,16,0,0,1-23.84-17.34l13.51-58.6L21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z" />
                    </svg>
                    <span className="font-medium text-foreground">{seller.total_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </Link>
        )
      })}
    </div>
  )
}
