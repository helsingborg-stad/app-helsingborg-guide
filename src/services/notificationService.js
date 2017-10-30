import { NativeModules, DeviceEventEmitter, Platform } from "react-native";

let instance = null;
const Notifier = NativeModules.NotificationAndroid;
const _DefaultExtNotification = {
  id: 200,
  title: "Extended Notification",
  content: "Drag down to see more",
  big_content_title: "Some Important Things",
  ext_content: ["line 1", "line 2", "line 3", "line 4"],
};

export class NotificationService {
  constructor() {}
  static getInstance() {
    if (!instance) instance = new NotificationService();
    return instance;
  }

  showSimple(title, content, id) {
    Notifier.showSimple(title, content, id);
  }

  showMediaNotification(title, content, id) {
    if (Platform.OS == "android") Notifier.showMediaNotification(title, content, id);
  }

  closeNotification(id) {
    if (Platform.OS == "android") Notifier.closeNotification(id);
  }

  closeNotifications() {
    Notifier.closeAll();
  }

  showExtended(_config) {
    const config = Object.assign({}, _DefaultExtNotification, _config);
    Notifier.showExtended(config);
  }

  showMediaControl() {
    Notifier.showMediaControl();
  }
}
