import dc from "../data/datacontext";
import { FETCH_GUIDE_TYPES_SUCCESS, FETCH_GUIDE_TYPES_REQUEST, FETCH_GUIDE_TYPES_FAILURE } from "./actionTypes";

export function fetchGuideTypesRequest(guideTypes) {
  return { type: FETCH_GUIDE_TYPES_REQUEST, guideTypes };
}

export function fetchGuideTypesSuccess(guideTypes) {
  return { type: FETCH_GUIDE_TYPES_SUCCESS, guideTypes };
}

export function fetchGuideTypesFailure(error) {
  return { type: FETCH_GUIDE_TYPES_FAILURE, error };
}

export function fetchGuideTypes() {
  return function fetchGuideTypesDispatch(dispatch) {
    dispatch(fetchGuideTypesRequest());

    const instance = dc();
    return instance.guidetype.getGuideTypes()
      .then((guideTypes) => {
        console.log(guideTypes);
        dispatch(fetchGuideTypesSuccess(guideTypes));
      });
  };
}
