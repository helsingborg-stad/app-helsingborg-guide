// @flow
export function appStarted(): Action {
  return { type: "APP_STARTED" };
}

export function appBecameActive(): Action {
  return { type: "APP_BECAME_ACTIVE" };
}

export function appBecameInactive(): Action {
  return { type: "APP_BECAME_INACTIVE" };
}

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

export function selectCurrentGuideByID(guideID: number): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const guide: Guide = Object.assign({}, getState().guides.items.find(item => item.id === guideID));
    const action: Action = { type: "SELECT_CURRENT_GUIDE", guide };
    dispatch(action);
  };
}

export function selectCurrentContentObject(contentObject: ContentObject): Action {
  return { type: "SELECT_CURRENT_CONTENTOBJECT", contentObject };
}

export function selectCurrentContentObjectImage(swiperIndex: number): Action {
  return { type: "SELECT_CURRENT_CONTENTOBJECT_IMAGE", swiperIndex };
}

export function selectCurrentImage(url: ?string): Action {
  return { type: "SELECT_CURRENT_IMAGE", url };
}

export function selectCurrentCategory(id: number): Action {
  return { type: "SELECT_CURRENT_CATEGORY", id };
}

export function setDeveloperMode(enabled: boolean): Action {
  return { type: "SET_DEVELOPER_MODE", enabled };
}
