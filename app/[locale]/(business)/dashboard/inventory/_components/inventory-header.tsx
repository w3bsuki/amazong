import { IconAlertTriangle, IconCheck, IconPackage, IconX } from "@tabler/icons-react"

type InventorySummary = {
  totalStock: number
  totalProducts: number
  lowStockCount: number
  outOfStockCount: number
}

export function InventoryHeader({ summary }: { summary: InventorySummary }) {
  const inStockCount = summary.totalProducts - summary.lowStockCount - summary.outOfStockCount

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
              <IconPackage className="size-3" />
              <span className="tabular-nums">{summary.totalStock.toLocaleString()}</span>
              <span className="opacity-70">total units</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <IconCheck className="size-3" />
              <span className="tabular-nums">{inStockCount}</span>
              <span className="opacity-70">in stock</span>
            </span>
            {summary.lowStockCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400">
                <IconAlertTriangle className="size-3" />
                <span className="tabular-nums">{summary.lowStockCount}</span>
                <span className="opacity-70">low</span>
              </span>
            )}
            {summary.outOfStockCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
                <IconX className="size-3" />
                <span className="tabular-nums">{summary.outOfStockCount}</span>
                <span className="opacity-70">out</span>
              </span>
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-sm">Manage stock levels across {summary.totalProducts} products</p>
      </div>
    </div>
  )
}
