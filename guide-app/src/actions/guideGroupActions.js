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

export function fetchGuideGroupsRequest(ids: number[]): Action {
  return { type: "FETCH_GUIDEGROUPS_REQUEST", ids };
}

export function fetchGuideGroupsSuccess(
  guideGroups: GuideGroup[],
  ids
): Action {
  return { type: "FETCH_GUIDEGROUPS_SUCCESS", guideGroups, ids };
}

export function fetchGuideGroupsFailure(error: Error, ids: number[]): Action {
  return { type: "FETCH_GUIDEGROUPS_FAILURE", error, ids };
}

export function fetchGuideGroups(langCode: string, ids: number[]): ThunkAction {
  return function fetchGuideGroupsDispatch(dispatch: Dispatch) {
   dispatch(fetchGuideGroupsRequest(ids));
    return fetchUtils
      .getGuideGroups((langCode || 'sv'), ids)
      .then((guideGroups) => {
        dispatch(fetchGuideGroupsSuccess(guideGroups, ids))
      })
      .catch(error => {
        dispatch(fetchGuideGroupsFailure(error.message, ids));
      });
  };
}
