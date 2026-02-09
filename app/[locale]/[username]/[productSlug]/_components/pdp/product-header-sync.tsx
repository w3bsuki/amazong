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
  const setProductHeader = header?.setProductHeader

  useEffect(() => {
    if (!setProductHeader) return

    setProductHeader({
      productTitle,
      sellerName,
      sellerUsername,
      sellerAvatarUrl,
      ...(productId !== undefined ? { productId } : {}),
      ...(productPrice !== undefined ? { productPrice } : {}),
      ...(productImage !== undefined ? { productImage } : {}),
    })

    return () => setProductHeader(null)
  }, [productTitle, sellerName, sellerUsername, sellerAvatarUrl, productId, productPrice, productImage, setProductHeader])

  return null
}
