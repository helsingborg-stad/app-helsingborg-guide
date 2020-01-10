/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require("metro-config");
const path = require("path");

const extraNodeModules = {
  "guide-app": path.resolve(__dirname + "../../../template/")
};
const watchFolders = [path.resolve(__dirname + "../../../template/")];

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
      extraNodeModules
    },
    projectRoot: path.resolve(__dirname),
    watchFolders
  };
})();
