import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Link } from "@/i18n/routing"

import type { Seller } from "../_lib/top-sellers-types"

export default function SellersGrid({
  sellers,
  locale,
}: {
  sellers: Seller[]
  locale: string
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {sellers.map((seller) => (
        <Link href={`/search?seller=${seller.id}`} key={seller.id}>
          <Card className="h-full cursor-pointer border-border rounded-lg overflow-hidden group">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="size-14 rounded-full bg-brand flex items-center justify-center text-white font-bold text-xl shrink-0 overflow-hidden">
                  {seller.avatar_url ? (
                    <Image
                      src={seller.avatar_url}
                      alt={seller.store_name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    seller.store_name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {seller.store_name}
                    </h3>
                    {seller.verified && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-1.5 py-0 shrink-0"
                      >
                        {locale === "bg" ? "Потвърден" : "Verified"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {locale === "bg" ? "Член от" : "Member since"}{" "}
                    {new Date(seller.created_at).toLocaleDateString(
                      locale === "bg" ? "bg-BG" : "en-US",
                      {
                        year: "numeric",
                        month: "short",
                      }
                    )}
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
                  <span className="font-medium text-foreground">{seller.product_count}</span>
                  <span>{locale === "bg" ? "продукта" : "products"}</span>
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
      ))}
    </div>
  )
}
