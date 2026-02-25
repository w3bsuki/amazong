export {}

declare global {
  interface Window {
    /**
     * Storybook-only escape hatches for injecting mocked provider state.
     * These are intentionally `unknown` because the shape is controlled by Storybook stories.
     */
    __STORYBOOK_AUTH_CONTEXT__?: unknown
    __STORYBOOK_CART_CONTEXT__?: unknown
    __STORYBOOK_WISHLIST_CONTEXT__?: unknown

    /**
     * Not included in TS DOM lib on some versions/configs.
     * We only use a minimal subset for deferring hydration-sensitive work.
     */
    requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number
    cancelIdleCallback?: (id: number) => void
  }
}
