import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { AdminNotesContent } from "./_components/notes-content"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Admin Notes | Treido",
  description: "View internal Treido admin notes.",
}

export default async function AdminNotesPage() {
  // Mark route as dynamic - admin routes need auth
  await connection()
  
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AdminNotesPageContent />
    </Suspense>
  )
}

async function AdminNotesPageContent() {
  const t = await getTranslations("AdminNotes")
  const supabase = await createClient()
  
  const { data: notes } = await supabase
    .from("admin_notes")
    .select("id, title, content, is_pinned, author_id, created_at, updated_at")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
      </div>
      <AdminNotesContent initialNotes={notes || []} />
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    </div>
  )
}
