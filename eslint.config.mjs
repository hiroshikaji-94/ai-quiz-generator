import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "build/**",
      ".env*",
      "coverage/**",
      "**/*.log",
      "scripts/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Disable common linting issues that don't affect functionality
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-require-imports": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "warn",
      "@next/next/no-assign-module-variable": "off",
      "prefer-const": "warn",
      "no-console": "off",
    },
  },
];

export default eslintConfig;
