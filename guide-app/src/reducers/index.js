import guideGroups from "./guideGroupReducer";
import guides from "./guideReducer";
import interactiveGuides from "./interactiveGuideReducer";
import events from "./eventReducer";
import navigation from "./navigationReducer";
import audio from "./audioReducer";
import internet from "./internetReducer";
import error from "./errorReducer";
import downloads from "./downloadReducer";
import geolocation from "./geolocationReducer";
import hasLocationStatus from "./hasLocationReducer";
import downloadDataVersion from "./downloadDataVersionReducer";
import uiState from "./uiStateReducer";
import downloadedGuides from "./downloadedGuides";
import arState from "./arReducer";
import quiz from "./quizReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  events,
  guideGroups,
  guides,
  interactiveGuides,
  navigation,
  audio,
  internet,
  error,
  downloads,
  geolocation,
  hasLocationStatus,
  downloadDataVersion,
  downloadedGuides,
  uiState,
  arState,
  quiz,
});

export default rootReducer;
