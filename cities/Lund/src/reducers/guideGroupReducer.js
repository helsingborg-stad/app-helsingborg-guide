// @flow

const initialState: GuideGroupState = {
  isFetching: false,
  items: []
};

export default function guideGroupReducer(
  state: GuideGroupState = initialState,
  action: Action
): GuideGroupState {
  switch (action.type) {
    case "FETCH_GUIDEGROUPS_REQUEST":
      return { ...state, isFetching: true };
    case "FETCH_GUIDEGROUPS_SUCCESS": {
      const items = [...state.items];
      action.guideGroups.forEach(g => {
        const index = items.findIndex(item => item.id === g.id);
        if (index >= 0) {
          // replace
          items[index] = g;
        } else {
          // push
          items.push(g);
        }
      });
      return { ...state, items, isFetching: false };
    }
    case "FETCH_GUIDEGROUPS_FAILURE":
      return { ...state, isFetching: false };
    case "SET_GUIDES_AND_GUIDEGROUPS":
      return { ...state, items: action.guideGroups };
    default:
      return state;
  }
}
