import { Pencil as IconEdit, FileText as IconFileText, Plus as IconPlus, Search as IconSearch, Trash as IconTrash } from "lucide-react"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { CATEGORIES, STATUS_COLORS, STATUSES } from "./docs-config"
import type { AdminDoc } from "./docs-types"

interface DocsTableProps {
  docs: AdminDoc[]
  locale: string
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  isSeeding: boolean
  onSeedTemplates: () => void
  onNewDoc: () => void
  onOpenDoc: (doc: AdminDoc) => void
  onEditDoc: (doc: AdminDoc) => void
  onDeleteDoc: (doc: AdminDoc) => void
}

export function DocsTable({
  docs,
  locale,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  isSeeding,
  onSeedTemplates,
  onNewDoc,
  onOpenDoc,
  onEditDoc,
  onDeleteDoc,
}: DocsTableProps) {
  const t = useTranslations("AdminDocs")

  const getCategoryLabel = (value: string) =>
    (CATEGORIES as readonly string[]).includes(value)
      ? t(`categories.${value}`)
      : value

  const getStatusLabel = (value: string) =>
    (STATUSES as readonly string[]).includes(value)
      ? t(`status.${value}`)
      : value

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 basis-52 min-w-0 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t("filters.searchPlaceholder")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
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
          onClick={onSeedTemplates}
          disabled={isSeeding}
        >
          {t("buttons.seedTemplates")}
        </Button>
        <Button onClick={onNewDoc}>
          <IconPlus className="size-4 mr-2" />
          {t("buttons.newDoc")}
        </Button>
      </div>

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
            {docs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {t("table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              docs.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="cursor-pointer hover:bg-hover"
                  role="button"
                  tabIndex={0}
                  aria-label={doc.title}
                  onClick={() => onOpenDoc(doc)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      onOpenDoc(doc)
                    }
                  }}
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
                        className="min-h-11 min-w-11"
                        aria-label={t("aria.edit")}
                        title={t("aria.edit")}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditDoc(doc)
                        }}
                      >
                        <IconEdit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="min-h-11 min-w-11"
                        aria-label={t("aria.delete")}
                        title={t("aria.delete")}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteDoc(doc)
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
    </>
  )
}
