import { FETCH_NAVIGATION_SUCCESS, FETCH_NAVIGATION_REQUEST, FETCH_NAVIGATION_FAILURE } from "../actions/actionTypes";
import initialState from "./initialState";

export default function navigationReducer(state = initialState.navigation, action) {
  switch (action.type) {
    case FETCH_NAVIGATION_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_NAVIGATION_SUCCESS: {
      // Filter out the data we need
      const items = [];
      action.navigation.forEach((element) => {
        const item = {
          id: element.id,
          name: element.name,
          items: element.object_list,
        };
        items.push(item);
      });
      return { ...state, items, isFetching: false };
    }
    case FETCH_NAVIGATION_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}
