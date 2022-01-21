import DeviceInfo from "react-native-device-info";
import Matomo from "react-native-matomo";
import { MATOMO_URL, MATOMO_SITE_ID } from "@data/endpoints";

const isEmulator = async (func) => {
  DeviceInfo.isEmulator().then(device => {
    device && func()
  })
}

export const initializeTracker = () => {
  isEmulator(Matomo.initTracker((MATOMO_URL.toString() + 'matomo.php' ), parseInt(MATOMO_SITE_ID, 10)))
}

export const trackScreen = (path, title) => {
  console.log("track", path, title)
  isEmulator(Matomo.trackScreen(path, title))
}

export const trackEvent = (category, action, name, value, url) => {
  name = name ? name : "";
  value = value ? value : "";
  url = url ? url : "";

  isEmulator(Matomo.trackEvent(category, action, name, value, url))
}

export const trackGoal = (goalID, revenue) => {
    isEmulator(Matomo.trackGoal(goalID, revenue))
}
