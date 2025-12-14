"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { formatDistanceToNow, format } from "date-fns"
import {
  IconSearch,
  IconFilter,
  IconChevronDown,
  IconDotsVertical,
  IconMail,
  IconTruck,
  IconCheck,
  IconX,
  IconRefresh,
  IconPackage,
  IconExternalLink,
  IconDownload,
  IconSelector,
  IconChevronUp,
  IconEye,
  IconMessage,
  IconPrinter,
} from "@tabler/icons-react"
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

// Order type definitions
interface OrderCustomer {
  id: string
  email: string
  full_name: string | null
}

interface OrderProduct {
  id: string
  title: string
  images: string[] | null
  sku: string | null
}

interface Order {
  id: string
  status: string | null
  created_at: string
  shipping_address: Record<string, unknown> | null
  user: OrderCustomer | OrderCustomer[] | null
}

interface OrderItem {
  id: string
  quantity: number
  price_at_time: number
  created_at: string
  order: Order | Order[] | null
  product: OrderProduct | OrderProduct[] | null
}

interface OrdersTableProps {
  initialOrders: OrderItem[]
  total: number
  sellerId: string
}

type OrderStatus = "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled"
type SortField = "created_at" | "total" | "customer"
type SortOrder = "asc" | "desc"

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { 
    label: "Unfulfilled", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: IconPackage
  },
  processing: { 
    label: "In Progress", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: IconRefresh
  },
  shipped: { 
    label: "Shipped", 
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: IconTruck
  },
  delivered: { 
    label: "Delivered", 
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: IconCheck
  },
  cancelled: { 
    label: "Cancelled", 
    color: "bg-red-100 text-red-800 border-red-200",
    icon: IconX
  },
  paid: { 
    label: "Paid", 
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: IconCheck
  },
}

export function OrdersTable({
  initialOrders,
  total: _total,
  sellerId: _sellerId,
}: OrdersTableProps) {
  const router = useRouter()
  const [orders, setOrders] = React.useState<OrderItem[]>(initialOrders)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<OrderStatus>("all")
  const [sortField, setSortField] = React.useState<SortField>("created_at")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc")
  const [isLoading, setIsLoading] = React.useState(false)

  // Helper to extract order data from potentially nested structure
  const getOrder = (item: OrderItem): Order | null => {
    if (!item.order) return null
    return Array.isArray(item.order) ? item.order[0] : item.order
  }

  const getProduct = (item: OrderItem): OrderProduct | null => {
    if (!item.product) return null
    return Array.isArray(item.product) ? item.product[0] : item.product
  }

  const getCustomer = (order: Order | null): OrderCustomer | null => {
    if (!order?.user) return null
    return Array.isArray(order.user) ? order.user[0] : order.user
  }

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
          customer?.email?.toLowerCase().includes(query)
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
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case "total":
          comparison = (a.price_at_time * a.quantity) - (b.price_at_time * b.quantity)
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(value)
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    setIsLoading(true)
    // TODO: Implement bulk status update action
    toast.success(`${selectedIds.size} order(s) updated to ${newStatus}`)
    setSelectedIds(new Set())
    setIsAllSelected(false)
    setIsLoading(false)
    router.refresh()
  }

  const handleContactCustomer = (item: OrderItem) => {
    const order = getOrder(item)
    const customer = getCustomer(order)
    if (customer) {
      // Navigate to chat with customer
      router.push(`/messages?user=${customer.id}`)
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
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

      {/* Status Tabs - Shopify Style */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus)} className="w-full">
        <TabsList className="h-auto p-1 bg-muted/50 rounded-lg inline-flex flex-wrap gap-1">
          <TabsTrigger 
            value="all" 
            className="px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
          >
            All
            <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px]">
              {statusCounts.all || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="pending"
            className="px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
          >
            Unfulfilled
            {(statusCounts.pending || 0) > 0 && (
              <Badge className="ml-1.5 h-5 px-1.5 text-[10px] bg-yellow-500">
                {statusCounts.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="processing"
            className="px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
          >
            In Progress
            {(statusCounts.processing || 0) > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px]">
                {statusCounts.processing}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="shipped"
            className="px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
          >
            Shipped
            {(statusCounts.shipped || 0) > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px]">
                {statusCounts.shipped}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="delivered"
            className="px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
          >
            Delivered
            {(statusCounts.delivered || 0) > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px]">
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
                  className="text-red-600"
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
      <div className="rounded-lg border bg-card">
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
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10">
                  <Checkbox 
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[100px]">Order</TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
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
                <TableHead className="text-center">Qty</TableHead>
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
                const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending
                const StatusIcon = statusConfig.icon

                return (
                  <TableRow 
                    key={item.id}
                    className={cn(
                      "group",
                      selectedIds.has(item.id) && "bg-muted/50"
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
                        #{order?.id?.substring(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {format(new Date(item.created_at), "MMM d")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(item.created_at), "h:mm a")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm truncate max-w-[150px]">
                          {customer?.full_name || "Guest"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {customer?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 rounded-md overflow-hidden bg-muted shrink-0">
                          {product?.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product?.title || "Product"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center">
                              <IconPackage className="size-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate max-w-[180px]">
                            {product?.title || "Unknown Product"}
                          </p>
                          {product?.sku && (
                            <p className="text-xs text-muted-foreground font-mono">
                              {product.sku}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(item.price_at_time * item.quantity)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn("gap-1", statusConfig.color)}
                      >
                        <StatusIcon className="size-3" />
                        {statusConfig.label}
                      </Badge>
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
                          <DropdownMenuItem className="text-red-600">
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
              filteredOrders.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0)
            )}
          </span>
        </div>
      )}
    </div>
  )
}
