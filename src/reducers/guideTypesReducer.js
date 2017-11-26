import { FETCH_GUIDE_TYPES_SUCCESS, FETCH_GUIDE_TYPES_REQUEST, FETCH_GUIDE_TYPES_FAILURE } from "../actions/actionTypes";
import initialState from "./initialState";

export default function guideTypesReducer(state = initialState.guideTypes, action) {
  switch (action.type) {
    case FETCH_GUIDE_TYPES_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_GUIDE_TYPES_SUCCESS:
      return { ...state, items: action.guideTypes, isFetching: false };
    case FETCH_GUIDE_TYPES_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}
