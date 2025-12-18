"use client"

import Link from "next/link"
import {
  IconBox,
  IconPlus,
  IconShoppingCart,
  IconPackage,
  IconChartBar,
  IconSearch,
  IconArrowRight,
} from "@tabler/icons-react"
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
    title: "Add your first product",
    description: "Start selling by creating your first product listing. Add details, images, and pricing to get started.",
    primaryAction: {
      label: "Add product",
      href: "/dashboard/products?add=true",
      icon: IconPlus,
    },
    secondaryAction: {
      label: "Import products",
      href: "/dashboard/products/import",
    },
    tips: [
      "Use high-quality images to showcase your products",
      "Write detailed descriptions with relevant keywords",
      "Set competitive prices based on market research",
    ],
  },
  orders: {
    icon: IconShoppingCart,
    title: "No orders yet",
    description: "When customers make purchases, you'll see their orders here. Share your products to start getting sales!",
    primaryAction: {
      label: "View products",
      href: "/dashboard/products",
      icon: IconBox,
    },
    secondaryAction: {
      label: "Create draft order",
      href: "/dashboard/orders/new",
    },
    tips: [
      "Make sure your products are visible and well-described",
      "Share your store link on social media",
      "Consider running promotions to attract first customers",
    ],
  },
  inventory: {
    icon: IconPackage,
    title: "No inventory to track",
    description: "Add products with inventory tracking enabled to manage your stock levels here.",
    primaryAction: {
      label: "Add product",
      href: "/dashboard/products?add=true",
      icon: IconPlus,
    },
    secondaryAction: {
      label: "Import inventory",
      href: "/dashboard/inventory/import",
    },
    tips: [
      "Enable inventory tracking when creating products",
      "Set low stock alerts to avoid running out",
      "Keep safety stock for popular items",
    ],
  },
  analytics: {
    icon: IconChartBar,
    title: "No data yet",
    description: "Analytics will appear here once you start getting traffic and sales. Check back soon!",
    primaryAction: {
      label: "View dashboard",
      href: "/dashboard",
      icon: IconArrowRight,
    },
    secondaryAction: null,
    tips: [
      "Share your store link to drive traffic",
      "Check back regularly for insights",
      "Analytics update in real-time",
    ],
  },
  customers: {
    icon: IconSearch,
    title: "No customers yet",
    description: "Customers who purchase from your store will appear here. Start selling to build your customer base!",
    primaryAction: {
      label: "View products",
      href: "/dashboard/products",
      icon: IconBox,
    },
    secondaryAction: null,
    tips: [
      "Offer great products at competitive prices",
      "Provide excellent customer service",
      "Build relationships through messages",
    ],
  },
  discounts: {
    icon: IconBox,
    title: "No discounts created",
    description: "Create discount codes to attract customers and boost sales. You can set percentage or fixed amount discounts.",
    primaryAction: {
      label: "Create discount",
      href: "/dashboard/discounts/new",
      icon: IconPlus,
    },
    secondaryAction: null,
    tips: [
      "Use discounts for special promotions",
      "Set expiration dates to create urgency",
      "Track discount performance in analytics",
    ],
  },
}

export function BusinessEmptyState({ type, title, description, className }: EmptyStateProps) {
  const config = emptyStateConfig[type]
  const Icon = config.icon

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
            {title || config.title}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            {description || config.description}
          </p>
          
          {/* Actions */}
          <div className="flex items-center gap-3 mb-8">
            <Button asChild>
              <Link href={config.primaryAction.href}>
                {config.primaryAction.icon && (
                  <config.primaryAction.icon className="size-4 mr-1.5" />
                )}
                {config.primaryAction.label}
              </Link>
            </Button>
            {config.secondaryAction && (
              <Button variant="outline" asChild>
                <Link href={config.secondaryAction.href}>
                  {config.secondaryAction.label}
                </Link>
              </Button>
            )}
          </div>
          
          {/* Tips */}
          <div className="w-full max-w-md">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Tips to get started
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {config.tips.map((tip, i) => (
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
