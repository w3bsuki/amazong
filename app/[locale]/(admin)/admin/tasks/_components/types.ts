export interface AdminTask {
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

export interface TaskStatusColumn {
  id: string
  labelKey: string
  color: string
}

export interface TaskStatusOption {
  id: string
  label: string
}

export type TaskSavePayload = Partial<AdminTask> & { id?: string }
