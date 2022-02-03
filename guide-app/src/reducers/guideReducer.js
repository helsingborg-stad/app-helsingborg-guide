// @flow

const initialState: GuideState = {
  isFetching: false,
  items: [],
  groupItems: [],
};

export default function guideReducer(
  state: GuideState = initialState,
  action: Action
): GuideState {
  switch (action.type) {
    case "FETCH_GUIDES_REQUEST":
      return { ...state, isFetching: true };
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

        return { ...state, ...(forGroups ? {groupItems: items} : {items: items}), isFetching: false, hasItems: items.length };
    }
    case "FETCH_GUIDES_FAILURE":
      return { ...state, isFetching: false };
    case "SET_GUIDES_AND_GUIDEGROUPS":
      return { ...state, items: action.guides };
    default:
      return state;
  }
}
