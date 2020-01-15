a;
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require("metro-config");
const path = require("path");

// For workspaces use in package.json
const watchFolders = [path.resolve(__dirname, "../..")];

// Metro gets confused if it tries to use template/package.json
const blacklistRE = new RegExp(
  `^${watchFolders[0].replace("/", "\\/")}\\/template\\/.*$`
);

module.exports = (async () => {
  const {
    resolver: { assetExts }
  } = await getDefaultConfig();

  return {
    resolver: {
      assetExts: [
        ...assetExts,
        "obj",
        "mtl",
        "JPG",
        "vrx",
        "hdr",
        "gltf",
        "glb",
        "bin",
        "arobject",
        "gif"
      ],
      blacklistRE
    },
    projectRoot: path.resolve(__dirname),
    watchFolders
  };
})();
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { assetExts }
  } = await getDefaultConfig();

  return {
    resolver: {
      assetExts: [
        ...assetExts,
        "obj",
        "mtl",
        "JPG",
        "vrx",
        "hdr",
        "gltf",
        "glb",
        "bin",
        "arobject",
        "gif"
      ]
    }
  };
})();
