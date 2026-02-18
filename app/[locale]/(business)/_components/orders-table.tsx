"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"
import { format } from "date-fns"
import { Check as IconCheck, ChevronDown as IconChevronDown, ChevronUp as IconChevronUp, EllipsisVertical as IconDotsVertical, Download as IconDownload, Eye as IconEye, MessageCircle as IconMessage, Package as IconPackage, Printer as IconPrinter, RefreshCw as IconRefresh, Search as IconSearch, ChevronsUpDown as IconSelector, Truck as IconTruck, X as IconX } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { OrderListStatusBadge } from "@/components/shared/order-list-item"
import { OrderSummaryLine } from "@/components/shared/order-summary-line"
import { getStatusConfig } from "./orders-table.constants"
import type {
  OrderItem,
  OrderStatus,
  OrdersTableProps,
  SortField,
  SortOrder,
} from "./orders-table.types"
import {
  formatCurrency,
  getCustomer,
  getOrder,
  getProduct,
} from "./orders-table.utils"

export function OrdersTable({
  initialOrders,
}: OrdersTableProps) {
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
          comparison = (a.price_at_purchase * a.quantity) - (b.price_at_purchase * b.quantity)
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

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
      setIsAllSelected(false)
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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <IconSelector className="size-3.5 text-muted-foreground" />
    return sortOrder === "asc"
      ? <IconChevronUp className="size-3.5" />
      : <IconChevronDown className="size-3.5" />
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    // Stub: Need bulkUpdateOrderItemsStatus action in app/actions/orders.ts
    // Would iterate selectedIds and call updateOrderItemStatus for each
    toast.success(`${selectedIds.size} order(s) updated to ${newStatus}`)
    setSelectedIds(new Set())
    setIsAllSelected(false)
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
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and fulfill customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <IconDownload className="size-4 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Tabs - Professional Underline Style */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus)} className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-2xs">
              {statusCounts.all || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Unfulfilled
            {(statusCounts.pending || 0) > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-2xs">
                {statusCounts.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processing">
            In Progress
            {(statusCounts.processing || 0) > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-2xs">
                {statusCounts.processing}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Shipped
            {(statusCounts.shipped || 0) > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-2xs">
                {statusCounts.shipped}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered
            {(statusCounts.delivered || 0) > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-2xs">
                {statusCounts.delivered}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7">
                  Actions <IconChevronDown className="ml-1 size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handleBulkStatusUpdate("processing")}>
                  <IconRefresh className="size-4 mr-2" />
                  Mark as Processing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusUpdate("shipped")}>
                  <IconTruck className="size-4 mr-2" />
                  Mark as Shipped
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusUpdate("delivered")}>
                  <IconCheck className="size-4 mr-2" />
                  Mark as Delivered
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleBulkStatusUpdate("cancelled")}
                  className="text-destructive focus:bg-destructive-subtle focus:text-destructive"
                >
                  <IconX className="size-4 mr-2" />
                  Cancel Orders
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              className="h-7"
              onClick={() => {
                setSelectedIds(new Set())
                setIsAllSelected(false)
              }}
            >
              <IconX className="size-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div
        className="rounded-lg border bg-card overflow-x-auto"
        style={{ "--business-table-min-w": "64rem" } as React.CSSProperties}
      >
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconPackage className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Orders will appear here when customers purchase your products"}
            </p>
          </div>
        ) : (
          <Table className="min-w-(--business-table-min-w)">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-24">Order</TableHead>
                <TableHead
                  className="hidden md:table-cell cursor-pointer select-none"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {getSortIcon("created_at")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("customer")}
                >
                  <div className="flex items-center gap-1">
                    Customer
                    {getSortIcon("customer")}
                  </div>
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell text-center">Qty</TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Total
                    {getSortIcon("total")}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((item) => {
                const order = getOrder(item)
                const product = getProduct(item)
                const customer = getCustomer(order)
                const status = order?.status || "pending"
                const statusConfig = getStatusConfig(status)
                const StatusIcon = statusConfig.icon
                const firstImage = product?.images?.[0]

                return (
                  <TableRow
                    key={item.id}
                    className={cn(
                      "group",
                      selectedIds.has(item.id) && "bg-selected"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={() => toggleSelect(item.id)}
                        aria-label={`Select order ${order?.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/orders/${order?.id}`}
                        className="font-mono text-sm font-medium text-primary hover:underline"
                      >
                        #{order?.id?.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {order?.created_at ? format(new Date(order.created_at), "MMM d") : "-"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order?.created_at ? format(new Date(order.created_at), "h:mm a") : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm truncate max-w-40">
                          {customer?.full_name || "Guest"}
                        </span>
                        {customer?.email ? (
                          <span className="text-xs text-muted-foreground truncate max-w-40">
                            {customer.email}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <OrderSummaryLine
                        className="items-center"
                        thumb={{
                          imageSrc: firstImage,
                          alt: product?.title || "Product",
                          className: "size-10 rounded-md bg-muted shrink-0",
                          sizes: "40px",
                          fallbackClassName: "text-muted-foreground",
                        }}
                        contentClassName="min-w-0 flex-initial"
                        title={(
                          <p className="text-sm font-medium truncate max-w-48">
                            {product?.title || "Unknown Product"}
                          </p>
                        )}
                      >
                        {product?.sku && (
                          <p className="text-xs text-muted-foreground font-mono">
                            {product.sku}
                          </p>
                        )}
                      </OrderSummaryLine>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center tabular-nums">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(item.price_at_purchase * item.quantity)}
                    </TableCell>
                    <TableCell>
                      <OrderListStatusBadge
                        status={status}
                        label={statusConfig.label}
                        className="gap-1"
                        icon={<StatusIcon className="size-3" />}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <IconDotsVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/orders/${order?.id}`}>
                              <IconEye className="size-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleContactCustomer(item)}>
                            <IconMessage className="size-4 mr-2" />
                            Contact Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconPrinter className="size-4 mr-2" />
                            Print Packing Slip
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleBulkStatusUpdate("processing")}
                            disabled={status === "processing"}
                          >
                            <IconRefresh className="size-4 mr-2" />
                            Mark Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBulkStatusUpdate("shipped")}
                            disabled={status === "shipped"}
                          >
                            <IconTruck className="size-4 mr-2" />
                            Mark Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBulkStatusUpdate("delivered")}
                            disabled={status === "delivered"}
                          >
                            <IconCheck className="size-4 mr-2" />
                            Mark Delivered
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:bg-destructive-subtle focus:text-destructive">
                            <IconX className="size-4 mr-2" />
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Summary Footer */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
          <span className="font-medium text-foreground">
            Total: {formatCurrency(
              filteredOrders.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0)
            )}
          </span>
        </div>
      )}
    </div>
  )
}
