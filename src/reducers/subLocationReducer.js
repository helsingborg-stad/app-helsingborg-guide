import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function subLocationReducer(state = initialState.subLocations, action) {
  switch (action.type) {
    case types.UPDATE_SUBLOCATION:
      return [...state.filter(item => item.id !== action.subLocation.id), Object.assign({}, action.subLocation, { contentType: action.subLocation.content_type })];
    case types.LOAD_SUBLOCATIONS_SUCCESS:
      return action.subLocations.map(element => Object.assign(element, { contentType: element.content_type }));
    default:
      return state;
  }
}
