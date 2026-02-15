"use client"

import * as React from "react"
import { useState } from "react"
import {
  IconPlus,
  IconTrash,
  IconEdit,
  IconCalendar,
} from "@/lib/icons/tabler"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface AdminTask {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  assigned_to: string | null
  created_by: string | null
  created_at: string | null
  updated_at: string | null
}

const STATUS_COLUMNS = [
  { id: "todo", labelKey: "columns.todo", color: "bg-muted" },
  { id: "in_progress", labelKey: "columns.in_progress", color: "bg-admin-in-progress-bg" },
  { id: "review", labelKey: "columns.review", color: "bg-admin-review-bg" },
  { id: "done", labelKey: "columns.done", color: "bg-admin-published-bg" },
]

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-admin-urgent text-badge-fg-on-solid",
  high: "bg-admin-high text-badge-fg-on-solid",
  medium: "bg-admin-medium text-foreground",
  low: "bg-muted text-muted-foreground",
}

const PRIORITY_ORDER: Record<string, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

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

  const handleSave = async (task: Partial<AdminTask> & { id?: string }) => {
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

function TaskCard({
  task,
  statusOptions,
  onStatusChange,
  onEdit,
  onDelete,
}: {
  task: AdminTask
  statusOptions: { id: string; label: string }[]
  onStatusChange: (id: string, status: string) => void
  onEdit: () => void
  onDelete: () => void
}) {
  const t = useTranslations("AdminTasks")

  return (
    <Card className="group">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
          <Badge className={cn("text-xs shrink-0", PRIORITY_COLORS[task.priority])}>
            {t(`priority.${task.priority}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {task.description}
          </p>
        )}
        {task.due_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <IconCalendar className="size-3" />
            {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}
        <div className="flex items-center justify-between">
          <Select
            value={task.status}
            onValueChange={(value) => onStatusChange(task.id, value)}
          >
            <SelectTrigger className="h-7 text-xs w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 min-h-11 min-w-11"
              onClick={onEdit}
              aria-label={t("aria.edit")}
              title={t("aria.edit")}
            >
              <IconEdit className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 min-h-11 min-w-11"
              onClick={onDelete}
              aria-label={t("aria.delete")}
              title={t("aria.delete")}
            >
              <IconTrash className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TaskDialog({
  task,
  open,
  onOpenChange,
  onSave,
}: {
  task: AdminTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: Partial<AdminTask> & { id?: string }) => void
}) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [priority, setPriority] = useState(task?.priority || "medium")
  const [dueDate, setDueDate] = useState(task?.due_date || "")
  const t = useTranslations("AdminTasks")

  React.useEffect(() => {
    if (open) {
      setTitle(task?.title || "")
      setDescription(task?.description || "")
      setPriority(task?.priority || "medium")
      setDueDate(task?.due_date || "")
    }
  }, [open, task])

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error(t("toasts.titleRequired"))
      return
    }
    onSave({
      ...(task?.id ? { id: task.id } : {}),
      title,
      description: description || null,
      priority,
      due_date: dueDate || null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? t("dialog.titleEdit") : t("dialog.titleNew")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("labels.title")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("placeholders.title")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t("labels.description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("placeholders.description")}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("labels.priority")}</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">{t("priority.urgent")}</SelectItem>
                  <SelectItem value="high">{t("priority.high")}</SelectItem>
                  <SelectItem value="medium">{t("priority.medium")}</SelectItem>
                  <SelectItem value="low">{t("priority.low")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due_date">{t("labels.dueDate")}</Label>
              <Input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("buttons.cancel")}
          </Button>
          <Button onClick={handleSubmit}>
            {task ? t("buttons.saveChanges") : t("buttons.createTask")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
