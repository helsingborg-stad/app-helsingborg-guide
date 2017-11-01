module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    "jest/globals": true,
  },
  extends: ["airbnb"],
  globals: {
    __DEV__: [true, true],
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: "module",
  },
  plugins: ["jest", "react"],
  rules: {
    quotes: [1, "double"],
    "function-paren-newline": ["off"],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "no-underscore-dangle": ["off"],
    "react/forbid-prop-types": ["warn"],
    "react/prop-types": [1],
    "no-unused-vars": [
      "error",
      {
        vars: "local",
        args: "after-used",
        ignoreRestSiblings: true,
        varsIgnorePattern: "^unused",
        argsIgnorePattern: "^unused",
      },
    ],
    "max-len": [
      "error",
      140,
      {
        ignoreComments: true,
        ignoreUrls: true,
      },
    ],
    "object-curly-newline": ["error", { consistent: true }],
    "react/jsx-closing-tag-location": ["off"],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".android.js", ".ios.js"],
      },
    },
  },
};
