// @flow
const initialState: NavigationState = {
  isFetching: false,
  categories: [],
};

export default function navigationReducer(state: NavigationState = initialState, action: Action): NavigationState {
  switch (action.type) {
    case "FETCH_NAVIGATION_REQUEST":
      return {
        ...state,
        isFetching: true,
      };
    case "FETCH_NAVIGATION_SUCCESS": {
      const { categories } = action;
      return {
        ...state,
        categories,
        isFetching: false,
      };
    }
    case "FETCH_NAVIGATION_FAILURE":
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
}
