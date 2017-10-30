import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function errorReducer(state = initialState.error, action) {
  switch (action.type) {
    case types.ERROR_HAPPENED:
      return { msg: action.error };
    case types.CLEAR_ERROR:
      return {};
    default:
      return state;
  }
}
