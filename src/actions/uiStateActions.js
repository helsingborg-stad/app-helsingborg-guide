// @flow

export function selectCurrentGuideGroup(id: number): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const guideGroup: GuideGroup = Object.assign({}, getState().guideGroups.items.find(item => item.id === id));
    const guides: Guide[] = getState().guides.items.filter(guide => guide.guideGroupId === id);
    const action: Action = { type: "SELECT_CURRENT_GUIDEGROUP", guideGroup, guides };
    dispatch(action);
  };
}

export function selectCurrentGuide(guide: Guide): Action {
  return { type: "SELECT_CURRENT_GUIDE", guide };
}

export function selectCurrentContentObject(contentObject: ContentObject): Action {
  return { type: "SELECT_CURRENT_CONTENTOBJECT", contentObject };
}
