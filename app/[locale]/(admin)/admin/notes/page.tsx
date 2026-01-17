import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { AdminNotesContent } from "./_components/notes-content"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminNotesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-muted-foreground">
            Quick internal notes
          </p>
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
    .select("*")
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
