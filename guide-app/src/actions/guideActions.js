// @flow

import fetchUtils from "@utils/fetchUtils";
import { fetchInteractiveGuidesFailure } from "./interactiveGuideActions";

export function fetchAllGuidesForAllGroupsRequest(): Action {
  return { type: "FETCH_ALL_GUIDES_FOR_ALL_GROUPS_REQUEST" };
}

export function fetchAllGuidesForAllGroupsSuccess(all: []): Action {
  return { type: "FETCH_ALL_GUIDES_FOR_ALL_GROUPS_SUCCESS", all };
}

export function fetchGuidesRequest(): Action {
  return { type: "FETCH_GUIDES_REQUEST" };
}

export function fetchGuidesSuccess(guides: Guide[], forGroups: Boolean): Action {
  return { type: "FETCH_GUIDES_SUCCESS", guides, forGroups };
}

export function fetchGuidesFailure(error: Error): Action {
  return { type: "FETCH_GUIDES_FAILURE", error };
}

export function fetchAllGuidesForAllGroups(langCode: string, ids: []): ThunkAction {
  return async function fetchAllGuidesForAllGroupsDispatch(dispatch: Dispatch) {
    let all = { guideGroups: [], guides: [], interactiveGuides: [] };
    dispatch(fetchAllGuidesForAllGroupsRequest());

    const _groups = ids.guideGroups.map(async (item) => {
      return await fetchUtils
        .getGuidesForGuideGroup(langCode, item.id)
        .then(guides => {
          return { guideAmount: guides.length, parentID: item.id, items: guides };
        })
        .catch(error => {
          dispatch(fetchGuidesFailure(error.message));
          return [];
        });
    });

    const _guides = async () => {
      return fetchUtils
        .getGuides(langCode, ids.guides)
        .then(guides => {
          let arr = [];
          guides.map(guide => arr.push({
            guideAmount: guide?.contentObjects?.length,
            parentID: guide?.id,
            items: guide?.contentObjects
          }));
          return arr;
        })
        .catch(error => {
          dispatch(fetchGuidesFailure(error.message));
          return [];
        });
    };

    const _interactiveGuides = async () => {
      return fetchUtils
        .getInteractiveGuides(langCode, ids.interactiveGuides)
        .then(guides => {
          let arr = [];
          guides.map(guide => arr.push({
            guideAmount: guide?.steps?.length ,
            parentID: guide?.id
          }));
          return arr;
        })
        .catch(error => {
          dispatch(fetchInteractiveGuidesFailure(error.message));
          return [];
        });
    };


    all.guideGroups = await Promise.all(_groups);
    all.guides = await _guides();
    all.interactiveGuides = await _interactiveGuides();
    dispatch(fetchAllGuidesForAllGroupsSuccess(all));
  };
}


export function fetchGuides(langCode: string, ids: number[]): ThunkAction {
  return function fetchGuidesDispatch(dispatch: Dispatch) {
    dispatch(fetchGuidesRequest());
    return fetchUtils
      .getGuides(langCode, ids)
      .then(guides => {
        dispatch(fetchGuidesSuccess(guides, false));
      })
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
