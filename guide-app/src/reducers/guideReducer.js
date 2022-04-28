// @flow

const initialState: GuideState = {
  isFetching: false,
  items: [],
  groupItems: [],
  all: [],
};

export default function guideReducer(
  state: GuideState = initialState,
  action: Action
): GuideState {
  switch (action.type) {
    case "FETCH_ALL_GUIDES_FOR_ALL_GROUPS_REQUEST":
      return { ...state };
    case "FETCH_ALL_GUIDES_FOR_ALL_GROUPS_SUCCESS":
      return { ...state, all: action.all };
    case "FETCH_GUIDES_REQUEST":
      return { ...state, isFetching: true, doneFetching: false };
    case "FETCH_GUIDES_SUCCESS": {
      const items = action?.guides?.length ? [...action.guides] : [...state.items];
      const { forGroups } = action;
      // action.guides.forEach(g => {
      //   const index = items.findIndex(item => item.id === g.id);
      //   if (index >= 0) {
      //     // replace
      //     items[index] = g;
      //   } else {
      //     // push
      //     items.push(g);
      //   }
      // });

        return { ...state, ...(forGroups ? {groupItems: items} : {items: items}), isFetching: false, hasItems: items.length, doneFetching: true };
    }
    case "FETCH_GUIDES_FAILURE":
      return { ...state, isFetching: false };
    case "SET_GUIDES_AND_GUIDEGROUPS":
      return { ...state, items: action.guides };
    default:
      return state;
  }
}
