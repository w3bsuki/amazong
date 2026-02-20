import { getTranslations } from "next-intl/server"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { AdminTasksContent } from "./_components/tasks-content"

export const metadata = {
  title: "Admin Tasks | Treido",
  description: "Manage internal Treido admin tasks.",
}

export default async function AdminTasksPage() {
  // Mark route as dynamic - admin routes need auth
  await connection()
  
  const t = await getTranslations("AdminTasks")

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
      </div>
      <AdminTasksContentWrapper />
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
