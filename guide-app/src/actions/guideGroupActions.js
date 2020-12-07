// @flow

import fetchUtils from "@utils/fetchUtils";

export function setGuidesAndGuideGroups(
  guideGroups: GuideGroup[],
  guides: Guide[],
  interactiveGuides: InteractiveGuide[]
): Action {
  return {
    type: "SET_GUIDES_AND_GUIDEGROUPS",
    guideGroups,
    guides,
    interactiveGuides,
  };
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

export function fetchGuideGroups(langCode: string, ids: number[]): ThunkAction {
  return function fetchGuideGroupsDispatch(dispatch: Dispatch) {
    dispatch(fetchGuideGroupsRequest());

    return fetchUtils
      .getGuideGroups(langCode, ids)
      .then(guideGroups => dispatch(fetchGuideGroupsSuccess(guideGroups)))
      .catch(error => {
        dispatch(fetchGuideGroupsFailure(error.message));
      });
  };
}
