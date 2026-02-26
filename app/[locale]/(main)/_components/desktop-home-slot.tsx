"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

import type { DesktopHomeProps } from "./desktop/desktop-home.types"

const DesktopHome = dynamic(() => import("./desktop-home").then((mod) => mod.DesktopHome), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-surface-subtle" />,
})

export function DesktopHomeSlot(props: DesktopHomeProps) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)")
    const update = () => setIsDesktop(query.matches)

    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  if (!isDesktop) return null
  return <DesktopHome {...props} />
}

