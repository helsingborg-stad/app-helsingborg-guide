import DeviceInfo from "react-native-device-info";
import Matomo from "react-native-matomo";
import { MATOMO_URL, MATOMO_SITE_ID } from "@data/endpoints";

const isReleaseDevice = async () => {
  let emulator = await DeviceInfo.isEmulator();
  return !!(!emulator && !(__DEV__));
};

export const initializeTracker = async () => {
  console.log("matomo", MATOMO_URL.toString() + "matomo.php", MATOMO_SITE_ID)
  await isReleaseDevice() && Matomo.initTracker((MATOMO_URL.toString() + "matomo.php"), parseInt(MATOMO_SITE_ID, 10));
};

export const trackScreen = async (path, title) => {
  await isReleaseDevice() && Matomo.trackScreen(path, title);
};
export const trackEvent = async (category, action, name, value, url) => {
  console.log(category, action, name, value, url);
  await isReleaseDevice() && Matomo.trackEvent(category, action, name, value, url);
};

export const trackGoal = async (goalID, revenue) => {
  await isReleaseDevice() && Matomo.trackGoal(goalID, revenue);

};
