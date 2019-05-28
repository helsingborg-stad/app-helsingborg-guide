import { Alert, Platform, Linking } from "react-native";
import Permissions from "react-native-permissions";
import AndroidOpenSettings from "react-native-android-open-settings";
import RNSimpleCompass from "react-native-simple-compass";
import haversine from "haversine";
import LangService from "./langService";
import GeoLocationActions from "../actions/geolocationActions";

const ios = Platform.OS === "ios";

const WALKING_SPEED = 80; // metres per minute

// Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
const PermissionsResponse = {
  AUTHORIZED: "authorized",
  DENIED: "denied",
  RESTRICTED: "restricted",
  UNDETERMINED: "undetermined",
};

const RATIONALE = {
  title: LangService.strings.ACCESS_TO_LOCATION,
  message: LangService.strings.MESSAGE_LOCATION_PERMISSION,
};

const openSettings = () => (ios ? Linking.openURL("app-settings:") : AndroidOpenSettings.locationSourceSettings());

const promptPermissions = () => {
  Alert.alert(
    LangService.strings.CHECK_LOCATION_SERVICE,
    LangService.strings.MESSAGE_LOCATION_PERMISSION,
    [
      { text: LangService.strings.SETTINGS, onPress: () => openSettings() },
      { text: LangService.strings.CLOSE, onPress: () => {}, style: "cancel" },
    ],
    { cancelable: false },
  );
  return Promise.reject();
};

const requestPermissions = () => Permissions.request("location", RATIONALE).then((response) => {
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

const checkPermissions = () => Permissions.check("location").then((response) => {
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

const getLocation = () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(resolve, reject);
});

// TODO decouple the store from this class!
let instance = null;

export default class LocationService {
  watcher;

  compassWatcher;

  store;

  static getInstance() {
    if (!instance) instance = new LocationService();
    return instance;
  }

  static getTravelDistance = (fromLocation, toLocation, unit = "meter") => haversine(fromLocation, toLocation, { unit }) || 0;

  static getTravelTime = distance => distance / WALKING_SPEED;

  upatePosition = () => new Promise((resolve, reject) => getLocation().then(
    (position) => {
      this.store.dispatch(GeoLocationActions.geolocationUpdated(position));
      return resolve(position);
    },
    (error) => {
      checkPermissions();
      reject(error);
    },
  ),
  );

  getGeoLocation = () => checkPermissions().then(this.upatePosition);

  watchGeoLocation = () => checkPermissions().then(this.upatePosition);

  unwatchGeoLocation = () => this.watcher && navigator.geolocation.clearWatch(this.watcher);

  getMathDistance(coord1, coord2) {
    const x = Math.abs(coord1.latitude - coord2.latitude);
    const y = Math.abs(coord1.longitude - coord2.longitude);
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }

  subscribeCompassBearing = () => new Promise((resolve, reject) => {
    try {
      // Number of degrees changed before the callback is triggered
      const degreeUpdateRate = 1;
      this.compassWatcher = RNSimpleCompass.start(degreeUpdateRate, (degree) => {
        this.store.dispatch(GeoLocationActions.compassbearingUpdated(degree));
        resolve(degree);
      });
    } catch (e) {
      reject(e);
    }
  });

  clearCompassBearingWatch = () => {
    if (this.compassWatcher) RNSimpleCompass.stop();
  };
}
