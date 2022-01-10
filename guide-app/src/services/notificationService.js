import { NativeModules, Platform } from "react-native";
const Notifier = NativeModules.NotificationAndroid;
const _DefaultExtNotification = {
  id: 200,
  title: "Extended Notification",
  content: "Drag down to see more",
  big_content_title: "Some Important Things",
  ext_content: ["line 1", "line 2", "line 3", "line 4"]
};

console.log("Notifier", Notifier, NativeModules)

export default {
  showSimple(title, content, id) {
    Notifier.showSimple(title, content, id);
  },

  showMediaNotification(title, content, id) {
    if (Platform.OS === "android") {
      Notifier.showMediaNotification(title, content, id);
    }
  },

  closeNotification(id) {
    if (Platform.OS === "android") {
      Notifier.closeNotification(id);
    }
  },

  closeNotifications() {
    Notifier.closeAll();
  },

  showExtended(_config) {
    const config = Object.assign({}, _DefaultExtNotification, _config);
    Notifier.showExtended(config);
  },

  showMediaControl() {
    Notifier.showMediaControl();
  }
};
