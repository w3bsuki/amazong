"use client"

import * as React from "react"

import type { buildQuickViewProduct } from "./metadata"

type QuickViewPayloadInput = Parameters<typeof buildQuickViewProduct>[0]

export function useProductCardQuickViewInput(input: QuickViewPayloadInput) {
  const {
    id,
    title,
    price,
    image,
    images,
    originalPrice,
    description,
    categoryPath,
    condition,
    location,
    freeShipping,
    rating,
    reviews,
    inStock,
    slug,
    username,
    sellerId,
    sellerName,
    sellerAvatarUrl,
    sellerVerified,
    includeFreeShipping,
  } = input

  return React.useMemo(
    () => ({
      id,
      title,
      price,
      image,
      images,
      originalPrice,
      description,
      categoryPath,
      condition,
      location,
      freeShipping,
      rating,
      reviews,
      inStock,
      slug,
      username,
      sellerId,
      sellerName,
      sellerAvatarUrl,
      sellerVerified,
      includeFreeShipping,
    }),
    [
      categoryPath,
      condition,
      description,
      freeShipping,
      id,
      image,
      images,
      includeFreeShipping,
      inStock,
      location,
      originalPrice,
      price,
      rating,
      reviews,
      sellerAvatarUrl,
      sellerId,
      sellerName,
      sellerVerified,
      slug,
      title,
      username,
    ]
  )
}

