module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    "jest/globals": true
  },
  extends: ["airbnb", "plugin:flowtype/recommended", "plugin:react-native/all"],
  globals: {
    __DEV__: [true, true]
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: "module"
  },
  plugins: ["jest", "react", "flowtype", "react-native"],
  rules: {
    quotes: [1, "double"],
    "function-paren-newline": ["off"],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "no-underscore-dangle": ["off"],
    "react/forbid-prop-types": [0],
    "react/prop-types": [1],
    "no-unused-vars": [
      "error",
      {
        vars: "local",
        args: "after-used",
        ignoreRestSiblings: true,
        varsIgnorePattern: "^unused",
        argsIgnorePattern: "^unused"
      }
    ],
    "max-len": [
      "error",
      140,
      {
        ignoreComments: true,
        ignoreUrls: true
      }
    ],
    "object-curly-newline": ["error", { consistent: true }],
    "react/jsx-closing-tag-location": ["off"],
    radix: ["error", "as-needed"],
    "react/sort-comp": [
      "error",
      {
        order: ["static-methods", "lifecycle", "everything-else", "render"],
        groups: {
          lifecycle: [
            "displayName",
            "propTypes",
            "contextTypes",
            "childContextTypes",
            "mixins",
            "statics",
            "defaultProps",
            "constructor",
            "getDefaultProps",
            "getInitialState",
            "state",
            "getChildContext",
            "componentWillMount",
            "componentDidMount",
            "componentWillReceiveProps",
            "shouldComponentUpdate",
            "componentWillUpdate",
            "componentDidUpdate",
            "componentWillUnmount"
          ]
        }
      }
    ]
  },
  settings: {
    "import/resolver": {
      "babel-module": {},
      "reactnative": {}
    }
  }
};
