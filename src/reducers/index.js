import { combineReducers } from "redux";
import guides from "./guideReducer";
import navigation from "./navigationReducer";
import subLocations from "./subLocationReducer";
import metrics from "./metricReducer";
import audio from "./audioReducer";
import internet from "./internetReducer";
import error from "./errorReducer";
import downloads from "./downloadReducer";
import geolocation from "./geolocationReducer";

const rootReducer = combineReducers({
  guides,
  navigation,
  subLocations,
  audio,
  metrics,
  internet,
  error,
  downloads,
  geolocation,
});

export default rootReducer;
