import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { AdminNotesContent } from "./_components/notes-content"
import { Skeleton } from "@/components/ui/skeleton"

export default async function AdminNotesPage() {
  const t = await getTranslations("AdminNotes")

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
      </div>
      <Suspense fallback={<NotesSkeleton />}>
        <AdminNotesContentWrapper />
      </Suspense>
    </div>
  )
}

async function AdminNotesContentWrapper() {
  const supabase = await createClient()
  
  const { data: notes } = await supabase
    .from("admin_notes")
    .select("id, title, content, is_pinned, author_id, created_at, updated_at")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
  
  return <AdminNotesContent initialNotes={notes || []} />
}

function NotesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full" />
      ))}
    </div>
  )
}
