import * as types from "./actionTypes";

export default function updateMetric(metric) {
  return { type: types.UPDATE_METRIC, metric };
}
