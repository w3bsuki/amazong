"use client"

import * as React from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
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
} from "@/lib/icons/tabler"
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
  compact?: boolean
  enableKeyboardShortcut?: boolean
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

export function BusinessCommandPalette({
  storeName,
  compact = false,
  enableKeyboardShortcut = true,
}: CommandPaletteProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const t = useTranslations("BusinessCommandPalette")
  const tCommon = useTranslations("Common")

  // Listen for keyboard shortcut
  React.useEffect(() => {
    if (!enableKeyboardShortcut) {
      return
    }

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [enableKeyboardShortcut])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const storeLabel = storeName || t("yourStore")

  const navigationCommands: CommandOption[] = [
    {
      id: "home",
      title: t("nav.home"),
      href: "/dashboard",
      icon: IconHome,
      shortcut: "H",
      group: "Navigation",
    },
    {
      id: "orders",
      title: t("nav.orders"),
      href: "/dashboard/orders",
      icon: IconShoppingCart,
      shortcut: "O",
      group: "Navigation",
    },
    {
      id: "products",
      title: t("nav.products"),
      href: "/dashboard/products",
      icon: IconBox,
      shortcut: "P",
      group: "Navigation",
    },
    {
      id: "inventory",
      title: t("nav.inventory"),
      href: "/dashboard/inventory",
      icon: IconPackage,
      group: "Navigation",
    },
    {
      id: "analytics",
      title: t("nav.analytics"),
      href: "/dashboard/analytics",
      icon: IconChartBar,
      shortcut: "A",
      group: "Navigation",
    },
    {
      id: "accounting",
      title: t("nav.finances"),
      href: "/dashboard/accounting",
      icon: IconReceipt,
      group: "Navigation",
    },
    {
      id: "customers",
      title: t("nav.customers"),
      href: "/dashboard/customers",
      icon: IconUsers,
      group: "Navigation",
    },
    {
      id: "discounts",
      title: t("nav.discounts"),
      href: "/dashboard/discounts",
      icon: IconTag,
      group: "Navigation",
    },
    {
      id: "settings",
      title: t("nav.settings"),
      href: "/dashboard/settings",
      icon: IconSettings,
      shortcut: "S",
      group: "Navigation",
    },
  ]

  const actionCommands: CommandOption[] = [
    {
      id: "add-product",
      title: t("actions.addProduct"),
      description: t("actions.addProductDesc"),
      href: "/dashboard/products?add=true",
      icon: IconPlus,
      shortcut: "N",
      group: "Actions",
    },
    {
      id: "create-order",
      title: t("actions.createOrder"),
      description: t("actions.createOrderDesc"),
      action: () => router.push("/dashboard/orders/new"),
      icon: IconFileText,
      group: "Actions",
    },
    {
      id: "create-discount",
      title: t("actions.createDiscount"),
      description: t("actions.createDiscountDesc"),
      href: "/dashboard/discounts/new",
      icon: IconDiscount,
      group: "Actions",
    },
    {
      id: "view-store",
      title: t("actions.viewStorefront"),
      description: t("actions.viewStorefrontDesc"),
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
        className={`flex items-center rounded-md border bg-surface-subtle text-muted-foreground hover:bg-hover transition-colors ${
          compact ? "size-9 justify-center" : "h-8 gap-2 px-3 text-sm"
        }`}
        aria-label={t("trigger")}
      >
        <IconSearch className="size-4" />
        {compact ? (
          <span className="sr-only">{t("trigger")}</span>
        ) : (
          <>
            <span>{t("trigger")}</span>
            <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-2xs font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </>
        )}
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t("dialogTitle")}
        description={t("dialogDescription")}
        closeLabel={tCommon("close")}
      >
        <CommandInput placeholder={t("searchPlaceholder", { storeName: storeLabel })} />
        <CommandList>
          <CommandEmpty>{t("noResults")}</CommandEmpty>
          
          <CommandGroup heading={t("groups.actions")}>
            {actionCommands.map((command) => {
              const Icon = command.icon
              return (
                <CommandItem
                  key={command.id}
                  onSelect={() => {
                    const href = command.href
                    if (href) {
                      runCommand(() => router.push(href))
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
          
          <CommandGroup heading={t("groups.navigation")}>
            {navigationCommands.map((command) => {
              const Icon = command.icon
              return (
                <CommandItem
                  key={command.id}
                  onSelect={() => {
                    const href = command.href
                    if (href) {
                      runCommand(() => router.push(href))
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
