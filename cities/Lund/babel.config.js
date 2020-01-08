const path = require("path");

module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@actions": "../../template/src/actions",
          "@assets": "./assets",
          "@data": "./data",
          "@json-schemas": "./json-schemas",
          "@services": "../../template/src/services",
          "@shared-components": "../../template/src/components/shared",
          "@src": "../../template/src",
          "@utils": "../../template/src/utils"
        }
      }
    ]
  ]
};
