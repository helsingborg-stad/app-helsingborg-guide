module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@actions": "./src/actions",
          "@assets": "../cities/Helsingborg/assets",
          "@data": "../cities/Helsingborg/data",
          "@json-schemas": "./json-schemas",
          "@services": "./src/services",
          "@shared-components": "./src/components/shared",
          "@src": "./src",
          "@utils": "./src/utils"
        }
      }
    ]
  ]
};
