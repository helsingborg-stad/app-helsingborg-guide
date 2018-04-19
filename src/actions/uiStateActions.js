// @flow

import type { Action, Dispatch, GetState, GuideGroup, ThunkAction } from "./actionTypes";

export default {
  selectCurrentGuideGroup: (id: number): ThunkAction =>
    (dispatch: Dispatch, getState: GetState) => {
      const guideGroup: GuideGroup = Object.assign({}, getState().guideGroups.items.find(item => item.id === id));
      const action: Action = { type: "SELECT_CURRENT_GUIDEGROUP", guideGroup };
      dispatch(action);
    }
  ,
};
