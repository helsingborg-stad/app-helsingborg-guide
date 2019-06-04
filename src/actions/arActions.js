// @flow
import { AR_ARRIVED_DESTINATION } from "./actionTypes";

export function arriveAtDestination(destinationMarker: string): Action {
  return { type: AR_ARRIVED_DESTINATION, destinationMarker };
}
