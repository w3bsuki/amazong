"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { PlanCard, type Plan } from "@/components/pricing/plan-card"

function formatEUR(price: number, locale: string) {
  if (price === 0) return locale === "bg" ? "Безплатно" : "Free"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price)
}

function getFee(plan: Plan) {
  return plan.final_value_fee ?? plan.commission_rate ?? 0
}

function getListingsLabel(plan: Plan, locale: string) {
  const value = plan.max_listings ?? Infinity
  const label = value === Infinity ? (locale === "bg" ? "Неограничено" : "Unlimited") : String(value)
  return label
}

function getBillingLabel(locale: string, billingPeriod: "monthly" | "yearly") {
  if (locale === "bg") return billingPeriod === "monthly" ? "мес" : "год"
  return billingPeriod === "monthly" ? "mo" : "yr"
}

function PlansRow({
  plans,
  locale,
  billingPeriod,
}: {
  plans: Plan[]
  locale: string
  billingPeriod: "monthly" | "yearly"
}) {
  const canShowFiveGrid = plans.length > 0 && plans.length <= 5

  return (
    <div
      className={cn(
        "pt-3",
        // Always a single row (no wrapping) with horizontal scroll
        "-mx-4 px-4 flex gap-4 overflow-x-auto overflow-y-visible pb-4 no-scrollbar",
        // Desktop: if <= 5 plans, switch to true 5-up grid
        canShowFiveGrid && "xl:mx-0 xl:px-0 xl:grid xl:grid-cols-5 xl:overflow-visible xl:pb-0",
        !canShowFiveGrid && "xl:mx-0 xl:px-0"
      )}
    >
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} locale={locale} billingPeriod={billingPeriod} variant="full" />
      ))}
    </div>
  )
}

