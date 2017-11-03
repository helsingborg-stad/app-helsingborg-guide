import { NativeModules, DeviceEventEmitter, AppState, PermissionsAndroid, Alert } from "react-native";
import NotificationService from "../services/notificationService";
import { LangService } from "./langService";
import Opener from "./SettingsService";

let instance = null;
const BeaconManager = NativeModules.BeaconAndroid;
const BEACON_NOTIFICATION_ID = 201;

export class BeaconService {
  static threshold = 3;
  closest;
  notificationService;

  constructor() {
    this.closest = {};
  }

  static getInstance() {
    if (!instance) instance = new BeaconService();
    return instance;
  }

  // retrun promis
  isBluetoothEnabled() {
    return BeaconManager.isBluetoothEnabled();
  }

  checkBluetooth() {
    this.isBluetoothEnabled().then((enabled) => {
      console.log("BLE enabled:", enabled);
      if (!enabled) {
        this.alert();
      }
    });
  }

  alert() {
    Alert.alert(
      LangService.strings.NO_BLE_CONNECTION,
      LangService.strings.NO_BLE_CONNECTION_MESSAGE,
      [
        { text: LangService.strings.SETTINGS, onPress: this.openBLESettings.bind(this) },
        { text: LangService.strings.CLOSE, onPress: () => {}, style: "cancel" },
      ],
      { cancelable: false },
    );
  }

  openBLESettings() {
    Opener.openBlSetting();
  }

  init() {
    this.checkLocationPermission().then((granted) => {
      if (!granted) return this.askForPermission();
    });
    // this.askForPermission();
    return BeaconManager.init();
  }

  checkLocationPermission() {
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

  unbind() {
    // console.log('will start the beacon service');
    return BeaconManager.unbind();
  }

  startRanging(regionId) {
    return BeaconManager.startRangingBeacons(regionId);
  }

  stopRanging(regionId) {
    return BeaconManager.stopRangingBeacons(regionId);
  }

  onRangingResult(callback) {
    DeviceEventEmitter.addListener("BEACON_ENTERED_REGION", callback);
  }

  unSubscribeOnRangingResult(callback) {
    DeviceEventEmitter.removeListener("BEACON_ENTERED_REGION", callback);
  }

  onServiceConnected(callback) {
    DeviceEventEmitter.addListener("BEACON_SERVICE_CONNECTED", callback);
  }

  unSubscribeOnServiceConnected(callback) {
    DeviceEventEmitter.removeListener("BEACON_SERVICE_CONNECTED", callback);
  }

  getTheClosest(beacons) {
    if (!beacons || !beacons.length) return {};
    const sorted = beacons.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    return sorted[0];

    // return beacons.reduce((prev,curr)=> prev.distance<curr.distance?prev:curr);
  }

  getOptimizedDistanceBeacons(beacons) {
    if (!beacons || !beacons.length) return [];
    return beacons.map(_beacon => this.optimizeDistance(_beacon));
  }

  optimizeDistance(_beacon) {
    const beacon = _beacon;
    beacon.txPower = parseInt(beacon.txPower);
    beacon.distance = Math.sqrt(Math.pow(10, (parseInt(beacon.txPower) - parseInt(beacon.rssi)) / 10));
    return beacon;
  }

  notify() {
    if (AppState.currentState == "background") {
      const title = LangService.strings.SOMETHING_NEAR_BY;
      this.notificationService.showSimple(title, "", BEACON_NOTIFICATION_ID);
    }
  }
}
