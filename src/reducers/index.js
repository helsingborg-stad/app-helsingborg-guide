import { combineReducers } from "redux";
import guides from "./guideReducer";
import subLocations from "./subLocationReducer";
import metrics from "./metricReducer";
import audio from "./audioReducer";
import internet from "./internetReducer";
import error from "./errorReducer";
import downloads from "./downloadReducer";
import menu from "./menuReducer";
import geolocation from "./geolocationReducer";

const rootReducer = combineReducers({
  guides,
  subLocations,
  audio,
  metrics,
  internet,
  error,
  downloads,
  menu,
  geolocation,
});

export default rootReducer;
