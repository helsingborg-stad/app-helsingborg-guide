import { PermissionsAndroid, Alert, Platform, Linking } from "react-native";
import LangService from "./langService";
import Opener from "./SettingsService";
import geolocationUpdated from "../actions/geolocationActions";
import store from "../store/configureStore";

let instance = null;

export default class LocationService {
  watcher;

  static getInstance() {
    if (!instance) instance = new LocationService();
    return instance;
  }

  checkLocationPermission() {
    if (Platform.OS === "ios") return Promise.resolve(true);

    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  }

  // Ask for access location permission.
  askForPermission() {
    const content = {
      title: LangService.strings.ACCESS_TO_LOCATION,
      message: LangService.strings.MESSAGE_LOCATION_PERMISSION,
    };
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, content);
  }
  // alert if the location is turned off. (the feature not the permission)
  alert() {
    Alert.alert(
      LangService.strings.CHECK_LOCATION_SERVICE,
      LangService.strings.MESSAGE_LOCATION_PERMISSION,
      [
        { text: LangService.strings.SETTINGS, onPress: () => this.openLocationSettings() },
        { text: LangService.strings.CLOSE, onPress: () => { }, style: "cancel" },
      ],
      { cancelable: false },
    );
  }
  // open location setting
  openLocationSettings() {
    if (Platform.OS == "ios") Linking.openURL("app-settings:");
    else Opener.openLocationSetting();
  }

  getGeoLocation() {
    return this.checkLocationPermission().then(
      granted =>
        new Promise((resolve, reject) => {
          if (granted) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                store.dispatch(geolocationUpdated(position));
                resolve(position);
              },
              (error) => {
                this.alert();
                reject(error);
              },
            );
          } else {
            this.askForPermission();
            reject("ss");
          }
        }),
    );
  }

  watchGeoLocation() {
    return this.checkLocationPermission().then(
      granted =>
        new Promise((resolve, reject) => {
          if (granted) {
            this.watcher = navigator.geolocation.watchPosition(
              (position) => {
                store.dispatch(geolocationUpdated(position));
                resolve(position);
              },
              error => reject(error),
              { distanceFilter: 10 },
            );
          } else reject("no access to fine location");
        }),
    );
  }

  clearWatch() {
    if (this.watcher) navigator.geolocation.clearWatch(this.watcher);
  }

  getMathDistance(coord1, coord2) {
    const x = Math.abs(coord1.latitude - coord2.latitude);
    const y = Math.abs(coord1.longitude - coord2.longitude);
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }
}
