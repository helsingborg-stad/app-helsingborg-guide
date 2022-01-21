import Matomo from "react-native-matomo";
import { MATOMO_URL, MATOMO_SITE_ID } from "@data/endpoints";


export const initializeTracker = () => {
  console.log("the url", MATOMO_URL.toString() + 'matomo.php')
  Matomo.initTracker((MATOMO_URL.toString() + 'matomo.php' ), parseInt(MATOMO_SITE_ID, 10));
  console.log("Matomo started", Matomo)

}

export const trackScreen = (path, title) => {
  console.log("tracking")
  Matomo.trackScreen(path, title)
}

export const trackEvent = (category, action, name, value, url) => {
  Matomo.trackEvent(category, action, name, value, url)
}

export const trackGoal = (goalID, revenue) => {
  Matomo.trackGoal(goalID, revenue)
}
