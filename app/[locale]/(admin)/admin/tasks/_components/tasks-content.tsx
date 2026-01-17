"use client"

import * as React from "react"
import { useState } from "react"
import {
  IconPlus,
  IconGripVertical,
  IconTrash,
  IconEdit,
  IconCalendar,
} from "@tabler/icons-react"
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

const COLUMNS = [
  { id: "todo", label: "To Do", color: "bg-muted" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-500/10" },
  { id: "review", label: "Review", color: "bg-purple-500/10" },
  { id: "done", label: "Done", color: "bg-green-500/10" },
]

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-red-500 text-white",
  high: "bg-orange-500/80 text-white",
  medium: "bg-yellow-500/80 text-black",
  low: "bg-muted text-muted-foreground",
}

const PRIORITY_ORDER: Record<string, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export function AdminTasksContent({ initialTasks }: { initialTasks: AdminTask[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [editingTask, setEditingTask] = useState<AdminTask | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const supabase = createClient()

  const tasksByStatus = COLUMNS.reduce((acc, col) => {
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
      toast.error("Failed to update task")
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
        toast.error("Failed to update task")
        return
      }
      
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)))
      toast.success("Task updated")
    } else {
      // Create
      if (!task.title) {
        toast.error("Title is required")
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
        .select()
        .single()
      
      if (error) {
        toast.error("Failed to create task")
        return
      }
      
      if (data) {
        setTasks([data, ...tasks])
        toast.success("Task created")
      }
    }
    
    setIsDialogOpen(false)
    setEditingTask(null)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("admin_tasks").delete().eq("id", id)
    
    if (error) {
      toast.error("Failed to delete task")
      return
    }
    
    setTasks(tasks.filter((t) => t.id !== id))
    toast.success("Task deleted")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {tasks.length} tasks total • {tasks.filter((t) => t.status === "done").length} completed
        </div>
        <Button onClick={() => { setEditingTask(null); setIsDialogOpen(true) }}>
          <IconPlus className="size-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => (
          <div key={column.id} className="space-y-2">
            <div className={cn("rounded-lg px-3 py-2 font-medium text-sm", column.color)}>
              {column.label}
              <span className="ml-2 text-muted-foreground">
                ({tasksByStatus[column.id]?.length || 0})
              </span>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {tasksByStatus[column.id]?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={() => { setEditingTask(task); setIsDialogOpen(true) }}
                  onDelete={() => {
                    if (confirm("Delete this task?")) {
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
  onStatusChange,
  onEdit,
  onDelete,
}: {
  task: AdminTask
  onStatusChange: (id: string, status: string) => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className="group">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
          <Badge className={cn("text-xs shrink-0", PRIORITY_COLORS[task.priority])}>
            {task.priority}
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
              {COLUMNS.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="size-7" onClick={onEdit}>
              <IconEdit className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="size-7" onClick={onDelete}>
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
      toast.error("Title is required")
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
          <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
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
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {task ? "Save Changes" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
