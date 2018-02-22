import * as _ from "lodash";
import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function guideReducer(state = initialState.downloads, action) {
  const replace = () =>
    _.sortBy([...state.filter(item => item.id !== action.taskMeta.id), Object.assign({}, action.taskMeta)], ["startedAt"]);

  switch (action.type) {
    case types.CREATE_DOWNLOAD_TASK_SUCCESS:
      return [...state, Object.assign({}, action.taskMeta)];
    case types.CANCEL_DOWNLOAD_TASK_SUCCESS:
      return replace();
    case types.RESUME_DOWNLOAD_TASK_SUCCESS:
      return replace();
    case types.DOWNLOAD_TASK_PROGRESSED:
      return replace();
    case types.DOWNLOAD_TASK_COMPLETED:
      return replace();
    case types.DOWNLOAD_INFO_CLOSED:
      return replace();
    case types.CLEAR_CACHE_DOWNLOAD_TASK_SUCCESS:
      return [...state.filter(item => item.id !== action.taskMeta.id)];
    default:
      return state;
  }
}
