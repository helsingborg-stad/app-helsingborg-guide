const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "@actions": "../../guide-app/src/actions",
      "@assets": path.resolve(__dirname, "./assets"),
      "@config": path.resolve(__dirname, "./config"),
      "@data": path.resolve(__dirname, "./data"),
      "@json-schemas": "../../guide-app/json-schemas",
      "@services": "../../guide-app/src/services",
      "@shared-components": "../../guide-app/src/components/shared",
      "@src": "../../guide-app/src",
      "@utils": "../../guide-app/src/utils",
    },
  },
};