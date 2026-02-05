import * as React from "react"
import { cn } from "@/lib/utils"
import { AppHeader } from "@/components/app/app-header"
import { BottomNav } from "@/components/navigation/bottom-nav"

export function AppShell({
  children,
  activeTab,
}: {
  children: React.ReactNode
  activeTab: string
}) {
  return (
    <div className={cn("min-h-dvh bg-background text-foreground")}>
      <AppHeader />
      <main className="mx-auto max-w-screen-sm">{children}</main>
      <BottomNav activeKey={activeTab} />
    </div>
  )
}
