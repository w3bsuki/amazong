import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { AdminDocsContent } from "./_components/docs-content"
import { Skeleton } from "@/components/ui/skeleton"

export default async function AdminDocsPage() {
  // Mark route as dynamic without using route segment config (incompatible with cacheComponents).
  await connection()

  const t = await getTranslations("AdminDocs")

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
      <Suspense fallback={<DocsTableSkeleton />}>
        <AdminDocsContentWrapper />
      </Suspense>
    </div>
  )
}

async function AdminDocsContentWrapper() {
  const supabase = await createClient()
  
  const { data: docs } = await supabase
    .from("admin_docs")
    .select("*")
    .order("category")
    .order("title")
  
  return <AdminDocsContent initialDocs={docs || []} />
}

function DocsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="rounded-lg border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b last:border-b-0">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
