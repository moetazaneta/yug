const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

// expo-sqlite's web worker imports wa-sqlite.wasm. Metro does not always
// include wasm in the default web asset extensions, so add it explicitly.
config.resolver.assetExts = Array.from(
  new Set([...config.resolver.assetExts, "wasm"]),
);
config.resolver.sourceExts.push("sql"); // <--- add this

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-env.d.ts",
});
