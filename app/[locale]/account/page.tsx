import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Package, CreditCard, Lock, MapPin, ChatCircle, Headphones } from "@phosphor-icons/react/dist/ssr"
import { getTranslations } from "next-intl/server"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/app-breadcrumb"

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
      title: t('security.title'),
      description: t('security.desc'),
      icon: Lock,
      href: "/account/security",
    },
    {
      title: t('prime.title'),
      description: t('prime.desc'),
      icon: User,
      href: "#",
    },
    {
      title: t('addresses.title'),
      description: t('addresses.desc'),
      icon: MapPin,
      href: "#",
    },
    {
      title: t('payments.title'),
      description: t('payments.desc'),
      icon: CreditCard,
      href: "#",
    },
    {
      title: t('customerService.title'),
      description: t('customerService.desc'),
      icon: Headphones,
      href: "#",
    },
    {
      title: t('messages.title'),
      description: t('messages.desc'),
      icon: MessageSquare,
      href: "/account/messages",
    },
  ]

  return (
    <div className="container py-4 min-h-screen bg-background">
      <AppBreadcrumb items={breadcrumbPresets.account} />
      
      <h1 className="text-3xl font-normal mb-6">{t('title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.title}>
            <Card className="h-full hover:bg-muted transition-colors border-border cursor-pointer rounded-lg">
              <CardContent className="p-4 flex gap-4 items-start pt-6">
                <div className="shrink-0">
                  <item.icon className="h-8 w-8 text-link" />
                </div>
                <div>
                  <h2 className="text-lg font-normal">{item.title}</h2>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
