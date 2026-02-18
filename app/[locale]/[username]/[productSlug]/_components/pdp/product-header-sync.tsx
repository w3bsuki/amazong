"use client"

import { useEffect } from "react"

import { useHeaderOptional } from "@/components/providers/header-context"

export function ProductHeaderSync({
  productTitle,
  sellerName,
  sellerUsername,
  sellerAvatarUrl,
  productId,
  productPrice,
  productImage,
}: {
  productTitle: string | null
  sellerName: string | null
  sellerUsername: string | null
  sellerAvatarUrl: string | null
  productId?: string | null
  productPrice?: number | null
  productImage?: string | null
}) {
  const header = useHeaderOptional()
  const setHeaderState = header?.setHeaderState

  useEffect(() => {
    if (!setHeaderState) return

    setHeaderState({
      type: "product",
      value: {
        productTitle,
        sellerName,
        sellerUsername,
        sellerAvatarUrl,
        ...(productId !== undefined ? { productId } : {}),
        ...(productPrice !== undefined ? { productPrice } : {}),
        ...(productImage !== undefined ? { productImage } : {}),
      },
    })

    return () => setHeaderState(null)
  }, [productTitle, sellerName, sellerUsername, sellerAvatarUrl, productId, productPrice, productImage, setHeaderState])

  return null
}
