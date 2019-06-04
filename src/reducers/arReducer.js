// @flow

import { AR_ARRIVED_DESTINATION } from "../actions/actionTypes";

const defaultState: ARState = {
  destinationMarker: "",
};

export default function arReducer(state: ARState = defaultState, action: Action): ARState {
  switch (action.type) {
    case "SELECT_CURRENT_GUIDE":
      return Object.assign({}, state, { destinationMarker: "" });
    case AR_ARRIVED_DESTINATION: {
      const { destinationMarker } = action;
      return Object.assign({}, state, { destinationMarker });
    }
    default:
      return state;
  }
}
