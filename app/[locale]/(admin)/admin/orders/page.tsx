import { createAdminClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { getLocale, getTranslations } from "next-intl/server"
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

// Type for admin order with profile info
interface AdminOrder {
  id: string
  total_amount: number
  status: string | null
  created_at: string
  user_id: string
  profiles: { email: string | null; full_name: string | null } | null
}

async function getOrders(): Promise<AdminOrder[]> {
  const adminClient = createAdminClient()
  
  const { data: orders, error } = await adminClient
    .from('orders')
    .select(`
      id,
      total_amount,
      status,
      created_at,
      user_id,
      profiles (
        full_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100)
  
  if (error) {
    console.error('Failed to fetch orders:', error)
    return []
  }

  const userIds = Array.from(new Set((orders || []).map((o) => o.user_id).filter(Boolean)))

  const { data: privateProfiles } = userIds.length
    ? await adminClient
        .from('private_profiles')
        .select('id, email')
        .in('id', userIds)
    : { data: [] as Array<{ id: string; email: string | null }> }

  const emailById = new Map((privateProfiles || []).map((p) => [p.id, p.email]))

  return (orders || []).map((order) => {
    const profile = Array.isArray(order.profiles) ? (order.profiles.at(0) ?? null) : order.profiles

    return {
      ...order,
      profiles: {
        full_name: profile?.full_name ?? null,
        email: emailById.get(order.user_id) ?? null,
      },
    }
  }) as AdminOrder[]
}

export default async function AdminOrdersPage() {
  // Mark route as dynamic without using route segment config (incompatible with cacheComponents).
  await connection()

  const orders = await getOrders()
  const t = await getTranslations("AdminOrders")
  const locale = await getLocale()
  const dateLocale = locale === "bg" ? bg : enUS
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'paid':
        return 'bg-muted text-success border-success'
      case 'pending':
        return 'bg-muted text-order-pending border-order-pending'
      case 'processing':
        return 'bg-muted text-order-processing border-order-processing'
      case 'shipped':
        return 'bg-muted text-order-shipped border-order-shipped'
      case 'delivered':
        return 'bg-muted text-order-delivered border-order-delivered'
      case 'cancelled':
        return 'bg-muted text-order-cancelled border-order-cancelled'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'paid':
        return t('status.paid')
      case 'pending':
        return t('status.pending')
      case 'processing':
        return t('status.processing')
      case 'shipped':
        return t('status.shipped')
      case 'delivered':
        return t('status.delivered')
      case 'cancelled':
        return t('status.cancelled')
      default:
        return t('status.unknown')
    }
  }

  // Calculate totals
  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('page.title')}</h1>
          <p className="text-muted-foreground">
            {t('page.description')}
          </p>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="text-base">
            {t('summary.orders', { count: orders.length })}
          </Badge>
          <Badge variant="outline" className="text-base bg-success/10 text-success border-success/25">
            {t('summary.revenue', { amount: formatCurrency(totalRevenue) })}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('table.title')}</CardTitle>
          <CardDescription>{t('table.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.headers.orderId')}</TableHead>
                <TableHead>{t('table.headers.customer')}</TableHead>
                <TableHead>{t('table.headers.amount')}</TableHead>
                <TableHead>{t('table.headers.status')}</TableHead>
                <TableHead>{t('table.headers.date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {order.profiles?.full_name || t('fallbacks.noName')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.profiles?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {formatCurrency(order.total_amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: dateLocale })}
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
