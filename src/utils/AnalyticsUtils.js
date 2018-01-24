import RNFirebase from "react-native-firebase";

const firebase = RNFirebase.initializeApp({
  debug: true,
});

export default {
  setScreen: (screenName) => {
    firebase.analytics().setCurrentScreen(screenName, null);
  },

  logEvent: (name, params) => {
    if (!__DEV__) { firebase.analytics().logEvent(name, params); }
  },
};
