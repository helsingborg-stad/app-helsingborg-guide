import { combineReducers } from "redux";
import guides from "./guideReducer";
import guideGroups from "./guideGroupsReducer";
import navigation from "./navigationReducer";
import subLocations from "./subLocationReducer";
import metrics from "./metricReducer";
import audio from "./audioReducer";
import internet from "./internetReducer";
import error from "./errorReducer";
import downloads from "./downloadReducer";
import geolocation from "./geolocationReducer";
import pointproperties from "./pointPropertiesReducer";
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
  pointproperties,
  downloadDataVersion,
});

export default rootReducer;
