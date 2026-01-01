"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChartBar,
  Check,
  CreditCard,
  Crown,
  Lightning,
  Question,
  Rocket,
  ShieldCheck,
  Sparkle,
  Star,
  Storefront,
  User,
} from "@phosphor-icons/react"
import { MinimalHeader } from "@/components/layout/header/minimal-header"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import * as PricingCard from "./pricing-card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  createSubscriptionCheckoutSession,
  downgradeToFreeTier,
} from "@/app/actions/subscriptions"

interface SubscriptionPlanRow {
  id: string
  name?: string | null
  tier?: string | null
  account_type?: string | null
  price_monthly?: number | null
  price_yearly?: number | null
  final_value_fee?: number | null
  commission_rate?: number | null
  max_listings?: number | null
  boosts_included?: number | null
  priority_support?: boolean | null
  description?: string | null
  features?: unknown
}

const planIcons: Record<string, React.ReactNode> = {
  free: <User weight="regular" className="size-4" />,
  basic: <User weight="regular" className="size-4" />,
  starter: <Storefront weight="regular" className="size-4" />,
  premium: <Crown weight="regular" className="size-4" />,
  pro: <Star weight="regular" className="size-4" />,
  ultimate: <Rocket weight="regular" className="size-4" />,
}

const content = {
  en: {
    back: "Back",
    title: "Choose your plan",
    subtitle: "Start free, upgrade when you're ready. Only pay a fee when you sell.",
    personal: "Personal",
    business: "Business",
    monthly: "Monthly",
    yearly: "Yearly",
    saveLabel: "Save 20%",
    getStarted: "Get Started",
    current: "Current",
    feeLabel: "fee when sold",
    nav: {
      pricing: "Pricing",
      comparison: "Compare",
      features: "Features",
      faq: "FAQ",
      guarantee: "Guarantee",
    },
    features: {
      title: "Why upgrade?",
      subtitle: "Unlock powerful tools to grow your business",
      items: [
        {
          icon: "lightning",
          title: "Lower fees",
          desc: "Keep more of your earnings with reduced commission rates",
        },
        {
          icon: "rocket",
          title: "More visibility",
          desc: "Monthly boosts to get your listings seen by more buyers",
        },
        {
          icon: "sparkle",
          title: "Priority support",
          desc: "Get help faster with dedicated support channels",
        },
      ],
    },
    guarantee: {
      title: "30-day money-back guarantee",
      desc: "Try any paid plan risk-free. If you're not satisfied, we'll refund your subscription - no questions asked.",
    },
    comparison: {
      title: "Compare plans side by side",
      subtitle: "See exactly what's included in each plan",
      plan: "Plan",
      price: "Price",
      fee: "Fee when sold",
      listings: "Active listings",
      boosts: "Boosts/month",
      support: "Priority support",
      unlimited: "Unlimited",
      free: "Free",
    },
    faq: {
      title: "Frequently asked questions",
      subtitle: "Everything you need to know about our plans",
      items: [
        {
          q: "Do I pay anything upfront?",
          a: "No. Start on the free plan and only pay when you sell. Subscriptions are optional and unlock lower fees.",
        },
        {
          q: "What is the fee when sold?",
          a: "It's a percentage of the sale price, only charged after a successful sale. No sale = no fee.",
        },
        {
          q: "Can I switch plans anytime?",
          a: "Yes. Upgrade or downgrade whenever you want. Changes apply immediately with prorated billing.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept Visa, Mastercard, Amex, Apple Pay, and Google Pay via Stripe.",
        },
        {
          q: "Is there a contract or commitment?",
          a: "No contracts. Cancel anytime. Monthly plans renew monthly, yearly plans renew annually.",
        },
        {
          q: "What happens when I cancel?",
          a: "You keep your benefits until the end of your billing period. After that, you'll be moved to the free plan.",
        },
      ],
    },
  },
  bg: {
    back: "Назад",
    title: "Изберете план",
    subtitle: "Започнете безплатно, надградете когато сте готови. Плащате само при продажба.",
    personal: "Личен",
    business: "Бизнес",
    monthly: "Месечно",
    yearly: "Годишно",
    saveLabel: "Спестете 20%",
    getStarted: "Започни",
    current: "Текущ",
    feeLabel: "такса при продажба",
    nav: {
      pricing: "Цени",
      comparison: "Сравнение",
      features: "Предимства",
      faq: "Въпроси",
      guarantee: "Гаранция",
    },
    features: {
      title: "Защо да надградите?",
      subtitle: "Отключете мощни инструменти за растеж",
      items: [
        {
          icon: "lightning",
          title: "По-ниски такси",
          desc: "Запазете повече от приходите си с намалени комисиони",
        },
        {
          icon: "rocket",
          title: "Повече видимост",
          desc: "Месечни бустове за повече гледания на обявите ви",
        },
        {
          icon: "sparkle",
          title: "Приоритетна поддръжка",
          desc: "Получете помощ по-бързо с директна връзка",
        },
      ],
    },
    guarantee: {
      title: "30-дневна гаранция за връщане",
      desc: "Пробвайте всеки платен план без риск. Ако не сте доволни, ще възстановим сумата.",
    },
    comparison: {
      title: "Сравнете плановете",
      subtitle: "Вижте точно какво включва всеки план",
      plan: "План",
      price: "Цена",
      fee: "Такса при продажба",
      listings: "Активни обяви",
      boosts: "Бустове/месец",
      support: "Приоритетна поддръжка",
      unlimited: "Неограничено",
      free: "Безплатно",
    },
    faq: {
      title: "Често задавани въпроси",
      subtitle: "Всичко, което трябва да знаете за плановете",
      items: [
        {
          q: "Плащам ли нещо предварително?",
          a: "Не. Започнете с безплатен план и плащайте само при продажба.",
        },
        {
          q: "Каква е таксата при продажба?",
          a: "Процент от продажната цена, само след успешна продажба. Няма продажба = няма такса.",
        },
        {
          q: "Мога ли да сменя плана?",
          a: "Да. Надградете или понижете когато искате. Промените са незабавни с пропорционално фактуриране.",
        },
        {
          q: "Какви методи на плащане приемате?",
          a: "Приемаме Visa, Mastercard, Amex, Apple Pay и Google Pay чрез Stripe.",
        },
        {
          q: "Има ли договор или ангажимент?",
          a: "Без договори. Откажете по всяко време. Месечните планове се подновяват месечно, годишните - годишно.",
        },
        {
          q: "Какво става при отказ?",
          a: "Запазвате предимствата до края на периода. След това преминавате към безплатен план.",
        },
      ],
    },
  },
}

