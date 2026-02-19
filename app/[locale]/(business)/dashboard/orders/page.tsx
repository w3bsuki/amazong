import { requireDashboardAccess, getBusinessOrders } from "@/lib/auth/business"
import { OrdersTable } from "../../_components/orders-table"
import { BusinessEmptyState } from "../../_components/business-empty-state"

export const metadata = {
  title: "Business Orders | Treido",
  description: "Manage orders for your Treido store.",
}

export default async function BusinessOrdersPage() {
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const { orders, total } = await getBusinessOrders(businessSeller.id)

  if (total === 0) {
    return <BusinessEmptyState type="orders" />
  }
  
  return (
    <OrdersTable 
      initialOrders={orders}
      total={total}
      sellerId={businessSeller.id}
    />
  )
}
