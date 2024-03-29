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
  searchFilter: { distance: '', text: '', forChildren: '' },
  allGuides: [],
  showFilterButton: false,
  showHomeSettings: false,
  settingsHeight: false,
};

export default function uiStateReducer(
  state: UIState = defaultState,
  action: Action
): UIState {
  switch (action.type) {
    case "FETCH_ALL_GUIDES_FOR_ALL_GROUPS":
      return { ...state, allGuides: action.allGuides };
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
      console.log("CURRENT__SHARING__LINK", action.link);
      return { ...state, currentSharingLink: action.link };
    case "SELECT_OPENED_LINK":
      return { ...state, openedLink: action.link };
    case "SET_SEARCH_FILTER":
      let searchFilter = { ...state.searchFilter, ...action.searchFilter };
      return { ...state, searchFilter: searchFilter };
    case "SET_SHOW_FILTER_BUTTON":
      return { ...state, showFilterButton: action.showFilterButton };
    case "SET_SHOW_HOME_SETTINGS":
      return { ...state, showHomeSettings: action.showHomeSettings };
    case "SET_SETTINGS_HEIGHT":
      return { ...state, settingsHeight: action.settingsHeight };
    default:
      return state;
  }
}
