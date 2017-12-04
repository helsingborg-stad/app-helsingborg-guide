import nativeFirebase from "react-native-firebase";

export default {
  logEvent: (name, params) => {
    this.nativeFirebase = nativeFirebase.initializeApp();
    this.nativeFirebase.analytics().logEvent(name, params);
  },
};
