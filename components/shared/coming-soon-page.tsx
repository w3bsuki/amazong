"use client"

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { 
  RocketLaunch, Bell, ArrowLeft, CheckCircle
} from "@phosphor-icons/react"
import { useState, useTransition } from "react"
import type { ReactNode } from "react"

interface ComingSoonPageProps {
  /** The icon to display (Phosphor icon component) */
  icon: ReactNode
  /** The main title */
  title: string
  /** A brief description of what this feature will be */
  description: string
  /** Expected launch timeframe (e.g., "Q1 2025", "Coming Soon") */
  timeline?: string
  /** List of features/benefits this page will have */
  features?: string[]
  /** Labels for i18n */
  labels: {
    backToHome: string
    notifyMe: string
    emailLabel: string
    emailPlaceholder: string
    subscribing: string
    subscribed: string
    expectedLaunch: string
    whatToExpect: string
  }
}

export function ComingSoonPage({
  icon,
  title,
  description,
  timeline = "Coming Soon",
  features = [],
  labels,
}: ComingSoonPageProps) {
  const [email, setEmail] = useState("")
  const [isPending, startTransition] = useTransition()
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (formData: FormData) => {
    const emailValue = formData.get("email") as string
    if (!emailValue) return
    
    startTransition(async () => {
      // Simulate API call - in production, this would save to newsletter list
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubscribed(true)
    })
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header with back button */}
      <div className="container py-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            {labels.backToHome}
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 container flex items-center justify-center py-12">
        <div className="max-w-xl w-full text-center">
          {/* Icon */}
          <div className="flex justify-center mb-3">
            <div className="size-20 bg-brand/10 rounded-md flex items-center justify-center text-brand">
              {icon}
            </div>
          </div>

          {/* Title & Description */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{description}</p>

          {/* Timeline badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-urgency-stock-bg text-urgency-stock-text rounded-full text-sm font-medium mb-4">
            <RocketLaunch className="size-4" weight="fill" />
            {labels.expectedLaunch}: {timeline}
          </div>

          {/* Email signup */}
          <Card className="mb-8">
            <CardContent className="p-6">
              {!isSubscribed ? (
                <form action={handleSubmit} className="space-y-4">
                  <p className="font-medium">{labels.notifyMe}</p>
                  <FieldLabel htmlFor="coming-soon-email" className="sr-only">
                    {labels.emailLabel}
                  </FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      id="coming-soon-email"
                      type="email"
                      name="email"
                      placeholder={labels.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={isPending}
                      className="bg-brand hover:bg-brand-dark"
                    >
                      {isPending ? (
                        <>
                          <Bell className="size-4 mr-2 animate-pulse" />
                          {labels.subscribing}
                        </>
                      ) : (
                        <>
                          <Bell className="size-4 mr-2" />
                          {labels.notifyMe}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-3 text-status-success">
                  <CheckCircle className="size-6" weight="fill" />
                  <span className="font-medium">{labels.subscribed}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features list */}
          {features.length > 0 && (
            <div className="text-left">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                {labels.whatToExpect}
              </h2>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-brand shrink-0 mt-0.5" weight="fill" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
