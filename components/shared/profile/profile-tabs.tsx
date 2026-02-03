"use client"

import type { ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProfileTab {
  value: string
  label: string
  count?: number
  icon?: ReactNode
  content: ReactNode
}

interface ProfileTabsProps {
  tabs: ProfileTab[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

/**
 * ProfileTabs - Clean segmented tab control
 * 
 * Features:
 * - Full-width grid layout
 * - Clean card background with border
 * - Icons + labels always visible for clarity
 */
export function ProfileTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
}: ProfileTabsProps) {
  const activeValue = value ?? defaultValue ?? tabs[0]?.value

  return (
    <Tabs
      value={activeValue}
      {...(onValueChange && { onValueChange })}
      className={cn("w-full px-4", className)}
    >
      <TabsList className={cn(
        "w-full bg-card border border-border h-14 sm:h-11",
        tabs.length === 4 && "grid grid-cols-4",
        tabs.length === 3 && "grid grid-cols-3",
        tabs.length === 2 && "grid grid-cols-2",
        (tabs.length < 2 || tabs.length > 4) && "grid grid-cols-4"
      )}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "h-full",
              "flex flex-col sm:flex-row",
              "gap-0.5 sm:gap-1.5",
              "px-1 sm:px-2",
              "py-1",
              "text-2xs sm:text-xs",
              "leading-tight",
              "min-w-0 overflow-hidden",
              "whitespace-normal sm:whitespace-nowrap",
              "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            )}
          >
            {tab.icon}
            <span className="w-full text-center line-clamp-2 sm:line-clamp-1">
              {tab.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-4 outline-none"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
