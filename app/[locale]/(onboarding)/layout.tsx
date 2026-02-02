"use client"

import type { ReactNode } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"

interface OnboardingLayoutProps {
  children: ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const locale = useLocale()
  
  return (
    <div 
      className={cn(
        "min-h-screen bg-background",
        "flex flex-col items-center justify-center",
        "p-4 sm:p-6"
      )}
    >
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
