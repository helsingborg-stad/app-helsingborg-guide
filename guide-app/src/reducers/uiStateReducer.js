// @flow

const defaultState: UIState = {
  currentGuideGroup: null,
  currentGuides: [],
  currentContentObject: null,
  currentContentObjectImageIndex: 0,
  currentGuide: null,
  currentImage: null,
  currentCategory: null,
  currentBottomBarTab: 0,
  currentHomeTab: 0,
  developerMode: false,
  showBottomBar: false,
  currentSharingLink: null,
  searchFilter: null,
};

export default function uiStateReducer(
  state: UIState = defaultState,
  action: Action
): UIState {
  switch (action.type) {
    case "SELECT_CURRENT_GUIDEGROUP":
      return {
        ...state,
        currentGuideGroup: action.guideGroup,
        currentGuides: action.guides
      };
    case "SELECT_CURRENT_CONTENTOBJECT":
      return {
        ...state,
        currentContentObject: action.contentObject,
        currentContentObjectImageIndex: 0
      };
    case "SELECT_CURRENT_CONTENTOBJECT_IMAGE":
      return { ...state, currentContentObjectImageIndex: action.swiperIndex };
    case "SELECT_CURRENT_GUIDE":
      return { ...state, currentGuide: action.guide };
    case "SET_DEVELOPER_MODE":
      return { ...state, developerMode: action.enabled };
    case "SELECT_CURRENT_IMAGE":
      return { ...state, currentImage: action.url };
    case "SELECT_CURRENT_CATEGORY":
      return { ...state, currentCategory: action.id };
    case "SELECT_CURRENT_BOTTOM_BAR_TAB":
      return { ...state, currentBottomBarTab: action.tabIndex };
    case "SELECT_CURRENT_HOME_TAB":
      return { ...state, currentHomeTab: action.tabIndex };
    case "SHOW_BOTTOM_BAR":
      return { ...state, showBottomBar: action.visible };
    case "SELECT_CURRENT_SHARING_LINK":
      return { ...state, currentSharingLink: action.link };
    case "SELECT_OPENED_LINK":
      return { ...state, openedLink: action.link };
    case "SET_SEARCH_FILTER":
      let searchFilter = {...state.searchFilter, ...action.searchFilter}
      return { ...state, searchFilter: searchFilter}
    case "CLEAR_SEARCH_FILTER":
      return { ...state, searchFilter: null}
    default:
      return state;
  }
}
