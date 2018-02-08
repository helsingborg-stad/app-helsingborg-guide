import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function downloadDataVersionReducer(state = initialState.downloadDataVersion, action) {
  switch (action.type) {
    case types.SET_DOWNLOAD_DATA_VERSION:
      return action.version;
    default:
      return state;
  }
}
