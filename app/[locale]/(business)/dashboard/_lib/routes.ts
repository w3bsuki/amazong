export const BUSINESS_PAGE_TITLES = {
  "/dashboard": "Home",
  "/dashboard/orders": "Orders",
  "/dashboard/products": "Products",
  "/dashboard/inventory": "Inventory",
  "/dashboard/customers": "Customers",
  "/dashboard/discounts": "Discounts",
  "/dashboard/marketing": "Marketing",
  "/dashboard/analytics": "Analytics",
  "/dashboard/accounting": "Finances",
  "/dashboard/settings": "Settings",
} as const

export type BusinessRoute = keyof typeof BUSINESS_PAGE_TITLES

const titleFor = (route: BusinessRoute) => BUSINESS_PAGE_TITLES[route]

type BusinessNavItem = { title: string; url: BusinessRoute }

export const BUSINESS_NAV = {
  salesChannel: [
    { title: titleFor("/dashboard"), url: "/dashboard" },
    { title: titleFor("/dashboard/orders"), url: "/dashboard/orders" },
  ],
  products: [
    { title: titleFor("/dashboard/products"), url: "/dashboard/products" },
    { title: titleFor("/dashboard/inventory"), url: "/dashboard/inventory" },
  ],
  customers: [
    { title: titleFor("/dashboard/customers"), url: "/dashboard/customers" },
  ],
  marketing: [
    { title: titleFor("/dashboard/discounts"), url: "/dashboard/discounts" },
    { title: titleFor("/dashboard/marketing"), url: "/dashboard/marketing" },
  ],
  analytics: [
    { title: titleFor("/dashboard/analytics"), url: "/dashboard/analytics" },
    { title: titleFor("/dashboard/accounting"), url: "/dashboard/accounting" },
  ],
  settings: [
    { title: titleFor("/dashboard/settings"), url: "/dashboard/settings" },
  ],
} satisfies {
  salesChannel: BusinessNavItem[]
  products: BusinessNavItem[]
  customers: BusinessNavItem[]
  marketing: BusinessNavItem[]
  analytics: BusinessNavItem[]
  settings: BusinessNavItem[]
}
