"use client"

import { 
  GridFour, 
  ChatCircleText
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export type StoreTab = "products" | "reviews"

interface StoreTabsProps {
  activeTab: StoreTab
  onTabChange: (tab: StoreTab) => void
  productCount: number
  reviewCount: number
  locale: string
}

export function StoreTabs({ 
  activeTab, 
  onTabChange, 
  productCount,
  reviewCount,
  locale 
}: StoreTabsProps) {
  const tabs = [
    {
      id: "products" as StoreTab,
      icon: GridFour,
      label: locale === "bg" ? "Продукти" : "Products",
      count: productCount,
    },
    {
      id: "reviews" as StoreTab,
      icon: ChatCircleText,
      label: locale === "bg" ? "Отзиви" : "Reviews",
      count: reviewCount,
    },
  ]

  return (
    <div className="border-t bg-background sticky top-12 md:top-14 z-10">
      {/* Mobile - Instagram style icon tabs */}
      <div className="md:hidden flex border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-3 relative transition-colors min-h-touch active:bg-accent/50",
                isActive 
                  ? "text-foreground" 
                  : "text-muted-foreground"
              )}
            >
              <Icon 
                weight={isActive ? "fill" : "regular"} 
                className="size-5"
              />
              <span className="text-[10px] font-medium">{tab.count}</span>
              {/* Active indicator - use primary color */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          )
        })}
      </div>
      
      {/* Desktop - Text tabs - centered layout */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex border-b -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 relative transition-colors font-medium border-b-2 -mb-px hover:bg-accent/30",
                    isActive 
                      ? "text-foreground border-primary" 
                      : "text-muted-foreground hover:text-foreground border-transparent"
                  )}
                >
                  <Icon 
                    weight={isActive ? "fill" : "regular"} 
                    className="size-5"
                  />
                  <span>{tab.label}</span>
                  <span className={cn(
                    "text-sm tabular-nums",
                    isActive ? "text-foreground/70" : "text-muted-foreground"
                  )}>({tab.count})</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
