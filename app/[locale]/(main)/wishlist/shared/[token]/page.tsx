import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Link, notFound } from "@/i18n/routing"
import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, ShoppingCart } from "lucide-react";

import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Database } from "@/lib/supabase/database.types"
import { AddAllToCartButton } from "./add-all-to-cart"
import { PageShell } from "../../../../_components/page-shell"

type SharedWishlistItem = Database["public"]["Functions"]["get_shared_wishlist"]["Returns"][number]

interface SharedWishlistPageProps {
  params: Promise<{
    locale: string
    token: string
  }>
}

export async function generateMetadata({ params }: SharedWishlistPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "SharedWishlist" })
  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
  }
}

export default async function SharedWishlistPage({ params }: SharedWishlistPageProps) {
  const { token, locale } = await params
  setRequestLocale(locale)
  const supabase = await createClient()
  const t = await getTranslations({ locale, namespace: "SharedWishlist" })
  const tWishlist = await getTranslations({ locale, namespace: "Wishlist" })

  if (!supabase) {
    notFound()
  }

  // Fetch shared wishlist data
  const { data: wishlistItems, error } = await supabase
    .rpc('get_shared_wishlist', { p_share_token: token })

  if (error || !wishlistItems || wishlistItems.length === 0) {
    notFound()
  }

  // Get the wishlist metadata from first item
  const wishlistName = wishlistItems[0]?.wishlist_name || t('wishlist')
  const wishlistDescription = wishlistItems[0]?.wishlist_description
  const ownerName = wishlistItems[0]?.owner_name || t('anonymousUser')

  const productIds = (wishlistItems as SharedWishlistItem[]).map((i) => i.product_id)
  const { data: productsForLinks } = await supabase
    .from("products")
    .select("id, slug, seller:profiles!products_seller_id_fkey(username)")
    .in("id", productIds)

  type ProductWithSeller = {
    id: string
    slug: string | null
    seller: { username: string | null } | null
  }

  const canonicalById = new Map(
    (productsForLinks || []).map((p) => {
      const product = p as ProductWithSeller
      return [
        product.id,
        {
          username: product.seller?.username ?? null,
          slug: product.slug ?? null,
        },
      ]
    })
  )

  const getProductHref = (productId: string) => {
    const info = canonicalById.get(productId)
    if (!info?.username) return "#"
    return `/${info.username}/${info.slug || productId}`
  }

  return (
    <PageShell variant="muted">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="h-8 w-8 text-deal" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{wishlistName}</h1>
          </div>
          <p className="text-muted-foreground">
            {t('createdBy', { name: ownerName })}
          </p>
          {wishlistDescription && (
            <p className="mt-2 text-foreground max-w-2xl mx-auto">
              {wishlistDescription}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-4">
            {t('itemCount', { count: wishlistItems.length })}
          </p>

          <div className="mt-5 flex justify-center">
            <AddAllToCartButton
              items={(wishlistItems as SharedWishlistItem[]).map((i) => ({
                product_id: i.product_id,
                product_title: i.product_title,
                product_price: i.product_price,
                product_image: i.product_image,
              }))}
            />
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(wishlistItems as SharedWishlistItem[]).map((item) => (
            <Card
              key={item.product_id}
              className="overflow-hidden transition-colors hover:bg-hover active:bg-active hover:border-hover-border"
            >
              <Link href={getProductHref(item.product_id)}>
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={item.product_image || "/placeholder.svg"}
                    alt={item.product_title || tWishlist("unknownProduct")}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              </Link>
              <CardContent className="p-3">
                <Link 
                  href={getProductHref(item.product_id)}
                  className="text-sm font-medium text-foreground hover:text-primary line-clamp-2 min-h-10"
                >
                  {item.product_title}
                </Link>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-lg font-bold text-foreground">
                    ${item.product_price?.toFixed(2)}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="cta"
                  className="w-full mt-3"
                  asChild
                >
                  <Link href={getProductHref(item.product_id)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t('viewProduct')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center p-4 bg-surface-subtle rounded-xl border border-border-subtle">
          <h2 className="text-xl font-semibold tracking-tight mb-2">{t('createYourOwn')}</h2>
          <p className="text-muted-foreground mb-4">{t('signUpToCreate')}</p>
          <Button asChild variant="cta" className="font-medium">
            <Link href="/auth/sign-up">{t('signUpFree')}</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  )
}

