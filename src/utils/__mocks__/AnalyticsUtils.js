// @flow

export default {
  setScreen: (screenName: string) => {
    console.log(screenName);
  },

  logEvent: (name: string, params: ?Object) => {
    if (params) {
      console.log(name + params.toString);
    }
  },
};
