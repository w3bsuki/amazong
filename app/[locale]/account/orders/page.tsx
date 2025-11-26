import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Package } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default async function OrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch orders from Supabase
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
    <div className="container mx-auto p-4 max-w-5xl min-h-screen bg-white dark:bg-zinc-900">
      <Breadcrumb 
        items={[
          { label: 'Your Account', href: '/account' },
          { label: 'Your Orders', icon: <Package className="h-3.5 w-3.5" /> }
        ]} 
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-4">
        <h1 className="text-3xl font-normal">Your Orders</h1>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search all orders"
            className="pl-8 w-full md:w-80 rounded-sm focus-visible:ring-brand-warning"
          />
          <Button className="absolute right-0 top-0 h-full bg-[#303333] hover:bg-[#1d1f1f] text-white rounded-l-none rounded-r-sm">
            Search Orders
          </Button>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <Card className="rounded-none border-zinc-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-zinc-600 mb-4">You have not placed any orders yet.</p>
            <Link href="/">
              <Button className="bg-[#f7ca00] hover:bg-[#f2bd00] text-black rounded-full">Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="rounded-md border-zinc-300 shadow-sm overflow-hidden">
              <CardHeader className="bg-[#f0f2f2] p-4 border-b border-zinc-200">
                <div className="flex flex-col md:flex-row justify-between text-sm text-zinc-600 gap-4">
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
                      <div className="text-[#007185] hover:underline cursor-pointer">User</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="uppercase text-xs font-bold">Order # {order.id.slice(0, 8)}</div>
                    <div className="flex gap-2 justify-end">
                      <Link href="#" className="text-[#007185] hover:underline">
                        View order details
                      </Link>
                      <span className="text-zinc-300">|</span>
                      <Link href="#" className="text-[#007185] hover:underline">
                        Invoice
                      </Link>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col gap-6">
                  <h3 className="font-bold text-lg text-[#067d62]">
                    {order.status === "delivered" ? "Delivered" : "Arriving soon"}
                  </h3>
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-24 h-24 shrink-0">
                        <Image
                          src={item.product?.image_url || "/placeholder.svg"}
                          alt={item.product?.title || "Product"}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/product/${item.product_id}`}
                          className="font-medium text-[#007185] hover:text-[#c7511f] hover:underline"
                        >
                          {item.product?.title}
                        </Link>
                        <div className="text-xs text-zinc-500 mt-1">
                          Return window closed on{" "}
                          {new Date(
                            new Date(order.created_at).setDate(new Date(order.created_at).getDate() + 30),
                          ).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            className="h-8 text-xs bg-[#f0f2f2] hover:bg-[#e3e6e6] border-zinc-300 shadow-sm text-black"
                          >
                            Buy it again
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8 text-xs bg-white hover:bg-zinc-50 border-zinc-300 shadow-sm text-black"
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
