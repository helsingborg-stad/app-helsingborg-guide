import * as types from "./actionTypes";

export default function hasLocation(status) {
  console.log("action before reducer", status)
  return { type: 'HAS_LOCATION_STATUS', hasLocationStatus: status };
}
