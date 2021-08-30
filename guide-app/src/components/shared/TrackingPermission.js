import { Component } from "react";
import AnalyticsUtils from "@utils/AnalyticsUtils";
import { RESULTS } from "react-native-permissions";
import { Platform } from "react-native";

export default class TrackingPermission extends Component {
  componentDidMount() {
    if (Platform.OS === "ios") {
      // We need to request permission to track on iOS due to App Tracking Transparency
      AnalyticsUtils.requestPermission()
        .then(result => {
          if (result === RESULTS.GRANTED) {
            AnalyticsUtils.setAnalyticsEnabledStatus(true);
          }
        })
        .catch(error => {
          console.log("Failed to request permission to track", error);
        });
    } else {
      // We default to enabling analytics on Android
      AnalyticsUtils.setAnalyticsEnabledStatus(true);
    }
  }

  render() {
    return null;
  }
}
