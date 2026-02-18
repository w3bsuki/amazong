"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

import { DocEditor } from "./doc-editor"
import { makeUniqueSlug, slugifyTitle } from "./docs-config"
import { DocsTable } from "./docs-table"
import type { AdminDoc, DocSavePayload } from "./docs-types"

export function AdminDocsContent({ initialDocs }: { initialDocs: AdminDoc[] }) {
  const locale = useLocale()
  const t = useTranslations("AdminDocs")

  const [docs, setDocs] = useState(initialDocs)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedDoc, setSelectedDoc] = useState<AdminDoc | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)

  const supabase = createClient()

  const filteredDocs = docs.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const loadDocs = async () => {
    const { data } = await supabase
      .from("admin_docs")
      .select("id, title, slug, content, category, status, author_id, locale, created_at, updated_at")
      .eq("locale", locale)
      .order("category")
      .order("title")

    return data || []
  }

  const handleSave = async (doc: DocSavePayload) => {
    if (doc.id) {
      const updateData: Record<string, string | null> = {
        updated_at: new Date().toISOString(),
      }
      if (doc.title !== undefined) updateData.title = doc.title
      if (doc.content !== undefined) updateData.content = doc.content
      if (doc.category !== undefined) updateData.category = doc.category
      if (doc.status !== undefined) updateData.status = doc.status

      const { error } = await supabase
        .from("admin_docs")
        .update(updateData)
        .eq("id", doc.id)

      if (error) {
        toast.error(t("toasts.updateFailed"))
        return
      }

      setDocs(docs.map((d) => (d.id === doc.id ? { ...d, ...doc } : d)))
      toast.success(t("toasts.updated"))
    } else {
      if (!doc.title) {
        toast.error(t("toasts.titleRequired"))
        return
      }

      const baseSlug = slugifyTitle(doc.title)
      const existingSlugs = new Set(docs.map((d) => d.slug))
      const slug = makeUniqueSlug(baseSlug, existingSlugs)

      const { data, error } = await supabase
        .from("admin_docs")
        .insert({
          title: doc.title,
          slug,
          content: doc.content ?? null,
          category: doc.category || "general",
          status: doc.status || "draft",
          locale,
        })
        .select("id, title, slug, content, category, status, author_id, locale, created_at, updated_at")
        .single()

      if (error) {
        toast.error(t("toasts.createFailed"))
        return
      }

      if (data) {
        setDocs([...docs, data])
        toast.success(t("toasts.created"))
      }
    }

    setSelectedDoc(null)
    setIsEditing(false)
    setIsCreating(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("admin_docs").delete().eq("id", id)

    if (error) {
      toast.error(t("toasts.deleteFailed"))
      return
    }

    setDocs(docs.filter((d) => d.id !== id))
    setSelectedDoc(null)
    toast.success(t("toasts.deleted"))
  }

  const handleSeedTemplates = async () => {
    setIsSeeding(true)
    try {
      const response = await fetch("/api/admin/docs/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      })
      const payload: unknown = await response.json()

      if (!response.ok) {
        toast.error(t("toasts.seedFailed"))
        return
      }

      const inserted =
        typeof payload === "object" && payload && "inserted" in payload
          ? Number((payload as { inserted: unknown }).inserted)
          : 0

      const refreshedDocs = await loadDocs()
      setDocs(refreshedDocs)
      toast.success(inserted > 0 ? t("toasts.seeded", { count: inserted }) : t("toasts.noNewTemplates"))
    } catch {
      toast.error(t("toasts.seedFailed"))
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="space-y-4">
      <DocsTable
        docs={filteredDocs}
        locale={locale}
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        isSeeding={isSeeding}
        onSeedTemplates={handleSeedTemplates}
        onNewDoc={() => {
          setIsCreating(true)
          setSelectedDoc(null)
        }}
        onOpenDoc={(doc) => {
          setSelectedDoc(doc)
          setIsEditing(false)
        }}
        onEditDoc={(doc) => {
          setSelectedDoc(doc)
          setIsEditing(true)
        }}
        onDeleteDoc={(doc) => {
          if (confirm(t("actions.confirmDelete"))) {
            handleDelete(doc.id)
          }
        }}
      />

      <Dialog
        open={Boolean(selectedDoc) || isCreating}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDoc(null)
            setIsEditing(false)
            setIsCreating(false)
          }
        }}
      >
        <DialogContent
          className="w-dialog sm:max-w-(--width-modal-lg) max-h-dialog p-0 gap-0 flex flex-col"
          showCloseButton={false}
        >
          {selectedDoc || isCreating ? (
            <DocEditor
              doc={selectedDoc}
              isEditing={isEditing || isCreating}
              onSave={handleSave}
              onEdit={() => setIsEditing(true)}
              onCancel={() => {
                setIsEditing(false)
                setIsCreating(false)
                setSelectedDoc(null)
              }}
              onClose={() => {
                setSelectedDoc(null)
                setIsEditing(false)
                setIsCreating(false)
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
