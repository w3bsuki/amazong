"use client"

import * as React from "react"
import { useState } from "react"
import {
  IconPlus,
  IconPin,
  IconPinFilled,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useLocale, useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface AdminNote {
  id: string
  title: string
  content: string | null
  is_pinned: boolean | null
  author_id: string | null
  created_at: string | null
  updated_at: string | null
}

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

  const handleSave = async (note: Partial<AdminNote> & { id?: string }) => {
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

function NoteCard({
  note,
  onTogglePin,
  onEdit,
  onDelete,
}: {
  note: AdminNote
  onTogglePin: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const t = useTranslations("AdminNotes")
  const locale = useLocale()

  return (
    <Card className={cn("group", note.is_pinned && "border-selected-border bg-hover")}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{note.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 min-h-11 min-w-11 shrink-0"
            aria-label={note.is_pinned ? t("aria.unpin") : t("aria.pin")}
            title={note.is_pinned ? t("aria.unpin") : t("aria.pin")}
            onClick={onTogglePin}
          >
            {note.is_pinned ? (
              <IconPinFilled className="size-4 text-primary" />
            ) : (
              <IconPin className="size-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {note.content && (
          <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
            {note.content}
          </p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <span className="text-xs text-muted-foreground">
            {note.updated_at ? new Date(note.updated_at).toLocaleDateString(locale) : t("dateEmpty")}
          </span>
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

function NoteDialog({
  note,
  open,
  onOpenChange,
  onSave,
}: {
  note: AdminNote | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (note: Partial<AdminNote> & { id?: string }) => void
}) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const t = useTranslations("AdminNotes")

  React.useEffect(() => {
    if (open) {
      setTitle(note?.title || "")
      setContent(note?.content || "")
    }
  }, [open, note])

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error(t("toasts.titleRequired"))
      return
    }
    onSave({
      ...(note?.id ? { id: note.id } : {}),
      title,
      content: content || null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? t("dialog.titleEdit") : t("dialog.titleNew")}</DialogTitle>
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
            <Label htmlFor="content">{t("labels.content")}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("placeholders.content")}
              rows={8}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("buttons.cancel")}
          </Button>
          <Button onClick={handleSubmit}>
            {note ? t("buttons.saveChanges") : t("buttons.createNote")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
