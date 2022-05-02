// @flow

const initialState: GeoLocationState = {
  position: null,
};

export default function geolocationReducer(
  state: GeoLocationState = initialState,
  action: Action
): GeoLocationState {
  switch (action.type) {
    case "GEOLOCATION_UPDATE_SUCCESS":
      console.log("GEO UPDATE IN REDUCER")
      return { ...state, position: action.position };
    case "GEOLOCATION_UPDATE_ERROR":
      return { ...state, position: null};
      default:
      return state;
  }
}


