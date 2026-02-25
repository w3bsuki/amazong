"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { useCart } from "@/components/providers/cart-context"
import { createClient } from "@/lib/supabase/client"
import type { AccountWishlistGridProps, WishlistItem } from "./account-wishlist.types"

import type { WishlistGridLabels } from "./account-wishlist-grid/account-wishlist-grid.types"
import { WishlistAddAllButtons } from "./account-wishlist-grid/wishlist-add-all-buttons"
import { WishlistDesktopGrid } from "./account-wishlist-grid/wishlist-desktop-grid"
import { WishlistEmptyState } from "./account-wishlist-grid/wishlist-empty-state"
import { WishlistMobileGrid } from "./account-wishlist-grid/wishlist-mobile-grid"

import { logger } from "@/lib/logger"
export function AccountWishlistGrid({ items, locale, onRemove }: AccountWishlistGridProps) {
  const t = useTranslations("Wishlist")
  const { addToCart } = useCart()
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(value)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })

  const handleMoveToCart = async (item: WishlistItem) => {
    if (item.stock <= 0) {
      toast.error(locale === "bg" ? "Продуктът е изчерпан" : "Product is out of stock")
      return
    }

    addToCart({
      id: item.product_id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    })

    await handleRemove(item.product_id)
    toast.success(locale === "bg" ? "Преместено в количката" : "Moved to cart")
    setSelectedItem(null)
  }

  const handleRemove = async (productId: string) => {
    setRemovingId(productId)
    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error(locale === "bg" ? "Моля, влезте в профила си" : "Please sign in")
        return
      }

      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId)

      if (error) throw error
      onRemove(productId)
      toast.success(locale === "bg" ? "Премахнато от любими" : "Removed from wishlist")
    } catch (error) {
      logger.error("[account-wishlist] remove_item_failed", error)
      toast.error(locale === "bg" ? "Грешка при премахване" : "Failed to remove")
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddAllToCart = () => {
    const inStockItems = items.filter((item) => item.stock > 0)
    if (inStockItems.length === 0) {
      toast.error(locale === "bg" ? "Няма налични продукти" : "No items in stock")
      return
    }

    inStockItems.forEach((item) => {
      addToCart({
        id: item.product_id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: 1,
      })
    })
    toast.success(
      locale === "bg"
        ? `Добавени ${inStockItems.length} артикула в количката`
        : `Added ${inStockItems.length} items to cart`
    )
  }

  const labels: WishlistGridLabels = {
    addedOn: locale === "bg" ? "Добавено на" : "Added on",
    price: locale === "bg" ? "Цена" : "Price",
    availability: locale === "bg" ? "Наличност" : "Availability",
    inStock: locale === "bg" ? "в наличност" : "in stock",
    outOfStock: locale === "bg" ? "Продадено" : "Sold",
    moveToCart: locale === "bg" ? "В количката" : "Add to Cart",
    viewProduct: locale === "bg" ? "Виж" : "View",
    remove: locale === "bg" ? "Премахни" : "Remove",
    addAllToCart: locale === "bg" ? "Добави всички в количката" : "Add All to Cart",
  }

  if (items.length === 0) {
    return (
      <WishlistEmptyState
        title={t("empty")}
        description={t("emptyDescription")}
        startShoppingLabel={t("startShopping")}
      />
    )
  }

  return (
    <>
      <WishlistMobileGrid
        items={items}
        locale={locale}
        labels={labels}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        removingId={removingId}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        handleMoveToCart={handleMoveToCart}
        handleRemove={handleRemove}
      />

      <WishlistDesktopGrid
        items={items}
        locale={locale}
        labels={labels}
        removingId={removingId}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        handleMoveToCart={handleMoveToCart}
        handleRemove={handleRemove}
      />

      <WishlistAddAllButtons items={items} labels={labels} handleAddAllToCart={handleAddAllToCart} />
    </>
  )
}
