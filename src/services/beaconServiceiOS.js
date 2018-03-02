import { AlertIOS, NativeModules, NativeEventEmitter, DeviceEventEmitter } from "react-native";

let instance = null;

const BeaconManager = NativeModules.IosBeacon;

let rangedBeacons = [];

let scannerIsRunning = false;

let resultsCallback = () => { };

export class BeaconServiceiOS {
  static threshold = 3;
  eventEmitter;

  constructor() {
    this.eventEmitter = new NativeEventEmitter(NativeModules.IosBeacon);

    this.hookUpEvents = this.hookUpEvents.bind(this);
    this.init = this.init.bind(this);
    this.createBeaconList = this.createBeaconList.bind(this);
    this.updateBeaconDataInList = this.updateBeaconDataInList.bind(this);
    this.startRanging = this.startRanging.bind(this);
    this.stopRanging = this.stopRanging.bind(this);

    this.convertRawBeaconDataIntoBeaconObject = this.convertRawBeaconDataIntoBeaconObject.bind(this);

    this.hookUpEvents();
  }

  hookUpEvents() {
    this.eventEmitter.addListener("BEACON_ENTERED_REGION_IOS", this.createBeaconList);
    this.eventEmitter.addListener("UPDATE_BEACON_DATA", this.createBeaconList);
  }

  updateBeaconDataInList(data) {
    const beacon = this.convertRawBeaconDataIntoBeaconObject(data);
    if (!rangedBeacons.find(b => b.uid === beacon.uid)) rangedBeacons.push(beacon);
    resultsCallback({ beacons: rangedBeacons });
    rangedBeacons = [];
  }

  createBeaconList(data) {
    const beacon = this.convertRawBeaconDataIntoBeaconObject(data);
    rangedBeacons.push(beacon);

    const self = this;

    if (!scannerIsRunning) {
      setTimeout(() => {
        self.hasRangedBeacons = true;
        resultsCallback({ beacons: rangedBeacons });
        rangedBeacons = [];
        scannerIsRunning = false;
      }, 3000);
    }
    scannerIsRunning = true;
  }

  convertRawBeaconDataIntoBeaconObject(data) {
    const beacon = JSON.parse(data);
    const cleanUid = beacon.uid
      .replace("<", "")
      .replace(">", "")
      .replace(/ /g, "");
    beacon.nid = `0x${cleanUid.substring(0, 20)}`;
    beacon.bid = `0x${cleanUid.substring(20)}`;

    beacon.txPower = Number(beacon.txPower) - 42;

    return beacon;
  }

  static getInstance() {
    if (!instance) instance = new BeaconServiceiOS();
    return instance;
  }

  init() {
    const self = this;

    setTimeout(() => {
      if (!self.hasRangedBeacons) {
        resultsCallback({ beacons: [] });
      }
    }, 2000);
    return BeaconManager.startScanning();
  }
  checkBluetooth() { }

  unbind() { }

  startRanging(regionId) { }

  stopRanging(regionId) {
    this.hasRangedBeacons = false;
    return BeaconManager.stopScanning();
  }

  onRangingResult(callback) {
    resultsCallback = callback;
  }
  onServiceConnected(callback) { }
  unSubscribeOnRangingResult(callback) {
    this.eventEmitter.removeListener("BEACON_ENTERED_REGION_IOS", callback);
  }

  getTheClosest(beacons) {
    if (!beacons || !beacons.length) return;
    const sorted = beacons.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    return sorted[0];

    // return beacons.reduce((prev,curr)=> prev.distance<curr.distance?prev:curr);
  }
  unSubscribeOnRangingResult(callback) { }
  getOptimizedDistanceBeacons(beacons) {
    if (!beacons || !beacons.length) return [];

    const optimizedBeacons = beacons.map(_beacon => this.optimizeDistance(_beacon));

    const beaconGroups = [];
    for (let i = 0; i < optimizedBeacons.length; i += 1) {
      const currentGroup = beaconGroups.find(item => item[0].bid === optimizedBeacons[i].bid);
      if (currentGroup) {
        currentGroup.push(optimizedBeacons[i]);
      } else {
        const newBeaconGroup = [];
        newBeaconGroup.push(optimizedBeacons[i]);
        beaconGroups.push(newBeaconGroup);
      }
    }
    const newBeacons = [];
    for (let i = 0; i < beaconGroups.length; i += 1) {
      let totalDist = 0;
      let count = 0;
      for (let j = 0; j < beaconGroups[i].length; j += 1) {
        totalDist += beaconGroups[i][j].distance;
        count += 1;
      }
      beaconGroups[i][0].distance = totalDist / count;
      newBeacons.push(beaconGroups[i][0]);
    }

    return newBeacons;
  }
  unSubscribeOnServiceConnected(callback) { }

  // for estimot
  // optimizeDistance(_beacon){
  //     let beacon = _beacon;
  //     beacon.distance = Math.pow(10,((parseInt(beacon.txPower) - parseInt(beacon.rssi))/25));
  //     return beacon;
  // }

  // for kontact.io
  optimizeDistance(_beacon) {
    const beacon = _beacon;
    beacon.txPower = parseInt(beacon.txPower);
    beacon.distance = Math.sqrt(Math.pow(10, (parseInt(beacon.txPower) - parseInt(beacon.rssi)) / 10));
    return beacon;
  }

  getTheClosest(beacons) {
    if (!beacons || !beacons.length) return {};
    const sorted = beacons.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    return sorted[0];

    // return beacons.reduce((prev,curr)=> prev.distance<curr.distance?prev:curr);
  }
}