export default function DemoPlansPage() {
  const params = useParams()
  const locale = (params?.locale as string) || "en"

  const [accountType, setAccountType] = useState<"personal" | "business">("personal")
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/plans")
        if (!res.ok) return
        const data = (await res.json()) as Plan[]
        if (!cancelled) setPlans(Array.isArray(data) ? data : [])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const personalPlans = useMemo(
    () => plans.filter((p) => p.account_type === "personal"),
    [plans]
  )
  const businessPlans = useMemo(
    () => plans.filter((p) => p.account_type === "business"),
    [plans]
  )

  const visiblePlans = accountType === "personal" ? personalPlans : businessPlans
  const feeRange = useMemo(() => {
    const fees = visiblePlans.map(getFee).filter((v) => typeof v === "number")
    if (fees.length === 0) return null
    const min = Math.min(...fees)
    const max = Math.max(...fees)
    return { min, max }
  }, [visiblePlans])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Link href={`/${locale}`} className="font-semibold tracking-tight">
              Amazong
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <nav className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
              <Link href={`/${locale}/demo`} className="hover:text-foreground transition-colors">
                Demo
              </Link>
              <Link href={`/${locale}/dashboard`} className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href={`/${locale}/account`} className="hover:text-foreground transition-colors">
                Account
              </Link>
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href={`/${locale}/sell`}>Start selling</Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Account" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/account`}>Open account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/account/plans`}>Manage plan</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/account/orders`}>Orders</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/help`}>Help</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-10 space-y-10">
        <section className="space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Seller plans</Badge>
              {feeRange ? (
                <Badge variant="secondary">
                  {locale === "bg" ? "Такса при продажба" : "Fee when sold"}: {feeRange.min}%–{feeRange.max}%
                </Badge>
              ) : null}
              <Badge variant="secondary">No setup fees</Badge>
              <Badge variant="secondary">Cancel anytime</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Lower fees as you scale</h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-3xl">
              Clear pricing for sellers: pick a subscription for features and limits, then pay a final value fee only when a sale is
              successfully completed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Tabs value={accountType} onValueChange={(v) => setAccountType(v as "personal" | "business")}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">Monthly</div>
              <Switch
                checked={billingPeriod === "yearly"}
                onCheckedChange={(checked) => setBillingPeriod(checked ? "yearly" : "monthly")}
                aria-label="Toggle yearly billing"
              />
              <div className="text-sm">
                Yearly <span className="text-muted-foreground">(save)</span>
              </div>
            </div>

            <div className="sm:ml-auto flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/${locale}/sell`}>Start selling</Link>
              </Button>
              <Button asChild>
                <Link href={`/${locale}/account/plans`}>Manage plan</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Plans</h2>
              <p className="text-sm text-muted-foreground">
                Desktop: always a single row (no wrapping). Shows 5-up when available.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
              <Link href={`/${locale}/plans`}>Compare with production /plans</Link>
            </Button>
          </div>

          {loading ? (
            <div className="-mx-4 px-4 pt-3 flex gap-4 overflow-x-auto overflow-y-visible pb-4 no-scrollbar xl:mx-0 xl:px-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[calc(100vw-3rem)] max-w-[360px] shrink-0 rounded-xl border bg-card p-6 animate-pulse">
                  <div className="h-6 w-28 bg-muted rounded mb-3" />
                  <div className="h-10 w-40 bg-muted rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-11/12 bg-muted rounded" />
                    <div className="h-3 w-10/12 bg-muted rounded" />
                  </div>
                  <div className="h-10 w-full bg-muted rounded mt-6" />
                </div>
              ))}
            </div>
          ) : (
            <Tabs value={accountType} className="w-full">
              <TabsContent value="personal" className="mt-0">
                <PlansRow plans={personalPlans} locale={locale} billingPeriod={billingPeriod} />
              </TabsContent>
              <TabsContent value="business" className="mt-0">
                <PlansRow plans={businessPlans} locale={locale} billingPeriod={billingPeriod} />
              </TabsContent>
            </Tabs>
          )}
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">What you pay (simple)</h2>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Keep the page conversion-focused: subscription is optional, and the main transaction cost is a fee when sold.
            </p>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Charge</TableHead>
                  <TableHead>When it applies</TableHead>
                  <TableHead className="text-right">How it’s calculated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Subscription</TableCell>
                  <TableCell className="text-muted-foreground">Monthly or yearly (optional)</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {billingPeriod === "monthly" ? "Per month" : "Per year"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Final value fee</TableCell>
                  <TableCell className="text-muted-foreground">Only after a successful sale</TableCell>
                  <TableCell className="text-right text-muted-foreground">Percent of the order subtotal</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Per-order fee</TableCell>
                  <TableCell className="text-muted-foreground">Only after a successful sale</TableCell>
                  <TableCell className="text-right text-muted-foreground">Flat fee (varies by plan)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Listing fee</TableCell>
                  <TableCell className="text-muted-foreground">After you exceed included listings</TableCell>
                  <TableCell className="text-right text-muted-foreground">Per extra listing (varies by plan)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {visiblePlans.length > 0 ? (
            <div className="text-sm text-muted-foreground">
              Current selection: <span className="font-medium text-foreground">{accountType}</span>. Plans range from{" "}
              <span className="font-medium text-foreground">{getFee(visiblePlans[0])}%</span> to{" "}
              <span className="font-medium text-foreground">{getFee(visiblePlans[visiblePlans.length - 1])}%</span> fee when sold.
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Quick comparison</h2>
            <p className="text-sm text-muted-foreground max-w-3xl">
              A clean, scan-friendly table beats “AI slop” paragraphs.
            </p>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Price / {getBillingLabel(locale, billingPeriod)}</TableHead>
                  <TableHead className="text-right">Fee when sold</TableHead>
                  <TableHead className="text-right">Listings</TableHead>
                  <TableHead className="text-right">Boosts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePlans.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right">
                      {billingPeriod === "monthly" ? formatEUR(p.price_monthly, locale) : formatEUR(p.price_yearly, locale)}
                    </TableCell>
                    <TableCell className="text-right">{getFee(p)}%</TableCell>
                    <TableCell className="text-right">{getListingsLabel(p, locale)}</TableCell>
                    <TableCell className="text-right">{p.boosts_included >= 999 ? "∞" : p.boosts_included}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">FAQ</h2>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Short answers, zero fluff.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Do I pay anything upfront?</AccordionTrigger>
              <AccordionContent>
                You can start on a free tier (if available) and pay only when an item sells. Subscriptions are optional and mainly
                unlock features, limits, and lower fees.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What does “fee when sold” mean?</AccordionTrigger>
              <AccordionContent>
                It’s charged only after a successful sale (paid order). If you don’t sell, you don’t pay the transaction fee.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Why does the fee decrease on higher plans?</AccordionTrigger>
              <AccordionContent>
                Higher-volume sellers get better economics: the subscription helps cover platform costs, and we can reduce the fee when sold.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Is 12% too high?</AccordionTrigger>
              <AccordionContent>
                It depends on category and margins. Many marketplaces land between ~5%–15%. If you’re targeting low-fee positioning,
                consider category-based fees or an introductory launch offer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </div>
  )
}
