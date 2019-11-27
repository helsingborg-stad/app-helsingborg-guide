import { Alert, Platform } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "@react-native-community/geolocation";
import RNSimpleCompass from "react-native-simple-compass";
import LangService from "./langService";
import GeoLocationActions from "../actions/geolocationActions";
import { SettingsUtils, MathUtils } from "../utils";

const DEGREE_UPDATE_THRESHOLD = 10; // number of degrees to trigger callback (in degrees)
const DISTANCE_UPDATE_THRESHOLD = 1; // distance to move to trigger callback (in meters)
const COMPASS_PRECISION = 0; // limit the compass readings to 0 decimal places

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

const LOCATION_PERMISSION = Platform.OS === "ios" ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

const promptPermissions = () => {
  Alert.alert(
    LangService.strings.CHECK_LOCATION_SERVICE,
    LangService.strings.MESSAGE_LOCATION_PERMISSION,
    [
      { text: LangService.strings.SETTINGS, onPress: () => SettingsUtils.openSettings() },
      { text: LangService.strings.CLOSE, onPress: () => {}, style: "cancel" },
    ],
    { cancelable: false },
  );
  return Promise.reject();
};

const requestPermissions = () => request(LOCATION_PERMISSION, RATIONALE).then((response) => {
  switch (response) {
    case RESULTS.GRANTED:
      return Promise.resolve(true);
    case RESULTS.DENIED: // fallthrough
    case RESULTS.BLOCKED: // fallthrough
    case RESULTS.UNAVAILABLE:
    default:
      return promptPermissions();
  }
});

const checkPermissions = () => check(LOCATION_PERMISSION).then((response) => {
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

const getLocation = () => new Promise((resolve, reject) => {
  Geolocation.getCurrentPosition(resolve, reject);
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

  subscribeGeoLocation = () => checkPermissions().then(
    () => new Promise((resolve, reject) => {
      this.watcher = Geolocation.watchPosition(
        (position) => {
          this.store.dispatch(GeoLocationActions.geolocationUpdated(position));
          return resolve(position);
        },
        reject,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 1000,
          distanceFilter: DISTANCE_UPDATE_THRESHOLD,
        },
      );
    }),
  );

  unsubscribeGeoLocation = () => this.watcher && Geolocation.clearWatch(this.watcher);

  getMathDistance(coord1, coord2) {
    const x = coord2.latitude - coord1.latitude;
    const y = coord2.longitude - coord1.longitude;
    return Math.sqrt(x * x + y * y);
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
        const bearing = MathUtils.limitPrecision(degree, COMPASS_PRECISION);
        this.store.dispatch(GeoLocationActions.compassbearingUpdated(bearing));
        resolve(bearing);
      });
    } catch (e) {
      reject(e);
    }
  });

  unsubscribeCompassBearing = () => {
    if (this.compassWatcher) RNSimpleCompass.stop();
  };
}
