import DeviceInfo from "react-native-device-info";
import Matomo from "react-native-matomo";
import { MATOMO_URL, MATOMO_SITE_ID } from "@data/endpoints";

const isReleaseDevice = async () => {
  let emulator = await DeviceInfo.isEmulator();
  // return !!(!emulator && !(__DEV__));
  return !!(!emulator && !(__DEV__));
};

export const initializeTracker = async () => {
  await isReleaseDevice() && Matomo.initTracker((MATOMO_URL.toString() + "matomo.php"), parseInt(MATOMO_SITE_ID, 10));
};

export const trackScreen = async (path, title) => {
  console.log("__MATOTO TRACKING__", path)
  await isReleaseDevice() && Matomo.trackScreen(path, title);
};
export const trackEvent = async (category, action, name, value, url) => {
  await isReleaseDevice() && Matomo.trackEvent(category, action, name, value, url);
};

export const trackGoal = async (goalID, revenue) => {
  await isReleaseDevice() && Matomo.trackGoal(goalID, revenue);
};

