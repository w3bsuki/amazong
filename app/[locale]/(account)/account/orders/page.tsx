import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"
import { AppBreadcrumb } from "@/components/app-breadcrumb"

export default async function OrdersPage() {
  await connection()
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  console.log('Orders page - User ID:', user.id)

  // First, let's do a simple query to test
  const { data: simpleOrders, error: simpleError } = await supabase
    .from("orders")
    .select("id, total_amount, status, created_at")
    .eq("user_id", user.id)

  console.log('Simple orders query:', simpleOrders?.length, 'Error:', simpleError)

  // Fetch orders from Supabase with full details
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
        *,
        order_items (
            *,
            product:products(*)
        )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  console.log('Orders page - Orders found:', orders?.length, 'Error:', error)

  return (
    <div className="container py-4 min-h-screen bg-background">
      <AppBreadcrumb 
        items={[
          { label: 'Your Account', href: '/account' },
          { label: 'Your Orders' }
        ]} 
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-4">
        <h1 className="text-3xl font-normal">Your Orders</h1>
        <div className="relative w-full md:w-auto">
          <MagnifyingGlass className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all orders"
            className="pl-8 w-full md:w-80 rounded-sm focus-visible:ring-brand"
          />
          <Button className="absolute right-0 top-0 h-full bg-header-bg hover:bg-header-bg/90 text-header-text rounded-l-none rounded-r-sm">
            Search Orders
          </Button>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <Card className="rounded-none border-border shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">You have not placed any orders yet.</p>
            <Link href="/">
              <Button className="bg-brand hover:bg-brand/90 text-foreground rounded-full">Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="rounded-md border-border shadow-sm overflow-hidden">
              <CardHeader className="bg-muted p-4 border-b border-border">
                <div className="flex flex-col md:flex-row justify-between text-sm text-muted-foreground gap-4">
                  <div className="flex gap-8">
                    <div>
                      <div className="uppercase text-xs font-bold">Order Placed</div>
                      <div>{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="uppercase text-xs font-bold">Total</div>
                      <div>${order.total_amount}</div>
                    </div>
                    <div>
                      <div className="uppercase text-xs font-bold">Ship To</div>
                      <div className="text-link hover:underline cursor-pointer">User</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="uppercase text-xs font-bold">Order # {order.id.slice(0, 8)}</div>
                    <div className="flex gap-2 justify-end">
                      <Link href="#" className="text-link hover:underline">
                        View order details
                      </Link>
                      <span className="text-muted-foreground/50">|</span>
                      <Link href="#" className="text-link hover:underline">
                        Invoice
                      </Link>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col gap-6">
                  <h3 className="font-bold text-lg text-accent-foreground">
                    {order.status === "delivered" ? "Delivered" : "Arriving soon"}
                  </h3>
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-24 h-24 shrink-0">
                        <Image
                          src={item.product?.images?.[0] || "/placeholder.svg"}
                          alt={item.product?.title || "Product"}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/product/${item.product_id}`}
                          className="font-medium text-link hover:text-link-hover hover:underline"
                        >
                          {item.product?.title}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-1">
                          Return window closed on{" "}
                          {new Date(
                            new Date(order.created_at).setDate(new Date(order.created_at).getDate() + 30),
                          ).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            className="h-8 text-xs bg-muted hover:bg-muted/80 border-border shadow-sm text-foreground"
                          >
                            Buy it again
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8 text-xs bg-background hover:bg-muted border-border shadow-sm text-foreground"
                          >
                            View your item
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
