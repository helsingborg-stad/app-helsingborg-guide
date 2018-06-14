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
      const items = [...state.items];
      action.guides.forEach((g) => {
        const index = items.findIndex(item => item.id === g.id);
        if (index >= 0) {
          // replace
          items[index] = g;
        } else {
          // push
          items.push(g);
        }
      },
      );
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
