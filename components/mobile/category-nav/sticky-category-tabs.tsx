"use client"

import { useEffect, useState } from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { CategoryTabs } from "./category-tabs"

interface StickyCategoryTabsProps {
  categories: CategoryTreeNode[]
  locale: string
  /** Which tab is active. Use "all" for /categories index. */
  activeTab?: string
}

export function StickyCategoryTabs({
  categories,
  locale,
  activeTab = "all",
}: StickyCategoryTabsProps) {
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const header = document.querySelector("header")

    const update = () => {
      if (!(header instanceof HTMLElement)) {
        setHeaderHeight(0)
        return
      }

      const headerPosition = getComputedStyle(header).position
      setHeaderHeight(
        headerPosition === "fixed" || headerPosition === "sticky"
          ? header.offsetHeight
          : 0
      )
    }

    update()

    const ro =
      header && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => update())
        : null

    if (ro && header) ro.observe(header)

    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("resize", update)
      ro?.disconnect()
    }
  }, [])

  return (
    <CategoryTabs
      categories={categories}
      activeTab={activeTab}
      locale={locale}
      headerHeight={headerHeight}
      tabsNavigateToPages={true}
      onTabChange={() => {}}
    />
  )
}
