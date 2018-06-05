// @flow

import { getGuideGroups } from "../utils/fetchUtils";

export function setGuideGroups(guideGroups: GuideGroup[]): Action {
  return { type: "SET_GUIDEGROUPS", guideGroups };
}

export function fetchGuideGroupsRequest(): Action {
  return { type: "FETCH_GUIDEGROUPS_REQUEST" };
}

export function fetchGuideGroupsSuccess(guideGroups: GuideGroup[]): Action {
  return { type: "FETCH_GUIDEGROUPS_SUCCESS", guideGroups };
}

export function fetchGuideGroupsFailure(error: Error): Action {
  return { type: "FETCH_GUIDEGROUPS_FAILURE", error };
}

export function fetchGuideGroups(langCode: string): ThunkAction {
  return function fetchGuideGroupsDispatch(dispatch: Dispatch) {
    dispatch(fetchGuideGroupsRequest());

    return getGuideGroups(langCode)
      .then(guideGroups => dispatch(fetchGuideGroupsSuccess(guideGroups)))
      .catch((error) => {
        dispatch(fetchGuideGroupsFailure(error.message));
      });
  };
}
