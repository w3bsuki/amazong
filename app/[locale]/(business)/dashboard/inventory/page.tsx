import { requireDashboardAccess, getBusinessInventory } from "@/lib/auth/business"
import Image from "next/image"
import Link from "next/link"
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
import { InventoryHeader } from "./_components/inventory-header"
import { formatCurrencyBGN } from "./_lib/format-currency"

export default async function BusinessInventoryPage() {
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const { products, summary } = await getBusinessInventory(businessSeller.id)

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <InventoryHeader summary={summary} />

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
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
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
                      {formatCurrencyBGN(product.price)}
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
