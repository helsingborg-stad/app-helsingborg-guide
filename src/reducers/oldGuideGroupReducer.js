import * as types from "../actions/actionTypes";

import initialState from "./initialState";

export default function oldGuideGroupReducer(state = initialState.oldGuideGroups, action) {
  switch (action.type) {
    case types.CREATE_GUIDE:
      return [...state, Object.assign({}, action.guide, { contentType: "location" })];
    case types.UPDATE_GUIDE:
      return [...state.filter(guide => guide.id !== action.guide.id), Object.assign({}, action.guide)];
    case types.LOAD_GUIDES_SUCCESS:
      return action.guides.map(element => Object.assign(element, { contentType: "location" }));
    default:
      return state;
  }
}
