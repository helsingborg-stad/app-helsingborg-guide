import * as types from "./actionTypes";

export const geolocationUpdated = (position) => ({ type: types.GEOLOCATION_UPDATE_SUCCESS, position });
export const geolocationError = () => ({ type: types.GEOLOCATION_UPDATE_ERROR });
