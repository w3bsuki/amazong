"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"

import { useHeader } from "@/components/providers/header-context"
import { useRouter } from "@/i18n/routing"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"
import { MobileWishlistButton } from "@/components/shared/wishlist/mobile-wishlist-button"
import { SearchBarPill } from "./search-bar-pill"

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
    setHeaderState({
      type: "contextual",
      value: {
        title: <SearchBarPill query={query} />,
        backHref: "/",
        onBack: () => router.back(),
        ...(categorySlug ? { activeSlug: categorySlug } : {}),
        subcategories: [],
        expandTitle: true,
        trailingActions: (
          <>
            <MobileWishlistButton />
            <MobileCartDropdown />
          </>
        ),
      },
    })

    return () => setHeaderState(null)
  }, [categorySlug, query, router, setHeaderState, tSearch])

  return null
}

