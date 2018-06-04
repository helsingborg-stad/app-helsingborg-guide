// @flow
const initialState: NavigationState = {
  isFetching: false,
  navigationCategories: [],
  renderableNavigationCategories: [],
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
        navigationCategories: categories,
        isFetching: false,
      };
    }
    case "FETCH_NAVIGATION_FAILURE":
      return {
        ...state,
        isFetching: false,
      };
    case "SET_RENDERABLE_NAVIGATION_CATEGORIES":
      return {
        ...state,
        renderableNavigationCategories: action.categories,
      };
    default:
      return state;
  }
}
