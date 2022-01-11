const path = require("path");


module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    ["module:react-native-dotenv"],
    [
      "module-resolver",
      {
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@actions": "../../guide-app/src/actions",
          "@assets": path.resolve(__dirname, "./assets"),
          "@config": path.resolve(__dirname, "./config"),
          "@data": path.resolve(__dirname, "./data"),
          "@json-schemas": "../../guide-app/json-schemas",
          "@services": "../../guide-app/src/services",
          "@shared-components": "../../guide-app/src/components/shared",
          "@src": "../../guide-app/src",
          "@hooks": "../../guide-app/src/hooks",
          "@utils": "../../guide-app/src/utils",
        },
      },
    ],
  ],
};
