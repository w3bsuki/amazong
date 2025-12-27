import { Quote } from "lucide-react"

import { cn } from "@/lib/utils"

export function SellersNote(props: {
  locale: string
  note: string
  className?: string
}) {
  const { locale, note, className } = props

  if (!note || !note.trim()) return null

  return (
    <section className={cn("space-y-3", className)}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {locale === "bg" ? "Бележка от продавача" : "Seller’s note"}
      </h2>
      <div className="relative rounded-md border border-border bg-muted/20 p-4">
        <Quote className="h-4 w-4 text-muted-foreground/40 absolute top-3 left-3" aria-hidden />
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line indent-6">{note}</p>
      </div>
    </section>
  )
}
