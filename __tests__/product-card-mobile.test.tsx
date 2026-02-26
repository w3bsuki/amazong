import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import "@/test/mocks/next-image"
import "@/test/mocks/treido-link"

import { MobileProductCard } from "@/components/shared/product/card/mobile"

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () =>
    (key: string, values?: Record<string, unknown>) => {
      if (key === "openProduct") return `open-${values?.title ?? ""}`
      if (key === "adBadge") return "Ad"
      if (key === "b2b.verifiedShort") return "Verified"
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

describe("MobileProductCard", () => {
  test("renders price → title → seller order with plain text price (design v3)", () => {
    render(
      <MobileProductCard
        id="p-2"
        title="Aifon 17"
        price={67}
        originalPrice={75}
        image="/cat.jpg"
        createdAt={new Date().toISOString()}
        slug="aifon-17"
        username="treido"
        sellerId="seller-2"
        sellerName="Treido"
        sellerTier="business"
        sellerVerified
        categoryPath={[{ slug: "electronics", name: "Electronics" }]}
        isBoosted
      />
    )

    // Promoted badge still visible
    expect(screen.getByTestId("product-card-ad-badge")).toBeInTheDocument()

    // Category badge is NOT rendered (design: no category overlay)
    expect(screen.queryByText("Electronics")).not.toBeInTheDocument()

    // Price row — plain text, not a badge
    const priceRow = screen.getByTestId("product-card-price-row")
    expect(priceRow).toBeInTheDocument()
    expect(priceRow).toHaveTextContent(/67/)
    // No badge wrapper on price
    expect(priceRow.querySelector('[data-slot="badge"]')).toBeNull()

    // Seller row present
    const sellerRow = screen.getByTestId("product-card-seller-row")
    expect(sellerRow).toBeInTheDocument()
    expect(sellerRow).toHaveTextContent("Treido")

    // Seller row includes freshness indicator
    expect(sellerRow).toHaveTextContent("justNow")

    // Order: price row before seller row in DOM (price → title → seller)
    expect(Boolean(priceRow.compareDocumentPosition(sellerRow) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true)

    expect(screen.getByTestId("product-card-actions")).toBeInTheDocument()

    const link = screen.getByRole("link", { name: /open-aifon 17/i })
    expect(link).toHaveAttribute("data-slot", "product-card-link")
    expect(link).toHaveAttribute("href", "/treido/aifon-17")
  })
})
