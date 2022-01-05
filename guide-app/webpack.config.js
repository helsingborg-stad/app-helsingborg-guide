const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "@actions": "./src/actions",
      "@assets": "../cities/Helsingborg/assets",
      "@data": "../cities/Helsingborg/data",
      "@json-schemas": "./json-schemas",
      "@services": "./src/services",
      "@shared-components": "./src/components/shared",
      "@src": "./src",
      "@utils": "./src/utils",
    },
  },
};