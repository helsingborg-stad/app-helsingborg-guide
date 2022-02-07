import * as types from "./actionTypes";

export default function hasLocation(status) {
  return { type: 'HAS_LOCATION_STATUS', hasLocationStatus: status };
}
