// @flow

import { getNavigation, getLanguages } from "../utils/fetchUtils";

export function setLanguage(langCode: string): Action {
  return { type: "SET_LANGUAGE", langCode };
}

export function fetchLanguagesRequest(): Action {
  return { type: "FETCH_LANGUAGES_REQUEST" };
}

export function fetchLanguagesFailure(error: Error): Action {
  return { type: "FETCH_LANGUAGES_FAILURE", error };
}

export function fetchLanguagesSuccess(languages: Language[]): Action {
  return { type: "FETCH_LANGUAGES_SUCCESS", languages };
}

export function fetchAvailableLanguages(): ThunkAction {
  return function fetchNavigationDispatch(dispatch: Dispatch) {
    dispatch(fetchLanguagesRequest());

    return getLanguages()
      .then(guides => dispatch(fetchLanguagesSuccess(guides)))
      .catch((error) => {
        dispatch(fetchLanguagesFailure(error.message));
      });
  };
}

export function setNavigationCategories(categories: NavigationCategory[]): Action {
  return {
    type: "SET_NAVIGATION_CATEGORIES",
    categories,
  };
}

export function fetchNavigationRequest(): Action {
  return { type: "FETCH_NAVIGATION_REQUEST" };
}

export function fetchNavigationSuccess(categories: NavigationCategory[]): Action {
  return { type: "FETCH_NAVIGATION_SUCCESS", categories };
}

export function fetchNavigationFailure(error: Error): Action {
  return { type: "FETCH_NAVIGATION_FAILURE", error };
}

export function fetchNavigation(langCode: string): ThunkAction {
  return function fetchNavigationDispatch(dispatch: Dispatch) {
    dispatch(fetchNavigationRequest());

    return getNavigation(langCode)
      .then(guides => dispatch(fetchNavigationSuccess(guides)))
      .catch((error) => {
        dispatch(fetchNavigationFailure(error.message));
      });
  };
}
