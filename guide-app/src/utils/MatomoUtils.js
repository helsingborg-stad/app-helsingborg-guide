import DeviceInfo from "react-native-device-info";
import Matomo from "react-native-matomo";
import { MATOMO_URL, MATOMO_SITE_ID } from "@data/endpoints";

const isDevice = async () => {
  let emulator = await DeviceInfo.isEmulator();
  return !emulator;
};

export const initializeTracker = async () => {
  await isDevice() && Matomo.initTracker((MATOMO_URL.toString() + "matomo.php"), parseInt(MATOMO_SITE_ID, 10));
};

export const trackScreen = async (path, title) => {
  path = path ? path : "";
  title = title ? title : "";
  await isDevice() && Matomo.trackScreen(path, title);
};

export const trackEvent = async (category, action, name, value, url) => {
  name = name ? name : "";
  value = value ? value : "";
  url = url ? url : "";
  await isDevice() && Matomo.trackEvent(category, action, name, value, url);
};

export const trackGoal = async (goalID, revenue) => {
  goalID = goalID ? goalID : "";
  revenue = revenue ? revenue : "";
  await isDevice() && Matomo.trackGoal(goalID, revenue);

};
