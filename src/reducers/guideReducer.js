// @flow

import initialState from "./initialState";

export default function guideReducer(state: GuideState = initialState.guides, action: Action): GuideState {
  switch (action.type) {
    case "FETCH_GUIDES_REQUEST":
      return { ...state, isFetching: true };
    case "FETCH_GUIDES_SUCCESS": {
      const items = action.guides;
      return { ...state, items, isFetching: false };
    }
    case "FETCH_GUIDES_FAILURE":
      return { ...state, isFetching: false };
    default:
      return state;
  }
}
