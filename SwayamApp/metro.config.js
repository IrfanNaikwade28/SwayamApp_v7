const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Fix for Expo Router "missing-asset-registry-path" on Windows
const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push("png");
defaultConfig.resolver.sourceExts.push("js", "jsx", "ts", "tsx");

module.exports = withNativeWind(defaultConfig, { input: "./app/global.css" });
