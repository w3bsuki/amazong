"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AccountSidebar } from "@/components/account-sidebar"
import { AccountHeader } from "@/components/account-header"
import { AccountTabBar } from "@/components/account-tab-bar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface AccountLayoutContentProps {
  children: React.ReactNode
  modal: React.ReactNode
}

export function AccountLayoutContent({ children, modal }: AccountLayoutContentProps) {
  const [email, setEmail] = useState<string>("")
  const [fullName, setFullName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setEmail(user.email)
        setFullName(user.user_metadata?.full_name || "")
      }
      setIsLoading(false)
    }
    getUser()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-account-section-bg">
        <div className="size-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    )
  }

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
