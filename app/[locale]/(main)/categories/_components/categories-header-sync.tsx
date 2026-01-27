"use client"

import { useEffect } from "react"
import { useHeader } from "@/components/providers/header-context"

/**
 * CategoriesHeaderSync
 * 
 * Sets the contextual header title for the /categories index page.
 * Renders nothing - just syncs state to HeaderContext.
 */
export function CategoriesHeaderSync({ title }: { title: string }) {
  const { setContextualHeader } = useHeader()

  useEffect(() => {
    setContextualHeader({
      title,
      backHref: "/",
      subcategories: [],
    })
    return () => setContextualHeader(null)
  }, [title, setContextualHeader])

  return null
}
