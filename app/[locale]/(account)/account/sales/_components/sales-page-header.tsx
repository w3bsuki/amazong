import { Link } from "@/i18n/routing"
import { Plus, Store as Storefront, ChartLine as ChartLineUp } from "lucide-react"
import { Button } from "@/components/ui/button"

type SalesPageHeaderProps = {
  title: string
  description: string
  myStoreLabel: string
  newListingLabel: string
}

export function SalesPageHeader({
  title,
  description,
  myStoreLabel,
  newListingLabel,
}: SalesPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="size-14 sm:size-16 rounded-md bg-muted border border-border flex items-center justify-center">
          <ChartLineUp className="size-7 sm:size-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline">
          <Link href="/account/selling">
            <Storefront className="size-4 mr-2" />
            {myStoreLabel}
          </Link>
        </Button>
        <Button asChild>
          <Link href="/sell">
            <Plus className="size-4 mr-2" />
            {newListingLabel}
          </Link>
        </Button>
      </div>
    </div>
  )
}
