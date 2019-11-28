// @flow
import { Platform, Linking } from "react-native";
import AndroidOpenSettings from "react-native-android-open-settings";

const ios = Platform.OS === "ios";

const openSettings = () =>
  ios
    ? Linking.openURL("app-settings:")
    : AndroidOpenSettings.locationSourceSettings();

export default {
  openSettings
};
