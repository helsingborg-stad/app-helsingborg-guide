import * as types from "@actions/actionTypes";
import initialState from "./initialState";

export default function hasLocationReducer(state = initialState.hasLocationStatus, action) {
  switch (action.type) {
    case "HAS_LOCATION_STATUS":
      console.log("action", action);
      return action.hasLocationStatus;
    default:
      return state;
  }
}
