"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"

import { useHeader } from "@/components/providers/header-context"
import { useRouter } from "@/i18n/routing"

export function SearchHeaderSync({
  query,
  categorySlug,
}: {
  query: string
  categorySlug?: string | null
}) {
  const { setHeaderState } = useHeader()
  const router = useRouter()
  const tSearch = useTranslations("SearchOverlay")

  useEffect(() => {
    const trimmedQuery = query.trim()

    setHeaderState({
      type: "contextual",
      value: {
        title: trimmedQuery.length > 0 ? trimmedQuery : tSearch("search"),
        backHref: "/",
        onBack: () => router.back(),
        ...(categorySlug ? { activeSlug: categorySlug } : {}),
        subcategories: [],
      },
    })

    return () => setHeaderState(null)
  }, [categorySlug, query, router, setHeaderState, tSearch])

  return null
}

