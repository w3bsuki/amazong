import { useEffect, useMemo, useState } from "react"

import type { CategoryTreeNode } from "@/lib/data/categories/types"

interface UseMobileHomeL2OptionsArgs {
  activeSubcategory: CategoryTreeNode | null
  activeL2Slug: string | null
  setActiveL2Slug: (slug: string | null) => void
}

export function useMobileHomeL2Options({
  activeSubcategory,
  activeL2Slug,
  setActiveL2Slug,
}: UseMobileHomeL2OptionsArgs) {
  const [options, setOptions] = useState<CategoryTreeNode[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!activeSubcategory) {
      setOptions([])
      setIsLoading(false)
      return
    }

    const seededChildren = activeSubcategory.children ?? []
    if (seededChildren.length > 0) {
      setOptions(seededChildren)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    fetch(`/api/categories/${encodeURIComponent(activeSubcategory.id)}/children`, {
      method: "GET",
      credentials: "same-origin",
    })
      .then(async (response) => {
        if (!response.ok) return { children: [] }
        return (await response.json()) as { children?: CategoryTreeNode[] }
      })
      .then((payload) => {
        if (cancelled) return
        const children = Array.isArray(payload.children) ? payload.children : []
        setOptions(children)

        if (activeL2Slug && !children.some((child) => child.slug === activeL2Slug)) {
          setActiveL2Slug(null)
        }
      })
      .catch(() => {
        if (cancelled) return
        setOptions([])
        setActiveL2Slug(null)
      })
      .finally(() => {
        if (cancelled) return
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeSubcategory, activeL2Slug, setActiveL2Slug])

  const activeL2 = useMemo(() => {
    if (!activeL2Slug) return null
    return options.find((child) => child.slug === activeL2Slug) ?? null
  }, [activeL2Slug, options])

  return { options, isLoading, activeL2 }
}

