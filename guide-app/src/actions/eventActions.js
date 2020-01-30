// @flow

import fetchUtils from "@utils/fetchUtils";

export function fetchEventsRequest(): Action {
  return { type: "FETCH_EVENTS_REQUEST" };
}

export function fetchEventsSuccess(events: Event[]): Action {
  return { type: "FETCH_EVENTS_SUCCESS", events };
}

export function fetchEventsFailure(error: Error): Action {
  return { type: "FETCH_EVENTS_FAILURE", error };
}

export function fetchEvents(
  langCode: string,
  dateStart: Date,
  dateEnd: Date
): ThunkAction {
  return function fetchEventsDispatch(dispatch: Dispatch) {
    dispatch(fetchEventsRequest());

    return fetchUtils
      .getEvents(langCode, dateStart, dateEnd)
      .then(events => dispatch(fetchEventsSuccess(events)))
      .catch(error => {
        dispatch(fetchEventsFailure(error.message));
      });
  };
}
