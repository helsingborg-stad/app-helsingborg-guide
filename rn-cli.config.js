const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { assetExts },
  } = await getDefaultConfig();

  return {
    resolver: {
      assetExts: [...assetExts, "obj", "mtl", "JPG", "vrx", "fbx", "hdr"],
    },
  };
})();
