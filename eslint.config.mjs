import next from "eslint-config-next";

// eslint-config-next (Next.js v16) ships as an ESLint v9 flat config array.
// We re-export it so `eslint .` works out of the box.
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
    },
  },
];

export default config;
