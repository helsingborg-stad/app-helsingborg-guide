// @flow


const initialState: GuideGroupState = {
  isFetching: false,
  items: [],
};

export default function guideGroupReducer(state: GuideGroupState = initialState, action: Action): GuideGroupState {
  switch (action.type) {
    case "FETCH_GUIDEGROUPS_REQUEST":
      return { ...state, isFetching: true };
    case "FETCH_GUIDEGROUPS_SUCCESS": {
      const items = action.guideGroups;
      return { ...state, items, isFetching: false };
    }
    case "FETCH_GUIDEGROUPS_FAILURE":
      return { ...state, isFetching: false };
    case "SET_GUIDEGROUPS":
      return { ...state, items: action.guideGroups };
    default:
      return state;
  }
}
