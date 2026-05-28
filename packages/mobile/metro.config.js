const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add shared package to watch folders
config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, '../shared'),
];

// Resolve @sisio/shared to the shared package
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@sisio/shared': path.resolve(__dirname, '../shared'),
};

// Always resolve node_modules from project root first
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
];
config.resolver.resolveSymlinks = false;

module.exports = config;
