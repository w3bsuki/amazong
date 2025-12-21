import next from "eslint-config-next";

// eslint-config-next (Next.js v16) ships as an ESLint v9 flat config array.
// We re-export it so `eslint .` works out of the box.

const baseRestrictedImportPatterns = [
  {
    group: ["@/components/ui/use-*", "@/components/ui/**/use-*"],
    message:
      "Hooks must live in /hooks (do not create or import hooks from components/ui).",
  },
];

const sellRouteOwnedPatterns = [
  {
    group: ["**/(sell)/_components", "**/(sell)/_components/**"],
    message:
      "Route-owned (sell) UI under app/[locale]/(sell)/_components is private to the (sell) route group.",
  },
];

const config = [
  ...next,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // These rules are extremely strict and currently produce many false
      // positives in this codebase (e.g. legitimate state updates in effects).
      // Keep Next.js core linting, but relax these until the code is refactored.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/incompatible-library": "off",

      // Stylistic; fails builds for normal contractions/quotes in JSX text.
      "react/no-unescaped-entities": "off",

      // Prefer fixing occurrences over time, but don't block commits.
      "react/no-children-prop": "off",

      // This is purely config-style; keep config simple.
      "import/no-anonymous-default-export": "off",

      // Phase 1 guardrails (STRUCTURE.md): keep boundaries enforceable while refactoring.
      // Use warnings initially to avoid breaking the current repo; tighten to errors in later phases.
      "no-restricted-imports": [
        "warn",
        {
          patterns: [...baseRestrictedImportPatterns, ...sellRouteOwnedPatterns],
        },
      ],
    },
  },

  // Allow route-local imports of route-owned (sell) _components within the (sell) group.
  {
    files: ["app/[locale]/(sell)/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [...baseRestrictedImportPatterns],
        },
      ],
    },
  },

  // components/ui is intended to be shadcn-style primitives only.
  // Discourage pulling in other component layers or route code.
  {
    files: ["components/ui/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            ...baseRestrictedImportPatterns,
            {
              group: ["@/app/**"],
              message:
                "components/ui must not depend on route code (move UI to components/common or app-owned _components).",
            },
            {
              group: [
                "@/components/common/**",
                "@/components/layout/**",
                "@/components/providers/**",
                "@/components/ai-elements/**",
              ],
              message:
                "components/ui should be primitives-only; composites belong in components/common or route-owned _components.",
            },
          ],
        },
      ],
    },
  },

  // Existing compatibility re-export shims (temporary): don't warn on these.
  {
    files: [
      "components/ui/modal.{js,jsx,ts,tsx}",
      "components/ui/page-container.{js,jsx,ts,tsx}",
      "components/ui/pricing-card.{js,jsx,ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [...baseRestrictedImportPatterns],
        },
      ],
    },
  },
];

export default config;
