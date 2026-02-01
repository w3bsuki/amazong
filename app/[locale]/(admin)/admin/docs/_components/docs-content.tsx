"use client"

import * as React from "react"
import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  IconFileText,
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconX,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface AdminDoc {
  id: string
  title: string
  slug: string
  content: string | null
  category: string
  status: string
  author_id: string | null
  locale: string
  created_at: string | null
  updated_at: string | null
}

const CATEGORIES = [
  "product",
  "policies",
  "payments",
  "plans",
  "roadmap",
  "ops",
  "guides",
  "legal",
  "general",
] as const

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sht",
  ъ: "a",
  ь: "y",
  ю: "yu",
  я: "ya",
  ѝ: "i",
}

function slugifyTitle(title: string) {
  const lowered = title.trim().toLowerCase()
  const transliterated = lowered.replace(/[\u0400-\u04FF]/g, (char) => CYRILLIC_TO_LATIN[char] ?? char)
  const withoutDiacritics = transliterated.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")

  return withoutDiacritics
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function makeUniqueSlug(baseSlug: string, existingSlugs: Set<string>) {
  const fallback = baseSlug || `doc-${Date.now()}`
  let slug = fallback
  let i = 2
  while (existingSlugs.has(slug)) {
    slug = `${fallback}-${i}`
    i += 1
  }
  return slug
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-admin-draft-bg text-admin-draft",
  published: "bg-admin-published-bg text-admin-published",
  archived: "bg-muted text-muted-foreground",
}

const STATUSES = ["draft", "published", "archived"] as const

export function AdminDocsContent({ initialDocs }: { initialDocs: AdminDoc[] }) {
  const locale = useLocale()
  const [docs, setDocs] = useState(initialDocs)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedDoc, setSelectedDoc] = useState<AdminDoc | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)

  const t = useTranslations("AdminDocs")
  
  const supabase = createClient()

  const getCategoryLabel = (value: string) =>
    (CATEGORIES as readonly string[]).includes(value)
      ? t(`categories.${value}`)
      : value

  const getStatusLabel = (value: string) =>
    (STATUSES as readonly string[]).includes(value)
      ? t(`status.${value}`)
      : value

  const loadDocs = async () => {
    const { data } = await supabase
      .from("admin_docs")
      .select("id, title, slug, content, category, status, author_id, locale, created_at, updated_at")
      .eq("locale", locale)
      .order("category")
      .order("title")

    return data || []
  }

  const filteredDocs = docs.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleSave = async (doc: Partial<AdminDoc> & { id?: string }) => {
    if (doc.id) {
      // Update - build object conditionally to satisfy exactOptionalPropertyTypes
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
      // Create
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
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 basis-52 min-w-0 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t("filters.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("filters.categoryPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.allCategories")}</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {t(`categories.${category}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={handleSeedTemplates}
          disabled={isSeeding}
        >
          {t("buttons.seedTemplates")}
        </Button>
        <Button onClick={() => { setIsCreating(true); setSelectedDoc(null) }}>
          <IconPlus className="size-4 mr-2" />
          {t("buttons.newDoc")}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.title")}</TableHead>
              <TableHead>{t("table.category")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.updated")}</TableHead>
              <TableHead className="w-28">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {t("table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc) => (
                <TableRow 
                  key={doc.id} 
                  className="cursor-pointer hover:bg-hover"
                  onClick={() => { setSelectedDoc(doc); setIsEditing(false) }}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <IconFileText className="size-4 text-muted-foreground" />
                      {doc.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {getCategoryLabel(doc.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[doc.status] || ""}>
                      {getStatusLabel(doc.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.updated_at
                      ? new Date(doc.updated_at).toLocaleDateString(locale)
                      : t("viewer.emptyDate")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("aria.edit")}
                        title={t("aria.edit")}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDoc(doc)
                          setIsEditing(true)
                        }}
                      >
                        <IconEdit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("aria.delete")}
                        title={t("aria.delete")}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(t("actions.confirmDelete"))) {
                            handleDelete(doc.id)
                          }
                        }}
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Full-screen Document Modal */}
      <Dialog 
        open={!!selectedDoc || isCreating} 
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
          {(selectedDoc || isCreating) && (
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DocEditor({
  doc,
  isEditing,
  onSave,
  onEdit,
  onCancel,
  onClose,
}: {
  doc: AdminDoc | null
  isEditing: boolean
  onSave: (doc: Partial<AdminDoc> & { id?: string }) => void
  onEdit: () => void
  onCancel: () => void
  onClose: () => void
}) {
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

  // Reset form when doc changes
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
    // View mode - full screen document viewer
    return (
      <div className="flex flex-col min-h-0 h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-background shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label={t("aria.close")}
              title={t("aria.close")}
              className="shrink-0 size-8"
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

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto w-full">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5 pb-2 border-b">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-4">{children}</h3>,
                h4: ({ children }) => <h4 className="text-base font-semibold mb-2 mt-3">{children}</h4>,
                p: ({ children }) => <p className="mb-3 text-sm leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-3 text-sm space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 text-sm space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                hr: () => <hr className="my-6 border-border" />,
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-link underline underline-offset-4 hover:text-link-hover"
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-selected-border pl-4 italic text-muted-foreground my-3">
                    {children}
                  </blockquote>
                ),
                pre: ({ children }) => (
                  <pre className="my-4 overflow-x-auto rounded-md border border-border bg-muted p-3 text-xs leading-relaxed">
                    {children}
                  </pre>
                ),
                code: ({ className, children, ...props }) => {
                  const isBlock = typeof className === "string" && className.startsWith("language-")

                  if (!isBlock) {
                    return (
                      <code
                        className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  }

                  return (
                    <code
                      className={className ? `${className} block font-mono` : "block font-mono"}
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                table: ({ children }) => (
                  <div className="my-4 rounded-md border border-border">
                    <Table className="whitespace-normal">
                      {children}
                    </Table>
                  </div>
                ),
                thead: ({ children }) => <TableHeader className="bg-surface-subtle">{children}</TableHeader>,
                tbody: ({ children }) => <TableBody>{children}</TableBody>,
                tr: ({ children }) => <TableRow className="hover:bg-hover">{children}</TableRow>,
                th: ({ children }) => <TableHead className="whitespace-normal align-top">{children}</TableHead>,
                td: ({ children }) => <TableCell className="whitespace-normal align-top">{children}</TableCell>,
              }}
            >
              {doc.content || t("viewer.noContent")}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t bg-surface-subtle text-xs text-muted-foreground shrink-0">
          {t("viewer.lastUpdatedLabel")}{" "}
          {doc.updated_at
            ? new Date(doc.updated_at).toLocaleString(activeLocale)
            : t("viewer.emptyDate")}
        </div>
      </div>
    )
  }

  // Edit/Create mode - full screen editor
  return (
    <div className="flex flex-col min-h-0 h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            aria-label={t("aria.close")}
            title={t("aria.close")}
            className="shrink-0 size-8"
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

      {/* Editor Content */}
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
