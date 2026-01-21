"use client"

import { useEffect } from "react"

import { useHeaderOptional } from "@/components/providers/header-context"

export function ProductHeaderSync({
  productTitle,
  sellerName,
  sellerUsername,
  sellerAvatarUrl,
}: {
  productTitle: string | null
  sellerName: string | null
  sellerUsername: string | null
  sellerAvatarUrl: string | null
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
    })

    return () => setProductHeader(null)
  }, [productTitle, sellerName, sellerUsername, sellerAvatarUrl, setProductHeader])

  return null
}

