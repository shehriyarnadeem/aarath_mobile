module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "@react-native-community", // Essential for React Native
  ],
  plugins: ["react", "react-hooks", "react-native"],
  rules: {
    // Force Functional Components (often done via component-related rules)
    "react/function-component-definition": [
      "error",
      { namedComponents: "arrow-function" },
    ],

    // Enforce Hook Rules (Top-level calls, dependency arrays)
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // Enforce small, non-nested JSX
    "react/jsx-max-depth": ["warn", { max: 4 }], // Adjust 'max' as needed

    // Prevent defining components inside components (A separation concern)
    "react/no-unstable-nested-components": "error",

    // Style enforcement (e.g., enforce StyleSheet use)
    // There is no standard rule for this, but linting will flag bad JS in styles.
  },
};
