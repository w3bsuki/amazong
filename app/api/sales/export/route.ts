import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replaceAll('"', '""')}"`
  return s
}

function parseDateParam(value: string | null): Date | null {
  if (!value) return null
  // Accept YYYY-MM-DD only (from <input type="date">)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const d = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(d.getTime())) return null
  return d
}

export async function GET(req: Request) {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const url = new URL(req.url)
  const fromParam = url.searchParams.get("from")
  const toParam = url.searchParams.get("to")

  const fromDate = parseDateParam(fromParam)
  const toDate = parseDateParam(toParam)

  if (!fromDate || !toDate || fromDate > toDate) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
  }

  // Make `to` inclusive by advancing one day
  const toExclusive = new Date(toDate)
  toExclusive.setUTCDate(toExclusive.getUTCDate() + 1)

  // 1) Fetch seller order items (IDs only first)
  const { data: items } = await supabase
    .from("order_items")
    .select("id, order_id, product_id, quantity, price_at_purchase, status")
    .eq("seller_id", user.id)

  const orderIds = [...new Set((items || []).map((i) => i.order_id))]
  const productIds = [...new Set((items || []).map((i) => i.product_id))]

  // 2) Fetch orders within range
  const { data: orders } = orderIds.length
    ? await supabase
        .from("orders")
        .select("id, created_at, status, user_id")
        .in("id", orderIds)
        .gte("created_at", fromDate.toISOString())
        .lt("created_at", toExclusive.toISOString())
        .order("created_at", { ascending: false })
    : { data: [] as Array<{ id: string; created_at: string; status: string | null; user_id: string }> }

  const orderMap = new Map((orders || []).map((o) => [o.id, o]))

  // 3) Fetch products
  const { data: products } = productIds.length
    ? await supabase
        .from("products")
        .select("id, title")
        .in("id", productIds)
    : { data: [] as Array<{ id: string; title: string }> }

  const productMap = new Map((products || []).map((p) => [p.id, p]))

  // 4) Fetch buyers (for seller export)
  const buyerIds = [...new Set((orders || []).map((o) => o.user_id))]
  const { data: buyers } = buyerIds.length
    ? await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", buyerIds)
    : { data: [] as Array<{ id: string; email: string | null; full_name: string | null }> }

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
    "buyer_email",
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
      buyer?.email || "",
      buyer?.full_name || "",
    ].map(csvEscape)

    rows.push(row.join(","))
  }

  const csv = rows.join("\n")
  const filename = `sales-${fromParam}_to_${toParam}.csv`

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  })
}
