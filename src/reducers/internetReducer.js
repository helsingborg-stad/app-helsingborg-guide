import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function internetReducer(state = initialState.internet, action) {
  switch (action.type) {
    case types.INTERNET_CHANGED:
      return action.internet;
    default:
      return state;
  }
}
