const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  ...expoConfig,
  {
    ignores: ["node_modules/**", ".expo/**", "dist/**", "coverage/**", "uniwind-env.d.ts"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
