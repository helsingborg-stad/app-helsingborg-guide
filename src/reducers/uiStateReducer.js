// @flow

const defaultState: UIState = {
  currentGuideGroup: null,
  currentGuides: [],
  currentContentObject: null,
  currentContentObjectImageIndex: 0,
  currentGuide: null,
  developerMode: false,
  version: "version 0.xx",
};

export default function uiStateReducer(state: UIState = defaultState, action: Action): UIState {
  switch (action.type) {
    case "SELECT_CURRENT_GUIDEGROUP":
      return { ...state, currentGuideGroup: action.guideGroup, currentGuides: action.guides };
    case "SELECT_CURRENT_CONTENTOBJECT":
      return { ...state, currentContentObject: action.contentObject, currentContentObjectImageIndex: 0 };
    case "SELECT_CURRENT_CONTENTOBJECT_IMAGE":
      return { ...state, currentContentObjectImageIndex: action.swiperIndex };
    case "SELECT_CURRENT_GUIDE":
      return { ...state, currentGuide: action.guide };
    case "SET_DEVELOPER_MODE":
      return { ...state, developerMode: action.enabled };
    case "SET_VERSION":
      return { ...state, version: action.version };
    default:
      return state;
  }
}
