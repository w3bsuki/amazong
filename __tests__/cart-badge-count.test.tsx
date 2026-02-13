/* eslint-disable @next/next/no-img-element */

import React from "react"
import { cleanup, render, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  useCart: vi.fn(),
  useDrawer: vi.fn(),
}))

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: { alt: string; src: string }) => (
    <img alt={alt} src={src} {...props} />
  ),
}))

vi.mock("@/i18n/routing", () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useRouter: () => ({ push: mocks.push }),
}))

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}))

vi.mock("@/components/providers/cart-context", () => ({
  useCart: mocks.useCart,
}))

vi.mock("@/components/providers/drawer-context", () => ({
  useDrawer: mocks.useDrawer,
}))

vi.mock("@/components/ui/hover-card", () => ({
  HoverCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  HoverCardTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  HoverCardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

import { CountBadge } from "@/components/shared/count-badge"
import { CartDropdown } from "@/components/layout/header/cart/cart-dropdown"
import { MobileCartDropdown } from "@/components/layout/header/cart/mobile-cart-dropdown"

describe("cart badge count rendering", () => {
  beforeEach(() => {
    mocks.push.mockReset()
    mocks.useDrawer.mockReturnValue({
      openCart: vi.fn(),
      enabledDrawers: { cart: true },
    })
    mocks.useCart.mockReturnValue({
      isReady: true,
      items: [],
      totalItems: 120,
      subtotal: 0,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
    })
  })

  afterEach(() => {
    cleanup()
  })

  test("keeps CountBadge global default cap at 99", () => {
    const { container } = render(<CountBadge count={120} />)
    expect(container.querySelector('[data-slot=\"count-badge\"]')).toHaveTextContent("99")
  })

  test("renders uncapped count in MobileCartDropdown", async () => {
    const { container } = render(<MobileCartDropdown />)

    await waitFor(() => {
      expect(container.querySelector('[data-slot=\"count-badge\"]')).toHaveTextContent("120")
    })
  })

  test("renders uncapped count in CartDropdown", async () => {
    const { container } = render(<CartDropdown />)

    await waitFor(() => {
      expect(container.querySelector('[data-slot=\"count-badge\"]')).toHaveTextContent("120")
    })
  })

  test("hides badge count until cart readiness is complete", () => {
    mocks.useCart.mockReturnValue({
      isReady: false,
      items: [],
      totalItems: 120,
      subtotal: 0,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
    })

    const mobile = render(<MobileCartDropdown />)
    expect(mobile.container.querySelector('[data-slot=\"count-badge\"]')).toBeNull()
    mobile.unmount()

    const desktop = render(<CartDropdown />)
    expect(desktop.container.querySelector('[data-slot=\"count-badge\"]')).toBeNull()
  })
})
