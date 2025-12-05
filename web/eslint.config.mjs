import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default defineConfig([
    {
        ignores: ["**/node_modules/**", "**/.next/**", "out/**", "**/out/**"],
    },
    ...compat.extends("eslint-config-next", "eslint-config-next/core-web-vitals", "eslint-config-next/typescript"),
    {
        files: ["tailwind.config.js", "postcss.config.js", "next.config.mjs"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-var-requires": "off",
        },
    },
    {
        files: ["next-env.d.ts"],
        rules: {
            "@typescript-eslint/triple-slash-reference": "off",
        },
    },
]);