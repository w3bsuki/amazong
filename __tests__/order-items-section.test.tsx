/* eslint-disable no-restricted-imports, @next/next/no-img-element */
import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import {
  OrderItemsSection,
  OrderItemsSectionDesktop,
} from "@/app/[locale]/(checkout)/_components/order-items-section"

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: { alt: string; src: string }) => <img alt={alt} src={src} {...props} />,
}))

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

afterEach(() => {
  cleanup()
})

const items = [
  {
    id: "item-1",
    title: "Broken Thumb Product",
    price: 120,
    image: "https://example.com/broken-thumb.jpg",
    quantity: 2,
  },
]

describe("OrderItemsSection image fallback", () => {
  test("uses placeholder after image error in compact section", () => {
    render(<OrderItemsSection items={items} formatPrice={(price) => `€${price.toFixed(2)}`} />)

    const image = screen.getByAltText("Broken Thumb Product")
    fireEvent.error(image)

    expect(image).toHaveAttribute("src", expect.stringContaining("/placeholder.jpg"))
  })

  test("uses placeholder after image error in desktop section", () => {
    render(<OrderItemsSectionDesktop items={items} formatPrice={(price) => `€${price.toFixed(2)}`} />)

    const image = screen.getByAltText("Broken Thumb Product")
    fireEvent.error(image)

    expect(image).toHaveAttribute("src", expect.stringContaining("/placeholder.jpg"))
  })
})
