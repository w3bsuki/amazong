// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";
import * as path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Normalize paths to forward slashes for Vite compatibility
function normalizePath(p: string): string {
  return p.replace(/\\/g, "/");
}

const config: StorybookConfig = {
  stories: [
    "../components/**/*.mdx",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: ["@storybook/addon-themes", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};

    // Polyfill Node.js globals for browser
    config.define = {
      ...config.define,
      "global": "globalThis",
    };

    // Mock mapping: import specifier -> absolute mock file path
    const mockResolveMap: Record<string, string> = {
      "@/components/providers/auth-state-manager": normalizePath(path.resolve(__dirname, "mocks/auth-state-manager.tsx")),
      "@/components/providers/cart-context": normalizePath(path.resolve(__dirname, "mocks/cart-context.tsx")),
      "@/components/providers/wishlist-context": normalizePath(path.resolve(__dirname, "mocks/wishlist-context.tsx")),
      "@/components/providers/drawer-context": normalizePath(path.resolve(__dirname, "mocks/drawer-context.tsx")),
      "@/components/providers/header-context": normalizePath(path.resolve(__dirname, "mocks/header-context.tsx")),
      "@/i18n/routing": normalizePath(path.resolve(__dirname, "mocks/i18n-routing.tsx")),
      "next/navigation": normalizePath(path.resolve(__dirname, "mocks/next-navigation.ts")),
    };

    // Custom resolver plugin - runs before default resolution
    const mockResolverPlugin = {
      name: "storybook:mock-resolver",
      enforce: "pre" as const,
      resolveId(source: string, importer: string | undefined) {
        // Debug logging
        if (source.includes("drawer") || source.includes("cart") || source.includes("providers")) {
          console.log(`[mock-resolver] source="${source}" importer="${importer}"`);
        }
        // Check if this import should be mocked
        const mockPath = mockResolveMap[source];
        if (mockPath) {
          console.log(`[mock-resolver] MATCHED: ${source} -> ${mockPath}`);
          // Return the mock path as the resolved ID
          return { id: mockPath, external: false };
        }
        return null;
      },
    };

    // Insert plugin at the start for highest priority
    config.plugins = [mockResolverPlugin, ...(config.plugins ?? [])];

    // Setup standard @ alias for non-mocked imports
    const existingAlias = config.resolve.alias ?? [];
    const aliasArray = Array.isArray(existingAlias)
      ? existingAlias
      : Object.entries(existingAlias).map(([find, replacement]) => ({ find, replacement }));

    config.resolve.alias = [
      ...aliasArray,
      { find: "@", replacement: normalizePath(path.resolve(__dirname, "..")) },
    ];

    return config;
  },
};

export default config;
