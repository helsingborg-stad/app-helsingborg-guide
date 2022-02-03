// @flow

import fetchUtils from "@utils/fetchUtils";

export function fetchGuidesRequest(): Action {
  return { type: "FETCH_GUIDES_REQUEST" };
}

export function fetchGuidesSuccess(guides: Guide[], forGroups: Boolean): Action {
  return { type: "FETCH_GUIDES_SUCCESS", guides, forGroups };
}

export function fetchGuidesFailure(error: Error): Action {
  return { type: "FETCH_GUIDES_FAILURE", error };
}

export function fetchGuides(langCode: string, ids: number[]): ThunkAction {
  return function fetchGuidesDispatch(dispatch: Dispatch) {
    dispatch(fetchGuidesRequest());

    return fetchUtils
      .getGuides(langCode, ids)
      .then(guides => dispatch(fetchGuidesSuccess(guides, false)))
      .catch(error => {
        dispatch(fetchGuidesFailure(error.message));
      });
  };
}

export function fetchGuidesForGuideGroup(
  langCode: string,
  guideGroupId: number
): ThunkAction {
  return function fetchGuidesDispatch(dispatch: Dispatch) {
    dispatch(fetchGuidesRequest());

    return fetchUtils
      .getGuidesForGuideGroup(langCode, guideGroupId)
      .then(guides => dispatch(fetchGuidesSuccess(guides, true)))
      .catch(error => {
        dispatch(fetchGuidesFailure(error.message));
      });
  };
}
