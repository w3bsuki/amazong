import { requireDashboardAccess } from "@/lib/auth/business"
import Link from "next/link"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BusinessEmptyState } from "../../_components/business-empty-state"
import { 
  IconTag, 
  IconPlus,
  IconPercentage,
  IconCurrencyDollar,
  IconUsers,
  IconCopy,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react"

// Placeholder function - would need actual discounts table
async function getBusinessDiscounts(_sellerId: string) {
  // This is a placeholder - you'd need to create a discounts table
  // For now, return empty to demonstrate the UI
  return {
    discounts: [] as Array<{
      id: string
      code: string
      type: 'percentage' | 'fixed'
      value: number
      min_order_value: number | null
      usage_limit: number | null
      usage_count: number
      starts_at: string
      ends_at: string | null
      status: 'active' | 'expired' | 'scheduled' | 'disabled'
    }>,
    total: 0,
  }
}

export default async function BusinessDiscountsPage() {
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const { discounts, total } = await getBusinessDiscounts(businessSeller.id)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Active</Badge>
      case 'scheduled':
        return <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20">Scheduled</Badge>
      case 'expired':
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Expired</Badge>
      case 'disabled':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Disabled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (total === 0) {
    return <BusinessEmptyState type="discounts" />
  }

  // Calculate summary stats
  const activeDiscounts = discounts.filter(d => d.status === 'active').length
  const totalUsage = discounts.reduce((sum, d) => sum + d.usage_count, 0)

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      {/* Shopify-style Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">Discounts</h1>
            {/* Discount metrics as badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                <IconTag className="size-3" />
                <span className="tabular-nums">{total}</span>
                <span className="opacity-70">codes</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                <span className="tabular-nums">{activeDiscounts}</span>
                <span className="opacity-70">active</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                <IconUsers className="size-3" />
                <span className="tabular-nums">{totalUsage}</span>
                <span className="opacity-70">uses</span>
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Create and manage promotional codes
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/discounts/new">
            <IconPlus className="size-4 mr-2" />
            Create discount
          </Link>
        </Button>
      </div>

      {/* Discount Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconTag className="size-4" />
              Total Discounts
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {total.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Discount codes created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconPercentage className="size-4 text-success" />
              Active
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-success">
              {activeDiscounts.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Currently active codes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconUsers className="size-4" />
              Total Uses
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {totalUsage.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Times discounts used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconCurrencyDollar className="size-4" />
              Revenue Impact
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              --
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Discounts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Discounts</CardTitle>
          <CardDescription>
            Manage your discount codes and promotions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                        {discount.code}
                      </code>
                      <Button variant="ghost" size="icon" className="size-6">
                        <IconCopy className="size-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {discount.type === 'percentage' ? (
                        <IconPercentage className="size-3.5 text-muted-foreground" />
                      ) : (
                        <IconCurrencyDollar className="size-3.5 text-muted-foreground" />
                      )}
                      <span className="capitalize">{discount.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {discount.type === 'percentage' 
                      ? `${discount.value}%` 
                      : formatCurrency(discount.value)
                    }
                  </TableCell>
                  <TableCell>
                    {discount.usage_count}
                    {discount.usage_limit && (
                      <span className="text-muted-foreground">/{discount.usage_limit}</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(discount.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {discount.ends_at 
                      ? format(new Date(discount.ends_at), "MMM d, yyyy")
                      : "No expiry"
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8">
                        <IconPencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive">
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
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
