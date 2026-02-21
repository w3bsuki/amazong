"use client"

import { useCallback, useEffect } from "react"

import { useHeader } from "@/components/providers/header-context"
import { useRouter } from "@/i18n/routing"

export function StaticPageHeaderSync({
  title,
  backHref = "/",
  hideActions = true,
}: {
  title: string
  backHref?: string
  hideActions?: boolean
}) {
  const { setHeaderState } = useHeader()
  const router = useRouter()

  const handleBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }

    router.push(backHref)
  }, [backHref, router])

  useEffect(() => {
    setHeaderState({
      type: "contextual",
      value: {
        title,
        backHref,
        onBack: handleBack,
        subcategories: [],
        hideActions,
      },
    })

    return () => setHeaderState(null)
  }, [backHref, handleBack, hideActions, setHeaderState, title])

  return null
}

