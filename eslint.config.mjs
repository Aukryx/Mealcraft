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
    rules: {
      // Règles moins strictes pour le développement
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off", // Désactivé pour les APIs externes
      "react/no-unescaped-entities": "off", // Apostrophes dans le texte français
      "@next/next/no-img-element": "warn", // Permettre <img> temporairement
      "react-hooks/exhaustive-deps": "warn",
    }
  }
];

export default eslintConfig;
