"use client"

import { AppBreadcrumb, type BreadcrumbItemData } from "@/components/navigation/app-breadcrumb"

interface ProductBreadcrumbProps {
  locale: string
  category: {
    name: string
    slug: string
  } | null
  parentCategory: {
    name: string
    slug: string
  } | null
  productTitle: string
}

export function ProductBreadcrumb({
  locale,
  category,
  parentCategory,
  productTitle,
}: ProductBreadcrumbProps) {
  // Build breadcrumb items dynamically
  const items: BreadcrumbItemData[] = []

  // Add parent category if exists
  if (parentCategory) {
    items.push({
      label: parentCategory.name,
      href: `/categories/${parentCategory.slug}`,
    })
  }

  // Add category if exists
  if (category) {
    items.push({
      label: category.name,
      href: `/categories/${category.slug}`,
    })
  }

  // Add product title (no href = current page)
  items.push({
    label: productTitle,
  })

  return (
    <AppBreadcrumb 
      items={items} 
      homeLabel={locale === "bg" ? "Начало" : "Amazong"}
    />
  )
}
