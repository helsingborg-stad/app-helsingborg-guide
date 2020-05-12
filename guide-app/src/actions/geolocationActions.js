import * as types from "./actionTypes";

export default {
  geolocationUpdated(position) {
    return { type: types.GEOLOCATION_UPDATE_SUCCESS, position };
  }
};
