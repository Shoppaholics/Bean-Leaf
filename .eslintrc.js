// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier", "import"], // Add 'import' plugin
  rules: {
    "prettier/prettier": "error",
    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"], // Core and external libraries
          "internal", // Aliased imports (e.g., @/...)
          ["parent", "sibling", "index"], // Relative imports
        ],
        pathGroups: [
          {
            pattern: "@/**", // Match aliased imports like '@/components'
            group: "internal",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"], // Exclude built-ins from path grouping
        "newlines-between": "always", // Enforce blank lines between groups
        alphabetize: { order: "asc", caseInsensitive: true }, // Alphabetize within groups
      },
    ],
  },
};
