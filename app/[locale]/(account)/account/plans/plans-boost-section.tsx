import { Zap as Lightning } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PlansContentCopy } from "./plans-content.copy"

type PlansBoostSectionProps = {
  copy: PlansContentCopy
}

export function PlansBoostSection({ copy }: PlansBoostSectionProps) {
  return (
    <div className="mt-6 md:mt-10">
      <Card className="border-border">
        <CardHeader className="p-4 pb-2 md:p-4 md:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-muted">
              <Lightning className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg">{copy.boostTitle}</CardTitle>
              <CardDescription className="text-xs md:text-sm">{copy.boostDescription}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2 md:p-4 md:pt-0">
          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible">
            <div className="border border-border rounded-md p-3 text-center shrink-0 w-24 snap-center sm:w-auto">
              <p className="text-lg font-semibold">2.99 лв</p>
              <p className="text-xs text-muted-foreground">{copy.days7}</p>
            </div>
            <div className="border border-primary rounded-md p-3 text-center relative shrink-0 w-24 snap-center sm:w-auto">
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-2xs px-1.5 py-0">
                {copy.boostBest}
              </Badge>
              <p className="text-lg font-semibold">4.99 лв</p>
              <p className="text-xs text-muted-foreground">{copy.days14}</p>
            </div>
            <div className="border border-border rounded-md p-3 text-center shrink-0 w-24 snap-center sm:w-auto">
              <p className="text-lg font-semibold">8.99 лв</p>
              <p className="text-xs text-muted-foreground">{copy.days30}</p>
            </div>
          </div>
          <p className="text-2xs md:text-xs text-muted-foreground mt-3 text-center">{copy.boostFootnote}</p>
        </CardContent>
      </Card>
    </div>
  )
}
