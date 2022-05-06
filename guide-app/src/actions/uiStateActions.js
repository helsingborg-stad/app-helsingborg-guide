// @flow
export function appStarted(): Action {
  return { type: "APP_STARTED" };
}

export function appBecameActive(): Action {
  return { type: "APP_BECAME_ACTIVE" };
}

export function showBottomBar(visible: boolean): Action {
  return { type: "SHOW_BOTTOM_BAR", visible };
}

export function appBecameInactive(): Action {
  return { type: "APP_BECAME_INACTIVE" };
}

export function fetchAllGuidesForAllGroups(): Action {
  console.log("DO I RUN?? 1")
  return { type: "FETCH_ALL_GUIDES_FOR_ALL_GROUPS" };
}

export function selectCurrentGuideGroup(id: number): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const guideGroup: GuideGroup = Object.assign(
      {},
      getState().guideGroups.items.find(item => item.id === id)
    );
    const guides: Guide[] = getState().guides.items.filter(
      guide => guide.guideGroupId === id
    );
    const action: Action = {
      type: "SELECT_CURRENT_GUIDEGROUP",
      guideGroup,
      guides
    };
    dispatch(action);
  };
}

export function selectCurrentGuide(guide: Guide): Action {
  return { type: "SELECT_CURRENT_GUIDE", guide };
}

export function selectCurrentGuideByID(guideID: number): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const guide: Guide = Object.assign(
      {},
      getState().guides.items.find(item => item.id === guideID)
    );
    const action: Action = { type: "SELECT_CURRENT_GUIDE", guide };
    dispatch(action);
  };
}

export function selectCurrentContentObject(
  contentObject: ContentObject
): Action {
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

export function selectCurrentBottomBarTab(tabIndex: number): Action {
  return { type: "SELECT_CURRENT_BOTTOM_BAR_TAB", tabIndex };
}

export function selectCurrentHomeTab(tabIndex: number): Action {
  return { type: "SELECT_CURRENT_HOME_TAB", tabIndex };
}

export function selectCurrentSharingLink(link: string): Action {
  return { type: "SELECT_CURRENT_SHARING_LINK", link };
}

export function selectOpenedLink(link: string): Action {
  return { type: "SELECT_OPENED_LINK", link };
}

export function setSearchFilter(searchFilter: any): Action {
  return { type: "SET_SEARCH_FILTER", searchFilter };
}

export function clearSearchFilter(): Action {
  return { type: "CLEAR_SEARCH_FILTER" };
}

export function setShowFilterButton(showFilterButton: boolean): Action {
  return { type: "SET_SHOW_FILTER_BUTTON", showFilterButton };
}




