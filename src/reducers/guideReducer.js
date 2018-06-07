// @flow

const initialState: GuideState = {
  isFetching: false,
  items: [],
};

export default function guideReducer(state: GuideState = initialState, action: Action): GuideState {
  switch (action.type) {
    case "FETCH_GUIDES_REQUEST":
      return { ...state, isFetching: true };
    case "FETCH_GUIDES_SUCCESS": {
      const items = action.guides;
      return { ...state, items, isFetching: false };
    }
    case "FETCH_GUIDES_FAILURE":
      return { ...state, isFetching: false };
    case "SET_GUIDES_AND_GUIDEGROUPS":
      return { ...state, items: action.guides };
    default:
      return state;
  }
}
