// @flow

import { getNavigation } from "@utils/fetchUtils";

export function setLanguage(langCode: string): Action {
  return { type: "SET_LANGUAGE", langCode };
}

export function setNavigationCategories(
  categories: NavigationCategory[]
): Action {
  return {
    type: "SET_NAVIGATION_CATEGORIES",
    categories,
  };
}

export function fetchNavigationRequest(): Action {
  return { type: "FETCH_NAVIGATION_REQUEST" };
}

export function fetchNavigationSuccess(
  categories: NavigationCategory[],
  homeTab
): Action {
  return { type: "FETCH_NAVIGATION_SUCCESS", categories, homeTab };
}

export function fetchNavigationFailure(error: Error): Action {
  return { type: "FETCH_NAVIGATION_FAILURE", error };
}

export function fetchNavigation(langCode: string, homeTab: number): ThunkAction {
  return function fetchNavigationDispatch(dispatch: Dispatch) {
    dispatch(fetchNavigationRequest());
    return getNavigation(langCode)
      .then(guides => {
        dispatch(fetchNavigationSuccess(guides, homeTab));
      })
      .catch(error => {
        dispatch(fetchNavigationFailure(error.message));
      });
  };
}
