"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  IconSearch,
  IconBox,
  IconShoppingCart,
  IconPlus,
  IconChartBar,
  IconSettings,
  IconPackage,
  IconReceipt,
  IconUsers,
  IconHome,
  IconArrowRight,
  IconFileText,
  IconTag,
  IconDiscount,
} from "@tabler/icons-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

interface CommandPaletteProps {
  storeName?: string
}

interface CommandOption {
  id: string
  title: string
  description?: string
  href?: string
  action?: () => void
  icon: React.ElementType
  shortcut?: string
  group: string
}

export function BusinessCommandPalette({ storeName }: CommandPaletteProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  // Listen for keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const navigationCommands: CommandOption[] = [
    {
      id: "home",
      title: "Go to Home",
      href: "/dashboard",
      icon: IconHome,
      shortcut: "H",
      group: "Navigation",
    },
    {
      id: "orders",
      title: "Go to Orders",
      href: "/dashboard/orders",
      icon: IconShoppingCart,
      shortcut: "O",
      group: "Navigation",
    },
    {
      id: "products",
      title: "Go to Products",
      href: "/dashboard/products",
      icon: IconBox,
      shortcut: "P",
      group: "Navigation",
    },
    {
      id: "inventory",
      title: "Go to Inventory",
      href: "/dashboard/inventory",
      icon: IconPackage,
      group: "Navigation",
    },
    {
      id: "analytics",
      title: "Go to Analytics",
      href: "/dashboard/analytics",
      icon: IconChartBar,
      shortcut: "A",
      group: "Navigation",
    },
    {
      id: "accounting",
      title: "Go to Finances",
      href: "/dashboard/accounting",
      icon: IconReceipt,
      group: "Navigation",
    },
    {
      id: "customers",
      title: "Go to Customers",
      href: "/dashboard/customers",
      icon: IconUsers,
      group: "Navigation",
    },
    {
      id: "discounts",
      title: "Go to Discounts",
      href: "/dashboard/discounts",
      icon: IconTag,
      group: "Navigation",
    },
    {
      id: "settings",
      title: "Go to Settings",
      href: "/dashboard/settings",
      icon: IconSettings,
      shortcut: "S",
      group: "Navigation",
    },
  ]

  const actionCommands: CommandOption[] = [
    {
      id: "add-product",
      title: "Add new product",
      description: "Create a new product listing",
      href: "/dashboard/products?add=true",
      icon: IconPlus,
      shortcut: "N",
      group: "Actions",
    },
    {
      id: "create-order",
      title: "Create draft order",
      description: "Create an order manually",
      action: () => router.push("/dashboard/orders/new"),
      icon: IconFileText,
      group: "Actions",
    },
    {
      id: "create-discount",
      title: "Create discount",
      description: "Create a discount code",
      href: "/dashboard/discounts/new",
      icon: IconDiscount,
      group: "Actions",
    },
    {
      id: "view-store",
      title: "View storefront",
      description: "Open your store in a new tab",
      action: () => window.open("/", "_blank"),
      icon: IconArrowRight,
      group: "Actions",
    },
  ]

  return (
    <>
      {/* Trigger Button in Header */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 h-8 text-sm text-muted-foreground rounded-md border bg-muted/50 hover:bg-muted transition-colors"
      >
        <IconSearch className="size-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-2xs font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={`Search ${storeName || "your store"}...`} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Actions">
            {actionCommands.map((command) => {
              const Icon = command.icon
              return (
                <CommandItem
                  key={command.id}
                  onSelect={() => {
                    if (command.href) {
                      runCommand(() => router.push(command.href!))
                    } else if (command.action) {
                      runCommand(command.action)
                    }
                  }}
                >
                  <Icon className="mr-2 size-4" />
                  <div className="flex-1">
                    <span>{command.title}</span>
                    {command.description && (
                      <span className="ml-2 text-muted-foreground text-xs">
                        {command.description}
                      </span>
                    )}
                  </div>
                  {command.shortcut && (
                    <CommandShortcut>⌘{command.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              )
            })}
          </CommandGroup>

          <CommandSeparator />
          
          <CommandGroup heading="Navigation">
            {navigationCommands.map((command) => {
              const Icon = command.icon
              return (
                <CommandItem
                  key={command.id}
                  onSelect={() => {
                    if (command.href) {
                      runCommand(() => router.push(command.href!))
                    }
                  }}
                >
                  <Icon className="mr-2 size-4" />
                  <span>{command.title}</span>
                  {command.shortcut && (
                    <CommandShortcut>⌘{command.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
