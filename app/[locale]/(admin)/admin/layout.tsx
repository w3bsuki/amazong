import { AdminSidebar } from "../_components/admin-sidebar"
import { DashboardHeader } from "../_components/dashboard-header"
import { setRequestLocale } from "next-intl/server"
import { requireAdmin } from "@/lib/auth/admin"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/layout/sidebar/sidebar"
import { FullRouteIntlProvider } from "../../_providers/route-intl-provider"

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  // This will redirect non-admins to home page
  const adminUser = await requireAdmin("/")

  return (
    <FullRouteIntlProvider locale={locale}>
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
    </FullRouteIntlProvider>
  )
}
