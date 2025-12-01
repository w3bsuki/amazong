import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Package, CreditCard, Lock, MapPin, Headphones, Crown, ChatCircle as MessageSquare, Storefront } from "@phosphor-icons/react/dist/ssr"
import { getTranslations } from "next-intl/server"

interface AccountPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const t = await getTranslations({ locale, namespace: 'Account' })

  const menuItems = [
    {
      title: t('orders.title'),
      description: t('orders.desc'),
      icon: Package,
      href: "/account/orders",
    },
    {
      title: t('prime.title'),
      description: t('prime.desc'),
      icon: Crown,
      href: "/account/plans",
    },
    {
      title: t('security.title'),
      description: t('security.desc'),
      icon: Lock,
      href: "/account/security",
    },
    {
      title: t('addresses.title'),
      description: t('addresses.desc'),
      icon: MapPin,
      href: "/account/addresses",
    },
    {
      title: t('payments.title'),
      description: t('payments.desc'),
      icon: CreditCard,
      href: "/account/payments",
    },
    {
      title: t('customerService.title'),
      description: t('customerService.desc'),
      icon: Headphones,
      href: "/customer-service",
    },
    {
      title: t('messages.title'),
      description: t('messages.desc'),
      icon: MessageSquare,
      href: "/account/messages",
    },
    {
      title: locale === 'bg' ? 'Продажби' : 'Selling',
      description: locale === 'bg' ? 'Управлявайте продуктите и продажбите си' : 'Manage your products and sales',
      icon: Storefront,
      href: "/account/selling",
    },
  ]

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {locale === 'bg' ? 'Управлявайте вашия акаунт и настройки' : 'Manage your account and settings'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.title}>
            <Card className="h-full hover:bg-muted/50 hover:border-primary/20 transition-all border-border cursor-pointer rounded-lg group">
              <CardContent className="p-4 flex gap-4 items-start">
                <div className="shrink-0 p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <item.icon className="size-6 text-primary" weight="duotone" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-medium group-hover:text-primary transition-colors">{item.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
