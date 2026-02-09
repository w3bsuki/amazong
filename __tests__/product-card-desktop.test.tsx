import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import { DesktopProductCard } from "@/components/shared/product/product-card-desktop"

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: { alt: string; src: string }) => <img alt={alt} src={src} {...props} />,
}))

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () =>
    (key: string, values?: Record<string, unknown>) => {
      if (key === "openProduct") return `open-${values?.title ?? ""}`
      if (key === "adBadge") return "Ad"
      if (key === "freeDeliveryShort") return "freeDeliveryShort"
      if (key === "b2b.verifiedShort") return "b2b.verifiedShort"
      if (key === "sold") return "sold"
      return key
    },
}))

vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("@/components/providers/drawer-context", () => ({
  useDrawer: () => ({
    openProductQuickView: vi.fn(),
    enabledDrawers: { productQuickView: false },
    isDrawerSystemEnabled: false,
  }),
}))

vi.mock("@/components/shared/product/product-card-actions", () => ({
  ProductCardActions: () => <div data-testid="product-card-actions" />,
}))

describe("DesktopProductCard", () => {
  test("renders desktop price, trust metadata, and link selector", () => {
    render(
      <DesktopProductCard
        id="p-1"
        title="iPhone 15 Pro Max"
        price={1950}
        originalPrice={2200}
        image="/test-phone.jpg"
        createdAt={new Date().toISOString()}
        slug="iphone-15"
        username="treido"
        sellerId="seller-1"
        sellerName="Treido"
        sellerAvatarUrl={null}
        sellerTier="business"
        sellerVerified
        freeShipping
        rating={4.8}
        reviews={120}
        soldCount={12}
      />
    )

    const link = screen.getByRole("link", { name: /open-iphone 15 pro max/i })
    expect(link).toHaveAttribute("data-slot", "product-card-link")
    expect(link).toHaveAttribute("href", "/treido/iphone-15")

    expect(screen.getByText(/1,950/)).toBeInTheDocument()
    expect(screen.getByText("freeDeliveryShort")).toBeInTheDocument()
    expect(screen.getByText("b2b.verifiedShort")).toBeInTheDocument()
    expect(screen.getByText(/sold/i)).toBeInTheDocument()
  })
})
