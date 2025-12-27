import { createAdminClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
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
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100)
  
  if (error) {
    console.error('Failed to fetch orders:', error)
    return []
  }
  
  return (orders || []) as AdminOrder[]
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'paid':
        return 'bg-success/15 text-success border-success/25'
      case 'pending':
        return 'bg-order-pending/15 text-order-pending border-order-pending/25'
      case 'processing':
        return 'bg-order-processing/15 text-order-processing border-order-processing/25'
      case 'shipped':
        return 'bg-order-shipped/15 text-order-shipped border-order-shipped/25'
      case 'delivered':
        return 'bg-order-delivered/15 text-order-delivered border-order-delivered/25'
      case 'cancelled':
        return 'bg-order-cancelled/15 text-order-cancelled border-order-cancelled/25'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  // Calculate totals
  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            All orders placed on the platform
          </p>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="text-base">
            {orders.length} orders
          </Badge>
          <Badge variant="outline" className="text-base bg-success/10 text-success border-success/25">
            {formatCurrency(totalRevenue)} revenue
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            View all orders and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    #{order.id.substring(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {order.profiles?.full_name || 'No name'}
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
                      {order.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
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
