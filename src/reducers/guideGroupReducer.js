import { FETCH_GUIDEGROUPS_FAILURE, FETCH_GUIDEGROUPS_REQUEST, FETCH_GUIDEGROUPS_SUCCESS } from "../actions/actionTypes";
import initialState from "./initialState";

export default function guideGroupsReducer(state = initialState.guideGroups, action) {
  switch (action.type) {
    case FETCH_GUIDEGROUPS_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_GUIDEGROUPS_SUCCESS: {
      const items = action.guideGroups;
      return { ...state, items, isFetching: false };
    }
    case FETCH_GUIDEGROUPS_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}
