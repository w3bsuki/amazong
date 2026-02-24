import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { noStoreJson } from "@/lib/api/response-helpers"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"

const DateParamSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const SalesExportQuerySchema = z.object({
  from: DateParamSchema,
  to: DateParamSchema,
})
const EXPORT_FAILED_ERROR = "Failed to export sales"

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replaceAll('"', '""')}"`
  return s
}

function parseDateParam(value: string): Date | null {
  const d = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(d.getTime())) return null
  return d
}

export async function GET(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return noStoreJson({ skipped: true }, { status: 200 })
  }

  try {
    const { supabase, applyCookies } = createRouteHandlerClient(req)
    const noStore = (body: unknown, init?: Parameters<typeof noStoreJson>[1]) =>
      applyCookies(noStoreJson(body, init))

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return noStore({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const parsedQuery = SalesExportQuerySchema.safeParse({
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    })
    if (!parsedQuery.success) {
      return noStore({ error: "Invalid date range" }, { status: 400 })
    }

    const fromDate = parseDateParam(parsedQuery.data.from)
    const toDate = parseDateParam(parsedQuery.data.to)

    if (!fromDate || !toDate || fromDate > toDate) {
      return noStore({ error: "Invalid date range" }, { status: 400 })
    }

    // Make `to` inclusive by advancing one day
    const toExclusive = new Date(toDate)
    toExclusive.setUTCDate(toExclusive.getUTCDate() + 1)

    // 1) Fetch seller order items (IDs only first)
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("id, order_id, product_id, quantity, price_at_purchase, status")
      .eq("seller_id", user.id)

    if (itemsError) {
      console.error("Sales export failed to fetch order items:", itemsError)
      return noStore({ error: EXPORT_FAILED_ERROR }, { status: 500 })
    }

    const orderIds = [...new Set((items || []).map((i) => i.order_id))]
    const productIds = [...new Set((items || []).map((i) => i.product_id))]

    // 2) Fetch orders within range
    const { data: orders, error: ordersError } = orderIds.length
      ? await supabase
          .from("orders")
          .select("id, created_at, status, user_id")
          .in("id", orderIds)
          .gte("created_at", fromDate.toISOString())
          .lt("created_at", toExclusive.toISOString())
          .order("created_at", { ascending: false })
      : {
          data: [] as Array<{
            id: string
            created_at: string
            status: string | null
            user_id: string
          }>,
          error: null,
        }

    if (ordersError) {
      console.error("Sales export failed to fetch orders:", ordersError)
      return noStore({ error: EXPORT_FAILED_ERROR }, { status: 500 })
    }

    const orderMap = new Map((orders || []).map((o) => [o.id, o]))

    // 3) Fetch products
    const { data: products, error: productsError } = productIds.length
      ? await supabase
          .from("products")
          .select("id, title")
          .in("id", productIds)
      : { data: [] as Array<{ id: string; title: string }>, error: null }

    if (productsError) {
      console.error("Sales export failed to fetch products:", productsError)
      return noStore({ error: EXPORT_FAILED_ERROR }, { status: 500 })
    }

    const productMap = new Map((products || []).map((p) => [p.id, p]))

    // 4) Fetch buyers (for seller export)
    const buyerIds = [...new Set((orders || []).map((o) => o.user_id))]
    const { data: buyers, error: buyersError } = buyerIds.length
      ? await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", buyerIds)
      : { data: [] as Array<{ id: string; full_name: string | null }>, error: null }

    if (buyersError) {
      console.error("Sales export failed to fetch buyer profiles:", buyersError)
      return noStore({ error: EXPORT_FAILED_ERROR }, { status: 500 })
    }

    const buyerMap = new Map((buyers || []).map((b) => [b.id, b]))

    // 5) Build CSV rows for items with orders in range
    const header = [
      "order_id",
      "order_created_at",
      "order_status",
      "product_id",
      "product_title",
      "quantity",
      "unit_price",
      "line_total",
      "item_status",
      "buyer_name",
    ]

    const rows: string[] = []
    rows.push(header.join(","))

    for (const item of items || []) {
      const order = orderMap.get(item.order_id)
      if (!order) continue

      const product = productMap.get(item.product_id)
      const buyer = buyerMap.get(order.user_id)

      const qty = Number(item.quantity) || 0
      const unit = Number(item.price_at_purchase) || 0
      const total = qty * unit

      const row = [
        order.id,
        order.created_at,
        order.status || "pending",
        item.product_id,
        product?.title || "",
        qty,
        unit,
        total,
        item.status || "",
        buyer?.full_name || "",
      ].map(csvEscape)

      rows.push(row.join(","))
    }

    const csv = rows.join("\n")
    const filename = `sales-${parsedQuery.data.from}_to_${parsedQuery.data.to}.csv`

    return applyCookies(
      new NextResponse(csv, {
        headers: {
          "content-type": "text/csv; charset=utf-8",
          "content-disposition": `attachment; filename="${filename}"`,
          "cache-control": "no-store",
        },
      })
    )
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) {
      return noStoreJson({ skipped: true }, { status: 200 })
    }

    console.error("Sales export API error:", error)
    return noStoreJson({ error: EXPORT_FAILED_ERROR }, { status: 500 })
  }
}
