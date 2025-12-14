import { requireDashboardAccess, getBusinessInventory } from "@/lib/auth/business"
import Image from "next/image"
import Link from "next/link"
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
import { Button } from "@/components/ui/button"
import { IconPackage, IconAlertTriangle, IconX, IconCheck, IconPencil } from "@tabler/icons-react"

export default async function BusinessInventoryPage() {
  await connection()
  
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const { products, summary } = await getBusinessInventory(businessSeller.id)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(value)
  }

  const inStockCount = summary.totalProducts - summary.lowStockCount - summary.outOfStockCount

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      {/* Shopify-style Header with Inline Badges */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
            {/* Compact inline status badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                <IconPackage className="size-3" />
                <span className="tabular-nums">{summary.totalStock.toLocaleString()}</span>
                <span className="opacity-70">total units</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <IconCheck className="size-3" />
                <span className="tabular-nums">{inStockCount}</span>
                <span className="opacity-70">in stock</span>
              </span>
              {summary.lowStockCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400">
                  <IconAlertTriangle className="size-3" />
                  <span className="tabular-nums">{summary.lowStockCount}</span>
                  <span className="opacity-70">low</span>
                </span>
              )}
              {summary.outOfStockCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
                  <IconX className="size-3" />
                  <span className="tabular-nums">{summary.outOfStockCount}</span>
                  <span className="opacity-70">out</span>
                </span>
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage stock levels across {summary.totalProducts} products
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>
            Monitor and update inventory for all products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconPackage className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No products to track</h3>
              <p className="text-muted-foreground">
                Add products to start tracking inventory
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative size-12 rounded-md overflow-hidden bg-muted">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-xs font-medium text-muted-foreground">
                            N/A
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium truncate max-w-[200px]">
                        {product.title}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {product.sku || '-'}
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={product.stock > 10 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        }
                      >
                        {product.stock} units
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.stock === 0 ? (
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                          <IconX className="size-3 mr-1" />
                          Out of Stock
                        </Badge>
                      ) : product.stock <= 10 ? (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                          <IconAlertTriangle className="size-3 mr-1" />
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          <IconCheck className="size-3 mr-1" />
                          In Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/products/${product.id}/edit`}>
                          <IconPencil className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
