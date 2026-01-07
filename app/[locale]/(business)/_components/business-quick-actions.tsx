import { Link } from "@/i18n/routing"
import {
  IconPlus,
  IconBox,
  IconShoppingCart,
  IconPackage,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

const quickActions = [
  {
    title: "Add product",
    description: "Create a new listing",
    href: "/dashboard/products?add=true",
    icon: IconPlus,
    variant: "default" as const,
  },
  {
    title: "View orders",
    description: "Manage customer orders",
    href: "/dashboard/orders",
    icon: IconShoppingCart,
    variant: "outline" as const,
  },
  {
    title: "Check inventory",
    description: "Monitor stock levels",
    href: "/dashboard/inventory",
    icon: IconPackage,
    variant: "outline" as const,
  },
  {
    title: "Analytics",
    description: "View performance",
    href: "/dashboard/analytics",
    icon: IconChartBar,
    variant: "outline" as const,
  },
]

export function BusinessQuickActions() {
  return (
    <div className="px-4 lg:px-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.href}
              variant={action.variant}
              size="sm"
              asChild
              className="h-9"
            >
              <Link href={action.href}>
                <action.icon className="size-4 mr-1.5" />
                {action.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
