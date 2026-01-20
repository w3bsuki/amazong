"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AccountSidebar } from "./account/_components/account-sidebar"
import { AccountHeader } from "./account/_components/account-header"
import { AccountTabBar } from "./account/_components/account-tab-bar"
import type { PlansModalServerActions } from "./account/_components/plans-modal"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/layout/sidebar/sidebar"

interface AccountLayoutContentProps {
  children: React.ReactNode
  modal: React.ReactNode
  initialUser?: {
    email?: string
    fullName?: string
  }
  plansModalActions: PlansModalServerActions
}

export function AccountLayoutContent({
  children,
  modal,
  initialUser,
  plansModalActions,
}: AccountLayoutContentProps) {
  const [email, setEmail] = useState<string>(initialUser?.email ?? "")
  const [fullName, setFullName] = useState<string>(initialUser?.fullName ?? "")

  useEffect(() => {
    async function getUser() {
      try {
        const supabase = createClient()
        const result = await Promise.race([
          supabase.auth.getUser(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
        ])

        const user = result && "data" in result ? result.data.user : null
        if (user?.email) {
          setEmail(user.email)
          setFullName(user.user_metadata?.full_name || "")
        }
      } catch {
        // Best-effort only; server layout already validated auth.
      }
    }
    getUser()
  }, [])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AccountSidebar
        variant="inset"
        user={{
          name: fullName,
          email: email,
        }}
        plansModalActions={plansModalActions}
      />
      <SidebarInset>
        <AccountHeader />
        <div className="flex flex-1 flex-col bg-account-section-bg min-h-0">
          <div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 pb-20 lg:px-6 lg:py-6 lg:pb-6">
            {children}
          </div>
        </div>
        {/* Mobile Tab Bar */}
        <AccountTabBar />
      </SidebarInset>
      
      {/* Modal Slot - for intercepted routes */}
      {modal}
    </SidebarProvider>
  )
}
