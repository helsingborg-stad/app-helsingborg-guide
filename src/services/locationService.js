import { Alert, Platform, Linking } from "react-native";
import Permissions from "react-native-permissions";
import AndroidOpenSettings from "react-native-android-open-settings";
import RNSimpleCompass from "react-native-simple-compass";
import LangService from "./langService";
import GeoLocationActions from "../actions/geolocationActions";

const ios = Platform.OS === "ios";

const DEGREE_UPDATE_THRESHOLD = 10; // number of degrees to trigger callback (in degrees)
const DISTANCE_UPDATE_THRESHOLD = 1; // distance to move to trigger callback (in meters)

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

  watchGeoLocation = () => checkPermissions().then(
    () => new Promise((resolve, reject) => {
      this.watcher = navigator.geolocation.watchPosition(
        (position) => {
          this.store.dispatch(GeoLocationActions.geolocationUpdated(position));
          return resolve(position);
        },
        reject,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000,
          distanceFilter: DISTANCE_UPDATE_THRESHOLD,
        },
      );
    }),
  );

  unwatchGeoLocation = () => this.watcher && navigator.geolocation.clearWatch(this.watcher);

  getMathDistance(coord1, coord2) {
    const x = Math.abs(coord1.latitude - coord2.latitude);
    const y = Math.abs(coord1.longitude - coord2.longitude);
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }

  getCompassBearing = () => new Promise((resolve, reject) => {
    RNSimpleCompass.start(DEGREE_UPDATE_THRESHOLD, (degree) => {
      resolve(degree);
      RNSimpleCompass.stop();
    });
  });

  subscribeCompassBearing = () => new Promise((resolve, reject) => {
    try {
      this.compassWatcher = RNSimpleCompass.start(DEGREE_UPDATE_THRESHOLD, (degree) => {
        const modifiedDegree = degree.toFixed(0);
        this.store.dispatch(GeoLocationActions.compassbearingUpdated(modifiedDegree));
        resolve(modifiedDegree);
      });
    } catch (e) {
      reject(e);
    }
  });

  clearCompassBearingWatch = () => {
    if (this.compassWatcher) RNSimpleCompass.stop();
  };
}
