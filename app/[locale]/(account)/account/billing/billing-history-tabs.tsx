import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, formatDistanceToNow } from "date-fns"
import {
  Crown,
  Download,
  Zap as Lightning,
  Receipt,
  SquareArrowOutUpRight as ArrowSquareOut,
} from "lucide-react"
import type {
  BillingDateLocale,
  BillingStatusBadge,
  BillingText,
  Boost,
  Charge,
  Invoice,
} from "./billing.types"

interface BillingHistoryTabsProps {
  boosts: Boost[]
  invoices: Invoice[]
  charges: Charge[]
  isLoading: boolean
  dateLocale: BillingDateLocale
  t: BillingText
  formatCurrency: (amount: number, currency?: string) => string
  formatPrice: (price: number) => string
  getStatusBadge: BillingStatusBadge
}

export function BillingHistoryTabs({
  boosts,
  invoices,
  charges,
  isLoading,
  dateLocale,
  t,
  formatCurrency,
  formatPrice,
  getStatusBadge,
}: BillingHistoryTabsProps) {
  return (
    <Tabs defaultValue="invoices" className="grid gap-4">
      <TabsList>
        <TabsTrigger value="invoices" className="gap-1.5">
          <Receipt className="size-4" />
          {t.invoices}
        </TabsTrigger>
        <TabsTrigger value="boosts" className="gap-1.5">
          <Lightning className="size-4" />
          {t.boostPurchases}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="invoices">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.paymentHistory}</CardTitle>
            <CardDescription>{t.paidPlanDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-3">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded shrink-0" />
                    <div className="grid gap-2 flex-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16 shrink-0" />
                  </div>
                ))}
              </div>
            ) : invoices.length === 0 && charges.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="size-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">{t.noInvoices}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.noBillingYet}</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-3 px-3 md:-mx-6 md:px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.date}</TableHead>
                      <TableHead>{t.description}</TableHead>
                      <TableHead>{t.amount}</TableHead>
                      <TableHead>{t.status}</TableHead>
                      <TableHead className="text-right">{t.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(invoice.created * 1000), "PP", { locale: dateLocale })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Crown className="size-4 text-warning shrink-0" />
                            <span className="truncate max-w-52">
                              {invoice.description || t.sellerSubscription}
                              {invoice.number && (
                                <span className="text-muted-foreground ml-1">#{invoice.number}</span>
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(invoice.amount_paid, invoice.currency)}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {invoice.hosted_invoice_url && (
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={invoice.hosted_invoice_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ArrowSquareOut className="size-4" />
                                </a>
                              </Button>
                            )}
                            {invoice.invoice_pdf && (
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={invoice.invoice_pdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download className="size-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {charges.map((charge) => (
                      <TableRow key={charge.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(charge.created * 1000), "PP", { locale: dateLocale })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Lightning className="size-4 text-primary shrink-0" />
                            <span className="truncate max-w-52">
                              {charge.description ||
                                (charge.metadata?.type === "listing_boost"
                                  ? t.listingBoost
                                  : t.paymentFallback)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(charge.amount, charge.currency)}
                        </TableCell>
                        <TableCell>{getStatusBadge(charge.status)}</TableCell>
                        <TableCell className="text-right">
                          {charge.receipt_url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={charge.receipt_url} target="_blank" rel="noopener noreferrer">
                                <ArrowSquareOut className="size-4" />
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="boosts">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">{t.boostPurchases}</CardTitle>
              <CardDescription>{t.noBoostsDescription}</CardDescription>
            </div>
            <Link href="/account/selling">
              <Button size="sm" className="gap-1.5">
                <Lightning className="size-4" />
                {t.boostProduct}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {boosts.length === 0 ? (
              <div className="text-center py-8">
                <Lightning className="size-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">{t.noBoosts}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.boostHint}</p>
                <Link href="/account/selling" className="mt-4 inline-block">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Lightning className="size-4" />
                    {t.boostProduct}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-3 px-3 md:-mx-6 md:px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.product}</TableHead>
                      <TableHead>{t.duration}</TableHead>
                      <TableHead>{t.amount}</TableHead>
                      <TableHead>{t.status}</TableHead>
                      <TableHead>{t.date}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boosts.map((boost) => {
                      const isExpired = new Date(boost.expires_at) < new Date()
                      const expiresIn = formatDistanceToNow(new Date(boost.expires_at), {
                        locale: dateLocale,
                        addSuffix: true,
                      })

                      return (
                        <TableRow key={boost.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {boost.products?.images?.[0] && (
                                <Image
                                  src={boost.products.images[0]}
                                  alt=""
                                  width={40}
                                  height={40}
                                  sizes="40px"
                                  className="size-10 rounded object-cover"
                                />
                              )}
                              <span className="truncate max-w-44 font-medium">
                                {boost.products?.title || boost.product_id}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {boost.duration_days} {t.days}
                          </TableCell>
                          <TableCell className="font-medium">{formatPrice(boost.price_paid)}</TableCell>
                          <TableCell>
                            {boost.is_active && !isExpired ? (
                              <Badge className="bg-selected text-primary">
                                <Lightning className="size-3 mr-1" />
                                {t.activeBadge}
                              </Badge>
                            ) : (
                              <Badge variant="secondary">{t.expired2}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(boost.created_at), "PP", { locale: dateLocale })}
                            {boost.is_active && !isExpired && (
                              <div className="text-xs text-primary mt-0.5">
                                {t.expiresIn} {expiresIn}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
