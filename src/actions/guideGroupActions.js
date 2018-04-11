import fetchUtils from "../utils/fetchUtils";

import {
  FETCH_GUIDEGROUPS_SUCCESS,
  FETCH_GUIDEGROUPS_REQUEST,
  FETCH_GUIDEGROUPS_FAILURE,
} from "./actionTypes";

export function fetchGuideGroupsRequest(guideGroups) {
  return { type: FETCH_GUIDEGROUPS_REQUEST, guideGroups };
}

export function fetchGuideGroupsSuccess(guideGroups) {
  return { type: FETCH_GUIDEGROUPS_SUCCESS, guideGroups };
}

export function fetchGuideGroupsFailure(error) {
  return { type: FETCH_GUIDEGROUPS_FAILURE, error };
}

export function fetchGuideGroups(langCode) {
  return function fetchGuideGroupsDispatch(dispatch) {
    dispatch(fetchGuideGroupsRequest());

    return fetchUtils
      .getGuideGroups(langCode)
      .then(guideGroups =>
        dispatch(fetchGuideGroupsSuccess(guideGroups)),
      )
      .catch((error) => {
        dispatch(fetchGuideGroupsFailure(error.message));
      });
  };
}
