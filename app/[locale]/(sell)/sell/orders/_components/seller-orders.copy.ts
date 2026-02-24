import type { SellerOrdersCopy } from "./seller-orders.types"

export function getSellerOrdersCopy(locale: string): SellerOrdersCopy {
  if (locale === "bg") {
    return {
      headerTitle: "Поръчки от купувачи",
      headerDescription: "Управлявайте входящите поръчки и доставките",
      refresh: "Обнови",
      tabs: {
        active: "Активни",
      },
      empty: {
        title: "Все още няма поръчки",
        allDescription: "Когато клиентите купуват вашите продукти, поръчките ще се появят тук.",
        statusDescription: (statusLabel) => `Нямате поръчки със статус „${statusLabel}“.`,
      },
      item: {
        unknownProduct: "Неизвестен продукт",
        quantity: "Кол.",
        unitMultiplier: "×",
        shipTo: "Адрес за доставка",
        tracking: "Проследяване",
        ordered: "Поръчана",
        unknownUser: "Потребител",
        unknownBuyer: "Неизвестен купувач",
        productImageAlt: "Изображение на продукт",
      },
    }
  }

  return {
    headerTitle: "Your Orders",
    headerDescription: "Manage incoming orders and shipments",
    refresh: "Refresh",
    tabs: {
      active: "Active",
    },
    empty: {
      title: "No orders yet",
      allDescription: "When customers purchase your products, their orders will appear here.",
      statusDescription: (statusLabel) => `You have no ${statusLabel.toLowerCase()} orders.`,
    },
    item: {
      unknownProduct: "Unknown Product",
      quantity: "Qty",
      unitMultiplier: "×",
      shipTo: "Ship to",
      tracking: "Tracking",
      ordered: "Ordered",
      unknownUser: "User",
      unknownBuyer: "Unknown buyer",
      productImageAlt: "Product image",
    },
  }
}
