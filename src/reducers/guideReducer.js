import * as types from "../actions/actionTypes";

import initialState from "./initialState";

export default function guideReducer(state = initialState.guides, action) {
  switch (action.type) {
    case types.CREATE_GUIDE:
      return [...state, Object.assign({}, action.guide)];
    case types.UPDATE_GUIDE:
      return [...state.filter(guide => guide.id !== action.guide.id), Object.assign({}, action.guide)];
    case types.LOAD_GUIDES_SUCCESS:
      return action.guides;
    default:
      return state;
  }
}
