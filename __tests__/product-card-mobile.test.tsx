import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import { MobileProductCard } from "@/components/shared/product/product-card-mobile"

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: { alt: string; src: string }) => <img alt={alt} src={src} {...props} />,
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

vi.mock("@/components/shared/product/product-card-actions", () => ({
  ProductCardActions: () => <div data-testid="product-card-actions" />,
}))

describe("MobileProductCard", () => {
  test("renders ad badge, seller row, freshness, and wishlist overlay", () => {
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
        isBoosted
      />
    )

    expect(screen.getByTestId("product-card-ad-badge")).toBeInTheDocument()
    expect(screen.getByTestId("product-card-seller-row")).toBeInTheDocument()
    expect(screen.getByTestId("product-card-actions")).toBeInTheDocument()
    expect(screen.getByText("justNow")).toBeInTheDocument()

    const link = screen.getByRole("link", { name: /open-aifon 17/i })
    expect(link).toHaveAttribute("data-slot", "product-card-link")
    expect(link).toHaveAttribute("href", "/treido/aifon-17")
  })
})
