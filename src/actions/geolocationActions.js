import * as types from "./actionTypes";

export function geolocationUpdated(position) {
  return { type: types.GEOLOCATION_UPDATE_SUCCESS, position };
}
