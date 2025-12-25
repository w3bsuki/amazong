import next from "eslint-config-next";

// eslint-config-next (Next.js v16) ships as an ESLint v9 flat config array.
// We re-export it so `eslint .` works out of the box.

const baseRestrictedImportPatterns = [
  {
    group: ["@/components/ui/use-*", "@/components/ui/**/use-*"],
    message:
      "Hooks must live in /hooks (do not create or import hooks from components/ui).",
  },
  {
    group: ["@/components/ui/hooks/*", "@/components/ui/**/hooks/*"],
    message:
      "Hooks must live in /hooks (do not create or import hooks from components/ui).",
  },
];

// Phase 1 (Guardrails): prevent route-to-route dependencies by treating route-owned folders
// under each route group as private. Use warnings initially; tighten later.
const routeGroups = [
  "account",
  "admin",
  "auth",
  "business",
  "chat",
  "checkout",
  "main",
  "plans",
  "sell",
];

function getRouteOwnedPatternsForGroup(group) {
  const routeGroup = `(${group})`;
  return [
    {
      group: [
        `**/${routeGroup}/_components`,
        `**/${routeGroup}/_components/**`,
        `**/${routeGroup}/_lib`,
        `**/${routeGroup}/_lib/**`,
        `**/${routeGroup}/_actions`,
        `**/${routeGroup}/_actions/**`,
      ],
      message: `Route-owned (${group}) code is private to the ${routeGroup} route group (do not import across route groups).`,
    },
  ];
}

const routeOwnedPatterns = routeGroups.flatMap(getRouteOwnedPatternsForGroup);

const appImportLeakPatterns = [
  {
    group: [
      "@/app/**",
      "../app/**",
      "../../app/**",
      "../../../app/**",
      "../../../../app/**",
      "../../../../../app/**",
    ],
    message:
      "Shared modules must not import from /app (route code). Move shared logic to /lib, /hooks, or /components and keep route-only code under app/**/_lib or app/**/_components.",
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
          patterns: [
            ...baseRestrictedImportPatterns,
            ...routeOwnedPatterns,

            // Prevent shared code from importing route code.
            ...appImportLeakPatterns,
          ],
        },
      ],
    },
  },

  // Allow route-local imports of route-owned folders within each group.
  // (Within a group we still want to prevent importing from other groups.)
  ...routeGroups.map((group) => ({
    files: [`app/[locale]/(${group})/**/*.{js,jsx,ts,tsx}`],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            ...baseRestrictedImportPatterns,
            ...routeOwnedPatterns.filter(
              (p) => !p.group.some((g) => g.includes(`(${group})/`)),
            ),
            ...appImportLeakPatterns,
          ],
        },
      ],
    },
  })),

  // Back-compat override: keep existing (sell) behavior explicitly.
  {
    files: ["app/[locale]/(sell)/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            ...baseRestrictedImportPatterns,
            ...routeOwnedPatterns.filter(
              (p) => !p.group.some((g) => g.includes("(sell)/")),
            ),
            ...appImportLeakPatterns,
          ],
        },
      ],
    },
  },

  // lib/** must never depend on app/** (route code).
  {
    files: ["lib/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [...appImportLeakPatterns],
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
              group: ["@/hooks/**"],
              message:
                "components/ui must not depend on app hooks. Move logic to /hooks or build a composite in components/common or app-owned _components.",
            },
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
                "@/components/shared/**",
                "@/components/product/**",
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
