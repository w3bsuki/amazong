"use client"

import { type ReactNode } from "react"
import { useIsMobile } from "@/hooks/use-is-mobile"

interface ResponsiveHomeProps {
  mobile: ReactNode
  desktop: ReactNode
}

export function ResponsiveHome({ mobile, desktop }: ResponsiveHomeProps) {
  const isMobile = useIsMobile()

  return <div className="w-full">{isMobile ? mobile : desktop}</div>
}
