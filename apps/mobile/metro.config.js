// Monorepo-aware Metro config so `@thali/shared` and `@thali/ui-tokens`
// (workspace packages) are resolved from the workspace root.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;
// allow importing .json (dish reference table)
if (!config.resolver.sourceExts.includes('json')) {
  config.resolver.sourceExts.push('json');
}

module.exports = config;
