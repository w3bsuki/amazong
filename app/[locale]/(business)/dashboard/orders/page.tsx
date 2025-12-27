import { requireDashboardAccess, getBusinessOrders } from "@/lib/auth/business"
import { OrdersTable } from "../../_components/orders-table"

export default async function BusinessOrdersPage() {
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
