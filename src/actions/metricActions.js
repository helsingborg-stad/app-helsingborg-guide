import * as types from "./actionTypes";

export function updateMetric(metric) {
  return { type: types.UPDATE_METRIC, metric };
}
