import oldGuideGroups from "./oldGuideGroupReducer";
import guideGroups from "./guideGroupReducer";
import guides from "./guideReducer";
import navigation from "./navigationReducer";
import newNavigation from "./newNavigationReducer";
import subLocations from "./subLocationReducer";
import metrics from "./metricReducer";
import audio from "./audioReducer";
import internet from "./internetReducer";
import error from "./errorReducer";
import downloads from "./downloadReducer";
import geolocation from "./geolocationReducer";
import downloadDataVersion from "./downloadDataVersionReducer";
import uiState from "./uiStateReducer";
import downloadedGuides from "./downloadedGuides";

const rootReducer = {
  oldGuideGroups,
  guideGroups,
  guides,
  navigation,
  newNavigation,
  subLocations,
  audio,
  metrics,
  internet,
  error,
  downloads,
  geolocation,
  downloadDataVersion,
  downloadedGuides,
  uiState,
};

export default rootReducer;
