import * as types from "@actions/actionTypes";
import initialState from "./initialState";

export default function geolocationReducer(
  state = initialState.position,
  action
) {
  switch (action.type) {
    case "GEOLOCATION_UPDATE_SUCCESS":
      console.log("GEOLOCATION_UPDATE_SUCCESS", action.position);
      return { ...state, position: action.position };
    case "GEOLOCATION_UPDATE_ERROR":
      return { ...state, position: null};
      default:
      return state;
  }
}
