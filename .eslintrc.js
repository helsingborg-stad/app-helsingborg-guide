module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-unused-vars': [
      'error',
      {
        vars: 'local',
        args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^unused',
        argsIgnorePattern: '^unused',
      },
    ],
    'max-len': [
      'error',
      140,
      {
        ignoreComments: true,
        ignoreUrls: true,
      },
    ],
    'no-console': ['off'],
  },
};
