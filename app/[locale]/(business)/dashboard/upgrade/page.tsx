import { requireBusinessSeller, getActiveSubscription, DASHBOARD_ALLOWED_TIERS } from "@/lib/auth/business"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Link } from "@/i18n/routing"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconRocket,
  IconChartBar,
  IconUsers,
  IconShoppingCart,
  IconCheck,
  IconX,
  IconCrown,
  IconBuildingStore,
  IconArrowRight,
  IconSparkles,
} from "@tabler/icons-react"

// Translations
const translations = {
  en: {
    title: "Unlock Your Business Dashboard",
    subtitle: "Get access to powerful tools to grow your business",
    currentPlan: "Your Current Plan",
    freeTier: "Business Free",
    upgradeTo: "Upgrade to unlock",
    features: "What you'll get",
    upgradeNow: "Upgrade Now",
    viewPlans: "View All Plans",
    perMonth: "/month",
    perYear: "/year",
    saveYearly: "Save 17% with yearly",
    dashboardFeatures: [
      "Real-time analytics dashboard",
      "Advanced inventory management",
      "Customer relationship tools",
      "Marketing & promotions",
      "Discount code management",
      "Accounting & reports",
      "Priority business support",
      "Bulk listing tools",
      "API access",
    ],
    freeFeatures: [
      "100 active listings",
      "1.5% seller fee",
      "Buyer Protection: 3% + €0.35 (cap €12)",
      "Basic analytics",
      "Verified Business badge",
      "Invoice support",
    ],
    proFeatures: [
      "2,000 active listings",
      "1% seller fee",
      "Buyer Protection: 2.5% + €0.25 (cap €10)",
      "Full analytics dashboard",
      "/dashboard access",
      "20 boosts/month (24h)",
      "Team accounts (up to 3)",
      "Priority support",
      "Bulk listing tools",
    ],
    enterpriseFeatures: [
      "UNLIMITED listings",
      "0.5% seller fee",
      "Buyer Protection: 2% + €0.20 (cap €8)",
      "Enterprise analytics suite",
      "/dashboard full access",
      "50 boosts/month (24h)",
      "Unlimited team accounts",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    recommended: "Recommended",
    bestValue: "Best Value",
    mostPopular: "Most Popular",
    whyUpgrade: "Why upgrade to Business Pro?",
    whyUpgradeDesc: "Access the full power of your business dashboard with advanced tools designed to help you scale.",
  },
  bg: {
    title: "Отключете бизнес таблото",
    subtitle: "Получете достъп до мощни инструменти за развитие на бизнеса",
    currentPlan: "Вашият текущ план",
    freeTier: "Бизнес Безплатен",
    upgradeTo: "Надградете за достъп",
    features: "Какво ще получите",
    upgradeNow: "Надградете сега",
    viewPlans: "Вижте всички планове",
    perMonth: "/месец",
    perYear: "/година",
    saveYearly: "Спестете 17% с годишен план",
    dashboardFeatures: [
      "Аналитика в реално време",
      "Разширено управление на инвентара",
      "Инструменти за клиенти",
      "Маркетинг и промоции",
      "Управление на кодове за отстъпка",
      "Счетоводство и отчети",
      "Приоритетна бизнес поддръжка",
      "Масово качване на обяви",
      "API достъп",
    ],
    freeFeatures: [
      "100 активни обяви",
      "1.5% такса за продавача",
      "Защита на купувача: 3% + €0.35 (лимит €12)",
      "Базова аналитика",
      "Бадж „Верифициран бизнес“",
      "Поддръжка за фактури",
    ],
    proFeatures: [
      "2,000 активни обяви",
      "1% такса за продавача",
      "Защита на купувача: 2.5% + €0.25 (лимит €10)",
      "Пълно аналитично табло",
      "Достъп до /dashboard",
      "20 промотирания/месец (24ч)",
      "Екипни акаунти (до 3)",
      "Приоритетна поддръжка",
      "Масово качване на обяви",
    ],
    enterpriseFeatures: [
      "НЕОГРАНИЧЕНИ обяви",
      "0.5% такса за продавача",
      "Защита на купувача: 2% + €0.20 (лимит €8)",
      "Enterprise аналитика",
      "Пълен достъп до /dashboard",
      "50 промотирания/месец (24ч)",
      "Неограничени екипни акаунти",
      "API достъп",
      "Личен мениджър",
      "Персонализирани интеграции",
    ],
    recommended: "Препоръчан",
    bestValue: "Най-добра стойност",
    mostPopular: "Най-популярен",
    whyUpgrade: "Защо да надградите до Business Pro?",
    whyUpgradeDesc: "Получете достъп до пълната мощност на бизнес таблото с разширени инструменти, проектирани да ви помогнат да растете.",
  },
}

interface UpgradePageProps {
  params: Promise<{ locale: string }>
}

export default async function DashboardUpgradePage({ params }: UpgradePageProps) {
  const { locale } = await params
  const t = translations[locale as keyof typeof translations] || translations.en

  // Get the business seller (they must be a business account to see this page)
  const businessSeller = await requireBusinessSeller("/account")

  // Check if they already have dashboard access
  const subscription = await getActiveSubscription(businessSeller.id)
  const hasAccess = subscription && DASHBOARD_ALLOWED_TIERS.includes(subscription.plan_tier as 'professional' | 'enterprise')

  // If they already have access, redirect to dashboard
  if (hasAccess) {
    redirect(`/${locale}/dashboard`)
  }

  // Fetch business plans for display
  const supabase = await createClient()
  const { data: _plans } = await supabase
    .from('subscription_plans')
    .select('id')
    .eq('account_type', 'business')
    .eq('is_active', true)
    .in('tier', ['professional', 'enterprise'])
    .order('price_monthly', { ascending: true })

  return (
    <div className="container flex flex-col gap-4 py-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-3 rounded-full bg-warning">
            <IconCrown className="size-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Current Plan Notice */}
      <Card className="border border-warning/20 bg-warning/10">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-full bg-warning/10">
            <IconBuildingStore className="size-5 text-warning" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{t.currentPlan}: <span className="text-warning">{t.freeTier}</span></p>
            <p className="text-sm text-muted-foreground">
              {businessSeller.store_name} • {t.upgradeTo}
            </p>
          </div>
          <Badge variant="outline" className="border-warning/30 text-warning">
            {businessSeller.tier || 'free'}
          </Badge>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Business Pro Plan */}
        <Card className="relative border-2 border-primary shadow-sm">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground px-3 py-1">
              <IconSparkles className="size-3 mr-1" />
              {t.mostPopular}
            </Badge>
          </div>
          <CardHeader className="pt-8">
            <CardTitle className="flex items-center gap-2">
              <IconRocket className="size-5 text-primary" />
              Business Pro
            </CardTitle>
            <CardDescription>
              {locale === 'bg' ? 'Професионални инструменти за растящи бизнеси' : 'Professional tools for growing businesses'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">€49.99</span>
              <span className="text-muted-foreground">{t.perMonth}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t.saveYearly}</p>

            <div className="space-y-3">
              {t.proFeatures.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <IconCheck className="size-5 text-success shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" size="lg">
              <Link href="/plans?type=business&highlight=professional">
                {t.upgradeNow}
                <IconArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Business Enterprise Plan */}
        <Card className="relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="secondary" className="px-3 py-1">
              {t.bestValue}
            </Badge>
          </div>
          <CardHeader className="pt-8">
            <CardTitle className="flex items-center gap-2">
              <IconCrown className="size-5 text-warning" />
              Business Enterprise
            </CardTitle>
            <CardDescription>
              {locale === 'bg' ? 'За марки и високообемни бизнеси' : 'For brands and high-volume businesses'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">€99.99</span>
              <span className="text-muted-foreground">{t.perMonth}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t.saveYearly}</p>

            <div className="space-y-3">
              {t.enterpriseFeatures.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <IconCheck className="size-5 text-success shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href="/plans?type=business&highlight=enterprise">
                {t.upgradeNow}
                <IconArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Dashboard Features Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconChartBar className="size-5" />
            {t.whyUpgrade}
          </CardTitle>
          <CardDescription>{t.whyUpgradeDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.dashboardFeatures.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <IconCheck className="size-4 text-success shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild variant="link">
            <Link href="/plans">
              {t.viewPlans}
              <IconArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Comparison: Free vs Pro */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Free Plan */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <IconBuildingStore className="size-5 text-muted-foreground" />
              {t.freeTier}
              <Badge variant="outline" className="ml-auto">Current</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {t.freeFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconCheck className="size-4 text-muted-foreground shrink-0" />
                  {feature}
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconX className="size-4 text-destructive shrink-0" />
                {locale === 'bg' ? 'Без достъп до таблото' : 'No dashboard access'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What you're missing */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <IconRocket className="size-5 text-primary" />
              {locale === 'bg' ? 'Какво пропускате' : "What you're missing"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <IconChartBar className="size-4 text-primary shrink-0" />
                {locale === 'bg' ? 'Пълно аналитично табло' : 'Full analytics dashboard'}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <IconUsers className="size-4 text-primary shrink-0" />
                {locale === 'bg' ? 'Управление на клиенти' : 'Customer management'}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <IconShoppingCart className="size-4 text-primary shrink-0" />
                {locale === 'bg' ? 'Разширено управление на поръчки' : 'Advanced order management'}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <IconSparkles className="size-4 text-primary shrink-0" />
                {locale === 'bg' ? 'Маркетинг и промоции' : 'Marketing & promotions'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
