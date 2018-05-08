// @flow

export default {
  selectCurrentGuideGroup: (id: number): ThunkAction =>
    (dispatch: Dispatch, getState: GetState) => {
      const guideGroup: GuideGroup = Object.assign({}, getState().guideGroups.items.find(item => item.id === id));
      const guides: Guide[] = getState().guides.items.filter(guide => guide.guideGroupId === id);
      const action: Action = { type: "SELECT_CURRENT_GUIDEGROUP", guideGroup, guides };
      dispatch(action);
    },
  selectCurrentObject: (guideID: number, contentObjectID: number): ThunkAction =>
    (dispatch: Dispatch, getState: GetState) => {
      const guide: Guide = Object.assign({}, getState().guides.items.find(item => item.id === guideID));
      const contentObject: ContentObject = Object.assign({}, guide.contentObjects.find(item => item.searchableId === contentObjectID)); // TODO : Change lookup to use actual ID
      const action: Action = { type: "SELECT_CURRENT_CONTENTOBJECT", contentObject };
      dispatch(action);
    }
  ,
};
