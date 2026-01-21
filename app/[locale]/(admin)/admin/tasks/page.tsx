import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { AdminTasksContent } from "./_components/tasks-content"
import { Skeleton } from "@/components/ui/skeleton"

export default async function AdminTasksPage() {
  const t = await getTranslations("AdminTasks")

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
      </div>
      <Suspense fallback={<TasksSkeleton />}>
        <AdminTasksContentWrapper />
      </Suspense>
    </div>
  )
}

async function AdminTasksContentWrapper() {
  const supabase = await createClient()
  
  const { data: tasks } = await supabase
    .from("admin_tasks")
    .select("id, title, description, status, priority, due_date, assigned_to, created_by, created_at, updated_at")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false })
  
  return <AdminTasksContent initialTasks={tasks || []} />
}

function TasksSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {["Todo", "In Progress", "Review", "Done"].map((col) => (
        <div key={col} className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
