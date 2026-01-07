"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import {
  IconCheck,
  IconX,
  IconBox,
  IconBuildingStore,
  IconCreditCard,
  IconTruck,
  IconChevronRight,
  IconRocket,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface SetupStep {
  id: string
  title: string
  description: string
  href: string
  icon: React.ElementType
  completed: boolean
}

interface BusinessSetupGuideProps {
  storeName?: string
  hasProducts: boolean
  hasDescription: boolean
  hasPaymentSetup: boolean
  hasShippingSetup: boolean
  hasLogo: boolean
  onDismiss?: () => void
}

export function BusinessSetupGuide({
  storeName,
  hasProducts,
  hasDescription,
  hasPaymentSetup,
  hasShippingSetup,
  hasLogo,
  onDismiss,
}: BusinessSetupGuideProps) {
  const [isDismissed, setIsDismissed] = React.useState(false)

  const steps: SetupStep[] = [
    {
      id: "store-profile",
      title: "Complete store profile",
      description: "Add a description and logo to build trust",
      href: "/dashboard/settings",
      icon: IconBuildingStore,
      completed: hasDescription && hasLogo,
    },
    {
      id: "add-products",
      title: "Add your first product",
      description: "List products to start selling",
      href: "/dashboard/products?add=true",
      icon: IconBox,
      completed: hasProducts,
    },
    {
      id: "shipping",
      title: "Set up shipping",
      description: "Configure delivery options for customers",
      href: "/dashboard/settings?tab=shipping",
      icon: IconTruck,
      completed: hasShippingSetup,
    },
    {
      id: "payment",
      title: "Configure payments",
      description: "Set up how you'll get paid",
      href: "/dashboard/settings?tab=payments",
      icon: IconCreditCard,
      completed: hasPaymentSetup,
    },
  ]

  const completedCount = steps.filter(s => s.completed).length
  const totalSteps = steps.length
  const progressPercent = (completedCount / totalSteps) * 100
  const allComplete = completedCount === totalSteps

  if (isDismissed || allComplete) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  return (
    <div className="px-4 lg:px-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <IconRocket className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base">
                  Launch your store, {storeName || 'Seller'}! 🚀
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Complete these steps to get your store ready for customers
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              onClick={handleDismiss}
            >
              <IconX className="size-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Setup progress</span>
              <span className="font-medium">{completedCount} of {totalSteps} complete</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <Link
                  key={step.id}
                  href={step.href}
                  className="group"
                >
                  <div className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-all",
                    step.completed
                      ? "border-success/30 bg-success/5"
                      : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                  )}>
                    <div className={cn(
                      "flex size-8 items-center justify-center rounded-full shrink-0",
                      step.completed
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                    )}>
                      {step.completed ? (
                        <IconCheck className="size-4" />
                      ) : (
                        <Icon className="size-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        step.completed && "text-success"
                      )}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {step.description}
                      </p>
                    </div>
                    {!step.completed && (
                      <IconChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
