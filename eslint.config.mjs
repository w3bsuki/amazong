import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

// eslint-config-next (Next.js v16) ships as an ESLint v9 flat config array.
// We re-export it so `eslint .` works out of the box.

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

const baseRestrictedImportPatterns = [
  {
    group: [
      "@/lib/icons/phosphor",
      "@/lib/icons/tabler",
      "@/lib/icons/lucide-picker",
      "@/lib/icons/compat",
      "@phosphor-icons/react",
    ],
    message:
      "Legacy icon compatibility imports are removed. Use explicit icons from `lucide-react` instead.",
  },
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

const config = [...nextVitals, ...nextTs, {
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
}, // =========================================================================
// TypeScript Safety Rules (Phase 0): warnings-first rollout
// =========================================================================
{
  files: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
  ],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: ["./tsconfig.json"],
      tsconfigRootDir,
    },
  },
  rules: {
    // Gradual rollout: warnings first, tighten later.
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
  },
}, // Allow route-local imports of route-owned folders within each group.
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
})), // Back-compat override: keep existing (sell) behavior explicitly.
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
}, // lib/** must never depend on app/** (route code).
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
}, // components/ui is intended to be shadcn-style primitives only.
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
              "components/ui must not depend on app hooks. Move logic to /hooks or build a composite in components/shared or route-owned _components.",
          },
          {
            group: ["@/app/**"],
            message:
              "components/ui must not depend on route code (move UI to components/shared or route-owned _components).",
          },
          {
            group: [
              "@/components/layout/**",
              "@/components/providers/**",
              "@/components/ai-elements/**",
              "@/components/shared/**",
              "@/components/product/**",
            ],
            message:
              "components/ui should be primitives-only; composites belong in components/shared or route-owned _components.",
          },
        ],
      },
    ],
  },
}, // =========================================================================
// Phase 4: Code Quality Plugins (sonarjs + unicorn)
// =========================================================================

