// Polyfill Buffer for browser environment (needed by Supabase client)
import { Buffer } from "buffer";
if (typeof window !== "undefined") {
  (window as any).Buffer = Buffer;
}

import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import React, { createContext, useContext, useMemo } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster as SonnerToaster } from "../components/providers/sonner";

// Import global styles directly
import "../app/globals.css";
import messagesEn from "../messages/en.json";
import messagesBg from "../messages/bg.json";

// =============================================================================
// MOCK PROVIDERS FOR STORYBOOK
// These provide the context interface without making real API calls.
// =============================================================================

// -- Auth Mock --
const MockAuthContext = createContext({
  user: null,
  isLoading: false,
  signOut: async () => {},
  refreshUser: async () => {},
});
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <MockAuthContext.Provider value={{ user: null, isLoading: false, signOut: async () => {}, refreshUser: async () => {} }}>
    {children}
  </MockAuthContext.Provider>
);
// Patch the real useAuth to use our mock when in Storybook
if (typeof window !== "undefined") {
  (window as any).__STORYBOOK_AUTH_CONTEXT__ = MockAuthContext;
}

// -- Cart Mock --
const MockCartContext = createContext({
  items: [],
  isReady: true,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
});
const MockCartProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => ({
    items: [],
    isReady: true,
    addToCart: () => console.log("[Storybook] addToCart called"),
    removeFromCart: () => console.log("[Storybook] removeFromCart called"),
    updateQuantity: () => console.log("[Storybook] updateQuantity called"),
    clearCart: () => console.log("[Storybook] clearCart called"),
    totalItems: 0,
    subtotal: 0,
  }), []);
  return <MockCartContext.Provider value={value}>{children}</MockCartContext.Provider>;
};
if (typeof window !== "undefined") {
  (window as any).__STORYBOOK_CART_CONTEXT__ = MockCartContext;
}

// -- Wishlist Mock --
const MockWishlistContext = createContext({
  items: [],
  isLoading: false,
  isInWishlist: () => false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  toggleWishlist: async () => {},
  refreshWishlist: async () => {},
  totalItems: 0,
});
const MockWishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => ({
    items: [],
    isLoading: false,
    isInWishlist: () => false,
    addToWishlist: async () => console.log("[Storybook] addToWishlist called"),
    removeFromWishlist: async () => console.log("[Storybook] removeFromWishlist called"),
    toggleWishlist: async () => console.log("[Storybook] toggleWishlist called"),
    refreshWishlist: async () => {},
    totalItems: 0,
  }), []);
  return <MockWishlistContext.Provider value={value}>{children}</MockWishlistContext.Provider>;
};
if (typeof window !== "undefined") {
  (window as any).__STORYBOOK_WISHLIST_CONTEXT__ = MockWishlistContext;
}

// -- Drawer Mock --
const MockDrawerContext = createContext({
  state: {
    productQuickView: { open: false, product: null },
    cart: { open: false },
    messages: { open: false },
    account: { open: false },
  },
  enabledDrawers: { productQuickView: true, cart: true, messages: true, account: true },
  isDrawerSystemEnabled: true,
  openProductQuickView: () => {},
  closeProductQuickView: () => {},
  openCart: () => {},
  closeCart: () => {},
  openMessages: () => {},
  closeMessages: () => {},
  openAccount: () => {},
  closeAccount: () => {},
});
const MockDrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => ({
    state: {
      productQuickView: { open: false, product: null },
      cart: { open: false },
      messages: { open: false },
      account: { open: false },
    },
    enabledDrawers: { productQuickView: true, cart: true, messages: true, account: true },
    isDrawerSystemEnabled: true,
    openProductQuickView: () => console.log("[Storybook] openProductQuickView called"),
    closeProductQuickView: () => {},
    openCart: () => console.log("[Storybook] openCart called"),
    closeCart: () => {},
    openMessages: () => console.log("[Storybook] openMessages called"),
    closeMessages: () => {},
    openAccount: () => console.log("[Storybook] openAccount called"),
    closeAccount: () => {},
  }), []);
  return <MockDrawerContext.Provider value={value}>{children}</MockDrawerContext.Provider>;
};
if (typeof window !== "undefined") {
  (window as any).__STORYBOOK_DRAWER_CONTEXT__ = MockDrawerContext;
}

// Combined provider wrapper
const StorybookProviders = ({ children }: { children: React.ReactNode }) => (
  <MockAuthProvider>
    <MockCartProvider>
      <MockWishlistProvider>
        <MockDrawerProvider>
          {children}
        </MockDrawerProvider>
      </MockWishlistProvider>
    </MockCartProvider>
  </MockAuthProvider>
);

const preview: Preview = {
  globalTypes: {
    locale: {
      name: "Locale",
      description: "Story locale (next-intl)",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "bg", title: "Bulgarian" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    options: {
      // Organize the sidebar in a logical hierarchy
      storySort: {
        method: "alphabetical",
        order: [
          "Introduction",
          "Design System", ["Overview", "Tokens", "*"],
          "Primitives",     // shadcn/ui base components (Button, Input, etc.)
          "Commerce",       // Product cards, seller components, trust badges
          "Layout",         // Headers, sidebars, navigation
          "Forms",          // Form-related composites
          "Feedback",       // Toasts, alerts, dialogs
          "Data Display",   // Tables, charts, lists
          "*",              // Everything else
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disabled: true,
    },
    layout: "centered",
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    // Wrap stories with all required providers
    (Story, context) => {
      const theme = context.globals.theme === "dark" ? "dark" : "light";
      const locale = context.globals.locale === "bg" ? "bg" : "en";
      const messages = locale === "bg" ? messagesBg : messagesEn;

      return (
        <StorybookProviders>
          <NextThemesProvider
            attribute="class"
            enableSystem={false}
            forcedTheme={theme}
            disableTransitionOnChange
          >
            <NextIntlClientProvider
              locale={locale}
              // Use real app messages so components render without missing keys.
              messages={messages}
              // Storybook shouldn't break on missing i18n keys; show the key instead.
              onError={() => {}}
              getMessageFallback={({ namespace, key }) =>
                namespace ? `${namespace}.${key}` : key
              }
            >
              <div className="font-sans antialiased">
                <Story />
              </div>
              <SonnerToaster />
            </NextIntlClientProvider>
          </NextThemesProvider>
        </StorybookProviders>
      );
    },
  ],
};

export default preview;
