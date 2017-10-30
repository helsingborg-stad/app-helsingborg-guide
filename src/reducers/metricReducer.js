import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function metricReducer(state = initialState.metrics, action) {
  switch (action.type) {
    case types.UPDATE_METRIC:
      return [...state.filter(item => item.objectKey !== action.metric.objectKey), Object.assign({}, action.metric)];
    default:
      return state;
  }
}
