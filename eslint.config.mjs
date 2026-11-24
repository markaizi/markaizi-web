import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Panelde "bileşen açılınca veriyi çek" deseni (useEffect içinde load()) bilinçli kullanılıyor;
      // React Compiler önerisi olarak uyarı düzeyinde tutulur, CI'yı kırmaz. (Denetim 25 Kas 2026)
      "react-hooks/set-state-in-effect": "warn",
      // Kasıtlı kullanılmayan parametreler alt çizgiyle başlar (ör. _slug)
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
