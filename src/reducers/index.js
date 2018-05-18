import oldGuideGroups from "./oldGuideGroupReducer";
import guideGroups from "./guideGroupReducer";
import guides from "./guideReducer";
import navigation from "./navigationReducer";
import subLocations from "./subLocationReducer";
import metrics from "./metricReducer";
import audio from "./audioReducer";
import internet from "./internetReducer";
import error from "./errorReducer";
import downloads from "./downloadReducer";
import geolocation from "./geolocationReducer";
import downloadDataVersion from "./downloadDataVersionReducer";
import uiState from "./uiStateReducer";

const rootReducer = {
  oldGuideGroups,
  guideGroups,
  guides,
  navigation,
  subLocations,
  audio,
  metrics,
  internet,
  error,
  downloads,
  geolocation,
  downloadDataVersion,
  uiState,
};

export default rootReducer;
