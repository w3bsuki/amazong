import { Link } from "@/i18n/routing"
import { ArrowRight, Heart } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function WishlistEmptyState({
  title,
  description,
  startShoppingLabel,
}: {
  title: string
  description: string
  startShoppingLabel: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted border border-border mb-4">
          <Heart className="size-8 text-destructive" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-sm">{description}</p>
        <Button asChild className="mt-6">
          <Link href="/search">
            {startShoppingLabel}
            <ArrowRight className="size-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
