import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import { ProductMiniCard } from "@/components/shared/product/card/mini"

type MockNextImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  alt: string
  src: string
  fill?: boolean
  priority?: boolean
  blurDataURL?: string
  placeholder?: "blur" | "empty"
}

type MockNextImageRestProps = Omit<MockNextImageProps, "alt" | "src">

function sanitizeNextImageProps(props: MockNextImageRestProps): React.ImgHTMLAttributes<HTMLImageElement> {
  const imgProps: MockNextImageRestProps = { ...props }
  for (const key of ["fill", "priority", "blurDataURL", "placeholder"] as const) {
    delete imgProps[key]
  }
  return imgProps
}

type MockLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  children: React.ReactNode
  prefetch?: boolean
}

type MockLinkRestProps = Omit<MockLinkProps, "href" | "children">

function sanitizeLinkProps(props: MockLinkRestProps): React.AnchorHTMLAttributes<HTMLAnchorElement> {
  const linkProps: MockLinkRestProps = { ...props }
  delete linkProps.prefetch
  return linkProps
}

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: MockNextImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element -- next/image is mocked with <img> in unit tests
    <img alt={alt} src={src} {...sanitizeNextImageProps(props)} />
  ),
}))

vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children, ...props }: MockLinkProps) => (
    <a href={href} {...sanitizeLinkProps(props)}>
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
