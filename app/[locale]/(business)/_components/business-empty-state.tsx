import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { ArrowRight as IconArrowRight, Box as IconBox, ChartColumn as IconChartBar, Package as IconPackage, Plus as IconPlus, Search as IconSearch, ShoppingCart as IconShoppingCart } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  type: "products" | "orders" | "inventory" | "analytics" | "customers" | "discounts"
  title?: string
  description?: string
  className?: string
}

const emptyStateConfig = {
  products: {
    icon: IconBox,
    primaryAction: {
      href: "/dashboard/products?add=true",
      icon: IconPlus,
    },
    secondaryAction: {
      href: "/dashboard/products/import",
    },
  },
  orders: {
    icon: IconShoppingCart,
    primaryAction: {
      href: "/dashboard/products",
      icon: IconBox,
    },
    secondaryAction: {
      href: "/dashboard/orders/new",
    },
  },
  inventory: {
    icon: IconPackage,
    primaryAction: {
      href: "/dashboard/products?add=true",
      icon: IconPlus,
    },
    secondaryAction: {
      href: "/dashboard/inventory/import",
    },
  },
  analytics: {
    icon: IconChartBar,
    primaryAction: {
      href: "/dashboard",
      icon: IconArrowRight,
    },
    secondaryAction: null,
  },
  customers: {
    icon: IconSearch,
    primaryAction: {
      href: "/dashboard/products",
      icon: IconBox,
    },
    secondaryAction: null,
  },
  discounts: {
    icon: IconBox,
    primaryAction: {
      href: "/dashboard/discounts/new",
      icon: IconPlus,
    },
    secondaryAction: null,
  },
}

export async function BusinessEmptyState({ type, title, description, className }: EmptyStateProps) {
  const t = await getTranslations("BusinessEmptyState")
  const config = emptyStateConfig[type]
  const Icon = config.icon
  const tips = [0, 1, 2].map((tipIndex) => t(`${type}.tips.${tipIndex}`))

  return (
    <div className={cn("px-4 lg:px-6", className)}>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          {/* Icon */}
          <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
            <Icon className="size-8 text-muted-foreground" />
          </div>

          {/* Text */}
          <h3 className="text-lg font-semibold mb-1">
            {title || t(`${type}.title`)}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            {description || t(`${type}.description`)}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-8">
            <Button asChild>
              <Link href={config.primaryAction.href}>
                {config.primaryAction.icon && (
                  <config.primaryAction.icon className="size-4 mr-1.5" />
                )}
                {t(`${type}.primaryAction.label`)}
              </Link>
            </Button>
            {config.secondaryAction && (
              <Button variant="outline" asChild>
                <Link href={config.secondaryAction.href}>
                  {t(`${type}.secondaryAction.label`)}
                </Link>
              </Button>
            )}
          </div>

          {/* Tips */}
          <div className="w-full max-w-md">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              {t("tipsLabel")}
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
