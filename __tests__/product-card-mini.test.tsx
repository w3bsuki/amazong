import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import { ProductMiniCard } from "@/components/shared/product/card/mini"

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: { alt: string; src: string }) => <img alt={alt} src={src} {...props} />,
}))

vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

afterEach(() => {
  cleanup()
})

describe("ProductMiniCard", () => {
  test("renders stable title, price, and link when href is provided", () => {
    render(
      <ProductMiniCard
        id="mini-1"
        title="iPhone 15"
        price={1234}
        image="/mini.jpg"
        href="/treido/iphone-15"
        locale="en"
      />
    )

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/treido/iphone-15")
    expect(screen.getByText("iPhone 15")).toBeInTheDocument()
    expect(screen.getByText(/1,234/)).toBeInTheDocument()
  })

  test("renders without a link when href is missing", () => {
    const { container } = render(
      <ProductMiniCard
        id="mini-2"
        title="No Link"
        price={10}
        image={null}
        locale="en"
      />
    )

    expect(container.querySelector("a")).toBeNull()
    expect(screen.getByText("No Link")).toBeInTheDocument()
  })

  test("falls back to placeholder image after load error", () => {
    render(
      <ProductMiniCard
        id="mini-3"
        title="Broken Image"
        price={100}
        image="https://example.com/broken-image.jpg"
        locale="en"
      />
    )

    const image = screen.getByAltText("Broken Image")
    fireEvent.error(image)

    expect(image).toHaveAttribute("src", expect.stringContaining("/placeholder.jpg"))
  })
})
