"use client"

import * as React from "react"

export type Locale = "en" | "bg"
export const locales = ["en", "bg"] as const

export function isValidLocale(locale: string): locale is Locale {
  return locale === "en" || locale === "bg"
}

export function validateLocale(locale: string): Locale {
  return isValidLocale(locale) ? locale : "en"
}

export const routing = {
  locales,
  defaultLocale: "en" as const,
  localePrefix: "always" as const,
  localeDetection: true,
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax" as const,
    path: "/",
  },
}

type LinkProps = Omit<React.ComponentPropsWithoutRef<"a">, "href"> & {
  href:
    | string
    | {
        pathname?: string
      }
  locale?: string
}

function hrefToString(href: LinkProps["href"]) {
  if (typeof href === "string") return href
  if (href && typeof href === "object" && typeof href.pathname === "string") return href.pathname
  return "#"
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, onClick, ...props },
  ref
) {
  return (
    <a
      ref={ref}
      href={hrefToString(href)}
      onClick={(e) => {
        e.preventDefault()
        onClick?.(e)
      }}
      {...props}
    />
  )
})

export function redirect() {
  throw new Error("redirect() is not available in Storybook.")
}

export function usePathname() {
  return "/"
}

type RouterHref = string | { pathname?: string }

export function useRouter() {
  const to = (href: RouterHref) => hrefToString(href)

  return {
    push: (_href: RouterHref) => {
      void to(_href)
    },
    replace: (_href: RouterHref) => {
      void to(_href)
    },
    back: () => {},
    forward: () => {},
    prefetch: async (_href: RouterHref) => {
      void to(_href)
    },
    refresh: () => {},
  }
}
