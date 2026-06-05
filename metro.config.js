const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

// expo-sqlite's web worker imports wa-sqlite.wasm. Metro does not always
// include wasm in the default web asset extensions, so add it explicitly.
config.resolver.assetExts = Array.from(new Set([...config.resolver.assetExts, "wasm"]));
config.resolver.sourceExts.push("sql");
const upstreamEnhanceMiddleware = config.server?.enhanceMiddleware;

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    const enhancedMiddleware = upstreamEnhanceMiddleware?.(middleware, server) ?? middleware;

    return (req, res, next) => {
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      return enhancedMiddleware(req, res, next);
    };
  },
};

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-env.d.ts",
});
