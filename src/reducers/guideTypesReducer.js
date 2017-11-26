import { LOAD_GUIDE_TYPES_SUCCESS } from "../actions/actionTypes";
import initialState from "./initialState";

export default function guideTypesReducer(state = initialState.guideTypes, action) {
  switch (action.type) {
    case LOAD_GUIDE_TYPES_SUCCESS:
      return action.guideTypes;
    default:
      return state;
  }
}
