// @flow

export default {
  selectCurrentGuideGroup: (id: number): ThunkAction =>
    (dispatch: Dispatch, getState: GetState) => {
      const guideGroup: GuideGroup = Object.assign({}, getState().guideGroups.items.find(item => item.id === id));
      const guides: Guide[] = getState().guides.items.filter(guide => guide.guideGroupId === id);
      const action: Action = { type: "SELECT_CURRENT_GUIDEGROUP", guideGroup, guides };
      dispatch(action);
    }
  ,
};
