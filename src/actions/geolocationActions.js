import * as types from "./actionTypes";

export default function geolocationUpdated(position) {
  return { type: types.GEOLOCATION_UPDATE_SUCCESS, position };
}
