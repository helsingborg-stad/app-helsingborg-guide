import { combineReducers } from "redux";
import guides from "./guideReducer";
import guideGroups from "./guideGroupReducer";
import navigation from "./navigationReducer";
import subLocations from "./subLocationReducer";
import metrics from "./metricReducer";
import audio from "./audioReducer";
import internet from "./internetReducer";
import error from "./errorReducer";
import downloads from "./downloadReducer";
import geolocation from "./geolocationReducer";
import pointProperties from "./pointPropertiesReducer";
import downloadDataVersion from "./downloadDataVersionReducer";

const rootReducer = combineReducers({
  guides,
  guideGroups,
  navigation,
  subLocations,
  audio,
  metrics,
  internet,
  error,
  downloads,
  geolocation,
  pointProperties,
  downloadDataVersion,
});

export default rootReducer;
