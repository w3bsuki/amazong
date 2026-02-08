import { render } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { ProductCardPrice } from "@/components/shared/product/product-card-price"

describe("ProductCardPrice presentation", () => {
  test("renders soft strip container when presentation is soft-strip", () => {
    const { container } = render(
      <ProductCardPrice
        price={199.99}
        originalPrice={249.99}
        locale="en"
        presentation="soft-strip"
      />
    )

    const strip = container.querySelector("div.bg-background.border-border-subtle")
    expect(strip).toBeTruthy()
  })

  test("does not render soft strip container by default", () => {
    const { container } = render(
      <ProductCardPrice
        price={199.99}
        originalPrice={249.99}
        locale="en"
      />
    )

    const strip = container.querySelector("div.bg-background.border-border-subtle")
    expect(strip).toBeNull()
  })
})
