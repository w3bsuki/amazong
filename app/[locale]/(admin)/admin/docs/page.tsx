import { getTranslations } from "next-intl/server"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { AdminDocsContent } from "./_components/docs-content"

export const metadata = {
  title: "Admin Docs | Treido",
  description: "Manage Treido admin documentation.",
}

export default async function AdminDocsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  // Mark route as dynamic without using route segment config (incompatible with cacheComponents).
  await connection()

  const t = await getTranslations("AdminDocs")
  const { locale } = await params

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">
            {t("page.description")}
          </p>
        </div>
      </div>
      <AdminDocsContentWrapper locale={locale} />
    </div>
  )
}

async function AdminDocsContentWrapper({ locale }: { locale: string }) {
  const supabase = await createClient()
  
  const { data: docs } = await supabase
    .from("admin_docs")
    .select("id, title, slug, content, category, status, author_id, locale, created_at, updated_at")
    .eq("locale", locale)
    .order("category")
    .order("title")
  
  return <AdminDocsContent initialDocs={docs || []} />
}
