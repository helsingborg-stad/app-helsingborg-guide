import firebase from '@react-native-firebase/app'
import analytics from '@react-native-firebase/analytics';

// const firebase = RNFirebase.app();

const firebaseApp = firebase.app();

export default {
  setScreen: (screenName) => {
    if (!__DEV__) { analytics().setCurrentScreen(screenName, null); }
  },

  logEvent: (name, params) => {
    if (!__DEV__) { analytics().logEvent(name, params); }
  },
};
