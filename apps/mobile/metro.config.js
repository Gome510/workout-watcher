const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// metro.config.js
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = {
  // Your existing Metro configuration options
  watchFolders: [path.resolve(__dirname, '../..')],
};
const mergedDefaultConfig = mergeConfig(getDefaultConfig(__dirname), config);

module.exports = wrapWithReanimatedMetroConfig(mergedDefaultConfig);
