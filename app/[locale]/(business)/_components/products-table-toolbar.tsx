import { ChevronDown as IconChevronDown, Download as IconDownload, Plus as IconPlus, RefreshCw as IconRefresh, Search as IconSearch, Trash as IconTrash, X as IconX } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { StatusFilter } from "./products-table.types"

interface ProductsTableToolbarProps {
  total: number
  statusFilter: StatusFilter
  statusCounts: Record<StatusFilter, number>
  searchQuery: string
  selectedCount: number
  isLoading: boolean
  onStatusFilterChange: (status: StatusFilter) => void
  onSearchQueryChange: (query: string) => void
  onAddProduct: () => void
  onBulkStatusUpdate: (status: Exclude<StatusFilter, "all">) => Promise<void>
  onBulkDelete: () => Promise<void>
  onClearSelection: () => void
}

const STATUS_TABS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
  { value: "out_of_stock", label: "Out of Stock" },
]

export function ProductsTableToolbar({
  total,
  statusFilter,
  statusCounts,
  searchQuery,
  selectedCount,
  isLoading,
  onStatusFilterChange,
  onSearchQueryChange,
  onAddProduct,
  onBulkStatusUpdate,
  onBulkDelete,
  onClearSelection,
}: ProductsTableToolbarProps) {
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between px-4 lg:px-6 py-4 border-b bg-background">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold">Products</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                <span className="tabular-nums">{total}</span>
                <span className="opacity-70">total</span>
              </span>
              {statusCounts.active > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                  <span className="tabular-nums">{statusCounts.active}</span>
                  <span className="opacity-70">active</span>
                </span>
              )}
              {statusCounts.draft > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                  <span className="tabular-nums">{statusCounts.draft}</span>
                  <span className="opacity-70">draft</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <IconDownload className="size-4 mr-1.5" />
            Export
          </Button>
          <Button size="sm" onClick={onAddProduct}>
            <IconPlus className="size-4 mr-1.5" />
            Add product
          </Button>
        </div>
      </div>

      <div className="px-4 lg:px-6 border-b bg-background">
        <div className="flex gap-1 -mb-px">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onStatusFilterChange(tab.value)}
              className={cn(
                "px-3 py-2.5 text-sm font-medium border-b-2 transition-colors",
                statusFilter === tab.value
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.label}
              <span className={cn(
                "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                statusFilter === tab.value
                  ? "bg-selected text-primary"
                  : "bg-muted text-muted-foreground"
              )}>
                {statusCounts[tab.value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-6 py-3 border-b bg-surface-subtle space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, or barcode..."
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              className="pl-8 h-8 text-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0.5 top-1/2 -translate-y-1/2 size-7"
                type="button"
                aria-label="Clear search"
                onClick={() => onSearchQueryChange("")}
              >
                <IconX className="size-3" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <Button variant="ghost" size="sm" onClick={() => onSearchQueryChange("")} className="h-8 text-xs">
              <IconRefresh className="size-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-3 py-2 px-3 rounded-md bg-background border flex-wrap">
            <span className="text-sm font-medium">{selectedCount} selected</span>
            <div className="flex items-center gap-1.5 ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs" disabled={isLoading}>
                    Set Status
                    <IconChevronDown className="size-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => void onBulkStatusUpdate("active")}>
                    <span className="size-2 rounded-full bg-success mr-2" />
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => void onBulkStatusUpdate("draft")}>
                    <span className="size-2 rounded-full bg-muted mr-2" />
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => void onBulkStatusUpdate("archived")}>
                    <span className="size-2 rounded-full bg-destructive mr-2" />
                    Archived
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => void onBulkStatusUpdate("out_of_stock")}>
                    <span className="size-2 rounded-full bg-warning mr-2" />
                    Out of Stock
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs text-destructive hover:text-destructive"
                onClick={() => void onBulkDelete()}
                disabled={isLoading}
              >
                <IconTrash className="size-3 mr-1" />
                Delete
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs ml-auto"
              onClick={onClearSelection}
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
