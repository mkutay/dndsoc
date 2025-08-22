import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...compat.config({
    extends: [
      "plugin:@next/next/recommended",
      "plugin:prettier/recommended",
      "next/typescript",
      "next/core-web-vitals",
      "prettier",
    ],
    // Keep generic parserOptions only; scoped typed config is added below
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          trailingComma: "all",
          semi: true,
          tabWidth: 2,
          singleQuote: false,
          printWidth: 120,
          endOfLine: "auto",
          arrowParens: "always",
        },
        {
          usePrettierrc: false,
        },
      ],
      // React/JSX Rules
      "react/react-in-jsx-scope": "off",
      "react/jsx-key": "error",
      "react/hook-use-state": "error",
      "react/jsx-pascal-case": "error",
      "react/jsx-no-leaked-render": "error",
      "react/no-danger": "warn",
      // Code Quality Rules
      "prefer-const": "error",
      "no-var": "error",
      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],
      eqeqeq: "error",
      // Import Rules
      "import/order": "error",
      "import/no-duplicates": "error",
      "import/no-unused-modules": "error",
    },
  }),
  // TypeScript: use @typescript-eslint/parser with type information and enable TS-typed rules
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },
  {
    ignores: ["**/database.types.ts", "**/action-result.ts"],
  },
];

export default eslintConfig;
