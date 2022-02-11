/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require("metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");
const {
  getMetroTools,
  getMetroAndroidAssetsResolutionFix,
} = require("react-native-monorepo-tools");

const path = require("path");
const monorepoMetroTools = getMetroTools({ cwd: `${[path.resolve(__dirname, "../..")][0]}` });

const androidAssetsResolutionFix = getMetroAndroidAssetsResolutionFix();

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    resolver: {
      assetExts: assetExts.filter(ext => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],
      blockList: [exclusionList(monorepoMetroTools.blockList), new RegExp(
        `^${[path.resolve(__dirname, "../..")][0].replace("/", "\\/")}\\/template\\/.*$`,
      )],
      extraNodeModules: monorepoMetroTools.extraNodeModules,
    },
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
      publicPath: androidAssetsResolutionFix.publicPath,
      getTransformOptions: async () => ({
        transform: {
          inlineRequires: true,
        },
      }),
    },
    server: {
      enhanceMiddleware: (middleware) => {
        return androidAssetsResolutionFix.applyMiddleware(middleware);
      },
    },
    projectRoot: path.resolve(__dirname),
    watchFolders: monorepoMetroTools.watchFolders,
  };
})();




