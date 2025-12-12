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

  return (
    <div className="flex flex-col gap-6">
      <AppBreadcrumb 
        items={[
          { label: 'Your Account', href: '/account' },
          { label: 'Your Orders' }
        ]} 
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Your Orders</h1>
          <p className="text-sm text-muted-foreground">
            {error ? "We couldn’t load your orders right now." : "Track, return, or buy again."}
          </p>
        </div>
        <div className="relative w-full md:w-md">
          <MagnifyingGlass className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders" className="pl-9" />
          <Button type="button" className="absolute right-1 top-1 h-7 px-3" size="sm">
            Search
          </Button>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <Card className="shadow-xs">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">You have not placed any orders yet.</p>
            <Link href="/">
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden shadow-xs">
              <CardHeader className="border-b bg-muted/40 p-4">
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
                      <div className="text-primary hover:underline cursor-pointer">User</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="uppercase text-xs font-bold">Order # {order.id.slice(0, 8)}</div>
                    <div className="flex gap-2 justify-end">
                      <Link href="#" className="text-primary hover:underline">
                        View order details
                      </Link>
                      <span className="text-muted-foreground/50">|</span>
                      <Link href="#" className="text-primary hover:underline">
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
                          className="font-medium text-primary hover:underline"
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
                            className="h-8 text-xs"
                          >
                            Buy it again
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8 text-xs"
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
