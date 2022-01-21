import Matomo from "react-native-matomo";
import { MATOMO_URL, MATOMO_SITE_ID, MATOMO_SITE_PASSWORD } from "@data/endpoints";


export const initializeTracker = () => {
  Matomo.initTracker(MATOMO_URL, 1);
}
