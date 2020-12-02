// @flow

import fetchUtils from "@utils/fetchUtils";

export function fetchInteractiveGuidesRequest(): Action {
  return { type: "FETCH_INTERACTIVE_GUIDES_REQUEST" };
}

export function fetchInteractiveGuidesSuccess(guides: Guide[]): Action {
  return { type: "FETCH_INTERACTIVE_GUIDES_SUCCESS", guides };
}

export function fetchInteractiveGuidesFailure(error: Error): Action {
  return { type: "FETCH_INTERACTIVE_GUIDES_FAILURE", error };
}

export function fetchInteractiveGuides(
  langCode: string,
  ids: number[]
): ThunkAction {
  return function fetchInteractiveGuidesDispatch(dispatch: Dispatch) {
    dispatch(fetchInteractiveGuidesRequest());

    return fetchUtils
      .getInteractiveGuides(langCode, ids)
      .then(guides => {
        dispatch(fetchInteractiveGuidesSuccess(guides));
      })
      .catch(error => {
        dispatch(fetchInteractiveGuidesFailure(error.message));
      });
  };
}

export function fetchGuidesForGuideGroup(
  langCode: string,
  guideGroupId: number
): ThunkAction {
  return function fetchInteractiveGuidesDispatch(dispatch: Dispatch) {
    dispatch(fetchInteractiveGuidesRequest());

    return fetchUtils
      .getGuidesForGuideGroup(langCode, guideGroupId)
      .then(guides => dispatch(fetchInteractiveGuidesSuccess(guides)))
      .catch(error => {
        dispatch(fetchInteractiveGuidesFailure(error.message));
      });
  };
}
