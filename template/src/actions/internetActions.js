import * as types from "./actionTypes";

export default function internetChanged(connected) {
  return { type: types.INTERNET_CHANGED, internet: { connected } };
}
