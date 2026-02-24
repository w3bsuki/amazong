import React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

vi.mock("@/components/shared/product/card/desktop", () => ({
  DesktopProductCard: ({ id }: { id: string }) => (
    <a data-testid={`desktop-${id}`} data-slot="product-card-link" href={`/${id}`}>
      desktop-{id}
    </a>
  ),
}))

vi.mock("@/components/shared/product/card/mobile", () => ({
  MobileProductCard: ({ id, layout }: { id: string; layout?: "feed" | "rail" }) => (
    <a
      data-testid={`mobile-${id}`}
      data-layout={layout ?? "feed"}
      data-slot="product-card-link"
      href={`/${id}`}
    >
      mobile-{id}
    </a>
  ),
}))

vi.mock("@/components/shared/product/card/list", () => ({
  ProductCardList: ({ id }: { id: string }) => <div data-testid={`list-${id}`}>list-{id}</div>,
}))

import { ProductGrid } from "@/components/shared/product/product-grid"

afterEach(() => {
  cleanup()
})

const sampleProducts = [
  {
    id: "p1",
    title: "Phone",
    price: 100,
    image: "/phone.jpg",
    sellerName: "treido",
  },
]

describe("ProductGrid presets", () => {
  test("uses desktop card for desktop preset and keeps #product-grid", () => {
    render(<ProductGrid products={sampleProducts} preset="desktop" />)

    expect(screen.getByTestId("desktop-p1")).toBeInTheDocument()
    expect(screen.queryByTestId("mobile-p1")).toBeNull()

    const root = document.getElementById("product-grid")
    expect(root).not.toBeNull()
    expect(root).toHaveAttribute("data-slot", "product-grid")
    expect(screen.getByTestId("desktop-p1")).toHaveAttribute("data-slot", "product-card-link")
  })

  test("uses mobile feed card for mobile-feed preset", () => {
    render(<ProductGrid products={sampleProducts} preset="mobile-feed" />)

    const card = screen.getByTestId("mobile-p1")
    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute("data-layout", "feed")
  })

  test("uses mobile rail card for mobile-rail preset", () => {
    render(<ProductGrid products={sampleProducts} preset="mobile-rail" />)

    const card = screen.getByTestId("mobile-p1")
    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute("data-layout", "rail")
  })
})
