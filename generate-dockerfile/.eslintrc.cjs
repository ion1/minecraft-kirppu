module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  plugins: ["jest", "@typescript-eslint"],
  ignorePatterns: ["*.cjs", "dist"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    project: "./tsconfig.json",
  },
  env: {
    es2017: true,
    node: true,
  },
};
