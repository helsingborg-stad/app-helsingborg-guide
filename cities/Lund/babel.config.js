module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@actions": "../../guide-app/src/actions",
          "@assets": "../../guide-app/assets/Lund/assets",
          "@data": "./data",
          "@json-schemas": "./json-schemas",
          "@services": "../../guide-app/src/services",
          "@shared-components": "../../guide-app/src/components/shared",
          "@src": "../../guide-app/src",
          "@utils": "../../guide-app/src/utils"
        }
      }
    ]
  ]
};
