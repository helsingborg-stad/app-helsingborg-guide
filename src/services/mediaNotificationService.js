import { NativeModules, DeviceEventEmitter } from "react-native";

let instance = null;
const MediaControl = NativeModules.MediaControlAndroid;

export class MediaNotificationService {
  constructor() {}
  static getInstance() {
    if (!instance) instance = new MediaNotificationService();
    return instance;
  }

  init() {
    MediaControl.initMediaControlService();
  }
}
