const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      ".agents/plugins/**",
      "dist/**",
      "coverage/**",
      "uniwind-env.d.ts",
    ],
  },
  ...expoConfig,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
