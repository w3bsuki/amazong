import * as React from "react"
import { cn } from "@/lib/utils"
import { Home, Search, Plus, MessageCircle, User } from "lucide-react"

type Item = {
  key: string
  label: string
  href: string
  icon: React.ReactNode
  isPrimary?: boolean
}

export function BottomNav({ activeKey }: { activeKey: string }) {
  const items: Item[] = [
    { key: "home", label: "Home", href: "/", icon: <Home className="size-5" /> },
    { key: "browse", label: "Browse", href: "/browse", icon: <Search className="size-5" /> },
    { key: "sell", label: "Sell", href: "/sell", icon: <Plus className="size-5" />, isPrimary: true },
    { key: "chat", label: "Chat", href: "/chat", icon: <MessageCircle className="size-5" /> },
    { key: "profile", label: "Profile", href: "/me", icon: <User className="size-5" /> },
  ]

  return (
    <nav
      className={cn(
        "sticky bottom-0 z-50 border-t border-border/60",
        "bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom)]"
      )}
    >
      <div className="mx-auto max-w-screen-sm px-2 py-2">
        <div className="grid grid-cols-5 items-end gap-1">
          {items.map((item) => {
            const active = item.key === activeKey

            if (item.isPrimary) {
              return (
                <div key={item.key} className="-mt-6 flex justify-center">
                  <a
                    href={item.href}
                    className={cn(
                      "grid size-14 place-items-center rounded-full",
                      "bg-primary text-primary-foreground shadow-float",
                      "active:scale-[0.98] transition-transform"
                    )}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </a>
                </div>
              )
            }

            return (
              <a
                key={item.key}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2",
                  active ? "text-foreground" : "text-muted-foreground",
                  "active:scale-[0.98] transition-transform"
                )}
                aria-current={active ? "page" : undefined}
              >
                <div className={cn(active ? "text-primary" : "")}>{item.icon}</div>
                <div className="text-[11px] font-medium">{item.label}</div>
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
