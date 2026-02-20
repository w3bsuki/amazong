import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart as IconShoppingCart } from "lucide-react"

interface AvgOrderValueCardProps {
  value: string
}

export function AvgOrderValueCard({ value }: AvgOrderValueCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2">
          <IconShoppingCart className="size-4" />
          Avg Order Value
        </CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Per transaction</p>
      </CardContent>
    </Card>
  )
}

