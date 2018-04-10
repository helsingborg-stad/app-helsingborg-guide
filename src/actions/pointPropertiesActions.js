import getPointPropertiesByGuide from "../utils/fetchUtils";

import {
  FETCH_POINTPROPERTIES_SUCCESS,
  FETCH_POINTPROPERTIES_REQUEST,
  FETCH_POINTPROPERTIES_FAILURE,
} from "./actionTypes";

export function fetchPointPropertiesRequest(pointproperties) {
  return { type: FETCH_POINTPROPERTIES_REQUEST, pointproperties };
}

export function fetchPointPropertiesSuccess(pointproperties, guideID) {
  return { type: FETCH_POINTPROPERTIES_SUCCESS, pointproperties, guideID };
}

export function fetchPointPropertiesFailure(error) {
  return { type: FETCH_POINTPROPERTIES_FAILURE, error };
}

export function fetchPointProperties(guideID) {
  return function fetchPointPropertiesDispatch(dispatch) {
    dispatch(fetchPointPropertiesRequest());

    return getPointPropertiesByGuide(guideID)
      .then(pointproperties =>
        dispatch(fetchPointPropertiesSuccess(pointproperties, guideID)),
      )
      .catch((error) => {
        dispatch(fetchPointPropertiesFailure(error.message));
      });
  };
}
