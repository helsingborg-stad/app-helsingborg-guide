import { Alert, Platform, Linking } from "react-native";
import Permissions from "react-native-permissions";
import LangService from "./langService";
import AndroidOpenSettings from "react-native-android-open-settings";

const ios = Platform.OS === "ios";

// Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
const PermissionsResponse = {
  AUTHORIZED: "authorized",
  DENIED: "denied",
  RESTRICTED: "restricted",
  UNDETERMINED: "undetermined",
};

const openSettings = () => (
  (ios)
    ? Linking.openURL("app-settings:")
    : AndroidOpenSettings.appDetailsSettings()
);

const promptPermissions = () => {
  Alert.alert(
    LangService.strings.CHECK_CAMERA_SERVICE,
    LangService.strings.MESSAGE_CAMERA_PERMISSION,
    [
      { text: LangService.strings.SETTINGS, onPress: () => openSettings() },
      { text: LangService.strings.CLOSE, onPress: () => {}, style: "cancel" },
    ],
    { cancelable: false },
  );
  return Promise.reject();
};

const requestPermissions = () => Permissions.request("camera").then((response) => {
  switch (response) {
    case PermissionsResponse.AUTHORIZED:
      return Promise.resolve(true);
    case PermissionsResponse.DENIED: // fallthrough
    case PermissionsResponse.RESTRICTED: // fallthrough
    case PermissionsResponse.UNDETERMINED:
    default:
      return promptPermissions();
  }
});

const checkPermissions = () => Permissions.check("camera").then((response) => {
  switch (response) {
    case PermissionsResponse.AUTHORIZED:
      return Promise.resolve(true);
    case PermissionsResponse.DENIED: // fallthrough
    case PermissionsResponse.RESTRICTED: // fallthrough
    case PermissionsResponse.UNDETERMINED:
      return requestPermissions();
    default:
      return Promise.reject();
  }
});


let instance = null;
export default class CameraService {
  static getInstance() {
    if (!instance) { instance = new CameraService(); }
    return instance;
  }

  checkCameraPermissions = () => checkPermissions();
}

