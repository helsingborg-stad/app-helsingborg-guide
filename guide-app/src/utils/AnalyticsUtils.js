export default {
  setScreen: screenName => {
    if (!__DEV__ && screenName) {
      // @TODO implement screen tracking
    }
  },

  logEvent: (unusedName, unusedParams) => {
    if (!__DEV__) {
      // @TODO implement event tracking
    }
  },
};
