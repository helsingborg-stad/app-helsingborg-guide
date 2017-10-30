import * as types from "./actionTypes";
import dc from "../data/datacontext";
import { errorHappened } from "./errorActions";

export function updateSubLocation(subLocation) {
  return { type: types.UPDATE_SUBLOCATION, subLocation };
}

export function loadSubLocationsSuccess(subLocations) {
  return { type: types.LOAD_SUBLOCATIONS_SUCCESS, subLocations };
}

export function loadSubLocations(langCode) {
  // //console.log('ACTION:LOAD_SUBLOCATIONS');
  return function (dispatch) {
    const instance = dc();
    return instance.guide
      .getAllGuides(langCode)
      .then((subLocations) => {
        if (subLocations && subLocations.length && subLocations.code != "rest_no_route") {
          dispatch(loadSubLocationsSuccess(subLocations));
        } else {
          dispatch(errorHappened("error: no subLocations"));
        }
      })
      .catch((error) => {
        dispatch(errorHappened(error));
      });
  };
}
