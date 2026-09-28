import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  // "dist"/"coverage" are build/test output; ".ai", ".claude" and "scripts"
  // are the AI workflow tooling (gitignored per conventions.md), not app code.
  { ignores: ["dist", "coverage", ".ai", ".claude", "scripts"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactRefresh.configs.vite,
    ],
    // eslint-plugin-react-hooks@7's `recommended-latest`/`recommended` presets
    // declare `plugins` as an array of strings, a shorthand ESLint 10 added —
    // ESLint 9 (pinned by .ai/project/conventions.md) rejects that shape, so
    // the plugin/rules are wired manually in the object form ESLint 9 expects.
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs["recommended-latest"].rules,
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  eslintConfigPrettier,
);
