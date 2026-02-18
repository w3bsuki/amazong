export interface AdminNote {
  id: string
  title: string
  content: string | null
  is_pinned: boolean | null
  author_id: string | null
  created_at: string | null
  updated_at: string | null
}

export type NoteSavePayload = Partial<AdminNote> & { id?: string }
