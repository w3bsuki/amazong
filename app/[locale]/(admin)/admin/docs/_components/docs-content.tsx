"use client"

import * as React from "react"
import { useState } from "react"
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
  created_at: string | null
  updated_at: string | null
}

const CATEGORIES = [
  { value: "policies", label: "Policies" },
  { value: "payments", label: "Payments" },
  { value: "plans", label: "Plans" },
  { value: "roadmap", label: "Roadmap" },
  { value: "guides", label: "Guides" },
  { value: "general", label: "General" },
]

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-admin-draft-bg text-admin-draft",
  published: "bg-admin-published-bg text-admin-published",
  archived: "bg-muted text-muted-foreground",
}

export function AdminDocsContent({ initialDocs }: { initialDocs: AdminDoc[] }) {
  const [docs, setDocs] = useState(initialDocs)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedDoc, setSelectedDoc] = useState<AdminDoc | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  
  const supabase = createClient()

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
        toast.error("Failed to update document")
        return
      }
      
      setDocs(docs.map((d) => (d.id === doc.id ? { ...d, ...doc } : d)))
      toast.success("Document updated")
    } else {
      // Create
      if (!doc.title) {
        toast.error("Title is required")
        return
      }
      const slug = doc.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      const { data, error } = await supabase
        .from("admin_docs")
        .insert({
          title: doc.title,
          slug,
          content: doc.content ?? null,
          category: doc.category || "general",
          status: doc.status || "draft",
        })
        .select()
        .single()
      
      if (error) {
        toast.error("Failed to create document")
        return
      }
      
      if (data) {
        setDocs([...docs, data])
        toast.success("Document created")
      }
    }
    
    setSelectedDoc(null)
    setIsEditing(false)
    setIsCreating(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("admin_docs").delete().eq("id", id)
    
    if (error) {
      toast.error("Failed to delete document")
      return
    }
    
    setDocs(docs.filter((d) => d.id !== id))
    setSelectedDoc(null)
    toast.success("Document deleted")
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search docs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => { setIsCreating(true); setSelectedDoc(null) }}>
          <IconPlus className="size-4 mr-2" />
          New Doc
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc) => (
                <TableRow 
                  key={doc.id} 
                  className="cursor-pointer hover:bg-muted/50"
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
                      {doc.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[doc.status] || ""}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
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
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm("Delete this document?")) {
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
          className="max-w-full w-full h-dvh sm:h-[calc(100vh-4rem)] sm:w-[calc(100vw-4rem)] sm:max-w-5xl p-0 gap-0 overflow-hidden flex flex-col rounded-none sm:rounded-lg border-0 sm:border"
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
  const [title, setTitle] = useState(doc?.title || "")
  const [content, setContent] = useState(doc?.content || "")
  const [category, setCategory] = useState(doc?.category || "general")
  const [status, setStatus] = useState(doc?.status || "draft")

  // Reset form when doc changes
  React.useEffect(() => {
    setTitle(doc?.title || "")
    setContent(doc?.content || "")
    setCategory(doc?.category || "general")
    setStatus(doc?.status || "draft")
  }, [doc])

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Title is required")
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
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0 size-8"
            >
              <IconX className="size-5" />
            </Button>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold truncate">
                {doc.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Document viewer
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize hidden sm:inline-flex">
              {doc.category}
            </Badge>
            <Badge className={STATUS_COLORS[doc.status] || ""}>
              {doc.status}
            </Badge>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <IconEdit className="size-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-4xl mx-auto">
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
                blockquote: ({ children }) => <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-3">{children}</blockquote>,
                code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="w-full text-sm border-collapse border border-border rounded-lg overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-muted/70">{children}</thead>,
                tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
                tr: ({ children }) => <tr className="hover:bg-muted/30 transition-colors">{children}</tr>,
                th: ({ children }) => <th className="text-left px-3 py-2 font-semibold text-xs border border-border bg-muted">{children}</th>,
                td: ({ children }) => <td className="px-3 py-2 text-sm border border-border">{children}</td>,
              }}
            >
              {doc.content || "No content yet."}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
          Last updated: {doc.updated_at ? new Date(doc.updated_at).toLocaleString() : "—"}
        </div>
      </div>
    )
  }

  // Edit/Create mode - full screen editor
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="shrink-0 size-8"
          >
            <IconX className="size-5" />
          </Button>
          <div>
            <DialogTitle className="text-base font-semibold">
              {doc ? "Edit Document" : "New Document"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground hidden sm:block">
              {doc ? "Update documentation content" : "Create new documentation"}
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
                  Draft
                </div>
              </SelectItem>
              <SelectItem value="published">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-admin-published" />
                  Published
                </div>
              </SelectItem>
              <SelectItem value="archived">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-muted-foreground" />
                  Archived
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {doc ? "Save" : "Create"}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title"
                className="text-lg font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your documentation here...

You can use Markdown formatting:
- **Bold** and *italic* text
- Lists and headings
- Code blocks with ```
- Links [text](url)"
              className="min-h-[50vh] font-mono text-sm resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
