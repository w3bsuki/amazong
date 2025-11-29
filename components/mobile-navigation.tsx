"use client"

import { useRef } from "react"
import { MobileTabBar } from "@/components/mobile-tab-bar"
import { MobileMenuSheet, MobileMenuSheetHandle } from "@/components/mobile-menu-sheet"

interface MobileNavigationProps {
  locale?: string
}

export function MobileNavigation({ locale = "en" }: MobileNavigationProps) {
  const menuSheetRef = useRef<MobileMenuSheetHandle>(null)

  const handleMenuClick = () => {
    menuSheetRef.current?.open()
  }

  return (
    <>
      <MobileTabBar 
        locale={locale} 
        onMenuClick={handleMenuClick}
      />
      <MobileMenuSheet ref={menuSheetRef} />
    </>
  )
}
