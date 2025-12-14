import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { connection } from "next/server"
import { OrderDetailContent } from "./order-detail-content"

interface OrderDetailPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  await connection()
  const { locale, id } = await params
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

  // Fetch order with all related data
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        product:products (
          id,
          title,
          slug,
          images,
          price
        ),
        seller:sellers (
          id,
          store_name,
          profile:profiles!sellers_id_fkey (
            full_name,
            avatar_url
          )
        )
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !order) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="sr-only">
        {locale === "bg" ? `Поръчка #${id.slice(0, 8)}` : `Order #${id.slice(0, 8)}`}
      </h1>
      <OrderDetailContent 
        locale={locale} 
        order={order}
      />
    </div>
  )
}
