import { render } from "@testing-library/react"
import { describe, expect, test } from "vitest"

import { CategoryBadge } from "@/components/shared/product/pdp/category-badge"

describe("CategoryBadge", () => {
  test("hides icon content when showIcon is false", () => {
    const { container, queryByText } = render(
      <CategoryBadge
        locale="en"
        category={{
          slug: "electronics",
          name: "Electronics",
          icon: "📱",
        }}
        showIcon={false}
      />
    )

    expect(queryByText("📱")).toBeNull()
    expect(container.querySelector("svg")).toBeNull()
  })

  test("renders icon content by default", () => {
    const { queryByText } = render(
      <CategoryBadge
        locale="en"
        category={{
          slug: "electronics",
          name: "Electronics",
          icon: "📱",
        }}
      />
    )

    expect(queryByText("📱")).toBeTruthy()
  })
})
