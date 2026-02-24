import { Link } from "@/i18n/routing"
import { Plus, CircleDollarSign as CurrencyCircleDollar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type SalesEmptyStateProps = {
  title: string
  description: string
  ctaLabel: string
}

export function SalesEmptyState({ title, description, ctaLabel }: SalesEmptyStateProps) {
  return (
    <Card className="mt-6">
      <CardContent className="py-16">
        <div className="text-center">
          <div className="size-20 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
            <CurrencyCircleDollar className="size-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
          <Button asChild>
            <Link href="/sell">
              <Plus className="size-4 mr-2" />
              {ctaLabel}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
