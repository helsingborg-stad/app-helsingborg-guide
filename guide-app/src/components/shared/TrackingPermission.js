import { useEffect } from "react";
import AnalyticsUtils from "@utils/AnalyticsUtils";
import { RESULTS } from "react-native-permissions";
import { Platform } from "react-native";

const TrackingPermission = () => {
  useEffect(() => {
    if (Platform.OS === "ios") {
      // We need to request permission to track on iOS due to App Tracking Transparency
      AnalyticsUtils.requestPermission()
        .then((result) => {
          if (result === RESULTS.GRANTED) {
            AnalyticsUtils.setAnalyticsEnabledStatus(true);
          }
        })
        .catch(() => {});
    } else {
      // We default to enabling analytics on Android
      AnalyticsUtils.setAnalyticsEnabledStatus(true);
    }
  }, []);
  return null;
};

export default TrackingPermission;
