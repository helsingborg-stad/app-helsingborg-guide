import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

// Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
const PermissionsResponse = {
  AUTHORIZED: "authorized",
  DENIED: "denied",
  RESTRICTED: "restricted",
  UNDETERMINED: "undetermined",
};

const CAMERA_PERMISSION = Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

const requestPermissions = () => request(CAMERA_PERMISSION).then((response) => {
  switch (response) {
    case RESULTS.GRANTED:
      return Promise.resolve(true);
    case RESULTS.DENIED: // fallthrough
    case RESULTS.BLOCKED: // fallthrough
    case RESULTS.UNAVAILABLE:
    default:
      return Promise.reject();
  }
});

const checkPermissions = () => check(CAMERA_PERMISSION).then((response) => {
  switch (response) {
    case RESULTS.GRANTED:
      return Promise.resolve(true);
    case RESULTS.DENIED: // fallthrough
    case RESULTS.BLOCKED: // fallthrough
    case RESULTS.UNAVAILABLE:
      return requestPermissions();
    default:
      return Promise.reject();
  }
});

let instance = null;
export default class CameraService {
  static getInstance() {
    if (!instance) {
      instance = new CameraService();
    }
    return instance;
  }

  checkCameraPermissions = () => checkPermissions();
}
