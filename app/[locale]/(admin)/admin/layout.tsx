import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { requireAdmin } from "@/lib/auth/admin"
import { connection } from "next/server"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ensure dynamic rendering
  await connection()
  
  // This will redirect non-admins to home page
  const adminUser = await requireAdmin("/")

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar 
        variant="inset" 
        user={{
          name: adminUser.full_name || adminUser.email,
          email: adminUser.email,
          avatar: "/avatars/admin.jpg",
        }}
      />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
