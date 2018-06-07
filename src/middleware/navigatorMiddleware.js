// @flow

import { appReachedHomeScreen } from "../actions/uiStateActions";

export default ({ dispatch, getState }: Store) => (next: Dispatch) => (action: Action) => {
  const result = next(action);
  const previousState = getState();

  switch (action.type) {
    // case "Navigation/NAVIGATE":
    case "SET_GUIDES_AND_GUIDEGROUPS":
      if (!previousState.uiState.appReachedHomeScreen) { console.log("set reached homescreen"); dispatch(appReachedHomeScreen()); }
      break;
    default:
      // do nothing
      break;
  }
  return result;
};
