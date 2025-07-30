import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      "next",
      "plugin:prettier/recommended",
      "next/typescript",
      "next/core-web-vitals",
      "prettier",
    ],
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: "./tsconfig.json",
      tsconfigRootDir: import.meta.dirname,
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
      // TypeScript Rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
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
  {
    ignores: ["**/database.types.ts", "**/action-result.ts", "**/env.mjs"],
  },
];

export default eslintConfig;
