import { createAdminClient, createClient } from "@/lib/supabase/server"
import { getTranslations } from "next-intl/server"
import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { getLocale } from "next-intl/server"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

async function getUsers() {
  const adminClient = createAdminClient()

  const { data: users, error } = await adminClient
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    if (!error.message.includes("During prerendering, fetch() rejects when the prerender is complete")) {
      console.error("Failed to fetch users:", error.message)
    }
    return []
  }

  const ids = (users || []).map((u) => u.id).filter(Boolean)

  const { data: privateProfiles } = ids.length
    ? await adminClient
        .from("private_profiles")
        .select("id, email, phone")
        .in("id", ids)
    : { data: [] as Array<{ id: string; email: string | null; phone: string | null }> }

  const privateById = new Map((privateProfiles || []).map((p) => [p.id, p]))

  return (users || []).map((u) => {
    const priv = privateById.get(u.id)
    return {
      ...u,
      email: priv?.email ?? null,
      phone: priv?.phone ?? null,
    }
  })
}

async function AdminUsersContent() {
  await (await createClient()).auth.getUser()

  const users = await getUsers()
  const t = await getTranslations("AdminUsers")
  const locale = await getLocale()
  const dateLocale = locale === "bg" ? bg : enUS

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "admin":
        return "border-foreground/20 bg-foreground/10 text-foreground"
      case "seller":
        return "border-selected-border bg-selected text-primary"
      default:
        return "border-border bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
        <Badge variant="outline" className="text-base">
          {t("summary", { count: users.length })}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>{t("table.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.headers.user")}</TableHead>
                <TableHead>{t("table.headers.role")}</TableHead>
                <TableHead>{t("table.headers.phone")}</TableHead>
                <TableHead>{t("table.headers.joined")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                          {(user.email || t("fallbacks.unknown")).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.full_name || t("fallbacks.noName")}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleBadge(user.role)}>
                      {t(`roles.${user.role || "buyer"}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.phone || t("fallbacks.noPhone")}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: dateLocale })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

async function AdminUsersFallback() {
  const t = await getTranslations("AdminUsers")

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
        <Badge variant="outline" className="text-base">{t("loading")}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>{t("table.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">{t("loading")}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function AdminUsersPage() {
  const { connection } = await import("next/server")
  // Mark route as dynamic - admin routes need auth
  await connection()
  
  return (
    <Suspense fallback={<AdminUsersFallback />}>
      <AdminUsersContent />
    </Suspense>
  )
}
