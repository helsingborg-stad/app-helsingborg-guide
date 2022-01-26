import * as types from "./actionTypes";

export default function internetChanged(status) {
  return { type: types.HAS_LOCATION_STATUS, hasLocationStatus: status };
}
