import guideGroups from "./guideGroupReducer";
import guides from "./guideReducer";
import navigation from "./navigationReducer";
import audio from "./audioReducer";
import internet from "./internetReducer";
import error from "./errorReducer";
import downloads from "./downloadReducer";
import geolocation from "./geolocationReducer";
import downloadDataVersion from "./downloadDataVersionReducer";
import uiState from "./uiStateReducer";
import downloadedGuides from "./downloadedGuides";
import arState from "./arReducer";

const rootReducer = {
  guideGroups,
  guides,
  navigation,
  audio,
  internet,
  error,
  downloads,
  geolocation,
  downloadDataVersion,
  downloadedGuides,
  uiState,
  arState,
};

export default rootReducer;
