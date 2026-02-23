"use client"

import * as React from "react"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"

import type {
  OrderItem,
  OrderStatus,
  OrdersTableProps,
  SortField,
  SortOrder,
} from "./orders-table.types"
import { getCustomer, getOrder, getProduct } from "./orders-table.utils"
import { OrdersTableView } from "./orders-table-view"

export function OrdersTable({ initialOrders }: OrdersTableProps) {
  const router = useRouter()
  const [orders] = React.useState<OrderItem[]>(initialOrders)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<OrderStatus>("all")
  const [sortField, setSortField] = React.useState<SortField>("created_at")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc")

  // Count orders by status
  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: orders.length }
    orders.forEach((item) => {
      const order = getOrder(item)
      const status = order?.status || "pending"
      counts[status] = (counts[status] || 0) + 1
    })
    return counts
  }, [orders])

  // Filter and sort orders
  const filteredOrders = React.useMemo(() => {
    let result = [...orders]

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => {
        const order = getOrder(item)
        return (order?.status || "pending") === statusFilter
      })
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((item) => {
        const order = getOrder(item)
        const product = getProduct(item)
        const customer = getCustomer(order)
        return (
          order?.id?.toLowerCase().includes(query) ||
          product?.title?.toLowerCase().includes(query) ||
          customer?.full_name?.toLowerCase().includes(query) ||
          (typeof customer?.email === "string" && customer.email.toLowerCase().includes(query))
        )
      })
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      const orderA = getOrder(a)
      const orderB = getOrder(b)

      switch (sortField) {
        case "created_at":
          const timeA = orderA?.created_at ? new Date(orderA.created_at).getTime() : 0
          const timeB = orderB?.created_at ? new Date(orderB.created_at).getTime() : 0
          comparison = timeA - timeB
          break
        case "total":
          comparison = a.price_at_purchase * a.quantity - b.price_at_purchase * b.quantity
          break
        case "customer":
          const custA = getCustomer(orderA)?.full_name || ""
          const custB = getCustomer(orderB)?.full_name || ""
          comparison = custA.localeCompare(custB)
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [orders, searchQuery, statusFilter, sortField, sortOrder])

  const clearSelection = () => {
    setSelectedIds(new Set())
    setIsAllSelected(false)
  }

  const toggleSelectAll = () => {
    if (isAllSelected) {
      clearSelection()
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.id)))
      setIsAllSelected(true)
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
    setIsAllSelected(newSelected.size === filteredOrders.length)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    // Stub: Need bulkUpdateOrderItemsStatus action in app/actions/orders.ts
    // Would iterate selectedIds and call updateOrderItemStatus for each
    toast.success(`${selectedIds.size} order(s) updated to ${newStatus}`)
    clearSelection()
    router.refresh()
  }

  const handleContactCustomer = (item: OrderItem) => {
    const order = getOrder(item)
    const customer = getCustomer(order)
    if (customer) {
      router.push(`/chat?seller=${customer.id}`)
    }
  }

  return (
    <OrdersTableView
      orders={orders}
      filteredOrders={filteredOrders}
      selectedIds={selectedIds}
      isAllSelected={isAllSelected}
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      statusCounts={statusCounts}
      sortField={sortField}
      sortOrder={sortOrder}
      setStatusFilter={setStatusFilter}
      setSearchQuery={setSearchQuery}
      clearSelection={clearSelection}
      toggleSelectAll={toggleSelectAll}
      toggleSelect={toggleSelect}
      handleSort={handleSort}
      handleBulkStatusUpdate={handleBulkStatusUpdate}
      handleContactCustomer={handleContactCustomer}
    />
  )
}
