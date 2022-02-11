import analytics, { firebase } from "@react-native-firebase/analytics";
import { request, PERMISSIONS } from "react-native-permissions";

export default {
  requestPermission: async () => {
    try {
      return await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    } catch (e) {
      return false;
    }
  },

  setAnalyticsEnabledStatus: async (enabled: Boolean) => {
    try {
      await firebase.analytics().setAnalyticsCollectionEnabled(enabled);
    } catch (error) {
      console.warn("Failed to enable analytics collection", error);
    }
  },

  setScreen: screenName => {
    if (!__DEV__ && screenName) {
      analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenName,
      });
    }
  },

  logEvent: (name, params) => {
    if (!__DEV__) {
      analytics().logEvent(name, params);
    }
  },
};
