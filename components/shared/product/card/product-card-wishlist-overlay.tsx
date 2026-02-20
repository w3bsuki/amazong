import { ProductCardActions } from "./actions"

interface ProductCardWishlistOverlayProps {
  id: string
  title: string
  price: number
  image: string
  slug: string | null | undefined
  username: string | null | undefined
  inStock: boolean
  isOwnProduct: boolean
  overlayDensity?: "compact"
}

export function ProductCardWishlistOverlay({
  id,
  title,
  price,
  image,
  slug,
  username,
  inStock,
  isOwnProduct,
  overlayDensity,
}: ProductCardWishlistOverlayProps) {
  return (
    <div className="absolute right-1.5 top-1.5 z-20">
      <ProductCardActions
        id={id}
        title={title}
        price={price}
        image={image}
        slug={slug ?? null}
        username={username ?? null}
        showQuickAdd={false}
        showWishlist
        inStock={inStock}
        isOwnProduct={isOwnProduct}
        size="icon-compact"
        {...(overlayDensity ? { overlayDensity } : {})}
      />
    </div>
  )
}

