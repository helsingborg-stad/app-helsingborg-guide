import * as types from "./actionTypes";

export function errorHappened(error) {
  return { type: types.ERROR_HAPPENED, error };
}

export function clearError() {
  return { type: types.CLEAR_ERROR };
}
