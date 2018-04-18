// @flow

import type { ThunkAction } from "redux-thunk";
import type { Dispatch } from "redux";
import type { Error, PointProperty, Action } from "./actionTypes";

import fetchUtils from "../utils/fetchUtils";

export function fetchPointPropertiesRequest(): Action {
  return { type: "FETCH_POINTPROPERTIES_REQUEST" };
}

export function fetchPointPropertiesSuccess(pointProperties: PointProperty[], guideID: number): Action {
  return { type: "FETCH_POINTPROPERTIES_SUCCESS", pointProperties, guideID };
}

export function fetchPointPropertiesFailure(error: Error): Action {
  return { type: "FETCH_POINTPROPERTIES_FAILURE", error };
}

export function fetchPointProperties(guideID: number): ThunkAction {
  return function fetchPointPropertiesDispatch(dispatch: Dispatch) {
    dispatch(fetchPointPropertiesRequest());

    return fetchUtils
      .getPointPropertiesByGuide(guideID)
      .then(pointProperties =>
        dispatch(fetchPointPropertiesSuccess(pointProperties, guideID)),
      )
      .catch((error) => {
        dispatch(fetchPointPropertiesFailure(error.message));
      });
  };
}
