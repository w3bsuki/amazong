"use client"

import { useCallback, useEffect, useState } from "react"

import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

export function useNormalizedImageSrc(src?: string | null) {
  const [resolvedSrc, setResolvedSrc] = useState(() => normalizeImageUrl(src))

  useEffect(() => {
    setResolvedSrc(normalizeImageUrl(src))
  }, [src])

  const handleError = useCallback(() => {
    setResolvedSrc((current) =>
      current !== PLACEHOLDER_IMAGE_PATH ? PLACEHOLDER_IMAGE_PATH : current,
    )
  }, [])

  return { resolvedSrc, handleError }
}
