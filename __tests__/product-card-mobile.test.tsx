import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import { MobileProductCard } from "@/components/shared/product/card/mobile"

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- next/image is mocked with <img> in unit tests
    <img alt={alt} src={src} {...props} />
  ),
}))

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

vi.mock("@/components/shared/product/card/actions", () => ({
  ProductCardActions: () => <div data-testid="product-card-actions" />,
}))

describe("MobileProductCard", () => {
  test("renders seller-only row and dedicated price meta row with freshness + price badge", () => {
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

    expect(screen.getByTestId("product-card-ad-badge")).toBeInTheDocument()
    const categoryLabel = screen.getByText("Electronics")
    expect(categoryLabel.closest('[data-slot="category"]')).toBeInTheDocument()

    const sellerRow = screen.getByTestId("product-card-seller-row")
    expect(sellerRow).toBeInTheDocument()
    expect(sellerRow).toHaveTextContent("Treido")
    expect(sellerRow).not.toHaveTextContent("justNow")
    expect(Boolean(categoryLabel.compareDocumentPosition(sellerRow) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true)

    const priceRow = screen.getByTestId("product-card-price-row")
    expect(priceRow).toBeInTheDocument()
    expect(priceRow).toHaveTextContent("justNow")
    const rowChildren = priceRow.querySelectorAll(":scope > *")
    expect(rowChildren.item(0)?.querySelector('[data-slot="badge"]')).not.toBeNull()
    expect(rowChildren.item(0)).toHaveTextContent("€67")
    expect(rowChildren.item(rowChildren.length - 1)).toHaveTextContent("justNow")

    expect(screen.getByTestId("product-card-actions")).toBeInTheDocument()

    const link = screen.getByRole("link", { name: /open-aifon 17/i })
    expect(link).toHaveAttribute("data-slot", "product-card-link")
    expect(link).toHaveAttribute("href", "/treido/aifon-17")
  })
})
