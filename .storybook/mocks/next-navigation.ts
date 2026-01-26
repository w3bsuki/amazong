export function usePathname() {
  return "/"
}

export function useParams() {
  return {}
}

export function useSearchParams() {
  return new URLSearchParams()
}

export function useRouter() {
  return {
    push: (_href: string) => {
      void _href
    },
    replace: (_href: string) => {
      void _href
    },
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: async (_href: string) => {
      void _href
    },
  }
}

export function redirect() {
  throw new Error("redirect() is not available in Storybook.")
}

export function permanentRedirect() {
  throw new Error("permanentRedirect() is not available in Storybook.")
}

export function notFound() {
  throw new Error("notFound() is not available in Storybook.")
}
