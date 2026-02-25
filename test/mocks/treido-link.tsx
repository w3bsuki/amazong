import React from "react"
import { vi } from "vitest"

type MockLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  children: React.ReactNode
  prefetch?: boolean
}

type MockLinkRestProps = Omit<MockLinkProps, "href" | "children">

function sanitizeLinkProps(
  props: MockLinkRestProps
): React.AnchorHTMLAttributes<HTMLAnchorElement> {
  const linkProps: MockLinkRestProps = { ...props }
  delete linkProps.prefetch
  return linkProps
}

vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children, ...props }: MockLinkProps) => (
    <a href={href} {...sanitizeLinkProps(props)}>
      {children}
    </a>
  ),
}))

