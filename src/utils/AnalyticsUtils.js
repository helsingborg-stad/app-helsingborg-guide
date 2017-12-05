import firebase from "react-native-firebase";

const analytics = firebase.analytics();

export default {
  setScreen: (screenName) => {
    analytics.setCurrentScreen(screenName, null);
  },

  logEvent: (name, params) => {
    analytics.logEvent(name, params);
  },
};