const navItems = [
  { id: "pricing", icon: CreditCard },
  { id: "features", icon: Sparkle },
  { id: "comparison", icon: ChartBar },
  { id: "guarantee", icon: ShieldCheck },
  { id: "faq", icon: Question },
] as const

const featureIcons = {
  lightning: Lightning,
  rocket: Rocket,
  sparkle: Sparkle,
}

export default function PlansPageClient(props: {
  locale: string
  initialPlans: SubscriptionPlanRow[]
  initialUserId: string | null
  initialCurrentTier: string
}) {
  const router = useRouter()
  const locale = props.locale || "en"
  const t = content[locale as keyof typeof content] || content.en

  const [accountType, setAccountType] = useState<"personal" | "business">("personal")
  const [yearly, setYearly] = useState(false)
  const [plans] = useState<SubscriptionPlanRow[]>(props.initialPlans)
  const [loading] = useState(false)
  const [userId] = useState<string | null>(props.initialUserId)
  const [currentTier, setCurrentTier] = useState<string>(props.initialCurrentTier || "free")
  const [subscribingId, setSubscribingId] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("pricing")

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -60% 0px" }
    )

    navItems.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => !p.account_type || p.account_type === accountType)
  }, [plans, accountType])

  const handleSelect = async (planId: string, price: number, isCurrent: boolean) => {
    if (!userId) {
      router.push(`/${locale}/auth/login?next=/${locale}/plans`)
      return
    }

    if (isCurrent) return

    setSubscribingId(planId)

    try {
      if (price === 0) {
        const res = await downgradeToFreeTier()
        if (res?.error) throw new Error(res.error)
        setCurrentTier("free")
        toast.success(locale === "bg" ? "Планът е сменен" : "Plan changed")
      } else {
        const billingPeriod = yearly ? "yearly" : "monthly"
        const res = await createSubscriptionCheckoutSession({ planId, billingPeriod })
        if (res?.error) throw new Error(res.error)
        if (res?.url) window.location.href = res.url
      }
    } catch {
      toast.error(locale === "bg" ? "Грешка" : "Error")
    } finally {
      setSubscribingId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      <MinimalHeader showBack={false}>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ id, icon: Icon }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection(id)}
              className={cn(
                "gap-2 text-muted-foreground",
                activeSection === id && "bg-muted text-foreground"
              )}
            >
              <Icon className="size-4" weight={activeSection === id ? "fill" : "regular"} />
              <span className="text-sm">{t.nav[id as keyof typeof t.nav]}</span>
            </Button>
          ))}
        </nav>
      </MinimalHeader>

      <main className="container py-12">
        <section
          id="pricing"
          ref={(el) => {
            sectionRefs.current.pricing = el
          }}
          className="mb-12 scroll-mt-20 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t.subtitle}</p>
        </section>

        <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex items-center gap-3 rounded-full border bg-muted/30 p-1">
            <button
              onClick={() => setAccountType("personal")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                accountType === "personal"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.personal}
            </button>
            <button
              onClick={() => setAccountType("business")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                accountType === "business"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.business}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className={cn("text-sm", !yearly && "font-medium")}>{t.monthly}</span>
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <span className={cn("text-sm", yearly && "font-medium")}>{t.yearly}</span>
            {yearly && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {t.saveLabel}
              </span>
            )}
          </div>
        </div>

        <section className="mb-16">
          <div>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-md border p-1.5">
                    <div className="rounded-md bg-muted/50 p-4">
                      <div className="mb-6 h-5 w-20 rounded bg-muted" />
                      <div className="mb-3 h-8 w-16 rounded bg-muted" />
                      <div className="h-9 w-full rounded bg-muted" />
                    </div>
                    <div className="space-y-2 p-3">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="h-4 w-full rounded bg-muted" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredPlans.map((plan) => {
                  const price = yearly ? (plan.price_yearly ?? 0) : (plan.price_monthly ?? 0)
                  const originalPrice = yearly ? (plan.price_monthly ?? 0) * 12 : null
                  const isCurrent =
                    plan.tier === currentTier || (currentTier === "free" && plan.tier === "basic")
                  const isPopular = plan.tier === "premium"
                  const features = Array.isArray(plan.features)
                    ? (plan.features as string[]).slice(0, 5)
                    : []
                  const fee = plan.final_value_fee ?? plan.commission_rate ?? 0
                  const icon =
                    planIcons[plan.tier?.toLowerCase() ?? "basic"] ?? (
                      <User weight="regular" className="size-4" />
                    )

                  return (
                    <PricingCard.Card key={plan.id}>
                      <PricingCard.Header>
                        <PricingCard.Plan>
                          <PricingCard.PlanName>
                            {icon}
                            <span>{plan.name}</span>
                          </PricingCard.PlanName>
                          {isPopular && <PricingCard.Badge>Popular</PricingCard.Badge>}
                          {isCurrent && <PricingCard.Badge>{t.current}</PricingCard.Badge>}
                        </PricingCard.Plan>
                        <PricingCard.Price>
                          <PricingCard.MainPrice>
                            {price === 0 ? t.comparison.free : `€${price}`}
                          </PricingCard.MainPrice>
                          {price > 0 && (
                            <PricingCard.Period>
                              /
                              {yearly
                                ? locale === "bg"
                                  ? "год"
                                  : "yr"
                                : locale === "bg"
                                  ? "мес"
                                  : "mo"}
                            </PricingCard.Period>
                          )}
                          {yearly && originalPrice && originalPrice > price && (
                            <PricingCard.OriginalPrice>
                              €{originalPrice}
                            </PricingCard.OriginalPrice>
                          )}
                        </PricingCard.Price>
                        <PricingCard.Fee>
                          {fee}% {t.feeLabel}
                        </PricingCard.Fee>
                        <Button
                          className="mt-3 w-full"
                          size="sm"
                          disabled={isCurrent || subscribingId === plan.id}
                          onClick={() => handleSelect(plan.id, price, isCurrent)}
                        >
                          {subscribingId === plan.id
                            ? "..."
                            : isCurrent
                              ? t.current
                              : t.getStarted}
                        </Button>
                      </PricingCard.Header>

                      <PricingCard.Body>
                        <PricingCard.Description>{plan.description}</PricingCard.Description>
                        <PricingCard.List>
                          {features.map((feature, i) => (
                            <PricingCard.ListItem key={i}>
                              <Check weight="bold" className="mt-0.5 size-3.5 shrink-0" />
                              <span>{feature}</span>
                            </PricingCard.ListItem>
                          ))}
                        </PricingCard.List>
                      </PricingCard.Body>
                    </PricingCard.Card>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section
          id="features"
          ref={(el) => {
            sectionRefs.current.features = el
          }}
          className="mb-16 scroll-mt-20"
        >
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight">{t.features.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-3">
            {t.features.items.map((feature, i) => {
              const Icon = featureIcons[feature.icon as keyof typeof featureIcons]
              return (
                <div key={i} className="flex flex-col items-center bg-background p-4 text-center">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" weight="fill" />
                  </div>
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        <section
          id="comparison"
          ref={(el) => {
            sectionRefs.current.comparison = el
          }}
          className="mb-16 scroll-mt-20"
        >
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight">{t.comparison.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {t.comparison.subtitle}
            </p>
          </div>

          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="h-12 w-[220px] pl-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.comparison.plan}
                  </TableHead>
                  <TableHead className="h-12 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.comparison.price}
                  </TableHead>
                  <TableHead className="h-12 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.comparison.fee}
                  </TableHead>
                  <TableHead className="h-12 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.comparison.listings}
                  </TableHead>
                  <TableHead className="h-12 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.comparison.boosts}
                  </TableHead>
                  <TableHead className="h-12 pr-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.comparison.support}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan, index) => {
                  const price = yearly ? (plan.price_yearly ?? 0) : (plan.price_monthly ?? 0)
                  const isCurrent =
                    plan.tier === currentTier || (currentTier === "free" && plan.tier === "basic")
                  const isPopular = plan.tier === "premium"

                  return (
                    <TableRow
                      key={plan.id}
                      className={cn(
                        "h-16",
                        index === filteredPlans.length - 1 && "border-0",
                        isPopular && "bg-primary/5"
                      )}
                    >
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex size-9 items-center justify-center rounded-lg",
                              isPopular
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {planIcons[plan.tier ?? "free"]}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{plan.name}</span>
                            {(isCurrent || isPopular) && (
                              <span
                                className={cn(
                                  "text-xs",
                                  isCurrent ? "text-primary" : "text-muted-foreground"
                                )}
                              >
                                {isCurrent ? t.current : "Most popular"}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-base font-bold tabular-nums">
                          {price === 0 ? t.comparison.free : formatPrice(price)}
                        </span>
                        {price > 0 && (
                          <span className="text-xs text-muted-foreground">
                            /
                            {yearly
                              ? locale === "bg"
                                ? "год"
                                : "yr"
                              : locale === "bg"
                                ? "мес"
                                : "mo"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold tabular-nums">
                          {plan.final_value_fee ?? plan.commission_rate ?? 0}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {plan.max_listings == null || plan.max_listings >= 9999 ? (
                          <span className="text-primary font-medium">{t.comparison.unlimited}</span>
                        ) : (
                          plan.max_listings
                        )}
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {(plan.boosts_included ?? 0) >= 999 ? (
                          <span className="text-primary font-medium">∞</span>
                        ) : (
                          plan.boosts_included ?? 0
                        )}
                      </TableCell>
                      <TableCell className="pr-4 text-center">
                        {plan.priority_support ? (
                          <Check weight="bold" className="mx-auto size-5 text-primary" />
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </section>

        <section
          id="guarantee"
          ref={(el) => {
            sectionRefs.current.guarantee = el
          }}
          className="mb-16 scroll-mt-20"
        >
          <div className="flex flex-col items-center gap-4 rounded-md border border-primary/20 bg-primary/5 p-4 text-center sm:flex-row sm:text-left">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="size-6 text-primary" weight="fill" />
            </div>
            <div>
              <h3 className="font-semibold">{t.guarantee.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.guarantee.desc}</p>
            </div>
          </div>
        </section>

        <section
          id="faq"
          ref={(el) => {
            sectionRefs.current.faq = el
          }}
          className="scroll-mt-20"
        >
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight">{t.faq.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="overflow-hidden rounded-md border">
            <Accordion type="single" collapsible className="w-full">
              {t.faq.items.map((item, i) => (
                <AccordionItem key={i} value={`q${i}`} className="border-b px-0 last:border-0">
                  <AccordionTrigger className="px-5 py-4 text-left text-sm hover:no-underline data-[state=open]:bg-muted/30">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <span className="text-sm text-muted-foreground">© 2025 Treido</span>
          <div className="flex gap-4 text-sm">
            <Link href={`/${locale}/terms`} className="text-muted-foreground hover:text-foreground">
              {locale === "bg" ? "Условия" : "Terms"}
            </Link>
            <Link href={`/${locale}/privacy`} className="text-muted-foreground hover:text-foreground">
              {locale === "bg" ? "Поверителност" : "Privacy"}
            </Link>
            <Link href={`/${locale}/contact`} className="text-muted-foreground hover:text-foreground">
              {locale === "bg" ? "Контакт" : "Contact"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
