import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Menu, Search, ShoppingCart } from "lucide-react"

export function AppHeader() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "bg-background/80 supports-[backdrop-filter]:bg-background/60",
        "backdrop-blur-md",
        "border-b border-border/60"
      )}
    >
      <div className="mx-auto max-w-screen-sm px-4 pt-3 pb-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="size-11">
            <Menu className="size-5" />
          </Button>

          <div className="relative flex-1">
            <Input
              className="h-11 rounded-full bg-muted/60 pl-10"
              placeholder="Search…"
            />
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
              <Search className="size-4" />
            </div>
          </div>

          <Button variant="ghost" size="icon" className="size-11 relative">
            <Heart className="size-5" />
            <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-primary px-1 text-[11px] leading-5 text-primary-foreground">
              2
            </span>
          </Button>

          <Button variant="ghost" size="icon" className="size-11 relative">
            <ShoppingCart className="size-5" />
            <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-primary px-1 text-[11px] leading-5 text-primary-foreground">
              99
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
