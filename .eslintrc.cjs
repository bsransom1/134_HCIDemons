module.exports = {
  root: true,
  ignorePatterns: ["dist", "node_modules"],
  env: { browser: true, es2022: true },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react/jsx-runtime"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
  settings: { react: { version: "detect" } },
  plugins: ["react", "react-hooks", "react-refresh"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
};
