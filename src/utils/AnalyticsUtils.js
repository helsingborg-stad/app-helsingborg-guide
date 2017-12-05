import firebase from "react-native-firebase";

export default {
  logEvent: (name, params) => {
    firebase.analytics().logEvent(name, params);
  },
};
