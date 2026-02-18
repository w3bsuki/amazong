"use client"

import { useState } from "react"
import { Plus as IconPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

import { NoteCard } from "./note-card"
import { NoteDialog } from "./note-dialog"
import type { AdminNote, NoteSavePayload } from "./types"

export function AdminNotesContent({ initialNotes }: { initialNotes: AdminNote[] }) {
  const t = useTranslations("AdminNotes")
  const [notes, setNotes] = useState(initialNotes)
  const [editingNote, setEditingNote] = useState<AdminNote | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const supabase = createClient()

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0)
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  })

  const handleTogglePin = async (note: AdminNote) => {
    const { error } = await supabase
      .from("admin_notes")
      .update({ is_pinned: !note.is_pinned, updated_at: new Date().toISOString() })
      .eq("id", note.id)
    
    if (error) {
      toast.error(t("toasts.updateFailed"))
      return
    }
    
    setNotes(notes.map((n) => (n.id === note.id ? { ...n, is_pinned: !n.is_pinned } : n)))
  }

  const handleSave = async (note: NoteSavePayload) => {
    if (note.id) {
      // Update - build object conditionally to satisfy exactOptionalPropertyTypes
      const updateData: Record<string, string | null> = {
        updated_at: new Date().toISOString(),
      }
      if (note.title !== undefined) updateData.title = note.title
      if (note.content !== undefined) updateData.content = note.content
      
      const { error } = await supabase
        .from("admin_notes")
        .update(updateData)
        .eq("id", note.id)
      
      if (error) {
        toast.error(t("toasts.updateFailed"))
        return
      }
      
      setNotes(notes.map((n) => (n.id === note.id ? { ...n, ...note } : n)))
      toast.success(t("toasts.updated"))
    } else {
      // Create
      if (!note.title) {
        toast.error(t("toasts.titleRequired"))
        return
      }
      const { data, error } = await supabase
        .from("admin_notes")
        .insert({
          title: note.title,
          content: note.content ?? null,
        })
        .select("id, title, content, is_pinned, author_id, created_at, updated_at")
        .single()
      
      if (error) {
        toast.error(t("toasts.createFailed"))
        return
      }
      
      if (data) {
        setNotes([data, ...notes])
        toast.success(t("toasts.created"))
      }
    }
    
    setIsDialogOpen(false)
    setEditingNote(null)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("admin_notes").delete().eq("id", id)
    
    if (error) {
      toast.error(t("toasts.deleteFailed"))
      return
    }
    
    setNotes(notes.filter((n) => n.id !== id))
    toast.success(t("toasts.deleted"))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {t("summary", {
            count: notes.length,
            pinned: notes.filter((n) => n.is_pinned).length,
          })}
        </div>
        <Button onClick={() => { setEditingNote(null); setIsDialogOpen(true) }}>
          <IconPlus className="size-4 mr-2" />
          {t("buttons.newNote")}
        </Button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {t("empty")}
          </div>
        ) : (
          sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onTogglePin={() => handleTogglePin(note)}
              onEdit={() => { setEditingNote(note); setIsDialogOpen(true) }}
              onDelete={() => {
                if (confirm(t("confirm.deleteNote"))) {
                  handleDelete(note.id)
                }
              }}
            />
          ))
        )}
      </div>

      {/* Edit/Create Dialog */}
      <NoteDialog
        note={editingNote}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
