import * as types from "./actionTypes";
import dc from "../data/datacontext";
import { errorHappened } from "./errorActions";

export function createGuide(guide) {
  return { type: types.CREATE_GUIDE, guide };
}
export function updateGuide(guide) {
  return { type: types.UPDATE_GUIDE, guide };
}
export function loadGuidesSuccess(guides) {
  return { type: types.LOAD_GUIDES_SUCCESS, guides };
}

export function loadGuides(langCode) {
  return function loadGuidesDispatch(dispatch) {
    const instance = dc();
    return instance.guide
      .getAllGroups(langCode)
      .then((guides) => {
        if (guides && guides.length && guides.code !== "rest_no_route") {
          dispatch(loadGuidesSuccess(guides));
        } else {
          dispatch(errorHappened("error: no guides"));
        }
      })
      .catch((error) => {
        dispatch(errorHappened(error));
      });
  };
}
