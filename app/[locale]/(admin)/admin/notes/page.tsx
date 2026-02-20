import { getTranslations } from "next-intl/server"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { AdminNotesContent } from "./_components/notes-content"

export const metadata = {
  title: "Admin Notes | Treido",
  description: "View internal Treido admin notes.",
}

export default async function AdminNotesPage() {
  // Mark route as dynamic - admin routes need auth
  await connection()
  
  return <AdminNotesPageContent />
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
