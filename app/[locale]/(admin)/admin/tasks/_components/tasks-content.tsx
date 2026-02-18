"use client"

import { useState } from "react"
import { Plus as IconPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { TaskCard } from "./task-card"
import { TaskDialog } from "./task-dialog"
import { PRIORITY_ORDER, STATUS_COLUMNS } from "./tasks-content.constants"
import type { AdminTask, TaskSavePayload } from "./types"

export function AdminTasksContent({ initialTasks }: { initialTasks: AdminTask[] }) {
  const t = useTranslations("AdminTasks")
  const [tasks, setTasks] = useState(initialTasks)
  const [editingTask, setEditingTask] = useState<AdminTask | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const supabase = createClient()

  const columns = STATUS_COLUMNS.map((col) => ({
    ...col,
    label: t(col.labelKey),
  }))

  const tasksByStatus = columns.reduce((acc, col) => {
    acc[col.id] = tasks
      .filter((t) => t.status === col.id)
      .sort((a, b) => (PRIORITY_ORDER[b.priority] ?? 0) - (PRIORITY_ORDER[a.priority] ?? 0))
    return acc
  }, {} as Record<string, AdminTask[]>)

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from("admin_tasks")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", taskId)
    
    if (error) {
      toast.error(t("toasts.updateFailed"))
      return
    }
    
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
  }

  const handleSave = async (task: TaskSavePayload) => {
    if (task.id) {
      // Update - build object conditionally to satisfy exactOptionalPropertyTypes
      const updateData: Record<string, string | null> = {
        updated_at: new Date().toISOString(),
      }
      if (task.title !== undefined) updateData.title = task.title
      if (task.description !== undefined) updateData.description = task.description
      if (task.priority !== undefined) updateData.priority = task.priority
      if (task.due_date !== undefined) updateData.due_date = task.due_date
      
      const { error } = await supabase
        .from("admin_tasks")
        .update(updateData)
        .eq("id", task.id)
      
      if (error) {
        toast.error(t("toasts.updateFailed"))
        return
      }
      
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)))
      toast.success(t("toasts.updated"))
    } else {
      // Create
      if (!task.title) {
        toast.error(t("toasts.titleRequired"))
        return
      }
      const { data, error } = await supabase
        .from("admin_tasks")
        .insert({
          title: task.title,
          description: task.description ?? null,
          priority: task.priority || "medium",
          status: "todo",
          due_date: task.due_date ?? null,
        })
        .select("id, title, description, status, priority, due_date, assigned_to, created_by, created_at, updated_at")
        .single()
      
      if (error) {
        toast.error(t("toasts.createFailed"))
        return
      }
      
      if (data) {
        setTasks([data, ...tasks])
        toast.success(t("toasts.created"))
      }
    }
    
    setIsDialogOpen(false)
    setEditingTask(null)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("admin_tasks").delete().eq("id", id)
    
    if (error) {
      toast.error(t("toasts.deleteFailed"))
      return
    }
    
    setTasks(tasks.filter((t) => t.id !== id))
    toast.success(t("toasts.deleted"))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {t("summary", {
            total: tasks.length,
            completed: tasks.filter((t) => t.status === "done").length,
          })}
        </div>
        <Button onClick={() => { setEditingTask(null); setIsDialogOpen(true) }}>
          <IconPlus className="size-4 mr-2" />
          {t("buttons.newTask")}
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="space-y-2">
            <div className={cn("rounded-lg px-3 py-2 font-medium text-sm", column.color)}>
              {column.label}
              <span className="ml-2 text-muted-foreground">
                ({tasksByStatus[column.id]?.length || 0})
              </span>
            </div>
            <div className="space-y-2 min-h-52">
              {tasksByStatus[column.id]?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  statusOptions={columns}
                  onStatusChange={handleStatusChange}
                  onEdit={() => { setEditingTask(task); setIsDialogOpen(true) }}
                  onDelete={() => {
                    if (confirm(t("confirm.deleteTask"))) {
                      handleDelete(task.id)
                    }
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Dialog */}
      <TaskDialog
        task={editingTask}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
