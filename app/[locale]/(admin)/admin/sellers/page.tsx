import { createAdminClient, createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { getLocale, getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { connection } from "next/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconCheck, IconX } from "@tabler/icons-react"

// Define seller type to avoid 'any'
interface Seller {
  id: string
  store_name: string | null
  description: string | null
  verified: boolean | null
  tier: string | null
  is_verified_business: boolean | null
  business_name: string | null
  commission_rate: number | null
  country_code: string | null
  created_at: string
  profiles: {
    email: string | null
    full_name: string | null
  }
}

async function getSellers(): Promise<Seller[]> {
  const adminClient = createAdminClient()
  
  const { data: profiles, error } = await adminClient
    .from('profiles')
    .select(`
      id,
      username,
      display_name,
      bio,
      verified,
      tier,
      is_verified_business,
      business_name,
      country_code,
      created_at,
      full_name
    `)
    .eq('is_seller', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    const message =
      typeof error === 'object' && error && 'message' in error
        ? String((error as { message?: unknown }).message)
        : ''

    if (!message.includes('During prerendering, fetch() rejects when the prerender is complete')) {
      console.error('Failed to fetch sellers:', error)
    }
    return []
  }
  
  const ids = (profiles || []).map((p) => p.id)
  const { data: privateProfiles } = ids.length
    ? await adminClient
        .from('private_profiles')
        .select('id, email, commission_rate')
        .in('id', ids)
    : { data: [] }

  const privateById = new Map((privateProfiles || []).map((p) => [p.id, p]))

  // Map profiles to expected seller format
  return (profiles || []).map(profile => ({
    id: profile.id,
    store_name: profile.display_name || profile.business_name || profile.username || null,
    description: profile.bio,
    verified: profile.verified,
    tier: profile.tier,
    is_verified_business: profile.is_verified_business,
    business_name: profile.business_name,
    commission_rate: privateById.get(profile.id)?.commission_rate ?? null,
    country_code: profile.country_code,
    created_at: profile.created_at,
    profiles: {
      email: privateById.get(profile.id)?.email ?? null,
      full_name: profile.full_name,
    }
  }))
}

async function AdminSellersContent() {
  await (await createClient()).auth.getUser()

  const sellers = await getSellers()
  const t = await getTranslations("AdminSellers")
  const locale = await getLocale()
  const dateLocale = locale === "bg" ? bg : enUS
  
  const getTierBadge = (tier: string | null) => {
    switch (tier) {
      case 'business':
        return 'border-selected-border bg-selected text-primary'
      case 'premium':
        return 'border-warning/20 bg-warning/10 text-warning'
      default:
        return 'border-border bg-muted text-muted-foreground'
    }
  }

  const getTierLabel = (tier: string | null) => {
    switch (tier) {
      case 'business':
        return t('tiers.business')
      case 'premium':
        return t('tiers.premium')
      default:
        return t('tiers.basic')
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('page.title')}</h1>
          <p className="text-muted-foreground">
            {t('page.description')}
          </p>
        </div>
        <Badge variant="outline" className="text-base">
          {t('summary', { count: sellers.length })}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('table.title')}</CardTitle>
          <CardDescription>
            {t('table.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.headers.store')}</TableHead>
                <TableHead>{t('table.headers.owner')}</TableHead>
                <TableHead>{t('table.headers.tier')}</TableHead>
                <TableHead>{t('table.headers.verified')}</TableHead>
                <TableHead>{t('table.headers.commission')}</TableHead>
                <TableHead>{t('table.headers.country')}</TableHead>
                <TableHead>{t('table.headers.joined')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{seller.store_name || t("fallbacks.unknownStore")}</p>
                      {seller.business_name && (
                        <p className="text-sm text-muted-foreground">
                          {seller.business_name}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {seller.profiles.full_name || t('fallbacks.noName')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {seller.profiles.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTierBadge(seller.tier)}>
                      {getTierLabel(seller.tier)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {seller.verified ? (
                        <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
                          <IconCheck className="size-3 mr-1" />
                          {t('badges.verified')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-border bg-muted text-muted-foreground">
                          <IconX className="size-3 mr-1" />
                          {t('badges.notVerified')}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {seller.commission_rate}%
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {seller.country_code || t('fallbacks.country')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(seller.created_at), { addSuffix: true, locale: dateLocale })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

async function AdminSellersFallback() {
  const t = await getTranslations("AdminSellers")

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
        <Badge variant="outline" className="text-base">{t("loading")}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>{t("table.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">{t("loading")}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function AdminSellersPage() {
  await connection()

  return (
    <Suspense fallback={<AdminSellersFallback />}>
      <AdminSellersContent />
    </Suspense>
  )
}
