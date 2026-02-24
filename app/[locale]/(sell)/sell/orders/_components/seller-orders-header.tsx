import { ArrowLeft, RefreshCw } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SellerOrdersCopy } from "./seller-orders.types"

type SellerOrdersHeaderProps = {
  copy: SellerOrdersCopy
  onRefresh: () => void
  isRefreshing: boolean
  backLabel: string
}

export function SellerOrdersHeader({
  copy,
  onRefresh,
  isRefreshing,
  backLabel,
}: SellerOrdersHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild aria-label={backLabel}>
          <Link href="/sell">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{copy.headerTitle}</h1>
          <p className="text-sm text-muted-foreground">{copy.headerDescription}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
          {copy.refresh}
        </Button>
      </div>
    </header>
  )
}
