import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import ts from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  ...ts(),
  skipFormatting,
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        uni: "readonly",
        wx: "readonly",
        getApp: "readonly",
        getCurrentPages: "readonly",
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "unpackage/**", "skills/**"],
  },
];
