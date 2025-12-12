import { createAdminClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
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
import { IconExternalLink } from "@tabler/icons-react"

async function getProducts() {
  const adminClient = createAdminClient()
  
  const { data: products, error } = await adminClient
    .from('products')
    .select(`
      id,
      title,
      price,
      stock,
      is_boosted,
      created_at,
      seller_id,
      sellers (
        store_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100)
  
  if (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
  
  return products
}

export default async function AdminProductsPage() {
  const products = await getProducts()
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            All product listings on the platform
          </p>
        </div>
        <Badge variant="outline" className="text-base">
          {products.length} listings
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            View and manage all product listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Listed</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <p className="font-medium truncate max-w-[200px]">
                      {product.title}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {(product.sellers as any)?.store_name || 'Unknown'}
                  </TableCell>
                  <TableCell className="font-medium text-emerald-600">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={product.stock > 0 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                      }
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.is_boosted && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                        Boosted
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/product/${product.id}`} target="_blank">
                        <IconExternalLink className="size-4" />
                      </Link>
                    </Button>
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
