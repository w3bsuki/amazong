import type { SupportedLocale } from "@/lib/stripe-locale"

export type OrderConfirmationEmailItem = {
  title: string
  quantity: number
  unitPrice: number
}

export type OrderConfirmationEmailSeller = {
  name: string
  avatarUrl: string | null
}

export type OrderConfirmationEmailProps = {
  locale: SupportedLocale
  subject: string
  orderId: string
  orderUrl: string
  items: OrderConfirmationEmailItem[]
  currency: string
  totalAmount: number
  seller: OrderConfirmationEmailSeller | null
}

function getFormatter(locale: SupportedLocale, currency: string) {
  const localeTag = locale === "bg" ? "bg-BG" : "en-US"
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  })
}

function getCopy(locale: SupportedLocale) {
  if (locale === "bg") {
    return {
      preheader: "Получихме плащането ви и подготвяме поръчката.",
      title: "Поръчката ви е потвърдена",
      deliveryEstimateTitle: "Прогноза за доставка",
      deliveryEstimateBody: "Обикновено 2–5 работни дни след като продавачът изпрати поръчката.",
      sellerTitle: "Продавач",
      itemsTitle: "Обобщение на поръчката",
      item: "Артикул",
      qty: "бр.",
      price: "Цена",
      total: "Общо",
      orderId: "Номер на поръчка",
      viewOrder: "Виж поръчката",
      footer: "Ако имате въпроси, отговорете на този имейл.",
      brand: "Treido",
    }
  }

  return {
    preheader: "We received your payment and are preparing your order.",
    title: "Your order is confirmed",
    deliveryEstimateTitle: "Delivery estimate",
    deliveryEstimateBody: "Typically 2–5 business days after the seller ships your order.",
    sellerTitle: "Seller",
    itemsTitle: "Order summary",
    item: "Item",
    qty: "qty",
    price: "Price",
    total: "Total",
    orderId: "Order ID",
    viewOrder: "View order",
    footer: "Questions? Reply to this email.",
    brand: "Treido",
  }
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function escapeAttr(input: string): string {
  return escapeHtml(input).replaceAll("\n", " ").replaceAll("\r", " ")
}

export function renderOrderConfirmationEmailHtml(props: OrderConfirmationEmailProps): string {
  const { locale, subject, orderId, orderUrl, items, currency, totalAmount, seller } = props
  const copy = getCopy(locale)
  const fmt = getFormatter(locale, currency)

  const itemsRows = items
    .map((item) => {
      const safeTitle = escapeHtml(item.title)
      const safeQty = String(item.quantity)
      const safePrice = escapeHtml(fmt.format(item.unitPrice))

      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgb(241, 245, 249);font-size:13px;vertical-align:top;">${safeTitle}</td>
          <td style="padding:10px 0;border-bottom:1px solid rgb(241, 245, 249);font-size:13px;vertical-align:top;text-align:right;white-space:nowrap;">${safeQty}</td>
          <td style="padding:10px 0;border-bottom:1px solid rgb(241, 245, 249);font-size:13px;vertical-align:top;text-align:right;white-space:nowrap;">${safePrice}</td>
        </tr>
      `
    })
    .join("")

  const sellerSection = seller
    ? `
      <div style="padding:16px 20px;">
        <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:rgb(15, 23, 42);">${escapeHtml(copy.sellerTitle)}</p>
        <div style="display:flex;align-items:center;gap:12px;">
          ${
            seller.avatarUrl
              ? `<img src="${escapeAttr(seller.avatarUrl)}" alt="${escapeAttr(seller.name)}" width="40" height="40" style="width:40px;height:40px;border-radius:9999px;background-color:rgb(241, 245, 249);border:1px solid rgb(226, 232, 240);display:block;" />`
              : `<div aria-hidden="true" style="width:40px;height:40px;border-radius:9999px;background-color:rgb(241, 245, 249);border:1px solid rgb(226, 232, 240);display:block;"></div>`
          }
          <p style="margin:0;font-size:14px;font-weight:600;color:rgb(15, 23, 42);">${escapeHtml(seller.name)}</p>
        </div>
      </div>
    `
    : ""

  const safeSubject = escapeHtml(subject)
  const safeOrderId = escapeHtml(orderId)
  const safeOrderUrl = escapeAttr(orderUrl)
  const safeOrderIdLabel = escapeHtml(copy.orderId)

  return `<!doctype html>
<html lang="${escapeAttr(locale)}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>${safeSubject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:rgb(248, 250, 252);color:rgb(15, 23, 42);font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(copy.preheader)}</div>

    <div style="width:100%;padding:24px 12px;">
      <div style="max-width:560px;margin:0 auto;background-color:white;border-radius:16px;overflow:hidden;border:1px solid rgb(226, 232, 240);">
        <div style="padding:20px 20px 12px;border-bottom:1px solid rgb(226, 232, 240);">
          <p style="font-size:14px;font-weight:700;letter-spacing:0.02em;color:rgb(15, 23, 42);margin:0;">${escapeHtml(copy.brand)}</p>
          <h1 style="margin:10px 0 0;font-size:20px;line-height:28px;font-weight:700;">${escapeHtml(copy.title)}</h1>
        </div>

        <div style="padding:16px 20px;">
          <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:rgb(15, 23, 42);">${escapeHtml(copy.deliveryEstimateTitle)}</p>
          <p style="margin:0;font-size:13px;line-height:20px;color:rgb(71, 85, 105);">${escapeHtml(copy.deliveryEstimateBody)}</p>

          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:12px;">
            <span style="display:inline-block;padding:6px 10px;border-radius:9999px;border:1px solid rgb(226, 232, 240);background-color:rgb(248, 250, 252);font-size:12px;color:rgb(15, 23, 42);">
              ${safeOrderIdLabel}: <strong>${safeOrderId}</strong>
            </span>
            <a href="${safeOrderUrl}" style="display:inline-block;padding:10px 14px;border-radius:12px;background-color:rgb(15, 23, 42);color:white;text-decoration:none;font-size:13px;font-weight:700;">
              ${escapeHtml(copy.viewOrder)}
            </a>
          </div>
        </div>

        ${sellerSection}

        <div style="padding:16px 20px;">
          <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:rgb(15, 23, 42);">${escapeHtml(copy.itemsTitle)}</p>
          <table style="width:100%;border-collapse:collapse;" role="presentation">
            <thead>
              <tr>
                <th style="text-align:left;font-size:12px;font-weight:700;color:rgb(71, 85, 105);padding:8px 0;border-bottom:1px solid rgb(226, 232, 240);">${escapeHtml(copy.item)}</th>
                <th style="text-align:right;white-space:nowrap;font-size:12px;font-weight:700;color:rgb(71, 85, 105);padding:8px 0;border-bottom:1px solid rgb(226, 232, 240);">${escapeHtml(copy.qty)}</th>
                <th style="text-align:right;white-space:nowrap;font-size:12px;font-weight:700;color:rgb(71, 85, 105);padding:8px 0;border-bottom:1px solid rgb(226, 232, 240);">${escapeHtml(copy.price)}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
              <tr>
                <td colspan="2" style="padding:10px 0;border-bottom:1px solid rgb(241, 245, 249);font-size:14px;font-weight:700;padding-top:12px;">${escapeHtml(copy.total)}</td>
                <td style="padding:10px 0;border-bottom:1px solid rgb(241, 245, 249);font-size:14px;font-weight:700;padding-top:12px;text-align:right;white-space:nowrap;">${escapeHtml(fmt.format(totalAmount))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="padding:16px 20px;border-top:1px solid rgb(226, 232, 240);">
          <p style="margin:0;font-size:13px;line-height:20px;color:rgb(71, 85, 105);">${escapeHtml(copy.footer)}</p>
        </div>
      </div>
    </div>
  </body>
</html>`
}
