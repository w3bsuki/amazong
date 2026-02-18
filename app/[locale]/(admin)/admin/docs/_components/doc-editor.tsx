import * as React from "react"
import { useState } from "react"
import dynamic from "next/dynamic"
import { useLocale, useTranslations } from "next-intl"
import { Pencil as IconEdit, X as IconX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { CATEGORIES, STATUS_COLORS, STATUSES } from "./docs-config"
import type { AdminDoc, DocSavePayload } from "./docs-types"

const DocMarkdownContent = dynamic(
  () => import("./doc-markdown-content").then((mod) => mod.DocMarkdownContent),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-10/12 animate-pulse rounded bg-muted" />
      </div>
    ),
  }
)

interface DocEditorProps {
  doc: AdminDoc | null
  isEditing: boolean
  onSave: (doc: DocSavePayload) => void
  onEdit: () => void
  onCancel: () => void
  onClose: () => void
}

export function DocEditor({
  doc,
  isEditing,
  onSave,
  onEdit,
  onCancel,
  onClose,
}: DocEditorProps) {
  const activeLocale = useLocale()
  const [title, setTitle] = useState(doc?.title || "")
  const [content, setContent] = useState(doc?.content || "")
  const [category, setCategory] = useState(doc?.category || "general")
  const [status, setStatus] = useState(doc?.status || "draft")
  const t = useTranslations("AdminDocs")

  const getCategoryLabel = (value: string) =>
    (CATEGORIES as readonly string[]).includes(value)
      ? t(`categories.${value}`)
      : value

  const getStatusLabel = (value: string) =>
    (STATUSES as readonly string[]).includes(value)
      ? t(`status.${value}`)
      : value

  React.useEffect(() => {
    setTitle(doc?.title || "")
    setContent(doc?.content || "")
    setCategory(doc?.category || "general")
    setStatus(doc?.status || "draft")
  }, [doc])

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error(t("toasts.titleRequired"))
      return
    }

    onSave({
      ...(doc?.id ? { id: doc.id } : {}),
      title,
      content,
      category,
      status,
    })
  }

  if (!isEditing && doc) {
    return (
      <div className="flex flex-col min-h-0 h-full">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-background shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label={t("aria.close")}
              title={t("aria.close")}
              className="shrink-0 size-8 min-h-11 min-w-11"
            >
              <IconX className="size-5" />
            </Button>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold truncate">
                {doc.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t("viewer.srDescription")}
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize hidden sm:inline-flex">
              {getCategoryLabel(doc.category)}
            </Badge>
            <Badge className={STATUS_COLORS[doc.status] || ""}>
              {getStatusLabel(doc.status)}
            </Badge>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <IconEdit className="size-4 mr-2" />
              {t("actions.edit")}
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto w-full">
            <DocMarkdownContent content={doc.content || t("viewer.noContent")} />
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 border-t bg-surface-subtle text-xs text-muted-foreground shrink-0">
          {t("viewer.lastUpdatedLabel")}{" "}
          {doc.updated_at
            ? new Date(doc.updated_at).toLocaleString(activeLocale)
            : t("viewer.emptyDate")}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            aria-label={t("aria.close")}
            title={t("aria.close")}
            className="shrink-0 size-8 min-h-11 min-w-11"
          >
            <IconX className="size-5" />
          </Button>
          <div>
            <DialogTitle className="text-base font-semibold">
              {doc ? t("editor.titleEdit") : t("editor.titleNew")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground hidden sm:block">
              {doc ? t("editor.descriptionEdit") : t("editor.descriptionNew")}
            </DialogDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-admin-draft" />
                  {t("status.draft")}
                </div>
              </SelectItem>
              <SelectItem value="published">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-admin-published" />
                  {t("status.published")}
                </div>
              </SelectItem>
              <SelectItem value="archived">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-muted-foreground" />
                  {t("status.archived")}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onCancel}>
            {t("actions.cancel")}
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {doc ? t("actions.save") : t("actions.create")}
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto w-full space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="title">{t("editor.titleLabel")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("editor.titlePlaceholder")}
                className="text-lg font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("editor.categoryLabel")}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(`categories.${cat}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t("editor.contentLabel")}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("editor.contentPlaceholder")}
              className="min-h-96 font-mono text-sm resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
