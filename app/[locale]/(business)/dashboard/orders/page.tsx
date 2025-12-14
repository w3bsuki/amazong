import { requireDashboardAccess, getBusinessOrders } from "@/lib/auth/business"
import { connection } from "next/server"
import { OrdersTable } from "@/components/business/orders-table"

export default async function BusinessOrdersPage() {
  await connection()
  
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const { orders, total } = await getBusinessOrders(businessSeller.id)
  
  return (
    <OrdersTable 
      initialOrders={orders}
      total={total}
      sellerId={businessSeller.id}
    />
  )
}
