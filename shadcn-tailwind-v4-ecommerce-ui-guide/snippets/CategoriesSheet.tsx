import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Grid2X2, X } from "lucide-react"

type Category = {
  id: string
  label: string
  icon?: React.ReactNode
  href: string
}

export function CategoriesSheet({
  categories,
  trigger,
}: {
  categories: Category[]
  trigger?: React.ReactNode
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" className="size-11">
            <Grid2X2 className="size-5" />
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={cn(
          "p-0",
          "rounded-t-2xl border-t border-border/70",
          "shadow-float"
        )}
      >
        <div className="mx-auto max-w-screen-sm">
          <SheetHeader className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid2X2 className="size-5 opacity-70" />
                <SheetTitle className="text-base">Categories</SheetTitle>
              </div>

              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="size-11">
                  <X className="size-5" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[70vh] px-4 pb-6">
            <div className="flex items-center justify-between py-2">
              <div className="text-sm font-medium text-muted-foreground">Browse by category</div>
              <a href="/categories" className="text-sm font-medium text-primary">
                See all →
              </a>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              {categories.map((c) => (
                <a
                  key={c.id}
                  href={c.href}
                  className={cn(
                    "group flex flex-col items-center gap-2 rounded-xl p-2",
                    "active:scale-[0.98] transition-transform"
                  )}
                >
                  <div
                    className={cn(
                      "grid size-14 place-items-center rounded-full",
                      "border border-border/70 bg-background shadow-sm"
                    )}
                  >
                    {c.icon ?? <span className="text-sm font-semibold">{c.label.slice(0, 1)}</span>}
                  </div>
                  <div className="text-center text-[12px] leading-tight text-foreground/90">
                    {c.label}
                  </div>
                </a>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
