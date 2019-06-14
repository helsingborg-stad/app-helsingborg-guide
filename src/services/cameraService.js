import Permissions from "react-native-permissions";

// Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
const PermissionsResponse = {
  AUTHORIZED: "authorized",
  DENIED: "denied",
  RESTRICTED: "restricted",
  UNDETERMINED: "undetermined",
};

const requestPermissions = () => Permissions.request("camera").then((response) => {
  switch (response) {
    case PermissionsResponse.AUTHORIZED:
      return Promise.resolve(true);
    case PermissionsResponse.DENIED: // fallthrough
    case PermissionsResponse.RESTRICTED: // fallthrough
    case PermissionsResponse.UNDETERMINED:
    default:
      return Promise.reject();
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
    if (!instance) {
      instance = new CameraService();
    }
    return instance;
  }

  checkCameraPermissions = () => checkPermissions();
}
