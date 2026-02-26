import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import "@/test/mocks/next-image"
import "@/test/mocks/treido-link"

import { DesktopProductCard } from "@/components/shared/product/card/desktop"

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

vi.mock("@/components/providers/drawer-context", () => ({
  useDrawer: () => ({
    openProductQuickView: vi.fn(),
    enabledDrawers: { productQuickView: false },
    isDrawerSystemEnabled: false,
  }),
}))

vi.mock("@/components/shared/product/card/actions", () => ({
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
    expect(screen.getByTestId("product-card-discount-badge")).toBeInTheDocument()
    expect(screen.getByTestId("product-card-seller-row")).toHaveTextContent("Treido")
    expect(screen.getByLabelText("b2b.verifiedShort")).toBeInTheDocument()
  })
})
