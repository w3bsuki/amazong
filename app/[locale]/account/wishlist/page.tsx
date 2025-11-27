"use client"

import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export default function WishlistPage() {
  const { items, isLoading, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const t = useTranslations("Wishlist")

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.product_id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
    removeFromWishlist(item.product_id)
    toast.success("Moved to cart")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary py-6">
        <div className="container">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-4 h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary py-6">
        <div className="container">
          <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6" />
            {t("title")}
          </h1>
          
          <Card className="bg-card">
            <CardContent className="py-12 text-center">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t("empty")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("emptyDescription")}
              </p>
              <Button asChild className="bg-brand-blue hover:bg-brand-blue-dark text-white">
                <Link href="/search">
                  {t("startShopping")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary py-6">
      <div className="container">
        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Heart className="h-6 w-6 text-brand-deal" />
          {t("title")} ({items.length})
        </h1>

        <Card className="bg-card">
          <CardContent className="p-0">
            {items.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <Separator />}
                <div className="p-4 flex gap-4">
                  {/* Product Image */}
                  <Link href={`/product/${item.product_id}`} className="shrink-0">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-secondary rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <Link 
                      href={`/product/${item.product_id}`}
                      className="text-sm sm:text-base font-medium text-foreground hover:text-brand-blue line-clamp-2 mb-1"
                    >
                      {item.title}
                    </Link>
                    
                    <div className="text-lg font-bold text-foreground mt-1">
                      ${item.price.toFixed(2)}
                    </div>

                    <div className="text-xs text-muted-foreground mt-1">
                      {t("addedOn")} {new Date(item.created_at).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto pt-3">
                      <Button
                        size="sm"
                        onClick={() => handleMoveToCart(item)}
                        className="bg-brand-blue hover:bg-brand-blue-dark text-white text-xs"
                      >
                        <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                        {t("moveToCart")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromWishlist(item.product_id)}
                        className="text-muted-foreground hover:text-brand-deal hover:border-brand-deal text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        {t("remove")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Add All to Cart Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => {
              items.forEach(item => {
                addToCart({
                  id: item.product_id,
                  title: item.title,
                  price: item.price,
                  image: item.image,
                  quantity: 1,
                })
              })
              toast.success(`Added ${items.length} items to cart`)
            }}
            className="bg-brand hover:bg-brand-dark text-foreground"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t("addAllToCart")}
          </Button>
        </div>
      </div>
    </div>
  )
}
