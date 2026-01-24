"use client"

import { useEffect } from "react"
import { useHeaderOptional } from "@/components/providers/header-context"

export function AssistantHeaderSync({
  title,
  backHref = "/",
}: {
  title: string
  backHref?: string
}) {
  const header = useHeaderOptional()
  const setContextualHeader = header?.setContextualHeader

  useEffect(() => {
    if (!setContextualHeader) return

    setContextualHeader({
      title,
      backHref,
      hideActions: true,
    })

    return () => setContextualHeader(null)
  }, [setContextualHeader, title, backHref])

  return null
}
