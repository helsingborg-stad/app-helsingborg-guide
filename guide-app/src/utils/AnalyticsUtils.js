import firebase from "@react-native-firebase/app";
import analytics from "@react-native-firebase/analytics";

// const firebase = RNFirebase.app();

firebase.app();

export default {
  setScreen: screenName => {
    if (!__DEV__ && screenName) {
      analytics().setCurrentScreen(screenName);
    }
  },

  logEvent: (name, params) => {
    if (!__DEV__) {
      analytics().logEvent(name, params);
    }
  }
};