// SonarJS v3.x - Bug detection and code smells
// Using selected rules as warnings to avoid breaking builds initially
{
  files: ["**/*.{js,jsx,ts,tsx}"],
  plugins: {
    sonarjs,
  },
  rules: {
    // Bug Detection (important - upgrade to errors after stabilizing)
    "sonarjs/no-all-duplicated-branches": "warn",
    "sonarjs/no-element-overwrite": "warn",
    "sonarjs/no-empty-collection": "warn",
    "sonarjs/no-extra-arguments": "warn",
    "sonarjs/no-identical-conditions": "warn",
    "sonarjs/no-identical-expressions": "warn",
    "sonarjs/no-use-of-empty-return-value": "warn",
    "sonarjs/no-gratuitous-expressions": "warn",

    // Code Smell Detection (helpful but less critical)
    "sonarjs/cognitive-complexity": ["warn", 25], // Default is 15, relaxed for existing code
    "sonarjs/no-collapsible-if": "warn",
    "sonarjs/no-duplicate-string": ["warn", { threshold: 5 }], // Relax: allow up to 5 duplicates
    "sonarjs/no-duplicated-branches": "warn",
    "sonarjs/no-identical-functions": ["warn", 5], // Min 5 lines to trigger
    "sonarjs/no-nested-switch": "warn",
    "sonarjs/no-nested-template-literals": "warn",
    "sonarjs/no-redundant-boolean": "warn",
    "sonarjs/no-redundant-jump": "warn",
    "sonarjs/no-small-switch": "warn",
    "sonarjs/no-unused-collection": "warn",
    "sonarjs/prefer-immediate-return": "warn",
    "sonarjs/prefer-single-boolean-return": "warn",
    "sonarjs/prefer-while": "warn",

    // Additional v3.x rules that are useful
    "sonarjs/no-nested-conditional": "off", // Can be too strict
    "sonarjs/no-useless-catch": "warn",
    "sonarjs/prefer-object-literal": "warn",
  },
}, // Unicorn - Modern JavaScript practices
// Cherry-picked rules that are most beneficial without being too disruptive
{
  files: ["**/*.{js,jsx,ts,tsx}"],
  plugins: {
    unicorn,
  },
  rules: {
    // ===== Error Prevention =====
    "unicorn/error-message": "warn", // Require error messages
    "unicorn/no-thenable": "warn", // Prevent accidental thenable objects
    "unicorn/no-invalid-remove-event-listener": "warn",
    "unicorn/no-invalid-fetch-options": "warn",

    // ===== Modern JavaScript =====
    "unicorn/prefer-node-protocol": "warn", // node:fs instead of fs
    "unicorn/prefer-number-properties": "warn", // Number.isNaN instead of isNaN
    "unicorn/prefer-string-replace-all": "warn", // replaceAll() instead of regex
    "unicorn/prefer-string-slice": "warn", // slice() instead of substr/substring
    "unicorn/prefer-array-flat-map": "warn", // flatMap() instead of map().flat()
    "unicorn/prefer-array-flat": "warn", // flat() instead of custom flatten
    "unicorn/prefer-includes": "warn", // includes() instead of indexOf !== -1
    "unicorn/prefer-optional-catch-binding": "warn", // catch {} instead of catch (e) {}
    "unicorn/prefer-spread": "warn", // [...arr] instead of Array.from()
    "unicorn/prefer-ternary": "off", // Too opinionated for our codebase

    // ===== Code Quality =====
    "unicorn/no-useless-undefined": "warn",
    "unicorn/no-useless-spread": "warn",
    "unicorn/no-useless-promise-resolve-reject": "warn",
    "unicorn/no-lonely-if": "warn", // Merge nested if statements
    "unicorn/no-negated-condition": "off", // Sometimes negated conditions are clearer
    "unicorn/throw-new-error": "warn", // Always use new Error()

    // ===== Performance =====
    "unicorn/consistent-function-scoping": "warn", // Move functions to appropriate scope
    "unicorn/no-array-for-each": "off", // forEach is fine in many cases
    "unicorn/no-array-reduce": "off", // reduce is useful when appropriate

    // ===== Naming & Style (use warnings, very opinionated) =====
    "unicorn/filename-case": "off", // We use kebab-case but have exceptions
    "unicorn/prevent-abbreviations": "off", // Too strict for our codebase (props, params, etc.)
    "unicorn/no-null": "off", // null is valid and used throughout
    "unicorn/no-nested-ternary": "off", // Sometimes nested ternaries are cleaner

    // ===== Explicitly disabled (too disruptive or not applicable) =====
    "unicorn/no-array-callback-reference": "off", // Valid pattern: arr.filter(Boolean)
    "unicorn/prefer-module": "off", // We use ESM already but have some CJS compat
    "unicorn/prefer-top-level-await": "off", // Not always applicable
    "unicorn/prefer-export-from": "off", // Our barrel files are fine as-is
    "unicorn/no-process-exit": "off", // Valid in scripts
    "unicorn/no-anonymous-default-export": "off", // Already handled by import/no-anonymous-default-export
  },
}, // Ignore test files for some stricter rules
{
  files: [
    "**/*.test.{js,jsx,ts,tsx}",
    "**/*.spec.{js,jsx,ts,tsx}",
    "**/test/**/*.{js,jsx,ts,tsx}",
    "**/e2e/**/*.{js,jsx,ts,tsx}",
    "**/__tests__/**/*.{js,jsx,ts,tsx}",
  ],
  rules: {
    "react-hooks/rules-of-hooks": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "sonarjs/no-duplicate-string": "off", // Tests often repeat strings
    "sonarjs/no-identical-functions": "off", // Test setup functions can be similar
    "sonarjs/cognitive-complexity": "off", // Complex test scenarios are OK
    "unicorn/consistent-function-scoping": "off", // Test helpers inside describe blocks
  },
}, // Ignore config files for some rules
{
  files: [
    "*.config.{js,mjs,ts}",
    "*.config.*.{js,mjs,ts}",
    "scripts/**/*.{js,mjs,ts}",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "sonarjs/no-duplicate-string": "off", // Config files often repeat paths
    "unicorn/prefer-module": "off", // Some configs need CJS
  },
}];

export default config;
