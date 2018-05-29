// @flow

import { getNavigation } from "../utils/fetchUtils";

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
