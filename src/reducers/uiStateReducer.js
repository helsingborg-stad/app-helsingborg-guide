// @flow

const defaultState: UIState = {
  currentGuideGroup: null,
  currentGuides: [],
  currentContentObject: null,
  currentGuide: null,
};

export default function uiStateReducer(state: UIState = defaultState, action: Action): UIState {
  switch (action.type) {
    case "SELECT_CURRENT_GUIDEGROUP":
      return { ...state, currentGuideGroup: action.guideGroup, currentGuides: action.guides };
    case "SELECT_CURRENT_CONTENTOBJECT":
      return { ...state, currentContentObject: action.contentObject };
    case "SELECT_CURRENT_GUIDE":
      return { ...state, currentGuide: action.guide };
    default:
      return state;
  }
}
