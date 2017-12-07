import dc from "../data/datacontext";
import { FETCH_NAVIGATION_SUCCESS, FETCH_NAVIGATION_REQUEST, FETCH_NAVIGATION_FAILURE } from "./actionTypes";

export function fetchNavigationRequest(navigation) {
  return { type: FETCH_NAVIGATION_REQUEST, navigation };
}

export function fetchNavigationSuccess(navigation) {
  return { type: FETCH_NAVIGATION_SUCCESS, navigation };
}

export function fetchNavigationFailure(error) {
  return { type: FETCH_NAVIGATION_FAILURE, error };
}

export function fetchNavigation(langCode) {
  return function fetchNavigationDispatch(dispatch) {
    dispatch(fetchNavigationRequest());

    const instance = dc();
    return instance.guide.fetchNavigation(langCode)
      .then((navigation) => {
        if (navigation.code) {
          dispatch(fetchNavigationFailure({ error: navigation.message }));
        } else {
          dispatch(fetchNavigationSuccess(navigation));
        }
      });
  };
}
