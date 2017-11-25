import * as types from "./actionTypes";
import dc from "../data/datacontext";

export function loadGuidesSuccess(guideTypes) {
  return { type: types.LOAD_GUIDE_TYPE_SUCCESS, guideTypes };
}

export function loadGuideTypes() {
  return function loadGuideTypesDispatch(dispatch) {
    const instance = dc();
    return instance.guidetype.getGuideTypes()
      .then(guideTypes => dispatch(loadGuidesSuccess(guideTypes)));
  };
}
